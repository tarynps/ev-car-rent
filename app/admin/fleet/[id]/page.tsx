"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ToggleLeft, ToggleRight, Car as CarIcon, Wrench, Shield, Gauge, RefreshCw } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { cars as initialCars, bookings, carModels } from "@/lib/mock-data";
import { formatBaht, formatDate } from "@/lib/utils";

export default function FleetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState(() => initialCars.find((c) => c.id === id));
  const [addMaintenanceOpen, setAddMaintenanceOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const [mainForm, setMainForm] = useState({ date: "", type: "", cost: "", provider: "", notes: "" });

  if (!car) return notFound();

  const carRentals = bookings.filter((b) => b.carId === car.id);
  const availableCars = initialCars.filter((c) => c.status === "Available" && c.id !== car.id);

  function toggleRentToSell() {
    setCar((prev) => prev ? { ...prev, isRentToSell: !prev.isRentToSell } : prev);
  }

  function addMaintenance() {
    if (!car || !mainForm.date || !mainForm.type) return;
    setCar((prev) => prev ? {
      ...prev,
      maintenanceLogs: [...prev.maintenanceLogs, {
        id: `ml${Date.now()}`, date: mainForm.date, type: mainForm.type,
        cost: Number(mainForm.cost), provider: mainForm.provider, notes: mainForm.notes,
      }],
    } : prev);
    setAddMaintenanceOpen(false);
    setMainForm({ date: "", type: "", cost: "", provider: "", notes: "" });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/fleet" className="p-1.5 rounded-lg hover:bg-gray-100 text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-primary">{car.licensePlate}</h1>
          <p className="text-sm text-secondary">{car.brandName} {car.modelName} · {car.year}</p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={car.status} />
        </div>
      </div>

      {/* Car header card */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div><p className="text-xs text-secondary">Brand</p><p className="font-medium text-sm">{car.brandName}</p></div>
          <div><p className="text-xs text-secondary">Model</p><p className="font-medium text-sm">{car.modelName}</p></div>
          <div><p className="text-xs text-secondary">Year</p><p className="font-medium text-sm">{car.year}</p></div>
          <div><p className="text-xs text-secondary">Color</p><p className="font-medium text-sm">{car.color}</p></div>
          <div><p className="text-xs text-secondary">RFID Card</p><p className="font-medium text-sm font-mono text-xs">{car.rfidCard}</p></div>
          <div><p className="text-xs text-secondary">Odometer</p><p className="font-medium text-sm">{car.odometer.toLocaleString()} km</p></div>
          {car.currentRenterName && (
            <div><p className="text-xs text-secondary">Current Renter</p><p className="font-medium text-sm">{car.currentRenterName}</p></div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button onClick={toggleRentToSell} className="flex items-center gap-2 border border-gray-200 text-sm px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          {car.isRentToSell ? <ToggleRight size={16} className="text-tertiary" /> : <ToggleLeft size={16} className="text-secondary" />}
          Rent-to-Sell: {car.isRentToSell ? "On" : "Off"}
        </button>
        {car.status === "Rented" && (
          <button onClick={() => setSwapOpen(true)} className="flex items-center gap-2 border border-gray-200 text-sm px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw size={15} /> Swap Vehicle
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status History */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
            <CarIcon size={15} /> Status History
          </h3>
          <div className="flex flex-col gap-2">
            {car.statusHistory.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <StatusBadge status={h.status} />
                <span className="text-secondary text-xs">{formatDate(h.date)}</span>
                <span className="text-xs text-gray-400">by {h.changedBy}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insurance */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
            <Shield size={15} /> Insurance
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><p className="text-xs text-secondary">Policy Number</p><p className="font-medium">{car.insurance.policyNumber || "—"}</p></div>
            <div><p className="text-xs text-secondary">Provider</p><p className="font-medium">{car.insurance.provider || "—"}</p></div>
            <div><p className="text-xs text-secondary">Expiry</p><p className="font-medium">{car.insurance.expiryDate ? formatDate(car.insurance.expiryDate) : "—"}</p></div>
            <div><p className="text-xs text-secondary">Annual Premium</p><p className="font-medium">{formatBaht(car.insurance.annualPremium)}</p></div>
          </div>
        </div>

        {/* Odometer Logs */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
            <Gauge size={15} /> Odometer Log
          </h3>
          <div className="flex flex-col gap-1">
            {car.odometerLogs.map((o, i) => (
              <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                <span className="text-secondary">{formatDate(o.date)}</span>
                <span className="font-medium">{o.reading.toLocaleString()} km</span>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Log */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
              <Wrench size={15} /> Maintenance Log
            </h3>
            <button onClick={() => setAddMaintenanceOpen(true)} className="text-xs text-tertiary hover:underline">+ Add</button>
          </div>
          {car.maintenanceLogs.length === 0 ? (
            <p className="text-sm text-secondary">No maintenance records.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {car.maintenanceLogs.map((m) => (
                <div key={m.id} className="border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{m.type}</span>
                    <span className="text-secondary">{formatDate(m.date)}</span>
                  </div>
                  <p className="text-xs text-secondary">{m.provider} · {formatBaht(m.cost)}</p>
                  {m.notes && <p className="text-xs text-gray-400 mt-0.5">{m.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rental History */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-primary mb-4">Rental History</h3>
        {carRentals.length === 0 ? (
          <p className="text-sm text-secondary">No rental history.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-0 py-2 text-xs text-secondary font-medium">Booking ID</th>
                  <th className="text-left px-4 py-2 text-xs text-secondary font-medium">Company</th>
                  <th className="text-left px-4 py-2 text-xs text-secondary font-medium">Pick-up</th>
                  <th className="text-left px-4 py-2 text-xs text-secondary font-medium">Return</th>
                  <th className="text-left px-4 py-2 text-xs text-secondary font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {carRentals.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50">
                    <td className="py-2 pr-4"><Link href={`/admin/bookings/${b.id}`} className="text-tertiary hover:underline font-mono text-xs">{b.id.toUpperCase()}</Link></td>
                    <td className="px-4 py-2">{b.companyName}</td>
                    <td className="px-4 py-2 text-secondary">{formatDate(b.pickupDate)}</td>
                    <td className="px-4 py-2 text-secondary">{formatDate(b.returnDate)}</td>
                    <td className="px-4 py-2"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Maintenance Modal */}
      <Modal open={addMaintenanceOpen} onClose={() => setAddMaintenanceOpen(false)} title="Add Maintenance Log">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Date *</label>
              <input type="date" value={mainForm.date} onChange={(e) => setMainForm({ ...mainForm, date: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Cost (฿)</label>
              <input type="number" value={mainForm.cost} onChange={(e) => setMainForm({ ...mainForm, cost: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="0" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Type *</label>
            <input value={mainForm.type} onChange={(e) => setMainForm({ ...mainForm, type: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Tire Rotation" />
          </div>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Service Provider</label>
            <input value={mainForm.provider} onChange={(e) => setMainForm({ ...mainForm, provider: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Notes</label>
            <textarea value={mainForm.notes} onChange={(e) => setMainForm({ ...mainForm, notes: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={2} />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setAddMaintenanceOpen(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={addMaintenance} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800">Save</button>
          </div>
        </div>
      </Modal>

      {/* Swap Modal */}
      <Modal open={swapOpen} onClose={() => setSwapOpen(false)} title="Swap Vehicle">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-secondary">Select a replacement vehicle for the active booking.</p>
          <div className="flex flex-col gap-2">
            {availableCars.slice(0, 5).map((c) => (
              <button key={c.id} onClick={() => setSwapOpen(false)}
                className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 hover:border-black transition-colors text-left">
                <div>
                  <p className="text-sm font-medium">{c.licensePlate}</p>
                  <p className="text-xs text-secondary">{c.brandName} {c.modelName}</p>
                </div>
                <StatusBadge status={c.status} />
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
