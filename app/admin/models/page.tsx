"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Edit2, Trash2 } from "lucide-react";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import FileUpload from "@/components/FileUpload";
import EVSpecCard from "@/components/EVSpecCard";
import { brands as initialBrands, carModels as initialModels } from "@/lib/mock-data";
import type { Brand, CarModel, ConnectorType } from "@/lib/types";

const ALL_CONNECTORS: ConnectorType[] = ["CCS2", "Type 2", "CHAdeMO", "GB/T"];

export default function ModelsPage() {
  const [brands, setBrands] = useState(initialBrands);
  const [models, setModels] = useState(initialModels);
  const [expanded, setExpanded] = useState<string[]>(["b1"]);
  const [brandModal, setBrandModal] = useState<{ open: boolean; editing?: Brand }>({ open: false });
  const [modelModal, setModelModal] = useState<{ open: boolean; brandId?: string; editing?: CarModel }>({ open: false });
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; type: "brand" | "model"; id: string }>({ open: false, type: "brand", id: "" });
  const [brandForm, setBrandForm] = useState({ name: "" });
  const [modelForm, setModelForm] = useState({
    name: "", year: "2024", batteryKwh: "", rangeWltp: "", rangeNedc: "",
    connectors: [] as ConnectorType[], maxAcKw: "", maxDcKw: "", highlights: "",
  });

  function toggleBrand(id: string) {
    setExpanded((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  function saveBrand() {
    if (!brandForm.name) return;
    if (brandModal.editing) {
      setBrands((prev) => prev.map((b) => b.id === brandModal.editing!.id ? { ...b, name: brandForm.name } : b));
    } else {
      setBrands((prev) => [...prev, { id: `b${Date.now()}`, name: brandForm.name }]);
    }
    setBrandModal({ open: false });
    setBrandForm({ name: "" });
  }

  function saveModel(brandId: string) {
    const newModel: CarModel = {
      id: modelModal.editing?.id ?? `m${Date.now()}`,
      brandId,
      brandName: brands.find((b) => b.id === brandId)?.name ?? "",
      name: modelForm.name,
      year: Number(modelForm.year),
      batteryKwh: Number(modelForm.batteryKwh),
      rangeWltp: Number(modelForm.rangeWltp),
      rangeNedc: Number(modelForm.rangeNedc),
      connectors: modelForm.connectors,
      maxAcKw: Number(modelForm.maxAcKw),
      maxDcKw: Number(modelForm.maxDcKw),
      photos: [],
      highlights: modelForm.highlights.split("\n").filter(Boolean),
      priceFrom: 0,
    };
    if (modelModal.editing) {
      setModels((prev) => prev.map((m) => m.id === modelModal.editing!.id ? newModel : m));
    } else {
      setModels((prev) => [...prev, newModel]);
    }
    setModelModal({ open: false });
  }

  function toggleConnector(c: ConnectorType) {
    setModelForm((prev) => ({
      ...prev,
      connectors: prev.connectors.includes(c) ? prev.connectors.filter((x) => x !== c) : [...prev.connectors, c],
    }));
  }

  function openEditModel(m: CarModel) {
    setModelForm({
      name: m.name, year: String(m.year), batteryKwh: String(m.batteryKwh),
      rangeWltp: String(m.rangeWltp), rangeNedc: String(m.rangeNedc),
      connectors: m.connectors, maxAcKw: String(m.maxAcKw), maxDcKw: String(m.maxDcKw),
      highlights: m.highlights.join("\n"),
    });
    setModelModal({ open: true, brandId: m.brandId, editing: m });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-primary">Car Brand & Model Master Data</h1>
          <p className="text-sm text-secondary mt-0.5">{brands.length} brands · {models.length} models</p>
        </div>
        <button onClick={() => { setBrandForm({ name: "" }); setBrandModal({ open: true }); }}
          className="flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          <Plus size={15} /> Add Brand
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {brands.map((brand) => {
          const brandModels = models.filter((m) => m.brandId === brand.id);
          const isExpanded = expanded.includes(brand.id);
          return (
            <div key={brand.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleBrand(brand.id)}>
                {isExpanded ? <ChevronDown size={16} className="text-secondary" /> : <ChevronRight size={16} className="text-secondary" />}
                <span className="font-semibold text-primary">{brand.name}</span>
                <span className="text-xs text-secondary ml-1">{brandModels.length} models</span>
                <div className="ml-auto flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => {
                    setModelForm({ name: "", year: "2024", batteryKwh: "", rangeWltp: "", rangeNedc: "", connectors: [], maxAcKw: "", maxDcKw: "", highlights: "" });
                    setModelModal({ open: true, brandId: brand.id });
                  }} className="flex items-center gap-1 text-xs text-tertiary hover:underline">
                    <Plus size={12} /> Add Model
                  </button>
                  <button onClick={() => { setBrandForm({ name: brand.name }); setBrandModal({ open: true, editing: brand }); }}
                    className="p-1 text-secondary hover:text-primary transition-colors">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => setDeleteConfirm({ open: true, type: "brand", id: brand.id })}
                    className="p-1 text-secondary hover:text-red-500 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              {isExpanded && brandModels.length > 0 && (
                <div className="border-t border-gray-100 px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {brandModels.map((model) => (
                    <div key={model.id} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-primary">{model.name}</p>
                          <p className="text-xs text-secondary">{model.year}</p>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => openEditModel(model)} className="p-1.5 text-secondary hover:text-primary transition-colors">
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => setDeleteConfirm({ open: true, type: "model", id: model.id })}
                            className="p-1.5 text-secondary hover:text-red-500 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <EVSpecCard model={model} />
                      {model.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {model.highlights.map((h) => (
                            <span key={h} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-secondary">{h}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {isExpanded && brandModels.length === 0 && (
                <div className="border-t border-gray-100 px-5 py-4 text-sm text-secondary">No models yet.</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Brand Modal */}
      <Modal open={brandModal.open} onClose={() => setBrandModal({ open: false })} title={brandModal.editing ? "Edit Brand" : "Add Brand"}>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Brand Name *</label>
            <input value={brandForm.name} onChange={(e) => setBrandForm({ name: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Tesla" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setBrandModal({ open: false })} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={saveBrand} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800">Save</button>
          </div>
        </div>
      </Modal>

      {/* Model Modal */}
      <Modal open={modelModal.open} onClose={() => setModelModal({ open: false })} title={modelModal.editing ? "Edit Model" : "Add Model"} width="max-w-2xl">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Model Name *</label>
              <input value={modelForm.name} onChange={(e) => setModelForm({ ...modelForm, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Year</label>
              <input value={modelForm.year} onChange={(e) => setModelForm({ ...modelForm, year: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" type="number" />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Battery (kWh)</label>
              <input value={modelForm.batteryKwh} onChange={(e) => setModelForm({ ...modelForm, batteryKwh: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" type="number" />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Range WLTP (km)</label>
              <input value={modelForm.rangeWltp} onChange={(e) => setModelForm({ ...modelForm, rangeWltp: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" type="number" />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Range NEDC (km)</label>
              <input value={modelForm.rangeNedc} onChange={(e) => setModelForm({ ...modelForm, rangeNedc: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" type="number" />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Max AC (kW)</label>
              <input value={modelForm.maxAcKw} onChange={(e) => setModelForm({ ...modelForm, maxAcKw: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" type="number" />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Max DC (kW)</label>
              <input value={modelForm.maxDcKw} onChange={(e) => setModelForm({ ...modelForm, maxDcKw: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" type="number" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-secondary block mb-2">Connectors</label>
            <div className="flex gap-2 flex-wrap">
              {ALL_CONNECTORS.map((c) => (
                <button key={c} onClick={() => toggleConnector(c)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${modelForm.connectors.includes(c) ? "bg-black text-white border-black" : "border-gray-200 text-secondary hover:border-gray-400"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Feature Highlights (one per line)</label>
            <textarea value={modelForm.highlights} onChange={(e) => setModelForm({ ...modelForm, highlights: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={3} placeholder="Autopilot&#10;15.4 Touchscreen&#10;OTA Updates" />
          </div>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Model Photos</label>
            <FileUpload label="Upload photos" accept="image/*" multiple />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setModelModal({ open: false })} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={() => saveModel(modelModal.brandId!)} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800">Save Model</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ ...deleteConfirm, open: false })}
        onConfirm={() => {
          if (deleteConfirm.type === "brand") setBrands((prev) => prev.filter((b) => b.id !== deleteConfirm.id));
          else setModels((prev) => prev.filter((m) => m.id !== deleteConfirm.id));
        }}
        title={`Delete ${deleteConfirm.type === "brand" ? "Brand" : "Model"}`}
        message={`Are you sure you want to delete this ${deleteConfirm.type}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}
