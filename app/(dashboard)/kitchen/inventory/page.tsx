import { getIngredients } from "@/lib/actions/inventory";

export default async function KitchenInventoryPage() {
  const ingredients = await getIngredients();

  return (
    <div className="flex flex-col h-full bg-slate-50 font-display">
      <header className="bg-white px-8 py-6 border-b border-slate-200">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Pantry Dapur</h2>
        <p className="text-slate-500 text-sm mt-1">Tingkat stok bahan langsung</p>
      </header>

      <div className="p-8 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ingredients.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
               <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{item.name}</h3>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Kategori: Bahan Baku</p>
               </div>
               
               <div className="mt-6 flex items-end justify-between">
                  <div className="flex flex-col">
                     <span className="text-2xl font-black text-slate-800">{item.currentStock}</span>
                     <span className="text-xs text-slate-500 font-bold">{item.unit}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-xs font-bold ${item.currentStock <= item.minStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {item.currentStock <= item.minStock ? 'Stok Rendah' : 'Aman'}
                  </div>
               </div>
               
               <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${item.currentStock <= item.minStock ? 'bg-red-500' : 'bg-green-500'}`} 
                    style={{ width: `${Math.min((item.currentStock / (item.minStock * 3 || 10)) * 100, 100)}%` }}
                  ></div>
               </div>
            </div>
          ))}
          {ingredients.length === 0 && (
             <div className="col-span-full text-center py-12 text-slate-400">
               <span className="material-symbols-outlined text-4xl mb-2">inventory_2</span>
               <p>Belum ada bahan inventaris</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
