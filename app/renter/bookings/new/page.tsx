"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";
import PricingSummary from "@/components/PricingSummary";
import ConfirmDialog from "@/components/ConfirmDialog";
import { carModels, locations, pricingTiers } from "@/lib/mock-data";
import { formatBaht } from "@/lib/utils";
import { useToast } from "@/components/Toast";

const STEPS = ["Model", "Duration", "Dates", "Location", "Contract", "Add-ons", "Summary", "Confirm"];

export default function NewBookingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-secondary">Loading...</div>}>
      <NewBookingContent />
    </Suspense>
  );
}

function NewBookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [form, setForm] = useState({
    modelId: searchParams.get("model") || "",
    durationType: "Monthly",
    startDate: "",
    endDate: "",
    pickupLocationId: "",
    returnLocationId: "",
    contractType: "Rent-and-Return",
    portableCharger: false,
    childSeat: false,
    extraInsurance: false,
  });

  useEffect(() => {
    if (searchParams.get("model")) setStep(1);
  }, [searchParams]);

  const selectedModel = carModels.find((m) => m.id === form.modelId);
  const pricing = pricingTiers.find((p) => p.modelId === form.modelId);

  function getBaseRate() {
    if (!pricing) return 0;
    const map: Record<string, number> = {
      "Daily": pricing.daily1, "Weekly": pricing.weekly,
      "Monthly": pricing.monthly, "Yearly": pricing.yearly, "Rent-to-Sell": pricing.rentToSell,
    };
    return map[form.durationType] || pricing.daily1;
  }

  const baseRate = getBaseRate();
  const addOnTotal = (form.portableCharger ? (pricing?.addonCharger || 0) * 30 : 0) +
    (form.childSeat ? (pricing?.addonChildSeat || 0) * 30 : 0) +
    (form.extraInsurance ? (pricing?.addonInsurance || 0) * 30 : 0);
  const deposit = pricing?.deposit || 0;
  const vat = Math.round((baseRate + addOnTotal) * 0.07);
  const total = baseRate + addOnTotal + deposit + vat;

  function submit() {
    toast("success", "Booking request submitted! Awaiting manager approval.");
    router.push("/renter/bookings");
  }

  function canNext() {
    if (step === 0) return !!form.modelId;
    if (step === 1) return !!form.durationType;
    if (step === 2) return !!form.startDate && !!form.endDate;
    if (step === 3) return !!form.pickupLocationId && !!form.returnLocationId;
    return true;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-primary">Create Rental Request</h1>
        <p className="text-sm text-secondary mt-0.5">Step {step + 1} of {STEPS.length}</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-0 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              i < step ? "text-green-600" : i === step ? "bg-black text-white" : "text-gray-400"
            }`}>
              {i < step ? <Check size={11} /> : <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">{i + 1}</span>}
              {s}
            </div>
            {i < STEPS.length - 1 && <ChevronRight size={14} className="text-gray-300 shrink-0" />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 min-h-64">
        {/* Step 0: Select Model */}
        {step === 0 && (
          <div>
            <h2 className="text-base font-semibold mb-4">Select a Vehicle Model</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {carModels.map((m) => (
                <button key={m.id} onClick={() => setForm({ ...form, modelId: m.id })}
                  className={`flex items-center gap-3 border rounded-xl p-4 text-left transition-colors ${form.modelId === m.id ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl font-bold text-gray-300">{m.brandName[0]}</div>
                  <div>
                    <p className="font-medium text-primary">{m.brandName} {m.name}</p>
                    <p className="text-xs text-secondary">{m.year} · from {formatBaht(m.priceFrom)}/day</p>
                  </div>
                  {form.modelId === m.id && <Check size={16} className="ml-auto text-black" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Duration */}
        {step === 1 && (
          <div>
            <h2 className="text-base font-semibold mb-4">Choose Duration Type</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {["Daily", "Weekly", "Monthly", "Yearly", "Rent-to-Sell"].map((d) => (
                <button key={d} onClick={() => setForm({ ...form, durationType: d })}
                  className={`border rounded-xl p-4 text-left transition-colors ${form.durationType === d ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}>
                  <p className="font-medium text-primary">{d}</p>
                  {pricing && (
                    <p className="text-xs text-secondary mt-0.5">
                      {formatBaht({ Daily: pricing.daily1, Weekly: pricing.weekly, Monthly: pricing.monthly, Yearly: pricing.yearly, "Rent-to-Sell": pricing.rentToSell }[d] || 0)}
                    </p>
                  )}
                  {form.durationType === d && <Check size={14} className="mt-1 text-black" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Dates */}
        {step === 2 && (
          <div>
            <h2 className="text-base font-semibold mb-4">Set Rental Dates</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-secondary block mb-1">Start Date *</label>
                <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  min="2026-05-15" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-secondary block mb-1">End Date *</label>
                <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  min={form.startDate || "2026-05-15"} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Locations */}
        {step === 3 && (
          <div>
            <h2 className="text-base font-semibold mb-4">Select Locations</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-secondary block mb-1">Pick-up Location *</label>
                <select value={form.pickupLocationId} onChange={(e) => setForm({ ...form, pickupLocationId: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                  <option value="">Select location</option>
                  {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
                {form.pickupLocationId && <p className="text-xs text-secondary mt-1">{locations.find((l) => l.id === form.pickupLocationId)?.address}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-secondary block mb-1">Return Location *</label>
                <select value={form.returnLocationId} onChange={(e) => setForm({ ...form, returnLocationId: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                  <option value="">Select location</option>
                  {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Contract Type */}
        {step === 4 && (
          <div>
            <h2 className="text-base font-semibold mb-4">Choose Contract Type</h2>
            <div className="flex flex-col gap-3">
              {[
                { v: "Rent-and-Return", desc: "Standard rental with vehicle return at end of contract." },
                { v: "Rent-to-Sell", desc: "Rental payments accumulate toward eventual vehicle purchase." },
              ].map(({ v, desc }) => (
                <button key={v} onClick={() => setForm({ ...form, contractType: v })}
                  className={`flex items-start gap-3 border rounded-xl p-4 text-left transition-colors ${form.contractType === v ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}>
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${form.contractType === v ? "border-black" : "border-gray-300"}`}>
                    {form.contractType === v && <div className="w-2 h-2 rounded-full bg-black" />}
                  </div>
                  <div>
                    <p className="font-medium text-primary">{v}</p>
                    <p className="text-xs text-secondary mt-0.5">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Add-ons */}
        {step === 5 && (
          <div>
            <h2 className="text-base font-semibold mb-4">Select Add-ons</h2>
            <div className="flex flex-col gap-3">
              {[
                { key: "portableCharger", label: "Portable Charger", price: pricing?.addonCharger || 200, desc: "Take charging anywhere" },
                { key: "childSeat", label: "Child Seat", price: pricing?.addonChildSeat || 150, desc: "Safety approved child restraint" },
                { key: "extraInsurance", label: "Extra Insurance", price: pricing?.addonInsurance || 400, desc: "Comprehensive coverage upgrade" },
              ].map(({ key, label, price, desc }) => (
                <button key={key}
                  onClick={() => setForm({ ...form, [key]: !form[key as keyof typeof form] })}
                  className={`flex items-center gap-4 border rounded-xl p-4 text-left transition-colors ${(form as Record<string, boolean | string>)[key] ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${(form as Record<string, boolean | string>)[key] ? "bg-black border-black" : "border-gray-300"}`}>
                    {(form as Record<string, boolean | string>)[key] && <Check size={11} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-primary">{label}</p>
                    <p className="text-xs text-secondary">{desc}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatBaht(price)}/day</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Summary */}
        {step === 6 && (
          <div>
            <h2 className="text-base font-semibold mb-4">Pricing Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-secondary">Model</span>
                  <span className="font-medium">{selectedModel?.brandName} {selectedModel?.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-secondary">Duration</span>
                  <span className="font-medium">{form.durationType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-secondary">Contract</span>
                  <span className="font-medium">{form.contractType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-secondary">Pick-up</span>
                  <span className="font-medium">{locations.find((l) => l.id === form.pickupLocationId)?.name || "—"}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-secondary">Return</span>
                  <span className="font-medium">{locations.find((l) => l.id === form.returnLocationId)?.name || "—"}</span>
                </div>
              </div>
              <PricingSummary baseRate={baseRate} addOnTotal={addOnTotal} deposit={deposit} vat={vat} total={total} durationType={form.durationType} />
            </div>
          </div>
        )}

        {/* Step 7: Submit */}
        {step === 7 && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-black" />
            </div>
            <h2 className="text-base font-semibold mb-2">Ready to Submit</h2>
            <p className="text-sm text-secondary max-w-xs mx-auto">
              Your rental request will be sent for manager approval. You will be notified once reviewed.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
          className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}
            className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Continue
          </button>
        ) : (
          <button onClick={() => setConfirmOpen(true)}
            className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            Submit Request
          </button>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={submit}
        title="Submit Rental Request"
        message="This will submit your rental request for approval. You will receive a notification once it has been reviewed."
        confirmLabel="Submit"
      />
    </div>
  );
}
