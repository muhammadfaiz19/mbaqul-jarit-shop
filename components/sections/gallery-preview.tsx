"use client";

import { galleryItems, microcopy } from "@/lib/data";
import SectionHeading from "../ui/section-heading";
import GalleryCard from "../ui/gallery-card";
import Button from "../ui/button";
import { Camera } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function GalleryPreview() {
  const items = galleryItems.slice(0, 4);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="section-padding">
        <SectionHeading
          title="Galeri mbaQul"
          subtitle={microcopy.gallerySection}
        />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {items.map((item, index) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={index}
            />
          ))}
        </div>

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
