"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { companies } from "@/lib/mock-data";
import type { Company } from "@/lib/types";

export default function ClientsPage() {
  const columns = [
    { key: "name", header: "Company Name", render: (r: Company) => (
      <Link href={`/admin/clients/${r.id}`} className="font-medium text-ev-black hover:text-ev-primary transition-colors">{r.name}</Link>
    )},
    { key: "industry", header: "Industry", render: (r: Company) => (
      <span className="text-sm text-ev-muted">{r.industry}</span>
    )},
    { key: "contactName", header: "Contact Person" },
    { key: "activeContracts", header: "Active Contracts", render: (r: Company) => (
      <span className="font-medium text-ev-black">{r.activeContracts}</span>
    )},
    { key: "totalVehiclesRented", header: "Vehicles", render: (r: Company) => (
      <span className="font-medium text-ev-black">{r.totalVehiclesRented}</span>
    )},
    { key: "kycStatus", header: "KYC", render: (r: Company) => <StatusBadge status={r.kycStatus} /> },
    { key: "actions", header: "Actions", sortable: false, render: (r: Company) => (
      <Link href={`/admin/clients/${r.id}`} className="flex items-center gap-1 text-ev-muted hover:text-ev-black text-xs">
        <Eye size={13} /> View
      </Link>
    )},
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-ev-black">Client Management</h1>
        <p className="text-sm text-ev-muted mt-0.5">{companies.length} clients registered</p>
      </div>
      <DataTable columns={columns as Parameters<typeof DataTable>[0]["columns"]} data={companies as unknown as Record<string, unknown>[]} />
    </div>
  );
}
