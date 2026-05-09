"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { settingsService } from "@/services/settings.service";
import SectionHeading from "../ui/section-heading";
import Button from "../ui/button";
import Link from "next/link";

export default function AboutPreview() {
  const [about, setAbout] = useState({
    title: "Tentang mbaQul",
    paragraphs: ["Menghadirkan jarit modern premium dengan sentuhan motif klasik Indonesia yang dinamis dan anggun."],
    values: [
      { title: "Kualitas", description: "Menggunakan bahan katun premium terbaik" },
      { title: "Kenyamanan", description: "Sangat adem dan nyaman dipakai seharian" },
      { title: "Elegan", description: "Desain modern dan modis yang up-to-date" },
    ],
  });

  useEffect(() => {
    settingsService.get()
      .then(res => {
        if (res.data.success && res.data.data) {
          const s = res.data.data;
          setAbout({
            title: s.aboutTitle || "Tentang mbaQul",
            paragraphs: (s.aboutParagraphs && s.aboutParagraphs.length > 0) ? s.aboutParagraphs : ["Menghadirkan jarit modern premium dengan sentuhan motif klasik Indonesia yang dinamis dan anggun."],
            values: (s.aboutValues && s.aboutValues.length > 0) ? s.aboutValues : [
              { title: "Kualitas", description: "Menggunakan bahan katun premium terbaik" },
              { title: "Kenyamanan", description: "Sangat adem dan nyaman dipakai seharian" },
              { title: "Elegan", description: "Desain modern dan modis yang up-to-date" },
            ],
          });
        }
      })
      .catch(err => {
        console.error("Failed to load settings in AboutPreview:", err);
      });
  }, []);

  return (
    <section className="py-24 bg-cream overflow-hidden">
      <div className="section-padding grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Visual Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative aspect-square md:aspect-4/3 rounded-[3rem] overflow-hidden z-10 shadow-2xl">
            <Image
              src="/gallery/bts-1.webp"
              alt="mbaQul Process"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          {/* Offset Decorative Frame */}
          <div className="absolute top-8 left-8 w-full h-full border-2 border-terracotta/20 rounded-[3rem] z-0 -translate-x-4 -translate-y-4" />
          
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-10 -right-10 w-40 h-40 z-20 hidden md:block"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full fill-terracotta/10">
              <path d="M50 5L60 40L95 50L60 60L50 95L40 60L5 50L40 40Z" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Text Side */}
        <div className="flex flex-col">
          <SectionHeading
            title={about.title}
            subtitle="Cerita Kami"
            align="left"
          />
          <div className="space-y-6 text-soft-brown text-lg leading-relaxed mb-10">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {about.values.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="p-4 rounded-2xl bg-white/50 border border-white"
              >
                <h4 className="font-bold text-dark mb-1 text-sm uppercase tracking-wide">{val.title}</h4>
                <p className="text-xs text-soft-brown leading-tight">{val.description}</p>
              </motion.div>
            ))}
          </div>

          <Link href="/produk">
            <Button variant="outline" className="w-fit">Belajari Koleksi</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
