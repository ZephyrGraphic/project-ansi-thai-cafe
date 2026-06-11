"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/auth";

type UserRole = "ADMIN" | "KASIR" | "WAITER" | "KITCHEN";

interface NavItem {
  title: string;
  icon: string;
  href: string;
  badge?: number;
}

interface SidebarContentProps {
  user?: {
    id: string;
    username: string;
    name: string | null;
    role: UserRole;
  } | null;
  onLinkClick?: () => void;
}

const waiterNavItems: NavItem[] = [
  { title: "Manajemen Meja", icon: "table_restaurant", href: "/waiter/tables" },
  { title: "Pesanan Aktif", icon: "receipt_long", href: "/waiter/orders" },
  { title: "Waiting List", icon: "group_add", href: "/waiter/queue" },
  { title: "Riwayat Pesanan", icon: "history", href: "/waiter/history" },
  { title: "Pengaturan", icon: "settings", href: "/waiter/settings" },
];

const adminNavItems: NavItem[] = [
  { title: "Dashboard", icon: "dashboard", href: "/admin" },
  { title: "Laporan Penjualan", icon: "monitoring", href: "/admin/sales" },
  { title: "Inventaris", icon: "inventory_2", href: "/admin/inventory" },
  { title: "Resep (BOM)", icon: "cooking", href: "/admin/recipes" },
  { title: "Manajemen Menu", icon: "menu_book", href: "/admin/menu" },
  { title: "Kategori Menu", icon: "category", href: "/admin/categories" },
  { title: "Manajemen Meja", icon: "table_restaurant", href: "/admin/tables" },
  { title: "Manajemen Member", icon: "card_membership", href: "/admin/members" },
  { title: "Akun Pengguna", icon: "manage_accounts", href: "/admin/users" },
];

const cashierNavItems: NavItem[] = [
  { title: "Pesanan Aktif", icon: "grid_view", href: "/cashier/orders" },
  { title: "Riwayat", icon: "history", href: "/cashier/history" },
  { title: "Ringkasan Harian", icon: "bar_chart", href: "/cashier/summary" },
  { title: "Pengaturan", icon: "settings", href: "/cashier/settings" },
];

const kitchenNavItems: NavItem[] = [
  { title: "Pesanan Saat Ini", icon: "dashboard", href: "/kitchen/board" },
  { title: "Selesai", icon: "check_circle", href: "/kitchen/completed" },
  { title: "Inventaris", icon: "inventory_2", href: "/kitchen/inventory" },
  { title: "Pengaturan", icon: "settings", href: "/kitchen/settings" },
];

const getRoleLabel = (role: UserRole) => {
  switch (role) {
    case "ADMIN": return "Manajer";
    case "KASIR": return "Kasir";
    case "WAITER": return "Pelayan";
    case "KITCHEN": return "Dapur";
    default: return role;
  }
};

const getModuleLabel = (role: UserRole) => {
  switch (role) {
    case "ADMIN": return "Modul Admin";
    case "KASIR": return "Dasbor Kasir";
    case "WAITER": return "Sistem POS";
    case "KITCHEN": return "Tampilan Dapur";
    default: return "Sistem POS";
  }
};

export function SidebarContent({ user, onLinkClick }: SidebarContentProps) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const isAdmin = pathname.startsWith("/admin");
  const isCashier = pathname.startsWith("/cashier");
  const isKitchen = pathname.startsWith("/kitchen");
  
  // Get nav items based on user role or path
  let navItems = waiterNavItems;
  if (user) {
    switch (user.role) {
      case "ADMIN": navItems = adminNavItems; break;
      case "KASIR": navItems = cashierNavItems; break;
      case "KITCHEN": navItems = kitchenNavItems; break;
      default: navItems = waiterNavItems;
    }
  } else {
    if (isAdmin) navItems = adminNavItems;
    if (isCashier) navItems = cashierNavItems;
    if (isKitchen) navItems = kitchenNavItems;
  }

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <div className="flex h-full flex-col bg-transparent p-5 font-headline text-on-surface">
      <div className="mb-6 rounded-[28px] border border-[#dfd2bd]/80 bg-white/70 p-4 shadow-[0_18px_45px_rgba(23,35,29,0.06)]">
        <div className="flex items-center gap-3">
          <div className="relative size-12 overflow-hidden rounded-2xl shadow-md">
            <Image src="/assets/thai-cafe-mark.svg" alt="Thai Cafe" fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#b98c48]">
              ANSI POS
            </p>
            <h1 className="text-lg font-black leading-tight text-[#063d2d]">
              Thai Cafe
            </h1>
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-[#063d2d] px-4 py-3 text-[#fff8e8]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#f2c94c]">
            {user ? getModuleLabel(user.role) : "Sistem POS"}
          </p>
          <p className="mt-1 truncate text-sm font-bold">
            {user?.name || user?.username || "Guest"}
          </p>
          <p className="text-xs text-white/65">
            {user ? getRoleLabel(user.role) : "Mode tamu"}
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto no-scrollbar">
        <div className="mb-3 px-2 text-[10px] font-black uppercase tracking-widest text-[#8a7a61]">
          Navigasi
        </div>
        <div className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-200",
                isActive
                  ? "bg-[#0a6b44] text-[#fff8e8] shadow-[0_16px_36px_rgba(10,107,68,0.2)]"
                  : "text-[#667064] hover:bg-[#efe6d5]/70 hover:text-[#063d2d]"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined grid size-9 place-items-center rounded-xl text-[22px]",
                  isActive ? "bg-white/16 text-[#f2c94c]" : "bg-white/70 text-[#0a6b44]"
                )}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="min-w-0 flex-1 truncate">
                {item.title}
              </span>
              
              {item.badge && (
                <span className="size-2 rounded-full bg-[#d9492f] ring-2 ring-white"></span>
              )}
            </Link>
          );
        })}
        </div>
      </nav>

      <div className="mt-6 border-t border-[#dfd2bd]/70 pt-5">
        <div className="mb-4 rounded-2xl bg-white/72 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#8a7a61]">
            Shift aktif
          </p>
          <div className="mt-2 flex items-center gap-3">
        <button 
          title={user?.name || user?.username || "Guest"}
              className="grid size-10 place-items-center rounded-full bg-[#efe6d5] text-sm font-black text-[#063d2d] shadow-sm"
        >
          {user?.name?.charAt(0) || user?.username?.charAt(0) || "?"}
        </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-[#17231d]">
                {user?.username || "guest"}
              </p>
              <p className="text-xs text-[#667064]">Siap melayani</p>
            </div>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          disabled={isPending}
          title="Keluar"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#d9492f]/20 bg-[#d9492f]/10 px-4 py-3 text-sm font-black text-[#b02500] transition-colors hover:bg-[#d9492f]/16 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          {isPending ? "Keluar..." : "Keluar"}
        </button>
      </div>
    </div>
  );
}
