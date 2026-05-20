"use client";

import { useState } from "react";
import { CheckCircle, XCircle, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { rentRequests } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import type { RentRequest } from "@/lib/types";

export default function RequestsPage() {
  const [queue, setQueue] = useState<RentRequest[]>(rentRequests.filter((r) => r.status === "Pending"));
  const [rejectModal, setRejectModal] = useState<{ open: boolean; requestId: string }>({ open: false, requestId: "" });
  const [rejectReason, setRejectReason] = useState("");
  const [expanded, setExpanded] = useState<string[]>([]);

  function approve(id: string) {
    setQueue((prev) => prev.map((r) => {
      if (r.id !== id) return r;
      const steps = r.approvalSteps.map((s) => {
        if (s.status === "current") return { ...s, status: "done" as const, actorName: "Natthapong Charoenwong", timestamp: "2026-05-20 15:00" };
        if (s.status === "pending") return { ...s, status: "current" as const };
        return s;
      });
      const allDone = steps.every((s) => s.status === "done");
      return { ...r, status: allDone ? "Approved" as const : r.status, approvalSteps: steps };
    }).filter((r) => r.status === "Pending"));
  }

  function reject(id: string) {
    setQueue((prev) => prev.filter((r) => r.id !== id));
    setRejectModal({ open: false, requestId: "" });
    setRejectReason("");
  }

  function toggleExpanded(id: string) {
    setExpanded((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-primary">Requests</h1>
        <p className="text-sm text-secondary mt-0.5">{queue.length} pending requests</p>
      </div>

      {queue.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 shadow-sm text-center">
          <CheckCircle size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-primary font-medium">All caught up!</p>
          <p className="text-sm text-secondary mt-1">No pending rental requests.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {queue.map((r) => {
            const isExpanded = expanded.includes(r.id);
            const currentStep = r.approvalSteps.find((s) => s.status === "current");
            const modelsSummary = r.requestedModels.map((m) => `${m.modelName}${m.bodyType ? ` (${m.bodyType})` : ""} ×${m.qty}`).join(", ");
            const totalVehicles = r.requestedModels.reduce((sum, m) => sum + m.qty, 0);
            return (
              <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/admin/requests/${r.id}`} className="font-mono text-xs font-semibold text-tertiary hover:underline">{r.id.toUpperCase()}</Link>
                      <StatusBadge status={r.status} />
                      <span className="text-xs text-secondary">{r.contractType} · {r.durationType}</span>
                    </div>
                    <p className="text-sm font-medium text-primary mt-0.5">{r.companyName}</p>
                    <p className="text-xs text-secondary">{modelsSummary} · {totalVehicles} vehicle{totalVehicles > 1 ? "s" : ""}</p>
                    <p className="text-xs text-secondary">{formatDate(r.startDate)} → {formatDate(r.endDate)}</p>
                    <p className="text-xs text-secondary">Submitted by {r.contactName} · {formatDate(r.createdAt)}</p>
                    {currentStep && (
                      <p className="text-xs text-tertiary mt-1">Awaiting: {currentStep.step}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => approve(r.id)}
                      className="flex items-center gap-1.5 bg-tertiary text-white text-xs px-3 py-1.5 rounded-lg hover:bg-tertiary-dark">
                      <CheckCircle size={12} /> Approve
                    </button>
                    <button onClick={() => setRejectModal({ open: true, requestId: r.id })}
                      className="flex items-center gap-1.5 border border-red-200 text-red-500 text-xs px-3 py-1.5 rounded-lg hover:bg-red-50">
                      <XCircle size={12} /> Reject
                    </button>
                    <button onClick={() => toggleExpanded(r.id)} className="p-1.5 text-secondary hover:text-primary">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 py-4">
                    <p className="text-xs text-secondary font-medium mb-2 uppercase tracking-wide">Requested Models</p>
                    <div className="flex flex-col gap-1 mb-4">
                      {r.requestedModels.map((m, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span className="text-primary font-medium">{m.modelName}{m.bodyType ? ` (${m.bodyType})` : ""}</span>
                          <span className="text-xs text-secondary">× {m.qty} vehicle{m.qty > 1 ? "s" : ""}</span>
                        </div>
                      ))}
                    </div>
                    {r.notes && (
                      <div className="mb-4">
                        <p className="text-xs text-secondary font-medium mb-1 uppercase tracking-wide">Notes</p>
                        <p className="text-sm text-primary">{r.notes}</p>
                      </div>
                    )}
                    <p className="text-xs text-secondary font-medium mb-2 uppercase tracking-wide">Approval Steps</p>
                    <div className="flex flex-col gap-1">
                      {r.approvalSteps.map((step, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${step.status === "done" ? "bg-primary" : step.status === "current" ? "bg-tertiary" : "bg-gray-200"}`} />
                          <span className={step.status === "pending" ? "text-gray-400" : "text-primary"}>{step.step}</span>
                          {step.actorName && <span className="text-xs text-secondary">— {step.actorName}</span>}
                          {step.timestamp && <span className="text-xs text-gray-400">{step.timestamp}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal open={rejectModal.open} onClose={() => setRejectModal({ open: false, requestId: "" })} title="Reject Request">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-secondary">The company will be notified of this rejection with your reason.</p>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Rejection Reason *</label>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={3}
              placeholder="e.g. Vehicles unavailable for requested dates…" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setRejectModal({ open: false, requestId: "" })} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={() => reject(rejectModal.requestId)} disabled={!rejectReason}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50">
              Reject Request
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
