"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { login } from "@/lib/actions/auth";
import { getRoleRedirectPath } from "@/lib/auth-helpers";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await login(formData.username, formData.password);
      
      if (result.success && result.user) {
        const redirectPath = getRoleRedirectPath(result.user.role);
        router.push(redirectPath);
      } else {
        setError(result.error || "Terjadi kesalahan");
      }
    });
  };

  return (
    <main className="botanical-page relative min-h-screen w-full overflow-hidden font-body text-on-surface">
      <div className="absolute inset-0 asset-pattern opacity-[0.08]" />
      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-8 px-5 py-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
        <section className="hidden min-h-[calc(100vh-3rem)] flex-col justify-between overflow-hidden rounded-[36px] bg-[#063d2d] p-8 text-[#fff8e8] shadow-[0_30px_90px_rgba(6,61,45,0.28)] lg:flex">
          <div className="flex items-center gap-4">
            <div className="relative size-14 overflow-hidden rounded-2xl bg-white shadow-xl">
              <Image src="/assets/thai-cafe-mark.svg" alt="Thai Cafe" fill className="object-cover" priority />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#f2c94c]">
                Botanical Gallery POS
              </p>
              <p className="text-xl font-black">Thai Cafe</p>
            </div>
          </div>

          <div className="relative my-10 flex flex-1 items-center justify-center">
            <div className="absolute inset-8 rounded-full bg-[#0a6b44]/60 blur-3xl" />
            <Image
              src="/assets/menu-plate.svg"
              alt="Thai Cafe plated menu illustration"
              width={840}
              height={620}
              className="relative w-full max-w-[620px] rounded-[32px] shadow-[0_35px_90px_rgba(0,0,0,0.22)]"
              priority
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              ["4", "Role staff"],
              ["QR", "Self-order"],
              ["Live", "Kitchen flow"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-black text-[#f2c94c]">{value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-white/66">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
          <div className="botanical-panel w-full max-w-[520px] rounded-[34px] p-6 md:p-8">
            <header className="mb-8">
              <div className="mb-6 flex items-center gap-3 lg:hidden">
                <div className="relative size-12 overflow-hidden rounded-2xl">
                  <Image src="/assets/thai-cafe-mark.svg" alt="Thai Cafe" fill className="object-cover" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#b98c48]">ANSI POS</p>
                  <p className="text-lg font-black text-[#063d2d]">Thai Cafe</p>
                </div>
              </div>
              <p className="text-[11px] font-black uppercase tracking-widest text-[#b98c48]">
                Masuk ke workspace
              </p>
              <h2 className="mt-3 text-4xl font-black leading-tight text-[#063d2d]">
                Operasional cafe dalam satu panel.
              </h2>
              <p className="mt-4 text-sm font-medium leading-6 text-[#667064]">
                Pilih akun demo sesuai role untuk mengelola meja, dapur, pembayaran, dan laporan Thai Cafe.
              </p>
            </header>

            <div className="mb-8 rounded-[26px] border border-[#dfd2bd]/70 bg-white/70 p-4">
              <h4 className="mb-3 text-[0.72rem] font-black uppercase tracking-widest text-[#0a6b44]">
                Akun Demo
              </h4>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  ["Manajer", "admin", "admin123"],
                  ["Kasir", "kasir", "kasir123"],
                  ["Pelayan", "waiter", "waiter123"],
                  ["Dapur", "kitchen", "kitchen123"],
                ].map(([role, username, password]) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ username, password })}
                    className="rounded-2xl border border-[#dfd2bd]/70 bg-[#fffaf1] p-3 text-left transition hover:border-[#0a6b44]/40 hover:bg-white"
                  >
                    <span className="block text-sm font-black text-[#17231d]">{role}</span>
                    <span className="mt-1 block text-xs font-semibold text-[#667064]">
                      {username} / {password}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-2xl border border-[#d9492f]/35 bg-[#d9492f]/12 px-4 py-3 text-sm font-semibold text-[#8f2e20]">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            <div className="space-y-2 group relative">
              <label htmlFor="username" className="mb-2 block text-[0.72rem] font-black uppercase tracking-widest text-[#0a6b44]">Username</label>
              <div className="relative">
                <input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Masukkan username"
                  className="w-full rounded-2xl border border-[#dfd2bd]/80 bg-white/78 px-5 py-4 pr-12 font-bold text-[#17231d] outline-none transition placeholder:text-[#9c927d] focus:border-[#0a6b44]/45 focus:bg-white focus:ring-4 focus:ring-[#0a6b44]/10"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-primary opacity-60">person</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 group relative">
              <label htmlFor="password" className="mb-2 block text-[0.72rem] font-black uppercase tracking-widest text-[#0a6b44]">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Masukkan password"
                  className="w-full rounded-2xl border border-[#dfd2bd]/80 bg-white/78 px-5 py-4 pr-12 font-bold text-[#17231d] outline-none transition placeholder:text-[#9c927d] focus:border-[#0a6b44]/45 focus:bg-white focus:ring-4 focus:ring-[#0a6b44]/10"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-primary opacity-60 hover:opacity-100 transition-opacity"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isPending}
              className="primary-glow mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-5 font-black uppercase tracking-widest text-white botanical-shadow transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <span className="material-symbols-outlined animate-spin mr-2">autorenew</span>
                  MEMPROSES...
                </>
              ) : (
                <>
                  LANJUTKAN
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

            <div className="mt-8 rounded-[24px] bg-[#063d2d]/8 p-5">
              <div className="flex gap-4">
                <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#0a6b44]/12 text-[#0a6b44]">
                  <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
                </div>
                <div>
                  <p className="mb-1 text-[0.7rem] font-black uppercase tracking-widest text-[#063d2d]">Akses Berdasarkan Peran</p>
                  <p className="text-xs leading-relaxed text-[#667064]">
                    Setiap role membawa menu operasionalnya sendiri, dari floor, kitchen, kasir, sampai manager report.
                  </p>
                </div>
              </div>
            </div>
          </div>
      </section>
      </div>
    </main>
  );
}

