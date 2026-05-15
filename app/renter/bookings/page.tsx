"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Eye } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { bookings } from "@/lib/mock-data";
import { formatDate, formatBaht } from "@/lib/utils";
import type { BookingStatus } from "@/lib/types";

const STATUS_TABS: (BookingStatus | "All")[] = ["All", "Pending", "Confirmed", "Active", "Completed", "Cancelled"];

export default function RenterBookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingStatus | "All">("All");
  const myBookings = bookings.filter((b) => b.companyId === "c1");
  const filtered = activeTab === "All" ? myBookings : myBookings.filter((b) => b.status === activeTab);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-primary">My Bookings</h1>
          <p className="text-sm text-secondary mt-0.5">{myBookings.length} total bookings</p>
        </div>
        <Link href="/renter/bookings/new" className="flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          <Plus size={15} /> New Booking
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm overflow-x-auto">
        {STATUS_TABS.map((tab) => {
          const count = tab === "All" ? myBookings.length : myBookings.filter((b) => b.status === tab).length;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === tab ? "bg-black text-white" : "text-secondary hover:text-primary"}`}>
              {tab}
              <span className={`text-xs rounded-full px-1.5 ${activeTab === tab ? "bg-white/20" : "bg-gray-100 text-secondary"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Booking list */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
            <p className="text-secondary text-sm">No {activeTab !== "All" ? activeTab.toLowerCase() : ""} bookings found.</p>
          </div>
        ) : filtered.map((b) => (
          <Link key={b.id} href={`/renter/bookings/${b.id}`}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-gray-300 transition-all block">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-mono text-xs font-semibold text-tertiary">{b.id.toUpperCase()}</span>
                  <StatusBadge status={b.status} />
                  <span className="text-xs text-secondary">{b.contractType}</span>
                </div>
                <p className="font-semibold text-primary">{b.brandName} {b.modelName}</p>
                <p className="text-xs text-secondary mt-0.5">{b.licensePlate} · {formatDate(b.pickupDate)} → {formatDate(b.returnDate)}</p>
                <p className="text-xs text-secondary">{b.pickupLocationName}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold">{formatBaht(b.total)}</p>
                <p className="text-xs text-secondary mt-0.5">{b.durationType}</p>
                <Eye size={14} className="text-secondary mt-2 ml-auto" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
