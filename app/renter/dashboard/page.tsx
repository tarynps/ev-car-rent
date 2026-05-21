"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  BatteryCharging,
  BellRing,
  Car,
  CarFront,
  ChevronRight,
  Clock,
  Gauge,
  MapPin,
  Radio,
  Route,
  Shield,
  ShieldAlert,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import StatusBadge from "@/components/StatusBadge";
import {
  bookings, carModels, cars, contracts, rentToSellEntries,
  telematicsVehicles, tripRecords, behaviorEvents,
} from "@/lib/mock-data";
import { daysUntil, formatBaht, formatDate } from "@/lib/utils";

// ── Original data helpers ─────────────────────────────────────────────────────

const vehicleCategoryByModel: Record<string, string> = {
  m1: "6-wheel",
  m2: "Pickup",
  m3: "Van",
  m4: "Van",
  m5: "10-wheel",
  m6: "10-wheel",
  m7: "10-wheel",
  m8: "10-wheel",
  m9: "10-wheel",
  m10: "10-wheel",
  m11: "Prime Mover",
  m12: "8-wheel",
  m13: "10-wheel",
  m14: "Prime Mover",
  m15: "10-wheel",
};

const telematicsByCar: Record<string, {
  battery: number;
  charging: boolean;
  speed: number;
  gps: string;
  mapX: number;
  mapY: number;
  alerts: string[];
  behavior: {
    hardBraking: number;
    rapidAcceleration: number;
    speeding: number;
    idleHours: number;
  };
}> = {
  car1: {
    battery: 68,
    charging: false,
    speed: 42,
    gps: "Bang Na, Bangkok",
    mapX: 68,
    mapY: 44,
    alerts: [],
    behavior: { hardBraking: 1, rapidAcceleration: 0, speeding: 0, idleHours: 1.2 },
  },
  car5: {
    battery: 42,
    charging: true,
    speed: 0,
    gps: "Lat Krabang Depot",
    mapX: 78,
    mapY: 60,
    alerts: ["Low battery watch"],
    behavior: { hardBraking: 2, rapidAcceleration: 1, speeding: 1, idleHours: 2.4 },
  },
};

function getModelPhoto(modelId: string) {
  return carModels.find((model) => model.id === modelId)?.photos[0];
}

function getVehicleCategory(modelId: string) {
  return vehicleCategoryByModel[modelId] ?? "Fleet vehicle";
}

// ── Telematics analytics data ─────────────────────────────────────────────────

const TODAY = "2026-05-20";
const myVehicles = telematicsVehicles.filter((v) => v.companyId === "c1");
const activeCount = myVehicles.filter((v) => v.ignitionOn).length;
const chargingCountLive = myVehicles.filter((v) => v.isCharging).length;

const myTrips = tripRecords.filter((t) => myVehicles.some((v) => v.carId === t.carId));
const todayTrips = myTrips.filter((t) => t.date === TODAY);
const todayDistance = todayTrips.reduce((s, t) => s + t.distanceKm, 0);

const myEvents = behaviorEvents.filter((e) => myVehicles.some((v) => v.carId === e.carId));
const todayEvents = myEvents.filter((e) => e.timestamp.startsWith(TODAY));

const severityWeight = { High: 15, Medium: 8, Low: 3 } as const;
const safetyScore = Math.max(0, Math.round(
  100 - myEvents.reduce((s, e) => s + (severityWeight[e.severity as keyof typeof severityWeight] ?? 5), 0)
));
const safetyColor = safetyScore >= 80 ? "#22c55e" : safetyScore >= 60 ? "#f59e0b" : "#ef4444";
const utilisationPct = Math.round((activeCount / (myVehicles.length || 1)) * 100);

const distanceByDay = ["2026-05-18", "2026-05-19", "2026-05-20"].map((date) => ({
  date: date.slice(5),
  km: Math.round(myTrips.filter((t) => t.date === date).reduce((s, t) => s + t.distanceKm, 0)),
}));

const eventsByType = ["Hard Braking", "Speeding", "Rapid Acceleration", "Idle"].map((type) => ({
  type: type === "Rapid Acceleration" ? "Rapid Accel." : type,
  count: myEvents.filter((e) => e.type === type).length,
}));

const recentEvents = [...myEvents]
  .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  .slice(0, 5);

// ── Sub-components ────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-secondary uppercase tracking-wide">{label}</p>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-bold text-primary">{value}</p>
      {sub && <p className="text-xs text-secondary mt-1">{sub}</p>}
    </div>
  );
}

function GaugeDonut({ value, color, label, sub }: { value: number; color: string; label: string; sub: string }) {
  const data = [{ v: value }, { v: 100 - value }];
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <p className="text-sm font-semibold text-primary mb-0.5">{label}</p>
      <p className="text-xs text-secondary mb-4">{sub}</p>
      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28 shrink-0">
          <PieChart width={112} height={112}>
            <Pie data={data} dataKey="v" cx={52} cy={52} innerRadius={36} outerRadius={52}
              startAngle={90} endAngle={-270} strokeWidth={0}>
              <Cell fill={color} />
              <Cell fill="#F3F4F6" />
            </Pie>
          </PieChart>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold" style={{ color }}>{value}%</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-primary font-medium">{value}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
            <span className="text-secondary">{100 - value}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RenterDashboard() {
  const myCompanyId = "c1";
  const companyName = "Siam Motors Group";
  const myBookings = bookings.filter((booking) => booking.companyId === myCompanyId);
  const activeRentals = myBookings.filter((booking) => booking.status === "Active");
  const myContracts = contracts.filter((contract) => contract.companyId === myCompanyId);
  const activeContracts = myContracts.filter((contract) => contract.status === "Active");
  const myCars = activeRentals
    .map((booking) => cars.find((car) => car.id === booking.carId))
    .filter((car): car is NonNullable<typeof car> => Boolean(car));

  const overdueRentals = activeRentals.filter((booking) => daysUntil(booking.returnDate) < 0);
  const maintenanceRentals = myCars.filter((car) => car.status === "Maintenance");
  const expiringContracts = activeRentals.filter((booking) => {
    const remaining = daysUntil(booking.returnDate);
    return remaining >= 0 && remaining <= 30;
  });

  const categoryCounts = ["6-wheel", "8-wheel", "10-wheel", "Prime Mover", "Pickup", "Van"].map((category) => ({
    category,
    count: activeRentals.filter((booking) => getVehicleCategory(booking.modelId) === category).length,
  }));

  const fleetTelemetry = activeRentals.map((booking) => {
    const car = cars.find((candidate) => candidate.id === booking.carId);
    const telemetry = telematicsByCar[booking.carId] ?? {
      battery: 75,
      charging: false,
      speed: 0,
      gps: "Bangkok",
      mapX: 50,
      mapY: 50,
      alerts: [],
      behavior: { hardBraking: 0, rapidAcceleration: 0, speeding: 0, idleHours: 0 },
    };

    return { booking, car, telemetry };
  });

  const averageBattery = fleetTelemetry.length
    ? Math.round(fleetTelemetry.reduce((sum, item) => sum + item.telemetry.battery, 0) / fleetTelemetry.length)
    : 0;
  const chargingCount = fleetTelemetry.filter((item) => item.telemetry.charging).length;
  const alertCount = fleetTelemetry.reduce((sum, item) => sum + item.telemetry.alerts.length, 0);
  const behaviorTotals = fleetTelemetry.reduce(
    (totals, item) => ({
      hardBraking: totals.hardBraking + item.telemetry.behavior.hardBraking,
      rapidAcceleration: totals.rapidAcceleration + item.telemetry.behavior.rapidAcceleration,
      speeding: totals.speeding + item.telemetry.behavior.speeding,
      idleHours: totals.idleHours + item.telemetry.behavior.idleHours,
    }),
    { hardBraking: 0, rapidAcceleration: 0, speeding: 0, idleHours: 0 },
  );

  const purchaseOfferAlerts = rentToSellEntries
    .filter((entry) => entry.companyId === myCompanyId && entry.conversionStatus !== "Completed")
    .map((entry) => {
      const booking = myBookings.find((candidate) => candidate.id === entry.bookingId);
      const car = cars.find((candidate) => candidate.id === entry.carId);
      const progress = Math.min(100, Math.round((entry.totalPaid / entry.buyoutAmount) * 100));

      return {
        ...entry,
        booking,
        photo: car ? getModelPhoto(car.modelId) : undefined,
        progress,
        remaining: entry.buyoutAmount - entry.totalPaid,
      };
    });

  const summaryCards = [
    { label: "Rented Vehicles", value: activeRentals.length, note: `${myCars.length} assigned units`, icon: CarFront },
    { label: "Active", value: activeRentals.length, note: "currently on contract", icon: Route },
    { label: "Overdue", value: overdueRentals.length, note: "past return date", icon: AlertTriangle },
    { label: "Maintenance", value: maintenanceRentals.length, note: "service hold", icon: ShieldAlert },
    { label: "Active Contracts", value: activeContracts.length, note: `${myContracts.length} total contracts`, icon: BellRing },
    { label: "Expiring <30 Days", value: expiringContracts.length, note: "needs attention", icon: Timer },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Welcome Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-tertiary">Corporate fleet overview</p>
          <h1 className="text-xl font-semibold text-primary mt-1">Welcome back, Siriporn</h1>
          <p className="text-sm text-secondary mt-0.5">{companyName} · 20 May 2026</p>
        </div>
        <Link
          href="/renter/requests/new"
          className="inline-flex items-center justify-center gap-2 bg-tertiary text-white text-sm px-4 py-2 rounded-lg hover:bg-tertiary-dark transition-colors"
        >
          New Contract Request <ChevronRight size={14} />
        </Link>
      </div>

      {/* Fleet Summary */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-secondary">Fleet Summary</h2>
          <Link href="/renter/fleet" className="text-xs text-tertiary hover:underline">Open My Fleet</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3">
          {summaryCards.map(({ label, value, note, icon: Icon }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-wide text-secondary">{label}</p>
                <Icon size={15} className="text-tertiary" />
              </div>
              <p className="text-2xl font-semibold text-primary mt-3">{value}</p>
              <p className="text-xs text-secondary mt-1">{note}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-primary">Vehicles by Car Type</h3>
              <span className="text-xs text-secondary">{activeRentals.length} active units</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categoryCounts.map(({ category, count }) => (
                <div key={category} className="rounded-lg bg-neutral border border-gray-100 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-primary">{category}</p>
                    <span className="text-sm font-semibold text-tertiary">{count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full mt-3 overflow-hidden">
                    <div
                      className="h-full bg-tertiary rounded-full"
                      style={{ width: `${activeRentals.length ? (count / activeRentals.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-primary">Contracts Expiring Within 30 Days</h3>
            <div className="mt-4 flex flex-col gap-3">
              {expiringContracts.length === 0 ? (
                <p className="text-sm text-secondary">No contracts expiring in the next 30 days.</p>
              ) : expiringContracts.map((booking) => (
                <Link key={booking.id} href={`/renter/fleet/${booking.id}`} className="rounded-lg border border-tertiary/20 bg-tertiary-tint p-3 block">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-primary">{booking.brandName} {booking.modelName}</p>
                      <p className="text-xs text-secondary">{booking.licensePlate} · {formatDate(booking.returnDate)}</p>
                    </div>
                    <span className="text-xs font-semibold text-tertiary">{daysUntil(booking.returnDate)}d</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Telematics Overview (original) */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-secondary">Telematics Overview</h2>
          <span className="text-xs text-secondary">Fleet-wide live snapshot</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-primary">Fleet Live Map</h3>
                <p className="text-xs text-secondary mt-0.5">Active rented vehicles plotted by last GPS ping.</p>
              </div>
              <Radio size={16} className="text-tertiary" />
            </div>
            <div className="relative h-72 bg-[linear-gradient(135deg,#f8f8f8_0%,#f8f8f8_49%,#eeeeee_49%,#eeeeee_51%,#f8f8f8_51%)]">
              <div className="absolute inset-0 opacity-60">
                <div className="absolute left-8 right-8 top-1/3 h-px bg-gray-300" />
                <div className="absolute left-12 right-16 top-2/3 h-px bg-gray-300" />
                <div className="absolute top-8 bottom-8 left-1/3 w-px bg-gray-300" />
                <div className="absolute top-10 bottom-10 left-2/3 w-px bg-gray-300" />
              </div>
              {fleetTelemetry.map(({ booking, telemetry }) => (
                <Link
                  key={booking.id}
                  href={`/renter/telematics/${booking.carId}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${telemetry.mapX}%`, top: `${telemetry.mapY}%` }}
                >
                  <span className="relative flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-30 group-hover:animate-ping" />
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-tertiary ring-4 ring-white shadow" />
                  </span>
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-primary px-2 py-1 text-[11px] text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
                    {booking.licensePlate} · {telemetry.gps}
                  </span>
                </Link>
              ))}
              <div className="absolute bottom-4 left-5 rounded-lg bg-white/90 border border-gray-100 px-3 py-2 shadow-sm">
                <p className="text-xs font-medium text-primary">Bangkok service region</p>
                <p className="text-[11px] text-secondary">Live GPS mock layer</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-primary">Battery Summary</h3>
                <BatteryCharging size={16} className="text-tertiary" />
              </div>
              <p className="text-3xl font-semibold text-primary mt-4">{averageBattery}%</p>
              <p className="text-xs text-secondary mt-1">average state of charge</p>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-tertiary rounded-full" style={{ width: `${averageBattery}%` }} />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="rounded-lg bg-neutral p-3">
                  <p className="text-xs text-secondary">Charging</p>
                  <p className="text-lg font-semibold text-primary">{chargingCount}</p>
                </div>
                <div className="rounded-lg bg-neutral p-3">
                  <p className="text-xs text-secondary">Not Charging</p>
                  <p className="text-lg font-semibold text-primary">{Math.max(0, fleetTelemetry.length - chargingCount)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-primary">Active Alerts</h3>
                <AlertTriangle size={16} className="text-tertiary" />
              </div>
              <p className="text-3xl font-semibold text-primary mt-4">{alertCount}</p>
              <p className="text-xs text-secondary mt-1">low battery, geofence, or speeding warnings</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { label: "Hard Braking", value: behaviorTotals.hardBraking, suffix: "events", icon: ShieldAlert },
            { label: "Rapid Acceleration", value: behaviorTotals.rapidAcceleration, suffix: "events", icon: Zap },
            { label: "Speeding", value: behaviorTotals.speeding, suffix: "events", icon: Gauge },
            { label: "Idle Time", value: behaviorTotals.idleHours.toFixed(1), suffix: "hours", icon: Timer },
          ].map(({ label, value, suffix, icon: Icon }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-wide text-secondary">{label}</p>
                <Icon size={15} className="text-tertiary" />
              </div>
              <p className="text-2xl font-semibold text-primary mt-3">{value}</p>
              <p className="text-xs text-secondary mt-1">{suffix} today</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-primary">Vehicle Telemetry List</h3>
            <Link href="/renter/fleet" className="text-xs text-tertiary hover:underline">View fleet</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {fleetTelemetry.map(({ booking, car, telemetry }) => (
              <Link key={booking.id} href={`/renter/telematics/${booking.carId}`} className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_auto] gap-3 px-5 py-3 hover:bg-gray-50/60 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-primary">{booking.brandName} {booking.modelName}</p>
                  <p className="text-xs text-secondary">{booking.licensePlate} · {getVehicleCategory(booking.modelId)}</p>
                </div>
                <div className="text-sm text-secondary flex items-center gap-1.5">
                  <MapPin size={13} className="text-tertiary" />
                  {telemetry.gps}
                </div>
                <div className="text-sm text-secondary">
                  {telemetry.battery}% SOC · {telemetry.charging ? "Charging" : "Not charging"}
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={car?.status === "Maintenance" ? "Maintenance" : booking.status} />
                  <span className="text-xs text-secondary">{telemetry.speed} km/h</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Purchase Offer Alerts */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-secondary">Purchase Offer Alerts</h2>
          <span className="text-xs text-secondary">{purchaseOfferAlerts.length} available</span>
        </div>

        {purchaseOfferAlerts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-secondary">No purchase offers have been sent by admin yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {purchaseOfferAlerts.map((offer) => (
              <div key={offer.carId} className="bg-white rounded-xl border border-tertiary/20 shadow-sm overflow-hidden">
                <div className="p-4 flex gap-4">
                  <div className="relative w-28 h-20 rounded-lg bg-gray-50 overflow-hidden shrink-0">
                    {offer.photo ? (
                      <Image
                        src={offer.photo}
                        alt={`${offer.brandName} ${offer.modelName}`}
                        fill
                        sizes="112px"
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-gray-300">J</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-primary">{offer.brandName} {offer.modelName}</p>
                        <p className="text-xs text-secondary">{offer.licensePlate}</p>
                      </div>
                      <span className="rounded-full bg-tertiary-tint px-2 py-1 text-xs font-medium text-tertiary whitespace-nowrap">Offer sent</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                      <div>
                        <p className="text-secondary">Buyout amount</p>
                        <p className="font-semibold text-primary mt-0.5">{formatBaht(offer.buyoutAmount)}</p>
                      </div>
                      <div>
                        <p className="text-secondary">Remaining</p>
                        <p className="font-semibold text-primary mt-0.5">{formatBaht(offer.remaining)}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-secondary mb-1.5">
                        <span>Rental paid progress</span>
                        <span>{offer.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-tertiary rounded-full" style={{ width: `${offer.progress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-tertiary-tint/50 border-t border-tertiary/10 flex items-center justify-between gap-3">
                  <p className="text-xs text-secondary">Offer expiry: 30 Jun 2026</p>
                  <Link
                    href={offer.booking ? `/renter/fleet/${offer.booking.id}` : "/renter/fleet"}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-tertiary hover:underline"
                  >
                    View Offer <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Telematics Analytics (new deep-dive section) ── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-secondary">Telematics Analytics</h2>
            <p className="text-xs text-secondary mt-0.5">Last updated: {TODAY} · Siam Motors Group</p>
          </div>
          <Link href="/renter/telematics"
            className="flex items-center gap-2 bg-tertiary text-white text-sm px-4 py-2 rounded-lg hover:bg-tertiary-dark transition-colors">
            <Radio size={14} /> Live Map
          </Link>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Total Fleet" value={myVehicles.length} sub={`${activeContracts.length} active contracts`} icon={Car} color="#C8102E" />
          <KpiCard label="Active Now" value={activeCount} sub={`${chargingCountLive} charging`} icon={Activity} color="#22c55e" />
          <KpiCard label="Distance Today" value={`${todayDistance.toFixed(1)} km`} sub={`${todayTrips.length} trips`} icon={TrendingUp} color="#3b82f6" />
          <KpiCard label="Events Today" value={todayEvents.length} sub={`${myEvents.length} total on record`} icon={AlertTriangle} color="#f59e0b" />
        </div>

        {/* Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GaugeDonut value={safetyScore} color={safetyColor} label="Driver Safety Score"
            sub={`Based on ${myEvents.length} recorded behavior events`} />
          <GaugeDonut value={utilisationPct} color="#C8102E" label="Fleet Utilisation"
            sub={`${activeCount} of ${myVehicles.length} vehicles active now`} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={15} className="text-tertiary" />
              <p className="text-sm font-semibold text-primary">Distance per Day</p>
              <span className="ml-auto text-xs text-secondary">Last 3 days · km</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={distanceByDay} barSize={36}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6B6B6B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B6B6B" }} axisLine={false} tickLine={false} width={32} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                  formatter={(v) => [`${v} km`, "Distance"]} />
                <Bar dataKey="km" fill="#C8102E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={15} className="text-tertiary" />
              <p className="text-sm font-semibold text-primary">Events by Type</p>
              <span className="ml-auto text-xs text-secondary">All recorded</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={eventsByType} layout="vertical" barSize={18}>
                <XAxis type="number" tick={{ fontSize: 11, fill: "#6B6B6B" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="type" tick={{ fontSize: 11, fill: "#6B6B6B" }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
                <Bar dataKey="count" fill="#C8102E" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Vehicle Status table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Radio size={14} className="text-tertiary" />
            <h2 className="text-sm font-semibold text-primary">Live Vehicle Status</h2>
            <span className="ml-auto text-xs text-secondary">{myVehicles.length} vehicles · Updated just now</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs text-secondary font-medium">License</th>
                  <th className="text-left px-5 py-3 text-xs text-secondary font-medium">Model</th>
                  <th className="text-left px-5 py-3 text-xs text-secondary font-medium">Battery</th>
                  <th className="text-left px-5 py-3 text-xs text-secondary font-medium">Speed</th>
                  <th className="text-left px-5 py-3 text-xs text-secondary font-medium">Status</th>
                  <th className="text-left px-5 py-3 text-xs text-secondary font-medium">Updated</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {myVehicles.map((v) => {
                  const status = v.isCharging ? "Charging" : v.ignitionOn ? "Moving" : "Idle";
                  const statusCls = v.isCharging
                    ? "text-blue-600 bg-blue-50"
                    : v.ignitionOn
                    ? "text-green-600 bg-green-50"
                    : "text-secondary bg-gray-100";
                  const batCls = v.batteryPct < 20 ? "bg-red-500" : v.batteryPct < 50 ? "bg-amber-400" : "bg-green-500";
                  return (
                    <tr key={v.carId} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-mono text-xs font-semibold text-primary">{v.licensePlate}</td>
                      <td className="px-5 py-3 text-xs text-secondary">{v.brandName} {v.modelName}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 w-28">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${batCls}`} style={{ width: `${v.batteryPct}%` }} />
                          </div>
                          <span className="text-xs text-secondary w-8 text-right">{v.batteryPct}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-secondary">{v.speed} km/h</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusCls}`}>{status}</span>
                      </td>
                      <td className="px-5 py-3 text-xs text-secondary">{v.lastUpdated.slice(11)}</td>
                      <td className="px-5 py-3">
                        <Link href={`/renter/telematics/${v.carId}`}
                          className="flex items-center gap-0.5 text-xs text-tertiary hover:underline whitespace-nowrap">
                          Detail <ChevronRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Behavior Events */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <AlertTriangle size={14} className="text-tertiary" />
            <h2 className="text-sm font-semibold text-primary">Recent Behavior Events</h2>
            <Link href="/renter/telematics" className="ml-auto text-xs text-tertiary hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentEvents.map((e) => {
              const sevCls = e.severity === "High"
                ? "text-red-600 bg-red-50 border border-red-100"
                : e.severity === "Medium"
                ? "text-amber-600 bg-amber-50 border border-amber-100"
                : "text-secondary bg-gray-100 border border-gray-200";
              const vehicle = myVehicles.find((v) => v.carId === e.carId);
              return (
                <div key={e.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-8 h-8 rounded-lg bg-tertiary-tint flex items-center justify-center shrink-0">
                    <Gauge size={14} className="text-tertiary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary">{e.type}</p>
                    <p className="text-xs text-secondary truncate">{e.location} · {vehicle?.licensePlate}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sevCls}`}>{e.severity}</span>
                    <span className="flex items-center gap-1 text-xs text-secondary">
                      <Clock size={11} /> {e.timestamp.slice(11)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
