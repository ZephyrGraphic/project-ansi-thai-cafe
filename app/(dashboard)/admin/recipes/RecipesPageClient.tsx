"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getRecipesByMenu,
  addRecipeIngredient,
  removeRecipeIngredient,
  updateRecipeIngredient,
} from "@/lib/actions/inventory";
import type { Menu, Category, Ingredient, Recipe } from "@prisma/client";

interface RecipesPageClientProps {
  menus: (Menu & { category: Category | null })[];
  categories: Category[];
  ingredients: Ingredient[];
}

type RecipeWithIngredient = Recipe & { ingredient: Ingredient };

export default function RecipesPageClient({
  menus,
  categories,
  ingredients,
}: RecipesPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [recipes, setRecipes] = useState<RecipeWithIngredient[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    ingredientId: "",
    qtyNeeded: 1,
    unit: "",
  });

  // Filter menus by category
  const filteredMenus =
    selectedCategory === "all"
      ? menus
      : menus.filter((m) => m.categoryId === selectedCategory);

  // Load recipes when menu is selected
  useEffect(() => {
    if (selectedMenuId) {
      loadRecipes(selectedMenuId);
    }
  }, [selectedMenuId]);

  const loadRecipes = async (menuId: string) => {
    const data = await getRecipesByMenu(menuId);
    setRecipes(data as RecipeWithIngredient[]);
  };

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenuId || !newIngredient.ingredientId) return;

    startTransition(async () => {
      try {
        await addRecipeIngredient({
          menuId: selectedMenuId,
          ingredientId: newIngredient.ingredientId,
          qtyNeeded: newIngredient.qtyNeeded,
          unit: newIngredient.unit || ingredients.find(i => i.id === newIngredient.ingredientId)?.unit || "",
        });
        setShowAddModal(false);
        setNewIngredient({ ingredientId: "", qtyNeeded: 1, unit: "" });
        loadRecipes(selectedMenuId);
      } catch (error) {
        console.error("Error adding ingredient:", error);
        alert("Gagal menambah bahan");
      }
    });
  };

  const handleRemoveIngredient = async (ingredientId: string) => {
    if (!selectedMenuId) return;
    if (!confirm("Hapus bahan ini dari resep?")) return;

    startTransition(async () => {
      try {
        await removeRecipeIngredient(selectedMenuId, ingredientId);
        loadRecipes(selectedMenuId);
      } catch (error) {
        console.error("Error removing ingredient:", error);
        alert("Gagal menghapus bahan");
      }
    });
  };

  const handleUpdateQty = async (ingredientId: string, qtyNeeded: number) => {
    if (!selectedMenuId) return;

    startTransition(async () => {
      try {
        await updateRecipeIngredient(selectedMenuId, ingredientId, { qtyNeeded });
        loadRecipes(selectedMenuId);
      } catch (error) {
        console.error("Error updating recipe:", error);
      }
    });
  };

  const selectedMenu = menus.find((m) => m.id === selectedMenuId);

  // Available ingredients (not already in recipe)
  const availableIngredients = ingredients.filter(
    (ing) => !recipes.some((r) => r.ingredientId === ing.id)
  );

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-white px-8 py-6 border-b border-slate-200">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Manajemen Resep (BOM)
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Kelola bahan baku yang dibutuhkan untuk setiap menu
        </p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Menu List */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredMenus.map((menu) => (
              <button
                key={menu.id}
                onClick={() => setSelectedMenuId(menu.id)}
                className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition ${
                  selectedMenuId === menu.id ? "bg-green-50 border-l-4 border-l-green-500" : ""
                }`}
              >
                <div className="font-semibold text-slate-900">{menu.name}</div>
                <div className="text-xs text-slate-500">
                  {menu.category?.name || "Tanpa kategori"} • Rp {menu.price.toLocaleString("id-ID")}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel - Recipe Details */}
        <div className="flex-1 p-8 overflow-y-auto">
          {selectedMenu ? (
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {selectedMenu.name}
                  </h3>
                  <p className="text-slate-500">{selectedMenu.description}</p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
                  disabled={availableIngredients.length === 0}
                >
                  <span className="material-symbols-outlined">add</span>
                  Tambah Bahan
                </button>
              </div>

              {recipes.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                      <tr>
                        <th className="px-6 py-4">Bahan</th>
                        <th className="px-6 py-4">Jumlah Dibutuhkan</th>
                        <th className="px-6 py-4">Satuan</th>
                        <th className="px-6 py-4">Stok Tersedia</th>
                        <th className="px-6 py-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recipes.map((recipe) => (
                        <tr key={recipe.ingredientId} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-bold text-slate-900">
                            {recipe.ingredient.name}
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={recipe.qtyNeeded}
                              onChange={(e) =>
                                handleUpdateQty(recipe.ingredientId, parseFloat(e.target.value))
                              }
                              className="w-24 px-2 py-1 border border-slate-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {recipe.unit}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded text-xs font-bold ${
                                recipe.ingredient.currentStock <= recipe.ingredient.minStock
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {recipe.ingredient.currentStock} {recipe.ingredient.unit}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleRemoveIngredient(recipe.ingredientId)}
                              className="text-red-600 hover:text-red-800 p-1"
                              disabled={isPending}
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
                  <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
                    receipt_long
                  </span>
                  <p className="text-slate-500">Belum ada bahan dalam resep ini</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Klik &quot;Tambah Bahan&quot; untuk menambahkan bahan baku
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
                  menu_book
                </span>
                <p className="text-slate-500">Pilih menu dari daftar di sebelah kiri</p>
                <p className="text-sm text-slate-400 mt-1">
                  untuk melihat dan mengelola resep
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Ingredient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Tambah Bahan ke Resep
            </h3>
            <form onSubmit={handleAddIngredient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Bahan *
                </label>
                <select
                  value={newIngredient.ingredientId}
                  onChange={(e) => {
                    const ing = ingredients.find((i) => i.id === e.target.value);
                    setNewIngredient({
                      ...newIngredient,
                      ingredientId: e.target.value,
                      unit: ing?.unit || "",
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  required
                >
                  <option value="">Pilih bahan...</option>
                  {availableIngredients.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name} (stok: {ing.currentStock} {ing.unit})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Jumlah Dibutuhkan *
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={newIngredient.qtyNeeded}
                  onChange={(e) =>
                    setNewIngredient({ ...newIngredient, qtyNeeded: parseFloat(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Satuan
                </label>
                <input
                  type="text"
                  value={newIngredient.unit}
                  onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="gram, ml, pcs..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  {isPending ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
