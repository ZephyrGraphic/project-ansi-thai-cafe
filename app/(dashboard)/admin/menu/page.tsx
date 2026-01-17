import { getMenus, getCategories } from "@/lib/actions/menu";
import MenuPageClient from "./MenuPageClient";

export default async function MenuPage() {
  const [menus, categories] = await Promise.all([
    getMenus(),
    getCategories(),
  ]);

  return <MenuPageClient initialMenus={menus} categories={categories} />;
}
