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
  const totalTables = tables.length || 1;
  const occupancyRate = Math.round((occupiedTables / totalTables) * 100);

  const formatCurrency = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`;
  const metrics = [
    {
      label: "Pendapatan Hari Ini",
      value: formatCurrency(todaySummary.totalAmount),
      detail: `${todaySummary.totalTransactions} transaksi tercatat`,
      icon: "payments",
      tone: "botanical-card-strong",
    },
    {
      label: "Pesanan Aktif",
      value: activeOrders.length.toString(),
      detail: "Dalam alur dapur dan service",
      icon: "receipt_long",
      tone: "botanical-card",
    },
    {
      label: "Okupansi Meja",
      value: `${occupancyRate}%`,
      detail: `${availableTables} meja tersedia`,
      icon: "table_restaurant",
      tone: "botanical-card",
    },
    {
      label: "Stok Rendah",
      value: lowStockIngredients.length.toString(),
      detail: "Perlu perhatian inventory",
      icon: "warning",
      tone: "botanical-card",
    },
  ];

  return (
    <div className="flex min-h-full flex-col gap-6 font-display">
      <section className="botanical-card-strong relative overflow-hidden rounded-[34px] p-7 md:p-8">
        <div className="absolute inset-0 asset-pattern opacity-[0.08]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-[#f2c94c]">
              Manager cockpit
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-[#fff8e8]">
              Pantau floor, dapur, kasir, dan stok dari satu layar.
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-white/70">
              Ringkasan operasional ini memakai data order, pembayaran, meja, dan inventaris yang sedang aktif di sistem.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/12 bg-white/10 p-5 backdrop-blur">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#f2c94c]">
              Status Restoran
            </p>
            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-xs font-bold text-white/70">
                  <span>Okupansi</span>
                  <span>{occupiedTables}/{tables.length} meja</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/14">
                  <div className="h-full rounded-full brass-glow" style={{ width: `${Math.min(occupancyRate, 100)}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-2xl font-black text-[#f2c94c]">{availableTables}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Meja kosong</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-2xl font-black text-[#f2c94c]">{lowStockIngredients.length}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Alert stok</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className={`${metric.tone} rounded-[28px] p-5`}>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest opacity-70">{metric.label}</p>
                <p className="mt-3 text-3xl font-black leading-tight">{metric.value}</p>
              </div>
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/16 text-[#f2c94c]">
                <span className="material-symbols-outlined">{metric.icon}</span>
              </div>
            </div>
            <p className="text-sm font-semibold opacity-70">{metric.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="botanical-card rounded-[30px] p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#b98c48]">Aksi cepat</p>
              <h2 className="mt-1 text-2xl font-black text-[#063d2d]">Kelola operasional</h2>
            </div>
            <span className="material-symbols-outlined text-[#0a6b44]">bolt</span>
          </div>
          <div className="grid gap-3">
            {[
              { href: "/admin/sales", icon: "monitoring", title: "Laporan Penjualan", desc: "Analisis pendapatan dan transaksi" },
              { href: "/admin/inventory", icon: "inventory_2", title: "Manajemen Stok", desc: "Pantau bahan dan restock" },
              { href: "/admin/menu", icon: "menu_book", title: "Manajemen Menu", desc: "Kelola item, harga, dan kategori" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="group flex items-center gap-4 rounded-2xl border border-[#dfd2bd]/70 bg-white/72 p-4 transition hover:border-[#0a6b44]/35 hover:bg-white">
                <span className="material-symbols-outlined grid size-11 place-items-center rounded-2xl bg-[#0a6b44]/10 text-[#0a6b44] transition group-hover:bg-[#0a6b44] group-hover:text-white">
                  {item.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-black text-[#17231d]">{item.title}</span>
                  <span className="block text-sm font-medium text-[#667064]">{item.desc}</span>
                </span>
                <span className="material-symbols-outlined text-[#b98c48]">arrow_forward</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="botanical-card rounded-[30px] p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#b98c48]">Inventory watch</p>
              <h2 className="mt-1 text-2xl font-black text-[#063d2d]">Peringatan stok</h2>
            </div>
            <Link href="/admin/inventory" className="rounded-2xl bg-[#0a6b44] px-4 py-2 text-xs font-black uppercase tracking-widest text-white">
              Buka stok
            </Link>
          </div>
        {lowStockIngredients.length > 0 && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {lowStockIngredients.map(ing => (
                <div key={ing.id} className="rounded-2xl border border-[#d9492f]/18 bg-[#d9492f]/8 p-4">
                  <h4 className="font-black text-[#17231d]">{ing.name}</h4>
                  <p className="mt-1 text-sm font-semibold text-[#8f2e20]">
                    Stok: {ing.currentStock} {ing.unit} (min: {ing.minStock})
                  </p>
                </div>
              ))}
            </div>
        )}
        {lowStockIngredients.length === 0 && (
          <div className="rounded-[26px] border border-[#0a6b44]/16 bg-[#0a6b44]/8 p-8 text-center">
            <span className="material-symbols-outlined text-5xl text-[#0a6b44]">verified</span>
            <p className="mt-3 text-lg font-black text-[#063d2d]">Semua stok aman</p>
            <p className="mt-1 text-sm font-medium text-[#667064]">Belum ada bahan yang menyentuh batas minimum.</p>
          </div>
        )}
        </div>
      </section>
    </div>
  );
}
