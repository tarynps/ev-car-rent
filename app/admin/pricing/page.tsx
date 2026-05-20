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

  const rateFields: { key: keyof PricingTier; label: string }[] = [
    { key: "monthly", label: "Monthly" },
    { key: "quarterly", label: "Quarterly" },
    { key: "semiAnnual", label: "Semi-Annual" },
    { key: "annual", label: "Annual" },
    { key: "rentWithPurchase", label: "Rent-with-Purchase" },
    { key: "deposit", label: "Deposit" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ev-black">Pricing Management</h1>
          <p className="text-sm text-ev-muted mt-0.5">Per-unit monthly rates by model and duration</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-ev-muted cursor-pointer">
            <input type="checkbox" checked={vatInclusive} onChange={(e) => setVatInclusive(e.target.checked)} className="rounded" />
            VAT Inclusive (7%)
          </label>
          <button onClick={() => toast("success", "Pricing updated successfully.")}
            className="flex items-center gap-2 bg-ev-primary hover:bg-ev-primary-dark text-white text-sm px-4 py-2 rounded-lg transition-colors">
            <Save size={14} /> Save Changes
          </button>
        </div>
      </div>

      {/* Rate table */}
      <div className="bg-ev-surface border border-gray-100 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ev-black">Rental Rates per Unit (฿/month)</h3>
          <span className="text-xs text-ev-muted">{vatInclusive ? "VAT 7% included" : "Excl. VAT"}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs text-ev-muted font-medium whitespace-nowrap">Model</th>
                <th className="text-left px-4 py-3 text-xs text-ev-muted font-medium whitespace-nowrap">Car Type</th>
                {rateFields.map((f) => (
                  <th key={f.key} className="text-left px-4 py-3 text-xs text-ev-muted font-medium whitespace-nowrap">{f.label} (฿)</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier) => (
                <tr key={tier.modelId} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">JAC {tier.modelName}</td>
                  <td className="px-4 py-3 text-ev-muted text-xs whitespace-nowrap">{tier.carType}</td>
                  {rateFields.map((f) => (
                    <td key={f.key} className="px-4 py-3">
                      <input
                        type="number"
                        value={tier[f.key] as number}
                        onChange={(e) => updateTier(tier.modelId, f.key, Number(e.target.value))}
                        className="w-28 border border-gray-200 rounded-lg px-2 py-1 text-sm text-right focus:border-ev-primary focus:outline-none"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview card */}
      <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-ev-black mb-4">Rate Preview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tiers.map((tier) => (
            <div key={tier.modelId} className="border border-gray-100 rounded-xl p-4">
              <p className="font-medium text-ev-black mb-1">JAC {tier.modelName}</p>
              <p className="text-xs text-ev-muted mb-3">{tier.carType}</p>
              <div className="flex flex-col gap-1.5">
                {[
                  { label: "Monthly", value: tier.monthly },
                  { label: "Quarterly", value: tier.quarterly },
                  { label: "Semi-Annual", value: tier.semiAnnual },
                  { label: "Annual", value: tier.annual },
                  { label: "Rent-with-Purchase", value: tier.rentWithPurchase },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-xs">
                    <span className="text-ev-muted">{label}</span>
                    <span className="font-medium text-ev-black">{formatBaht(value)}/mo</span>
                  </div>
                ))}
                <div className="flex justify-between text-xs border-t border-gray-100 pt-1.5 mt-0.5">
                  <span className="text-ev-muted">Deposit</span>
                  <span className="font-medium text-ev-black">{formatBaht(tier.deposit)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
