interface TableFiltersProps {
  activeFloor: string;
  onFloorChange: (floor: string) => void;
}

export function TableFilters({ activeFloor, onFloorChange }: TableFiltersProps) {
  return (
    <div className="px-8 py-6 flex flex-wrap items-center justify-between gap-4 shrink-0 font-display">
      <div className="flex items-center gap-4">
        {/* Floor Selection */}
        <div className="relative min-w-[240px]">
          <label className="block text-xs font-bold text-slate-400 mb-1 ml-1 uppercase tracking-tight">
            Lantai / Area
          </label>
          <div className="relative">
            <select 
              value={activeFloor}
              onChange={(e) => onFloorChange(e.target.value)}
              className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-800 py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium transition-all cursor-pointer"
            >
              <option value="all">Semua Lantai</option>
              <option value="floor1">Lantai 1 - Main Hall</option>
              <option value="floor2">Lantai 2 - AC Room</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <span className="material-symbols-outlined">expand_more</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden lg:flex items-center gap-4 ml-6 pl-6 border-l border-slate-100 h-10">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-primary"></span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tersedia</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-yellow-400"></span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Terisi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-red-500"></span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pembersihan</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg font-bold transition-all text-sm cursor-pointer">
          <span className="material-symbols-outlined text-lg text-primary-dark">filter_list</span>
          Filter
        </button>
        <button className="flex items-center gap-2 bg-primary text-white hover:bg-primary-dark px-5 py-2.5 rounded-lg font-bold shadow-md shadow-primary/20 transition-all text-sm cursor-pointer">
          <span className="material-symbols-outlined text-lg">add</span>
          Reservasi Baru
        </button>
      </div>
    </div>
  );
}
