import { getOrders } from "@/lib/actions/orders";
import WaiterHistoryClient from "./WaiterHistoryClient";

export default async function WaiterHistoryPage() {
  // Get all completed/paid orders
  const orders = await getOrders(["COMPLETED", "CANCELLED"]);

  return <WaiterHistoryClient orders={orders} />;
}
