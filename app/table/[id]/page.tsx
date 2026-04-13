import { getCategories, getMenus, getTableById } from "@/lib/actions";
import { notFound } from "next/navigation";
import ClientOrderUI from "./ClientOrderUI";
import { Coffee } from "lucide-react";

export default async function TableOrderingPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ queueId?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const table = await getTableById(params.id);
  if (!table) return notFound();

  const categories = await getCategories();
  const menus = await getMenus();

  // Only show available categories & menus
  const activeCategories = categories.filter((c) => c.isAvailable);
  const activeMenus = menus.filter((m) => m.isAvailable);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <main className="flex-1 w-full m-0 p-0">
        <ClientOrderUI
          tableId={table.id}
          tableNo={table.tableNo}
          tableCapacity={table.capacity}
          categories={activeCategories}
          menus={activeMenus}
          queueId={searchParams.queueId}
        />
      </main>
    </div>
  );
}
