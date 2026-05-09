"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { settingsService } from "@/services/settings.service";
import type { SiteSettings } from "@/types";
import SectionHeading from "@/components/ui/section-heading";
import BlobDecoration from "@/components/ui/blob-decoration";

export default function TentangPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsService.get()
      .then(res => {
        if (res.data.success && res.data.data) {
          setSettings(res.data.data);
        }
      })
      .catch(err => {
        console.error("Failed to load settings in TentangPage:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-soft-brown font-medium">Memuat kisah kami...</p>
      </div>
    );
  }

  const aboutTitle = settings?.aboutTitle ?? "Tentang Kami";
  const paragraphs = settings?.aboutParagraphs ?? [];
  const quote = settings?.aboutQuote ?? "";
  const values = settings?.aboutValues ?? [];
  const target = settings?.aboutTarget ?? "";

  return (
    <div className="pt-32 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden mb-32">
        <BlobDecoration variant={2} className="w-[800px] h-[800px] -top-60 -right-60 opacity-30" />
        
        <div className="section-padding grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <SectionHeading
              title={aboutTitle}
              subtitle="Kisah Kami"
              align="left"
            />
            <div className="space-y-6 text-soft-brown text-lg leading-relaxed mb-12">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            
            {/* Elegant Quote Block */}
            {quote && (
              <div className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-terracotta/40">
                <p className="text-dark font-display text-2xl italic">
                  &quot;{quote}&quot;
                </p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-end"
          >
            {/* Main Image */}
            <div className="relative w-4/5 aspect-[3/4] rounded-t-full overflow-hidden shadow-2xl border-4 border-white z-10">
              <Image
                src="/gallery/lookbook-2.webp"
                alt="mbaQul Lifestyle"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority
              />
            </div>
            {/* Overlapping Secondary Image */}
            <div className="absolute left-0 bottom-10 w-1/2 aspect-square rounded-[2rem] overflow-hidden shadow-xl border-4 border-white z-20">
              <Image
                src="/gallery/bts-1.webp"
                alt="Behind the scenes"
                fill
                sizes="(max-width: 1024px) 50vw, 20vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section - Premium Editorial Layout */}
      {values.length > 0 && (
        <section className="bg-white py-32 border-y border-terracotta/5">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mb-20 text-center">
              <h2 className="text-4xl md:text-5xl font-display text-dark mb-4">Core Values</h2>
              <div className="w-24 h-1 bg-terracotta mx-auto mb-6"></div>
              <p className="text-soft-brown text-lg max-w-2xl mx-auto">Pilar utama yang selalu kami jaga dalam setiap helaian kain mbaQul Jarit Shop.</p>
            </div>
            
            <div className="flex flex-col border-t border-terracotta/10">
              {values.map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="group flex flex-col md:flex-row items-start md:items-center py-12 md:py-16 border-b border-terracotta/10 hover:px-8 transition-all duration-500 hover:bg-linen/20"
                >
                  {/* Huge Number */}
                  <span className="text-7xl md:text-8xl font-display font-light text-terracotta/10 group-hover:text-terracotta/30 transition-colors duration-500 md:w-48 shrink-0">
                    0{i + 1}
                  </span>

                  {/* Content */}
                  <div className="flex-1 mt-6 md:mt-0 md:pr-12">
                    <h3 className="text-3xl font-display mb-4 text-dark group-hover:text-terracotta transition-colors duration-300">
                      {val.title}
                    </h3>
                    <p className="text-lg text-soft-brown leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Target Section */}
      {target && (
        <section className="section-padding pt-32">
          <div className="relative overflow-hidden bg-dark rounded-[3rem] p-12 lg:p-24 flex flex-col md:flex-row items-center gap-12 border border-white/10 shadow-2xl">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            
            <div className="md:w-5/12 relative z-10">
              <h2 className="text-3xl lg:text-5xl font-display mb-6 text-white leading-tight">Siapa<br/>mbaQul?</h2>
              <div className="w-20 h-1 bg-terracotta mb-8"></div>
            </div>
            
            <div className="md:w-7/12 relative z-10 border-l border-white/20 pl-0 md:pl-12">
              <p className="text-xl lg:text-2xl text-cream/90 leading-relaxed font-light italic">
                &quot;{target}&quot;
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
