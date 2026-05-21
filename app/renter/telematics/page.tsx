"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, AlertTriangle, Clock, Gauge } from "lucide-react";
import { telematicsVehicles, behaviorEvents } from "@/lib/mock-data";
import type { BehaviorEventType } from "@/lib/types";

const myVehicles = telematicsVehicles.filter((v) => v.companyId === "c1");

function batteryColor(pct: number) {
  if (pct >= 60) return "bg-green-500";
  if (pct >= 30) return "bg-amber-500";
  return "bg-red-500";
}

const EVENT_ICONS: Record<BehaviorEventType, React.ReactNode> = {
  "Hard Braking":       <AlertTriangle size={12} className="text-red-500" />,
  "Rapid Acceleration": <Gauge size={12} className="text-amber-500" />,
  "Speeding":           <Gauge size={12} className="text-orange-500" />,
  "Idle":               <Clock size={12} className="text-blue-400" />,
};

const myEvents = behaviorEvents.filter((e) => myVehicles.some((v) => v.carId === e.carId));

function countEvents(type?: BehaviorEventType) {
  return type ? myEvents.filter((e) => e.type === type).length : myEvents.length;
}

// Top 5 vehicles by event count
const vehicleEventCount = myVehicles.map((v) => ({
  ...v,
  count: myEvents.filter((e) => e.carId === v.carId).length,
})).sort((a, b) => b.count - a.count).slice(0, 5);

export default function TelematicsPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-primary">Telematics</h1>
        <p className="text-sm text-secondary mt-0.5">{myVehicles.length} active vehicles</p>
      </div>

      {/* Map + Vehicle list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Mock map */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-primary">Live Map — Bangkok Area</p>
          </div>
          <div className="relative bg-slate-100 h-72 overflow-hidden">
            {/* Road grid simulation */}
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#94a3b8" strokeWidth="2" />
              <line x1="0" y1="65%" x2="100%" y2="65%" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#94a3b8" strokeWidth="2" />
              <line x1="60%" y1="0" x2="60%" y2="100%" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="80%" y1="20%" x2="20%" y2="90%" stroke="#94a3b8" strokeWidth="1" />
            </svg>
            <p className="absolute bottom-2 right-3 text-xs text-slate-400">Simulated GPS — Bangkok</p>
            {/* Vehicle dots */}
            {myVehicles.map((v, i) => {
              // Map lat/lng to percentage positions
              const x = ((v.lng - 100.48) / 0.28) * 100;
              const y = ((13.77 - v.lat) / 0.05) * 100;
              const isSelected = selectedVehicle === v.carId;
              return (
                <button
                  key={v.carId}
                  onClick={() => setSelectedVehicle(isSelected ? null : v.carId)}
                  style={{ left: `${Math.min(Math.max(x, 5), 92)}%`, top: `${Math.min(Math.max(y, 5), 85)}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  title={v.licensePlate}
                >
                  <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md flex items-center justify-center ${v.ignitionOn ? "bg-tertiary" : "bg-gray-400"} ${isSelected ? "ring-2 ring-tertiary ring-offset-1 scale-125" : ""}`}>
                    <Zap size={8} className="text-white" />
                  </div>
                  {isSelected && (
                    <div className="absolute left-5 top-0 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs shadow-md whitespace-nowrap z-10">
                      <p className="font-mono font-semibold text-primary">{v.licensePlate}</p>
                      <p className="text-secondary">{v.modelName}</p>
                      <p className="text-secondary">{v.ignitionOn ? `${v.speed} km/h` : "Parked"} · 🔋{v.batteryPct}%</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Vehicle list */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-primary">Vehicles</p>
          </div>
          <div className="divide-y divide-gray-50">
            {myVehicles.map((v) => (
              <Link key={v.carId} href={`/renter/telematics/${v.carId}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className={`w-2 h-2 rounded-full shrink-0 ${v.ignitionOn ? "bg-green-500" : "bg-gray-300"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono font-semibold text-primary">{v.licensePlate}</p>
                  <p className="text-xs text-secondary truncate">{v.modelName}</p>
                  <p className="text-xs text-secondary">{v.ignitionOn ? `${v.speed} km/h` : "Parked"}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 justify-end mb-0.5">
                    <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-1.5 rounded-full ${batteryColor(v.batteryPct)}`} style={{ width: `${v.batteryPct}%` }} />
                    </div>
                    <span className="text-xs text-secondary">{v.batteryPct}%</span>
                  </div>
                  {v.isCharging && <span className="text-xs text-green-600">Charging</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Fleet behavior summary */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-primary">Fleet Behavior Summary</h2>
          <p className="text-xs text-secondary mt-0.5">Across all active vehicles · today</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-y md:divide-y-0 divide-gray-100">
          {([
            { label: "Hard Braking",       type: "Hard Braking" as BehaviorEventType,       icon: <AlertTriangle size={18} className="text-red-500" /> },
            { label: "Rapid Acceleration", type: "Rapid Acceleration" as BehaviorEventType, icon: <Gauge size={18} className="text-amber-500" /> },
            { label: "Speeding",           type: "Speeding" as BehaviorEventType,            icon: <Gauge size={18} className="text-orange-500" /> },
            { label: "Idle Events",        type: "Idle" as BehaviorEventType,               icon: <Clock size={18} className="text-blue-400" /> },
          ]).map((item) => (
            <div key={item.label} className="px-5 py-4">
              <div className="flex items-center gap-2 mb-1">{item.icon}<p className="text-xs text-secondary">{item.label}</p></div>
              <p className="text-2xl font-bold text-primary">{countEvents(item.type)}</p>
              <p className="text-xs text-secondary mt-0.5">events today</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top vehicles by events */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-primary">Top Vehicles by Behavior Events</h2>
          <p className="text-xs text-secondary mt-0.5">This month</p>
        </div>
        <div className="divide-y divide-gray-50">
          {vehicleEventCount.map((v, i) => (
            <Link key={v.carId} href={`/renter/telematics/${v.carId}`}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
              <span className="text-sm text-secondary w-5">{i + 1}.</span>
              <div className="flex-1">
                <p className="text-sm font-mono font-medium text-primary">{v.licensePlate}</p>
                <p className="text-xs text-secondary">{v.modelName}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 bg-gray-100 rounded-full w-24 overflow-hidden">
                  <div className="h-1.5 bg-tertiary rounded-full" style={{ width: `${(v.count / (vehicleEventCount[0]?.count || 1)) * 100}%` }} />
                </div>
                <span className="text-sm font-semibold text-primary w-4 text-right">{v.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
