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
    <div className="botanical-page flex h-screen w-full overflow-hidden font-headline text-on-surface">
      <Sidebar user={session} />
      <main className="relative flex h-screen flex-1 flex-col overflow-hidden">
        <Header user={session} />
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
