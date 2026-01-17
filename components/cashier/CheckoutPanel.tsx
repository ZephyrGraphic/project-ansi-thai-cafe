"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface CheckoutPanelProps {
  subtotal: string;
  tax: string;
  service: string;
  total: string;
}

export function CheckoutPanel({ subtotal, tax, service, total }: CheckoutPanelProps) {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qris">("cash");

  return (
    <aside className="w-[400px] bg-white border-l border-slate-100 flex flex-col p-6 font-display h-full shrink-0">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Pembayaran</h3>
      
      {/* Summary */}
      <div className="space-y-3 pb-6 border-b border-slate-100">
        <div className="flex justify-between items-center">
          <p className="text-slate-500 text-sm">Subtotal</p>
          <p className="text-slate-800 text-sm font-medium">{subtotal}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-slate-500 text-sm">Pajak (11%)</p>
          <p className="text-slate-800 text-sm font-medium">{tax}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-slate-500 text-sm">Biaya Layanan (5%)</p>
          <p className="text-slate-800 text-sm font-medium">{service}</p>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-dashed border-slate-200">
          <p className="text-slate-900 text-lg font-bold">Total Tagihan</p>
          <p className="text-primary-dark text-2xl font-bold">{total}</p>
        </div>
      </div>

      <div className="mt-8 space-y-6 flex-1">
        {/* Payment Methods */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">Metode Pembayaran</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod("cash")}
              className={cn(
                "flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all",
                paymentMethod === "cash" 
                  ? "border-primary bg-primary/10 text-primary-dark"
                  : "border-slate-50 text-slate-300 hover:border-slate-200"
              )}
            >
              <span className="material-symbols-outlined text-[32px]">payments</span>
              <span className="text-sm font-bold">Tunai</span>
            </button>
            <button
              onClick={() => setPaymentMethod("qris")}
              className={cn(
                "flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all",
                paymentMethod === "qris" 
                  ? "border-primary bg-primary/10 text-primary-dark"
                  : "border-slate-50 text-slate-300 hover:border-slate-200"
              )}
            >
              <span className="material-symbols-outlined text-[32px]">qr_code_2</span>
              <span className="text-sm font-bold">QRIS</span>
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block" htmlFor="received">Uang Diterima (Rp)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rp</span>
              <input 
                id="received" 
                type="text" 
                defaultValue="300.000"
                className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-xl text-lg font-bold text-slate-800 focus:ring-2 focus:ring-primary outline-none" 
              />
            </div>
          </div>
          <div className="p-4 bg-green-50/70 rounded-xl flex justify-between items-center border border-primary/20">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary-dark/60">Kembalian</p>
              <p className="text-xl font-bold text-primary-dark">Rp 39.000</p>
            </div>
            <span className="material-symbols-outlined text-primary-dark text-[32px]">price_check</span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <button className="w-full bg-primary hover:bg-green-500 text-white py-5 rounded-xl text-lg font-bold shadow-md shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer">
          <span className="material-symbols-outlined">print</span>
          Cetak Struk
        </button>
      </div>
    </aside>
  );
}
