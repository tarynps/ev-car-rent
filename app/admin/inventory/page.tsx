"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Wrench, Truck } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import FileUpload from "@/components/FileUpload";
import { cars as initialCars, carModels } from "@/lib/mock-data";
import type { Car, CarType } from "@/lib/types";

const CAR_TYPES: CarType[] = ["6-wheel", "8-wheel", "10-wheel", "Prime Mover", "Electric Pickup", "Electric Van"];

export default function InventoryPage() {
  const [cars, setCars] = useState(initialCars);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ licensePlate: "", modelId: "", carType: "" as CarType | "", year: "2024", color: "White", rfidCard: "", notes: "" });

  const filtered = useMemo(() => cars.filter((c) => {
    if (statusFilter && c.status !== statusFilter) return false;
    if (typeFilter && c.carType !== typeFilter) return false;
    return true;
  }), [cars, statusFilter, typeFilter]);

  const stats = useMemo(() => ({
    total: cars.length,
    available: cars.filter((c) => c.status === "Available").length,
    rented: cars.filter((c) => c.status === "Rented").length,
    maintenance: cars.filter((c) => c.status === "Maintenance").length,
    sold: cars.filter((c) => c.status === "Sold").length,
    offerEligible: cars.filter((c) => c.isPurchaseOfferEligible).length,
  }), [cars]);

  function handleAdd() {
    const model = carModels.find((m) => m.id === form.modelId);
    if (!model || !form.licensePlate) return;
    const newCar: Car = {
      id: `car${Date.now()}`, licensePlate: form.licensePlate, modelId: model.id,
      modelName: model.name, carType: form.carType as CarType || model.carType,
      year: parseInt(form.year), color: form.color,
      status: "Available", rfidCard: form.rfidCard,
      odometer: 0, notes: form.notes, isPurchaseOfferEligible: false,
      statusHistory: [{ status: "Available", date: new Date().toISOString().slice(0, 10), changedBy: "Natthapong Charoenwong" }],
      maintenanceLogs: [],
      insurance: { policyNumber: "", provider: "", expiryDate: "", annualPremium: 0 },
      odometerLogs: [],
    };
    setCars((prev) => [...prev, newCar]);
    setAddOpen(false);
    setForm({ licensePlate: "", modelId: "", carType: "", year: "2024", color: "White", rfidCard: "", notes: "" });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ev-black">Inventory Management</h1>
          <p className="text-sm text-ev-muted mt-0.5">JAC EV commercial fleet — {cars.length} vehicles</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 bg-ev-primary hover:bg-ev-primary-dark text-white text-sm px-4 py-2 rounded-lg transition-colors">
          <Plus size={15} /> Add Vehicle
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-ev-black" },
          { label: "Available", value: stats.available, color: "text-[#166534]" },
          { label: "Rented", value: stats.rented, color: "text-[#1E40AF]" },
          { label: "Maintenance", value: stats.maintenance, color: "text-[#854D0E]" },
          { label: "Sold", value: stats.sold, color: "text-ev-muted" },
          { label: "Offer Eligible", value: stats.offerEligible, color: "text-ev-primary" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-ev-surface border border-gray-100 rounded-xl px-4 py-3">
            <p className="text-[11px] text-ev-muted">{label}</p>
            <p className={`text-2xl font-semibold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-ev-surface text-ev-black">
          <option value="">All Statuses</option>
          {["Available", "Rented", "Maintenance", "Sold"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-ev-surface text-ev-black">
          <option value="">All Types</option>
          {CAR_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        {(statusFilter || typeFilter) && (
          <button onClick={() => { setStatusFilter(""); setTypeFilter(""); }} className="text-xs text-ev-primary hover:underline">Clear filters</button>
        )}
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((car) => (
          <Link key={car.id} href={`/admin/inventory/${car.id}`} className="bg-ev-surface border border-gray-100 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all group">
            {/* Vehicle icon placeholder */}
            <div className="w-full h-28 bg-gray-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-gray-100 transition-colors">
              <Truck size={40} className="text-gray-300" />
            </div>

            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="text-sm font-semibold text-ev-black">JAC {car.modelName}</p>
                <p className="text-xs text-ev-muted">{car.carType}</p>
              </div>
              <StatusBadge status={car.status} />
            </div>

            <p className="text-xs font-mono text-ev-black mb-1">{car.licensePlate}</p>

            {car.currentRenterName && (
              <p className="text-xs text-ev-muted truncate">{car.currentRenterName}</p>
            )}

            {car.isPurchaseOfferEligible && (
              <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-ev-primary bg-ev-primary-tint px-2 py-0.5 rounded-full">
                <Wrench size={9} /> Offer Eligible
              </div>
            )}

            {car.status === "Maintenance" && (
              <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-[#854D0E] bg-[#FEF9C3] px-2 py-0.5 rounded-full">
                <Wrench size={9} /> In Service
              </div>
            )}
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-ev-muted text-sm">No vehicles match the current filters.</div>
      )}

      {/* Add vehicle modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Vehicle">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-ev-muted block mb-1">License Plate *</label>
            <input value={form.licensePlate} onChange={(e) => setForm({ ...form, licensePlate: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="กก 1234 กทม" />
          </div>
          <div>
            <label className="text-xs font-medium text-ev-muted block mb-1">Model *</label>
            <select value={form.modelId} onChange={(e) => setForm({ ...form, modelId: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
              <option value="">Select JAC model</option>
              {carModels.map((m) => <option key={m.id} value={m.id}>JAC {m.name} ({m.carType})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-ev-muted block mb-1">Year</label>
              <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-ev-muted block mb-1">Color</label>
              <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-ev-muted block mb-1">RFID Card Number</label>
            <input value={form.rfidCard} onChange={(e) => setForm({ ...form, rfidCard: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="RFID-XXX-000" />
          </div>
          <div>
            <label className="text-xs font-medium text-ev-muted block mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={2} />
          </div>
          <div>
            <label className="text-xs font-medium text-ev-muted block mb-1">Vehicle Photo</label>
            <FileUpload label="Upload photo" accept="image/*" />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button onClick={() => setAddOpen(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={handleAdd} className="px-4 py-2 text-sm bg-ev-primary hover:bg-ev-primary-dark text-white rounded-lg transition-colors">Add Vehicle</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
