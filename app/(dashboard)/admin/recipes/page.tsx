import { getMenus, getCategories } from "@/lib/actions/menu";
import { getIngredients } from "@/lib/actions/inventory";
import RecipesPageClient from "./RecipesPageClient";

export default async function RecipesPage() {
  const [menus, categories, ingredients] = await Promise.all([
    getMenus(),
    getCategories(),
    getIngredients(),
  ]);

  return (
    <RecipesPageClient
      menus={menus}
      categories={categories}
      ingredients={ingredients}
    />
  );
}
