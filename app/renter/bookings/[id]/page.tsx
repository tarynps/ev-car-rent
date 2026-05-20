"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Clock, XCircle, AlertTriangle } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import BookingTimeline from "@/components/BookingTimeline";
import PricingSummary from "@/components/PricingSummary";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import FileUpload from "@/components/FileUpload";
import { bookings } from "@/lib/mock-data";
import { formatBaht, formatDate } from "@/lib/utils";
import { useToast } from "@/components/Toast";

export default function RenterBookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState(() => bookings.find((b) => b.id === id));
  const [cancelOpen, setCancelOpen] = useState(false);
  const [extensionOpen, setExtensionOpen] = useState(false);
  const [damageOpen, setDamageOpen] = useState(false);
  const [newReturnDate, setNewReturnDate] = useState("");
  const [damageDesc, setDamageDesc] = useState("");
  const { toast } = useToast();

  if (!booking) return <div className="text-secondary p-8">Booking not found.</div>;

  const canCancel = booking.status === "Pending" || booking.status === "Confirmed";
  const isActive = booking.status === "Active";
  const isRentToSell = booking.contractType === "Rent-to-Sell";

  const addOnDetails = [
    booking.addOns.portableCharger && { label: "Portable Charger", amount: 6000 },
    booking.addOns.childSeat && { label: "Child Seat", amount: 4500 },
    booking.addOns.extraInsurance && { label: "Extra Insurance", amount: 12000 },
  ].filter(Boolean) as { label: string; amount: number }[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/renter/bookings" className="p-1.5 rounded-lg hover:bg-gray-100 text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-primary">{booking.id.toUpperCase()}</h1>
          <p className="text-sm text-secondary">{booking.brandName} {booking.modelName} · {formatDate(booking.createdAt)}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Booking info */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-3">Booking Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-secondary">Allocated Car</p><p className="font-medium">{booking.licensePlate}</p></div>
              <div><p className="text-xs text-secondary">Contract Type</p><p className="font-medium">{booking.contractType}</p></div>
              <div><p className="text-xs text-secondary">Pick-up</p><p className="font-medium">{formatDate(booking.pickupDate)}</p></div>
              <div><p className="text-xs text-secondary">Return</p><p className="font-medium">{formatDate(booking.returnDate)}</p></div>
              <div><p className="text-xs text-secondary">Pick-up Location</p><p className="font-medium">{booking.pickupLocationName}</p></div>
              <div><p className="text-xs text-secondary">Return Location</p><p className="font-medium">{booking.returnLocationName}</p></div>
            </div>
            {booking.cancellationReason && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-secondary">Cancellation Reason</p>
                <p className="text-sm text-red-500 mt-0.5">{booking.cancellationReason}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-1.5 border border-gray-200 text-sm px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Download size={14} /> Download Contract
            </button>
            <button className="flex items-center gap-1.5 border border-gray-200 text-sm px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Download size={14} /> Download Invoice
            </button>
            {isActive && (
              <button onClick={() => setExtensionOpen(true)} className="flex items-center gap-1.5 border border-gray-200 text-sm px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Clock size={14} /> Request Extension
              </button>
            )}
            {isActive && (
              <button onClick={() => setDamageOpen(true)} className="flex items-center gap-1.5 border border-orange-200 text-orange-500 text-sm px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors">
                <AlertTriangle size={14} /> Report Issue
              </button>
            )}
            {canCancel && (
              <button onClick={() => setCancelOpen(true)} className="flex items-center gap-1.5 border border-red-200 text-red-500 text-sm px-3 py-2 rounded-lg hover:bg-red-50 transition-colors">
                <XCircle size={14} /> Cancel Booking
              </button>
            )}
            {isRentToSell && (
              <Link href={`/renter/bookings/${booking.id}/rent-to-sell`}
                className="flex items-center gap-1.5 bg-tertiary text-white text-sm px-3 py-2 rounded-lg hover:bg-tertiary-dark transition-colors">
                View Rent-to-Sell Terms
              </Link>
            )}
          </div>

          {/* Extension request status */}
          {booking.extensionRequest && (
            <div className="bg-white rounded-xl border border-orange-100 p-4 shadow-sm">
              <p className="text-sm font-medium">Extension Request</p>
              <p className="text-xs text-secondary mt-0.5">New return date: {formatDate(booking.extensionRequest.newReturnDate)}</p>
              <StatusBadge status={booking.extensionRequest.status} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-4">Approval Status</h3>
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

      {/* Cancel Policy */}
      {canCancel && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-sm text-secondary">
          <p className="font-medium text-primary mb-1">Cancellation Policy</p>
          Cancellations made more than 7 days before pick-up receive a full deposit refund. Within 7 days, 50% of the deposit is forfeited. No refund within 24 hours of pick-up.
        </div>
      )}

      {/* Cancel Dialog */}
      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={() => {
          setBooking((prev) => prev ? { ...prev, status: "Cancelled" } : prev);
          toast("success", "Booking cancelled successfully.");
        }}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmLabel="Cancel Booking"
        destructive
      />

      {/* Extension Modal */}
      <Modal open={extensionOpen} onClose={() => setExtensionOpen(false)} title="Request Extension">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-secondary">Submit a request to extend your rental period. Subject to availability and admin approval.</p>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">New Return Date</label>
            <input type="date" value={newReturnDate} onChange={(e) => setNewReturnDate(e.target.value)}
              min={booking.returnDate} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setExtensionOpen(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={() => {
              setBooking((prev) => prev ? { ...prev, extensionRequest: { newReturnDate, submittedAt: "2026-05-15 15:00", status: "Pending" } } : prev);
              setExtensionOpen(false);
              toast("success", "Extension request submitted for approval.");
            }} className="px-4 py-2 text-sm bg-tertiary text-white rounded-lg hover:bg-tertiary-dark">
              Submit Request
            </button>
          </div>
        </div>
      </Modal>

      {/* Damage Modal */}
      <Modal open={damageOpen} onClose={() => setDamageOpen(false)} title="Report Damage / Issue">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Description</label>
            <textarea value={damageDesc} onChange={(e) => setDamageDesc(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={3}
              placeholder="Describe the damage or issue..." />
          </div>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Photos</label>
            <FileUpload label="Upload photos" accept="image/*" multiple />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setDamageOpen(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={() => { setDamageOpen(false); toast("success", "Issue reported. Our team will contact you shortly."); }}
              className="px-4 py-2 text-sm bg-tertiary text-white rounded-lg hover:bg-tertiary-dark">Submit Report</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
