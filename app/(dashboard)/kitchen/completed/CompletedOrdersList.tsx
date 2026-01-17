"use client";

interface OrderItem {
  id: string;
  qty: number;
  notes?: string | null;
  menu: {
    name: string;
  };
}

interface Order {
  id: string;
  status: string;
  notes?: string | null;
  createdAt: Date;
  table: {
    tableNo: number;
  };
  orderItems: OrderItem[];
}

interface CompletedOrdersClientProps {
  orders: Order[];
}

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-700",
  SERVED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: "Selesai",
  SERVED: "Disajikan",
  CANCELLED: "Dibatalkan",
};

export function CompletedOrdersClient({ orders }: CompletedOrdersClientProps) {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-white px-8 py-6 border-b border-slate-200">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Riwayat Pesanan
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Daftar pesanan yang sudah selesai atau dibatalkan
        </p>
      </header>

      <div className="p-8 overflow-auto flex-1">
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
              history
            </span>
            <p className="text-slate-500">Belum ada riwayat pesanan</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Meja</th>
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">
                        Meja {order.table.tableNo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ul className="space-y-1">
                        {order.orderItems.map((item) => (
                          <li key={item.id} className="text-slate-600">
                            <span className="font-medium">{item.qty}x</span>{" "}
                            {item.menu.name}
                            {item.notes && (
                              <span className="text-slate-400 text-xs ml-2">
                                ({item.notes})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          STATUS_COLORS[order.status] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(order.createdAt).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
