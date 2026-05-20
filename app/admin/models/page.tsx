"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Zap, Navigation } from "lucide-react";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import FileUpload from "@/components/FileUpload";
import { carModels as initialModels } from "@/lib/mock-data";
import type { CarModel, ConnectorType } from "@/lib/types";

const ALL_CONNECTORS: ConnectorType[] = ["CCS2", "Type 2", "CHAdeMO", "GB/T"];

const CAR_TYPES = ["6-wheel", "8-wheel", "10-wheel", "Prime Mover", "Electric Pickup", "Electric Van"] as const;

export default function ModelsPage() {
  const [models, setModels] = useState(initialModels);
  const [modal, setModal] = useState<{ open: boolean; editing?: CarModel }>({ open: false });
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string }>({ open: false, id: "" });
  const [form, setForm] = useState({
    name: "", carType: "6-wheel", year: "2024",
    batteryKwh: "", rangeWltp: "", rangeNedc: "",
    connectors: [] as ConnectorType[], maxAcKw: "", maxDcKw: "",
    motorPowerKw: "", highlights: "",
  });

  function openAdd() {
    setForm({ name: "", carType: "6-wheel", year: "2024", batteryKwh: "", rangeWltp: "", rangeNedc: "", connectors: [], maxAcKw: "", maxDcKw: "", motorPowerKw: "", highlights: "" });
    setModal({ open: true });
  }

  function openEdit(m: CarModel) {
    setForm({
      name: m.name, carType: m.carType, year: String(m.year),
      batteryKwh: String(m.batteryKwh), rangeWltp: String(m.rangeWltp), rangeNedc: String(m.rangeNedc),
      connectors: m.connectors, maxAcKw: String(m.maxAcKw), maxDcKw: String(m.maxDcKw),
      motorPowerKw: String(m.motorPowerKw ?? ""), highlights: m.highlights.join("\n"),
    });
    setModal({ open: true, editing: m });
  }

  function save() {
    if (!form.name || !form.batteryKwh) return;
    const entry: CarModel = {
      id: modal.editing?.id ?? `m${Date.now()}`,
      name: form.name,
      carType: form.carType as CarModel["carType"],
      year: Number(form.year),
      batteryKwh: Number(form.batteryKwh),
      rangeWltp: Number(form.rangeWltp),
      rangeNedc: Number(form.rangeNedc),
      connectors: form.connectors,
      maxAcKw: Number(form.maxAcKw),
      maxDcKw: Number(form.maxDcKw),
      motorPowerKw: form.motorPowerKw ? Number(form.motorPowerKw) : undefined,
      photos: modal.editing?.photos ?? [],
      highlights: form.highlights.split("\n").filter(Boolean),
      priceFrom: modal.editing?.priceFrom ?? 0,
    };
    if (modal.editing) {
      setModels((prev) => prev.map((m) => m.id === modal.editing!.id ? entry : m));
    } else {
      setModels((prev) => [...prev, entry]);
    }
    setModal({ open: false });
  }

  function toggleConnector(c: ConnectorType) {
    setForm((prev) => ({
      ...prev,
      connectors: prev.connectors.includes(c) ? prev.connectors.filter((x) => x !== c) : [...prev.connectors, c],
    }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ev-black">JAC Model Catalogue</h1>
          <p className="text-sm text-ev-muted mt-0.5">JAC Motors · {models.length} models</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-ev-primary hover:bg-ev-primary-dark text-white text-sm px-4 py-2 rounded-lg transition-colors">
          <Plus size={15} /> Add Model
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <div key={model.id} className="bg-ev-surface border border-gray-100 rounded-xl overflow-hidden">
            {/* Photo */}
            <div className="h-40 bg-gray-100 overflow-hidden">
              {model.photos[0] ? (
                <img src={model.photos[0]} alt={`JAC ${model.name}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-200">JAC</span>
                </div>
              )}
            </div>

            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-ev-black">JAC {model.name}</p>
                  <p className="text-xs text-ev-muted">{model.carType} · {model.year}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(model)} className="p-1.5 text-ev-muted hover:text-ev-black transition-colors">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => setDeleteConfirm({ open: true, id: model.id })}
                    className="p-1.5 text-ev-muted hover:text-red-500 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* EV specs */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Battery", value: `${model.batteryKwh} kWh` },
                  { label: "WLTP", value: `${model.rangeWltp} km` },
                  { label: "Motor", value: model.motorPowerKw ? `${model.motorPowerKw} kW` : "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="border border-gray-100 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-[10px] text-ev-muted">{label}</p>
                    <p className="text-xs font-semibold text-ev-black mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {/* Charging */}
              <div className="flex items-center gap-3 text-xs text-ev-muted">
                <span className="flex items-center gap-1"><Zap size={10} /> AC {model.maxAcKw} kW · DC {model.maxDcKw} kW</span>
                <span className="flex items-center gap-1"><Navigation size={10} /> {model.rangeNedc} km NEDC</span>
              </div>

              {/* Connectors */}
              <div className="flex gap-1 flex-wrap">
                {model.connectors.map((c) => (
                  <span key={c} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-ev-muted">{c}</span>
                ))}
              </div>

              {/* Highlights */}
              {model.highlights.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {model.highlights.slice(0, 3).map((h) => (
                    <span key={h} className="text-[10px] bg-ev-primary-tint text-ev-primary px-2 py-0.5 rounded-full">{h}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Model Modal */}
      <Modal open={modal.open} onClose={() => setModal({ open: false })} title={modal.editing ? "Edit Model" : "Add JAC Model"} width="max-w-2xl">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-ev-muted block mb-1">Model Name *</label>
              <div className="flex">
                <span className="border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 px-3 py-2 text-sm text-ev-muted">JAC</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="flex-1 border border-gray-200 rounded-r-lg px-3 py-2 text-sm" placeholder="N42EV" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-ev-muted block mb-1">Car Type *</label>
              <select value={form.carType} onChange={(e) => setForm({ ...form, carType: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                {CAR_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-ev-muted block mb-1">Year</label>
              <input value={form.year} type="number" onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-ev-muted block mb-1">Battery (kWh) *</label>
              <input value={form.batteryKwh} type="number" onChange={(e) => setForm({ ...form, batteryKwh: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-ev-muted block mb-1">WLTP Range (km)</label>
              <input value={form.rangeWltp} type="number" onChange={(e) => setForm({ ...form, rangeWltp: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-ev-muted block mb-1">NEDC Range (km)</label>
              <input value={form.rangeNedc} type="number" onChange={(e) => setForm({ ...form, rangeNedc: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-ev-muted block mb-1">Max AC (kW)</label>
              <input value={form.maxAcKw} type="number" onChange={(e) => setForm({ ...form, maxAcKw: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-ev-muted block mb-1">Max DC (kW)</label>
              <input value={form.maxDcKw} type="number" onChange={(e) => setForm({ ...form, maxDcKw: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-ev-muted block mb-1">Motor Power (kW)</label>
              <input value={form.motorPowerKw} type="number" onChange={(e) => setForm({ ...form, motorPowerKw: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-ev-muted block mb-2">Connectors</label>
            <div className="flex gap-2 flex-wrap">
              {ALL_CONNECTORS.map((c) => (
                <button key={c} type="button" onClick={() => toggleConnector(c)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${form.connectors.includes(c) ? "bg-ev-primary text-white border-ev-primary" : "border-gray-200 text-ev-muted hover:border-gray-400"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-ev-muted block mb-1">Feature Highlights (one per line)</label>
            <textarea value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={3}
              placeholder="100 kWh LFP Battery&#10;260 km WLTP Range&#10;10-tonne payload" />
          </div>

          <div>
            <label className="text-xs font-medium text-ev-muted block mb-1">Model Photos</label>
            <FileUpload label="Upload photos" accept="image/*" multiple />
          </div>

          <div className="flex gap-2 justify-end">
            <button onClick={() => setModal({ open: false })} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={save} className="px-4 py-2 text-sm bg-ev-primary hover:bg-ev-primary-dark text-white rounded-lg transition-colors">
              {modal.editing ? "Save Changes" : "Add Model"}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ ...deleteConfirm, open: false })}
        onConfirm={() => setModels((prev) => prev.filter((m) => m.id !== deleteConfirm.id))}
        title="Delete Model"
        message="Are you sure you want to delete this model? This action cannot be undone."
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}
