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
    <main className="flex h-screen w-full bg-surface-bright text-on-surface m-0 p-0 overflow-x-hidden p-0 font-body">
      {/* Left Side: Visual Anchor */}
      <section className="relative hidden lg:flex w-1/2 h-full overflow-hidden bg-zinc-900">
        <Image
          src="https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=80"
          alt="Gourmet Pad Thai dish"
          fill
          className="object-cover absolute inset-0 w-full h-full"
          priority
        />
        <div className="absolute inset-0 lime-overlay mix-blend-multiply"></div>
        {/* Logo Branding Over Photo */}
        <div className="absolute inset-0 flex flex-col justify-between p-16 z-10">
          <div className="flex items-center gap-3">
            <span className="text-white text-2xl font-extrabold tracking-tighter">THAI CAFE</span>
          </div>
          <div className="max-w-md">
            <h1 className="text-white text-[3.5rem] leading-tight font-extrabold tracking-tight -ml-1">
              The Botanical Gallery
            </h1>
            <p className="text-white/80 mt-4 font-light tracking-wide max-w-sm">
              Experience the curated essence of Thai culinary arts, where every dish is a botanical masterpiece.
            </p>
          </div>
        </div>
      </section>

      {/* Right Side: Interaction Canvas */}
      <section className="w-full lg:w-1/2 h-full bg-white flex flex-col items-center justify-center px-8 md:px-24 overflow-y-auto">
        <div className="w-full max-w-md space-y-10 py-12">
          {/* Login Header */}
          <header className="space-y-2">
            <h2 className="text-on-surface text-[2.5rem] font-extrabold tracking-tight">Selamat Datang</h2>
            <p className="text-on-surface-variant font-medium tracking-wide">Silakan masuk ke dasbor Anda.</p>
          </header>

          {/* Demo Accounts - Styled to blend with the new theme */}
          <div className="bg-surface-container-low border border-surface-variant rounded-xl p-4">
            <h4 className="text-[0.75rem] font-bold text-primary uppercase tracking-[0.05em] mb-3">
              Akun Demo
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded-lg border border-surface-variant flex flex-col gap-1">
                <span className="font-bold text-on-surface">Manajer/Admin</span>
                <span className="text-on-surface-variant">admin / admin123</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-surface-variant flex flex-col gap-1">
                <span className="font-bold text-on-surface">Kasir</span>
                <span className="text-on-surface-variant">kasir / kasir123</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-surface-variant flex flex-col gap-1">
                <span className="font-bold text-on-surface">Pelayan</span>
                <span className="text-on-surface-variant">waiter / waiter123</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-surface-variant flex flex-col gap-1">
                <span className="font-bold text-on-surface">Dapur</span>
                <span className="text-on-surface-variant">kitchen / kitchen123</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-error-container border border-error text-on-error-container px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            <div className="space-y-2 group relative">
              <label htmlFor="username" className="block text-[0.75rem] font-bold uppercase tracking-[0.05em] text-primary mb-2">Username</label>
              <div className="relative">
                <input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Masukkan username"
                  className="w-full px-6 py-4 bg-surface-container-low border-2 border-transparent focus:border-primary-container rounded-xl focus:ring-0 focus:outline-none focus:bg-primary/5 transition-all placeholder:text-zinc-400 font-medium pr-12"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-primary opacity-60">person</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 group relative">
              <label htmlFor="password" className="block text-[0.75rem] font-bold uppercase tracking-[0.05em] text-primary mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Masukkan password"
                  className="w-full px-6 py-4 bg-surface-container-low border-2 border-transparent focus:border-primary-container rounded-xl focus:ring-0 focus:outline-none focus:bg-primary/5 transition-all placeholder:text-zinc-400 font-medium pr-12"
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
              className="w-full primary-glow text-white font-bold py-5 rounded-full botanical-shadow active:scale-[0.98] transition-transform flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
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

          {/* Simple Info Details */}
          <div className="pt-2">
            <div className="bg-surface-container-low p-6 rounded-3xl relative overflow-hidden group">
              {/* Abstract Botanical Shape in Background */}
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full flex-shrink-0 bg-primary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">admin_panel_settings</span>
                </div>
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.1em] text-on-surface-variant font-bold mb-1">Akses Berdasarkan Peran</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Setiap peran memiliki akses ke menu yang berbeda sesuai tanggung jawabnya.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <footer className="pt-4 pb-8">
            <p className="text-center text-[0.7rem] text-zinc-400 font-medium">
              Sistem Point of Sale untuk pengelolaan restoran Thai Cafe.
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}

