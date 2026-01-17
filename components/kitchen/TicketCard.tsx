import { cn } from "@/lib/utils";

export type OrderStatus = "received" | "in-progress" | "ready" | "late";

export interface TicketItem {
  name: string;
  qty: number;
  type: string;
}

export interface TicketProps {
  id: string;
  orderNumber: string;
  table: string;
  status: OrderStatus;
  timer: string;
  items: TicketItem[];
  note?: string;
  priority?: boolean;
}

export function TicketCard({ ticket }: { ticket: TicketProps }) {
  const isReceived = ticket.status === "received";
  const isInProgress = ticket.status === "in-progress";
  const isLate = ticket.status === "late";
  const isPriority = ticket.priority || isLate;

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border bg-white overflow-hidden shadow-md hover:shadow-lg transition-shadow font-display",
        isLate ? "border-red-200" : "border-slate-200"
      )}
    >
      {isLate && <div className="w-full h-1 bg-red-500"></div>}
      
      {/* Header */}
      <div
        className={cn(
          "p-4 border-b flex justify-between items-center",
          isLate ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100"
        )}
      >
        <div className="flex items-center gap-2">
          {isInProgress && (
            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-orange-200">
              In Progress
            </span>
          )}
          {isReceived && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-blue-200">
              Received
            </span>
          )}
          {isLate && (
            <span className="bg-red-500 text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
              Late
            </span>
          )}
          <h3 className="text-slate-900 font-bold text-lg">
            {ticket.orderNumber} — {ticket.table}
          </h3>
        </div>
        <span
          className={cn(
            "font-mono text-sm font-bold flex items-center gap-1",
            isLate ? "text-red-600" : isInProgress ? "text-orange-600" : "text-slate-500"
          )}
        >
          <span className="material-symbols-outlined text-sm">schedule</span> {ticket.timer}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        <ul className="flex flex-col gap-3">
          {ticket.items.map((item, idx) => (
            <li key={idx} className="flex justify-between items-start">
              <div className="flex gap-3">
                <span className="bg-green-100 text-green-700 w-6 h-6 flex items-center justify-center rounded font-bold text-xs border border-green-200">
                  {item.qty}
                </span>
                <span className="text-slate-900 font-semibold">{item.name}</span>
              </div>
              <span className="text-slate-400 text-xs font-medium">{item.type}</span>
            </li>
          ))}
        </ul>

        {ticket.note && (
          <div
            className={cn(
              "border p-3 rounded-lg",
              isPriority ? "bg-red-50 border-red-100" : "bg-orange-50 border-orange-100"
            )}
          >
            <p
              className={cn(
                "text-xs font-bold uppercase tracking-tighter mb-1 flex items-center gap-1",
                isPriority ? "text-red-600" : "text-orange-700"
              )}
            >
              <span className="material-symbols-outlined text-xs">
                {isPriority ? "priority_high" : "info"}
              </span>{" "}
              {isPriority ? "Critical Note" : "Special Instruction"}
            </p>
            <p className="text-slate-900 text-sm">{ticket.note}</p>
          </div>
        )}
      </div>

      {/* Action */}
      <div className="p-4 mt-auto">
        <button className="w-full bg-primary hover:bg-green-600 text-white font-black py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer">
          <span>MARK AS READY</span>
          <span className="material-symbols-outlined">check_circle</span>
        </button>
      </div>
    </div>
  );
}
