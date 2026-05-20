"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { contracts, purchaseOffers } from "@/lib/mock-data";
import { formatDate, formatBaht } from "@/lib/utils";
import type { Contract } from "@/lib/types";

type StatusFilter = "All" | Contract["status"];
const STATUS_TABS: StatusFilter[] = ["All", "Pending", "Active", "Confirmed", "Expired", "Terminated"];

export default function RenterFleetPage() {
  const [activeTab, setActiveTab] = useState<StatusFilter>("All");
  const myContracts = contracts.filter((c) => c.companyId === "c1");
  const filtered = activeTab === "All" ? myContracts : myContracts.filter((c) => c.status === activeTab);
  const offerContractIds = new Set(purchaseOffers.filter((o) => o.status === "Available").map((o) => o.contractId));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-primary">My Fleet</h1>
          <p className="text-sm text-secondary mt-0.5">{myContracts.length} contract{myContracts.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/renter/bookings/new"
          className="flex items-center gap-2 bg-tertiary text-white text-sm px-4 py-2 rounded-lg hover:bg-tertiary-dark transition-colors">
          <Plus size={15} /> New Contract Request
        </Link>
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

      {/* Contract cards */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
            <p className="text-secondary text-sm">No {activeTab !== "All" ? activeTab.toLowerCase() : ""} contracts found.</p>
          </div>
        ) : filtered.map((c) => {
          const hasPurchaseOffer = offerContractIds.has(c.id);
          const totalVehicles = c.lines.reduce((sum, l) => sum + l.assignedCars.length, 0);
          return (
            <Link key={c.id} href={`/renter/fleet/${c.id}`}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-gray-300 transition-all block">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-xs font-semibold text-tertiary">{c.id.toUpperCase()}</span>
                    <StatusBadge status={c.status} />
                    <span className="text-xs text-secondary">{c.contractType} · {c.durationType}</span>
                    {hasPurchaseOffer && (
                      <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                        Purchase Offer Available
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-primary mb-1">{c.companyName}</p>
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
    </div>
  );
}
