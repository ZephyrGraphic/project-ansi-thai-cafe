"use client";

import { useState } from "react";
import type { Payment, Order, Table, OrderDetail, Menu } from "@prisma/client";

type PaymentWithOrder = Payment & {
  order: Order & {
    table: Table;
    orderItems: (OrderDetail & { menu: Menu })[];
  };
};

type OrderWithItems = Order & {
  table: Table;
  orderItems: (OrderDetail & { menu: Menu })[];
  payment: Payment | null;
};

interface SalesPageClientProps {
  dailyPayments: PaymentWithOrder[];
  monthlySummary: {
    totalTransactions: number;
    totalAmount: number;
    totalCash: number;
    totalQris: number;
  };
  paidOrders: OrderWithItems[];
}

export default function SalesPageClient({ dailyPayments, monthlySummary, paidOrders }: SalesPageClientProps) {
  const [activeTab, setActiveTab] = useState<"today" | "history">("today");

  const todayTotal = dailyPayments.reduce((sum, p) => sum + p.amount, 0);
  const todayCash = dailyPayments.filter(p => p.method === "CASH").reduce((sum, p) => sum + p.amount, 0);
  const todayQris = dailyPayments.filter(p => p.method === "QRIS").reduce((sum, p) => sum + p.amount, 0);

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  const handleExport = () => {
    // CSV Header
    const headers = ["ID Transaksi", "Meja", "Metode", "Total", "Waktu"];
    
    // CSV Rows
    const rows = dailyPayments.map(p => [
      p.id,
      `Meja ${p.order.table.tableNo}`,
      p.method,
      p.amount.toString(),
      new Date(p.createdAt).toLocaleString('id-ID')
    ]);

    // Combine and encode
    const csvContent = [
      headers.join(","), 
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Download linkage
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `laporan_penjualan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-display">
      {/* Header */}
      <header className="bg-white px-8 pt-8 pb-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Laporan Penjualan</h2>
            <p className="text-slate-500 text-sm">Analisis pendapatan dan transaksi</p>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Export Laporan (CSV)
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-primary to-green-600 rounded-2xl p-5 text-white">
            <p className="text-sm opacity-80 mb-1">Total Hari Ini</p>
            <p className="text-3xl font-black">{formatCurrency(todayTotal)}</p>
            <p className="text-xs mt-2 opacity-70">{dailyPayments.length} transaksi</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-sm text-slate-500 mb-1">Tunai (Cash)</p>
            <p className="text-2xl font-black text-slate-900">{formatCurrency(todayCash)}</p>
            <p className="text-xs mt-2 text-green-600 font-semibold">
              {dailyPayments.filter(p => p.method === "CASH").length} transaksi
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-sm text-slate-500 mb-1">QRIS</p>
            <p className="text-2xl font-black text-slate-900">{formatCurrency(todayQris)}</p>
            <p className="text-xs mt-2 text-blue-600 font-semibold">
              {dailyPayments.filter(p => p.method === "QRIS").length} transaksi
            </p>
          </div>
          <div className="bg-slate-800 rounded-2xl p-5 text-white">
            <p className="text-sm opacity-80 mb-1">Total Bulan Ini</p>
            <p className="text-2xl font-black">{formatCurrency(monthlySummary.totalAmount)}</p>
            <p className="text-xs mt-2 opacity-70">{monthlySummary.totalTransactions} transaksi</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("today")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeTab === "today" ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            Transaksi Hari Ini
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeTab === "history" ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            Riwayat Semua
          </button>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">ID Transaksi</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Meja</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Items</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Metode</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase">Total</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(activeTab === "today" ? dailyPayments : paidOrders.filter(o => o.payment)).map((item) => {
                const payment = activeTab === "today" ? item as PaymentWithOrder : (item as OrderWithItems).payment!;
                const order = activeTab === "today" ? (item as PaymentWithOrder).order : item as OrderWithItems;
                
                return (
                  <tr key={payment.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-slate-700">#{payment.id.slice(-8).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">Meja {order.table.tableNo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{order.orderItems.length} item</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                        payment.method === "CASH" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {payment.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-slate-900">{formatCurrency(payment.amount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">{formatDate(payment.createdAt)}</span>
                    </td>
                  </tr>
                );
              })}
              {(activeTab === "today" ? dailyPayments : paidOrders.filter(o => o.payment)).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-2 block opacity-50">receipt_long</span>
                    Belum ada transaksi {activeTab === "today" ? "hari ini" : ""}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
