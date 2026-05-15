"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertTriangle, Check } from "lucide-react";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { cars, bookings, monthlyChartData } from "@/lib/mock-data";
import { formatBaht, formatDate } from "@/lib/utils";
import Link from "next/link";

const PIE_COLORS = ["#000000", "#0064FF", "#5F5F5F", "#BFDBFE", "#374151"];

export default function AdminDashboard() {
  const [pendingBookings, setPendingBookings] = useState(bookings.filter((b) => b.status === "Pending"));

  const totalCars = cars.filter((c) => c.status !== "Sold").length;
  const available = cars.filter((c) => c.status === "Available").length;
  const rented = cars.filter((c) => c.status === "Rented").length;
  const maintenance = cars.filter((c) => c.status === "Maintenance").length;
  const sold = cars.filter((c) => c.status === "Sold").length;
  const monthlyRevenue = 340291;
  const yearlyRevenue = 1104267;

  const brandCounts: Record<string, number> = {};
  cars.forEach((c) => { brandCounts[c.brandName] = (brandCounts[c.brandName] || 0) + 1; });
  const pieData = Object.entries(brandCounts).map(([name, value]) => ({ name, value }));

  const topModels = [
    { model: "Tesla Model 3 LR", count: 4 },
    { model: "BYD Atto 3", count: 3 },
    { model: "MG EP", count: 2 },
    { model: "Ora Good Cat", count: 2 },
    { model: "Neta V Pro", count: 2 },
  ];

  const overdueReturns = bookings.filter((b) => b.status === "Active" && new Date(b.returnDate) < new Date("2026-05-15"));

  function approveBooking(id: string) {
    setPendingBookings((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-primary">Dashboard</h1>
        <p className="text-sm text-secondary mt-0.5">Fleet overview — 15 May 2026</p>
      </div>

      {/* Fleet Status */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary">Fleet Status</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard label="Total Cars" value={totalCars} />
          <StatCard label="Available" value={available} trend={{ direction: "up", percent: 5 }} />
          <StatCard label="Rented" value={rented} trend={{ direction: "up", percent: 12 }} />
          <StatCard label="Maintenance" value={maintenance} />
          <StatCard label="Sold" value={sold} trend={{ direction: "up", percent: 3 }} />
        </div>
      </div>

      {/* Financial Summary */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary">Financial Summary</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StatCard label="Monthly Revenue" value={formatBaht(monthlyRevenue)} trend={{ direction: "up", percent: 8 }} accent />
          <StatCard label="Yearly Revenue (YTD)" value={formatBaht(yearlyRevenue)} trend={{ direction: "up", percent: 15 }} accent />
        </div>
      </div>

      {/* Monthly Activity */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary">Monthly Activity</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-secondary uppercase tracking-wide">Pick-ups</p>
            <p className="text-3xl font-semibold mt-1">7</p>
            <p className="text-xs text-secondary mt-0.5">This month</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-secondary uppercase tracking-wide">Returns</p>
            <p className="text-3xl font-semibold mt-1">4</p>
            <p className="text-xs text-secondary mt-0.5">This month</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-secondary uppercase tracking-wide">New Bookings</p>
            <p className="text-3xl font-semibold mt-1">5</p>
            <p className="text-xs text-secondary mt-0.5">This month</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-secondary uppercase tracking-wide">Conversions</p>
            <p className="text-3xl font-semibold mt-1">1</p>
            <p className="text-xs text-secondary mt-0.5">This month</p>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary">Analytics</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-primary mb-4">Fleet by Brand</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2">
              {pieData.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-secondary">{entry.name}</span>
                  <span className="font-medium ml-auto pl-3">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-primary mb-4">Income vs Expense (6 months)</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={monthlyChartData} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `฿${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => formatBaht(Number(v))} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#000000" radius={[3, 3, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#BFDBFE" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      </div>

      {/* Top models + overdue + pending */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top models */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-primary mb-4">Top-Picked Models</h3>
          <div className="flex flex-col gap-2">
            {topModels.map((m, i) => (
              <div key={m.model} className="flex items-center gap-2">
                <span className="text-xs text-secondary w-4">{i + 1}.</span>
                <div className="flex-1">
                  <p className="text-sm text-primary">{m.model}</p>
                  <div className="h-1 bg-gray-100 rounded-full mt-1">
                    <div className="h-1 bg-black rounded-full" style={{ width: `${(m.count / topModels[0].count) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs font-medium text-secondary">{m.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Overdue returns */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
            <AlertTriangle size={15} className="text-orange-400" />
            Overdue Returns
          </h3>
          {overdueReturns.length === 0 ? (
            <p className="text-sm text-secondary">No overdue returns.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {overdueReturns.map((b) => (
                <div key={b.id} className="flex flex-col gap-0.5 pb-2 border-b border-gray-50 last:border-0 last:pb-0">
                  <p className="text-sm font-medium">{b.modelName}</p>
                  <p className="text-xs text-secondary">{b.licensePlate} · {b.companyName}</p>
                  <p className="text-xs text-red-500">Due: {formatDate(b.returnDate)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending approvals */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-primary mb-4">Pending Approvals</h3>
          {pendingBookings.length === 0 ? (
            <p className="text-sm text-secondary">All caught up!</p>
          ) : (
            <div className="flex flex-col gap-2">
              {pendingBookings.map((b) => (
                <div key={b.id} className="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{b.companyName}</p>
                    <p className="text-xs text-secondary">{b.modelName} · {b.id.toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{formatDate(b.pickupDate)} → {formatDate(b.returnDate)}</p>
                  </div>
                  <button
                    onClick={() => approveBooking(b.id)}
                    className="flex items-center gap-1 bg-black text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Check size={11} />
                    Approve
                  </button>
                </div>
              ))}
              <Link href="/admin/approvals" className="text-xs text-tertiary hover:underline mt-1 inline-block">
                View all approvals →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
