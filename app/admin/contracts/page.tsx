"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { contracts } from "@/lib/mock-data";
import { formatDate, formatBaht } from "@/lib/utils";

const STATUS_OPTIONS = ["All", "Active", "Pending", "Confirmed", "Completed", "Cancelled"] as const;
const TYPE_OPTIONS = ["All", "Rent-and-Return", "Rent-to-Sell"] as const;

export default function ContractsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = contracts.filter((c) => {
    if (statusFilter !== "All" && c.status !== statusFilter) return false;
    if (typeFilter !== "All" && c.contractType !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!c.id.toLowerCase().includes(q) && !c.companyName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-primary">Contracts</h1>
        <p className="text-sm text-secondary mt-0.5">{contracts.length} total contracts</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID or company…"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-56"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          {TYPE_OPTIONS.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-secondary">Contract ID</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-secondary">Company</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-secondary">Models</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-secondary">Vehicles</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-secondary">Start</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-secondary">End</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-secondary">Type</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-secondary">Total</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-secondary">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const vehicleCount = c.lines.reduce((sum, l) => sum + l.assignedCars.length, 0);
                return (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs font-semibold text-tertiary">{c.id.toUpperCase()}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-primary">{c.companyName}</p>
                      <p className="text-xs text-secondary">{c.contactName}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-0.5">
                        {c.lines.map((l, i) => (
                          <span key={i} className="text-xs text-secondary">
                            {l.modelName}{l.bodyType ? ` (${l.bodyType})` : ""}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-primary font-medium">{vehicleCount}</td>
                    <td className="px-5 py-3.5 text-secondary">{formatDate(c.startDate)}</td>
                    <td className="px-5 py-3.5 text-secondary">{formatDate(c.endDate)}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-secondary">{c.contractType}</span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-primary">{formatBaht(c.total)}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/contracts/${c.id}`} className="text-xs text-tertiary hover:underline">
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center text-secondary text-sm">No contracts match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
