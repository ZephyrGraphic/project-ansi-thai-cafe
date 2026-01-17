"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTable, updateTable, deleteTable } from "@/lib/actions/tables";
import type { Table, TableStatus } from "@prisma/client";

interface TablesPageClientProps {
  tables: Table[];
}

const STATUS_COLORS: Record<TableStatus, string> = {
  AVAILABLE: "bg-green-100 text-green-700",
  OCCUPIED: "bg-red-100 text-red-700",
  RESERVED: "bg-blue-100 text-blue-700",
  CLEANING: "bg-yellow-100 text-yellow-700",
};

const STATUS_LABELS: Record<TableStatus, string> = {
  AVAILABLE: "Tersedia",
  OCCUPIED: "Terisi",
  RESERVED: "Direservasi",
  CLEANING: "Dibersihkan",
};

const ZONE_OPTIONS = [
  { value: "floor1", label: "Lantai 1" },
  { value: "floor2", label: "Lantai 2" },
  { value: "outdoor", label: "Outdoor" },
  { value: "vip", label: "VIP" },
];

export default function TablesPageClient({ tables }: TablesPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [formData, setFormData] = useState({
    tableNo: "",
    capacity: "4",
    zone: "floor1",
    status: "AVAILABLE" as TableStatus,
  });

  const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);
  const availableTables = tables.filter((t) => t.status === "AVAILABLE").length;

  const resetForm = () => {
    setFormData({ tableNo: "", capacity: "4", zone: "floor1", status: "AVAILABLE" });
    setEditingTable(null);
  };

  const handleOpenModal = (table?: Table) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        tableNo: table.tableNo.toString(),
        capacity: table.capacity.toString(),
        zone: table.zone,
        status: table.status,
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        if (editingTable) {
          await updateTable(editingTable.id, {
            tableNo: parseInt(formData.tableNo),
            capacity: parseInt(formData.capacity),
            zone: formData.zone,
            status: formData.status,
          });
        } else {
          await createTable({
            tableNo: parseInt(formData.tableNo),
            capacity: parseInt(formData.capacity),
            zone: formData.zone,
          });
        }
        setShowModal(false);
        resetForm();
        router.refresh();
      } catch (error) {
        console.error("Error saving table:", error);
        alert("Gagal menyimpan meja. Pastikan nomor meja belum digunakan.");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus meja ini?")) return;

    startTransition(async () => {
      try {
        await deleteTable(id);
        router.refresh();
      } catch (error) {
        console.error("Error deleting table:", error);
        alert("Gagal menghapus meja");
      }
    });
  };

  const getZoneLabel = (zone: string) => {
    return ZONE_OPTIONS.find((z) => z.value === zone)?.label || zone;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-white px-8 py-6 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Manajemen Meja
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Kelola meja dan kapasitas restoran
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Tambah Meja
        </button>
      </header>

      {/* Stats */}
      <div className="px-8 pt-6 grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-blue-100 text-blue-600">
              <span className="material-symbols-outlined">table_restaurant</span>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Meja</p>
              <p className="text-2xl font-bold text-slate-900">{tables.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-green-100 text-green-600">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <div>
              <p className="text-sm text-slate-500">Meja Tersedia</p>
              <p className="text-2xl font-bold text-slate-900">{availableTables}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-purple-100 text-purple-600">
              <span className="material-symbols-outlined">groups</span>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Kapasitas</p>
              <p className="text-2xl font-bold text-slate-900">{totalCapacity} orang</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 overflow-auto flex-1">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">No. Meja</th>
                <th className="px-6 py-4">Kapasitas</th>
                <th className="px-6 py-4">Zona</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tables.map((table) => (
                <tr key={table.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    Meja {table.tableNo}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">group</span>
                      {table.capacity} orang
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {getZoneLabel(table.zone)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[table.status]}`}>
                      {STATUS_LABELS[table.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(table)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(table.id)}
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
              {tables.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    Belum ada meja terdaftar.
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
              {editingTable ? "Edit Meja" : "Tambah Meja Baru"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nomor Meja *
                </label>
                <input
                  type="number"
                  value={formData.tableNo}
                  onChange={(e) => setFormData({ ...formData, tableNo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                  min="1"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Kapasitas *
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                  min="1"
                  placeholder="4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Zona
                </label>
                <select
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  {ZONE_OPTIONS.map((z) => (
                    <option key={z.value} value={z.value}>
                      {z.label}
                    </option>
                  ))}
                </select>
              </div>
              {editingTable && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TableStatus })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="AVAILABLE">Tersedia</option>
                    <option value="OCCUPIED">Terisi</option>
                    <option value="RESERVED">Direservasi</option>
                    <option value="CLEANING">Dibersihkan</option>
                  </select>
                </div>
              )}
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
