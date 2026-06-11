"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createOrder } from "@/lib/actions/orders";
import { updateTableStatus } from "@/lib/actions/tables";
import type { Menu, Category, Table } from "@prisma/client";
import { Plus, Minus } from "lucide-react";

type MenuWithCategory = Menu & { category: Category };
type TableWithOrders = Table & { orders: unknown[] };

interface OrdersPageClientProps {
  menus: MenuWithCategory[];
  categories: Category[];
  tables: TableWithOrders[];
}

interface CartItem {
  menuId: string;
  name: string;
  price: number;
  qty: number;
  notes?: string;
}

export default function OrdersPageClient({ menus, categories, tables }: OrdersPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedTable = searchParams.get("table");

  const [isPending, startTransition] = useTransition();
  const [selectedTable, setSelectedTable] = useState(preselectedTable || "");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [pax, setPax] = useState<number>(1);
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("tunai");

  const availableTables = tables.filter(t => t.status === "AVAILABLE" || t.id === preselectedTable);
  const filteredMenus = activeCategory === "all" 
    ? menus.filter(m => m.isAvailable)
    : menus.filter(m => m.isAvailable && m.categoryId === activeCategory);

  const addToCart = (menu: MenuWithCategory) => {
    const existing = cart.find(item => item.menuId === menu.id);
    if (existing) {
      setCart(cart.map(item => 
        item.menuId === menu.id 
          ? { ...item, qty: item.qty + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        menuId: menu.id,
        name: menu.name,
        price: menu.price,
        qty: 1,
      }]);
    }
  };

  const updateQty = (menuId: string, qty: number) => {
    if (qty <= 0) {
      setCart(cart.filter(item => item.menuId !== menuId));
    } else {
      setCart(cart.map(item => 
        item.menuId === menuId ? { ...item, qty } : item
      ));
    }
  };

  const updateItemNotes = (menuId: string, notes: string) => {
    setCart(cart.map(item => 
      item.menuId === menuId ? { ...item, notes } : item
    ));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleSubmitOrder = async () => {
    if (!selectedTable || cart.length === 0) return;

    const table = availableTables.find(t => t.id === selectedTable);
    if (table && pax > table.capacity) {
      alert(`Kapasitas Meja ${table.tableNo} maksimal ${table.capacity} orang, tidak muat untuk ${pax} orang!`);
      return;
    }

    startTransition(async () => {
      try {
        await createOrder({
          tableId: selectedTable,
          notes: `[Pax: ${pax} Orang] ` + orderNotes + (paymentMethod !== "tunai" ? ` [Metode: ${paymentMethod}]` : ""),
          items: cart.map(item => ({
            menuId: item.menuId,
            qty: item.qty,
            notes: item.notes,
          })),
        });

        await updateTableStatus(selectedTable, "OCCUPIED");
        router.push("/waiter/tables");
      } catch (error) {
        console.error("Failed to create order:", error);
      }
    });
  };

  return (
    <div className="w-full h-full flex flex-row">
        {/* Left Side: Menu Grid (70%) */}
        <section className="w-[65%] lg:w-[70%] py-8 px-6 lg:px-10 overflow-y-auto no-scrollbar bg-surface-bright flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface">Menu <span className="text-primary italic">Pilihan</span></h1>
            {/* Table Selector Relocated */}
            <div className="flex items-center gap-4 border border-surface-variant bg-surface-container-low rounded-xl px-4 py-2 w-max">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Meja:</span>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm font-bold min-w-[150px] text-on-surface p-0 cursor-pointer"
              >
                <option value="">-- Pilih --</option>
                {availableTables.map(table => (
                  <option key={table.id} value={table.id}>
                    Meja {table.tableNo} ({table.capacity} kursi)
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-0 flex-1">
            {/* Category Tabs */}
            <div className="flex gap-4 mb-10 overflow-x-auto hide-scrollbar pb-2">
              <button 
                onClick={() => setActiveCategory("all")}
                className={`px-8 py-3 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all ${activeCategory === "all" ? "bg-primary-container text-on-primary-container shadow-lg shadow-primary/20" : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container"}`}
              >
                Semua
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-8 py-3 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat.id ? "bg-primary-container text-on-primary-container shadow-lg shadow-primary/20" : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container"}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 gap-y-10">
              {filteredMenus.map(menu => (
                <div key={menu.id} className="group bg-surface-container-lowest rounded-2xl overflow-visible transition-all duration-500 hover:-translate-y-2 border border-surface-variant/30 flex flex-col h-full">
                  <div className="relative h-44 -mt-6 mx-4 shrink-0">
                    {menu.image ? (
                       <Image src={menu.image} alt={menu.name} fill sizes="(min-width: 1024px) 24vw, 40vw" className="rounded-2xl object-cover shadow-xl shadow-surface-variant/50" />
                    ) : (
                       <div className="w-full h-full bg-surface-container rounded-2xl shadow-md flex items-center justify-center text-outline-variant font-bold text-sm">NO IMAGE</div>
                    )}
                    <div className="absolute top-4 left-4 bg-primary-container/90 backdrop-blur-md px-3 py-1 rounded-sm text-[10px] font-bold text-on-primary-container uppercase tracking-tighter">
                       Tersedia
                    </div>
                  </div>
                  <div className="p-5 pt-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0"></div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-outline line-clamp-1">{menu.category.name}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-3 tracking-tight text-on-surface leading-tight line-clamp-2">{menu.name}</h3>
                    
                    <div className="mt-auto pt-4 flex flex-col gap-4">
                      <span className="text-xl font-extrabold tracking-tighter text-on-surface">Rp {menu.price.toLocaleString('id-ID')}</span>
                      <button 
                         onClick={() => addToCart(menu as MenuWithCategory)}
                         className="w-full bg-gradient-to-br from-primary to-primary-fixed text-on-primary px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-md hover:shadow-primary/30 active:scale-95 transition-all text-center"
                      >
                         TAMBAHKAN
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Side: Fixed Cart Panel (30%) */}
        <section className="w-[35%] lg:w-[30%] bg-surface-container-lowest h-full flex flex-col shadow-[-20px_0_60px_-15px_rgba(0,110,10,0.03)] border-l border-surface-variant/50 relative">
          <div className="p-6 lg:p-8 flex-1 flex flex-col h-full">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">Keranjang</h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary-container/10 px-3 py-1 rounded-full">{cart.reduce((a, b) => a + b.qty, 0)} Item</span>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 lg:space-y-8 min-h-0">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-outline opacity-50">
                   <span className="material-symbols-outlined text-5xl mb-4">shopping_basket</span>
                   <p className="font-bold">Belum ada item.</p>
                </div>
              ) : (
                cart.map(item => {
                   const menu = menus.find(m => m.id === item.menuId);
                   return (
                      <div key={item.menuId} className="group">
                        <div className="flex items-start justify-between mb-3">
                           <div className="flex items-center gap-3">
                              <div className="relative w-14 h-14 rounded-lg bg-surface-container overflow-hidden shrink-0">
                                 {menu?.image ? (
                                    <Image src={menu.image} alt={item.name} fill sizes="56px" className="object-cover" />
                                 ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-surface-container-high text-[10px] font-bold text-outline-variant">IMG</div>
                                 )}
                              </div>
                              <div>
                                 <h4 className="text-sm font-bold tracking-tight text-on-surface leading-snug pr-2">{item.name}</h4>
                                 <p className="text-xs text-outline font-medium mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                              </div>
                           </div>
                           <div className="flex flex-col items-end gap-2">
                              <div className="flex items-center gap-2 bg-surface-container-low rounded-full p-1 border border-surface-variant">
                                 <button onClick={() => updateQty(item.menuId, item.qty - 1)} className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-primary shadow-sm hover:scale-110 active:scale-90 transition-transform">
                                    <Minus className="w-3.5 h-3.5" />
                                 </button>
                                 <span className="text-xs font-black w-4 text-center">{item.qty}</span>
                                 <button onClick={() => updateQty(item.menuId, item.qty + 1)} className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-sm hover:scale-110 active:scale-90 transition-transform">
                                    <Plus className="w-3.5 h-3.5" />
                                 </button>
                              </div>
                           </div>
                        </div>
                        <input 
                           type="text" 
                           placeholder="Catatan..." 
                           value={item.notes || ""}
                           onChange={(e) => updateItemNotes(item.menuId, e.target.value)}
                           className="w-full bg-surface-container-low border border-transparent focus:border-outline-variant rounded-lg px-3 py-1.5 text-xs font-medium placeholder:text-outline-variant transition-colors"
                        />
                      </div>
                   )
                })
              )}
            </div>

            {/* Footer Section */}
            <div className="mt-6 pt-6 shrink-0 bg-surface-container-lowest">
               <div className="flex gap-4 mb-5">
                 <textarea 
                    placeholder="Catatan pesanan umum..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="flex-1 bg-surface-container-low border border-surface-variant rounded-xl px-4 py-3 text-xs font-medium resize-none shadow-inner focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    rows={2}
                 />
                 <div className="w-[100px] shrink-0">
                    <label className="block text-[10px] font-bold text-outline uppercase tracking-widest mb-1.5 px-1">Orang (Pax)</label>
                    <div className="bg-surface-container-low border border-surface-variant rounded-xl px-3 py-[9px] flex items-center shadow-inner focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                       <span className="material-symbols-outlined text-outline text-[16px] mr-2">group</span>
                       <input 
                         type="number"
                         min="1"
                         value={pax || ""}
                         onChange={(e) => setPax(parseInt(e.target.value) || 0)}
                         className="w-full bg-transparent border-none text-xs font-bold text-center p-0 outline-none focus:ring-0 focus:outline-none"
                       />
                    </div>
                 </div>
               </div>
               <div className="mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2 block">Metode Pembayaran</span>
                  <div className="grid grid-cols-2 gap-2">
                     <button onClick={() => setPaymentMethod("tunai")} className={`flex items-center justify-center gap-1.5 py-3 rounded-xl border transition-all ${paymentMethod === 'tunai' ? 'bg-primary-container/20 text-primary border-primary' : 'bg-surface-container text-outline border-transparent'}`}>
                        <span className="material-symbols-outlined text-[1rem]">payments</span>
                        <span className="text-xs font-bold">Tunai</span>
                     </button>
                     <button onClick={() => setPaymentMethod("qris")} className={`flex items-center justify-center gap-1.5 py-3 rounded-xl border transition-all ${paymentMethod === 'qris' ? 'bg-primary-container/20 text-primary border-primary' : 'bg-surface-container text-outline border-transparent'}`}>
                        <span className="material-symbols-outlined text-[1rem]">qr_code_2</span>
                        <span className="text-xs font-bold">QRIS</span>
                     </button>
                  </div>
               </div>
               
               <div className="pt-5 border-t border-dashed border-outline-variant space-y-2 mb-6">
                  <div className="flex justify-between text-xs font-medium text-outline">
                     <span>Subtotal</span>
                     <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1">
                     <span className="text-sm font-bold uppercase tracking-tighter text-on-surface">Total Bayar</span>
                     <span className="text-3xl font-black tracking-tighter text-primary">Rp {totalAmount.toLocaleString('id-ID')}</span>
                  </div>
               </div>

               <button 
                  onClick={handleSubmitOrder}
                  disabled={isPending || !selectedTable || cart.length === 0}
                  className="w-full py-5 rounded-xl bg-gradient-to-r from-primary to-primary-fixed text-on-primary font-black text-xs uppercase tracking-[0.2em] shadow-[0_12px_24px_-8px_rgba(50,205,50,0.4)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
               >
                  {isPending ? "MEMPROSES..." : "PROSES PESANAN"}
               </button>
            </div>
          </div>
        </section>
    </div>
  );
}
