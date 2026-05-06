"use client";

import { motion } from "framer-motion";
import { WhatsAppIcon } from "../ui/icons";
import { siteConfig } from "@/lib/data";

export default function FloatingWA() {
  return (
    <motion.a
      href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappDefaultMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-100 w-16 h-16 bg-whatsapp text-white rounded-full shadow-2xl flex items-center justify-center group"
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
