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
    <div className="flex flex-col h-full bg-transparent font-headline text-on-surface">
      {/* Logo Area */}
      <div className="p-4 pb-6 flex justify-center shrink-0">
        <div className="flex items-center justify-center size-10 rounded-2xl bg-primary-container text-on-primary-container shadow-md">
          <span className="material-symbols-outlined font-black text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>grass</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar items-center py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex flex-col items-center justify-center transition-all duration-300 relative group w-full px-2",
                isActive
                  ? "text-primary border-r-4 border-primary scale-100 font-black"
                  : "text-outline hover:text-primary scale-95 active:scale-90"
              )}
            >
              <span className={cn("material-symbols-outlined mb-1", isActive ? "text-[26px]" : "text-[24px]")} style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {item.icon}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-center leading-tight">
                {/* Shorten title if needed, maybe just take the first word or break lines */}
                {item.title.split(' ')[0]}
              </span>
              
              {/* Optional indicator dot for badges */}
              {item.badge && (
                <div className="absolute top-0 right-3 size-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile / Logout */}
      <div className="mt-auto pt-6 pb-2 px-2 flex flex-col gap-4 items-center shrink-0 border-t border-surface-variant/30 mx-4">
        <button 
          title={user?.name || user?.username || "Guest"}
          className="flex items-center justify-center size-10 rounded-full bg-surface-container-high border-2 border-surface-variant text-on-surface-variant font-bold text-sm shadow-sm"
        >
          {user?.name?.charAt(0) || user?.username?.charAt(0) || "?"}
        </button>
        <button 
          onClick={handleLogout}
          disabled={isPending}
          title="Keluar"
          className="flex items-center justify-center p-2 rounded-xl text-error hover:bg-error-container hover:text-on-error-container transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </div>
    </div>
  );
}
