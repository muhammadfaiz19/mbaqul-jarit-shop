"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { WhatsAppIcon } from "../ui/icons";
import { settingsService } from "@/services/settings.service";
import Button from "../ui/button";

export default function CTABanner() {
  const [waNumber, setWaNumber] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");

  useEffect(() => {
    settingsService.get()
      .then(res => {
        if (res.data.success && res.data.data) {
          const s = res.data.data;
          if (s.whatsappNumber) setWaNumber(s.whatsappNumber);
          if (s.tiktokUrl) setTiktokUrl(s.tiktokUrl);
        }
      })
      .catch(err => {
        console.error("Failed to load settings in CTABanner:", err);
      });
  }, []);
  return (
    <section className="section-padding">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative overflow-hidden bg-terracotta organic-radius p-12 md:p-24 text-center text-white shadow-2xl"
      >
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-dark/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-display mb-8 leading-tight">
            Sudah Menemukan Favoritmu?
          </h2>
          <p className="text-xl text-cream/80 mb-12 leading-relaxed">
            Pilih produk favoritmu sekarang. Pilih koleksi terbaik kami via WhatsApp atau TikTok Shop sekarang juga.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button
              variant="whatsapp"
              size="lg"
              className="bg-white text-whatsapp hover:bg-cream border-none shadow-xl"
              onClick={() => window.open(`https://wa.me/${waNumber}`, '_blank')}
            >
              <WhatsAppIcon className="w-6 h-6 mr-3" />
              Chat WhatsApp
            </Button>
            <Button
              variant="tiktok"
              size="lg"
              className="bg-dark text-white hover:bg-zinc-900 border-none shadow-xl"
              onClick={() => window.open(tiktokUrl, '_blank')}
            >
              <ShoppingBag className="w-6 h-6 mr-3" />
              TikTok Shop
            </Button>
          </div>
        </div>

        {/* Decorative Line Art */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 20 Q50 0 100 20 T200 20" fill="none" stroke="white" strokeWidth="0.5" />
          <path d="M0 50 Q50 30 100 50 T200 50" fill="none" stroke="white" strokeWidth="0.5" />
          <path d="M0 80 Q50 60 100 80 T200 80" fill="none" stroke="white" strokeWidth="0.5" />
        </svg>
      </motion.div>
    </section>
  );
}
