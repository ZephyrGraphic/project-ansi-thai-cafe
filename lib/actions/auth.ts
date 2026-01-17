"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";

// Session cookie name
const SESSION_COOKIE = "thai-cafe-session";

// Session type
export interface SessionUser {
  id: string;
  username: string;
  name: string | null;
  role: UserRole;
}

// Login action
export async function login(username: string, password: string): Promise<{ success: boolean; error?: string; user?: SessionUser }> {
  const user = await prisma.user.findFirst({
    where: { username, password },
  });

  if (!user) {
    return { success: false, error: "Username atau password salah" };
  }

  // Create session
  const session: SessionUser = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
  };

  // Store session in cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return { success: true, user: session };
}

// Logout action
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}

// Get current session
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  
  if (!sessionCookie) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie.value) as SessionUser;
  } catch {
    return null;
  }
}

// Check if user is authenticated
export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

// Check if user has specific role
export async function requireRole(allowedRoles: UserRole[]): Promise<SessionUser> {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.role)) {
    redirect("/unauthorized");
  }
  return session;
}

