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
    <aside className="hidden md:flex flex-col py-8 bg-surface-container-lowest border-r border-surface-variant shadow-[20px_0_40px_0_rgba(0,110,10,0.04)] z-50 w-[8%] min-w-[80px]">
      <SidebarContent user={user} />
    </aside>
  );
}
