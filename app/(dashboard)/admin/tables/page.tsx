import { getTables } from "@/lib/actions/tables";
import TablesPageClient from "./TablesPageClient";

export default async function TablesPage() {
  const tables = await getTables();

  return <TablesPageClient tables={tables} />;
}
