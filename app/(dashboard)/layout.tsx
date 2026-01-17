import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { getSession } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-900">
      <Sidebar user={session} />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-white">
        <Header user={session} />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
