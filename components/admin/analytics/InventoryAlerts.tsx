import { cn } from "@/lib/utils";

export interface AlertItem {
  id: string;
  name: string;
  currentStock: string;
  status: "low" | "critical";
  percentage: number;
}

export function InventoryAlerts({ items }: { items: AlertItem[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm font-display">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-bold flex items-center gap-2 text-slate-900">
          <span className="material-symbols-outlined text-orange-500">warning</span>
          Inventory Alerts
        </h4>
        <span className="text-[10px] text-orange-600 font-black bg-orange-100 px-2 py-1 rounded uppercase tracking-wider">
          Action Required
        </span>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="p-4 rounded-lg bg-slate-50 border border-slate-100 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">In Stock: {item.currentStock}</p>
              </div>
              <span className={cn(
                "px-2 py-1 rounded text-[10px] font-bold uppercase",
                item.status === "low" ? "bg-orange-100 text-orange-600" : "bg-red-100 text-red-600"
              )}>
                {item.status === "low" ? "Low Stock" : "Critical"}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className={cn("h-full", item.status === "low" ? "bg-orange-500" : "bg-red-500")}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
            <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-all cursor-pointer">
              Restock Now
            </button>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 text-slate-400 text-sm font-bold rounded-xl hover:border-primary hover:text-primary transition-all cursor-pointer">
        View Full Inventory
      </button>
    </div>
  );
}
