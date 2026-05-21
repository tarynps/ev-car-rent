"use client";

import { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronRight, Minus, Plus, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { carModels, locations, pricingTiers } from "@/lib/mock-data";
import { formatBaht } from "@/lib/utils";
import { useToast } from "@/components/Toast";

const STEPS = ["Vehicles", "Dates", "Locations", "Contract", "Review", "Submit"];

const modelMeta: Record<string, { carType: string; wheelCategory: string }> = {
  m1: { carType: "Light truck", wheelCategory: "6-wheel" },
  m2: { carType: "Pickup", wheelCategory: "Pickup" },
  m3: { carType: "Passenger van", wheelCategory: "Van" },
  m4: { carType: "Cargo van", wheelCategory: "Van" },
  m5: { carType: "Box truck", wheelCategory: "10-wheel" },
  m6: { carType: "Dump truck", wheelCategory: "10-wheel" },
  m7: { carType: "Road sweeper", wheelCategory: "10-wheel" },
  m8: { carType: "Wrecker", wheelCategory: "10-wheel" },
  m9: { carType: "Refrigerated truck", wheelCategory: "10-wheel" },
  m10: { carType: "Sewage truck", wheelCategory: "10-wheel" },
  m11: { carType: "Prime mover", wheelCategory: "Prime Mover" },
  m12: { carType: "Medium truck", wheelCategory: "8-wheel" },
  m13: { carType: "Heavy truck", wheelCategory: "10-wheel" },
  m14: { carType: "Heavy hauler", wheelCategory: "Prime Mover" },
  m15: { carType: "Special purpose", wheelCategory: "10-wheel" },
};

type RequestLine = {
  id: string;
  modelId: string;
  quantity: number;
};

function getDisplayName(model: (typeof carModels)[number]) {
  return model.bodyType ? `${model.name} (${model.bodyType})` : model.name;
}

function getMonthlyRate(modelId: string) {
  return pricingTiers.find((tier) => tier.modelId === modelId)?.monthly ?? carModels.find((model) => model.id === modelId)?.priceFrom ?? 0;
}

export default function NewRequestPage() {
  return (
    <Suspense fallback={<div className="p-8 text-secondary">Loading...</div>}>
      <NewRequestContent />
    </Suspense>
  );
}

function NewRequestContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const initialModelId = searchParams.get("model") || carModels[0]?.id || "";
  const [step, setStep] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [lines, setLines] = useState<RequestLine[]>([
    { id: "line-1", modelId: initialModelId, quantity: 1 },
  ]);
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    pickupLocationId: "",
    returnLocationId: "",
    contractType: "Rent-and-Return",
  });

  const pricing = useMemo(() => {
    const base = lines.reduce((sum, line) => sum + getMonthlyRate(line.modelId) * line.quantity, 0);
    const deposit = lines.reduce((sum, line) => {
      const tier = pricingTiers.find((candidate) => candidate.modelId === line.modelId);
      return sum + (tier?.deposit ?? 0) * line.quantity;
    }, 0);
    const vat = Math.round(base * 0.07);
    return { base, deposit, vat, total: base + deposit + vat };
  }, [lines]);

  function updateLine(id: string, next: Partial<RequestLine>) {
    setLines((current) => current.map((line) => line.id === id ? { ...line, ...next } : line));
  }

  function addLine() {
    const unusedModel = carModels.find((model) => !lines.some((line) => line.modelId === model.id));
    setLines((current) => [
      ...current,
      { id: `line-${Date.now()}`, modelId: unusedModel?.id ?? carModels[0].id, quantity: 1 },
    ]);
  }

  function removeLine(id: string) {
    setLines((current) => current.length === 1 ? current : current.filter((line) => line.id !== id));
  }

  function canNext() {
    if (step === 0) return lines.every((line) => line.modelId && line.quantity > 0);
    if (step === 1) return !!form.startDate && !!form.endDate;
    if (step === 2) return !!form.pickupLocationId && !!form.returnLocationId;
    return true;
  }

  function submit() {
    toast("success", "Contract request submitted. Awaiting renter manager and admin approval.");
    router.push("/renter/fleet");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-tertiary">Renter contract request</p>
          <h1 className="text-xl font-semibold text-primary mt-1">New Contract Request</h1>
          <p className="text-sm text-secondary mt-0.5">Add multiple car models and quantities, then submit for approval.</p>
        </div>
        <div className="rounded-lg bg-surface border border-gray-100 px-4 py-2 text-sm">
          <span className="text-secondary">Requester:</span> <span className="font-medium text-primary">Siam Motors Group</span>
        </div>
      </div>

      <div className="flex items-center gap-0 overflow-x-auto pb-1">
        {STEPS.map((label, index) => (
          <div key={label} className="flex items-center">
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              index < step ? "text-green-600" : index === step ? "bg-tertiary text-white" : "text-gray-400"
            }`}>
              {index < step ? <Check size={11} /> : <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">{index + 1}</span>}
              {label}
            </div>
            {index < STEPS.length - 1 && <ChevronRight size={14} className="text-gray-300 shrink-0" />}
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-xl border border-gray-100 shadow-sm p-6 min-h-80">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-primary">Vehicle Types and Quantities</h2>
                <p className="text-sm text-secondary mt-0.5">Request one or more model rows, each with its own quantity.</p>
              </div>
              <button onClick={addLine} className="inline-flex items-center gap-1.5 bg-tertiary text-white text-sm px-3 py-2 rounded-lg hover:bg-tertiary-dark transition-colors">
                <Plus size={14} /> Add model
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {lines.map((line, index) => {
                const model = carModels.find((candidate) => candidate.id === line.modelId);
                const meta = model ? modelMeta[model.id] : undefined;
                const photo = model?.photos[0];

                return (
                  <div key={line.id} className="grid grid-cols-1 lg:grid-cols-[1fr_160px_auto] gap-3 border border-gray-100 rounded-xl p-4">
                    <div className="flex gap-3">
                      <div className="relative w-20 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                        {photo ? (
                          <Image src={photo} alt={model ? `${model.brandName} ${getDisplayName(model)}` : ""} fill sizes="80px" className="object-contain p-2" />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center text-xl font-semibold text-gray-300">J</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-medium text-secondary block mb-1">Car model {index + 1}</label>
                        <select
                          value={line.modelId}
                          onChange={(event) => updateLine(line.id, { modelId: event.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                        >
                          {carModels.map((candidate) => (
                            <option key={candidate.id} value={candidate.id}>{candidate.brandName} {getDisplayName(candidate)}</option>
                          ))}
                        </select>
                        {model && (
                          <p className="text-xs text-secondary mt-1">{meta?.carType} · {meta?.wheelCategory} · {formatBaht(getMonthlyRate(model.id))}/mo</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-secondary block mb-1">Quantity</label>
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden w-fit">
                        <button
                          onClick={() => updateLine(line.id, { quantity: Math.max(1, line.quantity - 1) })}
                          className="p-2 text-secondary hover:text-primary hover:bg-gray-50"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={line.quantity}
                          onChange={(event) => updateLine(line.id, { quantity: Math.max(1, Number(event.target.value) || 1) })}
                          className="w-14 text-center text-sm py-2 outline-none"
                        />
                        <button
                          onClick={() => updateLine(line.id, { quantity: line.quantity + 1 })}
                          className="p-2 text-secondary hover:text-primary hover:bg-gray-50"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="flex lg:items-end">
                      <button
                        onClick={() => removeLine(line.id)}
                        disabled={lines.length === 1}
                        className="inline-flex items-center gap-1.5 text-sm text-secondary hover:text-tertiary disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-base font-semibold text-primary mb-4">Set Contract Duration</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-secondary block mb-1">Start date *</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(event) => setForm({ ...form, startDate: event.target.value })}
                  min="2026-05-20"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-secondary block mb-1">End date *</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(event) => setForm({ ...form, endDate: event.target.value })}
                  min={form.startDate || "2026-05-20"}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
            <p className="text-xs text-secondary mt-3">Commercial fleet contracts use monthly and longer terms. Pricing below estimates the first monthly billing cycle.</p>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-base font-semibold text-primary mb-4">Pick-up and Return Locations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-secondary block mb-1">Pick-up location *</label>
                <select
                  value={form.pickupLocationId}
                  onChange={(event) => setForm({ ...form, pickupLocationId: event.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="">Select location</option>
                  {locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
                </select>
                {form.pickupLocationId && <p className="text-xs text-secondary mt-1">{locations.find((location) => location.id === form.pickupLocationId)?.address}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-secondary block mb-1">Return location *</label>
                <select
                  value={form.returnLocationId}
                  onChange={(event) => setForm({ ...form, returnLocationId: event.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="">Select location</option>
                  {locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-base font-semibold text-primary mb-4">Choose Contract Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { value: "Rent-and-Return", label: "Rent-and-Return", description: "Standard fleet rental with return at contract end." },
                { value: "Rent-with-Purchase-Option", label: "Rent-with-Purchase-Option", description: "Rental with purchase offer eligibility after admin review." },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setForm({ ...form, contractType: option.value })}
                  className={`flex items-start gap-3 border rounded-xl p-4 text-left transition-colors ${form.contractType === option.value ? "border-tertiary bg-tertiary-tint" : "border-gray-200 hover:border-gray-400"}`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${form.contractType === option.value ? "border-tertiary" : "border-gray-300"}`}>
                    {form.contractType === option.value && <div className="w-2 h-2 rounded-full bg-tertiary" />}
                  </div>
                  <div>
                    <p className="font-medium text-primary">{option.label}</p>
                    <p className="text-xs text-secondary mt-0.5">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-base font-semibold text-primary mb-4">Review Vehicle Request</h2>
              <div className="flex flex-col gap-2">
                {lines.map((line) => {
                  const model = carModels.find((candidate) => candidate.id === line.modelId);
                  if (!model) return null;
                  const monthly = getMonthlyRate(model.id);
                  return (
                    <div key={line.id} className="flex justify-between gap-4 rounded-lg border border-gray-100 p-3">
                      <div>
                        <p className="text-sm font-medium text-primary">{model.brandName} {getDisplayName(model)}</p>
                        <p className="text-xs text-secondary">{modelMeta[model.id]?.wheelCategory} · Qty {line.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-primary">{formatBaht(monthly * line.quantity)}/mo</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-neutral p-5">
              <h3 className="text-sm font-semibold text-primary">Pricing Summary</h3>
              <div className="mt-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between"><span className="text-secondary">Monthly base</span><span className="font-medium">{formatBaht(pricing.base)}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Deposit</span><span className="font-medium">{formatBaht(pricing.deposit)}</span></div>
                <div className="flex justify-between"><span className="text-secondary">VAT 7%</span><span className="font-medium">{formatBaht(pricing.vat)}</span></div>
                <div className="flex justify-between border-t border-gray-200 pt-3 mt-2"><span className="font-semibold text-primary">Estimated due</span><span className="font-semibold text-tertiary">{formatBaht(pricing.total)}</span></div>
              </div>
              <div className="mt-4 text-xs text-secondary">
                <p>Contract type: {form.contractType}</p>
                <p>Dates: {form.startDate || "—"} to {form.endDate || "—"}</p>
                <p>Pick-up: {locations.find((location) => location.id === form.pickupLocationId)?.name || "—"}</p>
                <p>Return: {locations.find((location) => location.id === form.returnLocationId)?.name || "—"}</p>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-tertiary-tint rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-tertiary" />
            </div>
            <h2 className="text-base font-semibold text-primary mb-2">Ready to Submit</h2>
            <p className="text-sm text-secondary max-w-md mx-auto">
              This sends the request to your renter-side manager workflow and then to fleet admin for confirmation.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep((current) => Math.max(0, current - 1))}
          disabled={step === 0}
          className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((current) => current + 1)}
            disabled={!canNext()}
            className="px-4 py-2 text-sm bg-tertiary text-white rounded-lg hover:bg-tertiary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={() => setConfirmOpen(true)}
            className="px-4 py-2 text-sm bg-tertiary text-white rounded-lg hover:bg-tertiary-dark transition-colors"
          >
            Submit Request
          </button>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={submit}
        title="Submit Contract Request"
        message="This will submit the multi-model request for renter manager and fleet admin approval."
        confirmLabel="Submit"
      />
    </div>
  );
}
