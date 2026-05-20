"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, LayoutList, Grid2X2 } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { contracts, purchaseOffers, carModels } from "@/lib/mock-data";
import { formatDate, formatBaht } from "@/lib/utils";

type StatusFilter = "All" | "Pending" | "Active" | "Confirmed" | "Expired" | "Terminated";
type ViewMode = "contract" | "car";

const STATUS_TABS: StatusFilter[] = ["All", "Pending", "Active", "Confirmed", "Expired", "Terminated"];

const myContracts = contracts.filter((c) => c.companyId === "c1");
const offerContractIds = new Set(purchaseOffers.filter((o) => o.status === "Available").map((o) => o.contractId));

function getModelPhoto(modelId: string): string | null {
  return carModels.find((m) => m.id === modelId)?.photos[0] ?? null;
}

export default function RenterFleetPage() {
  const [activeTab, setActiveTab] = useState<StatusFilter>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("contract");

  const filtered = activeTab === "All" ? myContracts : myContracts.filter((c) => c.status === activeTab);

  // Flatten all cars from filtered contracts for "By Car" view
  const allCars = filtered.flatMap((c) =>
    c.lines.flatMap((line) =>
      line.assignedCars.map((car) => ({
        carId: car.carId,
        licensePlate: car.licensePlate,
        modelId: line.modelId,
        modelName: line.modelName,
        bodyType: line.bodyType,
        brandName: line.brandName,
        baseRate: line.baseRate,
        contractId: c.id,
        contractStatus: c.status,
        startDate: c.startDate,
        endDate: c.endDate,
        photo: getModelPhoto(line.modelId),
      }))
    )
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-primary">My Fleet</h1>
          <p className="text-sm text-secondary mt-0.5">{myContracts.length} contract{myContracts.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex gap-1 bg-white border border-gray-100 rounded-lg p-1 shadow-sm">
            <button onClick={() => setViewMode("contract")}
              title="By Contract"
              className={`p-1.5 rounded ${viewMode === "contract" ? "bg-tertiary text-white" : "text-secondary hover:text-primary"}`}>
              <LayoutList size={15} />
            </button>
            <button onClick={() => setViewMode("car")}
              title="By Car"
              className={`p-1.5 rounded ${viewMode === "car" ? "bg-tertiary text-white" : "text-secondary hover:text-primary"}`}>
              <Grid2X2 size={15} />
            </button>
          </div>
          <Link href="/renter/requests/new"
            className="flex items-center gap-2 bg-tertiary text-white text-sm px-4 py-2 rounded-lg hover:bg-tertiary-dark transition-colors">
            <Plus size={15} /> New Contract Request
          </Link>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm overflow-x-auto">
        {STATUS_TABS.map((tab) => {
          const count = tab === "All" ? myContracts.length : myContracts.filter((c) => c.status === tab).length;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === tab ? "bg-tertiary text-white" : "text-secondary hover:text-primary"}`}>
              {tab}
              {count > 0 && (
                <span className={`text-xs rounded-full px-1.5 ${activeTab === tab ? "bg-white/20" : "bg-gray-100 text-secondary"}`}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── By Contract view ── */}
      {viewMode === "contract" && (
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
              <p className="text-secondary text-sm">No contracts found.</p>
            </div>
          ) : filtered.map((c) => {
            const hasPurchaseOffer = offerContractIds.has(c.id);
            const totalVehicles = c.lines.reduce((sum, l) => sum + l.assignedCars.length, 0);
            return (
              <Link key={c.id} href={`/renter/fleet/${c.id}`}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-gray-300 transition-all block">
                <div className="flex items-start gap-4">
                  {/* Model photos strip */}
                  <div className="flex gap-1 shrink-0">
                    {c.lines.slice(0, 2).map((line) => {
                      const photo = getModelPhoto(line.modelId);
                      return photo ? (
                        <div key={line.modelId} className="relative w-20 h-14 rounded-lg bg-gray-50 overflow-hidden border border-gray-100">
                          <Image src={photo} alt={line.modelName} fill className="object-contain p-1" unoptimized />
                        </div>
                      ) : null;
                    })}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs font-semibold text-tertiary">{c.id.toUpperCase()}</span>
                      <StatusBadge status={c.status} />
                      <span className="text-xs text-secondary">{c.contractType} · {c.durationType}</span>
                      {hasPurchaseOffer && (
                        <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                          Purchase Offer Available
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {c.lines.map((line, i) => (
                        <p key={i} className="text-xs text-secondary">
                          {line.modelName}{line.bodyType ? ` (${line.bodyType})` : ""} — {line.assignedCars.length} unit{line.assignedCars.length > 1 ? "s" : ""}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary">{formatBaht(c.total)}</p>
                    <p className="text-xs text-secondary mt-0.5">{formatDate(c.startDate)} → {formatDate(c.endDate)}</p>
                    <p className="text-xs text-secondary">{totalVehicles} vehicle{totalVehicles > 1 ? "s" : ""}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* ── By Car view ── */}
      {viewMode === "car" && (
        <div>
          {allCars.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
              <p className="text-secondary text-sm">No vehicles found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allCars.map((car) => (
                <Link key={`${car.contractId}-${car.carId}`} href={`/renter/fleet/${car.contractId}`}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:border-gray-300 transition-all block">
                  {/* Car image */}
                  <div className="relative w-full h-36 bg-gray-50 border-b border-gray-100">
                    {car.photo ? (
                      <Image src={car.photo} alt={car.modelName} fill className="object-contain p-4" unoptimized />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-300 text-xs">No image</div>
                    )}
                  </div>
                  {/* Car info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-semibold text-primary text-sm">{car.brandName} {car.modelName}{car.bodyType ? ` (${car.bodyType})` : ""}</p>
                        <p className="font-mono text-xs text-secondary">{car.licensePlate}</p>
                      </div>
                      <StatusBadge status={car.contractStatus} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-secondary mt-2">
                      <span className="font-mono text-tertiary font-semibold">{car.contractId.toUpperCase()}</span>
                      <span>{formatDate(car.startDate)} → {formatDate(car.endDate)}</span>
                    </div>
                    <p className="text-xs text-secondary mt-1">{formatBaht(car.baseRate)} / {contracts.find(c => c.id === car.contractId)?.durationType?.toLowerCase() ?? "mo"}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
