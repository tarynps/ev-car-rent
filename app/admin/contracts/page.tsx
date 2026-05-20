"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Eye, Plus } from "lucide-react";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { contracts, companies } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import type { Contract } from "@/lib/types";

export default function ContractsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [contractTypeFilter, setContractTypeFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => contracts.filter((c) => {
    if (statusFilter && c.status !== statusFilter) return false;
    if (companyFilter && c.companyId !== companyFilter) return false;
    if (contractTypeFilter && c.contractType !== contractTypeFilter) return false;
    if (dateFrom && c.pickupDate < dateFrom) return false;
    if (dateTo && c.pickupDate > dateTo) return false;
    return true;
  }), [statusFilter, companyFilter, contractTypeFilter, dateFrom, dateTo]);

  const columns = [
    { key: "id", header: "Contract ID", render: (r: Contract) => (
      <Link href={`/admin/contracts/${r.id}`} className="font-mono text-xs font-semibold text-ev-primary hover:underline">{r.id.toUpperCase()}</Link>
    )},
    { key: "companyName", header: "Company" },
    { key: "renterName", header: "Renter" },
    { key: "vehicleGroups", header: "Car Types", render: (r: Contract) => (
      <div className="flex flex-col gap-0.5">
        {r.vehicleGroups.map((g, i) => (
          <span key={i} className="text-xs text-ev-muted">{g.carType}</span>
        ))}
      </div>
    )},
    { key: "quantities", header: "Qty per Type", render: (r: Contract) => (
      <div className="flex flex-col gap-0.5">
        {r.vehicleGroups.map((g, i) => (
          <span key={i} className="text-xs font-medium">{g.carType} × {g.quantity}</span>
        ))}
      </div>
    )},
    { key: "status", header: "Status", render: (r: Contract) => <StatusBadge status={r.status} /> },
    { key: "pickupDate", header: "Pick-up", render: (r: Contract) => <span className="text-sm text-ev-muted">{formatDate(r.pickupDate)}</span> },
    { key: "returnDate", header: "Return", render: (r: Contract) => <span className="text-sm text-ev-muted">{formatDate(r.returnDate)}</span> },
    { key: "actions", header: "Actions", sortable: false, render: (r: Contract) => (
      <Link href={`/admin/contracts/${r.id}`} className="flex items-center gap-1 text-ev-muted hover:text-ev-black text-xs">
        <Eye size={13} /> View
      </Link>
    )},
  ];

  const totalVehicles = contracts.reduce((sum, c) => sum + c.vehicleGroups.reduce((s, g) => s + g.quantity, 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ev-black">Contract Management</h1>
          <p className="text-sm text-ev-muted mt-0.5">{contracts.length} contracts — {totalVehicles} vehicles total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-ev-surface text-ev-black">
          <option value="">All Statuses</option>
          {["Pending", "Confirmed", "Active", "Expiring Soon", "Expired", "Terminated"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-ev-surface text-ev-black">
          <option value="">All Companies</option>
          {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={contractTypeFilter} onChange={(e) => setContractTypeFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-ev-surface text-ev-black">
          <option value="">All Types</option>
          <option>Rent-and-Return</option>
          <option>Rent-with-Purchase-Option</option>
        </select>
        <div className="flex items-center gap-1">
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-ev-surface" />
          <span className="text-xs text-ev-muted">→</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-ev-surface" />
        </div>
        {(statusFilter || companyFilter || contractTypeFilter || dateFrom || dateTo) && (
          <button onClick={() => { setStatusFilter(""); setCompanyFilter(""); setContractTypeFilter(""); setDateFrom(""); setDateTo(""); }}
            className="text-xs text-ev-primary hover:underline">Clear</button>
        )}
      </div>

      <DataTable columns={columns as Parameters<typeof DataTable>[0]["columns"]} data={filtered as unknown as Record<string, unknown>[]} />
    </div>
  );
}
