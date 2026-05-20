import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BatteryCharging, Check, Gauge, Navigation, Plug, Zap } from "lucide-react";
import { notFound } from "next/navigation";
import { carModels, cars, pricingTiers } from "@/lib/mock-data";
import { formatBaht } from "@/lib/utils";

const modelMeta: Record<string, { carType: string; wheelCategory: string; motorPower: string }> = {
  m1: { carType: "Light truck", wheelCategory: "6-wheel", motorPower: "120 kW" },
  m2: { carType: "Pickup", wheelCategory: "Pickup", motorPower: "150 kW" },
  m3: { carType: "Passenger van", wheelCategory: "Van", motorPower: "110 kW" },
  m4: { carType: "Cargo van", wheelCategory: "Van", motorPower: "120 kW" },
  m5: { carType: "Box truck", wheelCategory: "10-wheel", motorPower: "180 kW" },
  m6: { carType: "Dump truck", wheelCategory: "10-wheel", motorPower: "180 kW" },
  m7: { carType: "Road sweeper", wheelCategory: "10-wheel", motorPower: "180 kW" },
  m8: { carType: "Wrecker", wheelCategory: "10-wheel", motorPower: "180 kW" },
  m9: { carType: "Refrigerated truck", wheelCategory: "10-wheel", motorPower: "180 kW" },
  m10: { carType: "Sewage truck", wheelCategory: "10-wheel", motorPower: "180 kW" },
  m11: { carType: "Prime mover", wheelCategory: "Prime Mover", motorPower: "240 kW" },
  m12: { carType: "Medium truck", wheelCategory: "8-wheel", motorPower: "160 kW" },
  m13: { carType: "Heavy truck", wheelCategory: "10-wheel", motorPower: "260 kW" },
  m14: { carType: "Heavy hauler", wheelCategory: "Prime Mover", motorPower: "300 kW" },
  m15: { carType: "Special purpose", wheelCategory: "10-wheel", motorPower: "220 kW" },
};

function displayName(model: (typeof carModels)[number]) {
  return model.bodyType ? `${model.name} (${model.bodyType})` : model.name;
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;
  const model = carModels.find((candidate) => candidate.id === modelId);
  if (!model) return notFound();

  const pricing = pricingTiers.find((tier) => tier.modelId === model.id);
  const meta = modelMeta[model.id] ?? { carType: "Commercial EV", wheelCategory: "Fleet vehicle", motorPower: "TBC" };
  const availableUnits = cars.filter((car) => car.modelId === model.id && car.status === "Available").length;
  const photo = model.photos[0];
  const monthly = pricing?.monthly ?? model.priceFrom;
  const rates = [
    { label: "Monthly", value: monthly },
    { label: "Quarterly", value: monthly * 3 },
    { label: "Semi-annual", value: monthly * 6 },
    { label: "Annual", value: pricing?.yearly ?? monthly * 12 },
  ];

  const specs = [
    { label: "Battery capacity", value: `${model.batteryKwh} kWh`, icon: BatteryCharging },
    { label: "WLTP range", value: `${model.rangeWltp} km`, icon: Navigation },
    { label: "NEDC range", value: `${model.rangeNedc} km`, icon: Gauge },
    { label: "Motor power", value: meta.motorPower, icon: Zap },
    { label: "Max AC charging", value: `${model.maxAcKw} kW`, icon: Plug },
    { label: "Max DC charging", value: `${model.maxDcKw} kW`, icon: Plug },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Link href="/renter/vehicles" className="p-1.5 rounded-lg hover:bg-gray-100 text-secondary hover:text-primary transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-tertiary">Vehicle Catalog</p>
            <h1 className="text-xl font-semibold text-primary mt-1">{model.brandName} {displayName(model)}</h1>
            <p className="text-sm text-secondary mt-0.5">{meta.carType} · {meta.wheelCategory} · {model.year}</p>
          </div>
        </div>
        <Link
          href={`/renter/bookings/new?model=${model.id}`}
          className="inline-flex items-center justify-center gap-2 bg-tertiary text-white text-sm px-4 py-2 rounded-lg hover:bg-tertiary-dark transition-colors"
        >
          Add to Request
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-surface rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="relative h-72 bg-gray-50">
              {photo ? (
                <Image
                  src={photo}
                  alt={`${model.brandName} ${displayName(model)}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-contain p-8"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl font-bold text-gray-300">{model.brandName[0]}</div>
              )}
            </div>
            <div className="flex gap-2 p-3 overflow-x-auto border-t border-gray-100">
              {[photo, photo, photo].map((src, index) => (
                <div key={index} className="relative w-20 h-16 bg-gray-50 rounded-lg shrink-0 border border-gray-100 overflow-hidden">
                  {src ? (
                    <Image src={src} alt="" fill sizes="80px" className="object-contain p-2" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-300">{model.brandName[0]}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-primary mb-4">Full EV Specs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {specs.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-lg bg-neutral border border-gray-100 p-4">
                  <Icon size={18} className="text-tertiary mb-3" />
                  <p className="text-xs text-secondary">{label}</p>
                  <p className="text-sm font-semibold text-primary mt-0.5">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-xs text-secondary mb-2">Supported connectors</p>
              <div className="flex flex-wrap gap-2">
                {model.connectors.map((connector) => (
                  <span key={connector} className="text-xs bg-tertiary-tint text-tertiary px-2 py-1 rounded-full">{connector}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-primary mb-3">Feature Highlights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {model.highlights.map((highlight) => (
                <div key={highlight} className="flex items-center gap-2 text-sm text-secondary">
                  <Check size={13} className="text-tertiary shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-surface rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${availableUnits > 0 ? "bg-green-500" : "bg-yellow-400"}`} />
              <span className={`text-sm font-medium ${availableUnits > 0 ? "text-green-700" : "text-yellow-700"}`}>
                {availableUnits > 0 ? `${availableUnits} unit${availableUnits === 1 ? "" : "s"} available` : "Available on request"}
              </span>
            </div>
            <p className="text-xs text-secondary mt-2">Corporate requests are reviewed by renter manager and fleet admin before confirmation.</p>
          </div>

          <div className="bg-surface rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-primary">Contract Pricing</h2>
              <p className="text-xs text-secondary mt-0.5">Monthly and above for fleet contracts.</p>
            </div>
            <div className="flex flex-col">
              {rates.map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center px-4 py-3 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-secondary">{label}</span>
                  <span className="font-semibold text-primary">{formatBaht(value)}</span>
                </div>
              ))}
              {pricing && (
                <div className="flex justify-between items-center px-4 py-3 bg-gray-50">
                  <span className="text-sm text-secondary">Deposit</span>
                  <span className="font-semibold text-secondary">{formatBaht(pricing.deposit)}</span>
                </div>
              )}
            </div>
          </div>

          <Link
            href={`/renter/bookings/new?model=${model.id}`}
            className="bg-tertiary text-white text-center py-3 px-4 rounded-xl font-medium hover:bg-tertiary-dark transition-colors"
          >
            Add to Request
          </Link>
          <p className="text-xs text-secondary text-center">Add this model to a draft request, then choose quantity, contract dates, and submit.</p>
        </div>
      </div>
    </div>
  );
}
