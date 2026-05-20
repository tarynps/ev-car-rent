"use client";

import Link from "next/link";
import { Zap, Navigation, Activity, AlertTriangle, ChevronRight } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { vehicleTelematics, driverBehaviorEvents } from "@/lib/mock-data";

const COMPANY_ID = "c1";

// Bangkok bounding box for map positioning
const MAP_BOUNDS = { minLat: 13.65, maxLat: 13.95, minLng: 100.40, maxLng: 100.80 };
function toMapX(lng: number) { return ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100; }
function toMapY(lat: number) { return ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100; }

const EVENT_COLORS: Record<string, string> = {
  "Hard Brake": "text-red-600 bg-red-50",
  "Rapid Acceleration": "text-orange-600 bg-orange-50",
  "Speeding": "text-yellow-700 bg-yellow-50",
  "Idle": "text-gray-600 bg-gray-50",
};

export default function TelematicsPage() {
  const myVehicles = vehicleTelematics.filter((v) => v.companyId === COMPANY_ID);
  const allEvents = driverBehaviorEvents.filter((e) => myVehicles.some((v) => v.vehicleId === e.vehicleId));
  const avgSOC = Math.round(myVehicles.reduce((sum, v) => sum + v.soc, 0) / myVehicles.length);
  const chargingCount = myVehicles.filter((v) => v.chargingStatus === "Charging").length;
  const activeCount = myVehicles.filter((v) => v.ignition === "On").length;

  const todayEvents = allEvents.filter((e) => e.timestamp.startsWith("2026-05-20"));
  const hardBrakeToday = todayEvents.filter((e) => e.type === "Hard Brake").length;
  const rapidAccelToday = todayEvents.filter((e) => e.type === "Rapid Acceleration").length;
  const speedingToday = todayEvents.filter((e) => e.type === "Speeding").length;
  const idleToday = todayEvents.filter((e) => e.type === "Idle").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Telematics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Live fleet monitoring — Siam Motors Group</p>
      </div>

      {/* Fleet stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Active Vehicles", value: activeCount, sub: `of ${myVehicles.length} fleet`, color: "text-green-600", bg: "bg-green-50" },
          { label: "Avg Battery SOC", value: `${avgSOC}%`, sub: "fleet average", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Charging Now", value: chargingCount, sub: "vehicles plugged in", color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Events Today", value: todayEvents.length, sub: "driver behavior", color: "text-orange-600", bg: "bg-orange-50" },
        ].map(({ label, value, sub, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-2`}>
              <Activity size={16} className={color} />
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs font-medium text-gray-900 mt-0.5">{label}</p>
            <p className="text-xs text-gray-500">{sub}</p>
          </div>
        ))}
      </div>

      {/* Map + Vehicle list */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Live Map */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Live Map</h2>
            <span className="flex items-center gap-1.5 text-xs text-green-600">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Live
            </span>
          </div>
          <div className="relative bg-slate-800" style={{ height: 340 }}>
            {/* Map grid */}
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            {/* Street lines (decorative) */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute bg-white h-px" style={{ top: "35%", left: 0, right: 0 }} />
              <div className="absolute bg-white h-px" style={{ top: "65%", left: 0, right: 0 }} />
              <div className="absolute bg-white w-px" style={{ left: "40%", top: 0, bottom: 0 }} />
              <div className="absolute bg-white w-px" style={{ left: "70%", top: 0, bottom: 0 }} />
            </div>
            {/* Location labels */}
            <div className="absolute text-[9px] text-slate-400 font-medium" style={{ left: "28%", top: "72%" }}>Silom</div>
            <div className="absolute text-[9px] text-slate-400 font-medium" style={{ left: "38%", top: "67%" }}>Sukhumvit</div>
            <div className="absolute text-[9px] text-slate-400 font-medium" style={{ left: "42%", top: "57%" }}>Rama 9</div>
            <div className="absolute text-[9px] text-slate-400 font-medium" style={{ left: "48%", top: "6%" }}>Don Mueang</div>
            <div className="absolute text-[9px] text-slate-400 font-medium" style={{ left: "84%", top: "71%" }}>Ladkrabang</div>

            {/* Vehicle pins */}
            {vehicleTelematics.map((v) => {
              const x = toMapX(v.lng);
              const y = toMapY(v.lat);
              const isMyFleet = v.companyId === COMPANY_ID;
              const isMoving = v.ignition === "On" && v.speed > 0;
              return (
                <Link key={v.vehicleId} href={`/renter/telematics/${v.vehicleId}`}
                  style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                  className="group cursor-pointer"
                  title={`${v.brandName} ${v.modelName} — ${v.licensePlate}`}>
                  <div className={`relative w-4 h-4 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-150 ${
                    isMyFleet
                      ? v.chargingStatus === "Charging" ? "bg-emerald-400 border-emerald-600" : "bg-blue-400 border-blue-600"
                      : "bg-slate-400 border-slate-600"
                  }`}>
                    {isMoving && <span className="absolute inset-0 rounded-full animate-ping opacity-60 bg-blue-400" />}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] rounded px-1.5 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {v.brandName} {v.modelName}<br />{v.licensePlate} · {v.soc}%
                  </div>
                </Link>
              );
            })}

            {/* Legend */}
            <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2 flex gap-3 text-[10px] text-slate-300">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" />My Fleet</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" />Charging</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400" />Other</span>
            </div>
            <div className="absolute top-3 right-3 text-[9px] text-slate-500 bg-slate-900/60 px-2 py-1 rounded">Bangkok, Thailand</div>
          </div>
        </div>

        {/* Vehicle List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">My Fleet Vehicles</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {myVehicles.map((v) => (
              <Link key={v.vehicleId} href={`/renter/telematics/${v.vehicleId}`}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{v.brandName} {v.modelName}</p>
                    <StatusBadge status={v.chargingStatus} />
                  </div>
                  <p className="text-xs text-gray-500">{v.licensePlate}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    {/* SOC bar */}
                    <div className="flex items-center gap-1.5 flex-1">
                      <Zap size={10} className="text-blue-500 shrink-0" />
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-1.5 rounded-full ${v.soc < 20 ? "bg-red-500" : v.soc < 50 ? "bg-yellow-500" : "bg-green-500"}`}
                          style={{ width: `${v.soc}%` }} />
                      </div>
                      <span className="text-xs font-medium text-gray-700 shrink-0">{v.soc}%</span>
                    </div>
                    <span className="text-xs text-gray-500 flex items-center gap-1 shrink-0">
                      <Navigation size={10} />{v.speed} km/h
                    </span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Behavior Summary */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Fleet Behavior Summary — Today</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
          {[
            { label: "Hard Braking", count: hardBrakeToday, icon: "🛑", color: "text-red-600" },
            { label: "Rapid Acceleration", count: rapidAccelToday, icon: "⚡", color: "text-orange-600" },
            { label: "Speeding", count: speedingToday, icon: "🚀", color: "text-yellow-700" },
            { label: "Idle Time", count: idleToday, icon: "⏸", color: "text-gray-600" },
          ].map(({ label, count, icon, color }) => (
            <div key={label} className="px-5 py-4 text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <p className={`text-2xl font-bold ${color}`}>{count}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <AlertTriangle size={14} className="text-orange-500" />
            Recent Driver Events
          </h2>
        </div>
        <div className="divide-y divide-gray-50">
          {allEvents.slice(0, 6).map((event) => {
            const vehicle = myVehicles.find((v) => v.vehicleId === event.vehicleId);
            return (
              <div key={event.id} className="flex items-center gap-4 px-5 py-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${EVENT_COLORS[event.type]}`}>{event.type}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{event.location}</p>
                  <p className="text-xs text-gray-500">{vehicle?.licensePlate} · {vehicle?.brandName} {vehicle?.modelName}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-500">{event.timestamp.split(" ")[1]}</p>
                  <span className={`text-xs font-medium ${event.severity === "High" ? "text-red-600" : event.severity === "Medium" ? "text-orange-600" : "text-gray-400"}`}>
                    {event.severity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
