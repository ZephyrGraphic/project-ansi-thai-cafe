"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { updateQueueStatus, cancelQueue } from "@/lib/actions";
import {
  Phone,
  Users,
  CheckCircle,
  Volume2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";

type QueueStatus = "WAITING" | "CALLED" | "SEATED" | "CANCELLED";

export default function QueueClient({
  initialQueues,
}: {
  initialQueues: any[];
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusUpdate = async (id: string, newStatus: QueueStatus) => {
    setLoadingId(id);
    try {
      await updateQueueStatus(id, newStatus);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui status.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Apakah yakin ingin membatalkan antrean ini?")) return;
    setLoadingId(id);
    try {
      await cancelQueue(id);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden text-sm sm:text-base">
      <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
        <h2 className="font-semibold text-slate-800">Daftar Tunggu Aktif</h2>
        <button
          className="flex items-center px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-sm hover:bg-slate-50 transition-colors"
          onClick={() => router.refresh()}
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </button>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="px-4 py-3 font-semibold text-slate-500">Waktu</th>
            <th className="px-4 py-3 font-semibold text-slate-500">
              Nama Pelanggan
            </th>
            <th className="px-4 py-3 font-semibold text-slate-500">
              Kontak & Pax
            </th>
            <th className="px-4 py-3 font-semibold text-slate-500">Status</th>
            <th className="px-4 py-3 font-semibold text-slate-500 text-right">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {initialQueues.length === 0 ? (
            <tr>
              <td colSpan={5} className="h-32 text-center text-slate-400">
                Tidak ada antrean saat ini.
              </td>
            </tr>
          ) : (
            initialQueues.map((q) => (
              <tr key={q.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-medium whitespace-nowrap">
                  {format(new Date(q.createdAt), "HH:mm", { locale: id })}
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-800">{q.name}</p>
                  {q.notes && (
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {q.notes}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-4 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> {q.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> {q.pax}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {q.status === "WAITING" ? (
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">
                      Menunggu
                    </span>
                  ) : q.status === "CALLED" ? (
                    <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-lg">
                      Dipanggil
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg border">
                      {q.status}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {q.status === "WAITING" && (
                      <button
                        className="px-3 py-1.5 flex items-center text-sm font-medium border border-orange-200 text-orange-600 rounded-lg hover:bg-orange-50 disabled:opacity-50"
                        disabled={loadingId === q.id}
                        onClick={() => handleStatusUpdate(q.id, "CALLED")}
                      >
                        <Volume2 className="w-4 h-4 mr-1.5" /> Panggil
                      </button>
                    )}

                    {q.status === "CALLED" && (
                      <button
                        className="px-3 py-1.5 flex items-center text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        disabled={loadingId === q.id}
                        onClick={() => handleStatusUpdate(q.id, "SEATED")}
                      >
                        <CheckCircle className="w-4 h-4 mr-1.5" /> Beri Meja
                      </button>
                    )}

                    <button
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg disabled:opacity-50"
                      disabled={loadingId === q.id}
                      onClick={() => handleCancel(q.id)}
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
