"use client";

import { useState, useEffect } from "react";
import { galleryService } from "@/services/gallery.service";
import type { GalleryItem } from "@/types";
import SectionHeading from "../ui/section-heading";
import GalleryCard from "../ui/gallery-card";
import Button from "../ui/button";
import { Camera } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function GalleryPreview() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    galleryService
      .getAll()
      .then((res) => {
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          setItems(res.data.data.slice(0, 4));
        }
      })
      .catch((err) => {
        console.error("Failed to load gallery items from API:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="section-padding">
        <SectionHeading
          title="Galeri mbaQul"
          subtitle="Koleksi dan suasana di balik layar."
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center text-soft-brown py-12">
            Belum ada foto galeri yang tersedia.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
            {items.map((item, index) => (
              <GalleryCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link href="/galeri">
            <Button size="lg" className="group">
              <Camera className="w-5 h-5 mr-3 transition-transform group-hover:rotate-12" />
              Lihat Galeri Lengkap
            </Button>
          </Link>
        </div>
      </div>

      {/* Moving Text Decoration */}
      <div className="relative mt-20 py-8 border-y border-terracotta/10 overflow-hidden whitespace-nowrap opacity-20 select-none">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-20 text-6xl md:text-8xl font-display font-bold uppercase"
        >
          <span>Simple</span>
          <span>Nyaman</span>
          <span>Tetap Cantik</span>
          <span>Simple</span>
          <span>Nyaman</span>
          <span>Tetap Cantik</span>
          <span>Simple</span>
          <span>Nyaman</span>
          <span>Tetap Cantik</span>
        </motion.div>
      </div>
    </section>
  );
}
