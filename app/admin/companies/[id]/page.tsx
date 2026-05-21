"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, UserMinus, FileCheck } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { companies as allCompanies, contracts, rentRequests } from "@/lib/mock-data";
import { formatBaht, formatDate } from "@/lib/utils";

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState(() => allCompanies.find((c) => c.id === id));
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addUserForm, setAddUserForm] = useState<{ name: string; email: string; role: "Renter Admin" | "Renter User" }>({ name: "", email: "", role: "Renter User" });

  if (!company) return <div className="text-secondary p-8">Company not found.</div>;

  const companyContracts = contracts.filter((c) => c.companyId === id);
  const companyRequests = rentRequests.filter((r) => r.companyName === company?.name);

  function addUser() {
    const newUser = {
      id: `u${Date.now()}`,
      name: addUserForm.name,
      email: addUserForm.email,
      role: addUserForm.role as "Renter Admin" | "Renter User",
      lastActive: "—",
    };
    setCompany((prev) => prev ? { ...prev, users: [...prev.users, newUser] } : prev);
    setAddUserOpen(false);
  }

  function removeUser(uid: string) {
    setCompany((prev) => prev ? { ...prev, users: prev.users.filter((u) => u.id !== uid) } : prev);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/companies" className="p-1.5 rounded-lg hover:bg-gray-100 text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-primary">{company.name}</h1>
          <p className="text-sm text-secondary">{company.taxId}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <StatusBadge status={company.status} />
          <StatusBadge status={company.kycStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Company Profile */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-primary mb-3">Company Profile</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-xs text-secondary">Tax ID</p><p className="font-medium font-mono">{company.taxId}</p></div>
            <div><p className="text-xs text-secondary">Billing Email</p><p className="font-medium">{company.billingEmail}</p></div>
            <div className="col-span-2"><p className="text-xs text-secondary">Address</p><p className="font-medium">{company.address}</p></div>
            <div><p className="text-xs text-secondary">Contact Person</p><p className="font-medium">{company.contactName}</p></div>
            <div><p className="text-xs text-secondary">Contact Phone</p><p className="font-medium">{company.contactPhone}</p></div>
          </div>
        </div>

        {/* Credit & Quota */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-primary mb-3">Credit & Quota</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-xs text-secondary">Credit Limit</p><p className="text-2xl font-semibold">{formatBaht(company.creditLimit)}</p></div>
            <div><p className="text-xs text-secondary">Active Rentals</p>
              <p className="text-2xl font-semibold">{company.activeRentals} <span className="text-base text-secondary font-normal">/ {company.maxActiveRentals}</span></p>
            </div>
          </div>
          <div className="mt-3">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-2 bg-tertiary rounded-full" style={{ width: `${(company.activeRentals / company.maxActiveRentals) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* KYC Documents */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
            <FileCheck size={15} /> KYC Documents
            <StatusBadge status={company.kycStatus} />
          </h3>
          {company.kycDocuments.length === 0 ? (
            <p className="text-sm text-secondary">No documents uploaded.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {company.kycDocuments.map((doc, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-secondary">{doc.type} · Uploaded {formatDate(doc.uploadedAt)}</p>
                  </div>
                  <button className="text-xs text-tertiary hover:underline">View</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Users */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-primary">Team Members</h3>
            <button onClick={() => setAddUserOpen(true)} className="flex items-center gap-1.5 text-xs text-tertiary hover:underline">
              <UserPlus size={12} /> Add User
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {company.users.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-secondary">{user.email} · {user.role}</p>
                  <p className="text-xs text-gray-400">Last active: {user.lastActive}</p>
                </div>
                <button onClick={() => removeUser(user.id)} className="p-1 text-secondary hover:text-red-500 transition-colors">
                  <UserMinus size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contracts */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-primary">Contracts ({companyContracts.length})</h3>
        </div>
        {companyContracts.length === 0 ? (
          <p className="px-5 py-6 text-sm text-secondary">No contracts found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs text-secondary font-medium">Contract ID</th>
                  <th className="text-left px-5 py-3 text-xs text-secondary font-medium">Models</th>
                  <th className="text-left px-5 py-3 text-xs text-secondary font-medium">Vehicles</th>
                  <th className="text-left px-5 py-3 text-xs text-secondary font-medium">Period</th>
                  <th className="text-left px-5 py-3 text-xs text-secondary font-medium">Total</th>
                  <th className="text-left px-5 py-3 text-xs text-secondary font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {companyContracts.map((c) => {
                  const totalVehicles = c.lines.reduce((sum, l) => sum + l.assignedCars.length, 0);
                  return (
                    <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="px-5 py-3">
                        <Link href={`/admin/contracts/${c.id}`} className="font-mono text-xs font-semibold text-tertiary hover:underline">
                          {c.id.toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-secondary">
                        {c.lines.map((l) => `${l.modelName}${l.bodyType ? ` (${l.bodyType})` : ""}`).join(", ")}
                      </td>
                      <td className="px-5 py-3 text-secondary">{totalVehicles}</td>
                      <td className="px-5 py-3 text-secondary whitespace-nowrap">
                        {formatDate(c.startDate)} → {formatDate(c.endDate)}
                      </td>
                      <td className="px-5 py-3 font-medium">{formatBaht(c.total)}</td>
                      <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rent Requests */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-primary">Rent Requests ({companyRequests.length})</h3>
        </div>
        {companyRequests.length === 0 ? (
          <p className="px-5 py-6 text-sm text-secondary">No rent requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs text-secondary font-medium">Request ID</th>
                  <th className="text-left px-5 py-3 text-xs text-secondary font-medium">Models Requested</th>
                  <th className="text-left px-5 py-3 text-xs text-secondary font-medium">Period</th>
                  <th className="text-left px-5 py-3 text-xs text-secondary font-medium">Type</th>
                  <th className="text-left px-5 py-3 text-xs text-secondary font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {companyRequests.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      <Link href={`/admin/requests/${r.id}`} className="font-mono text-xs font-semibold text-tertiary hover:underline">
                        {r.id.toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-secondary">
                      {r.requestedModels.map((m) => `${m.modelName} ×${m.qty}`).join(", ")}
                    </td>
                    <td className="px-5 py-3 text-secondary whitespace-nowrap">
                      {formatDate(r.startDate)} → {formatDate(r.endDate)}
                    </td>
                    <td className="px-5 py-3 text-secondary">{r.contractType} · {r.durationType}</td>
                    <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <Modal open={addUserOpen} onClose={() => setAddUserOpen(false)} title="Add Team Member">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Full Name</label>
            <input value={addUserForm.name} onChange={(e) => setAddUserForm({ ...addUserForm, name: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Email</label>
            <input type="email" value={addUserForm.email} onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Role</label>
            <select value={addUserForm.role} onChange={(e) => setAddUserForm({ ...addUserForm, role: e.target.value as "Renter Admin" | "Renter User" })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
              <option>Renter Admin</option>
              <option>Renter User</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setAddUserOpen(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={addUser} className="px-4 py-2 text-sm bg-tertiary text-white rounded-lg hover:bg-tertiary-dark">Add User</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
