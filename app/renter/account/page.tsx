"use client";

import { useState } from "react";
import { UserPlus, UserMinus, Save } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import Modal from "@/components/Modal";
import StatusBadge from "@/components/StatusBadge";
import { companies, bookings } from "@/lib/mock-data";
import { formatBaht, formatDate } from "@/lib/utils";
import { useToast } from "@/components/Toast";

export default function RenterAccountPage() {
  const [company, setCompany] = useState(companies.find((c) => c.id === "c1")!);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", email: "", role: "Renter User" as const });
  const { toast } = useToast();

  const monthlyBookings = bookings.filter((b) => b.companyId === "c1" && b.pickupDate.startsWith("2026-05"));
  const monthlyTotal = monthlyBookings.reduce((s, b) => s + b.total, 0);

  function saveProfile() {
    toast("success", "Company profile updated.");
  }

  function addUser() {
    setCompany((prev) => ({ ...prev, users: [...prev.users, { id: `u${Date.now()}`, ...addForm, lastActive: "—" }] }));
    setAddUserOpen(false);
    toast("success", "Team member added.");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-primary">Company Account</h1>
        <p className="text-sm text-secondary mt-0.5">{company.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Company profile */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Company Profile</h3>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Company Name</label>
              <input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Tax ID</label>
              <input value={company.taxId} onChange={(e) => setCompany({ ...company, taxId: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono" />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Address</label>
              <textarea value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={2} />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Billing Email</label>
              <input value={company.billingEmail} onChange={(e) => setCompany({ ...company, billingEmail: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" type="email" />
            </div>
            <button onClick={saveProfile} className="flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors w-fit">
              <Save size={14} /> Save Changes
            </button>
          </div>
        </div>

        {/* KYC Documents */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">KYC Documents</h3>
            <StatusBadge status={company.kycStatus} />
          </div>
          <div className="flex flex-col gap-3">
            {["Business Registration Certificate", "VAT Registration", "Director ID Card"].map((docType) => (
              <div key={docType}>
                <p className="text-xs font-medium text-secondary mb-1">{docType}</p>
                <FileUpload label="Upload document" accept="image/*,.pdf" />
              </div>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Team Members ({company.users.length})</h3>
            <button onClick={() => setAddUserOpen(true)} className="flex items-center gap-1.5 text-xs text-tertiary hover:underline">
              <UserPlus size={12} /> Add
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {company.users.map((u) => (
              <div key={u.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-secondary shrink-0">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-secondary">{u.email} · {u.role}</p>
                </div>
                <button onClick={() => setCompany((prev) => ({ ...prev, users: prev.users.filter((x) => x.id !== u.id) }))}
                  className="p-1 text-secondary hover:text-red-500 transition-colors">
                  <UserMinus size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly billing */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Monthly Billing Summary — May 2026</h3>
          {monthlyBookings.length === 0 ? (
            <p className="text-sm text-secondary">No charges this month.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {monthlyBookings.map((b) => (
                <div key={b.id} className="flex justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium">{b.brandName} {b.modelName}</p>
                    <p className="text-xs text-secondary">{b.id.toUpperCase()} · {formatDate(b.pickupDate)}</p>
                  </div>
                  <span className="font-semibold">{formatBaht(b.total)}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatBaht(monthlyTotal)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      <Modal open={addUserOpen} onClose={() => setAddUserOpen(false)} title="Add Team Member">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Full Name</label>
            <input value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Email</label>
            <input type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Role</label>
            <select value={addForm.role} onChange={(e) => setAddForm({ ...addForm, role: e.target.value as "Renter User" })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
              <option value="Renter Admin">Renter Admin</option>
              <option value="Renter User">Renter User</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setAddUserOpen(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={addUser} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800">Add</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
