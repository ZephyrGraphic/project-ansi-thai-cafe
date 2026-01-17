import { getIngredients } from "@/lib/actions/inventory";
import InventoryPageClient from "./InventoryPageClient";

export default async function InventoryPage() {
  const ingredients = await getIngredients();
  return <InventoryPageClient initialIngredients={ingredients} />;
}
