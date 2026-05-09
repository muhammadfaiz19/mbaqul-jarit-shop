"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { galleryService } from "@/services/gallery.service";
import { faqService } from "@/services/faq.service";
import {
  ShoppingBag,
  FolderTree,
  Image as ImageIcon,
  HelpCircle,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface QuickStat {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  bgColor: string;
  href: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<QuickStat[]>([
    {
      label: "Total Produk",
      value: "...",
      icon: ShoppingBag,
      color: "var(--color-terracotta)",
      bgColor: "bg-terracotta/10",
      href: "/admin/dashboard/products",
    },
    {
      label: "Kategori",
      value: "...",
      icon: FolderTree,
      color: "var(--color-soft-brown)",
      bgColor: "bg-soft-brown/10",
      href: "/admin/dashboard/categories",
    },
    {
      label: "Item Galeri",
      value: "...",
      icon: ImageIcon,
      color: "var(--color-mauve)",
      bgColor: "bg-mauve/10",
      href: "/admin/dashboard/gallery",
    },
    {
      label: "FAQs Aktif",
      value: "...",
      icon: HelpCircle,
      color: "var(--color-warm-tan)",
      bgColor: "bg-warm-tan/10",
      href: "/admin/dashboard/faqs",
    },
  ]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [prodRes, catRes, galRes, faqRes] = await Promise.all([
          productService.getAll({ limit: 4 }),
          categoryService.getAll(),
          galleryService.getAll(),
          faqService.getAll(),
        ]);

        const prodCount =
          prodRes.data.meta?.total ?? prodRes.data.data?.length ?? 0;
        const catCount = catRes.data.data?.length ?? 0;
        const galCount = galRes.data.data?.length ?? 0;
        const faqCount = faqRes.data.data?.length ?? 0;

        setStats([
          {
            label: "Total Produk",
            value: prodCount,
            icon: ShoppingBag,
            color: "var(--color-terracotta)",
            bgColor: "bg-terracotta/10",
            href: "/admin/dashboard/products",
          },
          {
            label: "Kategori",
            value: catCount,
            icon: FolderTree,
            color: "var(--color-soft-brown)",
            bgColor: "bg-soft-brown/10",
            href: "/admin/dashboard/categories",
          },
          {
            label: "Item Galeri",
            value: galCount,
            icon: ImageIcon,
            color: "var(--color-mauve)",
            bgColor: "bg-mauve/10",
            href: "/admin/dashboard/gallery",
          },
          {
            label: "FAQs Aktif",
            value: faqCount,
            icon: HelpCircle,
            color: "var(--color-warm-tan)",
            bgColor: "bg-warm-tan/10",
            href: "/admin/dashboard/faqs",
          },
        ]);

        setRecentProducts(prodRes.data.data?.slice(0, 4) ?? []);
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-dark text-cream rounded-[2.5rem] border border-terracotta/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta rounded-full filter blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-terracotta/20 text-terracotta rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistem Terintegrasi Live</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold">
            Ruang Kontrol{" "}
            <span className="text-terracotta italic">Backstage</span>
          </h1>
          <p className="text-linen/80 text-sm max-w-md">
            Kelola data produk, katalog, galeri lookbook, dan pengetahuan
            chatbot asisten pintar Anda dari satu tempat terpusat.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 relative z-10">
          <Link
            href="/admin/dashboard/products"
            className="px-5 py-3.5 bg-terracotta hover:bg-soft-brown text-white rounded-2xl text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-5 py-3.5 bg-white/10 hover:bg-white/15 text-linen rounded-2xl text-sm font-semibold transition-all duration-300 border border-white/10 flex items-center gap-2"
          >
            <span>Lihat Website Toko</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link
              key={i}
              href={stat.href}
              className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/30 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] flex items-center justify-between group"
            >
              <div className="space-y-1">
                <span className="text-soft-brown text-xs font-semibold uppercase tracking-wider block font-body">
                  {stat.label}
                </span>
                <span className="text-3xl font-display font-bold text-dark">
                  {stat.value}
                </span>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl ${stat.bgColor} flex items-center justify-center transition-transform duration-300 group-hover:rotate-6`}
              >
                <Icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Center Layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Products list (Col span 2) */}
        <div className="lg:col-span-2 bg-white/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/30 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-dark">
                Produk Terbaru
              </h2>
              <p className="text-xs text-soft-brown">
                Produk yang baru saja diupload ke katalog.
              </p>
            </div>
            <Link
              href="/admin/dashboard/products"
              className="text-terracotta hover:text-soft-brown text-xs font-semibold flex items-center gap-1 group"
            >
              <span>Kelola Semua</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4 py-8">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-16 w-full bg-white/20 rounded-2xl animate-pulse"
                ></div>
              ))}
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="text-center py-12 bg-white/20 rounded-3xl border border-dashed border-white/40">
              <ShoppingBag className="w-12 h-12 text-terracotta/30 mx-auto mb-3" />
              <p className="text-sm text-soft-brown font-medium">
                Belum ada produk di database.
              </p>
              <Link
                href="/admin/dashboard/products"
                className="inline-flex items-center gap-1.5 text-xs text-terracotta font-bold mt-2 hover:underline"
              >
                Upload produk pertama <Plus className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/20 shadow-inner group hover:bg-white/75 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-dark/5 overflow-hidden border border-terracotta/10 relative flex-shrink-0">
                      {prod.images?.[0] ? (
                        <img
                          src={
                            prod.images[0].startsWith("http")
                              ? prod.images[0]
                              : `/uploads/${prod.images[0]}`
                          }
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-terracotta/10 flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-terracotta" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-semibold text-dark truncate block">
                        {prod.name}
                      </span>
                      <span className="text-[11px] font-semibold text-terracotta uppercase tracking-wider block">
                        {prod.category?.name || "Kategori Lain"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {prod.isFeatured && (
                      <span className="hidden sm:inline-block px-2.5 py-1 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Unggulan
                      </span>
                    )}
                    <Link
                      href={`/admin/dashboard/products`}
                      className="p-2 bg-cream hover:bg-terracotta text-soft-brown hover:text-white rounded-xl transition-all"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informational Widget Cards (Col span 1) */}
        <div className="space-y-6">
          {/* Status Widget */}
          <div className="bg-dark text-cream p-8 rounded-[2rem] border border-white/10 shadow-sm relative overflow-hidden flex flex-col justify-between h-full min-h-[300px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta rounded-full filter blur-2xl opacity-10"></div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-widest uppercase text-terracotta font-bold">
                  Asisten Digital
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <h3 className="text-xl font-display font-bold">
                Chatbot AI <span className="text-terracotta italic">Aktif</span>
              </h3>
              <p className="text-xs text-linen/80 leading-relaxed font-body">
                Model asisten pintar beroperasi secara otomatis di website toko
                Anda untuk melayani pertanyaan pelanggan seputar ketersediaan
                daster, detail bahan, jam buka, dan jaminan retur.
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-linen/60">Penyedia Model</span>
                <span className="font-semibold text-linen">
                  Groq Cloud LLM
                </span>
              </div>
              <Link
                href="/admin/dashboard/chatbot"
                className="w-full py-3.5 bg-white/10 hover:bg-terracotta text-linen hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-white/5"
              >
                <span>Kelola Memori Chatbot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
