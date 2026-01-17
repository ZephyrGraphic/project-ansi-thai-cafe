"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createUser, updateUser, deleteUser } from "@/lib/actions/users";
import type { User, UserRole } from "@prisma/client";

type UserWithoutPassword = Omit<User, "password">;

interface UsersPageClientProps {
  users: UserWithoutPassword[];
}

const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: "bg-purple-100 text-purple-700",
  KASIR: "bg-blue-100 text-blue-700",
  WAITER: "bg-green-100 text-green-700",
  KITCHEN: "bg-orange-100 text-orange-700",
};

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Manager",
  KASIR: "Kasir",
  WAITER: "Pelayan",
  KITCHEN: "Dapur",
};

export default function UsersPageClient({ users }: UsersPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithoutPassword | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    role: "WAITER" as UserRole,
  });

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      name: "",
      email: "",
      role: "WAITER",
    });
    setEditingUser(null);
  };

  const handleOpenModal = (user?: UserWithoutPassword) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        password: "",
        name: user.name || "",
        email: user.email || "",
        role: user.role,
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
        if (editingUser) {
          const updateData: Record<string, string> = {
            username: formData.username,
            name: formData.name,
            email: formData.email,
            role: formData.role,
          };
          if (formData.password) {
            updateData.password = formData.password;
          }
          await updateUser(editingUser.id, updateData);
        } else {
          await createUser({
            username: formData.username,
            password: formData.password,
            name: formData.name || undefined,
            email: formData.email || undefined,
            role: formData.role,
          });
        }
        setShowModal(false);
        resetForm();
        router.refresh();
      } catch (error) {
        console.error("Error saving user:", error);
        alert("Gagal menyimpan user");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;
    
    startTransition(async () => {
      try {
        await deleteUser(id);
        router.refresh();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Gagal menghapus user");
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-white px-8 py-6 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Manajemen Pengguna
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Kelola akun staff dan role akses
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
        >
          <span className="material-symbols-outlined">person_add</span>
          Tambah User
        </button>
      </header>

      <div className="p-8 overflow-auto flex-1">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Dibuat</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {user.name || "-"}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {user.email || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${ROLE_COLORS[user.role]}`}>
                      {ROLE_LABELS[user.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
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
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Belum ada user terdaftar.
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
              {editingUser ? "Edit User" : "Tambah User Baru"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                  placeholder="johndoe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password {editingUser ? "(kosongkan jika tidak diubah)" : "*"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required={!editingUser}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="ADMIN">Manager/Admin</option>
                  <option value="KASIR">Kasir</option>
                  <option value="WAITER">Pelayan</option>
                  <option value="KITCHEN">Dapur</option>
                </select>
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
