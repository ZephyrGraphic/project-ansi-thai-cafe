"use client";

import { useState } from "react";
import type { Order, Table, Payment, OrderDetail, Menu, User, Member } from "@prisma/client";

type OrderWithRelations = Order & {
  table: Table;
  payment: Payment | null;
  user: User | null;
  member: Member | null;
  orderItems: (OrderDetail & { menu: Menu })[];
};

interface WaiterHistoryClientProps {
  orders: OrderWithRelations[];
}

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: "Lunas",
  CANCELLED: "Dibatalkan",
};

export default function WaiterHistoryClient({ orders }: WaiterHistoryClientProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderWithRelations | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredOrders = filterStatus === "all"
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-white px-8 py-6 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Riwayat Pesanan
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Daftar pesanan yang telah selesai
          </p>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg"
        >
          <option value="all">Semua Status</option>
          <option value="COMPLETED">Lunas</option>
          <option value="CANCELLED">Dibatalkan</option>
        </select>
      </header>

      <div className="p-8 overflow-y-auto flex-1">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Order #</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Meja</th>
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-mono text-slate-700">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    Meja {order.table.tableNo}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {order.orderItems.length} item
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    Rp {order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    Belum ada riwayat pesanan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Detail Pesanan
                </h3>
                <p className="text-sm text-slate-500">
                  #{selectedOrder.id.slice(0, 8)} • Meja {selectedOrder.table.tableNo}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-500 mb-1">Waktu Pesanan</p>
                <p className="font-semibold">
                  {new Date(selectedOrder.createdAt).toLocaleString("id-ID")}
                </p>
              </div>

              {selectedOrder.member && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 mb-1">Member</p>
                  <p className="font-semibold text-blue-900">{selectedOrder.member.name}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-slate-500 mb-2">Item Pesanan</p>
                <div className="space-y-2">
                  {selectedOrder.orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-slate-50 rounded-lg p-3">
                      <div>
                        <p className="font-semibold">{item.menu.name}</p>
                        <p className="text-sm text-slate-500">{item.qty}x @ Rp {item.menu.price.toLocaleString()}</p>
                        {item.notes && (
                          <p className="text-xs text-orange-600">Catatan: {item.notes}</p>
                        )}
                      </div>
                      <p className="font-bold">Rp {item.subtotal.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-green-600">
                    Rp {selectedOrder.totalAmount.toLocaleString()}
                  </span>
                </div>
                {selectedOrder.payment && (
                  <p className="text-sm text-slate-500 mt-1">
                    Dibayar via {selectedOrder.payment.method}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full mt-6 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
