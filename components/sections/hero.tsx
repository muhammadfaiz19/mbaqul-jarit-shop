"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { WhatsAppIcon } from "../ui/icons";
import { settingsService } from "@/services/settings.service";
import Button from "../ui/button";
import BlobDecoration from "../ui/blob-decoration";

export default function Hero() {
  const [hero, setHero] = useState({
    headline: "Elegansi Harian Tanpa Batas",
    subtext: "Menghadirkan jarit modern premium dengan sentuhan motif klasik Indonesia yang dinamis dan anggun.",
    ctaPrimary: "Lihat Koleksi",
    ctaSecondary: "Hubungi Kami",
  });
  const [waNumber, setWaNumber] = useState("");

  useEffect(() => {
    settingsService.get()
      .then(res => {
        if (res.data.success && res.data.data) {
          const s = res.data.data;
          setHero({
            headline: s.heroHeadline || "Elegansi Harian Tanpa Batas",
            subtext: s.heroSubtext || "Menghadirkan jarit modern premium dengan sentuhan motif klasik Indonesia yang dinamis dan anggun.",
            ctaPrimary: s.heroCtaPrimary || "Lihat Koleksi",
            ctaSecondary: s.heroCtaSecondary || "Hubungi Kami",
          });
          if (s.whatsappNumber) {
            setWaNumber(s.whatsappNumber);
          }
        }
      })
      .catch(err => {
        console.error("Failed to load settings in Hero:", err);
      });
  }, []);
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden">
      {/* Decorations */}
      <BlobDecoration variant={1} className="w-[500px] h-[500px] -top-20 -left-20" />
      <BlobDecoration variant={2} color="var(--color-blush)" className="w-[400px] h-[400px] bottom-0 right-0" delay={0.5} />
      
      <div className="section-padding grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-block px-4 py-2 rounded-full bg-terracotta/10 text-terracotta font-bold text-sm tracking-widest uppercase mb-6"
          >
            New Collection 2024
          </motion.span>
           <h1 className="text-5xl md:text-7xl lg:text-8xl font-display leading-[1.1] mb-8">
            {hero.headline}
          </h1>
          <p className="text-lg md:text-xl text-soft-brown mb-10 max-w-lg leading-relaxed">
            {hero.subtext} — Koleksi pilihan untuk kenyamanan harianmu tanpa mengorbankan gaya.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => window.location.href = '/produk'}>
              <ShoppingBag className="w-5 h-5 mr-3" />
              {hero.ctaPrimary}
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.open(`https://wa.me/${waNumber}`, '_blank')}>
              <WhatsAppIcon className="w-5 h-5 mr-3" />
              {hero.ctaSecondary}
            </Button>
          </div>

          <div className="mt-12 flex items-center gap-6 text-soft-brown">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-dusty-pink overflow-hidden">
                  <Image src={`/gallery/lookbook-${i}.webp`} alt="User" width={40} height={40} className="object-cover" />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium">
              <span className="text-dark font-bold">500+</span> Pelanggan Puas
            </p>
          </div>
        </motion.div>

        {/* Visual Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative aspect-square md:aspect-square lg:aspect-square"
        >
          {/* Main Image Frame */}
          <div className="absolute inset-4 rounded-[4rem] overflow-hidden shadow-2xl z-10">
            <Image
              src="/gallery/lookbook-1.webp"
              alt="mbaQul Jarit Hero"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
          
          {/* Floating Card */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md p-6 organic-radius shadow-xl z-20 hidden sm:block border border-white"
          >
            <p className="text-terracotta font-bold text-sm mb-1">Premium Quality</p>
            <p className="text-dark font-display text-lg">Katun Rayon Pilihan</p>
          </motion.div>

          {/* Decorative Ring */}
          <div className="absolute inset-0 border-16 border-terracotta/10 rounded-[5rem] translate-x-8 translate-y-8 z-0" />
        </motion.div>
      </div>
    </section>
  );
}
