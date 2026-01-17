import { getOrders } from "@/lib/actions/orders";
import { getPaymentSummary } from "@/lib/actions/payments";
import { getTables } from "@/lib/actions/tables";
import { getIngredients } from "@/lib/actions/inventory";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const [activeOrders, tables, ingredients, todaySummary] = await Promise.all([
    getOrders(["PENDING", "PREPARING", "READY", "SERVED"]),
    getTables(),
    getIngredients(),
    getPaymentSummary(startOfDay, today),
  ]);

  return (
    <AdminDashboardClient 
      activeOrders={activeOrders}
      tables={tables}
      ingredients={ingredients}
      todaySummary={todaySummary}
    />
  );
}
