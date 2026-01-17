import { cn } from "@/lib/utils";

const categories = ["All Items", "Appetizers", "Main Course", "Drinks", "Dessert"];

export function CategoryTabs() {
  return (
    <div className="mb-8 border-b border-slate-200 flex gap-8 font-display">
      {categories.map((cat, idx) => {
        const isActive = idx === 0; // Mocking first as active
        return (
          <a
            key={cat}
            href="#"
            className={cn(
              "pb-4 text-sm font-medium transition-colors flex items-center gap-2",
              isActive
                ? "border-b-2 border-primary text-primary font-bold"
                : "text-slate-500 hover:text-primary"
            )}
          >
            {cat}
            {isActive && (
              <span className="bg-primary/10 px-2 py-0.5 rounded text-[10px]">42</span>
            )}
          </a>
        );
      })}
    </div>
  );
}
