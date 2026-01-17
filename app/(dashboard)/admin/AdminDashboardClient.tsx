"use client";

import Link from "next/link";
import type { Order, Table, Ingredient } from "@prisma/client";

interface AdminDashboardClientProps {
  activeOrders: Order[];
  tables: Table[];
  ingredients: Ingredient[];
  todaySummary: {
    totalTransactions: number;
    totalAmount: number;
    totalCash: number;
    totalQris: number;
  };
}

export default function AdminDashboardClient({ 
  activeOrders, 
  tables, 
  ingredients,
  todaySummary 
}: AdminDashboardClientProps) {
  const lowStockIngredients = ingredients.filter(i => i.currentStock <= i.minStock);
  const occupiedTables = tables.filter(t => t.status === "OCCUPIED").length;
  const availableTables = tables.filter(t => t.status === "AVAILABLE").length;

  const formatCurrency = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`;

  return (
    <div className="flex flex-col h-full bg-slate-50 font-display overflow-y-auto">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Dashboard Manajer</h1>
          <p className="text-slate-500">Ringkasan operasional Thai Cafe</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary to-green-600 rounded-2xl p-6 text-white">
            <span className="material-symbols-outlined text-3xl opacity-80">payments</span>
            <p className="text-sm opacity-80 mt-2">Pendapatan Hari Ini</p>
            <p className="text-3xl font-black mt-1">{formatCurrency(todaySummary.totalAmount)}</p>
            <p className="text-xs mt-2 opacity-70">{todaySummary.totalTransactions} transaksi</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <span className="material-symbols-outlined text-3xl text-blue-500">receipt_long</span>
            <p className="text-sm text-slate-500 mt-2">Pesanan Aktif</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{activeOrders.length}</p>
            <p className="text-xs mt-2 text-blue-600">Dalam proses</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <span className="material-symbols-outlined text-3xl text-amber-500">table_restaurant</span>
            <p className="text-sm text-slate-500 mt-2">Status Meja</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{occupiedTables}/{tables.length}</p>
            <p className="text-xs mt-2 text-green-600">{availableTables} tersedia</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <span className="material-symbols-outlined text-3xl text-red-500">warning</span>
            <p className="text-sm text-slate-500 mt-2">Stok Rendah</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{lowStockIngredients.length}</p>
            <p className="text-xs mt-2 text-red-600">Perlu restock</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link 
            href="/admin/sales"
            className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-primary transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-primary group-hover:text-white">monitoring</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Laporan Penjualan</h3>
                <p className="text-sm text-slate-500">Lihat analisis pendapatan</p>
              </div>
            </div>
          </Link>

          <Link 
            href="/admin/inventory"
            className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-primary transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-amber-600 group-hover:text-white">inventory_2</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Manajemen Stok</h3>
                <p className="text-sm text-slate-500">Kelola inventaris</p>
              </div>
            </div>
          </Link>

          <Link 
            href="/admin/menu"
            className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-primary transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-blue-600 group-hover:text-white">menu_book</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Manajemen Menu</h3>
                <p className="text-sm text-slate-500">Edit item menu</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Low Stock Alert */}
        {lowStockIngredients.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-red-600">warning</span>
              <h3 className="font-bold text-red-800">Peringatan Stok Rendah</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockIngredients.map(ing => (
                <div key={ing.id} className="bg-white rounded-xl p-4 border border-red-100">
                  <h4 className="font-bold text-slate-900">{ing.name}</h4>
                  <p className="text-sm text-red-600">
                    Stok: {ing.currentStock} {ing.unit} (min: {ing.minStock})
                  </p>
                </div>
              ))}
            </div>
            <Link 
              href="/admin/inventory" 
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700"
            >
              <span className="material-symbols-outlined text-lg">inventory_2</span>
              Kelola Inventaris
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
