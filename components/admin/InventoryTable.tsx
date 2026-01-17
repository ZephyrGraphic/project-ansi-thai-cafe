"use client";

import { cn } from "@/lib/utils";

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface InventoryItem {
  id: string;
  name: string;
  batch: string;
  category: string;
  stockLevel: number;
  unit: string;
  reorderPoint: number;
  status: StockStatus;
}

export function InventoryTable({ items }: { items: InventoryItem[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm font-display">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ingredient Name</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Stock Level</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Unit</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Reorder Point</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-5">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">{item.name}</span>
                  <span className="text-[11px] text-slate-500">{item.batch}</span>
                </div>
              </td>
              <td className="px-6 py-5">
                <span className={cn(
                  "px-3 py-1 text-[11px] font-bold rounded-full uppercase",
                  item.category === "Dry Goods" && "bg-blue-50 text-blue-600",
                  item.category === "Fresh Meats" && "bg-red-50 text-red-600",
                  item.category === "Liquids" && "bg-indigo-50 text-indigo-600",
                  item.category === "Vegetables" && "bg-green-50 text-green-600"
                )}>
                  {item.category}
                </span>
              </td>
              <td className="px-6 py-5 text-right font-semibold text-slate-900">{item.stockLevel.toFixed(1)}</td>
              <td className="px-6 py-5 text-center text-slate-500 text-sm">{item.unit}</td>
              <td className="px-6 py-5 text-right text-slate-500 text-sm">{item.reorderPoint.toFixed(1)}</td>
              <td className="px-6 py-5">
                <div className="flex justify-center">
                  <span className={cn(
                    "px-3 py-1 text-[11px] font-bold rounded-full flex items-center gap-1",
                    item.status === "in-stock" && "bg-primary/10 text-primary-text",
                    item.status === "low-stock" && "bg-orange-100 text-orange-700",
                    item.status === "out-of-stock" && "bg-red-100 text-red-700"
                  )}>
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      item.status === "in-stock" && "bg-primary",
                      item.status === "low-stock" && "bg-orange-500",
                      item.status === "out-of-stock" && "bg-red-500"
                    )}></span>
                    {item.status.replace("-", " ").toUpperCase()}
                  </span>
                </div>
              </td>
              <td className="px-6 py-5 text-right">
                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">more_vert</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
