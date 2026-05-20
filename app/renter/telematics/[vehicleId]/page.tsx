"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Zap, Navigation, MapPin, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import StatusBadge from "@/components/StatusBadge";
import { vehicleTelematics, tripRecords, chargingSessionRecords, driverBehaviorEvents, socHistory } from "@/lib/mock-data";
import { formatBaht } from "@/lib/utils";
import { notFound } from "next/navigation";

const MAP_BOUNDS = { minLat: 13.65, maxLat: 13.95, minLng: 100.40, maxLng: 100.80 };
function toMapX(lng: number) { return ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100; }
function toMapY(lat: number) { return ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100; }

const SEVERITY_COLOR: Record<string, string> = {
  High: "text-red-600 bg-red-50 border-red-100",
  Medium: "text-orange-600 bg-orange-50 border-orange-100",
  Low: "text-gray-600 bg-gray-50 border-gray-100",
};

const EVENT_ICON: Record<string, string> = {
  "Hard Brake": "🛑",
  "Rapid Acceleration": "⚡",
  "Speeding": "🚀",
  "Idle": "⏸",
};

type Tab = "location" | "battery" | "behavior" | "status";

export default function VehicleTelematicsPage({ params }: { params: Promise<{ vehicleId: string }> }) {
  const { vehicleId } = use(params);
  const vehicle = vehicleTelematics.find((v) => v.vehicleId === vehicleId);
  if (!vehicle) return notFound();

  const [tab, setTab] = useState<Tab>("location");
  const trips = tripRecords.filter((t) => t.vehicleId === vehicleId);
  const sessions = chargingSessionRecords.filter((s) => s.vehicleId === vehicleId);
  const events = driverBehaviorEvents.filter((e) => e.vehicleId === vehicleId);
  const socData = socHistory[vehicleId] ?? [];

  const mapX = toMapX(vehicle.lng);
  const mapY = toMapY(vehicle.lat);

  // Behavior bar chart data
  const behaviorByType = ["Hard Brake", "Rapid Acceleration", "Speeding", "Idle"].map((type) => ({
    name: type.replace(" ", "\n"),
    count: events.filter((e) => e.type === type).length,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/renter/telematics" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-semibold text-gray-900">{vehicle.brandName} {vehicle.modelName}</h1>
            <StatusBadge status={vehicle.chargingStatus} />
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${vehicle.ignition === "On" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              Ignition {vehicle.ignition}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{vehicle.licensePlate} · Last updated {vehicle.lastUpdated}</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Speed", value: `${vehicle.speed} km/h`, icon: <Navigation size={16} className="text-blue-500" />, sub: "current" },
          { label: "Battery SOC", value: `${vehicle.soc}%`, icon: <Zap size={16} className="text-green-500" />, sub: `~${vehicle.estimatedRange} km range` },
          { label: "Odometer", value: `${vehicle.odometer.toLocaleString()} km`, icon: <Activity size={16} className="text-purple-500" />, sub: "total mileage" },
          { label: "Location", value: "Bangkok", icon: <MapPin size={16} className="text-orange-500" />, sub: "GPS active" },
        ].map(({ label, value, icon, sub }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs text-gray-500">{label}</span></div>
            <p className="text-lg font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm overflow-x-auto">
        {(["location", "battery", "behavior", "status"] as Tab[]).map((t) => {
          const labels: Record<Tab, string> = { location: "Location & Trips", battery: "Battery & Charging", behavior: "Driver Behavior", status: "Vehicle Status" };
          return (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 px-3 py-2 text-sm rounded-lg font-medium transition-colors whitespace-nowrap ${tab === t ? "bg-black text-white" : "text-gray-500 hover:text-gray-900"}`}>
              {labels[t]}
            </button>
          );
        })}
      </div>

      {/* Tab: Location */}
      {tab === "location" && (
        <div className="flex flex-col gap-4">
          {/* Mini map */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <MapPin size={14} className="text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900">Current Position</h3>
            </div>
            <div className="relative bg-slate-800" style={{ height: 260 }}>
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
              <div style={{ position: "absolute", left: `${mapX}%`, top: `${mapY}%`, transform: "translate(-50%, -50%)" }}>
                <div className="w-5 h-5 bg-blue-500 border-2 border-white rounded-full shadow-lg relative">
                  <span className="absolute inset-0 rounded-full animate-ping opacity-60 bg-blue-400" />
                </div>
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  {vehicle.licensePlate}
                </div>
              </div>
              <div className="absolute bottom-3 right-3 text-[9px] text-slate-500 bg-slate-900/60 px-2 py-1 rounded">
                {vehicle.lat.toFixed(4)}°N, {vehicle.lng.toFixed(4)}°E
              </div>
            </div>
          </div>

          {/* Trip history */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Trip History</h3>
            </div>
            {trips.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">No trip records available.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {trips.map((trip) => {
                  const durationH = Math.floor(trip.durationMin / 60);
                  const durationM = trip.durationMin % 60;
                  return (
                    <div key={trip.id} className="flex items-center gap-4 px-5 py-3.5">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <Navigation size={14} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{trip.startLocation} → {trip.endLocation}</p>
                        <p className="text-xs text-gray-500">{trip.date} · {trip.startTime} – {trip.endTime}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-gray-900">{trip.distanceKm} km</p>
                        <p className="text-xs text-gray-500">{durationH > 0 ? `${durationH}h ` : ""}{durationM}m</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Battery & Charging */}
      {tab === "battery" && (
        <div className="flex flex-col gap-4">
          {/* SOC chart */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Battery Level — Last 7 Days</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={socData} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={(v) => [`${v}%`, "SOC"]} />
                  <Line type="monotone" dataKey="soc" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Current charging status */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${vehicle.chargingStatus === "Charging" ? "bg-green-100" : vehicle.chargingStatus === "Full" ? "bg-blue-100" : "bg-gray-100"}`}>
              <Zap size={20} className={vehicle.chargingStatus === "Charging" ? "text-green-600" : vehicle.chargingStatus === "Full" ? "text-blue-600" : "text-gray-400"} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{vehicle.chargingStatus}</p>
              <p className="text-sm text-gray-500">Current SOC: {vehicle.soc}% · Estimated range: {vehicle.estimatedRange} km</p>
            </div>
          </div>

          {/* Charging sessions */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Charging Sessions</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {sessions.map((s) => (
                <div key={s.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <Zap size={14} className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{s.location}</p>
                    <p className="text-xs text-gray-500">{s.date} · {s.durationMin} min · {s.kwhCharged} kWh</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 shrink-0">{formatBaht(s.cost)}</span>
                </div>
              ))}
              {sessions.length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-gray-400">No charging sessions recorded.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Driver Behavior */}
      {tab === "behavior" && (
        <div className="flex flex-col gap-4">
          {/* Chart */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Event Count by Type</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={behaviorByType} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Events log */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Events Log</h3>
            </div>
            {events.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">No behavior events recorded.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {events.map((e) => (
                  <div key={e.id} className="flex items-center gap-4 px-5 py-3.5">
                    <span className="text-xl">{EVENT_ICON[e.type]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{e.type}</p>
                      <p className="text-xs text-gray-500 truncate">{e.location}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-500">{e.timestamp.split(" ")[1]}</p>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded border ${SEVERITY_COLOR[e.severity]}`}>{e.severity}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Vehicle Status */}
      {tab === "status" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Current Vehicle Status</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {[
              { label: "License Plate", value: vehicle.licensePlate },
              { label: "Model", value: `${vehicle.brandName} ${vehicle.modelName}` },
              { label: "Current Speed", value: `${vehicle.speed} km/h` },
              { label: "Odometer", value: `${vehicle.odometer.toLocaleString()} km` },
              { label: "Ignition", value: vehicle.ignition },
              { label: "Door Status", value: vehicle.doorStatus },
              { label: "Battery SOC", value: `${vehicle.soc}%` },
              { label: "Est. Range", value: `${vehicle.estimatedRange} km` },
              { label: "Charging Status", value: vehicle.chargingStatus },
              { label: "GPS Position", value: `${vehicle.lat.toFixed(4)}°N, ${vehicle.lng.toFixed(4)}°E` },
              { label: "Last Updated", value: vehicle.lastUpdated },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center px-5 py-3.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
