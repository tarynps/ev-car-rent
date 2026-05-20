"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ChevronRight, AlertCircle, Car } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { fleetContracts } from "@/lib/mock-data";
import { formatBaht, formatDate } from "@/lib/utils";
import type { ContractStatus } from "@/lib/types";

const STATUS_TABS: (ContractStatus | "All")[] = ["All", "Active", "Expiring Soon", "Pending", "Expired", "Terminated"];

export default function MyFleetPage() {
  const [activeTab, setActiveTab] = useState<ContractStatus | "All">("All");
  const myContracts = fleetContracts.filter((c) => c.companyId === "c1");
  const filtered = activeTab === "All" ? myContracts : myContracts.filter((c) => c.status === activeTab);
  const expiringCount = myContracts.filter((c) => c.status === "Expiring Soon").length;
  const purchaseOfferCount = myContracts.filter((c) => c.purchaseOfferAvailable).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">My Fleet</h1>
          <p className="text-sm text-gray-500 mt-0.5">{myContracts.length} contracts · Siam Motors Group</p>
        </div>
        <Link href="/renter/bookings/new"
          className="flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          <Plus size={15} /> New Contract Request
        </Link>
      </div>

      {/* Alert banners */}
      {expiringCount > 0 && (
        <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="text-orange-500 mt-0.5 shrink-0" />
          <p className="text-sm text-orange-800">
            <span className="font-semibold">{expiringCount} contract{expiringCount > 1 ? "s" : ""}</span> expiring within 30 days. Review and request extension if needed.
          </p>
        </div>
      )}
      {purchaseOfferCount > 0 && (
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          <Car size={16} className="text-blue-600 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-800">
            <span className="font-semibold">{purchaseOfferCount} purchase offer{purchaseOfferCount > 1 ? "s" : ""}</span> available. Review the buyout terms in your active contracts.
          </p>
        </div>
      )}

      {/* Status filter */}
      <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm overflow-x-auto">
        {STATUS_TABS.map((tab) => {
          const count = tab === "All" ? myContracts.length : myContracts.filter((c) => c.status === tab).length;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab ? "bg-black text-white" : "text-gray-500 hover:text-gray-900"
              }`}>
              {tab}
              <span className={`text-xs rounded-full px-1.5 ${activeTab === tab ? "bg-white/20" : "bg-gray-100 text-gray-500"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Contract list */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
            <p className="text-gray-500 text-sm">No {activeTab !== "All" ? activeTab.toLowerCase() : ""} contracts found.</p>
          </div>
        ) : (
          filtered.map((contract) => (
            <Link key={contract.id} href={`/renter/fleet/${contract.id}`}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:border-gray-300 hover:shadow-md transition-all block group">
              <div className="p-5">
                {/* Top row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{contract.id}</span>
                    <StatusBadge status={contract.status} />
                    <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2 py-1 rounded-full">{contract.contractType}</span>
                    {contract.purchaseOfferAvailable && (
                      <span className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded-full font-medium">Purchase Offer Available</span>
                    )}
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0 mt-1" />
                </div>

                {/* Vehicle thumbnails */}
                <div className="flex gap-3 mb-4 flex-wrap">
                  {contract.vehicles.map((v) => (
                    <div key={v.carId} className="flex items-center gap-2">
                      <div className="w-14 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {v.photo ? (
                          <img src={v.photo} alt={`${v.brandName} ${v.modelName}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-300">{v.brandName[0]}</div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{v.brandName} {v.modelName}</p>
                        <p className="text-xs text-gray-500">{v.licensePlate}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{formatDate(contract.startDate)} → {formatDate(contract.endDate)}</span>
                    <span className="hidden sm:block">{contract.pickupLocationName}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{formatBaht(contract.totalAmount)}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
