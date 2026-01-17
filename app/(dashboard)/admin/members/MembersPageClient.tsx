"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createMember, updateMember, deleteMember } from "@/lib/actions/members";
import type { Member } from "@prisma/client";

interface MembersPageClientProps {
  members: Member[];
}

export default function MembersPageClient({ members }: MembersPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const totalPoints = members.reduce((sum, m) => sum + m.points, 0);

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery)
  );

  const resetForm = () => {
    setFormData({ name: "", phone: "" });
    setEditingMember(null);
  };

  const handleOpenModal = (member?: Member) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        phone: member.phone,
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
        if (editingMember) {
          await updateMember(editingMember.id, formData);
        } else {
          await createMember(formData);
        }
        setShowModal(false);
        resetForm();
        router.refresh();
      } catch (error) {
        console.error("Error saving member:", error);
        alert("Gagal menyimpan member");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus member ini?")) return;

    startTransition(async () => {
      try {
        await deleteMember(id);
        router.refresh();
      } catch (error) {
        console.error("Error deleting member:", error);
        alert("Gagal menghapus member");
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-white px-8 py-6 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Manajemen Member
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Kelola data pelanggan dan poin loyalty
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
        >
          <span className="material-symbols-outlined">person_add</span>
          Tambah Member
        </button>
      </header>

      {/* Stats */}
      <div className="px-8 pt-6 grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-blue-100 text-blue-600">
              <span className="material-symbols-outlined">group</span>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Member</p>
              <p className="text-2xl font-bold text-slate-900">{members.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-amber-100 text-amber-600">
              <span className="material-symbols-outlined">stars</span>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Poin</p>
              <p className="text-2xl font-bold text-slate-900">{totalPoints.toLocaleString("id-ID")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-8 pt-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Cari nama atau nomor telepon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="p-8 overflow-auto flex-1">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">No. Telepon</th>
                <th className="px-6 py-4">Poin</th>
                <th className="px-6 py-4">Bergabung</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {member.name}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600">
                    {member.phone}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold text-xs">
                      <span className="material-symbols-outlined text-sm">stars</span>
                      {member.points.toLocaleString("id-ID")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(member.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(member)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
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
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    {searchQuery ? "Tidak ada member yang cocok." : "Belum ada member terdaftar."}
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
              {editingMember ? "Edit Member" : "Tambah Member Baru"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                  placeholder="Nama member"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  No. Telepon *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                  placeholder="08xxxxxxxxxx"
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
