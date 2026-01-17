import { cn } from "@/lib/utils";
import Image from "next/image";

export interface MenuItemProps {
  id: string;
  name: string;
  price: string;
  image: string;
  isAvailable: boolean;
  isBestSeller?: boolean;
  isPopular?: boolean;
  isSoldOut?: boolean;
}

export function MenuCard({ item }: { item: MenuItemProps }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden group hover:shadow-lg transition-all">
      <div className="relative h-44">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className={cn(
            "object-cover group-hover:scale-105 transition-transform duration-500",
            item.isSoldOut && "grayscale-[0.5] opacity-80"
          )}
        />
        {item.isBestSeller && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-primary border border-primary/20">
            BEST SELLER
          </div>
        )}
        {item.isPopular && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-primary border border-primary/20">
            POPULAR
          </div>
        )}
        {item.isSoldOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
              SOLD OUT
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className={cn("font-bold", item.isSoldOut ? "text-slate-500" : "text-slate-900")}>
            {item.name}
          </h4>
          <button className="text-slate-400 hover:text-primary">
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
        </div>
        <p className={cn("font-bold mb-4", item.isSoldOut ? "text-slate-400" : "text-primary")}>
          {item.price}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className={cn("text-xs font-semibold", item.isAvailable ? "text-primary" : "text-slate-400")}>
            {item.isAvailable ? "Available" : "Unavailable"}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={item.isAvailable}
              readOnly
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
