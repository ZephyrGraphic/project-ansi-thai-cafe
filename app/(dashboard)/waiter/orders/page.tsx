import { getMenus, getCategories } from "@/lib/actions/menu";
import { getTables } from "@/lib/actions/tables";
import OrdersPageClient from "./OrdersPageClient";

export default async function OrdersPage() {
  const [menus, categories, tables] = await Promise.all([
    getMenus(),
    getCategories(),
    getTables(),
  ]);

  return <OrdersPageClient menus={menus} categories={categories} tables={tables} />;
}
