import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import EVSpecCard from "@/components/EVSpecCard";
import { carModels, pricingTiers } from "@/lib/mock-data";
import { formatBaht } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function VehicleDetailPage({ params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;
  const model = carModels.find((m) => m.id === modelId);
  if (!model) return notFound();

  const pricing = pricingTiers.find((p) => p.modelId === model.id);

  const rates = pricing ? [
    { label: "Monthly Rate", value: pricing.monthly },
    { label: "Quarterly Rate", value: pricing.quarterly },
    { label: "Semi-Annual Rate", value: pricing.semiAnnual },
    { label: "Annual Rate", value: pricing.annual },
    { label: "Rent-with-Purchase Rate", value: pricing.rentWithPurchase },
  ] : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/renter/vehicles" className="p-1.5 rounded-lg hover:bg-gray-100 text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-primary">{"JAC"} {model.name}</h1>
          <p className="text-sm text-secondary">{model.year}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: photo + specs + features */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Photo gallery */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-8xl font-bold text-gray-300">{"JAC"[0]}</div>
            </div>
            <div className="flex gap-2 p-3 overflow-x-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-300">{"JAC"[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* EV Specs */}
          <EVSpecCard model={model} />

          {/* Feature Highlights */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-primary mb-3">Feature Highlights</h3>
            <div className="grid grid-cols-2 gap-2">
              {model.highlights.map((h) => (
                <div key={h} className="flex items-center gap-2 text-sm text-secondary">
                  <Check size={13} className="text-green-500 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: pricing + CTA */}
        <div className="flex flex-col gap-4">
          {/* Availability */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="text-sm font-medium text-green-600">Available for rental</span>
          </div>

          {/* Pricing table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-primary">Pricing</h3>
            </div>
            <div className="flex flex-col">
              {rates.map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center px-4 py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-secondary">{label}</span>
                  <span className="font-semibold text-primary">{formatBaht(value)}</span>
                </div>
              ))}
              {pricing && (
                <div className="flex justify-between items-center px-4 py-2.5 bg-gray-50">
                  <span className="text-sm text-secondary">Deposit</span>
                  <span className="font-semibold text-secondary">{formatBaht(pricing.deposit)}</span>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <Link href={`/renter/bookings/new?model=${model.id}`}
            className="bg-black text-white text-center py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors">
            Request Rental
          </Link>
          <p className="text-xs text-secondary text-center">Rental requests are subject to manager and admin approval.</p>
        </div>
      </div>
    </div>
  );
}
