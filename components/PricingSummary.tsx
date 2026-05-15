import { formatBaht } from "@/lib/utils";

interface PricingSummaryProps {
  baseRate: number;
  addOnTotal: number;
  deposit: number;
  vat: number;
  total: number;
  addOnDetails?: { label: string; amount: number }[];
  durationType?: string;
}

export default function PricingSummary({ baseRate, addOnTotal, deposit, vat, total, addOnDetails, durationType }: PricingSummaryProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <h4 className="text-sm font-semibold text-primary mb-4">Pricing Summary</h4>
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-secondary">Base rate {durationType ? `(${durationType})` : ""}</span>
          <span className="font-medium">{formatBaht(baseRate)}</span>
        </div>
        {addOnDetails && addOnDetails.length > 0 && addOnDetails.map((a) => (
          <div key={a.label} className="flex justify-between text-secondary">
            <span className="pl-3">+ {a.label}</span>
            <span>{formatBaht(a.amount)}</span>
          </div>
        ))}
        {addOnTotal > 0 && !addOnDetails && (
          <div className="flex justify-between text-secondary">
            <span>Add-ons</span>
            <span>{formatBaht(addOnTotal)}</span>
          </div>
        )}
        <div className="flex justify-between text-secondary">
          <span>Deposit (refundable)</span>
          <span>{formatBaht(deposit)}</span>
        </div>
        <div className="flex justify-between text-secondary">
          <span>VAT (7%)</span>
          <span>{formatBaht(vat)}</span>
        </div>
        <div className="border-t border-gray-100 mt-1 pt-3 flex justify-between font-semibold text-base">
          <span>Total</span>
          <span>{formatBaht(total)}</span>
        </div>
      </div>
    </div>
  );
}
