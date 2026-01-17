import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp?: boolean;
}

export function StatCard({ title, value, trend, trendUp = true }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group font-display">
      <div className="absolute -right-4 -top-4 size-24 bg-green-50 rounded-full opacity-50 transition-transform group-hover:scale-110"></div>
      <p className="text-slate-500 text-sm font-semibold mb-1 relative z-10">{title}</p>
      <h3 className="text-3xl font-black text-slate-900 mb-2 relative z-10">{value}</h3>
      <div className={cn(
        "flex items-center gap-1 text-sm font-bold relative z-10",
        trendUp ? "text-primary-dark" : "text-red-500"
      )}>
        <span className="material-symbols-outlined text-sm">
          {trendUp ? "trending_up" : "trending_down"}
        </span>
        <span>{trend}</span>
      </div>
    </div>
  );
}
