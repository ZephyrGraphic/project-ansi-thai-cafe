"use client"; 

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { SidebarContent } from "./SidebarContent";

interface HeaderProps {
  user?: {
    id: string;
    username: string;
    name: string | null;
    role: UserRole;
  } | null;
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const now = new Date();
    setCurrentDate(`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`);
  }, []);

  const getPageTitle = () => {
     if (pathname.includes("tables")) return "Manajemen Meja";
     if (pathname.includes("orders")) return "Pesanan Aktif";
     if (pathname.includes("menu")) return "Manajemen Menu";
     if (pathname.includes("inventory")) return "Stok & Inventaris";
     if (pathname.includes("sales")) return "Laporan Penjualan";
     if (pathname.includes("users")) return "Akun Pengguna";
     if (pathname.includes("board")) return "Pesanan Dapur";
     if (pathname.includes("summary")) return "Ringkasan Harian";
     return "Dasbor";
  };

  return (
    <>
      <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-8 shrink-0 font-display">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-lg"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 line-clamp-1">{getPageTitle()}</h2>
            <p className="text-sm text-slate-500 hidden sm:block">
              {currentDate || "Loading..."} • {user?.name || user?.username || "Guest"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {/* Placeholder for future header items */}
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Drawer */}
          <div className="relative w-64 h-full bg-white shadow-xl animate-in slide-in-from-left duration-200">
            <SidebarContent user={user} onLinkClick={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
