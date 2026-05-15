import { Zap, Navigation, Plug, BatteryCharging } from "lucide-react";
import type { CarModel } from "@/lib/types";

export default function EVSpecCard({ model }: { model: Pick<CarModel, "batteryKwh" | "rangeWltp" | "rangeNedc" | "connectors" | "maxAcKw" | "maxDcKw"> }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm grid grid-cols-2 gap-4">
      <div className="flex items-start gap-3">
        <Zap size={18} className="text-tertiary mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-secondary">Battery</p>
          <p className="text-sm font-semibold">{model.batteryKwh} kWh</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Navigation size={18} className="text-tertiary mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-secondary">Range (WLTP)</p>
          <p className="text-sm font-semibold">{model.rangeWltp} km</p>
          <p className="text-xs text-gray-400">NEDC: {model.rangeNedc} km</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Plug size={18} className="text-tertiary mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-secondary">Connectors</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {model.connectors.map((c) => (
              <span key={c} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{c}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <BatteryCharging size={18} className="text-tertiary mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-secondary">Charging Speed</p>
          <p className="text-sm font-semibold">AC: {model.maxAcKw} kW</p>
          <p className="text-xs text-gray-400">DC: {model.maxDcKw} kW</p>
        </div>
      </div>
    </div>
  );
}
