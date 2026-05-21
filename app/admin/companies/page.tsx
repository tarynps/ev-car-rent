"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { companies } from "@/lib/mock-data";
import type { Company } from "@/lib/types";

export default function CompaniesPage() {
  const columns = [
    { key: "name", header: "Company Name", render: (r: Company) => (
      <Link href={`/admin/companies/${r.id}`} className="font-medium text-primary hover:text-tertiary transition-colors">{r.name}</Link>
    )},
    { key: "contactName", header: "Contact" },
    { key: "activeRentals", header: "Active Rentals", render: (r: Company) => (
      <span className="font-medium">{r.activeRentals} / {r.maxActiveRentals}</span>
    )},
    { key: "kycStatus", header: "KYC", render: (r: Company) => <StatusBadge status={r.kycStatus} /> },
    { key: "status", header: "Status", render: (r: Company) => <StatusBadge status={r.status} /> },
    { key: "actions", header: "Actions", sortable: false, render: (r: Company) => (
      <Link href={`/admin/companies/${r.id}`} className="flex items-center gap-1 text-secondary hover:text-primary text-xs">
        <Eye size={13} /> View
      </Link>
    )},
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-primary">Clients</h1>
        <p className="text-sm text-secondary mt-0.5">{companies.length} clients registered</p>
      </div>
      <DataTable columns={columns as Parameters<typeof DataTable>[0]["columns"]} data={companies as unknown as Record<string, unknown>[]} />
    </div>
  );
}
