import { getOrders } from "@/lib/actions/orders";
import { getMembers } from "@/lib/actions/members";
import CashierPageClient from "./CashierPageClient";

export default async function CashierOrdersPage() {
  // Get orders that need payment (SERVED status)
  const [activeOrders, members] = await Promise.all([
    getOrders(["PENDING", "PREPARING", "READY", "SERVED"]),
    getMembers(),
  ]);
  
  return <CashierPageClient orders={activeOrders} members={members} />;
}
