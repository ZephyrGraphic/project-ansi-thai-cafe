import { getCompletedOrders } from "@/lib/actions/orders";
import { CompletedOrdersClient } from "./CompletedOrdersList";

export default async function CompletedOrdersPage() {
  const orders = await getCompletedOrders();
  return <CompletedOrdersClient orders={orders} />;
}
