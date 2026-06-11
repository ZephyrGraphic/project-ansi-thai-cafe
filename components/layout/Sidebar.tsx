"use client";

import type { UserRole } from "@prisma/client";
import { SidebarContent } from "./SidebarContent";

interface SidebarProps {
  user?: {
    id: string;
    username: string;
    name: string | null;
    role: UserRole;
  } | null;
}

export function Sidebar({ user }: SidebarProps) {
  return (
    <aside className="hidden md:flex w-[264px] min-w-[264px] flex-col border-r border-[#dfd2bd]/80 bg-[#fffaf1]/92 shadow-[24px_0_70px_rgba(23,35,29,0.08)] backdrop-blur-xl z-50">
      <SidebarContent user={user} />
    </aside>
  );
}
