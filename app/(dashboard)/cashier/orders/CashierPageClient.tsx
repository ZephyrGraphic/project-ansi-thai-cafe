"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { processPayment } from "@/lib/actions/payments";
import { addPoints, createMember } from "@/lib/actions/members";
import Receipt from "@/components/Receipt";
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

// Poin = 1 per Rp 1.000
const calculatePoints = (amount: number) => Math.floor(amount / 1000);

export default function CashierPageClient({ orders, members }: CashierPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(
    orders.find(o => o.status === "SERVED") || orders[0] || null
  );
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "QRIS">("CASH");
  const [cashReceived, setCashReceived] = useState("");
  
  // Member states
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [showNewMemberModal, setShowNewMemberModal] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({ name: "", phone: "" });
  
  // Receipt states
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderWithItems | null>(null);
  const [completedMember, setCompletedMember] = useState<Member | null>(null);
  const [completedPoints, setCompletedPoints] = useState(0);

  // Filter members by phone or name
  const filteredMembers = memberSearch.length >= 2
    ? members.filter(m => 
        m.phone.includes(memberSearch) || 
        m.name.toLowerCase().includes(memberSearch.toLowerCase())
      ).slice(0, 5)
    : [];

  const unpaidOrders = orders.filter(o => !o.payment);
  const servedOrders = unpaidOrders.filter(o => o.status === "SERVED");

  const potentialPoints = selectedOrder ? calculatePoints(selectedOrder.totalAmount) : 0;

  const handlePayment = async () => {
    if (!selectedOrder) return;

    const orderToComplete = { ...selectedOrder };
    const memberToUse = selectedMember;
    const pointsToAdd = potentialPoints;

    startTransition(async () => {
      try {
        // Process payment
        await processPayment({
          orderId: selectedOrder.id,
          method: paymentMethod,
          memberId: selectedMember?.id,
        });

        // Add points if member selected
        if (selectedMember) {
          await addPoints(selectedMember.id, potentialPoints);
        }

        // Show receipt modal
        setCompletedOrder(orderToComplete);
        setCompletedMember(memberToUse);
        setCompletedPoints(pointsToAdd);
        setShowReceiptModal(true);

        // Reset states
        setSelectedOrder(null);
        setCashReceived("");
        setSelectedMember(null);
        setMemberSearch("");
        
        router.refresh();
      } catch (error) {
        console.error("Payment failed:", error);
        alert("Gagal memproses pembayaran");
      }
    });
  };

  const handlePrintReceipt = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank", "width=320,height=600");
    if (!printWindow) {
      alert("Popup diblokir. Silakan izinkan popup untuk mencetak struk.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Struk - Thai Cafe</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Courier New', monospace; font-size: 12px; }
            .receipt { padding: 10px; width: 280px; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            .text-lg { font-size: 16px; }
            .text-sm { font-size: 11px; }
            .text-xs { font-size: 10px; }
            .mb-1 { margin-bottom: 4px; }
            .mb-2 { margin-bottom: 8px; }
            .mb-3 { margin-bottom: 12px; }
            .mb-4 { margin-bottom: 16px; }
            .mt-1 { margin-top: 4px; }
            .my-2 { margin: 8px 0; }
            .pl-2 { padding-left: 8px; }
            .divider { border-top: 1px dashed #666; margin: 8px 0; }
            .flex { display: flex; justify-content: space-between; }
            .text-gray { color: #666; }
            .text-green { color: #22c55e; }
            @media print {
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); }
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCloseReceipt = () => {
    setShowReceiptModal(false);
    setCompletedOrder(null);
    setCompletedMember(null);
    setCompletedPoints(0);
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      try {
        const newMember = await createMember(newMemberForm);
        setSelectedMember(newMember);
        setMemberSearch(newMember.phone);
        setShowNewMemberModal(false);
        setNewMemberForm({ name: "", phone: "" });
        router.refresh();
      } catch (error) {
        console.error("Failed to create member:", error);
        alert("Gagal membuat member. Nomor telepon mungkin sudah terdaftar.");
      }
    });
  };

  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
    setMemberSearch(member.phone);
    setShowMemberDropdown(false);
  };

  const handleClearMember = () => {
    setSelectedMember(null);
    setMemberSearch("");
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

          <div className="flex-1 p-6 space-y-5 overflow-y-auto">
            {/* Total */}
            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <p className="text-sm text-slate-500 mb-1">Total Pembayaran</p>
              <p className="text-4xl font-black text-slate-900">
                {formatCurrency(selectedOrder.totalAmount)}
              </p>
            </div>

            {/* Member Section */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-blue-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">card_membership</span>
                  Member
                </label>
                <button
                  onClick={() => setShowNewMemberModal(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">person_add</span>
                  Daftar Baru
                </button>
              </div>
              
              {selectedMember ? (
                <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{selectedMember.name}</p>
                    <p className="text-xs text-slate-500">{selectedMember.phone}</p>
                    <p className="text-xs text-amber-600 font-semibold mt-1">
                      Poin saat ini: {selectedMember.points.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <button
                    onClick={handleClearMember}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                    search
                  </span>
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={(e) => {
                      setMemberSearch(e.target.value);
                      setShowMemberDropdown(true);
                    }}
                    onFocus={() => setShowMemberDropdown(true)}
                    placeholder="Cari no. telepon atau nama..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 text-sm"
                  />
                  
                  {/* Dropdown */}
                  {showMemberDropdown && filteredMembers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredMembers.map(member => (
                        <button
                          key={member.id}
                          onClick={() => handleSelectMember(member)}
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b last:border-b-0"
                        >
                          <p className="font-semibold text-slate-900">{member.name}</p>
                          <p className="text-xs text-slate-500">{member.phone} • {member.points} poin</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedMember && (
                <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-xs text-green-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">stars</span>
                    Transaksi ini akan menambah <span className="font-bold">+{potentialPoints} poin</span>
                  </p>
                </div>
              )}
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

      {/* New Member Modal */}
      {showNewMemberModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">person_add</span>
              Daftarkan Member Baru
            </h3>
            <form onSubmit={handleCreateMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={newMemberForm.name}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Nama pelanggan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  No. Telepon *
                </label>
                <input
                  type="tel"
                  value={newMemberForm.phone}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                <span className="material-symbols-outlined text-sm align-middle mr-1">info</span>
                Member baru akan otomatis mendapatkan poin dari transaksi ini.
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewMemberModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isPending ? "Menyimpan..." : "Daftarkan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && completedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-green-700 flex items-center gap-2">
                <span className="material-symbols-outlined">check_circle</span>
                Pembayaran Berhasil!
              </h3>
              <button
                onClick={handleCloseReceipt}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Receipt Preview */}
            <div className="bg-slate-100 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto flex justify-center">
              <Receipt
                ref={receiptRef}
                order={completedOrder}
                member={completedMember}
                pointsEarned={completedMember ? completedPoints : undefined}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCloseReceipt}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold"
              >
                Tutup
              </button>
              <button
                onClick={handlePrintReceipt}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-semibold flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">print</span>
                Cetak Struk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
