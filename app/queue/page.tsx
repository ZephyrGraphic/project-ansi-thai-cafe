"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Coffee, Users, Phone, User, Clock, CheckCircle2 } from "lucide-react";
import { joinQueue, getTotalTableCapacity } from "@/lib/actions";

export default function QueuePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [queueData, setQueueData] = useState<any>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pax, setPax] = useState<number>(2);
  const [maxCapacity, setMaxCapacity] = useState<number>(20);

  useEffect(() => {
    getTotalTableCapacity().then(cap => setMaxCapacity(cap)).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || pax < 1) return;
    if (pax > maxCapacity) {
      alert(`Mohon maaf, restoran kami hanya memiliki meja dengan kapasitas maksimal ${maxCapacity} orang.`);
      return;
    }

    setLoading(true);
    try {
      const res = await joinQueue({ name, phone, pax });
      setQueueData(res);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Gagal masuk antrean. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (success && queueData) {
    return (
      <div className="min-h-screen bg-surface-bright flex flex-col items-center justify-center p-4 font-headline">
        <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_12px_40px_0_rgba(0,110,10,0.06)] max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-primary-container/30 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-on-surface">
              Berhasil Daftar!
            </h1>
            <p className="text-on-surface-variant font-medium mt-2">
              Mohon tunggu, Anda telah masuk ke dalam waiting list.
            </p>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-6 border border-surface-variant/50 mt-6">
            <p className="text-xs text-outline font-bold uppercase tracking-widest">
              Antrean di depan Anda
            </p>
            <p className="text-7xl font-black text-primary my-4">
              {queueData.positionAhead}
            </p>
            <p className="text-sm text-on-surface-variant font-medium">
              Estimasi dipanggil sekitar {queueData.positionAhead * 10 || 5}{" "}
              Menit
            </p>
          </div>

          <div className="text-left space-y-2 text-sm text-on-surface bg-primary-container/10 p-5 rounded-xl border border-primary-container/20">
            <p>
              <strong>Nama:</strong> {queueData.queue.name}
            </p>
            <p>
              <strong>Pax:</strong> {queueData.queue.pax} Orang
            </p>
            <p>
              <strong>Waktu:</strong>{" "}
              {format(new Date(queueData.queue.createdAt), "HH:mm", {
                locale: id,
              })}
            </p>
          </div>

          <p className="text-xs text-outline font-medium">
            Silakan duduk di area ruang tunggu. Nama Anda akan dipanggil oleh
            pelayan kami.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-headline relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl mix-blend-multiply"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl mix-blend-multiply"></div>
      
      <div className="max-w-md w-full space-y-8 bg-surface-container-lowest p-8 rounded-3xl shadow-[0_12px_40px_0_rgba(0,110,10,0.06)] border border-surface-variant/30 relative z-10">
        <div className="text-center">
          <div className="bg-primary-container/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
             <span className="material-symbols-outlined text-primary text-3xl">list_alt</span>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-on-surface">
            Waiting List
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant font-medium max-w-[250px] mx-auto">
            Kapasitas restoran penuh? Silakan daftar antrean digital restoran kami.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5 rounded-md">
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-primary mb-1 pl-1">
                Nama Lengkap
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-outline" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-12 block w-full rounded-xl sm:text-sm py-4 px-4 bg-surface-container-low border-none focus:ring-2 focus:ring-primary font-medium text-on-surface placeholder:text-outline"
                  placeholder="Misal: Budi Santoso"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest text-primary mb-1 pl-1">
                No. WhatsApp
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-outline" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-12 block w-full rounded-xl sm:text-sm py-4 px-4 bg-surface-container-low border-none focus:ring-2 focus:ring-primary font-medium text-on-surface placeholder:text-outline"
                  placeholder="0812xxxx"
                />
              </div>
            </div>

            <div>
              <label htmlFor="pax" className="block text-xs font-bold uppercase tracking-widest text-primary mb-1 pl-1">
                Jumlah Orang (Pax)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-outline" />
                </div>
                <input
                  id="pax"
                  type="number"
                  min="1"
                  max={maxCapacity}
                  required
                  value={pax || ""}
                  onChange={(e) => setPax(parseInt(e.target.value) || 0)}
                  className="pl-12 block w-full rounded-xl sm:text-sm py-4 px-4 bg-surface-container-low border-none focus:ring-2 focus:ring-primary font-medium text-on-surface"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm rounded-full text-on-primary bg-gradient-to-r from-primary to-primary-fixed shadow-[0_8px_20px_0_rgba(0,110,10,0.3)] hover:scale-[1.02] active:scale-[0.98] focus:outline-none disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-all font-black tracking-widest uppercase"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5 animate-spin" /> MENDAFTAR...
                </span>
              ) : (
                "DAFTAR ANTREAN"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
