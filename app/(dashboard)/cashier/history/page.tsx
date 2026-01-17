import { getOrders } from "@/lib/actions/orders";
import { CashierHistoryClient } from "./CashierHistoryList";

export default async function CashierHistoryPage() {
  const paidOrders = await getOrders("COMPLETED");

  return <CashierHistoryClient orders={paidOrders} />;
}
