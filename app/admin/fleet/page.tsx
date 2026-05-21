"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Eye } from "lucide-react";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import FileUpload from "@/components/FileUpload";
import { cars as initialCars, carModels, brands } from "@/lib/mock-data";
import type { Car } from "@/lib/types";

export default function FleetPage() {
  const [cars, setCars] = useState(initialCars);
  const [statusFilter, setStatusFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [bodyTypeFilter, setBodyTypeFilter] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ licensePlate: "", modelId: "", rfidCard: "", notes: "" });

  const filtered = useMemo(() => cars.filter((c) => {
    if (statusFilter && c.status !== statusFilter) return false;
    if (brandFilter && c.brandName !== brandFilter) return false;
    if (bodyTypeFilter && (c.bodyType ?? "—") !== bodyTypeFilter) return false;
    return true;
  }), [cars, statusFilter, brandFilter, bodyTypeFilter]);

  function handleAdd() {
    const model = carModels.find((m) => m.id === form.modelId);
    if (!model || !form.licensePlate) return;
    const newCar: Car = {
      id: `car${Date.now()}`, licensePlate: form.licensePlate, modelId: model.id,
      brandName: model.brandName, modelName: model.name, year: model.year,
      color: "White", status: "Available", rfidCard: form.rfidCard, odometer: 0,
      notes: form.notes, isRentToSell: false, statusHistory: [], maintenanceLogs: [],
      insurance: { policyNumber: "", provider: "", expiryDate: "", annualPremium: 0 },
      odometerLogs: [],
    };
    setCars((prev) => [...prev, newCar]);
    setAddOpen(false);
    setForm({ licensePlate: "", modelId: "", rfidCard: "", notes: "" });
  }

  const uniqueBrands = [...new Set(cars.map((c) => c.brandName))];
  const uniqueBodyTypes = [...new Set(cars.map((c) => c.bodyType).filter(Boolean))] as string[];

  const columns = [
    { key: "licensePlate", header: "License Plate", render: (row: Car) => (
      <Link href={`/admin/fleet/${row.id}`} className="font-medium text-primary hover:text-tertiary transition-colors">{row.licensePlate}</Link>
    )},
    { key: "brandName", header: "Brand" },
    { key: "modelName", header: "Model" },
    { key: "bodyType", header: "Body Type", render: (row: Car) => (
      <span className="text-secondary">{row.bodyType ? <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{row.bodyType}</span> : "—"}</span>
    )},
    { key: "year", header: "Year" },
    { key: "status", header: "Status", render: (row: Car) => <StatusBadge status={row.status} /> },
    { key: "currentRenterName", header: "Current Renter", render: (row: Car) => (
      <span className="text-secondary">{row.currentRenterName || "—"}</span>
    )},
    { key: "actions", header: "Actions", sortable: false, render: (row: Car) => (
      <Link href={`/admin/fleet/${row.id}`} className="flex items-center gap-1 text-secondary hover:text-primary transition-colors text-xs">
        <Eye size={13} /> View
      </Link>
    )},
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-primary">Inventory Management</h1>
          <p className="text-sm text-secondary mt-0.5">{cars.length} vehicles registered</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 bg-tertiary text-white text-sm px-4 py-2 rounded-lg hover:bg-tertiary-dark transition-colors">
          <Plus size={15} /> Add Car
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white text-primary">
          <option value="">All Statuses</option>
          {["Available", "Rented", "Maintenance", "Sold"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white text-primary">
          <option value="">All Brands</option>
          {uniqueBrands.map((b) => <option key={b}>{b}</option>)}
        </select>
        {uniqueBodyTypes.length > 0 && (
          <select value={bodyTypeFilter} onChange={(e) => setBodyTypeFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white text-primary">
            <option value="">All Body Types</option>
            {uniqueBodyTypes.map((bt) => <option key={bt}>{bt}</option>)}
          </select>
        )}
        {(statusFilter || brandFilter || bodyTypeFilter) && (
          <button onClick={() => { setStatusFilter(""); setBrandFilter(""); setBodyTypeFilter(""); }} className="text-xs text-tertiary hover:underline">
            Clear filters
          </button>
        )}
      </div>

      <DataTable columns={columns as Parameters<typeof DataTable>[0]["columns"]} data={filtered as unknown as Record<string, unknown>[]} />

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Car">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">License Plate *</label>
            <input value={form.licensePlate} onChange={(e) => setForm({ ...form, licensePlate: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="กก 1234 กทม" />
          </div>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Model *</label>
            <select value={form.modelId} onChange={(e) => setForm({ ...form, modelId: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
              <option value="">Select model</option>
              {carModels.map((m) => <option key={m.id} value={m.id}>{m.brandName} {m.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">RFID Card Number</label>
            <input value={form.rfidCard} onChange={(e) => setForm({ ...form, rfidCard: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="RFID-XXX-000" />
          </div>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={2} />
          </div>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Car Photo</label>
            <FileUpload label="Upload photo" accept="image/*" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setAddOpen(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={handleAdd} className="px-4 py-2 text-sm bg-tertiary text-white rounded-lg hover:bg-tertiary-dark">Add Car</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
