"use client"; 

import { useState } from "react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  }).format(new Date());

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
      <header className="sticky top-0 z-40 flex h-24 shrink-0 items-center justify-between border-b border-[#dfd2bd]/70 bg-[#fffaf1]/82 px-5 font-headline shadow-[0_18px_50px_rgba(23,35,29,0.06)] backdrop-blur-xl md:px-8">
        <div className="flex items-center gap-4">
          <button 
            className="-ml-2 rounded-2xl p-3 text-[#063d2d] hover:bg-[#efe6d5] md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#b98c48]">
              {user?.role || "STAFF"} workspace
            </p>
            <h2 className="mt-1 text-2xl font-black leading-tight text-[#063d2d]">
              {getPageTitle()}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden rounded-2xl border border-[#dfd2bd]/80 bg-white/70 px-4 py-3 text-right sm:block">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#8a7a61]">
              Hari ini
            </p>
            <p className="text-sm font-black capitalize text-[#17231d]">
              {currentDate}
            </p>
          </div>
          <button className="grid size-12 place-items-center rounded-2xl border border-[#dfd2bd]/80 bg-white/70 text-[#063d2d] transition-colors hover:bg-[#efe6d5]">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>
          <div className="hidden min-w-[150px] rounded-2xl bg-[#063d2d] px-4 py-3 text-[#fff8e8] lg:block">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#f2c94c]">
              Operator
            </p>
            <p className="truncate text-sm font-black">
              {user?.name || user?.username || "Guest"}
            </p>
          </div>
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
          <div className="relative h-full w-[282px] bg-[#fffaf1] shadow-xl animate-in slide-in-from-left duration-200">
            <SidebarContent user={user} onLinkClick={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
