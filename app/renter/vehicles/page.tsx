"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, Navigation, List, Grid3X3 } from "lucide-react";
import { carModels, brands } from "@/lib/mock-data";
import { formatBaht } from "@/lib/utils";

export default function VehiclesPage() {
  const [brandFilter, setBrandFilter] = useState("");
  const [connectorFilter, setConnectorFilter] = useState("");
  const [rangeFilter, setRangeFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = carModels.filter((m) => {
    if (brandFilter && m.carType !== brandFilter) return false;
    if (connectorFilter && !m.connectors.includes(connectorFilter as Parameters<typeof m.connectors.includes>[0])) return false;
    if (rangeFilter && m.rangeWltp < Number(rangeFilter)) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-primary">Browse Vehicles</h1>
        <p className="text-sm text-secondary mt-0.5">{filtered.length} EV models available</p>
      </div>

      {/* Filters + view toggle */}
      <div className="flex flex-wrap items-center gap-2">
        <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white">
          <option value="">All Brands</option>
          {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select value={connectorFilter} onChange={(e) => setConnectorFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white">
          <option value="">All Connectors</option>
          {["CCS2", "Type 2", "CHAdeMO", "GB/T"].map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={rangeFilter} onChange={(e) => setRangeFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white">
          <option value="">Any Range</option>
          <option value="300">300+ km</option>
          <option value="400">400+ km</option>
          <option value="500">500+ km</option>
        </select>
        {(brandFilter || connectorFilter || rangeFilter) && (
          <button onClick={() => { setBrandFilter(""); setConnectorFilter(""); setRangeFilter(""); }} className="text-xs text-tertiary hover:underline">Clear</button>
        )}
        <div className="ml-auto flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
          <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded ${viewMode === "grid" ? "bg-black text-white" : "text-secondary"}`}>
            <Grid3X3 size={14} />
          </button>
          <button onClick={() => setViewMode("list")} className={`p-1.5 rounded ${viewMode === "list" ? "bg-black text-white" : "text-secondary"}`}>
            <List size={14} />
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((model) => (
            <Link key={model.id} href={`/renter/vehicles/${model.id}`}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden block group">
              <div className="h-44 relative overflow-hidden bg-slate-100">
                {model.photos[0] ? (
                  <img src={model.photos[0]} alt={`${"JAC Motors"} ${model.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-4xl font-bold text-gray-300">{"JAC Motors"[0]}</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                  <span className="text-white text-xs font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">View Details</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-primary">{"JAC Motors"} {model.name}</p>
                    <p className="text-xs text-secondary">{model.year}</p>
                  </div>
                  <span className="text-sm font-semibold text-tertiary">{formatBaht(model.priceFrom)}/day</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-secondary">
                  <span className="flex items-center gap-1"><Zap size={11} />{model.batteryKwh} kWh</span>
                  <span className="flex items-center gap-1"><Navigation size={11} />{model.rangeWltp} km</span>
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {model.connectors.map((c) => (
                    <span key={c} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((model) => (
            <Link key={model.id} href={`/renter/vehicles/${model.id}`}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:border-gray-300 hover:shadow transition-all p-4 flex items-center gap-4">
              <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                {model.photos[0] ? (
                  <img src={model.photos[0]} alt={`${"JAC Motors"} ${model.name}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-2xl font-bold text-gray-300">{"JAC Motors"[0]}</div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-primary">{"JAC Motors"} {model.name} · {model.year}</p>
                <div className="flex items-center gap-3 text-xs text-secondary mt-0.5">
                  <span className="flex items-center gap-1"><Zap size={11} />{model.batteryKwh} kWh</span>
                  <span className="flex items-center gap-1"><Navigation size={11} />{model.rangeWltp} km WLTP</span>
                  <span>AC {model.maxAcKw}kW · DC {model.maxDcKw}kW</span>
                </div>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {model.connectors.map((c) => <span key={c} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">{c}</span>)}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-tertiary">{formatBaht(model.priceFrom)}/day</p>
                <p className="text-xs text-secondary mt-0.5">from</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
