"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GalleryItem } from "@/types";
import { cn } from "@/lib/utils";

interface GalleryCardProps {
  item: GalleryItem;
  className?: string;
  index?: number;
  priority?: boolean;
}

export default function GalleryCard({
  item,
  className,
  index = 0,
  priority = false,
}: GalleryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className={cn(
        "group relative overflow-hidden organic-radius bg-linen shadow-sm cursor-pointer",
        !className?.includes("aspect") && "aspect-square",
        className
      )}
    >
      <Image
        src={item.image}
        alt={item.alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
        <span className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
          {item.category}
        </span>
        <p className="text-white font-medium text-sm">
          {item.caption}
        </p>
      </div>

      {/* Line Art Decoration (Overlay) */}
      <div className="absolute top-4 right-4 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-white/40 stroke-2">
          <circle cx="50" cy="50" r="40" />
          <path d="M50 20V80M20 50H80" />
        </svg>
      </div>
    </motion.div>
  );
}
