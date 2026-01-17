"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { processPayment } from "@/lib/actions/payments";
import { addPoints } from "@/lib/actions/members";
import type { Order, Table, OrderDetail, Menu, Payment, Member } from "@prisma/client";

type OrderWithItems = Order & {
  table: Table;
  orderItems: (OrderDetail & { menu: Menu })[];
  payment: Payment | null;
};

interface CashierPageClientProps {
  orders: OrderWithItems[];
  members: Member[];
}

export default function CashierPageClient({ orders, members }: CashierPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(
    orders.find(o => o.status === "SERVED") || orders[0] || null
  );
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "QRIS">("CASH");
  const [cashReceived, setCashReceived] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Filter members by phone
  const filteredMembers = memberSearch.length >= 3
    ? members.filter(m => m.phone.includes(memberSearch) || m.name.toLowerCase().includes(memberSearch.toLowerCase()))
    : [];

  const unpaidOrders = orders.filter(o => !o.payment);
  const servedOrders = unpaidOrders.filter(o => o.status === "SERVED");

  const handlePayment = async () => {
    if (!selectedOrder) return;

    startTransition(async () => {
      try {
        await processPayment({
          orderId: selectedOrder.id,
          method: paymentMethod,
        });
        router.refresh();
        setSelectedOrder(null);
        setCashReceived("");
      } catch (error) {
        console.error("Payment failed:", error);
      }
    });
  };

  const formatCurrency = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`;
  const change = cashReceived ? parseFloat(cashReceived) - (selectedOrder?.totalAmount || 0) : 0;

  return (
    <div className="flex h-full bg-slate-50 font-display">
      {/* Left - Orders List */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Pesanan Menunggu</h3>
          <p className="text-sm text-slate-500">{servedOrders.length} siap bayar</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {unpaidOrders.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2">receipt</span>
              <p>Tidak ada pesanan</p>
            </div>
          ) : (
            unpaidOrders.map(order => (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedOrder?.id === order.id 
                    ? "border-primary bg-primary/5" 
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-slate-900">Meja {order.table.tableNo}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    order.status === "SERVED" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {order.status === "SERVED" ? "SIAP BAYAR" : order.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{order.orderItems.length} item</p>
                <p className="font-bold text-primary mt-1">{formatCurrency(order.totalAmount)}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Middle - Order Details */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedOrder ? (
          <>
            <header className="bg-white border-b border-slate-200 px-8 py-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Meja {selectedOrder.table.tableNo} - Pembayaran
              </h2>
              <p className="text-sm text-slate-500">
                Order #{selectedOrder.id.slice(-8).toUpperCase()}
              </p>
            </header>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">Item</th>
                      <th className="text-center px-6 py-3 text-xs font-bold text-slate-500 uppercase">Qty</th>
                      <th className="text-right px-6 py-3 text-xs font-bold text-slate-500 uppercase">Harga</th>
                      <th className="text-right px-6 py-3 text-xs font-bold text-slate-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {selectedOrder.orderItems.map(item => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-800">{item.menu.name}</span>
                          {item.notes && (
                            <p className="text-xs text-slate-400">{item.notes}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center text-slate-600">{item.qty}</td>
                        <td className="px-6 py-4 text-right text-slate-600">
                          {formatCurrency(item.menu.price)}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">
                          {formatCurrency(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedOrder.notes && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <span className="text-xs font-bold text-amber-800">Catatan:</span>
                  <p className="text-sm text-amber-700">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-30">point_of_sale</span>
              <p>Pilih pesanan untuk memproses pembayaran</p>
            </div>
          </div>
        )}
      </div>

      {/* Right - Payment Panel */}
      {selectedOrder && (
        <div className="w-96 bg-white border-l border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Pembayaran</h3>
          </div>

          <div className="flex-1 p-6 space-y-6">
            {/* Total */}
            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <p className="text-sm text-slate-500 mb-1">Total Pembayaran</p>
              <p className="text-4xl font-black text-slate-900">
                {formatCurrency(selectedOrder.totalAmount)}
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-3">Metode Pembayaran</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod("CASH")}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === "CASH" 
                      ? "border-primary bg-primary/5" 
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl text-green-600">payments</span>
                  <span className="font-bold text-slate-900">Tunai</span>
                </button>
                <button
                  onClick={() => setPaymentMethod("QRIS")}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === "QRIS" 
                      ? "border-primary bg-primary/5" 
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl text-blue-600">qr_code_2</span>
                  <span className="font-bold text-slate-900">QRIS</span>
                </button>
              </div>
            </div>

            {/* Cash Input */}
            {paymentMethod === "CASH" && (
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">Uang Diterima</label>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xl font-bold text-right focus:ring-2 focus:ring-primary"
                />
                {change > 0 && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
                    <span className="text-sm text-green-700">Kembalian: </span>
                    <span className="font-bold text-green-800">{formatCurrency(change)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Quick Cash Amounts */}
            {paymentMethod === "CASH" && (
              <div className="grid grid-cols-3 gap-2">
                {[50000, 100000, 200000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setCashReceived(amount.toString())}
                    className="py-2 rounded-lg bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200"
                  >
                    {amount / 1000}K
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="p-6 border-t border-slate-100">
            <button
              onClick={handlePayment}
              disabled={isPending || selectedOrder.status !== "SERVED"}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Memproses..." : selectedOrder.status !== "SERVED" 
                ? "Tunggu pesanan selesai" 
                : "Konfirmasi Pembayaran"}
            </button>
            {selectedOrder.status !== "SERVED" && (
              <p className="text-xs text-center text-amber-600 mt-2">
                Pesanan masih dalam status: {selectedOrder.status}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
