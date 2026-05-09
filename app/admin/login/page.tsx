"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { LogIn, Mail, Lock, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login({ email, password });
      if (response.success) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError(
          response.message || "Login failed. Please check your credentials.",
        );
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Kombinasi email dan password salah. Silakan coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 bg-cream selection:bg-terracotta/20">
      {/* Left Column: Decorative/Editorial Sidebar */}
      <div className="hidden md:flex md:col-span-5 lg:col-span-4 bg-dark text-cream p-12 flex-col justify-between relative overflow-hidden border-r border-terracotta/20">
        {/* Subtle decorative grain/grid overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay bg-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZHRoPSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4xIi8+Cjwvc3ZnPg==')]"></div>

        {/* Brand Logo Header */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-cream/10 backdrop-blur-md rounded-full border border-cream/20">
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-widest font-body text-linen">
              Backstage Portal
            </span>
          </div>
        </div>

        {/* Center Quote/Branding */}
        <div className="relative z-10 my-auto py-12">
          <h1 className="text-4xl lg:text-5xl font-display font-bold leading-tight mb-6">
            Jahit <span className="text-terracotta italic">Keindahan</span>{" "}
            Harianmu.
          </h1>
          <p className="text-linen/80 text-sm md:text-base leading-relaxed max-w-sm font-body">
            Masuk ke dasbor admin untuk mengelola produk, menyelaraskan stok,
            dan mengatur kehadiran visual mbaQul Jarit Shop secara real-time.
          </p>
        </div>

        {/* Footer Brand Credit */}
        <div className="relative z-10 text-xs text-linen/50 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-terracotta" />
          <span>
            © {new Date().getFullYear()} mbaQul Jarit. Secured backend
            environment.
          </span>
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="col-span-1 md:col-span-7 lg:col-span-8 flex items-center justify-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="md:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-dark/5 rounded-full mb-4">
              <span className="w-2 h-2 rounded-full bg-terracotta"></span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-dark/70">
                Backstage Portal
              </span>
            </div>
            <h1 className="text-3xl font-display font-bold text-dark">
              mbaQul Jarit Shop
            </h1>
          </div>

          {/* Login Card */}
          <div className="bg-white/40 backdrop-blur-md p-8 sm:p-10 rounded-[2rem] border border-white/40 shadow-sm relative overflow-hidden">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-dark mb-2">
                Selamat Datang Admin
              </h2>
              <p className="text-soft-brown text-sm font-body">
                Silakan masuk menggunakan kredensial terdaftar untuk
                melanjutkan.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-start gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" />
                <span className="text-xs sm:text-sm font-body">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-semibold text-dark mb-2 font-body">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-soft-brown">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@mbaquljarit.com"
                    className="w-full pl-12 pr-4 py-4 bg-white/70 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-dark font-body text-sm placeholder-soft-brown/50 shadow-inner"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-semibold text-dark mb-2 font-body">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-soft-brown">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-white/70 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-dark font-body text-sm placeholder-soft-brown/50 shadow-inner"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-terracotta hover:bg-soft-brown disabled:bg-terracotta/60 text-white font-body font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Masuk ke Dasbor</span>
                    <LogIn className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
