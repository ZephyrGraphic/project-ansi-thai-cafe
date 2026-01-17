"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/menu";
import type { Category } from "@prisma/client";

type CategoryWithCount = Category & { _count: { menus: number } };

interface CategoriesPageClientProps {
  categories: CategoryWithCount[];
}

export default function CategoriesPageClient({ categories }: CategoriesPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  const activeCategories = categories.filter((c) => c.isAvailable).length;
  const totalMenus = categories.reduce((sum, c) => sum + c._count.menus, 0);

  const resetForm = () => {
    setFormData({ name: "" });
    setEditingCategory(null);
  };

  const handleOpenModal = (category?: CategoryWithCount) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        if (editingCategory) {
          await updateCategory(editingCategory.id, { name: formData.name });
        } else {
          await createCategory(formData.name);
        }
        setShowModal(false);
        resetForm();
        router.refresh();
      } catch (error) {
        console.error("Error saving category:", error);
        alert("Gagal menyimpan kategori. Pastikan nama kategori unik.");
      }
    });
  };

  const handleToggleAvailability = async (category: CategoryWithCount) => {
    startTransition(async () => {
      try {
        await updateCategory(category.id, { isAvailable: !category.isAvailable });
        router.refresh();
      } catch (error) {
        console.error("Error toggling category:", error);
        alert("Gagal mengubah status kategori");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kategori ini? Semua menu dalam kategori ini juga akan terhapus.")) return;

    startTransition(async () => {
      try {
        await deleteCategory(id);
        router.refresh();
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Gagal menghapus kategori. Pastikan tidak ada menu yang menggunakan kategori ini.");
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-white px-8 py-6 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Kategori Menu
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Kelola kategori untuk pengelompokan menu
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Tambah Kategori
        </button>
      </header>

      {/* Stats */}
      <div className="px-8 pt-6 grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-blue-100 text-blue-600">
              <span className="material-symbols-outlined">category</span>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Kategori</p>
              <p className="text-2xl font-bold text-slate-900">{categories.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-green-100 text-green-600">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <div>
              <p className="text-sm text-slate-500">Kategori Aktif</p>
              <p className="text-2xl font-bold text-slate-900">{activeCategories}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-purple-100 text-purple-600">
              <span className="material-symbols-outlined">restaurant_menu</span>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Menu</p>
              <p className="text-2xl font-bold text-slate-900">{totalMenus}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 overflow-auto flex-1">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Nama Kategori</th>
                <th className="px-6 py-4">Jumlah Menu</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">restaurant_menu</span>
                      {category._count.menus} menu
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleAvailability(category)}
                      disabled={isPending}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                        category.isAvailable
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {category.isAvailable ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(category)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Hapus"
                        disabled={isPending}
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                    Belum ada kategori terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nama Kategori *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                  placeholder="Contoh: Makanan, Minuman, Dessert"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
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
