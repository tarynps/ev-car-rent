"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { bookings as allBookings, companies } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import type { Booking } from "@/lib/types";

export default function BookingsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [contractFilter, setContractFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => allBookings.filter((b) => {
    if (statusFilter && b.status !== statusFilter) return false;
    if (companyFilter && b.companyId !== companyFilter) return false;
    if (contractFilter && b.contractType !== contractFilter) return false;
    if (dateFrom && b.pickupDate < dateFrom) return false;
    if (dateTo && b.pickupDate > dateTo) return false;
    return true;
  }), [statusFilter, companyFilter, contractFilter, dateFrom, dateTo]);

  const columns = [
    { key: "id", header: "Booking ID", render: (r: Booking) => (
      <span className="font-mono text-xs font-medium">{r.id.toUpperCase()}</span>
    )},
    { key: "companyName", header: "Company" },
    { key: "renterName", header: "Renter" },
    { key: "licensePlate", header: "Car", render: (r: Booking) => (
      <Link href={`/admin/fleet/${r.carId}`} className="text-tertiary hover:underline text-xs">{r.licensePlate}</Link>
    )},
    { key: "status", header: "Status", render: (r: Booking) => <StatusBadge status={r.status} /> },
    { key: "pickupDate", header: "Pick-up", render: (r: Booking) => <span className="text-secondary">{formatDate(r.pickupDate)}</span> },
    { key: "returnDate", header: "Return", render: (r: Booking) => <span className="text-secondary">{formatDate(r.returnDate)}</span> },
    { key: "contractType", header: "Contract", render: (r: Booking) => <span className="text-xs">{r.contractType}</span> },
    { key: "actions", header: "Actions", sortable: false, render: (r: Booking) => (
      <Link href={`/admin/bookings/${r.id}`} className="flex items-center gap-1 text-secondary hover:text-primary text-xs">
        <Eye size={13} /> View
      </Link>
    )},
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-primary">Booking Management</h1>
        <p className="text-sm text-secondary mt-0.5">{allBookings.length} total bookings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white">
          <option value="">All Statuses</option>
          {["Pending", "Confirmed", "Active", "Completed", "Cancelled"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white">
          <option value="">All Companies</option>
          {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={contractFilter} onChange={(e) => setContractFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white">
          <option value="">All Contracts</option>
          <option>Rent-and-Return</option>
          <option>Rent-to-Sell</option>
        </select>
        <div className="flex items-center gap-1 text-xs text-secondary">
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white" />
          <span>→</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white" />
        </div>
        {(statusFilter || companyFilter || contractFilter || dateFrom || dateTo) && (
          <button onClick={() => { setStatusFilter(""); setCompanyFilter(""); setContractFilter(""); setDateFrom(""); setDateTo(""); }}
            className="text-xs text-tertiary hover:underline">Clear</button>
        )}
      </div>

      <DataTable columns={columns as Parameters<typeof DataTable>[0]["columns"]} data={filtered as unknown as Record<string, unknown>[]} />
    </div>
  );
}
