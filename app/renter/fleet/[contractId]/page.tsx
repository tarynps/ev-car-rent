"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, CalendarPlus, AlertTriangle, Check, Clock, TrendingUp } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import { fleetContracts } from "@/lib/mock-data";
import { formatBaht, formatDate } from "@/lib/utils";
import { useToast } from "@/components/Toast";
import { notFound } from "next/navigation";
import type { FleetContract } from "@/lib/types";

export default function ContractDetailPage({ params }: { params: Promise<{ contractId: string }> }) {
  const { contractId } = use(params);
  const contract = fleetContracts.find((c) => c.id === contractId);
  if (!contract) return notFound();

  return <ContractDetail contract={contract} />;
}

function ContractDetail({ contract }: { contract: FleetContract }) {
  const { toast } = useToast();
  const [extendOpen, setExtendOpen] = useState(false);
  const [newReturnDate, setNewReturnDate] = useState("");

  const stepColors = {
    done: "bg-green-500 border-green-500 text-white",
    current: "bg-blue-600 border-blue-600 text-white",
    pending: "bg-white border-gray-300 text-gray-400",
    rejected: "bg-red-500 border-red-500 text-white",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/renter/fleet" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-semibold text-gray-900">{contract.id}</h1>
            <StatusBadge status={contract.status} />
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{contract.contractType}</span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">Created {formatDate(contract.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => toast("info", "Downloading contract PDF…")}
            className="flex items-center gap-1.5 text-sm border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={14} /> Contract
          </button>
          <button onClick={() => toast("info", "Downloading invoice PDF…")}
            className="flex items-center gap-1.5 text-sm border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={14} /> Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: vehicles + pricing */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Vehicles in contract */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Vehicles in Contract</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {contract.vehicles.map((v) => (
                <div key={v.carId} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {v.photo ? (
                      <img src={v.photo} alt={`${v.brandName} ${v.modelName}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-300">{v.brandName[0]}</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{v.brandName} {v.modelName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{v.licensePlate}</p>
                  </div>
                  <Link href={`/renter/telematics/${v.carId}`}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                    View Telematics
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Contract details */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Contract Details</h2>
            </div>
            <div className="grid grid-cols-2 gap-0 divide-y divide-gray-50">
              {[
                { label: "Start Date", value: formatDate(contract.startDate) },
                { label: "End Date", value: formatDate(contract.endDate) },
                { label: "Pick-up", value: contract.pickupLocationName },
                { label: "Return", value: contract.returnLocationName },
              ].map(({ label, value }) => (
                <div key={label} className="px-5 py-3 flex justify-between items-center">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-sm font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Pricing Breakdown</h2>
            </div>
            <div className="px-5 py-3 flex flex-col gap-2 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Base Rate</span>
                <span className="font-medium">{formatBaht(contract.baseRate)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Deposit</span>
                <span className="font-medium">{formatBaht(contract.deposit)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">VAT (7%)</span>
                <span className="font-medium">{formatBaht(contract.vat)}</span>
              </div>
              <div className="flex justify-between py-2 font-semibold text-base">
                <span>Total</span>
                <span>{formatBaht(contract.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Purchase Offer section */}
          {contract.purchaseOfferAvailable && contract.purchaseOffers && (
            <div className="bg-white rounded-xl border border-blue-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-blue-100 bg-blue-50 flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-600" />
                <h2 className="text-sm font-semibold text-blue-900">Purchase Offer Available</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {contract.purchaseOffers.map((offer) => {
                  const pct = Math.min(100, Math.round((offer.totalPaid / offer.buyoutAmount) * 100));
                  const remaining = offer.buyoutAmount - offer.totalPaid;
                  return (
                    <div key={offer.vehicleId} className="px-5 py-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{offer.brandName} {offer.modelName}</p>
                          <p className="text-xs text-gray-500">{offer.licensePlate}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Buyout Amount</p>
                          <p className="font-bold text-gray-900">{formatBaht(offer.buyoutAmount)}</p>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                          style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mb-3">
                        <span>{formatBaht(offer.totalPaid)} paid ({pct}%)</span>
                        <span>{formatBaht(remaining)} remaining</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">Offer expires {formatDate(offer.offerExpiry)}</p>
                        <button
                          onClick={() => toast("success", `Purchase offer accepted for ${offer.brandName} ${offer.modelName}. Admin will confirm shortly.`)}
                          className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                          Accept Offer
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: approval tracker + actions */}
        <div className="flex flex-col gap-4">
          {/* Approval tracker */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Approval Status</h3>
            </div>
            <div className="px-5 py-4 flex flex-col gap-0">
              {contract.approvalSteps.map((step, i) => (
                <div key={step.step} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${stepColors[step.status]}`}>
                      {step.status === "done" && <Check size={12} />}
                      {step.status === "current" && <Clock size={12} />}
                      {step.status === "rejected" && <span className="text-[10px] font-bold">✗</span>}
                      {step.status === "pending" && <span className="text-[10px]">{i + 1}</span>}
                    </div>
                    {i < contract.approvalSteps.length - 1 && (
                      <div className={`w-0.5 h-8 mt-1 ${step.status === "done" ? "bg-green-300" : "bg-gray-200"}`} />
                    )}
                  </div>
                  <div className="pb-6 flex-1">
                    <p className={`text-sm font-medium ${step.status === "pending" ? "text-gray-400" : "text-gray-900"}`}>{step.step}</p>
                    {step.actorName && <p className="text-xs text-gray-500">{step.actorName}</p>}
                    {step.timestamp && <p className="text-xs text-gray-400">{step.timestamp}</p>}
                    {step.reason && <p className="text-xs text-red-500 mt-0.5">{step.reason}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          {(contract.status === "Active" || contract.status === "Expiring Soon") && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Actions</h3>
              <button onClick={() => setExtendOpen(true)}
                className="flex items-center gap-2 text-sm border border-gray-200 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors w-full">
                <CalendarPlus size={15} className="text-gray-500" />
                Request Extension
              </button>
              <button onClick={() => toast("info", "Damage report submitted. Admin will follow up shortly.")}
                className="flex items-center gap-2 text-sm border border-gray-200 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors w-full">
                <AlertTriangle size={15} className="text-gray-500" />
                Report Damage / Issue
              </button>
              <button onClick={() => toast("error", "Termination request submitted. Subject to cancellation policy review.")}
                className="flex items-center gap-2 text-sm border border-red-100 text-red-600 px-4 py-2.5 rounded-lg hover:bg-red-50 transition-colors w-full">
                <AlertTriangle size={15} />
                Request Termination
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Extend dialog */}
      <ConfirmDialog
        open={extendOpen}
        onClose={() => setExtendOpen(false)}
        onConfirm={() => {
          toast("success", "Extension request submitted for admin approval.");
        }}
        title="Request Contract Extension"
        message="Select a new return date. The extension is subject to admin approval."
        confirmLabel="Submit Extension Request"
      >
        <input type="date" value={newReturnDate} onChange={(e) => setNewReturnDate(e.target.value)}
          min={contract.endDate}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full" />
      </ConfirmDialog>
    </div>
  );
}
