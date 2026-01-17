"use client";

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
    <div className="flex flex-col h-full bg-white border-r border-slate-100 font-display">
      {/* Logo Area */}
      <div className="p-6 pb-2 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-xl bg-primary text-white shadow-sm">
            <span className="material-symbols-outlined font-bold">restaurant</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold leading-none tracking-tight text-slate-900">Thai Cafe</h1>
            <span className="text-xs text-slate-500 mt-1">
              {user ? getModuleLabel(user.role) : "Sistem POS"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                isActive
                  ? "bg-primary/10 text-primary-dark font-semibold border-primary/20 border"
                  : "text-slate-600 hover:bg-slate-50 hover:text-primary-dark"
              )}
            >
              <span className={cn("material-symbols-outlined", isActive ? "fill-1" : "")}>
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.title}</span>
              {item.badge && (
                <span className="ml-auto bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-100 shrink-0">
        <div className="mb-4 flex items-center gap-3 px-2">
          <div className="flex items-center justify-center size-9 rounded-full bg-primary text-white font-bold text-sm">
            {user?.name?.charAt(0) || user?.username?.charAt(0) || "?"}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-slate-900 truncate">
              {user?.name || user?.username || "Guest"}
            </span>
            <span className="text-xs text-slate-500 truncate">
              {user ? getRoleLabel(user.role) : "Tidak login"}
            </span>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 py-2.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          {isPending ? "Keluar..." : "Keluar"}
        </button>
      </div>
    </div>
  );
}
