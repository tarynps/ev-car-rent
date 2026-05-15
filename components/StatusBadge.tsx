import type { CarStatus, BookingStatus, KycStatus, ConversionStatus } from "@/lib/types";

type AnyStatus = CarStatus | BookingStatus | KycStatus | ConversionStatus | string;

const colorMap: Record<string, { bg: string; text: string }> = {
  Available:          { bg: "#DCFCE7", text: "#166534" },
  Rented:             { bg: "#DBEAFE", text: "#1E40AF" },
  Maintenance:        { bg: "#FEF9C3", text: "#854D0E" },
  Pending:            { bg: "#FEF3C7", text: "#92400E" },
  Confirmed:          { bg: "#DBEAFE", text: "#1E40AF" },
  Completed:          { bg: "#F3F4F6", text: "#374151" },
  Cancelled:          { bg: "#FEE2E2", text: "#991B1B" },
  Sold:               { bg: "#F3F4F6", text: "#374151" },
  Active:             { bg: "#DBEAFE", text: "#1E40AF" },
  Verified:           { bg: "#DCFCE7", text: "#166534" },
  Rejected:           { bg: "#FEE2E2", text: "#991B1B" },
  Eligible:           { bg: "#DCFCE7", text: "#166534" },
  "Renter Confirmed": { bg: "#DBEAFE", text: "#1E40AF" },
  "Admin Confirmed":  { bg: "#FEF3C7", text: "#92400E" },
  Inactive:           { bg: "#F3F4F6", text: "#374151" },
  Paid:               { bg: "#DCFCE7", text: "#166534" },
  Sent:               { bg: "#DBEAFE", text: "#1E40AF" },
  Draft:              { bg: "#F3F4F6", text: "#374151" },
  Held:               { bg: "#FEF3C7", text: "#92400E" },
  Refunded:           { bg: "#DCFCE7", text: "#166534" },
  Forfeited:          { bg: "#FEE2E2", text: "#991B1B" },
};

export default function StatusBadge({ status }: { status: AnyStatus }) {
  const colors = colorMap[status] ?? { bg: "#F3F4F6", text: "#374151" };
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {status}
    </span>
  );
}
