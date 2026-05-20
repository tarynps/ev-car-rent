"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, UserMinus } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { companies, contracts, transactions } from "@/lib/mock-data";
import { formatBaht, formatDate } from "@/lib/utils";

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const company = companies.find((c) => c.id === id);

  if (!company) return (
    <div className="text-center py-20">
      <p className="text-ev-muted">Client not found.</p>
      <Link href="/admin/clients" className="text-ev-primary hover:underline text-sm mt-2 inline-block">← Back to Clients</Link>
    </div>
  );

  const clientContracts = contracts.filter((c) => c.companyId === id);
  const clientTx = transactions.filter((t) => t.companyName === company.name);
  const totalRevenue = clientTx.filter((t) => t.type === "Rental Fee" && t.status === "Completed").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <Link href="/admin/clients" className="flex items-center gap-1 text-ev-muted hover:text-ev-black text-sm mb-3">
          <ArrowLeft size={14} /> Back to Clients
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-ev-black">{company.name}</h1>
              <StatusBadge status={company.kycStatus} />
              <StatusBadge status={company.status} />
            </div>
            <p className="text-sm text-ev-muted mt-1">{company.industry} · Tax ID: {company.taxId}</p>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active Contracts", value: company.activeContracts },
          { label: "Vehicles Rented", value: company.totalVehiclesRented },
          { label: "Total Revenue", value: formatBaht(totalRevenue) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-ev-surface border border-gray-100 rounded-xl px-4 py-4">
            <p className="text-xs text-ev-muted">{label}</p>
            <p className="text-xl font-semibold text-ev-black mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Company profile */}
        <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-ev-black mb-3">Company Profile</h2>
          <div className="flex flex-col gap-2">
            {[
              { label: "Industry", value: company.industry },
              { label: "Address", value: company.address },
              { label: "Tax ID", value: company.taxId },
              { label: "Billing Email", value: company.billingEmail },
              { label: "Contact Name", value: company.contactName },
              { label: "Contact Phone", value: company.contactPhone },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-2">
                <span className="text-xs text-ev-muted w-28 shrink-0">{label}</span>
                <span className="text-xs text-ev-black">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* KYC documents */}
        <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-ev-black mb-3">KYC Documents</h2>
          {company.kycDocuments.length > 0 ? (
            <div className="flex flex-col gap-2">
              {company.kycDocuments.map((doc, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-xs font-medium text-ev-black">{doc.name}</p>
                    <p className="text-[10px] text-ev-muted">{doc.type} · Uploaded {formatDate(doc.uploadedAt)}</p>
                  </div>
                  <button className="text-xs text-ev-primary hover:underline">View</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ev-muted italic">No documents uploaded.</p>
          )}
        </div>
      </div>

      {/* Team members */}
      <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-ev-black">Team Members</h2>
          <button className="flex items-center gap-1.5 text-xs text-ev-primary hover:underline">
            <Plus size={12} /> Add Contact
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {company.users.map((user) => (
            <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-ev-black">{user.name}</p>
                <p className="text-xs text-ev-muted">{user.email} · {user.role}</p>
                <p className="text-[10px] text-ev-muted">Last active: {formatDate(user.lastActive)}</p>
              </div>
              <button className="flex items-center gap-1 text-xs text-ev-muted hover:text-[#EF4444]">
                <UserMinus size={12} /> Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Contract history */}
      <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-ev-black mb-3">Contract History</h2>
        {clientContracts.length > 0 ? (
          <div className="flex flex-col gap-2">
            {clientContracts.map((c) => {
              const totalVehicles = c.vehicleGroups.reduce((s, g) => s + g.quantity, 0);
              return (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/contracts/${c.id}`} className="text-sm font-medium text-ev-primary hover:underline font-mono">{c.id.toUpperCase()}</Link>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-xs text-ev-muted mt-0.5">
                      {totalVehicles} vehicles · {formatDate(c.pickupDate)} → {formatDate(c.returnDate)}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-ev-black">{formatBaht(c.total)}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-ev-muted italic">No contract history.</p>
        )}
      </div>
    </div>
  );
}
