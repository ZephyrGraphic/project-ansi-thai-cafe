import { cn } from "@/lib/utils";

export interface TopSellingItem {
  id: string;
  name: string;
  category: string;
  orders: number;
  revenue: string;
  status: "top" | "stable" | "rising" | "dropping";
}

export function TopSellingTable({ items }: { items: TopSellingItem[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm font-display">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4">Item Name</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Orders</th>
            <th className="px-6 py-4">Revenue (Rp)</th>
            <th className="px-6 py-4 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
              <td className="px-6 py-4 text-slate-500 text-sm">{item.category}</td>
              <td className="px-6 py-4 text-sm font-medium">{item.orders}</td>
              <td className="px-6 py-4 text-sm font-bold text-slate-900">{item.revenue}</td>
              <td className="px-6 py-4 text-right">
                <span className={cn(
                  "px-3 py-1 text-[10px] font-black rounded-full uppercase border",
                  item.status === "top" && "bg-green-50 text-green-700 border-green-100",
                  item.status === "stable" && "bg-slate-100 text-slate-500 border-slate-200",
                  item.status === "rising" && "bg-blue-50 text-blue-700 border-blue-100",
                  item.status === "dropping" && "bg-red-50 text-red-700 border-red-100"
                )}>
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
