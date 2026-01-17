"use client";

interface Table {
  tableNo: number;
}

interface Payment {
  method: string;
}

interface User {
  name: string | null;
}

interface Member {
  name: string;
}

interface Menu {
  name: string;
}

interface OrderDetail {
  qty: number;
  subtotal: number;
  menu: Menu;
}

interface Order {
  id: string;
  createdAt: Date;
  totalAmount: number;
  table: Table;
  payment: Payment | null;
  user: User | null;
  member: Member | null;
  orderItems: OrderDetail[];
}

interface CashierHistoryClientProps {
  orders: Order[];
}

export function CashierHistoryClient({ orders }: CashierHistoryClientProps) {
  const handlePrintReceipt = (order: Order) => {
    const receiptContent = `
      <html>
        <head>
          <title>Struk - Thai Cafe</title>
          <style>
            body { font-family: monospace; font-size: 12px; width: 300px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
            .items { border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
            .item { display: flex; justify-content: space-between; margin: 5px 0; }
            .total { font-weight: bold; display: flex; justify-content: space-between; }
            .footer { text-align: center; margin-top: 20px; font-size: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin:0">THAI CAFE</h2>
            <p style="margin:5px 0">Jl. Contoh No. 123</p>
            <p style="margin:5px 0">${new Date(order.createdAt).toLocaleString("id-ID")}</p>
          </div>
          <p>Meja: ${order.table.tableNo} | Kasir: ${order.user?.name || "-"}</p>
          <div class="items">
            ${order.orderItems.map((item: OrderDetail) => `
              <div class="item">
                <span>${item.qty}x ${item.menu.name}</span>
                <span>Rp ${item.subtotal.toLocaleString()}</span>
              </div>
            `).join("")}
          </div>
          <div class="total">
            <span>TOTAL</span>
            <span>Rp ${order.totalAmount.toLocaleString()}</span>
          </div>
          <p>Bayar: ${order.payment?.method || "-"}</p>
          ${order.member ? `<p>Member: ${order.member.name} (+${Math.floor(order.totalAmount / 10000)} pts)</p>` : ""}
          <div class="footer">
            <p>Terima kasih atas kunjungan Anda!</p>
            <p>--- Thai Cafe ---</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-display">
      <header className="bg-white px-8 py-6 border-b border-slate-200">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Riwayat Transaksi
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Log semua pembayaran yang diproses
        </p>
      </header>

      <div className="p-8 overflow-y-auto flex-1">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Resi #</th>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Meja</th>
                <th className="px-6 py-4">Metode</th>
                <th className="px-6 py-4 text-right">Jumlah</th>
                <th className="px-6 py-4 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-mono text-slate-700">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(order.createdAt).toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    Meja {order.table.tableNo}
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className="material-symbols-outlined text-sm">
                        {order.payment?.method === "CASH" ? "payments" : "qr_code_2"}
                      </span>
                      {order.payment?.method || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    Rp {order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handlePrintReceipt(order)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-bold border border-blue-200 bg-blue-50 px-3 py-1 rounded-lg"
                    >
                      Cetak Ulang
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Belum ada transaksi.
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
