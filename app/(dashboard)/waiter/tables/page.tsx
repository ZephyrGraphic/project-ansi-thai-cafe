import { getTables } from "@/lib/actions/tables";
import { getActiveOrders } from "@/lib/actions/orders";
import TablesPageClient from "./TablesPageClient";

export default async function TablesPage() {
  const [tables, activeOrders] = await Promise.all([
    getTables(),
    getActiveOrders(),
  ]);

  return <TablesPageClient initialTables={tables} initialOrders={activeOrders} />;
}
