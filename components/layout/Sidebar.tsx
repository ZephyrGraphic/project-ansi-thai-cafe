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
    <aside className="hidden md:flex w-64 flex-col justify-between z-20 shrink-0 h-screen">
      <SidebarContent user={user} />
    </aside>
  );
}
