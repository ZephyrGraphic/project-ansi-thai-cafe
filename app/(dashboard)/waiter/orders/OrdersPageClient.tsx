"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createOrder } from "@/lib/actions/orders";
import { updateTableStatus } from "@/lib/actions/tables";
import type { Menu, Category, Table } from "@prisma/client";

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
  const [orderNotes, setOrderNotes] = useState("");

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

    startTransition(async () => {
      try {
        await createOrder({
          tableId: selectedTable,
          notes: orderNotes || undefined,
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
    <div className="flex h-full bg-slate-50 font-display">
      {/* Left Side - Menu Grid */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white px-6 py-4 border-b border-slate-200 shrink-0">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Buat Pesanan Baru</h2>
          
          {/* Table Selection */}
          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm font-bold text-slate-700">Meja:</label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-primary"
            >
              <option value="">Pilih Meja</option>
              {availableTables.map(table => (
                <option key={table.id} value={table.id}>
                  Meja {table.tableNo} ({table.capacity} kursi) - {table.zone === 'floor1' ? 'Ruang Utama' : 'Ruang AC'}
                </option>
              ))}
            </select>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                activeCategory === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Semua
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                  activeCategory === cat.id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </header>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMenus.map(menu => (
              <button
                key={menu.id}
                onClick={() => addToCart(menu)}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg hover:border-primary transition-all text-left"
              >
                {menu.image && (
                  <div 
                    className="w-full aspect-square rounded-lg bg-slate-100 mb-3 bg-cover bg-center"
                    style={{ backgroundImage: `url("${menu.image}")` }}
                  />
                )}
                <h3 className="font-bold text-slate-900 text-sm mb-1">{menu.name}</h3>
                <p className="text-xs text-slate-500 mb-2">{menu.category.name}</p>
                <p className="text-primary font-bold">Rp {menu.price.toLocaleString('id-ID')}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Cart */}
      <div className="w-96 bg-white border-l border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">Keranjang</h3>
          <p className="text-sm text-slate-500">{cart.length} item</p>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2">shopping_cart</span>
              <p>Keranjang kosong</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.menuId} className="bg-slate-50 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                      <p className="text-xs text-slate-500">Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.menuId, item.qty - 1)}
                        className="size-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="font-bold text-slate-900 w-6 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.menuId, item.qty + 1)}
                        className="size-7 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-dark"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Catatan (opsional)"
                    value={item.notes || ""}
                    onChange={(e) => updateItemNotes(item.menuId, e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                  <p className="text-right text-sm font-bold text-slate-900 mt-2">
                    Rp {(item.price * item.qty).toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Notes & Submit */}
        <div className="p-4 border-t border-slate-100">
          <textarea
            placeholder="Catatan pesanan (opsional)..."
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm mb-4 resize-none"
            rows={2}
          />
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold text-slate-900">Total</span>
            <span className="text-2xl font-black text-primary">
              Rp {totalAmount.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            onClick={handleSubmitOrder}
            disabled={isPending || !selectedTable || cart.length === 0}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Memproses..." : "Kirim Pesanan"}
          </button>
        </div>
      </div>
    </div>
  );
}
