"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { contracts } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function RequestsPage() {
  const pending = contracts.filter((c) => c.status === "Pending");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectId, setRejectId] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  function openReject(id: string) { setRejectId(id); setRejectOpen(true); }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-ev-black">Contract Requests</h1>
        <p className="text-sm text-ev-muted mt-0.5">{pending.length} pending — sorted by submission date</p>
      </div>

      {/* Pending queue */}
      <div className="flex flex-col gap-3">
        {pending.map((c) => {
          const managerStep = c.approvalSteps.find((s) => s.step === "Manager Approved");
          const adminStep = c.approvalSteps.find((s) => s.step === "Admin Approved");
          const currentStep = managerStep?.status === "current" ? "Manager Review" : "Admin Confirm";
          const totalVehicles = c.vehicleGroups.reduce((s, g) => s + g.quantity, 0);

          return (
            <div key={c.id} className="bg-ev-surface border border-gray-100 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link href={`/admin/contracts/${c.id}`} className="font-mono text-sm font-semibold text-ev-primary hover:underline">
                      {c.id.toUpperCase()}
                    </Link>
                    <StatusBadge status={c.status} />
                  </div>

                  <p className="text-sm font-medium text-ev-black">{c.companyName}</p>
                  <p className="text-xs text-ev-muted mt-0.5">Requested by: {c.renterName}</p>

                  <div className="mt-3 flex flex-wrap gap-3">
                    <div>
                      <p className="text-[10px] text-ev-muted uppercase tracking-wide">Car Types</p>
                      <div className="flex flex-col gap-0.5 mt-0.5">
                        {c.vehicleGroups.map((g, i) => (
                          <span key={i} className="text-xs font-medium text-ev-black">{g.carType} × {g.quantity} ({g.modelName})</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-ev-muted uppercase tracking-wide">Duration</p>
                      <p className="text-xs font-medium text-ev-black mt-0.5">{c.durationType}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-ev-muted uppercase tracking-wide">Pick-up</p>
                      <p className="text-xs font-medium text-ev-black mt-0.5">{formatDate(c.pickupDate)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-ev-muted uppercase tracking-wide">Submitted</p>
                      <p className="text-xs font-medium text-ev-black mt-0.5">{c.createdAt}</p>
                    </div>
                  </div>

                  {/* Approval progress */}
                  <div className="mt-3 flex items-center gap-2">
                    {c.approvalSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-1">
                        {step.status === "done" && <CheckCircle size={12} className="text-[#166534]" />}
                        {step.status === "current" && <Clock size={12} className="text-amber-500" />}
                        {step.status === "pending" && <div className="w-3 h-3 rounded-full border-2 border-gray-300" />}
                        <span className={`text-[10px] ${step.status === "done" ? "text-ev-muted" : step.status === "current" ? "text-amber-600 font-medium" : "text-gray-300"}`}>
                          {step.step}
                        </span>
                        {i < c.approvalSteps.length - 1 && <div className="w-4 h-px bg-gray-200 mx-0.5" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button className="flex items-center gap-1.5 bg-ev-primary hover:bg-ev-primary-dark text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
                    <CheckCircle size={12} /> Approve
                  </button>
                  <button onClick={() => openReject(c.id)} className="flex items-center gap-1.5 border border-gray-200 text-ev-muted hover:text-ev-black text-xs px-3 py-1.5 rounded-lg transition-colors">
                    <XCircle size={12} /> Reject
                  </button>
                  <Link href={`/admin/contracts/${c.id}`} className="text-xs text-ev-primary hover:underline text-center">View Detail</Link>
                </div>
              </div>
            </div>
          );
        })}

        {pending.length === 0 && (
          <div className="text-center py-12 bg-ev-surface border border-gray-100 rounded-xl text-ev-muted text-sm">
            No pending contract requests.
          </div>
        )}
      </div>

      {/* Reject modal */}
      <Modal open={rejectOpen} onClose={() => setRejectOpen(false)} title="Reject Contract Request">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ev-muted">Rejecting contract <span className="font-semibold text-ev-black">{rejectId.toUpperCase()}</span>. Please provide a reason — the renter will be notified automatically.</p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
            rows={3}
            placeholder="Reason for rejection..."
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setRejectOpen(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button className="px-4 py-2 text-sm bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg transition-colors">Confirm Reject</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
