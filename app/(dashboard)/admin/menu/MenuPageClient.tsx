"use client";

import { useState, useTransition } from "react";
import { createMenu, updateMenu, deleteMenu, toggleMenuAvailability } from "@/lib/actions/menu";
import type { Menu, Category } from "@prisma/client";

type MenuWithCategory = Menu & { category: Category };

interface MenuPageClientProps {
  initialMenus: MenuWithCategory[];
  categories: Category[];
}

export default function MenuPageClient({ initialMenus, categories }: MenuPageClientProps) {
  const [menus, setMenus] = useState(initialMenus);
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuWithCategory | null>(null);
  const [isPending, startTransition] = useTransition();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: categories[0]?.id || "",
    image: "",
  });

  const filteredMenus = activeTab === "all" 
    ? menus 
    : menus.filter(m => m.categoryId === activeTab);

  const handleEdit = (menu: MenuWithCategory) => {
    setEditingItem(menu);
    setFormData({
      name: menu.name,
      price: menu.price.toString(),
      categoryId: menu.categoryId,
      image: menu.image || "",
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      price: "",
      categoryId: categories[0]?.id || "",
      image: "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus item menu ini?")) {
      startTransition(async () => {
        await deleteMenu(id);
        setMenus(menus.filter(m => m.id !== id));
      });
    }
  };

  const handleToggleAvailability = async (id: string) => {
    startTransition(async () => {
      const updated = await toggleMenuAvailability(id);
      setMenus(menus.map(m => m.id === id ? { ...m, isAvailable: updated.isAvailable } : m));
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      if (editingItem) {
        // Update existing
        const updated = await updateMenu(editingItem.id, {
          name: formData.name,
          price: parseFloat(formData.price),
          categoryId: formData.categoryId,
          image: formData.image || undefined,
        });
        const category = categories.find(c => c.id === updated.categoryId)!;
        setMenus(menus.map(m => m.id === updated.id ? { ...updated, category } : m));
      } else {
        // Create new
        const created = await createMenu({
          name: formData.name,
          price: parseFloat(formData.price),
          categoryId: formData.categoryId,
          image: formData.image || undefined,
        });
        const category = categories.find(c => c.id === created.categoryId)!;
        setMenus([...menus, { ...created, category }]);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-display relative">
      <header className="bg-white px-8 pt-6 pb-4 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Manajemen Menu</h2>
            <p className="text-slate-500 text-sm mt-1">Atur item, harga, dan ketersediaan</p>
          </div>
          <button 
             onClick={handleAdd}
             disabled={isPending}
             className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Tambah Item Baru
          </button>
        </div>

        {/* Categories Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button 
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Semua Item
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === cat.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>
      
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto">
        {filteredMenus.map((item) => (
          <div key={item.id} className="group bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative flex flex-col">
            {/* Status Toggle */}
            <button 
              onClick={() => handleToggleAvailability(item.id)}
              disabled={isPending}
              className="absolute top-4 right-4 z-10"
            >
              <span className={`px-2 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wide border cursor-pointer hover:opacity-80 ${item.isAvailable ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                {item.isAvailable ? 'Aktif' : 'Disembunyikan'}
              </span>
            </button>

            <div 
              className="w-full aspect-square rounded-xl bg-slate-100 mb-4 bg-cover bg-center shrink-0"
              style={{ backgroundImage: item.image ? `url("${item.image}")` : undefined }}
            />
            
            <div className="flex-1">
               <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{item.name}</h3>
               <p className="text-xs text-slate-400 mb-1">{item.category.name}</p>
               <p className="text-primary font-black text-sm">Rp {item.price.toLocaleString('id-ID')}</p>
            </div>
            
            <div className="mt-4 flex gap-2 pt-4 border-t border-slate-50">
              <button 
                onClick={() => handleEdit(item)}
                disabled={isPending}
                className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 border border-slate-200 disabled:opacity-50"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(item.id)}
                disabled={isPending}
                className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 border border-red-100 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {filteredMenus.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2">restaurant_menu</span>
            <p>Belum ada menu dalam kategori ini</p>
          </div>
        )}
      </div>

       {/* Add/Edit Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
             <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
              <h3 className="font-bold text-lg text-slate-900">
                {editingItem ? "Edit Item Menu" : "Buat Item Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nama Item</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-primary focus:ring-4 focus:ring-primary/10" 
                    placeholder="e.g. Pad Thai" 
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Harga (IDR)</label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-primary focus:ring-4 focus:ring-primary/10" 
                    placeholder="0" 
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Kategori</label>
                <select 
                  value={formData.categoryId}
                  onChange={e => setFormData({...formData, categoryId: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-primary focus:ring-4 focus:ring-primary/10 bg-white"
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-500 uppercase">URL Gambar</label>
                 <input 
                   type="text" 
                   value={formData.image}
                   onChange={e => setFormData({...formData, image: e.target.value})}
                   className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-primary focus:ring-4 focus:ring-primary/10" 
                   placeholder="https://..." 
                 />
              </div>
              <div className="flex gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-2.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="flex-1 py-2.5 font-bold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors shadow-lg shadow-primary/25 disabled:opacity-50"
                >
                  {isPending ? "Menyimpan..." : "Simpan Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
