"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Gauge, List, Grid3X3, Navigation, Zap } from "lucide-react";
import { carModels } from "@/lib/mock-data";
import { formatBaht } from "@/lib/utils";

const catalogMeta: Record<string, { carType: string; wheelCategory: string; motorPower: string }> = {
  m1: { carType: "Light truck", wheelCategory: "6-wheel", motorPower: "120 kW" },
  m2: { carType: "Pickup", wheelCategory: "Pickup", motorPower: "150 kW" },
  m3: { carType: "Passenger van", wheelCategory: "Van", motorPower: "110 kW" },
  m4: { carType: "Cargo van", wheelCategory: "Van", motorPower: "120 kW" },
  m5: { carType: "Box truck", wheelCategory: "10-wheel", motorPower: "180 kW" },
  m6: { carType: "Dump truck", wheelCategory: "10-wheel", motorPower: "180 kW" },
  m7: { carType: "Road sweeper", wheelCategory: "10-wheel", motorPower: "180 kW" },
  m8: { carType: "Wrecker", wheelCategory: "10-wheel", motorPower: "180 kW" },
  m9: { carType: "Refrigerated truck", wheelCategory: "10-wheel", motorPower: "180 kW" },
  m10: { carType: "Sewage truck", wheelCategory: "10-wheel", motorPower: "180 kW" },
  m11: { carType: "Prime mover", wheelCategory: "Prime Mover", motorPower: "240 kW" },
  m12: { carType: "Medium truck", wheelCategory: "8-wheel", motorPower: "160 kW" },
  m13: { carType: "Heavy truck", wheelCategory: "10-wheel", motorPower: "260 kW" },
  m14: { carType: "Heavy hauler", wheelCategory: "Prime Mover", motorPower: "300 kW" },
  m15: { carType: "Special purpose", wheelCategory: "10-wheel", motorPower: "220 kW" },
};

function getCatalogMeta(modelId: string) {
  return catalogMeta[modelId] ?? { carType: "Commercial EV", wheelCategory: "Fleet vehicle", motorPower: "TBC" };
}

function getDisplayName(model: (typeof carModels)[number]) {
  return model.bodyType ? `${model.name} (${model.bodyType})` : model.name;
}

export default function VehiclesPage() {
  const [carTypeFilter, setCarTypeFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [rangeFilter, setRangeFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const carTypeOptions = Array.from(new Set(carModels.map((model) => getCatalogMeta(model.id).wheelCategory)));
  const modelOptions = carModels.map((model) => ({ id: model.id, label: getDisplayName(model) }));

  const filtered = carModels.filter((m) => {
    if (carTypeFilter && getCatalogMeta(m.id).wheelCategory !== carTypeFilter) return false;
    if (modelFilter && m.id !== modelFilter) return false;
    if (rangeFilter && m.rangeWltp < Number(rangeFilter)) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-tertiary">JAC Motors commercial EV lineup</p>
          <h1 className="text-xl font-semibold text-primary mt-1">Vehicle Catalog</h1>
          <p className="text-sm text-secondary mt-0.5">{filtered.length} EV models available for corporate contracts</p>
        </div>
        <Link
          href="/renter/bookings/new"
          className="inline-flex items-center justify-center gap-2 bg-tertiary text-white text-sm px-4 py-2 rounded-lg hover:bg-tertiary-dark transition-colors"
        >
          Request a Quote <ArrowRight size={14} />
        </Link>
      </div>

      {/* Filters + view toggle */}
      <div className="flex flex-wrap items-center gap-2">
        <select value={carTypeFilter} onChange={(e) => setCarTypeFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-surface">
          <option value="">All Car Types</option>
          {carTypeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <select value={modelFilter} onChange={(e) => setModelFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-surface">
          <option value="">All Models</option>
          {modelOptions.map((model) => <option key={model.id} value={model.id}>{model.label}</option>)}
        </select>
        <select value={rangeFilter} onChange={(e) => setRangeFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-surface">
          <option value="">Any Range</option>
          <option value="200">200+ km</option>
          <option value="300">300+ km</option>
        </select>
        {(carTypeFilter || modelFilter || rangeFilter) && (
          <button onClick={() => { setCarTypeFilter(""); setModelFilter(""); setRangeFilter(""); }} className="text-xs text-tertiary hover:underline">Clear</button>
        )}
        <div className="ml-auto flex gap-1 bg-surface border border-gray-200 rounded-lg p-1">
          <button aria-label="Grid view" onClick={() => setViewMode("grid")} className={`p-1.5 rounded ${viewMode === "grid" ? "bg-tertiary text-white" : "text-secondary"}`}>
            <Grid3X3 size={14} />
          </button>
          <button aria-label="List view" onClick={() => setViewMode("list")} className={`p-1.5 rounded ${viewMode === "list" ? "bg-tertiary text-white" : "text-secondary"}`}>
            <List size={14} />
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((model) => {
            const meta = getCatalogMeta(model.id);
            const displayName = getDisplayName(model);

            return (
            <Link key={model.id} href={`/renter/vehicles/${model.id}`}
              className="bg-surface rounded-xl border border-gray-100 shadow-sm hover:border-tertiary/30 hover:shadow-md transition-all overflow-hidden block group">
              <div className="h-40 relative overflow-hidden bg-gray-50">
                {model.photos[0] ? (
                  <Image
                    src={model.photos[0]}
                    alt={`${model.brandName} ${displayName}`}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-4xl font-bold text-gray-300">{model.brandName[0]}</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                  <span className="text-white text-xs font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">View Details</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-primary">{model.brandName} {displayName}</p>
                    <p className="text-xs text-secondary">{meta.carType} · {meta.wheelCategory}</p>
                  </div>
                  <span className="text-sm font-semibold text-tertiary">{formatBaht(model.priceFrom)}/mo</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-secondary">
                  <span className="flex items-center gap-1"><Navigation size={11} />{model.rangeWltp} km</span>
                  <span className="flex items-center gap-1"><BatteryCharging size={11} />{model.batteryKwh} kWh</span>
                  <span className="flex items-center gap-1"><Zap size={11} />{meta.motorPower}</span>
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  <span className="text-xs bg-tertiary-tint text-tertiary px-1.5 py-0.5 rounded-full">{meta.wheelCategory}</span>
                  <span className="text-xs bg-gray-100 text-secondary px-1.5 py-0.5 rounded-full">WLTP {model.rangeWltp} km</span>
                  <span className="text-xs bg-gray-100 text-secondary px-1.5 py-0.5 rounded-full">AC {model.maxAcKw}kW / DC {model.maxDcKw}kW</span>
                </div>
              </div>
            </Link>
          )})}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((model) => {
            const meta = getCatalogMeta(model.id);
            const displayName = getDisplayName(model);

            return (
            <Link key={model.id} href={`/renter/vehicles/${model.id}`}
              className="bg-surface rounded-xl border border-gray-100 shadow-sm hover:border-tertiary/30 hover:shadow transition-all p-4 flex items-center gap-4">
              <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                {model.photos[0] ? (
                  <Image
                    src={model.photos[0]}
                    alt={`${model.brandName} ${displayName}`}
                    width={80}
                    height={56}
                    className="w-full h-full object-contain p-1.5"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-2xl font-bold text-gray-300">{model.brandName[0]}</div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-primary">{model.brandName} {displayName} · {meta.wheelCategory}</p>
                <div className="flex items-center gap-3 text-xs text-secondary mt-0.5">
                  <span className="flex items-center gap-1"><Gauge size={11} />{meta.motorPower}</span>
                  <span className="flex items-center gap-1"><BatteryCharging size={11} />{model.batteryKwh} kWh</span>
                  <span className="flex items-center gap-1"><Navigation size={11} />{model.rangeWltp} km WLTP</span>
                </div>
                <div className="flex gap-1 mt-1 flex-wrap">
                  <span className="text-xs bg-tertiary-tint text-tertiary px-1.5 py-0.5 rounded-full">{meta.carType}</span>
                  <span className="text-xs bg-gray-100 text-secondary px-1.5 py-0.5 rounded-full">AC {model.maxAcKw}kW / DC {model.maxDcKw}kW</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-tertiary">{formatBaht(model.priceFrom)}/mo</p>
                <p className="text-xs text-secondary mt-0.5">from</p>
              </div>
            </Link>
          )})}
        </div>
      )}
    </div>
  );
}
