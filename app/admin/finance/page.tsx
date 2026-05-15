"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { transactions, chargingCosts, invoices, cars } from "@/lib/mock-data";
import { formatBaht, formatDate } from "@/lib/utils";
import type { Transaction, Invoice, ChargingCost } from "@/lib/types";

const tabs = ["Revenue", "Expenses", "Reports", "Invoices"];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("Revenue");

  const totalRevenue = transactions.filter((t) => t.status === "Completed").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = chargingCosts.reduce((s, c) => s + c.cost, 0) + 45000;

  const txColumns = [
    { key: "id", header: "Tx ID", render: (r: Transaction) => <span className="font-mono text-xs">{r.id.toUpperCase()}</span> },
    { key: "bookingId", header: "Booking", render: (r: Transaction) => <span className="font-mono text-xs">{r.bookingId.toUpperCase()}</span> },
    { key: "companyName", header: "Company" },
    { key: "type", header: "Type" },
    { key: "method", header: "Method" },
    { key: "amount", header: "Amount", render: (r: Transaction) => <span className="font-medium">{formatBaht(r.amount)}</span> },
    { key: "depositStatus", header: "Deposit", render: (r: Transaction) => r.depositStatus ? <StatusBadge status={r.depositStatus} /> : <span className="text-gray-400">—</span> },
    { key: "status", header: "Status", render: (r: Transaction) => <StatusBadge status={r.status} /> },
    { key: "date", header: "Date", render: (r: Transaction) => <span className="text-secondary">{formatDate(r.date)}</span> },
  ];

  const invColumns = [
    { key: "invoiceNumber", header: "Invoice No.", render: (r: Invoice) => <span className="font-mono text-xs font-medium">{r.invoiceNumber}</span> },
    { key: "companyName", header: "Company" },
    { key: "bookingId", header: "Booking", render: (r: Invoice) => <span className="font-mono text-xs">{r.bookingId.toUpperCase()}</span> },
    { key: "amount", header: "Amount (excl. VAT)", render: (r: Invoice) => formatBaht(r.amount) },
    { key: "vat", header: "VAT", render: (r: Invoice) => formatBaht(r.vat) },
    { key: "total", header: "Total", render: (r: Invoice) => <span className="font-semibold">{formatBaht(r.total)}</span> },
    { key: "status", header: "Status", render: (r: Invoice) => <StatusBadge status={r.status} /> },
    { key: "date", header: "Date", render: (r: Invoice) => <span className="text-secondary">{formatDate(r.date)}</span> },
    { key: "actions", header: "PDF", sortable: false, render: () => (
      <button className="flex items-center gap-1 text-tertiary hover:underline text-xs">
        <Download size={12} /> Download
      </button>
    )},
  ];

  // P&L per car
  const carPnl = cars.filter((c) => c.status !== "Sold").slice(0, 6).map((c) => {
    const rev = transactions.filter((t) => {
      const bk = t.bookingId;
      return bk && c.id;
    }).reduce((s) => s + Math.floor(Math.random() * 80000 + 20000), 0);
    const exp = c.maintenanceLogs.reduce((s, m) => s + m.cost, 0) + c.insurance.annualPremium / 12;
    return { car: c.licensePlate, model: `${c.brandName} ${c.modelName}`, rev, exp, net: rev - exp };
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-primary">Financial Management</h1>
          <p className="text-sm text-secondary mt-0.5">Revenue · Expenses · Reports · Invoices</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm w-fit">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${activeTab === tab ? "bg-black text-white" : "text-secondary hover:text-primary"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Revenue Tab */}
      {activeTab === "Revenue" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-secondary uppercase tracking-wide">Total Revenue</p>
              <p className="text-2xl font-semibold mt-1">{formatBaht(totalRevenue)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-secondary uppercase tracking-wide">Total Expenses</p>
              <p className="text-2xl font-semibold mt-1">{formatBaht(totalExpenses)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-secondary uppercase tracking-wide">Net Profit</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">{formatBaht(totalRevenue - totalExpenses)}</p>
            </div>
          </div>
          <DataTable columns={txColumns as Parameters<typeof DataTable>[0]["columns"]} data={transactions as unknown as Record<string, unknown>[]} />
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === "Expenses" && (
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold">EV Charging Costs</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs text-secondary font-medium">Car</th>
                  <th className="text-left px-4 py-3 text-xs text-secondary font-medium">RFID Card</th>
                  <th className="text-left px-4 py-3 text-xs text-secondary font-medium">Date</th>
                  <th className="text-left px-4 py-3 text-xs text-secondary font-medium">kWh</th>
                  <th className="text-left px-4 py-3 text-xs text-secondary font-medium">Cost</th>
                </tr>
              </thead>
              <tbody>
                {chargingCosts.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50">
                    <td className="px-4 py-3">{c.licensePlate}</td>
                    <td className="px-4 py-3 font-mono text-xs">{c.rfidCard}</td>
                    <td className="px-4 py-3 text-secondary">{formatDate(c.date)}</td>
                    <td className="px-4 py-3">{c.kwh} kWh</td>
                    <td className="px-4 py-3 font-medium">{formatBaht(c.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-3">Maintenance Costs</h3>
            <p className="text-sm text-secondary">Total maintenance expenses: <span className="font-semibold text-primary">{formatBaht(20000)}</span></p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-3">Insurance Costs</h3>
            <p className="text-sm text-secondary">Total annual insurance premiums: <span className="font-semibold text-primary">{formatBaht(238000)}</span></p>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === "Reports" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <input type="date" className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white" defaultValue="2026-01-01" />
              <input type="date" className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white" defaultValue="2026-05-15" />
            </div>
            <button className="flex items-center gap-2 border border-gray-200 text-sm px-3 py-2 rounded-lg hover:bg-gray-50">
              <Download size={14} /> Export CSV
            </button>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold">P&amp;L per Vehicle</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs text-secondary font-medium">Car</th>
                  <th className="text-left px-4 py-3 text-xs text-secondary font-medium">Model</th>
                  <th className="text-left px-4 py-3 text-xs text-secondary font-medium">Revenue</th>
                  <th className="text-left px-4 py-3 text-xs text-secondary font-medium">Expenses</th>
                  <th className="text-left px-4 py-3 text-xs text-secondary font-medium">Net Profit</th>
                </tr>
              </thead>
              <tbody>
                {carPnl.map((row) => (
                  <tr key={row.car} className="border-b border-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{row.car}</td>
                    <td className="px-4 py-3">{row.model}</td>
                    <td className="px-4 py-3 text-green-600">{formatBaht(row.rev)}</td>
                    <td className="px-4 py-3 text-red-500">{formatBaht(row.exp)}</td>
                    <td className={`px-4 py-3 font-semibold ${row.net >= 0 ? "text-green-600" : "text-red-500"}`}>{formatBaht(row.net)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-gray-200 bg-gray-50">
                <tr>
                  <td colSpan={2} className="px-4 py-3 font-semibold text-xs">Fleet Total</td>
                  <td className="px-4 py-3 font-semibold text-green-600">{formatBaht(carPnl.reduce((s, r) => s + r.rev, 0))}</td>
                  <td className="px-4 py-3 font-semibold text-red-500">{formatBaht(carPnl.reduce((s, r) => s + r.exp, 0))}</td>
                  <td className="px-4 py-3 font-semibold text-green-600">{formatBaht(carPnl.reduce((s, r) => s + r.net, 0))}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === "Invoices" && (
        <DataTable columns={invColumns as Parameters<typeof DataTable>[0]["columns"]} data={invoices as unknown as Record<string, unknown>[]} />
      )}
    </div>
  );
}
