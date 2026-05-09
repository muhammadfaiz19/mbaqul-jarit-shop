"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, MapPin, Clock, Send } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { settingsService } from "@/services/settings.service";
import type { SiteSettings } from "@/types";
import SectionHeading from "@/components/ui/section-heading";
import Button from "@/components/ui/button";

export default function KontakPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
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
        console.error("Failed to load settings in KontakPage:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) {
      alert("Mohon isi nama dan pesan Anda terlebih dahulu.");
      return;
    }
    
    const textTemplate = `Halo mbaQul, saya *${name}*.\n\n${message}`;
    const whatsappUrl = `https://wa.me/${settings?.whatsappNumber ?? ""}?text=${encodeURIComponent(textTemplate)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-soft-brown font-medium">Memuat kontak...</p>
      </div>
    );
  }

  const operationalHours = settings?.operationalHours ?? "Senin - Sabtu: 08:00 - 17:00";
  const whatsappNumber = settings?.whatsappNumber ?? "";
  const tiktokUrl = settings?.tiktokUrl ?? "";

  return (
    <div className="pt-32 pb-24 min-h-[calc(100vh-80px)] bg-linen/30 flex items-center">
      <div className="section-padding w-full">
        <SectionHeading
          title="Hubungi mbaQul"
          subtitle="Mau tanya-tanya dulu? Chat aja!"
        />

        <div className="max-w-6xl mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-terracotta/10">
          
          {/* Left: Aesthetic Image & Info Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-5/12 relative min-h-[400px] lg:min-h-full flex flex-col justify-end p-10 overflow-hidden text-white"
          >
            <Image 
              src="/gallery/lookbook-3.webp" 
              alt="Contact Background" 
              fill 
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent" />
            
            <div className="relative z-10 mt-auto">
              <h3 className="text-3xl font-display mb-8">Informasi<br/>Toko</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-white/80">Jam Kerja</h4>
                    <p className="text-white text-sm leading-relaxed">{operationalHours}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-white/80">Lokasi Kami</h4>
                    <p className="text-white text-sm leading-relaxed">Cirebon, Jawa Barat<br/>(Pengiriman Seluruh Indonesia)</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Actions & Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-7/12 p-10 md:p-14 lg:p-16 flex flex-col justify-center relative bg-white"
          >
            {/* Dekorasi Air */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-dusty-pink/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Button
                variant="whatsapp"
                size="lg"
                className="w-full h-16 shadow-md hover:-translate-y-1 transition-transform"
                onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
              >
                <WhatsAppIcon className="w-6 h-6 mr-3" />
                Chat WhatsApp
              </Button>
              <Button
                variant="tiktok"
                size="lg"
                className="w-full h-16 shadow-md hover:-translate-y-1 transition-transform"
                onClick={() => window.open(tiktokUrl, '_blank')}
              >
                <ShoppingBag className="w-6 h-6 mr-3" />
                Kunjungi TikTok
              </Button>
            </div>

            <div className="relative flex items-center py-6 mb-6">
              <div className="flex-grow border-t border-terracotta/10"></div>
              <span className="shrink-0 px-4 text-soft-brown text-sm font-medium uppercase tracking-widest">Atau Tinggalkan Pesan</span>
              <div className="flex-grow border-t border-terracotta/10"></div>
            </div>
            
            <form className="space-y-6" onSubmit={handleSendMessage}>
              <div className="group">
                <label className="block text-xs font-bold text-dark uppercase tracking-widest mb-2 group-focus-within:text-terracotta transition-colors">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama Anda"
                  className="w-full px-5 py-4 rounded-xl bg-linen border border-transparent focus:border-terracotta/40 focus:bg-white outline-none transition-all placeholder:text-soft-brown/40"
                  required
                />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-dark uppercase tracking-widest mb-2 group-focus-within:text-terracotta transition-colors">Isi Pesan</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan pertanyaan atau pesan Anda..."
                  className="w-full px-5 py-4 rounded-xl bg-linen border border-transparent focus:border-terracotta/40 focus:bg-white outline-none transition-all placeholder:text-soft-brown/40 resize-none"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-14 mt-4 shadow-lg hover:-translate-y-1 transition-transform">
                <Send className="w-5 h-5 mr-3" />
                Kirim Pesan Sekarang
              </Button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
