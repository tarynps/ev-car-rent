"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import StatusBadge from "@/components/StatusBadge";
import { bookings, rentToSellEntries } from "@/lib/mock-data";
import { formatBaht, formatDate } from "@/lib/utils";
import { useToast } from "@/components/Toast";

export default function RentToSellRenterPage() {
  const { id } = useParams<{ id: string }>();
  const booking = bookings.find((b) => b.id === id);
  const entry = rentToSellEntries.find((e) => e.bookingId === id);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { toast } = useToast();

  if (!booking || !entry) {
    return (
      <div className="flex flex-col gap-4">
        <Link href={`/renter/bookings/${id}`} className="flex items-center gap-2 text-secondary hover:text-primary text-sm">
          <ArrowLeft size={15} /> Back to Booking
        </Link>
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center shadow-sm">
          <p className="text-secondary">No rent-to-sell terms found for this booking.</p>
        </div>
      </div>
    );
  }

  const progress = Math.min((entry.totalPaid / entry.buyoutAmount) * 100, 100);
  const remaining = entry.buyoutAmount - entry.totalPaid;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href={`/renter/bookings/${id}`} className="p-1.5 rounded-lg hover:bg-gray-100 text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-primary">Rent-to-Sell Terms</h1>
          <p className="text-sm text-secondary">{booking.brandName} {booking.modelName} · {booking.licensePlate}</p>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center gap-3">
        <RefreshCw size={18} className="text-tertiary" />
        <div className="flex-1">
          <p className="font-medium text-primary">Conversion Status</p>
          <p className="text-xs text-secondary mt-0.5">Contract started {formatDate(entry.contractStart)}</p>
        </div>
        <StatusBadge status={confirmed ? "Renter Confirmed" : entry.conversionStatus} />
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Buyout Progress</h3>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-secondary">Total paid toward buyout</span>
          <span className="font-semibold">{formatBaht(entry.totalPaid)}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div className="h-3 bg-black rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-xs text-secondary">
          <span>{progress.toFixed(1)}% complete</span>
          <span>Buyout price: {formatBaht(entry.buyoutAmount)}</span>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-secondary">Remaining to own this vehicle</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatBaht(remaining)}</p>
        </div>
      </div>

      {/* Terms */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Terms &amp; Conditions</h3>
        <div className="text-sm text-secondary space-y-2">
          <p>• Monthly rental payments accumulate toward the final buyout price of {formatBaht(entry.buyoutAmount)}.</p>
          <p>• Once {formatBaht(entry.buyoutAmount)} has been paid in total, you may exercise your option to purchase.</p>
          <p>• The vehicle must be maintained in good condition throughout the rental period.</p>
          <p>• Early conversion is available upon request and subject to admin approval.</p>
          <p>• Upon confirmed conversion, ownership documents will be transferred within 30 days.</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button className="flex items-center gap-1.5 border border-gray-200 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <Download size={14} /> Download Sale Agreement
        </button>
        {!confirmed && entry.conversionStatus === "Eligible" && (
          <button onClick={() => setConfirmOpen(true)} className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Confirm Intent to Purchase
          </button>
        )}
        {confirmed && (
          <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
            <span>✓ Purchase intent submitted — awaiting admin confirmation</span>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => { setConfirmed(true); toast("success", "Purchase intent confirmed. Admin will review your request."); }}
        title="Confirm Intent to Purchase"
        message={`You are confirming your intention to purchase ${booking.brandName} ${booking.modelName} (${booking.licensePlate}) for ${formatBaht(remaining)} remaining. This will trigger an admin review.`}
        confirmLabel="Confirm Purchase Intent"
      />
    </div>
  );
}
