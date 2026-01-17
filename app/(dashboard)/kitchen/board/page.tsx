import { getKitchenOrders } from "@/lib/actions/orders";
import KitchenBoardClient from "./KitchenBoardClient";

export default async function KitchenBoardPage() {
  const orders = await getKitchenOrders();
  return <KitchenBoardClient initialOrders={orders} />;
}
