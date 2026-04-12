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
    <div className="flex h-screen w-full bg-surface-container font-headline text-on-surface m-0 p-0 overflow-hidden">
      <Sidebar user={session} />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-surface-bright">
        <Header user={session} />
        <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
          {children}
        </div>
      </main>
    </div>
  );
}
