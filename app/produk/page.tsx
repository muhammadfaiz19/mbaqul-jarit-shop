"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { products, categories, microcopy } from "@/lib/data";
import SectionHeading from "@/components/ui/section-heading";
import ProductCard from "@/components/ui/product-card";
import { cn } from "@/lib/utils";

function ProdukContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "semua";
  const [activeCategory, setActiveCategory] = React.useState(initialCat);

  const filteredProducts = activeCategory === "semua"
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-linen/10">
      <div className="section-padding">
        <SectionHeading
          title="Koleksi Pakaian"
          subtitle="Katalog Lengkap"
        />

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <button
            onClick={() => setActiveCategory("semua")}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-bold transition-all duration-300",
              activeCategory === "semua"
                ? "bg-terracotta text-white shadow-md"
                : "bg-white text-soft-brown hover:bg-cream border border-terracotta/10"
            )}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 capitalize",
                activeCategory === cat.slug
                  ? "bg-terracotta text-white shadow-md"
                  : "bg-white text-soft-brown hover:bg-cream border border-terracotta/10"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, i) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  index={i}
                  priority={i < 4}
                />
              ))
            ) : (
              <div className="col-span-full py-24 text-center">
                <p className="text-xl text-soft-brown">{microcopy.productListEmpty}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ProdukPage() {
  return (
    <React.Suspense fallback={
      <div className="pt-32 pb-24 min-h-screen bg-linen/10 flex items-center justify-center">
        <p className="text-soft-brown font-medium animate-pulse">Memuat katalog produk...</p>
      </div>
    }>
      <ProdukContent />
    </React.Suspense>
  );
}
