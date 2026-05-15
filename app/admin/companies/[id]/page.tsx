"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, UserMinus, FileCheck } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { companies as allCompanies, bookings } from "@/lib/mock-data";
import { formatBaht, formatDate } from "@/lib/utils";

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState(() => allCompanies.find((c) => c.id === id));
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addUserForm, setAddUserForm] = useState<{ name: string; email: string; role: "Renter Admin" | "Renter User" }>({ name: "", email: "", role: "Renter User" });

  if (!company) return <div className="text-secondary p-8">Company not found.</div>;

  const companyBookings = bookings.filter((b) => b.companyId === id);

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
              <div className="h-2 bg-black rounded-full" style={{ width: `${(company.activeRentals / company.maxActiveRentals) * 100}%` }} />
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

      {/* Rental History */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-primary mb-4">Rental History ({companyBookings.length})</h3>
        {companyBookings.length === 0 ? (
          <p className="text-sm text-secondary">No rental history.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 pr-4 text-xs text-secondary font-medium">Booking</th>
                  <th className="text-left px-4 py-2 text-xs text-secondary font-medium">Model</th>
                  <th className="text-left px-4 py-2 text-xs text-secondary font-medium">Pick-up</th>
                  <th className="text-left px-4 py-2 text-xs text-secondary font-medium">Return</th>
                  <th className="text-left px-4 py-2 text-xs text-secondary font-medium">Total</th>
                  <th className="text-left px-4 py-2 text-xs text-secondary font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {companyBookings.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50">
                    <td className="py-2 pr-4">
                      <Link href={`/admin/bookings/${b.id}`} className="text-tertiary hover:underline font-mono text-xs">{b.id.toUpperCase()}</Link>
                    </td>
                    <td className="px-4 py-2">{b.brandName} {b.modelName}</td>
                    <td className="px-4 py-2 text-secondary">{formatDate(b.pickupDate)}</td>
                    <td className="px-4 py-2 text-secondary">{formatDate(b.returnDate)}</td>
                    <td className="px-4 py-2 font-medium">{formatBaht(b.total)}</td>
                    <td className="px-4 py-2"><StatusBadge status={b.status} /></td>
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
            <button onClick={addUser} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800">Add User</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
