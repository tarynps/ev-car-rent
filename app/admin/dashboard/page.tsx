"use client";

import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertTriangle, TrendingUp, CalendarDays, Tag, Clock, Truck, FileText, Target, DollarSign, CheckCircle2, Users } from "lucide-react";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { cars, bookings, monthlyChartData, rentToSellEntries, transactions } from "@/lib/mock-data";
import { formatBaht, formatDate, daysBetween } from "@/lib/utils";
import Link from "next/link";

const PIE_COLORS = ["#C8102E", "#A00D23", "#6B6B6B", "#FEF0F2", "#374151"];
const TODAY = "2026-05-20";

export default function AdminDashboard() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // ── Fleet Status ────────────────────────────────────────────────────────────
  const totalCars = cars.length;
  const available = cars.filter((c) => c.status === "Available").length;
  const rented = cars.filter((c) => c.status === "Rented").length;
  const maintenance = cars.filter((c) => c.status === "Maintenance").length;
  const sold = cars.filter((c) => c.status === "Sold").length;

  // ── Date-filtered bookings ──────────────────────────────────────────────────
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (dateFrom && b.createdAt < dateFrom) return false;
      if (dateTo && b.createdAt > dateTo) return false;
      return true;
    });
  }, [dateFrom, dateTo]);

  // ── Contracts metrics ───────────────────────────────────────────────────────
  const activeContracts = filteredBookings.filter((b) => b.status === "Active").length;
  const currentMonth = TODAY.slice(0, 7);
  const expiringThisMonth = filteredBookings.filter(
    (b) => b.status === "Active" && b.returnDate.startsWith(currentMonth)
  ).length;
  const newThisMonth = filteredBookings.filter((b) => b.createdAt.startsWith(currentMonth)).length;
  const avgDuration = useMemo(() => {
    const counted = filteredBookings.filter((b) => b.pickupDate && b.returnDate);
    if (counted.length === 0) return 0;
    const total = counted.reduce((sum, b) => sum + daysBetween(b.pickupDate, b.returnDate), 0);
    return Math.round(total / counted.length);
  }, [filteredBookings]);

  // ── Purchase Offer Opportunities ────────────────────────────────────────────
  const nonCompleted = rentToSellEntries.filter((r) => r.conversionStatus !== "Completed");
  const eligibleVehicles = nonCompleted.length;
  const pendingRenterConfirm = nonCompleted.filter((r) => r.conversionStatus === "Eligible").length;
  const pendingAdminApproval = nonCompleted.filter((r) => r.conversionStatus === "Renter Confirmed").length;
  const nearThreshold = nonCompleted.filter(
    (r) => r.totalPaid / r.buyoutAmount >= 0.9 || daysBetween(r.contractStart, TODAY) >= 335
  ).length;
  const totalPotentialValue = nonCompleted.reduce((sum, r) => sum + (r.buyoutAmount - r.totalPaid), 0);
  const completedConversions = rentToSellEntries.filter((r) => r.conversionStatus === "Completed").length;

  // ── Top Clients ─────────────────────────────────────────────────────────────
  const topClients = useMemo(() => {
    const map: Record<string, { companyId: string; name: string; count: number; rts: number; paid: number; models: Record<string, number> }> = {};
    filteredBookings.forEach((b) => {
      if (!map[b.companyId]) map[b.companyId] = { companyId: b.companyId, name: b.companyName, count: 0, rts: 0, paid: 0, models: {} };
      map[b.companyId].count++;
      map[b.companyId].paid += b.total;
      map[b.companyId].models[b.modelName] = (map[b.companyId].models[b.modelName] || 0) + 1;
    });
    rentToSellEntries.forEach((r) => {
      if (r.conversionStatus !== "Eligible" && map[r.companyId]) {
        map[r.companyId].rts++;
      }
    });
    return Object.values(map)
      .map((c) => ({
        ...c,
        mostPicked: Object.entries(c.models).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—",
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [filteredBookings]);

  // ── Charts ──────────────────────────────────────────────────────────────────
  const modelCounts: Record<string, number> = {};
  cars.forEach((c) => {
    const key = c.bodyType ? `${c.modelName} (${c.bodyType})` : c.modelName;
    modelCounts[key] = (modelCounts[key] || 0) + 1;
  });
  const pieData = Object.entries(modelCounts).map(([name, value]) => ({ name, value }));

  const topModels = useMemo(() => {
    const mc: Record<string, number> = {};
    cars.forEach((c) => {
      const key = c.bodyType ? `${c.modelName} (${c.bodyType})` : c.modelName;
      mc[key] = (mc[key] || 0) + 1;
    });
    return Object.entries(mc).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([model, count]) => ({ model, count }));
  }, []);

  const overdueReturns = bookings.filter((b) => b.status === "Active" && new Date(b.returnDate) < new Date(TODAY));
  const monthlyRevenue = transactions.reduce((s, t) => s + t.amount, 0);
  const yearlyRevenue = monthlyRevenue;

  const sectionLabel = "text-xs font-semibold text-secondary uppercase tracking-widest mb-3";

  return (
    <div className="flex flex-col gap-8">

      {/* Header + date filter */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-primary">Dashboard</h1>
          <p className="text-sm text-secondary mt-0.5">Fleet overview — {formatDate(TODAY)}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <CalendarDays size={14} className="text-secondary" />
          <input
            type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white text-primary"
          />
          <span className="text-secondary text-sm">to</span>
          <input
            type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white text-primary"
          />
          {(dateFrom || dateTo) && (
            <button onClick={() => { setDateFrom(""); setDateTo(""); }} className="text-xs text-tertiary hover:underline">
              All Time
            </button>
          )}
        </div>
      </div>

      {/* ── Section 1: Fleet Status ── */}
      <section>
        <p className={sectionLabel}>Fleet Status</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard label="Total Vehicles" value={totalCars} />
          <StatCard label="Available" value={available} trend={{ direction: "up", percent: 5 }} />
          <StatCard label="Rented" value={rented} trend={{ direction: "up", percent: 12 }} />
          <StatCard label="Maintenance" value={maintenance} />
          <StatCard label="Sold" value={sold} trend={{ direction: "up", percent: 3 }} />
        </div>
      </section>

      {/* ── Section 2: Contracts ── */}
      <section>
        <p className={sectionLabel}>Contracts</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-secondary mb-1"><FileText size={14} /><span className="text-xs uppercase tracking-wide font-medium">Active</span></div>
            <p className="text-3xl font-semibold">{activeContracts}</p>
            <p className="text-xs text-secondary">contracts running</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-tertiary mb-1"><Clock size={14} /><span className="text-xs uppercase tracking-wide font-medium text-secondary">Expiring</span></div>
            <p className="text-3xl font-semibold">{expiringThisMonth}</p>
            <p className="text-xs text-secondary">due this month</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-secondary mb-1"><TrendingUp size={14} /><span className="text-xs uppercase tracking-wide font-medium">New</span></div>
            <p className="text-3xl font-semibold">{newThisMonth}</p>
            <p className="text-xs text-secondary">created this month</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-secondary mb-1"><CalendarDays size={14} /><span className="text-xs uppercase tracking-wide font-medium">Avg Duration</span></div>
            <p className="text-3xl font-semibold">{avgDuration}</p>
            <p className="text-xs text-secondary">days average</p>
          </div>
        </div>
      </section>

      {/* ── Section 3: Purchase Offer Opportunities ── */}
      <section>
        <p className={sectionLabel}>Purchase Offer Opportunities</p>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-secondary mb-1"><Truck size={14} /><span className="text-xs uppercase tracking-wide font-medium">Eligible</span></div>
              <p className="text-3xl font-semibold">{eligibleVehicles}</p>
              <p className="text-xs text-secondary">vehicles flagged</p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-secondary mb-1"><Tag size={14} /><span className="text-xs uppercase tracking-wide font-medium">Renter Pending</span></div>
              <p className="text-3xl font-semibold text-tertiary">{pendingRenterConfirm}</p>
              <p className="text-xs text-secondary">awaiting renter</p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-secondary mb-1"><CheckCircle2 size={14} /><span className="text-xs uppercase tracking-wide font-medium">Admin Pending</span></div>
              <p className="text-3xl font-semibold text-tertiary">{pendingAdminApproval}</p>
              <p className="text-xs text-secondary">awaiting admin</p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-secondary mb-1"><Target size={14} /><span className="text-xs uppercase tracking-wide font-medium">Near Threshold</span></div>
              <p className="text-3xl font-semibold text-primary">{nearThreshold}</p>
              <p className="text-xs text-secondary">≥90% or &lt;30 days</p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-secondary mb-1"><DollarSign size={14} /><span className="text-xs uppercase tracking-wide font-medium">Potential Value</span></div>
              <p className="text-xl font-semibold leading-tight">{formatBaht(totalPotentialValue)}</p>
              <p className="text-xs text-secondary">remaining buyout</p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-secondary mb-1"><CheckCircle2 size={14} /><span className="text-xs uppercase tracking-wide font-medium">Completed</span></div>
              <p className="text-3xl font-semibold text-primary">{completedConversions}</p>
              <p className="text-xs text-secondary">conversions done</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50">
            <p className="text-xs text-secondary">Conversion pipeline: <span className="text-primary font-medium">Eligible → Renter Confirmed → Admin Confirmed → Completed</span></p>
          </div>
        </div>
      </section>

      {/* ── Section 4: Top Clients ── */}
      <section>
        <p className={sectionLabel}>Top Clients</p>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100">
            <Users size={14} className="text-secondary" />
            <span className="text-sm font-semibold text-primary">Top {topClients.length} Companies by Rentals</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs text-secondary font-medium">#</th>
                  <th className="text-left px-4 py-3 text-xs text-secondary font-medium">Company</th>
                  <th className="text-right px-4 py-3 text-xs text-secondary font-medium whitespace-nowrap">Vehicles Rented</th>
                  <th className="text-right px-4 py-3 text-xs text-secondary font-medium whitespace-nowrap">Accepted Rent-to-Sell</th>
                  <th className="text-right px-4 py-3 text-xs text-secondary font-medium whitespace-nowrap">Total Paid (฿)</th>
                  <th className="text-left px-4 py-3 text-xs text-secondary font-medium whitespace-nowrap">Most-Picked Model</th>
                </tr>
              </thead>
              <tbody>
                {topClients.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-secondary text-sm">No data in selected range.</td></tr>
                ) : topClients.map((c, i) => (
                  <tr key={c.companyId} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-secondary text-xs">{i + 1}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/companies/${c.companyId}`} className="font-medium text-primary hover:text-tertiary transition-colors">
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{c.count}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={c.rts > 0 ? "font-semibold text-tertiary" : "text-secondary"}>{c.rts}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatBaht(c.paid)}</td>
                    <td className="px-4 py-3 text-secondary">{c.mostPicked}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Revenue + Charts ── */}
      <section>
        <p className={sectionLabel}>Revenue & Activity</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <StatCard label="Total Revenue (All Time)" value={formatBaht(monthlyRevenue)} trend={{ direction: "up", percent: 8 }} accent />
          <StatCard label="Yearly Revenue (YTD)" value={formatBaht(yearlyRevenue)} trend={{ direction: "up", percent: 15 }} accent />
          <StatCard label="Conversions Completed" value={completedConversions} trend={{ direction: "up", percent: 0 }} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[{ label: "Pick-ups", value: 7 }, { label: "Returns", value: 4 }, { label: "New Bookings", value: newThisMonth }, { label: "Conversions", value: completedConversions }].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-secondary uppercase tracking-wide">{label}</p>
              <p className="text-3xl font-semibold mt-1">{value}</p>
              <p className="text-xs text-secondary mt-0.5">This month</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-primary mb-4">Fleet by Model</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
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

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col">
            <h3 className="text-sm font-semibold text-primary mb-4">Income vs Expense (6 months)</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData} barSize={12}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `฿${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => formatBaht(Number(v))} />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#C8102E" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="expense" name="Expense" fill="#D1D5DB" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ── Top Models + Overdue ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-primary mb-4">Top-Picked Models</h3>
          <div className="flex flex-col gap-2">
            {topModels.map((m, i) => (
              <div key={m.model} className="flex items-center gap-2">
                <span className="text-xs text-secondary w-4">{i + 1}.</span>
                <div className="flex-1">
                  <p className="text-sm text-primary">{m.model}</p>
                  <div className="h-1 bg-gray-100 rounded-full mt-1">
                    <div className="h-1 bg-tertiary rounded-full" style={{ width: `${(m.count / topModels[0].count) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs font-medium text-secondary">{m.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
            <AlertTriangle size={15} className="text-tertiary" />
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
      </div>
    </div>
  );
}
