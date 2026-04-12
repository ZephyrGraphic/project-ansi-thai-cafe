"use client";

import { useState } from "react";
import { createSelfOrder } from "@/lib/actions";
import {
  Minus,
  Plus,
  ShoppingBag,
  X,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function ClientOrderUI({
  tableId,
  tableNo,
  categories,
  menus,
  queueId,
}: {
  tableId: string;
  tableNo: number;
  categories: any[];
  menus: any[];
  queueId?: string;
}) {
  const [cart, setCart] = useState<
    { menuId: string; qty: number; notes: string }[]
  >([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [customerName, setCustomerName] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("tunai");

  const addToCart = (menuId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.menuId === menuId);
      if (existing) {
        return prev.map((item) =>
          item.menuId === menuId ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prev, { menuId, qty: 1, notes: "" }];
    });
  };

  const removeFromCart = (menuId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.menuId === menuId);
      if (existing && existing.qty > 1) {
        return prev.map((item) =>
          item.menuId === menuId ? { ...item, qty: item.qty - 1 } : item,
        );
      }
      return prev.filter((item) => item.menuId !== menuId);
    });
  };

  const updateItemNotes = (menuId: string, notes: string) => {
    setCart((prev) => 
      prev.map((item) => 
        item.menuId === menuId ? { ...item, notes } : item
      )
    );
  };

  const getQty = (menuId: string) =>
    cart.find((i) => i.menuId === menuId)?.qty || 0;

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalAmount = cart.reduce((sum, item) => {
    const menu = menus.find((m) => m.id === item.menuId);
    return sum + (menu?.price || 0) * item.qty;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || cart.length === 0) return;
    setLoading(true);
    try {
      const res = await createSelfOrder({
        tableId,
        customerName,
        queueId,
        notes: orderNotes + (paymentMethod !== "tunai" ? ` [Metode: ${paymentMethod}]` : ""),
        items: cart,
      });
      setCreatedOrderId(res.id);
      setSuccess(true);
      setCart([]);
      setIsCartOpen(false);
    } catch (error) {
      console.error(error);
      alert("Gagal membuat pesanan. Silakan coba lagi atau panggil pelayan.");
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS SCREEN
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface p-6 font-body">
        <div className="w-24 h-24 mb-6 bg-primary-container/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-3xl font-headline font-bold text-on-surface mb-2">Pesanan Diterima!</h2>
        <p className="text-on-surface-variant text-center mb-8 px-4">
          Terima kasih <span className="font-bold">{customerName}</span>, pesanan Anda sedang disiapkan oleh dapur.
        </p>
        <div className="bg-surface-container-lowest p-6 rounded-2xl w-full max-w-sm shadow-sm space-y-3 mb-8">
          <div className="flex justify-between border-b border-surface-variant pb-2">
            <span className="text-on-surface-variant font-medium">No. Meja</span>
            <span className="font-bold">{tableNo}</span>
          </div>
          <div className="flex justify-between border-b border-surface-variant pb-2">
            <span className="text-on-surface-variant font-medium">ID Pesanan</span>
            <span className="font-bold text-primary">{createdOrderId.slice(-6).toUpperCase()}</span>
          </div>
          <div className="pt-2 text-center text-sm text-outline">
            Silakan tunggu di meja Anda
          </div>
        </div>
        <button
          onClick={() => setSuccess(false)}
          className="px-8 py-3 rounded-full border border-primary text-primary font-bold active:scale-95 transition-transform"
        >
          PESAN LAGI
        </button>
      </div>
    );
  }

  // CART VIEW
  if (isCartOpen) {
    return (
      <div className="bg-surface text-on-surface min-h-screen pb-32 font-body selection:bg-primary-container">
        {/* TopAppBar */}
        <header className="w-full sticky top-0 z-40 bg-surface-bright flex justify-between items-center px-6 py-4 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsCartOpen(false)} className="tap-highlight-transparent active:scale-95 transition-transform text-primary">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-xl font-headline font-bold text-primary tracking-tight">KEMBALI MENU</h1>
          </div>
          <div className="flex items-center text-primary">
             <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
          </div>
        </header>

        <main className="px-6 py-6 max-w-md mx-auto">
          {/* Editorial Header */}
          <section className="mb-8">
            <h2 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight leading-tight">
              Keranjang <span className="text-primary">Makan</span> Anda
            </h2>
            <p className="font-body text-sm text-on-surface-variant mt-2">Pastikan pesanan Anda sudah sesuai selera.</p>
          </section>

          {/* Cart Items List */}
          <div className="space-y-6">
            {cart.map((item) => {
              const menu = menus.find((m) => m.id === item.menuId);
              if (!menu) return null;
              return (
                <div key={item.menuId} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
                  <div className="flex p-4 gap-4">
                    {menu.image ? (
                       <img src={menu.image} alt={menu.name} className="w-24 h-24 object-cover rounded-lg" />
                    ) : (
                       <div className="w-24 h-24 bg-surface-container rounded-lg flex items-center justify-center text-xs text-outline font-medium">No Img</div>
                    )}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-headline font-bold text-on-surface text-sm">{menu.name}</h3>
                          <span className="font-headline font-bold text-primary whitespace-nowrap">Rp {(menu.price * item.qty).toLocaleString("id-ID")}</span>
                        </div>
                        <input 
                           type="text" 
                           placeholder="Catatan..." 
                           value={item.notes || ""}
                           onChange={(e) => updateItemNotes(item.menuId, e.target.value)}
                           className="font-body text-xs text-on-surface-variant mt-2 italic leading-tight w-full bg-surface-container-low border-none rounded p-1 mb-1" 
                        />
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center bg-surface-container flex-shrink-0 rounded-full p-1">
                          <button onClick={() => removeFromCart(menu.id)} className="w-7 h-7 flex items-center justify-center text-primary bg-white rounded-full transition-transform active:scale-95 shadow-sm">
                            <span className="material-symbols-outlined text-[1rem]">remove</span>
                          </button>
                          <span className="w-8 text-center font-bold text-sm">{item.qty}</span>
                          <button onClick={() => addToCart(menu.id)} className="w-7 h-7 flex items-center justify-center text-on-primary bg-primary rounded-full transition-transform active:scale-95 shadow-sm">
                            <span className="material-symbols-outlined text-[1rem]">add</span>
                          </button>
                        </div>
                        <button onClick={() => {
                          const conf = window.confirm("Hapus item?");
                          if (conf) {
                             setCart(cart.filter(i => i.menuId !== menu.id));
                          }
                        }} className="text-error flex items-center gap-1 active:opacity-50 p-2">
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {cart.length === 0 && (
              <div className="bg-surface-container-low rounded-xl p-8 text-center text-on-surface-variant font-medium">
                Keranjang Anda masih kosong. Mari pesan sesuatu!
              </div>
            )}
          </div>

          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8 mt-8">
            <section>
              <label className="font-label text-sm font-semibold text-on-surface-variant block mb-2 px-1">Nama Pemesan</label>
              <div className="bg-surface-container-highest rounded-xl p-4 transition-all focus-within:ring-1 ring-primary flex items-center gap-3">
                <span className="material-symbols-outlined text-outline">person</span>
                <input 
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-sm font-body p-0 placeholder:text-outline-variant font-semibold" 
                  placeholder="Atas nama siapa?" 
                  type="text"
                />
              </div>
            </section>
            
            <section>
              <label className="font-label text-sm font-semibold text-on-surface-variant block mb-2 px-1">Meja</label>
              <div className="bg-surface-container-highest rounded-xl p-4 flex items-center gap-3">
                 <span className="material-symbols-outlined text-outline">table_restaurant</span>
                 <input className="w-full bg-transparent border-none focus:ring-0 text-sm font-body p-0" value={`Meja ${tableNo}`} disabled />
              </div>
            </section>

            <section>
              <label className="font-label text-sm font-semibold text-on-surface-variant block mb-2 px-1">Catatan Tambahan (Opsional)</label>
              <div className="bg-surface-container-highest rounded-xl p-4 transition-all focus-within:ring-1 ring-primary">
                <textarea 
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-sm font-body p-0 placeholder:text-outline-variant" 
                  placeholder="Contoh: Tolong segera dimasak, dan bawakan sendok..." 
                  rows={2}
                ></textarea>
              </div>
            </section>

            {/* Payment Method Toggle */}
            <section>
              <label className="font-label text-sm font-semibold text-on-surface-variant block mb-3 px-1">Metode Pembayaran</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setPaymentMethod("tunai")}
                  className={`flex items-center justify-center gap-2 py-4 rounded-xl border-2 transition-colors ${paymentMethod === 'tunai' ? 'bg-primary-container border-primary text-on-primary-container' : 'bg-surface-container-high border-transparent text-on-surface-variant'}`}
                >
                  <span className="material-symbols-outlined">payments</span>
                  <span className="font-headline font-bold text-sm">Tunai</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setPaymentMethod("qris")}
                  className={`flex items-center justify-center gap-2 py-4 rounded-xl border-2 transition-colors ${paymentMethod === 'qris' ? 'bg-primary-container border-primary text-on-primary-container' : 'bg-surface-container-high border-transparent text-on-surface-variant'}`}
                >
                  <span className="material-symbols-outlined">qr_code_scanner</span>
                  <span className="font-headline font-bold text-sm">QRIS</span>
                </button>
              </div>
            </section>
          </form>

          {/* Summary & Totals */}
          <section className="mt-8 mb-12 p-6 bg-surface-container-low rounded-2xl">
            <div className="flex justify-between items-center mb-2">
              <span className="font-body text-sm text-on-surface-variant">Subtotal</span>
              <span className="font-body text-sm font-bold">Rp {totalAmount.toLocaleString("id-ID")}</span>
            </div>
            <div className="border-t border-outline-variant/15 pt-4 flex justify-between items-center">
              <div className="flex flex-col">
                <span className="font-headline text-lg font-extrabold text-on-surface">Total Bayar</span>
              </div>
              <span className="font-headline text-2xl font-black text-primary">Rp {totalAmount.toLocaleString("id-ID")}</span>
            </div>
          </section>

          {/* Checkout Button Floating Style */}
          <div className="fixed bottom-0 left-0 w-full px-6 py-6 pb-8 bg-gradient-to-t from-surface to-transparent z-40 flex justify-center">
            <button 
              type="submit"
              form="checkout-form"
              disabled={loading || !customerName || cart.length === 0}
              className="w-full max-w-md bg-gradient-to-r from-primary to-primary-fixed text-on-primary font-headline font-extrabold py-5 rounded-full shadow-[0_12px_32px_rgba(0,107,10,0.25)] active:scale-[0.98] transition-transform uppercase tracking-wider flex items-center justify-center gap-3 disabled:opacity-75 disabled:active:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Sedang Memproses...
                </>
              ) : (
                <>
                  <span>PESAN & BAYAR</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </main>
      </div>
    );
  }

  // MENU VIEW
  const filteredCategories = categories.map(cat => ({
    ...cat,
    menus: menus.filter(m => m.categoryId === cat.id)
  })).filter(cat => cat.menus.length > 0);

  const displayedCategories = activeCategory === "all" ? filteredCategories : filteredCategories.filter(c => c.id === activeCategory);

  return (
    <div className="bg-surface font-body text-on-background min-h-screen selection:bg-primary-container pb-32">
      {/* TopAppBar */}
      <header className="w-full sticky top-0 z-40 bg-surface-bright flex justify-between items-center px-6 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary font-bold">restaurant_menu</span>
          <h1 className="font-headline font-bold text-xl tracking-tight text-primary">THAI CAFE</h1>
        </div>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-primary">search</span>
          <span className="font-bold text-sm bg-surface-container text-on-surface px-3 py-1 rounded-full">{tableNo}</span>
        </div>
      </header>

      <main className="pb-32">
        {/* Promo Banner / QR Button */}
        <section className="px-6 mt-6">
          <div className="w-full bg-surface-container-lowest rounded-2xl p-6 flex items-center gap-4 shadow-[0_12px_32px_rgba(0,0,0,0.04)] border border-surface-variant/30">
            <div className="w-14 h-14 rounded-full bg-primary-container/30 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>table_restaurant</span>
            </div>
            <div>
              <p className="font-body font-bold text-on-surface-variant text-xs uppercase tracking-widest mb-1">Meja Saat Ini</p>
              <h2 className="font-headline font-black text-2xl text-on-surface">Meja {tableNo}</h2>
            </div>
          </div>
        </section>

        {/* Sticky Category Tabs */}
        <nav className="sticky top-[68px] z-30 bg-surface/95 backdrop-blur-md mt-6 py-4 px-6 border-b border-outline-variant/10">
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            <button 
              onClick={() => setActiveCategory("all")}
              className={`flex-none px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${activeCategory === "all" ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`}
            >
              Semua
            </button>
            {filteredCategories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-none px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${activeCategory === cat.id ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </nav>

        {/* Menu List */}
        <section className="px-6 mt-6 space-y-8">
          {displayedCategories.map(category => (
            <div key={category.id} className="space-y-4">
              {activeCategory === "all" && (
                <h2 className="font-headline font-bold text-xl text-on-surface mb-2">{category.name}</h2>
              )}
              {category.menus.map((menu: any) => (
                <div key={menu.id} className="flex gap-4 items-center bg-surface-container-lowest p-4 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-outline-variant/10 group active:scale-[0.99] transition-transform">
                  <div className="w-[100px] h-[100px] rounded-xl overflow-hidden flex-none bg-surface-container">
                    {menu.image ? (
                       <img src={menu.image} alt={menu.name} className="w-full h-full object-cover" />
                    ) : (
                       <div className="w-full h-full flex flex-col items-center justify-center text-outline-variant">
                         <span className="material-symbols-outlined text-3xl">image</span>
                         <span className="text-[10px] font-bold mt-1">NO IMAGE</span>
                       </div>
                    )}
                  </div>
                  <div className="flex-grow flex flex-col justify-between h-[100px]">
                    <div>
                      <h3 className="font-headline font-bold text-on-surface text-base md:text-lg pr-2 leading-tight">{menu.name}</h3>
                      <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">{menu.description}</p>
                    </div>
                    <div className="flex justify-between items-end pb-1 mt-auto">
                      <span className="font-headline font-bold text-primary text-base">Rp {menu.price.toLocaleString("id-ID")}</span>
                      {getQty(menu.id) > 0 ? (
                        <div className="flex items-center gap-1.5 bg-surface-container rounded-full p-1">
                           <button onClick={() => removeFromCart(menu.id)} className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-primary shadow-sm">
                             <Minus className="w-3.5 h-3.5" />
                           </button>
                           <span className="font-bold text-xs w-4 text-center">{getQty(menu.id)}</span>
                           <button onClick={() => addToCart(menu.id)} className="w-6 h-6 flex items-center justify-center bg-primary rounded-full text-on-primary shadow-sm">
                             <Plus className="w-3.5 h-3.5" />
                           </button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(menu.id)} className="bg-primary-container text-on-primary-container px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-transform active:scale-90">
                          TAMBAH
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </section>
      </main>

      {/* Floating Action: Cart Summary */}
      {totalItems > 0 && (
        <div className="fixed bottom-[88px] right-6 z-40 animate-in slide-in-from-bottom-5">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="bg-gradient-to-br from-primary to-primary-fixed text-on-primary pl-6 pr-4 py-3 rounded-full flex items-center gap-4 shadow-[0_12px_32px_rgba(0,107,10,0.3)] active:scale-95 transition-transform"
          >
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-90">{totalItems} Item</span>
              <span className="text-sm font-black font-headline">Rp {totalAmount.toLocaleString("id-ID")}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
            </div>
          </button>
        </div>
      )}

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl px-4 pb-6 pt-3 flex justify-around items-center rounded-t-3xl shadow-[0_-12px_32px_rgba(0,0,0,0.06)] border-t border-surface-variant/20">
        <button className="flex flex-col items-center justify-center text-primary font-bold transition-transform duration-200 active:scale-95 gap-1">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-wider">Beranda</span>
        </button>
        <button onClick={() => { if(totalItems > 0) setIsCartOpen(true) }} className={`flex flex-col items-center justify-center transition-colors duration-200 active:scale-95 gap-1 ${totalItems > 0 ? 'text-on-surface' : 'text-outline'}`}>
          <div className="relative">
             <span className="material-symbols-outlined">shopping_cart</span>
             {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-error text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">{totalItems}</span>
             )}
          </div>
          <span className="font-body text-[10px] font-bold uppercase tracking-wider">Keranjang</span>
        </button>
        {/* Placeholder buttons for purely UI display based on user template */}
        <button className="flex flex-col items-center justify-center text-outline hover:text-primary transition-colors duration-200 active:scale-95 gap-1">
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-wider">Status</span>
        </button>
      </nav>
    </div>
  );
}
