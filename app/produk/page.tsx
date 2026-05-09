"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import type { Product, Category } from "@/types";
import SectionHeading from "@/components/ui/section-heading";
import ProductCard from "@/components/ui/product-card";
import { cn } from "@/lib/utils";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";

function ProdukContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search parameters from URL
  const initialCat = searchParams.get("cat") || "semua";
  const initialSearch = searchParams.get("search") || "";
  const initialPage = parseInt(searchParams.get("page") || "1") || 1;

  // React State
  const [productsList, setProductsList] = React.useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = React.useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = React.useState(initialCat);
  const [searchVal, setSearchVal] = React.useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = React.useState(initialSearch);
  const [page, setPage] = React.useState(initialPage);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchVal);
      setPage(1); // Reset to first page when search changes
    }, 400);
    return () => clearTimeout(timer);
  }, [searchVal]);

  // Sync URL params when category, search, or page changes
  React.useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory !== "semua") params.set("cat", activeCategory);
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (page > 1) params.set("page", String(page));

    const queryStr = params.toString();
    router.replace(`/produk${queryStr ? `?${queryStr}` : ""}`, {
      scroll: false,
    });
  }, [activeCategory, debouncedSearch, page, router]);

  // Fetch categories
  React.useEffect(() => {
    categoryService
      .getAll()
      .then((res) => {
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          setCategoriesList(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch products live
  React.useEffect(() => {
    setLoading(true);
    const queryCat = activeCategory === "semua" ? undefined : activeCategory;

    productService
      .getAll({
        category: queryCat,
        search: debouncedSearch || undefined,
        page,
        limit: 6,
      })
      .then((res) => {
        if (res.data.success && res.data.data) {
          setProductsList(res.data.data);
          setTotalPages(res.data.meta?.totalPages || 1);
          setTotalItems(res.data.meta?.total || res.data.data.length);
        } else {
          setProductsList([]);
          setTotalPages(1);
          setTotalItems(0);
        }
      })
      .catch((err) => {
        console.error("Failed to load products from API:", err);
        setProductsList([]);
        setTotalPages(1);
        setTotalItems(0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeCategory, debouncedSearch, page]);

  const handleCategoryClick = (catSlug: string) => {
    setActiveCategory(catSlug);
    setPage(1); // Reset page index
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-linen/10">
      <div className="section-padding">
        <SectionHeading
          title="Koleksi Busana"
          subtitle="Katalog Lengkap & Belanja via Chat"
        />

        {/* Toolbar: Search input & quick details */}
        <div className="max-w-4xl mx-auto mb-10 grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Field */}
          <div className="md:col-span-8 relative">
            <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-brown/60" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Cari daster rayon, kemeja, tunik manis..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-terracotta/10 hover:border-terracotta/30 focus:border-terracotta rounded-full focus:outline-none transition-all text-sm font-body text-dark shadow-sm"
            />
          </div>

          {/* Results Info Counter */}
          <div className="md:col-span-4 flex items-center justify-center md:justify-end text-xs font-bold uppercase tracking-wider text-soft-brown">
            <SlidersHorizontal className="w-4 h-4 mr-2 text-terracotta" />
            <span>Menampilkan {totalItems} Koleksi</span>
          </div>
        </div>

        {/* Filter Pills Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <button
            onClick={() => handleCategoryClick("semua")}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer",
              activeCategory === "semua"
                ? "bg-terracotta text-white shadow-md shadow-terracotta/10"
                : "bg-white text-soft-brown hover:bg-cream border border-terracotta/10",
            )}
          >
            Semua
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryClick(cat.slug)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 capitalize cursor-pointer",
                activeCategory === cat.slug
                  ? "bg-terracotta text-white shadow-md shadow-terracotta/10"
                  : "bg-white text-soft-brown hover:bg-cream border border-terracotta/10",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Catalog Grid Area */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center min-h-[40vh]">
            <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-soft-brown font-semibold">
              Memperbarui katalog...
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${debouncedSearch}-${page}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-16"
            >
              {productsList.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {productsList.map((product, i) => (
                      <ProductCard
                        key={product.slug}
                        product={product}
                        index={i}
                        priority={i < 3}
                      />
                    ))}
                  </div>

                  {/* Dynamic Numeric Pagination controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-6">
                      {/* Prev Button */}
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2.5 rounded-xl bg-white text-soft-brown border border-terracotta/10 hover:border-terracotta disabled:opacity-40 transition-all cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      {/* Numeric page items */}
                      {Array.from({ length: totalPages }, (_, index) => {
                        const pageNum = index + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={cn(
                              "w-10.5 h-10.5 rounded-xl text-xs font-bold transition-all cursor-pointer border",
                              page === pageNum
                                ? "bg-terracotta border-terracotta text-white shadow-md shadow-terracotta/10"
                                : "bg-white border-terracotta/10 text-soft-brown hover:border-terracotta",
                            )}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      {/* Next Button */}
                      <button
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                        className="p-2.5 rounded-xl bg-white text-soft-brown border border-terracotta/10 hover:border-terracotta disabled:opacity-40 transition-all cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-24 text-center">
                  <p className="text-xl text-soft-brown font-display font-medium">
                    Koleksi tidak ditemukan.
                  </p>
                  <p className="text-xs text-soft-brown/70 mt-2 font-body">
                    Coba gunakan kata kunci pencarian atau kategori lain.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default function ProdukPage() {
  return (
    <React.Suspense
      fallback={
        <div className="pt-32 pb-24 min-h-screen bg-linen/10 flex items-center justify-center">
          <p className="text-soft-brown font-medium animate-pulse">
            Memuat katalog produk...
          </p>
        </div>
      }
    >
      <ProdukContent />
    </React.Suspense>
  );
}
