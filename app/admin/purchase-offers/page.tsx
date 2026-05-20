"use client";

import { useState } from "react";
import { Truck, Award, Send, CheckCircle } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { purchaseOffers } from "@/lib/mock-data";
import { formatBaht } from "@/lib/utils";

const STATUS_ORDER = ["Eligible", "Offer Sent", "Client Confirmed", "Admin Confirmed", "Completed"] as const;

export default function PurchaseOffersPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const active = purchaseOffers.filter((p) => p.conversionStatus !== "Completed");
  const completed = purchaseOffers.filter((p) => p.conversionStatus === "Completed");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-ev-black">Purchase Offer Management</h1>
        <p className="text-sm text-ev-muted mt-0.5">{active.length} active offers — {completed.length} completed conversions</p>
      </div>

      {/* Active offers */}
      <div>
        <h2 className="text-sm font-semibold text-ev-black mb-3">Active Offers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {active.map((offer) => {
            const paidPct = Math.min(100, Math.round((offer.totalPaid / offer.buyoutAmount) * 100));
            const needsAction = offer.conversionStatus === "Eligible";

            return (
              <div key={offer.id} className={`bg-ev-surface border rounded-xl p-5 ${needsAction ? "border-ev-primary" : "border-gray-100"}`}>
                {needsAction && (
                  <div className="text-[10px] font-medium text-ev-primary bg-ev-primary-tint px-2 py-0.5 rounded-full inline-flex items-center gap-1 mb-3">
                    <Award size={9} /> Action Required
                  </div>
                )}

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                    <Truck size={20} className="text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ev-black">JAC {offer.modelName}</p>
                    <p className="text-xs text-ev-muted">{offer.carType}</p>
                    <p className="text-xs font-mono text-ev-muted mt-0.5">{offer.licensePlate}</p>
                  </div>
                </div>

                <p className="text-xs text-ev-muted mb-1">{offer.companyName}</p>
                <p className="text-xs text-ev-muted">Contract started: {offer.contractStart}</p>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-ev-muted mb-1">
                    <span>Total paid: {formatBaht(offer.totalPaid)}</span>
                    <span>Buyout: {formatBaht(offer.buyoutAmount)}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-ev-primary rounded-full transition-all" style={{ width: `${paidPct}%` }} />
                  </div>
                  <p className="text-[10px] text-ev-muted mt-1">{paidPct}% of buyout amount accumulated</p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <StatusBadge status={offer.conversionStatus} />
                  {offer.offerExpiryDate && (
                    <span className="text-[10px] text-ev-muted">Expires: {offer.offerExpiryDate}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-3 flex flex-col gap-2">
                  {offer.conversionStatus === "Eligible" && (
                    <button className="flex items-center justify-center gap-1.5 bg-ev-primary hover:bg-ev-primary-dark text-white text-xs px-3 py-2 rounded-lg w-full transition-colors">
                      <Send size={11} /> Send Purchase Offer
                    </button>
                  )}
                  {offer.conversionStatus === "Client Confirmed" && (
                    <button onClick={() => { setSelectedId(offer.id); setConfirmOpen(true); }}
                      className="flex items-center justify-center gap-1.5 bg-ev-primary hover:bg-ev-primary-dark text-white text-xs px-3 py-2 rounded-lg w-full transition-colors">
                      <CheckCircle size={11} /> Confirm Conversion
                    </button>
                  )}
                  <button className="flex items-center justify-center gap-1.5 border border-gray-200 text-ev-muted hover:text-ev-black text-xs px-3 py-2 rounded-lg w-full transition-colors">
                    Generate Sale Contract
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-ev-black mb-3">Completed Conversions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completed.map((offer) => (
              <div key={offer.id} className="bg-ev-surface border border-gray-100 rounded-xl p-5 opacity-70">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                    <Truck size={20} className="text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ev-black">JAC {offer.modelName}</p>
                    <p className="text-xs text-ev-muted">{offer.carType} — {offer.licensePlate}</p>
                  </div>
                </div>
                <p className="text-xs text-ev-muted">{offer.companyName}</p>
                <div className="mt-2">
                  <StatusBadge status={offer.conversionStatus} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Vehicle Conversion">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ev-muted">
            This will mark the vehicle as <strong>Sold</strong> and remove it from the rental inventory permanently.
          </p>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setConfirmOpen(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button className="px-4 py-2 text-sm bg-ev-primary hover:bg-ev-primary-dark text-white rounded-lg transition-colors">Confirm Conversion</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
