"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw, XCircle, CheckCircle, XSquare } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import BookingTimeline from "@/components/BookingTimeline";
import PricingSummary from "@/components/PricingSummary";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { bookings, cars } from "@/lib/mock-data";
import { formatBaht, formatDate } from "@/lib/utils";

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState(() => bookings.find((b) => b.id === id));
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [swapOpen, setSwapOpen] = useState(false);

  if (!booking) return <div className="text-secondary p-8">Booking not found.</div>;

  const availableCars = cars.filter((c) => c.status === "Available");

  function cancelBooking() {
    setBooking((prev) => prev ? { ...prev, status: "Cancelled", cancellationReason: cancelReason } : prev);
  }

  function handleExtension(action: "approve" | "reject") {
    setBooking((prev) => prev && prev.extensionRequest ? {
      ...prev,
      returnDate: action === "approve" ? prev.extensionRequest!.newReturnDate : prev.returnDate,
      extensionRequest: { ...prev.extensionRequest!, status: action === "approve" ? "Approved" : "Rejected" },
    } : prev);
  }

  const addOnDetails = [
    booking.addOns.portableCharger && { label: "Portable Charger", amount: 200 * 30 },
    booking.addOns.childSeat && { label: "Child Seat", amount: 150 * 30 },
    booking.addOns.extraInsurance && { label: "Extra Insurance", amount: 400 * 30 },
  ].filter(Boolean) as { label: string; amount: number }[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/bookings" className="p-1.5 rounded-lg hover:bg-gray-100 text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-primary">{booking.id.toUpperCase()}</h1>
          <p className="text-sm text-secondary">Created {formatDate(booking.createdAt)}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <StatusBadge status={booking.status} />
          {booking.status !== "Cancelled" && booking.status !== "Completed" && (
            <button onClick={() => setCancelOpen(true)} className="flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-sm px-3 py-1.5 rounded-lg transition-colors">
              <XCircle size={14} /> Cancel
            </button>
          )}
          {booking.status === "Active" && (
            <button onClick={() => setSwapOpen(true)} className="flex items-center gap-1.5 border border-gray-200 text-sm px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw size={14} /> Swap Vehicle
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: main details */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Renter info */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-primary mb-3">Renter Information</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-secondary">Company</p><p className="font-medium">{booking.companyName}</p></div>
              <div><p className="text-xs text-secondary">Contact Person</p><p className="font-medium">{booking.renterName}</p></div>
              <div><p className="text-xs text-secondary">Phone</p><p className="font-medium">{booking.renterPhone}</p></div>
              <div><p className="text-xs text-secondary">Email</p><p className="font-medium">{booking.renterEmail}</p></div>
            </div>
          </div>

          {/* Booking details */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-primary mb-3">Booking Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-secondary">Contract Type</p><p className="font-medium">{booking.contractType}</p></div>
              <div><p className="text-xs text-secondary">Duration Type</p><p className="font-medium">{booking.durationType}</p></div>
              <div><p className="text-xs text-secondary">Pick-up Date</p><p className="font-medium">{formatDate(booking.pickupDate)}</p></div>
              <div><p className="text-xs text-secondary">Return Date</p><p className="font-medium">{formatDate(booking.returnDate)}</p></div>
              <div><p className="text-xs text-secondary">Pick-up Location</p><p className="font-medium">{booking.pickupLocationName}</p></div>
              <div><p className="text-xs text-secondary">Return Location</p><p className="font-medium">{booking.returnLocationName}</p></div>
              <div>
                <p className="text-xs text-secondary">Allocated Car</p>
                <Link href={`/admin/fleet/${booking.carId}`} className="font-medium text-tertiary hover:underline">
                  {booking.licensePlate} ({booking.brandName} {booking.modelName})
                </Link>
              </div>
            </div>
            {booking.addOns.portableCharger || booking.addOns.childSeat || booking.addOns.extraInsurance ? (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-secondary mb-1">Add-ons</p>
                <div className="flex flex-wrap gap-1">
                  {booking.addOns.portableCharger && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">Portable Charger</span>}
                  {booking.addOns.childSeat && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">Child Seat</span>}
                  {booking.addOns.extraInsurance && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">Extra Insurance</span>}
                </div>
              </div>
            ) : null}
            {booking.cancellationReason && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-secondary">Cancellation Reason</p>
                <p className="text-sm text-red-500 mt-0.5">{booking.cancellationReason}</p>
              </div>
            )}
          </div>

          {/* Extension request */}
          {booking.extensionRequest && booking.extensionRequest.status === "Pending" && (
            <div className="bg-white rounded-xl border border-orange-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-primary mb-2">Extension Request</h3>
              <p className="text-sm text-secondary">New return date: <span className="font-medium text-primary">{formatDate(booking.extensionRequest.newReturnDate)}</span></p>
              <p className="text-xs text-gray-400 mt-0.5">Submitted {booking.extensionRequest.submittedAt}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => handleExtension("approve")} className="flex items-center gap-1.5 bg-black text-white text-sm px-3 py-1.5 rounded-lg hover:bg-gray-800">
                  <CheckCircle size={13} /> Approve Extension
                </button>
                <button onClick={() => handleExtension("reject")} className="flex items-center gap-1.5 border border-gray-200 text-sm px-3 py-1.5 rounded-lg hover:bg-gray-50">
                  <XSquare size={13} /> Reject
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: timeline + pricing */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-primary mb-4">Approval Status</h3>
            <BookingTimeline steps={booking.approvalSteps} />
          </div>
          <PricingSummary
            baseRate={booking.baseRate}
            addOnTotal={booking.addOnTotal}
            deposit={booking.deposit}
            vat={booking.vat}
            total={booking.total}
            addOnDetails={addOnDetails}
            durationType={booking.durationType}
          />
        </div>
      </div>

      {/* Cancel Dialog */}
      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={cancelBooking}
        title="Cancel Booking"
        message="This action cannot be undone. Please provide a reason for cancellation."
        confirmLabel="Cancel Booking"
        destructive
      >
        <textarea
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
          rows={2}
          placeholder="Reason for cancellation..."
        />
      </ConfirmDialog>

      {/* Swap Modal */}
      <Modal open={swapOpen} onClose={() => setSwapOpen(false)} title="Swap Vehicle">
        <div className="flex flex-col gap-3">
          <p className="text-sm text-secondary">Select a replacement vehicle.</p>
          {availableCars.slice(0, 5).map((c) => (
            <button key={c.id} onClick={() => { setBooking((b) => b ? { ...b, carId: c.id, licensePlate: c.licensePlate } : b); setSwapOpen(false); }}
              className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 hover:border-black transition-colors text-left">
              <div>
                <p className="text-sm font-medium">{c.licensePlate}</p>
                <p className="text-xs text-secondary">{c.brandName} {c.modelName}</p>
              </div>
              <StatusBadge status={c.status} />
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
