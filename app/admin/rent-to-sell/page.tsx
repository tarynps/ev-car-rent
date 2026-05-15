"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { rentToSellEntries as initial } from "@/lib/mock-data";
import { formatBaht, formatDate } from "@/lib/utils";
import type { RentToSellEntry } from "@/lib/types";
import { useToast } from "@/components/Toast";

export default function RentToSellPage() {
  const [entries, setEntries] = useState(initial);
  const [triggerModal, setTriggerModal] = useState<{ open: boolean; carId: string }>({ open: false, carId: "" });
  const [confirmConversion, setConfirmConversion] = useState<{ open: boolean; carId: string }>({ open: false, carId: "" });
  const [triggerForm, setTriggerForm] = useState({ type: "time", value: "12" });
  const { toast } = useToast();

  function confirmConvert(carId: string) {
    setEntries((prev) => prev.map((e) => e.carId === carId ? { ...e, conversionStatus: "Completed" } : e));
    toast("success", "Car marked as sold and removed from rental inventory.");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-primary">Rent-to-Sell Management</h1>
        <p className="text-sm text-secondary mt-0.5">{entries.length} vehicles in rent-to-sell program</p>
      </div>

      <div className="flex flex-col gap-3">
        {entries.map((entry) => {
          const progress = Math.min((entry.totalPaid / entry.buyoutAmount) * 100, 100);
          return (
            <div key={entry.carId} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-semibold text-primary">{entry.licensePlate}</span>
                    <span className="text-xs text-secondary">{entry.brandName} {entry.modelName}</span>
                    <StatusBadge status={entry.conversionStatus} />
                  </div>
                  <p className="text-xs text-secondary mb-3">
                    {entry.companyName} · Contract started {formatDate(entry.contractStart)}
                  </p>
                  {/* Progress bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-secondary mb-1">
                      <span>Total paid: {formatBaht(entry.totalPaid)}</span>
                      <span>Buyout: {formatBaht(entry.buyoutAmount)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-2 bg-black rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs text-secondary mt-1">
                      {formatBaht(entry.buyoutAmount - entry.totalPaid)} remaining · {progress.toFixed(1)}% complete
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => setTriggerModal({ open: true, carId: entry.carId })}
                    className="flex items-center gap-1.5 border border-gray-200 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                    <Settings size={12} /> Set Trigger
                  </button>
                  {entry.conversionStatus !== "Completed" && (
                    <button onClick={() => setConfirmConversion({ open: true, carId: entry.carId })}
                      className="flex items-center gap-1.5 bg-black text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
                      Confirm Conversion
                    </button>
                  )}
                  <button className="flex items-center gap-1.5 border border-gray-200 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                    Generate Contract
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trigger Modal */}
      <Modal open={triggerModal.open} onClose={() => setTriggerModal({ open: false, carId: "" })} title="Set Conversion Trigger">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-secondary block mb-2">Trigger Type</label>
            <div className="flex gap-2">
              {[{ v: "time", l: "Time-based" }, { v: "amount", l: "Amount-based" }].map(({ v, l }) => (
                <button key={v} onClick={() => setTriggerForm({ ...triggerForm, type: v })}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${triggerForm.type === v ? "bg-black text-white border-black" : "border-gray-200 text-secondary"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">
              {triggerForm.type === "time" ? "Months" : "Amount (฿)"}
            </label>
            <input type="number" value={triggerForm.value} onChange={(e) => setTriggerForm({ ...triggerForm, value: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setTriggerModal({ open: false, carId: "" })} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={() => { setTriggerModal({ open: false, carId: "" }); toast("success", "Conversion trigger saved."); }}
              className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800">Save Trigger</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmConversion.open}
        onClose={() => setConfirmConversion({ open: false, carId: "" })}
        onConfirm={() => confirmConvert(confirmConversion.carId)}
        title="Confirm Conversion to Sale"
        message="This will mark the car as Sold and remove it from the rental inventory. This action cannot be undone."
        confirmLabel="Confirm Sale"
        destructive
      />
    </div>
  );
}
