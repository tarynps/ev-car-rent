"use client";

import { useState } from "react";
import { CreditCard, Building2, QrCode, Download } from "lucide-react";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { transactions, bookings } from "@/lib/mock-data";
import { formatBaht, formatDate } from "@/lib/utils";
import type { Transaction } from "@/lib/types";
import { useToast } from "@/components/Toast";

export default function BillingPage() {
  const [payModal, setPayModal] = useState(false);
  const [payMethod, setPayMethod] = useState("Credit Card");
  const { toast } = useToast();

  const myTx = transactions.filter((t) => ["bk1", "bk3", "bk9", "bk12"].includes(t.bookingId));
  const pendingBookings = bookings.filter((b) => b.companyId === "c1" && b.status === "Active");

  const columns = [
    { key: "id", header: "Tx ID", render: (r: Transaction) => <span className="font-mono text-xs">{r.id.toUpperCase()}</span> },
    { key: "bookingId", header: "Booking", render: (r: Transaction) => <span className="font-mono text-xs">{r.bookingId.toUpperCase()}</span> },
    { key: "type", header: "Type" },
    { key: "method", header: "Method" },
    { key: "amount", header: "Amount", render: (r: Transaction) => <span className="font-medium">{formatBaht(r.amount)}</span> },
    { key: "depositStatus", header: "Deposit", render: (r: Transaction) => r.depositStatus ? <StatusBadge status={r.depositStatus} /> : <span className="text-gray-400">—</span> },
    { key: "status", header: "Status", render: (r: Transaction) => <StatusBadge status={r.status} /> },
    { key: "date", header: "Date", render: (r: Transaction) => <span className="text-secondary">{formatDate(r.date)}</span> },
    { key: "receipt", header: "Receipt", sortable: false, render: () => (
      <button className="flex items-center gap-1 text-tertiary hover:underline text-xs"><Download size={12} /> PDF</button>
    )},
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-primary">Payment & Billing</h1>
        <p className="text-sm text-secondary mt-0.5">Siam Motors Group</p>
      </div>

      {/* Pay button */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
        <div>
          <p className="font-semibold text-primary">Outstanding Balance</p>
          <p className="text-2xl font-bold mt-1">{formatBaht(pendingBookings.reduce((s, b) => s + b.deposit, 0))}</p>
          <p className="text-xs text-secondary mt-0.5">{pendingBookings.length} active booking{pendingBookings.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setPayModal(true)} className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          Make Payment
        </button>
      </div>

      {/* Deposit status */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold">Deposit Status per Booking</h3>
        </div>
        <div className="flex flex-col">
          {pendingBookings.map((b) => (
            <div key={b.id} className="flex items-center gap-4 px-5 py-3 border-b border-gray-50 last:border-0">
              <div className="flex-1">
                <p className="text-sm font-medium">{b.brandName} {b.modelName}</p>
                <p className="text-xs text-secondary">{b.id.toUpperCase()} · {b.licensePlate}</p>
              </div>
              <p className="text-sm font-semibold">{formatBaht(b.deposit)}</p>
              <StatusBadge status="Held" />
            </div>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div>
        <h3 className="text-sm font-semibold text-primary mb-3">Payment History</h3>
        <DataTable columns={columns as Parameters<typeof DataTable>[0]["columns"]} data={myTx as unknown as Record<string, unknown>[]} />
      </div>

      {/* Payment Modal */}
      <Modal open={payModal} onClose={() => setPayModal(false)} title="Make Payment">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-secondary">Select your payment method to proceed.</p>
          <div className="flex flex-col gap-2">
            {[
              { method: "Credit Card", icon: <CreditCard size={16} /> },
              { method: "Bank Transfer", icon: <Building2 size={16} /> },
              { method: "PromptPay", icon: <QrCode size={16} /> },
            ].map(({ method, icon }) => (
              <button key={method} onClick={() => setPayMethod(method)}
                className={`flex items-center gap-3 border rounded-xl p-4 transition-colors ${payMethod === method ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}>
                <span className="text-secondary">{icon}</span>
                <span className="text-sm font-medium">{method}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setPayModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={() => { setPayModal(false); toast("success", `Payment via ${payMethod} completed successfully.`); }}
              className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800">Confirm Payment</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
