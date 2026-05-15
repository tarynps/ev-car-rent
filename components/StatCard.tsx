import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: { direction: "up" | "down"; percent: number };
  accent?: boolean;
}

export default function StatCard({ label, value, trend, accent }: StatCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col gap-2 ${accent ? "border-tertiary/30" : ""}`}>
      <p className="text-xs text-secondary uppercase tracking-wide font-medium">{label}</p>
      <p className="text-2xl font-semibold text-primary">{value}</p>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trend.direction === "up" ? "text-green-600" : "text-red-500"}`}>
          {trend.direction === "up" ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span>{trend.percent}% vs last month</span>
        </div>
      )}
    </div>
  );
}
