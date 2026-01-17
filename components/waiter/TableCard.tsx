import { cn } from "@/lib/utils";

export type TableStatus = "available" | "occupied" | "dirty" | "reserved";

export interface TableProps {
  id: string;
  number: string;
  name?: string;
  status: TableStatus;
  seats: number;
  maxSeats: number;
  orderId?: string;
  timer?: string;
  amount?: string;
  reservationTime?: string;
}

export function TableCard({ table }: { table: TableProps }) {
  const isAvailable = table.status === "available";
  const isOccupied = table.status === "occupied";
  const isDirty = table.status === "dirty";
  const isReserved = table.status === "reserved";

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border p-5 shadow-sm hover:shadow-md transition-all cursor-pointer bg-white",
        isAvailable && "border-primary/40 hover:border-primary",
        isOccupied && "border-yellow-200 overflow-hidden",
        isDirty && "border-red-100",
        isReserved && "border-slate-200 bg-slate-50"
      )}
    >
      {/* Status Bar for Occupied */}
      {isOccupied && <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>}

      {/* Header */}
      <div className={cn("flex justify-between items-start", isOccupied && "pl-2")}>
        {isAvailable && (
          <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest border border-green-200">
            Tersedia
          </span>
        )}
        {isOccupied && (
          <span className="px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-yellow-500 animate-pulse"></span> Makan
          </span>
        )}
        {isDirty && (
          <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 text-[10px] font-black uppercase tracking-widest">
            Kotor
          </span>
        )}
        {isReserved && (
          <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 border border-slate-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">calendar_clock</span> Dipesan
          </span>
        )}

        {/* Action/Info Right Side */}
        {isAvailable && (
          <button className="text-slate-300 hover:text-slate-600">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        )}
        {isOccupied && <span className="text-[10px] font-bold text-slate-400">{table.orderId}</span>}
        {isDirty && (
          <button className="size-8 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-lg">cleaning_services</span>
          </button>
        )}
        {isReserved && <span className="text-xs font-bold text-slate-900">{table.reservationTime}</span>}
      </div>

      {/* Main Content (Number/Timer) */}
      <div className={cn("flex flex-col items-center justify-center py-4", isOccupied && "py-2 pl-2")}>
        <h3
          className={cn(
            "text-4xl font-black transition-colors",
            isAvailable && "text-slate-900 group-hover:text-primary-dark",
            isOccupied && "text-slate-900",
            isDirty && "text-slate-300",
            isReserved && "text-slate-400"
          )}
        >
          {table.number}
        </h3>
        
        {isAvailable && table.name && (
          <span className="text-xs text-slate-500 mt-1 uppercase font-semibold tracking-wide">
            {table.name}
          </span>
        )}
        
        {isOccupied && (
          <div className="flex items-center gap-1.5 mt-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
            <span className="material-symbols-outlined text-sm">timer</span>
            <span className="text-xs font-black font-mono">{table.timer}</span>
          </div>
        )}

        {isDirty && (
          <span className="text-[10px] text-red-500 font-black mt-1 uppercase tracking-widest">
            Butuh Perhatian
          </span>
        )}

        {isReserved && (
          <span className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">
            {table.name || "Dipesan"}
          </span>
        )}
      </div>

      {/* Footer (Seats/Price) */}
      {isOccupied ? (
        <div className="flex items-center justify-between gap-2 text-slate-500 mt-1 pl-2">
          <div className="flex items-center gap-1 text-xs font-bold">
            <span className="material-symbols-outlined text-base">person</span> {table.seats}/{table.maxSeats}
          </div>
          <span className="text-xs font-bold">{table.amount}</span>
        </div>
      ) : (
        <div className={cn(
            "flex items-center justify-center gap-2 text-slate-600 py-2 rounded-lg",
            isReserved ? "bg-white border border-slate-100" : "bg-slate-50"
        )}>
          <span className={cn("material-symbols-outlined text-lg", isAvailable ? "text-primary" : "")}>group</span>
          <span className="font-bold text-sm">{table.maxSeats} Kursi</span>
        </div>
      )}
    </div>
  );
}
