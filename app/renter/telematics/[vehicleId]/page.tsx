"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Zap, AlertTriangle, Gauge, Clock, Battery, Navigation2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { telematicsVehicles, tripRecords, behaviorEvents, chargingCosts } from "@/lib/mock-data";
import { formatDate, formatBaht } from "@/lib/utils";
import type { BehaviorEventType } from "@/lib/types";

const TABS = ["Location", "Battery & Charging", "Driver Behavior", "Vehicle Status"] as const;
type Tab = typeof TABS[number];

const SEVERITY_COLOR: Record<string, string> = {
  Low: "text-blue-500 bg-blue-50",
  Medium: "text-amber-600 bg-amber-50",
  High: "text-red-600 bg-red-50",
};

const EVENT_COLOR: Record<BehaviorEventType, string> = {
  "Hard Braking": "text-red-600",
  "Rapid Acceleration": "text-amber-600",
  "Speeding": "text-orange-600",
  "Idle": "text-blue-500",
};

// Battery history mock (last 7 days)
const batteryHistory = [
  { day: "14 May", morning: 85, evening: 42 },
  { day: "15 May", morning: 90, evening: 38 },
  { day: "16 May", morning: 92, evening: 55 },
  { day: "17 May", morning: 88, evening: 30 },
  { day: "18 May", morning: 95, evening: 48 },
  { day: "19 May", morning: 82, evening: 44 },
  { day: "20 May", morning: 78, evening: 32 },
];

export default function VehicleTelematicsPage({ params }: { params: Promise<{ vehicleId: string }> }) {
  const { vehicleId } = use(params);
  const [activeTab, setActiveTab] = useState<Tab>("Location");

  const vehicle = telematicsVehicles.find((v) => v.carId === vehicleId);
  const trips = tripRecords.filter((t) => t.carId === vehicleId);
  const events = behaviorEvents.filter((e) => e.carId === vehicleId);
  const charges = chargingCosts.filter((c) => c.carId === vehicleId);

  if (!vehicle) {
    return (
      <div className="flex flex-col gap-4">
        <Link href="/renter/telematics" className="flex items-center gap-1.5 text-sm text-secondary hover:text-primary">
          <ArrowLeft size={14} /> Back to Telematics
        </Link>
        <p className="text-primary font-medium">Vehicle not found.</p>
      </div>
    );
  }

  // Behavior chart data
  const behaviorChartData = (["Hard Braking", "Rapid Acceleration", "Speeding", "Idle"] as BehaviorEventType[]).map((type) => ({
    type: type.split(" ")[0],
    count: events.filter((e) => e.type === type).length,
  }));

  const estimatedRange = Math.round(vehicle.batteryPct * 3.2);

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link href="/renter/telematics" className="flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Telematics
        </Link>
        <span className="text-secondary">/</span>
        <span className="font-mono text-sm font-semibold text-primary">{vehicle.licensePlate}</span>
      </div>

      {/* Vehicle header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold text-primary">{vehicle.brandName} {vehicle.modelName}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${vehicle.ignitionOn ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-500"}`}>
                {vehicle.ignitionOn ? "Ignition On" : "Parked"}
              </span>
            </div>
            <p className="font-mono text-sm text-secondary">{vehicle.licensePlate}</p>
            <p className="text-xs text-gray-400 mt-0.5">Last updated {vehicle.lastUpdated}</p>
          </div>
          <div className="flex gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{vehicle.speed}</p>
              <p className="text-xs text-secondary">km/h</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{vehicle.batteryPct}%</p>
              <p className="text-xs text-secondary">Battery</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{estimatedRange}</p>
              <p className="text-xs text-secondary">km range</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm overflow-x-auto">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === tab ? "bg-tertiary text-white" : "text-secondary hover:text-primary"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* ── Location Tab ── */}
      {activeTab === "Location" && (
        <div className="flex flex-col gap-4">
          {/* Mock map */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <Navigation2 size={14} className="text-tertiary" />
              <p className="text-sm font-semibold text-primary">Real-time Position</p>
            </div>
            <div className="relative bg-slate-100 h-56 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full opacity-30">
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#94a3b8" strokeWidth="2" />
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#94a3b8" strokeWidth="2" />
              </svg>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-6 h-6 bg-tertiary rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                  <Zap size={12} className="text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs shadow text-center">
                  <p className="font-mono font-semibold text-primary">{vehicle.licensePlate}</p>
                  <p className="text-secondary">{vehicle.lat.toFixed(3)}°N, {vehicle.lng.toFixed(3)}°E</p>
                </div>
              </div>
              <p className="absolute bottom-2 right-3 text-xs text-slate-400">Simulated GPS</p>
            </div>
          </div>

          {/* Trip history */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-primary">Trip History</h2>
            </div>
            {trips.length === 0 ? (
              <p className="px-5 py-6 text-sm text-secondary">No trips recorded.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 text-xs text-secondary font-medium">Date</th>
                    <th className="text-left px-5 py-3 text-xs text-secondary font-medium">Start</th>
                    <th className="text-left px-5 py-3 text-xs text-secondary font-medium">End</th>
                    <th className="text-left px-5 py-3 text-xs text-secondary font-medium">Distance</th>
                    <th className="text-left px-5 py-3 text-xs text-secondary font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip) => (
                    <tr key={trip.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-5 py-3 text-secondary">{formatDate(trip.date)}</td>
                      <td className="px-5 py-3 text-primary">{trip.startLocation}<br /><span className="text-xs text-secondary">{trip.startTime}</span></td>
                      <td className="px-5 py-3 text-primary">{trip.endLocation}<br /><span className="text-xs text-secondary">{trip.endTime}</span></td>
                      <td className="px-5 py-3 font-medium">{trip.distanceKm} km</td>
                      <td className="px-5 py-3 text-secondary">{trip.durationMin} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── Battery & Charging Tab ── */}
      {activeTab === "Battery & Charging" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Current SOC", value: `${vehicle.batteryPct}%`, icon: <Battery size={16} className="text-tertiary" /> },
              { label: "Est. Range", value: `${estimatedRange} km` },
              { label: "Status", value: vehicle.isCharging ? "Charging" : "Not Charging" },
              { label: "Odometer", value: `${vehicle.odometer.toLocaleString()} km` },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className="text-xs text-secondary mb-1">{item.label}</p>
                <p className="text-lg font-bold text-primary">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-primary mb-4">Battery Level — Last 7 Days</h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={batteryHistory} barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="morning" name="Morning SOC" fill="#C8102E" radius={[3, 3, 0, 0]} />
                <Bar dataKey="evening" name="Evening SOC" fill="#D1D5DB" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-primary">Charging Sessions</h2>
            </div>
            {charges.length === 0 ? (
              <p className="px-5 py-6 text-sm text-secondary">No charging sessions recorded.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 text-xs text-secondary font-medium">Date</th>
                    <th className="text-left px-5 py-3 text-xs text-secondary font-medium">RFID Card</th>
                    <th className="text-left px-5 py-3 text-xs text-secondary font-medium">kWh</th>
                    <th className="text-left px-5 py-3 text-xs text-secondary font-medium">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {charges.map((c) => (
                    <tr key={c.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-5 py-3 text-secondary">{formatDate(c.date)}</td>
                      <td className="px-5 py-3 font-mono text-xs">{c.rfidCard}</td>
                      <td className="px-5 py-3">{c.kwh} kWh</td>
                      <td className="px-5 py-3 font-medium">{formatBaht(c.cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── Driver Behavior Tab ── */}
      {activeTab === "Driver Behavior" && (
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-primary mb-4">Events by Type</h2>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={behaviorChartData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="type" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" name="Events" fill="#C8102E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-primary">Event Log</h2>
              <p className="text-xs text-secondary mt-0.5">{events.length} events recorded</p>
            </div>
            {events.length === 0 ? (
              <p className="px-5 py-6 text-sm text-secondary">No behavior events recorded.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {events.map((e) => (
                  <div key={e.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="shrink-0">
                      {e.type === "Hard Braking" && <AlertTriangle size={15} className="text-red-500" />}
                      {e.type === "Rapid Acceleration" && <Gauge size={15} className="text-amber-500" />}
                      {e.type === "Speeding" && <Gauge size={15} className="text-orange-500" />}
                      {e.type === "Idle" && <Clock size={15} className="text-blue-400" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${EVENT_COLOR[e.type]}`}>{e.type}</p>
                      <p className="text-xs text-secondary">{e.location}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SEVERITY_COLOR[e.severity]}`}>{e.severity}</span>
                      <p className="text-xs text-gray-400 mt-0.5">{e.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Vehicle Status Tab ── */}
      {activeTab === "Vehicle Status" && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Current Speed",  value: `${vehicle.speed} km/h` },
            { label: "Odometer",       value: `${vehicle.odometer.toLocaleString()} km` },
            { label: "Ignition",       value: vehicle.ignitionOn ? "On" : "Off" },
            { label: "Battery",        value: `${vehicle.batteryPct}%` },
            { label: "Charging",       value: vehicle.isCharging ? "Charging" : "Not Charging" },
            { label: "Last Updated",   value: vehicle.lastUpdated },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <p className="text-xs text-secondary mb-1">{item.label}</p>
              <p className="text-lg font-bold text-primary">{item.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
