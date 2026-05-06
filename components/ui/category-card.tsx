"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  className?: string;
  index?: number;
}

export default function CategoryCard({
  category,
  className,
  index = 0,
}: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Link
        href={`/produk?cat=${category.slug}`}
        className={cn(
          "group h-full flex flex-col p-8 bg-white/60 hover:bg-white organic-radius border border-terracotta/10 hover:border-terracotta/30 transition-all duration-500 text-center",
          className
        )}
      >
        <div className="relative w-24 h-24 mx-auto mb-6 overflow-hidden rounded-full border-4 border-white shadow-md transition-transform duration-500 group-hover:scale-110">
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
        <h3 className="text-xl font-display mb-2">{category.name}</h3>
        <p className="text-soft-brown text-sm grow">
          {category.description}
        </p>
        
        {/* Subtle indicator */}
        <div className="mt-6 flex justify-center items-center text-terracotta text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          Lihat Koleksi
          <svg className="w-4 h-4 ml-2 animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}
