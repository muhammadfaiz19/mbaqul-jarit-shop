"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "../ui/icons";
import { settingsService } from "@/services/settings.service";

export default function FloatingWA() {
  const pathname = usePathname();
  const [waNumber, setWaNumber] = useState("");
  const [waMessage, setWaMessage] = useState("Halo mbaQul, saya tertarik dengan produk mbaQul Jarit.");

  useEffect(() => {
    settingsService.get()
      .then(res => {
        if (res.data.success && res.data.data) {
          if (res.data.data.whatsappNumber) {
            setWaNumber(res.data.data.whatsappNumber);
          }
        }
      })
      .catch(err => {
        console.error("Failed to fetch settings in FloatingWA:", err);
      });
  }, []);

  if (pathname.startsWith("/admin") || !waNumber) return null;

  return (
    <motion.a
      href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-whatsapp text-white rounded-full shadow-2xl flex items-center justify-center group cursor-pointer"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-whatsapp rounded-full opacity-20"
      />
      <WhatsAppIcon className="w-8 h-8 relative z-10" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-4 bg-white text-dark px-4 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden sm:block font-medium">
        Tanya mbaQul di sini! 👋
      </div>
    </motion.a>
  );
}
