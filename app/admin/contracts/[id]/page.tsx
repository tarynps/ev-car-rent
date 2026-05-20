"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Download, RefreshCw, XCircle, CheckCircle, Clock } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import PricingSummary from "@/components/PricingSummary";
import BookingTimeline from "@/components/BookingTimeline";
import { contracts } from "@/lib/mock-data";
import { formatDate, formatBaht } from "@/lib/utils";

export default function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const contract = contracts.find((c) => c.id === id);

  if (!contract) return (
    <div className="text-center py-20">
      <p className="text-ev-muted">Contract not found.</p>
      <Link href="/admin/contracts" className="text-ev-primary hover:underline text-sm mt-2 inline-block">← Back to Contracts</Link>
    </div>
  );

  const baseTotal = contract.vehicleGroups.reduce((s, g) => s + g.ratePerUnit * g.quantity, 0);
  const pricingItems = [
    ...contract.vehicleGroups.map((g) => ({
      label: `${g.carType} (JAC ${g.modelName}) × ${g.quantity}`,
      amount: g.ratePerUnit * g.quantity,
    })),
    { label: "Deposit", amount: contract.deposit },
    { label: "VAT (7%)", amount: contract.vat },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Back + header */}
      <div>
        <Link href="/admin/contracts" className="flex items-center gap-1 text-ev-muted hover:text-ev-black text-sm mb-3">
          <ArrowLeft size={14} /> Back to Contracts
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-ev-black">{contract.id.toUpperCase()}</h1>
              <StatusBadge status={contract.status} />
            </div>
            <p className="text-sm text-ev-muted mt-1">Created {contract.createdAt} · {contract.contractType}</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 border border-gray-200 text-ev-muted hover:text-ev-black text-xs px-3 py-2 rounded-lg">
              <Download size={13} /> Contract PDF
            </button>
            <button className="flex items-center gap-1.5 border border-gray-200 text-ev-muted hover:text-ev-black text-xs px-3 py-2 rounded-lg">
              <Download size={13} /> Invoice PDF
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — main info */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Client info */}
          <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-ev-black mb-3">Client Information</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] text-ev-muted uppercase tracking-wide">Company</p>
                <Link href={`/admin/clients/${contract.companyId}`} className="text-sm font-medium text-ev-primary hover:underline">{contract.companyName}</Link>
              </div>
              <div>
                <p className="text-[11px] text-ev-muted uppercase tracking-wide">Contact Person</p>
                <p className="text-sm text-ev-black">{contract.renterName}</p>
              </div>
              <div>
                <p className="text-[11px] text-ev-muted uppercase tracking-wide">Phone</p>
                <p className="text-sm text-ev-black">{contract.renterPhone}</p>
              </div>
              <div>
                <p className="text-[11px] text-ev-muted uppercase tracking-wide">Email</p>
                <p className="text-sm text-ev-black">{contract.renterEmail}</p>
              </div>
            </div>
          </div>

          {/* Vehicle allocation */}
          <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-ev-black mb-3">Allocated Vehicles</h2>
            <div className="flex flex-col gap-4">
              {contract.vehicleGroups.map((group, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-medium text-ev-black">{group.carType} — JAC {group.modelName}</span>
                      <span className="ml-2 text-xs text-ev-muted">({group.quantity} units)</span>
                    </div>
                    <span className="text-xs font-medium text-ev-black">{formatBaht(group.ratePerUnit)}/unit/month</span>
                  </div>
                  {group.licensePlates.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {group.licensePlates.map((plate) => (
                        <Link key={plate} href={`/admin/inventory/${plate}`} className="text-xs font-mono bg-gray-50 border border-gray-200 px-2 py-0.5 rounded hover:border-ev-primary hover:text-ev-primary transition-colors">
                          {plate}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-ev-muted italic">Vehicles not yet assigned — pending approval</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contract details */}
          <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-ev-black mb-3">Contract Details</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] text-ev-muted uppercase tracking-wide">Duration Type</p>
                <p className="text-sm text-ev-black">{contract.durationType}</p>
              </div>
              <div>
                <p className="text-[11px] text-ev-muted uppercase tracking-wide">Contract Type</p>
                <p className="text-sm text-ev-black">{contract.contractType}</p>
              </div>
              <div>
                <p className="text-[11px] text-ev-muted uppercase tracking-wide">Pick-up Date</p>
                <p className="text-sm text-ev-black">{formatDate(contract.pickupDate)}</p>
              </div>
              <div>
                <p className="text-[11px] text-ev-muted uppercase tracking-wide">Return Date</p>
                <p className="text-sm text-ev-black">{formatDate(contract.returnDate)}</p>
              </div>
              <div>
                <p className="text-[11px] text-ev-muted uppercase tracking-wide">Pick-up Location</p>
                <p className="text-sm text-ev-black">{contract.pickupLocationName}</p>
              </div>
              <div>
                <p className="text-[11px] text-ev-muted uppercase tracking-wide">Return Location</p>
                <p className="text-sm text-ev-black">{contract.returnLocationName}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {contract.status === "Active" && (
            <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-ev-black mb-3">Actions</h2>
              <div className="flex flex-wrap gap-2">
                <button className="flex items-center gap-1.5 border border-gray-200 text-ev-muted hover:text-ev-black text-sm px-4 py-2 rounded-lg transition-colors">
                  <RefreshCw size={13} /> Swap Vehicle
                </button>
                <button className="flex items-center gap-1.5 border border-[#EF4444] text-[#EF4444] hover:bg-[#FEF2F2] text-sm px-4 py-2 rounded-lg transition-colors">
                  <XCircle size={13} /> Terminate Contract
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right — pricing + timeline */}
        <div className="flex flex-col gap-5">
          <PricingSummary
            baseRate={baseTotal}
            addOnTotal={0}
            deposit={contract.deposit}
            vat={contract.vat}
            total={contract.total}
            addOnDetails={contract.vehicleGroups.map((g) => ({
              label: `${g.carType} (JAC ${g.modelName}) × ${g.quantity}`,
              amount: g.ratePerUnit * g.quantity,
            }))}
          />
          <div className="bg-ev-surface border border-gray-100 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-ev-black mb-4">Approval Status</h2>
            <BookingTimeline steps={contract.approvalSteps} />
          </div>
        </div>
      </div>
    </div>
  );
}
