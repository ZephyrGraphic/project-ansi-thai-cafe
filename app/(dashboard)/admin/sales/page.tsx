import { getDailyPayments, getPaymentSummary } from "@/lib/actions/payments";
import { getOrders } from "@/lib/actions/orders";
import SalesPageClient from "./SalesPageClient";

export default async function SalesPage() {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const [dailyPayments, monthlySummary, allOrders] = await Promise.all([
    getDailyPayments(today),
    getPaymentSummary(startOfMonth, today),
    getOrders("COMPLETED"),
  ]);

  return (
    <SalesPageClient 
      dailyPayments={dailyPayments}
      monthlySummary={monthlySummary}
      paidOrders={allOrders}
    />
  );
}
