"use client";

import { useState } from "react";
import { Download, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { transactions, chargingCosts, invoices, companies, monthlyChartData, cars } from "@/lib/mock-data";
import { formatBaht, formatDate } from "@/lib/utils";
import { chartColors } from "@/lib/design-system";
import type { Transaction, Invoice } from "@/lib/types";

const TABS = ["Overview", "Revenue", "Expenses", "Reports", "Invoices"] as const;
type Tab = typeof TABS[number];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const totalRevenue = transactions.filter((t) => t.status === "Completed").reduce((s, t) => s + t.amount, 0);
  const totalCharging = chargingCosts.reduce((s, c) => s + c.cost, 0);
  const totalMaintenance = cars.reduce((s, c) => s + c.maintenanceLogs.reduce((ms, m) => ms + m.cost, 0), 0);
  const totalInsurance = cars.reduce((s, c) => s + c.insurance.annualPremium / 12, 0);
  const totalExpenses = totalCharging + totalMaintenance + Math.round(totalInsurance);
  const netProfit = totalRevenue - totalExpenses;

  const currentMonth = monthlyChartData[monthlyChartData.length - 1];
  const prevMonth = monthlyChartData[monthlyChartData.length - 2];
  const revenueChange = prevMonth ? Math.round(((currentMonth.income - prevMonth.income) / prevMonth.income) * 100) : 0;

  // Top clients by total paid
  const clientRevenue = companies.filter((c) => c.status === "Active").map((c) => ({
    name: c.name,
    total: transactions.filter((t) => t.companyName === c.name && t.status === "Completed").reduce((s, t) => s + t.amount, 0),
    contracts: c.activeContracts,
  })).sort((a, b) => b.total - a.total);

  // P&L per vehicle (top 8)
  const carPnl = cars.filter((c) => c.status !== "Sold").slice(0, 8).map((c) => {
    const rev = transactions.find((t) => t.contractId === c.currentContractId)?.amount ?? 0;
    const exp = c.maintenanceLogs.reduce((s, m) => s + m.cost, 0) + Math.round(c.insurance.annualPremium / 12);
    return { car: c.licensePlate, model: `JAC ${c.modelName}`, rev, exp, net: rev - exp };
  });

  const txColumns = [
    { key: "id", header: "Tx ID", render: (r: Transaction) => <span className="font-mono text-xs">{r.id.toUpperCase()}</span> },
    { key: "contractId", header: "Contract", render: (r: Transaction) => <span className="font-mono text-xs">{r.contractId.toUpperCase()}</span> },
    { key: "companyName", header: "Company" },
    { key: "type", header: "Type" },
    { key: "method", header: "Method" },
    { key: "amount", header: "Amount", render: (r: Transaction) => <span className="font-medium">{formatBaht(r.amount)}</span> },
    { key: "depositStatus", header: "Deposit", render: (r: Transaction) => r.depositStatus ? <StatusBadge status={r.depositStatus} /> : <span className="text-gray-400">—</span> },
    { key: "status", header: "Status", render: (r: Transaction) => <StatusBadge status={r.status} /> },
    { key: "date", header: "Date", render: (r: Transaction) => <span className="text-ev-muted">{formatDate(r.date)}</span> },
  ];

  const invColumns = [
    { key: "invoiceNumber", header: "Invoice No.", render: (r: Invoice) => <span className="font-mono text-xs font-medium">{r.invoiceNumber}</span> },
    { key: "companyName", header: "Company" },
    { key: "contractId", header: "Contract", render: (r: Invoice) => <span className="font-mono text-xs">{r.contractId.toUpperCase()}</span> },
    { key: "amount", header: "Amount (excl. VAT)", render: (r: Invoice) => formatBaht(r.amount) },
    { key: "vat", header: "VAT", render: (r: Invoice) => formatBaht(r.vat) },
    { key: "total", header: "Total", render: (r: Invoice) => <span className="font-semibold">{formatBaht(r.total)}</span> },
    { key: "status", header: "Status", render: (r: Invoice) => <StatusBadge status={r.status} /> },
    { key: "date", header: "Date", render: (r: Invoice) => <span className="text-ev-muted">{formatDate(r.date)}</span> },
    { key: "pdf", header: "PDF", sortable: false, render: () => (
      <button className="flex items-center gap-1 text-ev-primary hover:underline text-xs">
        <Download size={12} /> Download
      </button>
    )},
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ev-black">Financial Management</h1>
          <p className="text-sm text-ev-muted mt-0.5">Revenue · Expenses · Reports · Invoices</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gray-100 gap-1">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === tab ? "border-ev-primary text-ev-primary" : "border-transparent text-ev-muted hover:text-ev-black"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "Overview" && (
        <div className="flex flex-col gap-5">
          {/* KPI row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Revenue", value: formatBaht(totalRevenue), sub: "All time completed", color: "text-[#166534]" },
              { label: "Total Expenses", value: formatBaht(totalExpenses), sub: "Charging + maintenance", color: "text-ev-primary" },
              { label: "Net Profit", value: formatBaht(netProfit), sub: "Revenue − Expenses", color: "text-ev-black" },
              { label: "This Month", value: formatBaht(currentMonth.income), sub: revenueChange >= 0 ? `↑ ${revenueChange}% vs last month` : `↓ ${Math.abs(revenueChange)}% vs last month`, color: revenueChange >= 0 ? "text-[#166534]" : "text-ev-primary" },
            ].map(({ label, value, sub, color }) => (
              <div key={label} className="bg-ev-surface border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-ev-muted">{label}</p>
                <p className={`text-xl font-semibold mt-1 ${color}`}>{value}</p>
                <p className="text-[10px] text-ev-muted mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* Chart + top clients */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-ev-black mb-4">Monthly Revenue vs Expenses</h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#6B6B6B" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#6B6B6B" }} tickFormatter={(v) => `฿${(v / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(v) => formatBaht(Number(v ?? 0))} />
                    <Bar dataKey="income" fill={chartColors.revenue} radius={[2, 2, 0, 0]} name="Revenue" />
                    <Bar dataKey="expense" fill={chartColors.expense} radius={[2, 2, 0, 0]} name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-ev-black mb-4">Revenue by Client</h2>
              <div className="flex flex-col gap-3">
                {clientRevenue.filter((c) => c.total > 0).map((c) => (
                  <div key={c.name} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-medium text-ev-black truncate">{c.name}</span>
                        <span className="text-sm font-semibold text-ev-black shrink-0 ml-2">{formatBaht(c.total)}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-ev-primary rounded-full"
                          style={{ width: `${Math.round((c.total / clientRevenue[0].total) * 100)}%` }} />
                      </div>
                    </div>
                    <span className="text-xs text-ev-muted shrink-0">{c.contracts} contract{c.contracts !== 1 ? "s" : ""}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Expense breakdown */}
          <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-ev-black mb-4">Expense Breakdown</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "EV Charging", value: totalCharging, icon: TrendingDown },
                { label: "Maintenance", value: totalMaintenance, icon: TrendingDown },
                { label: "Insurance (monthly)", value: Math.round(totalInsurance), icon: TrendingDown },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Icon size={12} className="text-ev-muted" />
                    <p className="text-xs text-ev-muted">{label}</p>
                  </div>
                  <p className="text-lg font-semibold text-ev-black">{formatBaht(value)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === "Revenue" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-ev-surface border border-gray-100 rounded-xl p-4">
              <p className="text-xs text-ev-muted uppercase tracking-wide">Total Revenue</p>
              <p className="text-2xl font-semibold text-[#166534] mt-1">{formatBaht(totalRevenue)}</p>
            </div>
            <div className="bg-ev-surface border border-gray-100 rounded-xl p-4">
              <p className="text-xs text-ev-muted uppercase tracking-wide">This Month</p>
              <p className="text-2xl font-semibold text-ev-black mt-1">{formatBaht(currentMonth.income)}</p>
            </div>
            <div className="bg-ev-surface border border-gray-100 rounded-xl p-4">
              <p className="text-xs text-ev-muted uppercase tracking-wide">Pending</p>
              <p className="text-2xl font-semibold text-ev-black mt-1">
                {formatBaht(transactions.filter((t) => t.status === "Pending").reduce((s, t) => s + t.amount, 0))}
              </p>
            </div>
          </div>
          <DataTable columns={txColumns as Parameters<typeof DataTable>[0]["columns"]} data={transactions as unknown as Record<string, unknown>[]} />
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === "Expenses" && (
        <div className="flex flex-col gap-4">
          <div className="bg-ev-surface border border-gray-100 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-ev-black">EV Charging Costs</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  {["Vehicle", "RFID Card", "Date", "kWh", "Cost"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-ev-muted font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chargingCosts.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{c.licensePlate}</td>
                    <td className="px-4 py-3 font-mono text-xs text-ev-muted">{c.rfidCard}</td>
                    <td className="px-4 py-3 text-ev-muted">{formatDate(c.date)}</td>
                    <td className="px-4 py-3">{c.kwh} kWh</td>
                    <td className="px-4 py-3 font-medium">{formatBaht(c.cost)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-gray-200 bg-gray-50">
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-xs font-semibold text-ev-muted">Total</td>
                  <td className="px-4 py-2 font-semibold">{formatBaht(totalCharging)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-ev-black mb-2">Maintenance Costs</h3>
              <p className="text-2xl font-semibold text-ev-black mt-1">{formatBaht(totalMaintenance)}</p>
              <p className="text-xs text-ev-muted mt-1">Across all active fleet vehicles</p>
            </div>
            <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-ev-black mb-2">Insurance (Monthly)</h3>
              <p className="text-2xl font-semibold text-ev-black mt-1">{formatBaht(Math.round(totalInsurance))}</p>
              <p className="text-xs text-ev-muted mt-1">Pro-rated from annual premiums</p>
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === "Reports" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <input type="date" className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-ev-surface" defaultValue="2026-01-01" />
              <input type="date" className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-ev-surface" defaultValue="2026-05-20" />
            </div>
            <button className="flex items-center gap-2 border border-gray-200 text-sm px-3 py-2 rounded-lg hover:bg-gray-50">
              <Download size={14} /> Export CSV
            </button>
          </div>
          <div className="bg-ev-surface border border-gray-100 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-ev-black">P&amp;L per Vehicle</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  {["Vehicle", "Model", "Revenue", "Expenses", "Net Profit"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-ev-muted font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {carPnl.map((row) => (
                  <tr key={row.car} className="border-b border-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{row.car}</td>
                    <td className="px-4 py-3">{row.model}</td>
                    <td className="px-4 py-3 text-[#166534]">{formatBaht(row.rev)}</td>
                    <td className="px-4 py-3 text-ev-primary">{formatBaht(row.exp)}</td>
                    <td className={`px-4 py-3 font-semibold ${row.net >= 0 ? "text-[#166534]" : "text-ev-primary"}`}>{formatBaht(row.net)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-gray-200 bg-gray-50">
                <tr>
                  <td colSpan={2} className="px-4 py-3 font-semibold text-xs text-ev-muted">Fleet Total</td>
                  <td className="px-4 py-3 font-semibold text-[#166534]">{formatBaht(carPnl.reduce((s, r) => s + r.rev, 0))}</td>
                  <td className="px-4 py-3 font-semibold text-ev-primary">{formatBaht(carPnl.reduce((s, r) => s + r.exp, 0))}</td>
                  <td className="px-4 py-3 font-semibold text-[#166534]">{formatBaht(carPnl.reduce((s, r) => s + r.net, 0))}</td>
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
