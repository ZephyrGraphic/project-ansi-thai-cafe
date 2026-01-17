"use client";

export default function CashierSettingsPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50 font-display">
      <header className="bg-white px-8 py-6 border-b border-slate-200">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Pengaturan Stasiun</h2>
        <p className="text-slate-500 text-sm mt-1">Konfigurasi Printer dan Laci</p>
      </header>

      <div className="p-8 max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Perangkat Keras</h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <div className="flex flex-col">
                   <span className="text-slate-700 font-bold">Printer Resi</span>
                   <span className="text-xs text-slate-400">EPSON TM-T82X</span>
                 </div>
                 <button className="text-sm font-bold text-primary hover:underline">Tes Cetak</button>
               </div>
               <div className="flex items-center justify-between">
                 <div className="flex flex-col">
                   <span className="text-slate-700 font-bold">Laci Kas</span>
                   <span className="text-xs text-green-500">Terhubung</span>
                 </div>
                 <button className="text-sm font-bold text-primary hover:underline">Buka Laci</button>
               </div>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Preferensi</h3>
            <div className="space-y-4">
               <label className="flex items-center justify-between cursor-pointer">
                 <span className="text-slate-700">Cetak Resi Otomatis</span>
                 <input type="checkbox" defaultChecked className="toggle" />
               </label>
               <label className="flex items-center justify-between cursor-pointer">
                 <span className="text-slate-700">Opsi Resi Email</span>
                 <input type="checkbox" className="toggle" />
               </label>
            </div>
          </div>
        </div>
        
        <button className="mt-6 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
          Simpan Pengaturan
        </button>
      </div>
      <style jsx>{`
        .toggle {
           @apply w-11 h-6 bg-slate-200 rounded-full appearance-none relative cursor-pointer checked:bg-primary transition-colors after:content-[''] after:active:scale-90 after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform checked:after:translate-x-full;
        }
      `}</style>
    </div>
  );
}
