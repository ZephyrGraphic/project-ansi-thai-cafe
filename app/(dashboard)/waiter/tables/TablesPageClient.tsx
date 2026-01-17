"use client";

import { useState, useTransition } from "react";
import { updateTableStatus } from "@/lib/actions/tables";
import type { Table, Order, OrderDetail, Menu } from "@prisma/client";

type TableWithOrders = Table & {
  orders: (Order & { orderItems: (OrderDetail & { menu: Menu })[] })[];
};

type OrderWithItems = Order & {
  table: Table;
  orderItems: (OrderDetail & { menu: Menu })[];
};

interface TablesPageClientProps {
  initialTables: TableWithOrders[];
  initialOrders: OrderWithItems[];
}

export default function TablesPageClient({ initialTables, initialOrders }: TablesPageClientProps) {
  const [tables, setTables] = useState(initialTables);
  const [activeFloor, setActiveFloor] = useState("all");
  const [isPending, startTransition] = useTransition();

  const getTableOrder = (tableId: string) => {
    return initialOrders.find(o => o.tableId === tableId);
  };

  const tablesWithStatus = tables.map(table => {
    const activeOrder = getTableOrder(table.id);
    return {
      ...table,
      activeOrder,
      displayStatus: activeOrder ? 'OCCUPIED' : table.status,
    };
  });

  const filteredTables = activeFloor === "all" 
    ? tablesWithStatus 
    : tablesWithStatus.filter(t => t.zone === activeFloor);

  const handleStatusChange = async (tableId: string, status: "AVAILABLE" | "RESERVED" | "CLEANING") => {
    startTransition(async () => {
      const updated = await updateTableStatus(tableId, status);
      setTables(tables.map(t => t.id === tableId ? { ...t, status: updated.status } : t));
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 border-green-200 text-green-700';
      case 'OCCUPIED': return 'bg-blue-100 border-blue-200 text-blue-700';
      case 'RESERVED': return 'bg-amber-100 border-amber-200 text-amber-700';
      case 'CLEANING': return 'bg-slate-100 border-slate-200 text-slate-600';
      default: return 'bg-slate-100 border-slate-200 text-slate-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'Tersedia';
      case 'OCCUPIED': return 'Terisi';
      case 'RESERVED': return 'Dipesan';
      case 'CLEANING': return 'Kotor';
      default: return status;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Filters */}
      <header className="p-8 pb-4 border-b border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Manajemen Meja</h2>
            <p className="text-slate-500 text-sm mt-1">Kelola status meja dan pesanan</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveFloor("all")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeFloor === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Semua
            </button>
            <button 
              onClick={() => setActiveFloor("floor1")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeFloor === 'floor1' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Ruang Utama
            </button>
            <button 
              onClick={() => setActiveFloor("floor2")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeFloor === 'floor2' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Ruang AC
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto px-8 pb-10 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredTables.map((table) => (
            <div 
              key={table.id} 
              className={`relative bg-white border-2 rounded-2xl p-5 transition-all hover:shadow-lg ${getStatusColor(table.displayStatus)}`}
            >
              {/* Table Number */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Meja {table.tableNo}</h3>
                  <p className="text-xs text-slate-500">{table.zone === 'floor1' ? 'Ruang Utama' : 'Ruang AC'}</p>
                </div>
                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase ${getStatusColor(table.displayStatus)}`}>
                  {getStatusLabel(table.displayStatus)}
                </span>
              </div>

              {/* Capacity */}
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                <span className="material-symbols-outlined text-lg">group</span>
                <span>{table.capacity} kursi</span>
              </div>

              {/* Order Info */}
              {table.activeOrder && (
                <div className="bg-white/80 rounded-xl p-3 mb-4 border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 mb-1">Order Aktif</p>
                  <p className="font-bold text-slate-800">
                    Rp {table.activeOrder.totalAmount.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-slate-400">
                    {table.activeOrder.orderItems.length} item
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {table.displayStatus === 'CLEANING' && (
                  <button 
                    onClick={() => handleStatusChange(table.id, 'AVAILABLE')}
                    disabled={isPending}
                    className="flex-1 py-2 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 disabled:opacity-50"
                  >
                    Bersihkan
                  </button>
                )}
                {table.displayStatus === 'AVAILABLE' && (
                  <>
                    <a 
                      href={`/waiter/orders?table=${table.id}`}
                      className="flex-1 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-dark text-center"
                    >
                      Buat Order
                    </a>
                    <button 
                      onClick={() => handleStatusChange(table.id, 'RESERVED')}
                      disabled={isPending}
                      className="flex-1 py-2 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 disabled:opacity-50"
                    >
                      Reservasi
                    </button>
                  </>
                )}
                {table.displayStatus === 'RESERVED' && (
                  <button 
                    onClick={() => handleStatusChange(table.id, 'AVAILABLE')}
                    disabled={isPending}
                    className="flex-1 py-2 bg-slate-500 text-white rounded-lg text-xs font-bold hover:bg-slate-600 disabled:opacity-50"
                  >
                    Batal Reservasi
                  </button>
                )}
                {table.displayStatus === 'OCCUPIED' && (
                  <a 
                    href={`/cashier/orders?table=${table.id}`}
                    className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 text-center"
                  >
                    Lihat Order
                  </a>
                )}
              </div>
            </div>
          ))}
          {filteredTables.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">table_restaurant</span>
              <p>Tidak ada meja ditemukan di bagian ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
