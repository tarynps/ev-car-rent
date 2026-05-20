"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Modal from "@/components/Modal";
import { adminUsers as initial, locations as initialLocations } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import type { AdminUser, Location } from "@/lib/types";
import { useToast } from "@/components/Toast";

const tabs = ["Users", "Notifications", "Locations", "Contract Templates"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Users");
  const [users, setUsers] = useState(initial);
  const [locations, setLocations] = useState(initialLocations);
  const [userModal, setUserModal] = useState<{ open: boolean; editing?: AdminUser }>({ open: false });
  const [locationModal, setLocationModal] = useState<{ open: boolean; editing?: Location }>({ open: false });
  const [userForm, setUserForm] = useState({ name: "", email: "", role: "Manager" as const });
  const [locationForm, setLocationForm] = useState({ name: "", address: "" });
  const { toast } = useToast();

  const notifications = [
    { key: "contract_submitted", label: "New contract request submitted", email: true, sms: false },
    { key: "contract_approved", label: "Contract approved notification to renter", email: true, sms: true },
    { key: "contract_rejected", label: "Contract rejected notification to renter", email: true, sms: false },
    { key: "expiry_reminder", label: "Return reminder (7 days before due)", email: true, sms: true },
    { key: "contract_expiry", label: "Contract expiry alert (7 days before)", email: true, sms: false },
    { key: "invoice_ready", label: "Invoice ready notification", email: true, sms: false },
  ];

  function saveUser() {
    if (userModal.editing) {
      setUsers((prev) => prev.map((u) => u.id === userModal.editing!.id ? { ...u, ...userForm } : u));
    } else {
      setUsers((prev) => [...prev, { id: `a${Date.now()}`, ...userForm, createdAt: "2026-05-15" }]);
    }
    setUserModal({ open: false });
    toast("success", "User saved successfully.");
  }

  function saveLocation() {
    if (locationModal.editing) {
      setLocations((prev) => prev.map((l) => l.id === locationModal.editing!.id ? { ...l, ...locationForm } : l));
    } else {
      setLocations((prev) => [...prev, { id: `l${Date.now()}`, ...locationForm }]);
    }
    setLocationModal({ open: false });
    toast("success", "Location saved.");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-ev-black">System Settings</h1>
        <p className="text-sm text-ev-muted mt-0.5">Platform configuration and administration</p>
      </div>

      <div className="flex gap-1 bg-ev-surface border border-gray-100 rounded-xl p-1 shadow-sm w-fit">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${activeTab === tab ? "bg-ev-black text-white" : "text-ev-muted hover:text-ev-black"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === "Users" && (
        <div className="bg-ev-surface rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold">Admin & Manager Users</h3>
            <button onClick={() => { setUserForm({ name: "", email: "", role: "Manager" }); setUserModal({ open: true }); }}
              className="flex items-center gap-1.5 bg-ev-black text-white text-xs px-3 py-1.5 rounded-lg hover:bg-ev-dark">
              <Plus size={12} /> Add User
            </button>
          </div>
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-ev-muted font-medium">Name</th>
                <th className="text-left px-4 py-3 text-xs text-ev-muted font-medium">Email</th>
                <th className="text-left px-4 py-3 text-xs text-ev-muted font-medium">Role</th>
                <th className="text-left px-4 py-3 text-xs text-ev-muted font-medium">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-50">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-ev-muted">{u.email}</td>
                  <td className="px-4 py-3"><span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{u.role}</span></td>
                  <td className="px-4 py-3 text-ev-muted text-xs">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => { setUserForm({ name: u.name, email: u.email, role: u.role as "Manager" }); setUserModal({ open: true, editing: u }); }}
                      className="p-1 text-ev-muted hover:text-ev-black">
                      <Edit2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "Notifications" && (
        <div className="bg-ev-surface rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold">Notification Triggers</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-ev-muted font-medium">Event</th>
                <th className="text-center px-4 py-3 text-xs text-ev-muted font-medium">Email</th>
                <th className="text-center px-4 py-3 text-xs text-ev-muted font-medium">SMS</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((n) => (
                <tr key={n.key} className="border-b border-gray-50">
                  <td className="px-4 py-3">{n.label}</td>
                  <td className="px-4 py-3 text-center">
                    <input type="checkbox" defaultChecked={n.email} className="rounded" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input type="checkbox" defaultChecked={n.sms} className="rounded" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-gray-100">
            <button onClick={() => toast("success", "Notification settings saved.")} className="bg-ev-black text-white text-sm px-4 py-2 rounded-lg hover:bg-ev-dark">
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* Locations Tab */}
      {activeTab === "Locations" && (
        <div className="bg-ev-surface rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold">Pick-up / Drop-off Locations</h3>
            <button onClick={() => { setLocationForm({ name: "", address: "" }); setLocationModal({ open: true }); }}
              className="flex items-center gap-1.5 bg-ev-black text-white text-xs px-3 py-1.5 rounded-lg hover:bg-ev-dark">
              <Plus size={12} /> Add Location
            </button>
          </div>
          <div className="flex flex-col">
            {locations.map((l) => (
              <div key={l.id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium">{l.name}</p>
                  <p className="text-xs text-ev-muted">{l.address}</p>
                </div>
                <button onClick={() => { setLocationForm({ name: l.name, address: l.address }); setLocationModal({ open: true, editing: l }); }}
                  className="p-1 text-ev-muted hover:text-ev-black">
                  <Edit2 size={13} />
                </button>
                <button onClick={() => setLocations((prev) => prev.filter((x) => x.id !== l.id))}
                  className="p-1 text-ev-muted hover:text-red-500">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contract Templates */}
      {activeTab === "Contract Templates" && (
        <div className="flex flex-col gap-4">
          {["Rental Agreement Template", "Rent-with-Purchase Agreement Template"].map((tmpl) => (
            <div key={tmpl} className="bg-ev-surface rounded-xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-semibold mb-3">{tmpl}</h3>
              <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none font-mono" rows={6}
                defaultValue={`[${tmpl}]\n\nThis agreement is entered into between EV Fleet Management Co., Ltd. and the Renter as identified above...\n\n[Terms and conditions would appear here]`} />
              <div className="flex gap-2 mt-3">
                <button onClick={() => toast("success", "Template saved.")} className="bg-ev-black text-white text-sm px-4 py-2 rounded-lg hover:bg-ev-dark">Save Template</button>
                <button className="border border-gray-200 text-sm px-4 py-2 rounded-lg hover:bg-gray-50">Upload PDF</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Modal */}
      <Modal open={userModal.open} onClose={() => setUserModal({ open: false })} title={userModal.editing ? "Edit User" : "Add User"}>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-ev-muted block mb-1">Full Name</label>
            <input value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-ev-muted block mb-1">Email</label>
            <input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-ev-muted block mb-1">Role</label>
            <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value as "Manager" })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-ev-surface">
              <option>Super Admin</option>
              <option>Manager</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setUserModal({ open: false })} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={saveUser} className="px-4 py-2 text-sm bg-ev-black text-white rounded-lg hover:bg-ev-dark">Save</button>
          </div>
        </div>
      </Modal>

      {/* Location Modal */}
      <Modal open={locationModal.open} onClose={() => setLocationModal({ open: false })} title={locationModal.editing ? "Edit Location" : "Add Location"}>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-ev-muted block mb-1">Location Name</label>
            <input value={locationForm.name} onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-ev-muted block mb-1">Address</label>
            <textarea value={locationForm.address} onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={2} />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setLocationModal({ open: false })} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={saveLocation} className="px-4 py-2 text-sm bg-ev-black text-white rounded-lg hover:bg-ev-dark">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
