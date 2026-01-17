"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="font-sans text-gray-900 bg-white min-h-screen w-full flex">
      {/* Left Side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 h-screen sticky top-0">
        <Image
          src="https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=80"
          alt="Thai food"
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-end p-20 w-full h-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-gray-900 shadow-lg">
              <span className="material-symbols-outlined text-3xl font-bold">restaurant</span>
            </div>
            <h1 className="font-display text-4xl font-bold text-white tracking-tight">
              Thai Cafe POS
            </h1>
          </div>
          <p className="text-xl text-gray-200 font-light leading-relaxed max-w-md">
            Sistem Point of Sale untuk pengelolaan restoran Thai Cafe.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 lg:p-24 min-h-screen">
        <div className="w-full max-w-md space-y-8 py-10">
          <div className="text-left">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-3">
              Selamat Datang
            </h2>
            <p className="text-gray-500 text-lg">
              Silakan masuk ke dasbor Anda.
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-3">
              Akun Demo
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded-lg border border-blue-100">
                <p className="font-bold text-blue-800">Manajer/Admin</p>
                <p className="text-blue-600">admin / admin123</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-blue-100">
                <p className="font-bold text-blue-800">Kasir</p>
                <p className="text-blue-600">kasir / kasir123</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-blue-100">
                <p className="font-bold text-blue-800">Pelayan</p>
                <p className="text-blue-600">waiter / waiter123</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-blue-100">
                <p className="font-bold text-blue-800">Dapur</p>
                <p className="text-blue-600">kitchen / kitchen123</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-bold text-gray-900">Username</Label>
              <div className="relative group">
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Masukkan username"
                  className="pl-4 pr-10 py-6 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-primary shadow-none"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-green-900 opacity-60">person</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-bold text-gray-900">Password</Label>
              <div className="relative group">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Masukkan password"
                  className="pl-4 pr-10 py-6 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-primary shadow-none"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-green-900 opacity-60 hover:opacity-100"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <Button 
                type="submit"
                disabled={isPending}
                className="w-full py-6 text-base font-bold text-gray-900 bg-primary hover:bg-green-500 rounded-xl shadow-md transition-all duration-200 transform active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <span className="material-symbols-outlined animate-spin mr-2">autorenew</span>
                    Memproses...
                  </>
                ) : (
                  <>
                    Masuk <span className="material-symbols-outlined ml-2 text-xl">arrow_forward</span>
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 rounded-xl bg-amber-50 border border-amber-100 p-5 shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="material-symbols-outlined text-amber-600">info</span>
              </div>
              <div className="ml-4">
                <h3 className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-1">
                  Akses Berdasarkan Peran
                </h3>
                <div className="text-xs text-amber-700 font-medium leading-relaxed">
                  <p>Setiap peran memiliki akses ke menu yang berbeda sesuai tanggung jawabnya.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
