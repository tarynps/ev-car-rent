"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { pricingTiers as initialTiers } from "@/lib/mock-data";
import { formatBaht } from "@/lib/utils";
import type { PricingTier } from "@/lib/types";
import { useToast } from "@/components/Toast";

export default function PricingPage() {
  const [tiers, setTiers] = useState(initialTiers);
  const [vatInclusive, setVatInclusive] = useState(true);
  const { toast } = useToast();

  function updateTier(modelId: string, field: keyof PricingTier, value: number) {
    setTiers((prev) => prev.map((t) => t.modelId === modelId ? { ...t, [field]: value } : t));
  }

  function save() {
    toast("success", "Pricing updated successfully.");
  }

  const numFields: { key: keyof PricingTier; label: string }[] = [
    { key: "daily1", label: "1-Day" },
    { key: "daily3", label: "3-Day" },
    { key: "daily5", label: "5-Day" },
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
    { key: "yearly", label: "Yearly" },
    { key: "rentToSell", label: "Rent-to-Sell" },
    { key: "deposit", label: "Deposit" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-primary">Pricing Management</h1>
          <p className="text-sm text-secondary mt-0.5">Set rates per model</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-secondary cursor-pointer">
            <input type="checkbox" checked={vatInclusive} onChange={(e) => setVatInclusive(e.target.checked)} className="rounded" />
            VAT Inclusive (7%)
          </label>
          <button onClick={save} className="flex items-center gap-2 bg-tertiary text-white text-sm px-4 py-2 rounded-lg hover:bg-tertiary-dark">
            <Save size={14} /> Save Changes
          </button>
        </div>
      </div>

      {/* Main pricing table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-primary">Rental Rates per Model</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs text-secondary font-medium whitespace-nowrap">Model</th>
                {numFields.map((f) => (
                  <th key={f.key} className="text-left px-4 py-3 text-xs text-secondary font-medium whitespace-nowrap">{f.label} (฿)</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier) => (
                <tr key={tier.modelId} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{tier.modelName}</td>
                  {numFields.map((f) => (
                    <td key={f.key} className="px-4 py-3">
                      <input
                        type="number"
                        value={tier[f.key] as number}
                        onChange={(e) => updateTier(tier.modelId, f.key, Number(e.target.value))}
                        className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-sm text-right focus:border-tertiary focus:outline-none"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
