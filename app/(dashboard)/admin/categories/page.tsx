import { getCategoriesWithMenuCount } from "@/lib/actions/menu";
import CategoriesPageClient from "./CategoriesPageClient";

export default async function CategoriesPage() {
  const categories = await getCategoriesWithMenuCount();

  return <CategoriesPageClient categories={categories} />;
}
