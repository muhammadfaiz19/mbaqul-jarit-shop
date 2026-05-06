"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import Button from "./button";

interface ProductCardProps {
  product: Product;
  className?: string;
  index?: number;
  priority?: boolean;
}

export default function ProductCard({
  product,
  className,
  index = 0,
  priority = false,
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={cn(
        "group relative flex flex-col bg-white organic-radius overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500",
        className
      )}
    >
      {/* Image Container */}
      <Link href={`/produk/${product.slug}`} className="relative aspect-square overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/10 transition-colors duration-500" />
        
        {/* Category Tag */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-terracotta uppercase tracking-wider">
          {product.category}
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col grow">
        <Link href={`/produk/${product.slug}`}>
          <h3 className="text-xl font-display mb-2 group-hover:text-terracotta transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-soft-brown text-sm line-clamp-2 mb-6 grow">
          {product.description}
        </p>

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <Button
            variant="whatsapp"
            size="sm"
            className="rounded-xl px-2"
            onClick={() => window.open(`https://wa.me/${6281234567890}?text=${encodeURIComponent(product.whatsappMessage)}`, '_blank')}
          >
            <WhatsAppIcon className="w-4 h-4 mr-2" />
            <span className="text-xs">Chat</span>
          </Button>
          <Button
            variant="tiktok"
            size="sm"
            className="rounded-xl px-2"
            onClick={() => window.open(product.tiktokUrl, '_blank')}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            <span className="text-xs">Beli</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
