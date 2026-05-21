"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Mail, CheckCircle, XCircle } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { rentRequests, pricingTiers } from "@/lib/mock-data";
import { formatDate, formatBaht } from "@/lib/utils";

const DURATION_FIELD: Record<string, keyof typeof pricingTiers[0]> = {
  Daily: "daily1",
  Weekly: "weekly",
  Monthly: "monthly",
  Yearly: "yearly",
};

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const request = rentRequests.find((r) => r.id === id);

  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [approved, setApproved] = useState(false);

  const [rates, setRates] = useState<Record<string, number>>(() => {
    if (!request) return {};
    const field = DURATION_FIELD[request.durationType] ?? "monthly";
    return Object.fromEntries(
      request.requestedModels.map((m) => {
        const tier = pricingTiers.find((t) => t.modelName === m.modelName);
        return [m.modelName, tier ? (tier[field] as number) : 0];
      })
    );
  });

  const [deposits, setDeposits] = useState<Record<string, number>>(() => {
    if (!request) return {};
    return Object.fromEntries(
      request.requestedModels.map((m) => {
        const tier = pricingTiers.find((t) => t.modelName === m.modelName);
        return [m.modelName, tier ? tier.deposit : 0];
      })
    );
  });

  if (!request) {
    return (
      <div className="flex flex-col gap-4">
        <Link href="/admin/requests" className="flex items-center gap-1.5 text-sm text-secondary hover:text-primary">
          <ArrowLeft size={14} /> Back to Requests
        </Link>
        <p className="text-primary font-medium">Request not found.</p>
      </div>
    );
  }

  const rentalSubtotal = request.requestedModels.reduce((sum, m) => sum + (rates[m.modelName] ?? 0) * m.qty, 0);
  const vat = Math.round(rentalSubtotal * 0.07);
  const grandTotal = rentalSubtotal + vat;
  const totalDeposit = request.requestedModels.reduce((sum, m) => sum + (deposits[m.modelName] ?? 0), 0);

  function handleApprove() {
    setApproved(true);
    setTimeout(() => router.push("/admin/requests"), 1200);
  }

  function handleReject() {
    setRejectModal(false);
    setRejectReason("");
    router.push("/admin/requests");
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link href="/admin/requests" className="flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Requests
        </Link>
        <span className="text-secondary">/</span>
        <span className="font-mono text-sm font-semibold text-primary">{request.id.toUpperCase()}</span>
      </div>

      {approved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <CheckCircle size={16} /> Request approved — redirecting…
        </div>
      )}

      {/* Request info card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold text-primary">{request.companyName}</h1>
              <StatusBadge status={request.status} />
            </div>
            <p className="text-sm text-secondary">{request.contractType} · {request.durationType}</p>
            <p className="text-sm text-secondary">{formatDate(request.startDate)} → {formatDate(request.endDate)}</p>
          </div>
          <p className="text-xs text-secondary">Submitted {formatDate(request.createdAt)}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-secondary mb-0.5">Contact</p>
            <p className="font-medium text-primary">{request.contactName}</p>
          </div>
          <div>
            <p className="text-xs text-secondary mb-0.5">Phone</p>
            <a href={`tel:${request.contactPhone}`} className="flex items-center gap-1 text-tertiary hover:underline">
              <Phone size={12} /> {request.contactPhone}
            </a>
          </div>
          <div>
            <p className="text-xs text-secondary mb-0.5">Email</p>
            <a href={`mailto:${request.contactEmail}`} className="flex items-center gap-1 text-tertiary hover:underline">
              <Mail size={12} /> {request.contactEmail}
            </a>
          </div>
        </div>

        {request.notes && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-secondary mb-0.5">Notes</p>
            <p className="text-sm text-primary">{request.notes}</p>
          </div>
        )}
      </div>

      {/* Quoted Pricing table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-primary">Quoted Pricing</h2>
          <p className="text-xs text-secondary mt-0.5">Pre-filled from standard rates · edit before approving</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-secondary">Model</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-secondary">Qty</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-secondary">Rate / unit (฿)</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-secondary">Deposit / unit (฿)</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-secondary">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {request.requestedModels.map((m) => {
                const rate = rates[m.modelName] ?? 0;
                const deposit = deposits[m.modelName] ?? 0;
                const subtotal = rate * m.qty;
                return (
                  <tr key={m.modelName} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3.5 font-medium text-primary">
                      {m.modelName}{m.bodyType ? ` (${m.bodyType})` : ""}
                    </td>
                    <td className="px-5 py-3.5 text-secondary">×{m.qty}</td>
                    <td className="px-5 py-3.5">
                      <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRates((prev) => ({ ...prev, [m.modelName]: Number(e.target.value) }))}
                        className="w-28 border border-gray-200 rounded-lg px-2 py-1 text-sm text-right focus:border-tertiary focus:outline-none"
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      <input
                        type="number"
                        value={deposit}
                        onChange={(e) => setDeposits((prev) => ({ ...prev, [m.modelName]: Number(e.target.value) }))}
                        className="w-28 border border-gray-200 rounded-lg px-2 py-1 text-sm text-right focus:border-tertiary focus:outline-none"
                      />
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-primary">{formatBaht(subtotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
          <div className="flex flex-col gap-1.5 text-sm max-w-xs ml-auto">
            <div className="flex justify-between">
              <span className="text-secondary">Rental subtotal</span>
              <span className="font-medium">{formatBaht(rentalSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">VAT 7%</span>
              <span className="font-medium">{formatBaht(vat)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-1.5 mt-0.5">
              <span className="font-semibold text-primary">Grand Total</span>
              <span className="font-bold text-primary text-base">{formatBaht(grandTotal)}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-secondary">Total Deposit</span>
              <span className="font-medium">{formatBaht(totalDeposit)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Approval steps */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-primary mb-4">Approval Steps</h2>
        <div className="flex flex-col gap-2">
          {request.approvalSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                step.status === "done" ? "bg-primary" : step.status === "current" ? "bg-tertiary" : "bg-gray-200"
              }`} />
              <span className={step.status === "pending" ? "text-gray-400" : "text-primary"}>{step.step}</span>
              {step.actorName && <span className="text-xs text-secondary">— {step.actorName}</span>}
              {step.timestamp && <span className="text-xs text-gray-400">{step.timestamp}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Action bar */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={() => setRejectModal(true)}
          className="flex items-center gap-2 border border-red-200 text-red-500 px-5 py-2.5 rounded-lg hover:bg-red-50 text-sm"
        >
          <XCircle size={14} /> Reject Request
        </button>
        <button
          onClick={handleApprove}
          disabled={approved}
          className="flex items-center gap-2 bg-tertiary text-white px-5 py-2.5 rounded-lg hover:bg-tertiary-dark text-sm disabled:opacity-50"
        >
          <CheckCircle size={14} /> Approve Request
        </button>
      </div>

      <Modal open={rejectModal} onClose={() => setRejectModal(false)} title="Reject Request">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-secondary">The company will be notified of this rejection with your reason.</p>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Rejection Reason *</label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
              rows={3}
              placeholder="e.g. Vehicles unavailable for requested dates…"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setRejectModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button
              onClick={handleReject}
              disabled={!rejectReason}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              Reject Request
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
