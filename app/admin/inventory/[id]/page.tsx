"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Wrench } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { cars, carModels, contracts } from "@/lib/mock-data";
import { formatDate, formatBaht } from "@/lib/utils";

export default function InventoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const car = cars.find((c) => c.id === id);

  if (!car) return (
    <div className="text-center py-20">
      <p className="text-ev-muted">Vehicle not found.</p>
      <Link href="/admin/inventory" className="text-ev-primary hover:underline text-sm mt-2 inline-block">← Back to Inventory</Link>
    </div>
  );

  const model = carModels.find((m) => m.id === car.modelId);
  const carContracts = contracts.filter((c) => c.vehicleGroups.some((g) => g.licensePlates.includes(car.licensePlate)));

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <Link href="/admin/inventory" className="flex items-center gap-1 text-ev-muted hover:text-ev-black text-sm mb-3">
          <ArrowLeft size={14} /> Back to Inventory
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-ev-black font-mono">{car.licensePlate}</h1>
              <StatusBadge status={car.status} />
              {car.isPurchaseOfferEligible && (
                <span className="text-[10px] font-medium text-ev-primary bg-ev-primary-tint px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Wrench size={9} /> Offer Eligible
                </span>
              )}
            </div>
            <p className="text-sm text-ev-muted mt-1">JAC {car.modelName} · {car.carType} · {car.year} · {car.color}</p>
          </div>
          {car.currentContractId && (
            <button className="flex items-center gap-1.5 border border-gray-200 text-ev-muted hover:text-ev-black text-sm px-4 py-2 rounded-lg">
              <RefreshCw size={13} /> Swap Vehicle
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Vehicle info */}
          <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-ev-black mb-3">Vehicle Information</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Brand", value: "JAC Motors" },
                { label: "Model", value: car.modelName },
                { label: "Car Type", value: car.carType },
                { label: "Year", value: String(car.year) },
                { label: "Color", value: car.color },
                { label: "RFID Card", value: car.rfidCard },
                { label: "Odometer", value: `${car.odometer.toLocaleString()} km` },
                { label: "Current Renter", value: car.currentRenterName || "—" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[11px] text-ev-muted uppercase tracking-wide">{label}</p>
                  <p className="text-sm text-ev-black mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Model specs */}
          {model && (
            <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-ev-black mb-3">EV Specifications</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Battery", value: `${model.batteryKwh} kWh` },
                  { label: "WLTP Range", value: `${model.rangeWltp} km` },
                  { label: "NEDC Range", value: `${model.rangeNedc} km` },
                  { label: "Max AC", value: `${model.maxAcKw} kW` },
                  { label: "Max DC", value: `${model.maxDcKw} kW` },
                  { label: "Connectors", value: model.connectors.join(", ") },
                ].map(({ label, value }) => (
                  <div key={label} className="border border-gray-100 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-ev-muted">{label}</p>
                    <p className="text-sm font-medium text-ev-black mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Maintenance log */}
          <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-ev-black">Maintenance Log</h2>
              <button className="text-xs text-ev-primary hover:underline">+ Add</button>
            </div>
            {car.maintenanceLogs.length > 0 ? (
              <div className="flex flex-col gap-2">
                {car.maintenanceLogs.map((log) => (
                  <div key={log.id} className="border border-gray-100 rounded-lg px-4 py-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-ev-black">{log.type}</span>
                      <span className="text-sm font-medium text-ev-black">{formatBaht(log.cost)}</span>
                    </div>
                    <p className="text-xs text-ev-muted">{formatDate(log.date)} · {log.provider}</p>
                    <p className="text-xs text-ev-muted mt-0.5">{log.notes}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ev-muted italic">No maintenance records.</p>
            )}
          </div>

          {/* Contract history */}
          <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-ev-black mb-3">Contract History</h2>
            {carContracts.length > 0 ? (
              <div className="flex flex-col gap-2">
                {carContracts.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <Link href={`/admin/contracts/${c.id}`} className="text-sm font-medium text-ev-primary hover:underline font-mono">{c.id.toUpperCase()}</Link>
                      <p className="text-xs text-ev-muted">{c.companyName} · {formatDate(c.pickupDate)} → {formatDate(c.returnDate)}</p>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ev-muted italic">No contract history.</p>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Status history */}
          <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-ev-black mb-3">Status History</h2>
            <div className="flex flex-col gap-2">
              {car.statusHistory.map((h, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-ev-primary mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-ev-black"><StatusBadge status={h.status} /></p>
                    <p className="text-[10px] text-ev-muted mt-0.5">{formatDate(h.date)} · {h.changedBy}</p>
                    {h.note && <p className="text-[10px] text-ev-muted">{h.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insurance */}
          <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-ev-black mb-3">Insurance</h2>
            {car.insurance.policyNumber ? (
              <div className="flex flex-col gap-2">
                {[
                  { label: "Policy No.", value: car.insurance.policyNumber },
                  { label: "Provider", value: car.insurance.provider },
                  { label: "Expiry", value: formatDate(car.insurance.expiryDate) },
                  { label: "Annual Premium", value: formatBaht(car.insurance.annualPremium) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-xs text-ev-muted">{label}</span>
                    <span className="text-xs font-medium text-ev-black">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ev-muted italic">No insurance record.</p>
            )}
          </div>

          {/* Purchase offer toggle */}
          <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-ev-black mb-2">Purchase Offer</h2>
            <div className="flex items-center justify-between">
              <p className="text-xs text-ev-muted">Mark as eligible for purchase offer</p>
              <div className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${car.isPurchaseOfferEligible ? "bg-ev-primary" : "bg-gray-200"}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow m-0.5 transition-transform ${car.isPurchaseOfferEligible ? "translate-x-5" : "translate-x-0"}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
