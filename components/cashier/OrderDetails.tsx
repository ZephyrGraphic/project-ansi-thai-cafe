import { cn } from "@/lib/utils";

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: string;
  total: string;
}

export function OrderDetails({ items }: { items: OrderItem[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm font-display">
      <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Detail Pesanan</h3>
        <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wider">
          Belum Dibayar
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-slate-400 text-xs font-bold uppercase tracking-wider">Nama Item</th>
              <th className="px-6 py-4 text-slate-400 text-xs font-bold uppercase tracking-wider text-center">Jml</th>
              <th className="px-6 py-4 text-slate-400 text-xs font-bold uppercase tracking-wider text-right">Harga</th>
              <th className="px-6 py-4 text-slate-400 text-xs font-bold uppercase tracking-wider text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-5 text-slate-800 text-sm font-medium">{item.name}</td>
                <td className="px-6 py-5 text-slate-600 text-sm text-center font-medium">{item.qty}</td>
                <td className="px-6 py-5 text-slate-600 text-sm text-right">{item.price}</td>
                <td className="px-6 py-5 text-slate-800 text-sm font-bold text-right">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
