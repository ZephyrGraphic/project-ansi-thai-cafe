"use client";

import { useState, useTransition } from "react";
import { createIngredient, updateIngredient, addStockLog } from "@/lib/actions/inventory";
import type { Ingredient } from "@prisma/client";

interface InventoryPageClientProps {
  initialIngredients: Ingredient[];
}

export default function InventoryPageClient({ initialIngredients }: InventoryPageClientProps) {
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    unit: "kg",
    currentStock: "",
    minStock: "",
    costPerUnit: "",
  });

  const [stockFormData, setStockFormData] = useState({
    type: "IN" as "IN" | "OUT",
    qty: "",
    notes: "",
  });

  const filteredIngredients = ingredients.filter(ing => 
    ing.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockStatus = (ing: Ingredient) => {
    if (ing.currentStock <= 0) return { label: "Habis", color: "bg-red-100 text-red-700 border-red-200" };
    if (ing.currentStock <= ing.minStock) return { label: "Rendah", color: "bg-amber-100 text-amber-700 border-amber-200" };
    return { label: "Aman", color: "bg-green-100 text-green-700 border-green-200" };
  };

  const handleAdd = () => {
    setSelectedIngredient(null);
    setFormData({ name: "", unit: "kg", currentStock: "", minStock: "", costPerUnit: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (ing: Ingredient) => {
    setSelectedIngredient(ing);
    setFormData({
      name: ing.name,
      unit: ing.unit,
      currentStock: ing.currentStock.toString(),
      minStock: ing.minStock.toString(),
      costPerUnit: ing.costPerUnit.toString(),
    });
    setIsModalOpen(true);
  };

  const handleStockAdjust = (ing: Ingredient) => {
    setSelectedIngredient(ing);
    setStockFormData({ type: "IN", qty: "", notes: "" });
    setStockModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      if (selectedIngredient) {
        const updated = await updateIngredient(selectedIngredient.id, {
          name: formData.name,
          unit: formData.unit,
          minStock: parseFloat(formData.minStock) || 0,
          costPerUnit: parseFloat(formData.costPerUnit) || 0,
        });
        setIngredients(ingredients.map(i => i.id === updated.id ? updated : i));
      } else {
        const created = await createIngredient({
          name: formData.name,
          unit: formData.unit,
          currentStock: parseFloat(formData.currentStock) || 0,
          minStock: parseFloat(formData.minStock) || 0,
          costPerUnit: parseFloat(formData.costPerUnit) || 0,
        });
        setIngredients([...ingredients, created]);
      }
      setIsModalOpen(false);
    });
  };

  const handleStockSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIngredient) return;
    
    startTransition(async () => {
      const result = await addStockLog({
        ingredientId: selectedIngredient.id,
        type: stockFormData.type,
        qty: parseFloat(stockFormData.qty),
        notes: stockFormData.notes || undefined,
      });
      setIngredients(ingredients.map(i => i.id === result.ingredient.id ? result.ingredient : i));
      setStockModalOpen(false);
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-display">
      <header className="bg-white px-8 pt-8 pb-4 border-b border-slate-200 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Stok & Produksi</h2>
            <p className="text-slate-500 text-sm">Kelola bahan, biaya, dan resep menu Anda.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Tambah Bahan
            </button>
          </div>
        </div>
        
        {/* Sub-navigation tabs */}

      </header>

      <div className="p-8 flex flex-col gap-6 flex-1 overflow-y-auto">
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative flex items-center group">
              <span className="absolute left-3 text-slate-400 material-symbols-outlined">search</span>
              <input 
                className="w-full pl-10 pr-4 py-3 bg-white border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/40 shadow-sm placeholder:text-slate-400" 
                placeholder="Cari bahan..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Nama Bahan</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Stok</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Min. Stok</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Harga/Unit</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredIngredients.map((ing) => {
                const status = getStockStatus(ing);
                return (
                  <tr key={ing.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">{ing.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-slate-700">{ing.currentStock} {ing.unit}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-slate-500">{ing.minStock} {ing.unit}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600">Rp {ing.costPerUnit.toLocaleString('id-ID')}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => handleStockAdjust(ing)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100"
                        >
                          +/- Stok
                        </button>
                        <button 
                          onClick={() => handleEdit(ing)}
                          className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredIngredients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Tidak ada bahan ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
              <h3 className="font-bold text-lg text-slate-900">
                {selectedIngredient ? "Edit Bahan" : "Tambah Bahan Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Nama Bahan</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-primary" 
                  placeholder="e.g. Beras Pandan Wangi"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Stok Awal</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.currentStock}
                    onChange={e => setFormData({...formData, currentStock: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-primary" 
                    placeholder="0"
                    disabled={!!selectedIngredient}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Satuan</label>
                  <select 
                    value={formData.unit}
                    onChange={e => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-primary bg-white"
                  >
                    <option value="kg">kg</option>
                    <option value="L">L</option>
                    <option value="pcs">pcs</option>
                    <option value="kaleng">kaleng</option>
                    <option value="bungkus">bungkus</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Minimum Stok</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.minStock}
                    onChange={e => setFormData({...formData, minStock: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-primary" 
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Harga/Unit (Rp)</label>
                  <input 
                    type="number" 
                    value={formData.costPerUnit}
                    onChange={e => setFormData({...formData, costPerUnit: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-primary" 
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl">
                  Batal
                </button>
                <button type="submit" disabled={isPending} className="flex-1 py-2.5 font-bold text-white bg-primary hover:bg-primary-dark rounded-xl disabled:opacity-50">
                  {isPending ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {stockModalOpen && selectedIngredient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
              <h3 className="font-bold text-lg text-slate-900">Sesuaikan Stok</h3>
              <button onClick={() => setStockModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleStockSave} className="p-6 flex flex-col gap-4">
              <p className="text-sm text-slate-600">
                <span className="font-bold">{selectedIngredient.name}</span> - Stok saat ini: {selectedIngredient.currentStock} {selectedIngredient.unit}
              </p>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setStockFormData({...stockFormData, type: "IN"})}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold ${stockFormData.type === 'IN' ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  + Masuk
                </button>
                <button 
                  type="button"
                  onClick={() => setStockFormData({...stockFormData, type: "OUT"})}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold ${stockFormData.type === 'OUT' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  - Keluar
                </button>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Jumlah ({selectedIngredient.unit})</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={stockFormData.qty}
                  onChange={e => setStockFormData({...stockFormData, qty: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-primary" 
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Catatan (opsional)</label>
                <input 
                  type="text" 
                  value={stockFormData.notes}
                  onChange={e => setStockFormData({...stockFormData, notes: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-primary" 
                  placeholder="e.g. Pembelian mingguan"
                />
              </div>
              
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setStockModalOpen(false)} className="flex-1 py-2.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl">
                  Batal
                </button>
                <button type="submit" disabled={isPending} className="flex-1 py-2.5 font-bold text-white bg-primary hover:bg-primary-dark rounded-xl disabled:opacity-50">
                  {isPending ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
