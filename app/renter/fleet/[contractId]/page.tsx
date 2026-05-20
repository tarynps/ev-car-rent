"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Phone, Mail, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { contracts, purchaseOffers } from "@/lib/mock-data";
import { formatDate, formatBaht } from "@/lib/utils";

export default function FleetDetailPage({ params }: { params: Promise<{ contractId: string }> }) {
  const { contractId } = use(params);
  const contract = contracts.find((c) => c.id === contractId);
  const offer = purchaseOffers.find((o) => o.contractId === contractId && o.status === "Available");

  const [extensionModal, setExtensionModal] = useState(false);
  const [terminateModal, setTerminateModal] = useState(false);
  const [damageModal, setDamageModal] = useState(false);
  const [newReturnDate, setNewReturnDate] = useState("");
  const [terminateReason, setTerminateReason] = useState("");
  const [damageDesc, setDamageDesc] = useState("");
  const [selectedCarId, setSelectedCarId] = useState("");

  if (!contract) {
    return (
      <div className="flex flex-col gap-4">
        <Link href="/renter/fleet" className="flex items-center gap-1.5 text-sm text-secondary hover:text-primary">
          <ArrowLeft size={14} /> Back to My Fleet
        </Link>
        <p className="text-primary font-medium">Contract not found.</p>
      </div>
    );
  }

  const totalVehicles = contract.lines.reduce((sum, l) => sum + l.assignedCars.length, 0);
  const rentalSubtotal = contract.lines.reduce((sum, l) => sum + l.baseRate * l.assignedCars.length, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link href="/renter/fleet" className="flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={14} /> My Fleet
        </Link>
        <span className="text-secondary">/</span>
        <span className="font-mono text-sm font-semibold text-primary">{contract.id.toUpperCase()}</span>
      </div>

      {/* Contract info card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold text-primary">{contract.companyName}</h1>
              <StatusBadge status={contract.status} />
            </div>
            <p className="text-sm text-secondary">{contract.contractType} · {contract.durationType}</p>
            <p className="text-sm text-secondary">{formatDate(contract.startDate)} → {formatDate(contract.endDate)}</p>
            <p className="text-xs text-secondary mt-0.5">Created {formatDate(contract.createdAt)}</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 border border-gray-200 text-sm px-3 py-2 rounded-lg hover:bg-gray-50">
              <Download size={14} /> Contract PDF
            </button>
            <button className="flex items-center gap-1.5 border border-gray-200 text-sm px-3 py-2 rounded-lg hover:bg-gray-50">
              <Download size={14} /> Invoice PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-t border-gray-100 pt-5">
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
            <p className="text-xs text-secondary mb-0.5">Pick-up</p>
            <p className="text-primary">{contract.pickupLocationName}</p>
            <p className="text-xs text-secondary">{formatDate(contract.startDate)}</p>
          </div>
          <div>
            <p className="text-xs text-secondary mb-0.5">Return</p>
            <p className="text-primary">{contract.returnLocationName}</p>
            <p className="text-xs text-secondary">{formatDate(contract.endDate)}</p>
          </div>
        </div>
      </div>

      {/* Vehicles grouped by type */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-primary">Vehicles in Contract</h2>
          <p className="text-xs text-secondary mt-0.5">{contract.lines.length} model type{contract.lines.length > 1 ? "s" : ""} · {totalVehicles} vehicle{totalVehicles > 1 ? "s" : ""}</p>
        </div>
        <div className="divide-y divide-gray-50">
          {contract.lines.map((line, i) => (
            <div key={i} className="px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-primary">{line.modelName}{line.bodyType ? ` (${line.bodyType})` : ""}</p>
                  <p className="text-xs text-secondary">{line.assignedCars.length} unit{line.assignedCars.length > 1 ? "s" : ""} · {formatBaht(line.baseRate)}/mo per unit</p>
                </div>
                <button
                  onClick={() => { setSelectedCarId(line.assignedCars[0]?.carId ?? ""); setDamageModal(true); }}
                  className="flex items-center gap-1 text-xs text-red-500 border border-red-200 px-2.5 py-1 rounded-lg hover:bg-red-50">
                  <AlertTriangle size={11} /> Report Issue
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {line.assignedCars.map((car) => (
                  <span key={car.carId} className="font-mono text-xs border border-gray-200 bg-gray-50 px-2 py-0.5 rounded">
                    {car.licensePlate}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing breakdown */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-primary mb-4">Pricing Breakdown</h2>
        <div className="flex flex-col gap-2 text-sm max-w-sm">
          {contract.lines.map((line, i) => (
            <div key={i} className="flex justify-between">
              <span className="text-secondary">{line.modelName} × {line.assignedCars.length}</span>
              <span>{formatBaht(line.baseRate * line.assignedCars.length)}</span>
            </div>
          ))}
          {contract.addOns.portableCharger && <div className="flex justify-between"><span className="text-secondary">Portable Charger</span><span>incl.</span></div>}
          {contract.addOns.extraInsurance && <div className="flex justify-between"><span className="text-secondary">Extra Insurance</span><span>incl.</span></div>}
          <div className="flex justify-between border-t border-gray-100 pt-2 mt-1">
            <span className="text-secondary">Deposit</span>
            <span>{formatBaht(contract.deposit)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">VAT 7%</span>
            <span>{formatBaht(contract.vat)}</span>
          </div>
          <div className="flex justify-between font-bold text-primary border-t border-gray-200 pt-2 mt-1">
            <span>Total</span>
            <span className="text-base">{formatBaht(contract.total)}</span>
          </div>
        </div>
      </div>

      {/* Approval tracker */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-primary mb-4">Approval Status</h2>
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

      {/* Purchase offer section */}
      {offer && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-semibold text-amber-800">Purchase Offer Available</h2>
            <span className="text-xs bg-amber-100 text-amber-700 border border-amber-300 px-2 py-0.5 rounded-full">Expires {formatDate(offer.offerExpiry)}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
            <div>
              <p className="text-xs text-amber-600 mb-0.5">Vehicle</p>
              <p className="font-medium text-amber-900">{offer.modelName}</p>
              <p className="text-xs text-amber-700 font-mono">{offer.licensePlate}</p>
            </div>
            <div>
              <p className="text-xs text-amber-600 mb-0.5">Buyout Price</p>
              <p className="font-bold text-amber-900">{formatBaht(offer.buyoutAmount)}</p>
            </div>
            <div>
              <p className="text-xs text-amber-600 mb-0.5">Total Rental Paid</p>
              <p className="font-medium text-amber-900">{formatBaht(offer.totalPaid)}</p>
            </div>
            <div>
              <p className="text-xs text-amber-600 mb-0.5">Total Buyout Value</p>
              <p className="font-medium text-amber-900">{formatBaht(offer.totalBuyout)}</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-xs text-amber-600 mb-1">Rental Progress toward Buyout</p>
            <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
              <div className="h-2 bg-amber-500 rounded-full" style={{ width: `${Math.min((offer.totalPaid / offer.totalBuyout) * 100, 100).toFixed(0)}%` }} />
            </div>
            <p className="text-xs text-amber-600 mt-1">{formatBaht(offer.totalPaid)} / {formatBaht(offer.totalBuyout)}</p>
          </div>
          <button className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 text-sm">
            <CheckCircle size={14} /> Accept Purchase Offer
          </button>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={() => setExtensionModal(true)}
          className="flex items-center gap-2 border border-gray-200 text-sm px-4 py-2 rounded-lg hover:bg-gray-50">
          <Clock size={14} /> Request Extension
        </button>
        <button onClick={() => setTerminateModal(true)}
          className="flex items-center gap-2 border border-red-200 text-red-500 text-sm px-4 py-2 rounded-lg hover:bg-red-50">
          <XCircle size={14} /> Terminate Contract
        </button>
      </div>

      {/* Extension modal */}
      <Modal open={extensionModal} onClose={() => setExtensionModal(false)} title="Request Extension">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-secondary">Select a new return date. The request will be sent for admin approval.</p>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">New Return Date *</label>
            <input type="date" value={newReturnDate} onChange={(e) => setNewReturnDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:border-tertiary focus:outline-none" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setExtensionModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button disabled={!newReturnDate} onClick={() => setExtensionModal(false)}
              className="px-4 py-2 text-sm bg-tertiary text-white rounded-lg hover:bg-tertiary-dark disabled:opacity-50">
              Submit Request
            </button>
          </div>
        </div>
      </Modal>

      {/* Terminate modal */}
      <Modal open={terminateModal} onClose={() => setTerminateModal(false)} title="Terminate Contract">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-secondary">Termination is subject to cancellation policy. Please provide your reason.</p>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Reason *</label>
            <textarea value={terminateReason} onChange={(e) => setTerminateReason(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={3}
              placeholder="e.g. Business change of plan…" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setTerminateModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button disabled={!terminateReason} onClick={() => setTerminateModal(false)}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50">
              Submit Termination
            </button>
          </div>
        </div>
      </Modal>

      {/* Damage report modal */}
      <Modal open={damageModal} onClose={() => setDamageModal(false)} title="Report Damage / Issue">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-secondary">Describe the damage or issue. Our team will follow up within 24 hours.</p>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Description *</label>
            <textarea value={damageDesc} onChange={(e) => setDamageDesc(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={3}
              placeholder="e.g. Front bumper scratch on กก 1234 กทม…" />
          </div>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">Photo (optional)</label>
            <input type="file" accept="image/*" className="text-sm text-secondary" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setDamageModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button disabled={!damageDesc} onClick={() => setDamageModal(false)}
              className="px-4 py-2 text-sm bg-tertiary text-white rounded-lg hover:bg-tertiary-dark disabled:opacity-50">
              Submit Report
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
