"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Award, Truck } from "lucide-react";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { cars, contracts, companies, purchaseOffers, monthlyChartData } from "@/lib/mock-data";
import { formatBaht } from "@/lib/utils";
import Link from "next/link";
import { chartColors } from "@/lib/design-system";

export default function AdminDashboard() {
  // Fleet stats
  const totalCars = cars.length;
  const available = cars.filter((c) => c.status === "Available").length;
  const rented = cars.filter((c) => c.status === "Rented").length;
  const maintenance = cars.filter((c) => c.status === "Maintenance").length;
  const sold = cars.filter((c) => c.status === "Sold").length;

  // Contract stats
  const activeContracts = contracts.filter((c) => c.status === "Active").length;
  const pendingContracts = contracts.filter((c) => c.status === "Pending").length;
  const expiringSoon = contracts.filter((c) => c.status === "Expiring Soon").length;
  const expired = contracts.filter((c) => c.status === "Expired").length;

  // Vehicle type breakdown for rented
  const typeBreakdown: Record<string, number> = {};
  cars.filter((c) => c.status === "Rented").forEach((c) => {
    typeBreakdown[c.carType] = (typeBreakdown[c.carType] || 0) + 1;
  });

  // Financial
  const currentMonthData = monthlyChartData[monthlyChartData.length - 1];
  const income = currentMonthData.income;
  const expense = currentMonthData.expense;
  const netProfit = income - expense;

  // Top clients by vehicles rented
  const topClients = [...companies]
    .filter((c) => c.status === "Active")
    .sort((a, b) => b.totalVehiclesRented - a.totalVehiclesRented)
    .slice(0, 4);

  // Popular models by contracts
  const modelCounts: Record<string, number> = {};
  contracts.forEach((c) => c.vehicleGroups.forEach((g) => {
    modelCounts[g.modelName] = (modelCounts[g.modelName] || 0) + g.quantity;
  }));
  const topModels = Object.entries(modelCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const maxModelCount = topModels[0]?.[1] || 1;

  // Purchase offer opportunities
  const offerOpportunities = purchaseOffers.filter((p) => p.conversionStatus === "Eligible");

  // Activity this month
  const newContracts = contracts.filter((c) => c.createdAt >= "2026-05-01").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-ev-black">Dashboard</h1>
        <p className="text-sm text-ev-muted mt-0.5">Fleet overview — 20 May 2026</p>
      </div>

      {/* Fleet stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Total Vehicles" value={totalCars} />
        <StatCard label="Available" value={available} trend={{ direction: "up", percent: 5 }} />
        <StatCard label="Rented" value={rented} trend={{ direction: "up", percent: 12 }} />
        <StatCard label="Maintenance" value={maintenance} />
        <StatCard label="Sold" value={sold} />
      </div>

      {/* Contract status */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Active Contracts", value: activeContracts, color: "text-[#1E40AF]" },
          { label: "Pending Start", value: pendingContracts, color: "text-[#92400E]" },
          { label: "Expiring Soon", value: expiringSoon, color: "text-amber-600" },
          { label: "Expired", value: expired, color: "text-ev-muted" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-ev-surface border border-gray-100 rounded-xl px-4 py-3">
            <p className="text-[11px] text-ev-muted">{label}</p>
            <p className={`text-2xl font-semibold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Purchase offer alert */}
      {offerOpportunities.length > 0 && (
        <div className="bg-ev-primary-tint border border-ev-primary/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Award size={16} className="text-ev-primary" />
            <h2 className="text-sm font-semibold text-ev-primary">Purchase Offer Opportunities ({offerOpportunities.length})</h2>
          </div>
          <div className="flex flex-col gap-2">
            {offerOpportunities.map((offer) => (
              <div key={offer.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5">
                <div>
                  <p className="text-sm font-medium text-ev-black">JAC {offer.modelName} — {offer.licensePlate}</p>
                  <p className="text-xs text-ev-muted">{offer.companyName} · {offer.carType}</p>
                </div>
                <Link href="/admin/purchase-offers" className="text-xs bg-ev-primary hover:bg-ev-primary-dark text-white px-3 py-1.5 rounded-lg transition-colors">
                  Send Offer
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Financial summary */}
        <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-ev-black mb-4">Financial Summary — May 2026</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "Income", value: formatBaht(income), color: "text-[#166534]" },
              { label: "Expense", value: formatBaht(expense), color: "text-ev-primary" },
              { label: "Net Profit", value: formatBaht(netProfit), color: "text-ev-black" },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <p className="text-[11px] text-ev-muted">{label}</p>
                <p className={`text-base font-semibold mt-0.5 ${color}`}>{value}</p>
              </div>
            ))}
          </div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#6B6B6B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#6B6B6B" }} tickFormatter={(v) => `฿${(v / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(v) => formatBaht(Number(v ?? 0))} />
                <Bar dataKey="income" fill={chartColors.revenue} radius={[2, 2, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill={chartColors.expense} radius={[2, 2, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular vehicles */}
        <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-ev-black mb-4">Popular Models</h2>
          <div className="flex flex-col gap-3">
            {topModels.map(([model, count]) => (
              <div key={model} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                  <Truck size={14} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-0.5">
                    <span className="text-sm font-medium text-ev-black truncate">JAC {model}</span>
                    <span className="text-sm font-semibold text-ev-black shrink-0">{count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-ev-primary rounded-full" style={{ width: `${(count / maxModelCount) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top clients */}
        <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-ev-black">Top Clients</h2>
            <Link href="/admin/clients" className="text-xs text-ev-primary hover:underline">View all</Link>
          </div>
          <div className="flex flex-col gap-3">
            {topClients.map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <div>
                  <Link href={`/admin/clients/${c.id}`} className="text-sm font-medium text-ev-black hover:text-ev-primary transition-colors">{c.name}</Link>
                  <p className="text-xs text-ev-muted">{c.industry} · {c.activeContracts} contracts</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-ev-black">{c.totalVehiclesRented}</p>
                  <p className="text-[10px] text-ev-muted">vehicles</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity this month */}
        <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-ev-black mb-4">Activity This Month</h2>
          <div className="flex flex-col gap-3">
            {[
              { label: "New contracts started", value: newContracts },
              { label: "Contracts expiring soon", value: expiringSoon },
              { label: "Pending approval requests", value: pendingContracts },
              { label: "Vehicles in maintenance", value: maintenance },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-ev-muted">{label}</span>
                <span className="text-sm font-semibold text-ev-black">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fleet by type */}
      <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-ev-black mb-4">Vehicles Currently Rented by Type</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(typeBreakdown).map(([type, count]) => (
            <div key={type} className="border border-gray-100 rounded-lg px-3 py-3 text-center">
              <p className="text-xl font-semibold text-ev-black">{count}</p>
              <p className="text-[11px] text-ev-muted mt-0.5">{type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
