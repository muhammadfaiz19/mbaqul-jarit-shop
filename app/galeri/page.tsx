"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { galleryService } from "@/services/gallery.service";
import type { GalleryItem } from "@/types";
import SectionHeading from "@/components/ui/section-heading";
import GalleryCard from "@/components/ui/gallery-card";
import { cn } from "@/lib/utils";

export default function GaleriPage() {
  const [filter, setFilter] = React.useState("semua");
  const [galleryList, setGalleryList] = React.useState<GalleryItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    galleryService
      .getAll()
      .then((res) => {
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          setGalleryList(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load gallery items in public page:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filters = [
    { label: "Semua", value: "semua" },
    { label: "Lifestyle", value: "lifestyle" },
    { label: "Behind the Scenes", value: "behind-the-scenes" },
    { label: "Produk", value: "produk" },
  ];

  const filteredItems =
    filter === "semua"
      ? galleryList
      : galleryList.filter((item) => {
          if (filter === "lifestyle") return item.category === "lifestyle";
          if (filter === "behind-the-scenes")
            return item.category === "behind-the-scenes";
          if (filter === "produk")
            return !["lifestyle", "behind-the-scenes"].includes(
              item.category || "",
            );
          return false;
        });

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="section-padding">
        <SectionHeading
          title="Galeri Inspirasi"
          subtitle="Koleksi dan suasana di balik layar."
        />

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-bold transition-all duration-300",
                filter === f.value
                  ? "bg-terracotta text-white shadow-md"
                  : "bg-white text-soft-brown hover:bg-cream border border-terracotta/10",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Masonry-like Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6"
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item, i) => {
                  // Berikan variasi aspect ratio agar terlihat seperti masonry asli
                  const aspects = [
                    "aspect-[3/4]",
                    "aspect-square",
                    "aspect-[4/5]",
                    "aspect-square",
                    "aspect-[4/3]",
                  ];
                  const aspectClass = aspects[i % aspects.length];

                  return (
                    <GalleryCard
                      key={item.id}
                      item={item}
                      index={i}
                      priority={i < 4}
                      className={cn("break-inside-avoid w-full", aspectClass)}
                    />
                  );
                })
              ) : (
                <div className="col-span-full py-24 text-center">
                  <p className="text-xl text-soft-brown">
                    Belum ada foto galeri yang tersedia.
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
