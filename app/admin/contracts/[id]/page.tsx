"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, Mail } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { contracts } from "@/lib/mock-data";
import { formatDate, formatBaht } from "@/lib/utils";

export default function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const contract = contracts.find((c) => c.id === id);

  if (!contract) {
    return (
      <div className="flex flex-col gap-4">
        <Link href="/admin/contracts" className="flex items-center gap-1.5 text-sm text-secondary hover:text-primary">
          <ArrowLeft size={14} /> Back to Contracts
        </Link>
        <p className="text-primary font-medium">Contract not found.</p>
      </div>
    );
  }

  const totalVehicles = contract.lines.reduce((sum, l) => sum + l.assignedCars.length, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/contracts" className="flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Contracts
        </Link>
        <span className="text-secondary">/</span>
        <span className="font-mono text-sm font-semibold text-primary">{contract.id.toUpperCase()}</span>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold text-primary">{contract.companyName}</h1>
              <StatusBadge status={contract.status} />
            </div>
            <p className="text-sm text-secondary">{contract.contractType} · {contract.durationType}</p>
            <p className="text-sm text-secondary">{formatDate(contract.startDate)} → {formatDate(contract.endDate)}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{formatBaht(contract.total)}</p>
            <p className="text-xs text-secondary">incl. VAT {formatBaht(contract.vat)}</p>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-secondary mb-0.5">Contact</p>
            <p className="font-medium text-primary">{contract.contactName}</p>
          </div>
          <div>
            <p className="text-xs text-secondary mb-0.5">Phone</p>
            <a href={`tel:${contract.contactPhone}`} className="flex items-center gap-1 text-tertiary hover:underline">
              <Phone size={12} /> {contract.contactPhone}
            </a>
          </div>
          <div>
            <p className="text-xs text-secondary mb-0.5">Email</p>
            <a href={`mailto:${contract.contactEmail}`} className="flex items-center gap-1 text-tertiary hover:underline">
              <Mail size={12} /> {contract.contactEmail}
            </a>
          </div>
          <div>
            <p className="text-xs text-secondary mb-0.5">Deposit</p>
            <p className="font-medium text-primary">{formatBaht(contract.deposit)}</p>
          </div>
          <div>
            <p className="text-xs text-secondary mb-0.5">Pickup Location</p>
            <p className="text-primary">{contract.pickupLocationName}</p>
          </div>
          <div>
            <p className="text-xs text-secondary mb-0.5">Return Location</p>
            <p className="text-primary">{contract.returnLocationName}</p>
          </div>
          <div>
            <p className="text-xs text-secondary mb-0.5">Models</p>
            <p className="font-medium text-primary">{contract.lines.length}</p>
          </div>
          <div>
            <p className="text-xs text-secondary mb-0.5">Total Vehicles</p>
            <p className="font-medium text-primary">{totalVehicles}</p>
          </div>
        </div>

        {/* Add-ons */}
        {(contract.addOns.portableCharger || contract.addOns.childSeat || contract.addOns.extraInsurance) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {contract.addOns.portableCharger && (
              <span className="text-xs bg-gray-100 text-secondary px-2 py-0.5 rounded-full">Portable Charger</span>
            )}
            {contract.addOns.childSeat && (
              <span className="text-xs bg-gray-100 text-secondary px-2 py-0.5 rounded-full">Child Seat</span>
            )}
            {contract.addOns.extraInsurance && (
              <span className="text-xs bg-gray-100 text-secondary px-2 py-0.5 rounded-full">Extra Insurance</span>
            )}
          </div>
        )}
      </div>

      {/* Contract Lines */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-primary">Contract Lines</h2>
          <p className="text-xs text-secondary mt-0.5">{contract.lines.length} model{contract.lines.length > 1 ? "s" : ""} · {totalVehicles} vehicle{totalVehicles > 1 ? "s" : ""}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-secondary">Model</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-secondary">Body Type</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-secondary">Assigned Vehicles</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-secondary">Base Rate / mo</th>
              </tr>
            </thead>
            <tbody>
              {contract.lines.map((line, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3.5 font-medium text-primary">{line.modelName}</td>
                  <td className="px-5 py-3.5 text-secondary">{line.bodyType ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-2">
                      {line.assignedCars.map((car) => (
                        <Link
                          key={car.carId}
                          href={`/admin/fleet/${car.carId}`}
                          className="font-mono text-xs text-tertiary border border-gray-200 rounded px-2 py-0.5 hover:bg-gray-50 transition-colors"
                        >
                          {car.licensePlate}
                        </Link>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-primary">{formatBaht(line.baseRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Trail */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-primary mb-4">Approval Audit Trail</h2>
        <div className="flex flex-col gap-2">
          {contract.approvalSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                step.status === "done" ? "bg-primary" : step.status === "current" ? "bg-tertiary" : "bg-gray-200"
              }`} />
              <span className={step.status === "pending" ? "text-gray-400" : "text-primary"}>{step.step}</span>
              {step.actorName && <span className="text-xs text-secondary">— {step.actorName}</span>}
              {step.timestamp && <span className="text-xs text-gray-400">{step.timestamp}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
