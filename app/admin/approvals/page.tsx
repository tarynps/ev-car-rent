"use client";

import { useState } from "react";
import { CheckCircle, XCircle, ChevronDown, ChevronRight } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { bookings as allBookings } from "@/lib/mock-data";
import { formatDate, formatBaht } from "@/lib/utils";
import type { Booking } from "@/lib/types";
import Link from "next/link";

export default function ApprovalsPage() {
  const [queue, setQueue] = useState<Booking[]>(allBookings.filter((b) => b.status === "Pending"));
  const [rejectModal, setRejectModal] = useState<{ open: boolean; bookingId: string }>({ open: false, bookingId: "" });
  const [rejectReason, setRejectReason] = useState("");
  const [expanded, setExpanded] = useState<string[]>([]);

  function approve(id: string) {
    setQueue((prev) => prev.map((b) => {
      if (b.id !== id) return b;
      const steps = b.approvalSteps.map((s) => {
        if (s.status === "current") return { ...s, status: "done" as const, actorName: "Natthapong Charoenwong", timestamp: "2026-05-15 15:00" };
        if (s.status === "pending") return { ...s, status: "current" as const };
        return s;
      });
      const allDone = steps.every((s) => s.status === "done");
      return { ...b, status: allDone ? "Confirmed" as const : b.status, approvalSteps: steps };
    }).filter((b) => b.status === "Pending"));
  }

  function reject(id: string) {
    setQueue((prev) => prev.filter((b) => b.id !== id));
    setRejectModal({ open: false, bookingId: "" });
    setRejectReason("");
  }

  function toggleExpanded(id: string) {
    setExpanded((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-primary">Approval Workflow</h1>
        <p className="text-sm text-secondary mt-0.5">{queue.length} pending requests</p>
      </div>

      {queue.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 shadow-sm text-center">
          <CheckCircle size={32} className="text-green-400 mx-auto mb-3" />
          <p className="text-primary font-medium">All caught up!</p>
          <p className="text-sm text-secondary mt-1">No pending approval requests.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {queue.map((b) => {
            const isExpanded = expanded.includes(b.id);
            const currentStep = b.approvalSteps.find((s) => s.status === "current");
            return (
              <div key={b.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/admin/bookings/${b.id}`} className="font-mono text-xs font-semibold text-tertiary hover:underline">
                        {b.id.toUpperCase()}
                      </Link>
                      <StatusBadge status={b.status} />
                      <span className="text-xs text-secondary">{b.contractType}</span>
                    </div>
                    <p className="text-sm font-medium text-primary mt-0.5">{b.companyName}</p>
                    <p className="text-xs text-secondary">{b.brandName} {b.modelName} · {formatDate(b.pickupDate)} → {formatDate(b.returnDate)}</p>
                    <p className="text-xs text-secondary">Submitted by {b.renterName} · {formatDate(b.createdAt)}</p>
                    {currentStep && (
                      <p className="text-xs text-orange-500 mt-1">Awaiting: {currentStep.step}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => approve(b.id)}
                      className="flex items-center gap-1.5 bg-black text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-800">
                      <CheckCircle size={12} /> Approve
                    </button>
                    <button onClick={() => setRejectModal({ open: true, bookingId: b.id })}
                      className="flex items-center gap-1.5 border border-red-200 text-red-500 text-xs px-3 py-1.5 rounded-lg hover:bg-red-50">
                      <XCircle size={12} /> Reject
                    </button>
                    <button onClick={() => toggleExpanded(b.id)} className="p-1.5 text-secondary hover:text-primary">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 py-4">
                    <p className="text-xs text-secondary font-medium mb-2 uppercase tracking-wide">Approval Audit Trail</p>
                    <div className="flex flex-col gap-1">
                      {b.approvalSteps.map((step, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${step.status === "done" ? "bg-black" : step.status === "current" ? "bg-tertiary" : "bg-gray-200"}`} />
                          <span className={step.status === "pending" ? "text-gray-400" : "text-primary"}>{step.step}</span>
                          {step.actorName && <span className="text-xs text-secondary">— {step.actorName}</span>}
                          {step.timestamp && <span className="text-xs text-gray-400">{step.timestamp}</span>}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-50 grid grid-cols-2 gap-3 text-sm">
                      <div><p className="text-xs text-secondary">Total</p><p className="font-semibold">{formatBaht(b.total)}</p></div>
                      <div><p className="text-xs text-secondary">Duration</p><p className="font-medium">{b.durationType}</p></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal open={rejectModal.open} onClose={() => setRejectModal({ open: false, bookingId: "" })} title="Reject Booking">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-secondary">The renter will be notified of this rejection with your reason.</p>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Rejection Reason *</label>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={3}
              placeholder="e.g. Car unavailable for requested dates..." />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setRejectModal({ open: false, bookingId: "" })} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={() => reject(rejectModal.bookingId)} disabled={!rejectReason}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50">
              Reject Booking
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
