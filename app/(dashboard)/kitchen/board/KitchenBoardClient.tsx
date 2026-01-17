"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/lib/actions/orders";
import type { Order, Table, OrderDetail, Menu } from "@prisma/client";

type OrderWithDetails = Order & {
  table: Table;
  orderItems: (OrderDetail & { menu: Menu })[];
};

interface KitchenBoardClientProps {
  initialOrders: OrderWithDetails[];
}

export default function KitchenBoardClient({ initialOrders }: KitchenBoardClientProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [isPending, startTransition] = useTransition();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 border-amber-300 text-amber-800';
      case 'PREPARING': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'READY': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-slate-100 border-slate-300 text-slate-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Diterima';
      case 'PREPARING': return 'Dimasak';
      case 'READY': return 'Siap';
      default: return status;
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: "PREPARING" | "READY" | "SERVED") => {
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus);
      if (newStatus === 'SERVED') {
        setOrders(orders.filter(o => o.id !== orderId));
      } else {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    });
  };

  const getTimeSince = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 60000);
    if (diff < 1) return 'Baru saja';
    if (diff < 60) return `${diff}m`;
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-display">
      {/* Header */}
      <header className="p-8 pb-4 flex flex-col md:flex-row justify-between items-end gap-6 bg-white border-b border-slate-200">
        <div>
          <h2 className="text-slate-900 text-4xl font-black leading-tight tracking-tight">Pesanan Saat Ini</h2>
          <p className="text-slate-500 text-base font-normal">Tiket dapur aktif dan pelacakan waktu nyata</p>
        </div>
        <div className="flex gap-4">
           {/* Active Stats */}
           <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-lg">
             <span className="text-sm font-bold text-amber-700">Pending: {orders.filter(o => o.status === 'PENDING').length}</span>
           </div>
           <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg">
             <span className="text-sm font-bold text-blue-700">Dimasak: {orders.filter(o => o.status === 'PREPARING').length}</span>
           </div>
           <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-lg">
             <span className="text-sm font-bold text-green-700">Siap: {orders.filter(o => o.status === 'READY').length}</span>
           </div>
        </div>
      </header>

      {/* Ticket Grid */}
      <div className="flex-1 overflow-y-auto p-8 pt-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden ${getStatusColor(order.status)}`}
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    Meja {order.table.tableNo}
                  </h3>
                  <p className="text-xs text-slate-500">Order #{order.id.slice(-6).toUpperCase()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-slate-600">
                    {getTimeSince(order.createdAt)}
                  </span>
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="p-4">
                <ul className="space-y-2">
                  {order.orderItems.map((item) => (
                    <li key={item.id} className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-800">
                        {item.qty}x {item.menu.name}
                      </span>
                      {item.notes && (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                          {item.notes}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                {order.notes && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <p className="text-xs font-bold text-amber-800 mb-1">Catatan:</p>
                    <p className="text-sm text-amber-700">{order.notes}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-4 pt-0 flex gap-2">
                {order.status === 'PENDING' && (
                  <button 
                    onClick={() => handleStatusChange(order.id, 'PREPARING')}
                    disabled={isPending}
                    className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 disabled:opacity-50"
                  >
                    Mulai Masak
                  </button>
                )}
                {order.status === 'PREPARING' && (
                  <button 
                    onClick={() => handleStatusChange(order.id, 'READY')}
                    disabled={isPending}
                    className="flex-1 py-2.5 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600 disabled:opacity-50"
                  >
                    Selesai Masak
                  </button>
                )}
                {order.status === 'READY' && (
                  <button 
                    onClick={() => handleStatusChange(order.id, 'SERVED')}
                    disabled={isPending}
                    className="flex-1 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 disabled:opacity-50"
                  >
                    Sudah Diantar
                  </button>
                )}
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-30">restaurant</span>
              <p className="text-lg font-medium">Tidak ada pesanan aktif</p>
              <p className="text-sm">Pesanan baru akan muncul di sini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
