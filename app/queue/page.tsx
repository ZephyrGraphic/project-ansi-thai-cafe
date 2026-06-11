"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Users, Phone, User, Clock, CheckCircle2 } from "lucide-react";
import { joinQueue, getTotalTableCapacity } from "@/lib/actions";

type QueueJoinResult = {
  queue: {
    id: string;
    name: string;
    phone: string;
    pax: number;
    createdAt: Date;
  };
  positionAhead: number;
};

export default function QueuePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [queueData, setQueueData] = useState<QueueJoinResult | null>(null);

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
      <div className="botanical-page flex min-h-screen flex-col items-center justify-center p-5 font-headline">
        <div className="botanical-panel w-full max-w-md rounded-[34px] p-8 text-center">
          <div className="mx-auto flex size-20 items-center justify-center rounded-[28px] bg-[#0a6b44]/12">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>

          <div className="mt-6">
            <h1 className="text-3xl font-black text-[#063d2d]">
              Berhasil Daftar!
            </h1>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#667064]">
              Mohon tunggu, Anda telah masuk ke dalam waiting list.
            </p>
          </div>

          <div className="mt-6 rounded-[28px] border border-[#dfd2bd]/70 bg-white/72 p-6">
            <p className="text-xs font-black uppercase tracking-widest text-[#8a7a61]">
              Antrean di depan Anda
            </p>
            <p className="my-4 text-7xl font-black text-[#0a6b44]">
              {queueData.positionAhead}
            </p>
            <p className="text-sm font-semibold text-[#667064]">
              Estimasi dipanggil sekitar {queueData.positionAhead * 10 || 5}{" "}
              Menit
            </p>
          </div>

          <div className="mt-6 space-y-2 rounded-2xl border border-[#0a6b44]/14 bg-[#0a6b44]/8 p-5 text-left text-sm text-[#17231d]">
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

          <p className="mt-5 text-xs font-semibold leading-5 text-[#8a7a61]">
            Silakan duduk di area ruang tunggu. Nama Anda akan dipanggil oleh
            pelayan kami.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="botanical-page relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 font-headline sm:px-6 lg:px-8">
      <div className="absolute inset-0 asset-pattern opacity-[0.07]" />
      <div className="relative z-10 grid w-full max-w-6xl gap-6 lg:grid-cols-[1fr_440px]">
        <section className="botanical-card-strong hidden min-h-[620px] overflow-hidden rounded-[36px] p-8 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-[#f2c94c]">Thai Cafe Queue</p>
            <h1 className="mt-4 max-w-xl text-5xl font-black leading-tight text-[#fff8e8]">
              Masuk antrean tanpa menunggu di depan kasir.
            </h1>
            <p className="mt-5 max-w-md text-sm font-semibold leading-6 text-white/70">
              Daftar dari ponsel, pantau estimasi, lalu tunggu panggilan pelayan saat meja tersedia.
            </p>
          </div>
          <Image
            src="/assets/qr-order-card.svg"
            alt="QR self-order card"
            width={720}
            height={540}
            className="mx-auto w-full max-w-[520px] rounded-[30px] shadow-[0_30px_80px_rgba(0,0,0,0.22)]"
            priority
          />
          <div className="grid grid-cols-3 gap-3">
            {["QR", "Pax", "Meja"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/12 bg-white/10 p-4">
                <p className="text-xl font-black text-[#f2c94c]">{item}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/60">Ready</p>
              </div>
            ))}
          </div>
        </section>

        <div className="botanical-panel w-full rounded-[34px] p-6 sm:p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-[24px] bg-[#0a6b44]/12">
               <span className="material-symbols-outlined text-3xl text-[#0a6b44]">list_alt</span>
            </div>
            <p className="text-[11px] font-black uppercase tracking-widest text-[#b98c48]">Waiting List</p>
            <h2 className="mt-3 text-3xl font-black tracking-normal text-[#063d2d]">
            Waiting List
          </h2>
          <p className="mx-auto mt-3 max-w-[280px] text-sm font-semibold leading-6 text-[#667064]">
            Kapasitas restoran penuh? Silakan daftar antrean digital restoran kami.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5 rounded-md">
            <div>
              <label htmlFor="name" className="mb-1 block pl-1 text-xs font-black uppercase tracking-widest text-[#0a6b44]">
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
                  className="block w-full rounded-2xl border border-[#dfd2bd]/80 bg-white/78 px-4 py-4 pl-12 font-bold text-[#17231d] outline-none placeholder:text-[#9c927d] focus:border-[#0a6b44]/45 focus:ring-4 focus:ring-[#0a6b44]/10 sm:text-sm"
                  placeholder="Misal: Budi Santoso"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 block pl-1 text-xs font-black uppercase tracking-widest text-[#0a6b44]">
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
                  className="block w-full rounded-2xl border border-[#dfd2bd]/80 bg-white/78 px-4 py-4 pl-12 font-bold text-[#17231d] outline-none placeholder:text-[#9c927d] focus:border-[#0a6b44]/45 focus:ring-4 focus:ring-[#0a6b44]/10 sm:text-sm"
                  placeholder="0812xxxx"
                />
              </div>
            </div>

            <div>
              <label htmlFor="pax" className="mb-1 block pl-1 text-xs font-black uppercase tracking-widest text-[#0a6b44]">
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
                  className="block w-full rounded-2xl border border-[#dfd2bd]/80 bg-white/78 px-4 py-4 pl-12 font-bold text-[#17231d] outline-none focus:border-[#0a6b44]/45 focus:ring-4 focus:ring-[#0a6b44]/10 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="primary-glow group relative flex w-full justify-center rounded-2xl border border-transparent px-4 py-4 text-sm font-black uppercase tracking-widest text-white shadow-[0_14px_30px_rgba(10,107,68,0.24)] transition-all hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:grayscale disabled:opacity-50"
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
    </div>
  );
}
