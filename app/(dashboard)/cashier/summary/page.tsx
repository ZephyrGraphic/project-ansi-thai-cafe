import { getDailyPayments } from "@/lib/actions/payments";

export default async function CashierSummaryPage() {
  const dailyPayments = await getDailyPayments();
  
  const totalSales = dailyPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalOrders = dailyPayments.length;
  
  const cashPayments = dailyPayments.filter(p => p.method === "CASH");
  const cashSales = cashPayments.reduce((sum, p) => sum + p.amount, 0);
  
  const qrisPayments = dailyPayments.filter(p => p.method === "QRIS");
  const qrisSales = qrisPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="flex flex-col h-full bg-slate-50 font-display">
      <header className="bg-white px-8 py-6 border-b border-slate-200">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Ringkasan Harian</h2>
        <p className="text-slate-500 text-sm mt-1">Rekonsiliasi akhir shift</p>
      </header>

      <div className="p-8 overflow-y-auto">
        <div className="grid grid-cols-3 gap-6 mb-8">
           <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-600/20">
             <p className="text-blue-100 font-medium mb-1">Total Penjualan</p>
             <h3 className="text-4xl font-black">Rp {(totalSales).toLocaleString('id-ID')}</h3>
           </div>
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <p className="text-slate-500 font-medium mb-1">Total Transaksi</p>
             <h3 className="text-4xl font-black text-slate-900">{totalOrders}</h3>
           </div>
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <p className="text-slate-500 font-medium mb-1">Rata-rata Tiket</p>
             <h3 className="text-4xl font-black text-slate-900">
               Rp {totalOrders > 0 ? (totalSales / totalOrders).toLocaleString('id-ID') : 0}
             </h3>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
              <h4 className="font-bold text-lg text-slate-900 mb-6">Metode Pembayaran</h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                       <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                         <span className="material-symbols-outlined">qr_code_2</span>
                       </div>
                       <span className="font-bold text-slate-700">QRIS</span>
                    </div>
                    <span className="font-bold text-slate-900">Rp {qrisSales.toLocaleString('id-ID')}</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                       <div className="size-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                         <span className="material-symbols-outlined">payments</span>
                       </div>
                       <span className="font-bold text-slate-700">Tunai</span>
                    </div>
                    <span className="font-bold text-slate-900">Rp {cashSales.toLocaleString('id-ID')}</span>
                 </div>
              </div>
           </div>
           
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h4 className="font-bold text-lg text-slate-900 mb-4">Laci Kas</h4>
              <div className="space-y-4">
                 <div className="flex justify-between">
                    <span className="text-slate-500">Saldo Awal (Modal)</span>
                    <span className="font-mono text-slate-900">Rp 100.000</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-slate-500">Penjualan Tunai</span>
                    <span className="font-mono text-slate-900">Rp {cashSales.toLocaleString('id-ID')}</span>
                 </div>
                 <div className="border-t border-slate-100 pt-3 flex justify-between">
                    <span className="font-bold text-slate-900">Total Uang di Laci</span>
                    <span className="font-bold font-mono text-slate-900">
                      Rp {(cashSales + 100000).toLocaleString('id-ID')}
                    </span>
                 </div>
              </div>
              <button className="w-full mt-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-not-allowed opacity-50">
                Cetak Laporan Z (Coming Soon)
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
