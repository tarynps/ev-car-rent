import Link from "next/link";
import { Clock, ArrowRight, Bell, TrendingUp, ChevronRight } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { bookings, notifications, rentToSellEntries, carModels } from "@/lib/mock-data";
import { formatBaht, formatDate, daysUntil } from "@/lib/utils";

export default function RenterDashboard() {
  const myCompanyId = "c1";
  const myBookings = bookings.filter((b) => b.companyId === myCompanyId);
  const activeRentals = myBookings.filter((b) => b.status === "Active");
  const recentBookings = myBookings.slice(0, 5);
  const unreadNotifications = notifications.filter((n) => !n.read);
  const myRentToSell = rentToSellEntries.filter((e) => e.companyName === "Siam Motors Group" && e.conversionStatus !== "Completed");

  function getModelPhoto(brandName: string, modelName: string) {
    return carModels.find((m) => m.brandName === brandName && m.name === modelName)?.photos[0];
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Welcome back, Siriporn</h1>
        <p className="text-sm text-gray-500 mt-0.5">Siam Motors Group · 15 May 2026</p>
      </div>

      {/* Active Rentals — Hero Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Active Rentals ({activeRentals.length})</h2>
          <Link href="/renter/bookings" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
            View all <ChevronRight size={12} />
          </Link>
        </div>

        {activeRentals.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={28} className="text-blue-600" />
            </div>
            <p className="font-semibold text-gray-900 mb-1">No active rentals</p>
            <p className="text-sm text-gray-500 mb-4">Start your EV journey with our premium electric fleet.</p>
            <Link href="/renter/vehicles"
              className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors">
              Browse Vehicles <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeRentals.map((b) => {
              const days = daysUntil(b.returnDate);
              const urgent = days <= 7;
              const photo = getModelPhoto(b.brandName, b.modelName);

              return (
                <Link key={b.id} href={`/renter/bookings/${b.id}`}
                  className="relative rounded-2xl overflow-hidden block group shadow-md hover:shadow-lg transition-shadow">
                  {/* Car image */}
                  <div className="h-52 relative bg-slate-800">
                    {photo ? (
                      <img src={photo} alt={`${b.brandName} ${b.modelName}`}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                        <span className="text-5xl font-bold text-white/20">{b.brandName[0]}</span>
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  </div>

                  {/* Overlaid content */}
                  <div className="absolute top-4 left-4">
                    <StatusBadge status={b.status} />
                  </div>
                  {b.contractType === "Rent-to-Sell" && (
                    <div className="absolute top-4 right-4">
                      <span className="text-xs bg-blue-600/90 backdrop-blur-sm text-white px-2 py-1 rounded-full">Rent-to-Buy</span>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-lg font-bold text-white leading-tight">{b.brandName} {b.modelName}</p>
                        <p className="text-sm text-white/60 mb-2">{b.licensePlate}</p>
                        <div className={`flex items-center gap-1.5 text-sm ${urgent ? "text-red-400" : "text-white/80"}`}>
                          <Clock size={13} />
                          <span>Due in <span className={`font-semibold ${urgent ? "text-red-400" : "text-white"}`}>{days} day{days !== 1 ? "s" : ""}</span> · {formatDate(b.returnDate)}</span>
                        </div>
                      </div>
                      <span className="shrink-0 text-xs text-white/80 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-lg group-hover:bg-white/20 transition-colors whitespace-nowrap">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Ownership Progress (Rent-to-Buy) */}
      {myRentToSell.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <TrendingUp size={11} className="text-white" />
              </div>
              Ownership Progress
            </h2>
            <Link href="/renter/bookings" className="text-xs text-blue-600 hover:underline">View contracts</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {myRentToSell.map((entry) => {
              const pct = Math.min(100, Math.round((entry.totalPaid / entry.buyoutAmount) * 100));
              const remaining = entry.buyoutAmount - entry.totalPaid;
              const photo = getModelPhoto(entry.brandName, entry.modelName);

              return (
                <div key={entry.carId} className="p-5 flex gap-4 items-center">
                  {/* Thumbnail */}
                  <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    {photo ? (
                      <img src={photo} alt={`${entry.brandName} ${entry.modelName}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xl font-bold text-slate-300">{entry.brandName[0]}</span>
                      </div>
                    )}
                  </div>

                  {/* Progress info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{entry.brandName} {entry.modelName}</p>
                        <p className="text-xs text-gray-500">{entry.licensePlate}</p>
                      </div>
                      <span className="text-sm font-bold text-blue-600 ml-3 shrink-0">{pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5 text-xs text-gray-500">
                      <span>{formatBaht(entry.totalPaid)} paid</span>
                      <span>{formatBaht(remaining)} remaining</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Bookings + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Recent Bookings</h3>
            <Link href="/renter/bookings" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="flex flex-col">
            {recentBookings.map((b) => (
              <Link key={b.id} href={`/renter/bookings/${b.id}`}
                className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {(() => {
                    const photo = getModelPhoto(b.brandName, b.modelName);
                    return photo
                      ? <img src={photo} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-300">{b.brandName[0]}</div>;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{b.brandName} {b.modelName}</p>
                  <p className="text-xs text-gray-500">{b.id.toUpperCase()} · {formatDate(b.pickupDate)}</p>
                </div>
                <StatusBadge status={b.status} />
              </Link>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Bell size={14} />
              Notifications
              {unreadNotifications.length > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5">{unreadNotifications.length}</span>
              )}
            </h3>
            <Link href="/renter/notifications" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="flex flex-col">
            {unreadNotifications.slice(0, 4).map((n) => (
              <div key={n.id} className="flex items-start gap-3 px-5 py-3 border-b border-gray-50 last:border-0">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                </div>
              </div>
            ))}
            {unreadNotifications.length === 0 && (
              <div className="px-5 py-6 text-center text-sm text-gray-500">No new notifications.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
