"use client";

export interface IngredientBOM {
  name: string;
  qty: string;
}

export interface RecipeProps {
  id: string;
  name: string;
  yields: string;
  cost: string;
  lastUpdated: string;
  image: string;
  ingredients: IngredientBOM[];
}

export function RecipeCard({ recipe }: { recipe: RecipeProps }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm font-display hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex gap-4">
          <div 
            className="w-24 h-24 rounded-lg bg-cover bg-center border border-slate-100" 
            style={{ backgroundImage: `url("${recipe.image}")` }}
          />
          <div className="flex flex-col">
            <h4 className="text-xl font-bold text-slate-900">{recipe.name}</h4>
            <p className="text-sm text-slate-500">Yields: {recipe.yields}</p>
            <div className="mt-2 flex items-center gap-4">
              <span className="text-sm font-bold text-primary-text">Cost: {recipe.cost}</span>
              <span className="text-xs text-slate-400">{recipe.lastUpdated}</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 min-w-[300px]">
          <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Bill of Materials (BOM)</h5>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {recipe.ingredients.map((ing, idx) => (
              <div key={idx} className="flex justify-between text-sm py-1 border-b border-slate-50">
                <span className="text-slate-700">{ing.name}</span>
                <span className="font-bold text-primary-text">{ing.qty}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button className="px-4 py-2 text-xs font-bold border border-primary text-primary-text rounded-lg hover:bg-primary/5 transition-colors">
            Edit Recipe
          </button>
          <button className="px-4 py-2 text-xs font-bold bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
            Calculate Margin
          </button>
        </div>
      </div>
    </div>
  );
}
