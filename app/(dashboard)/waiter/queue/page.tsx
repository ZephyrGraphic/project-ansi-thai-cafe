import { getActiveQueues } from "@/lib/actions";
import QueueClient from "./QueueClient";

export default async function WaiterQueuePage() {
  const queues = await getActiveQueues();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Antrean (Waiting List)
        </h1>
        <p className="text-muted-foreground">
          Kelola pelanggan yang sedang menunggu meja kosong.
        </p>
      </div>

      <QueueClient initialQueues={queues} />
    </div>
  );
}
