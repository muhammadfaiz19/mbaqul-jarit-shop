"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { settingsService } from "@/services/settings.service";
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
  const [waNumber, setWaNumber] = useState("6281234567890");

  useEffect(() => {
    settingsService
      .get()
      .then((res) => {
        if (res.data.success && res.data.data?.whatsappNumber) {
          setWaNumber(res.data.data.whatsappNumber);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={cn(
        "group relative flex flex-col bg-white organic-radius overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500",
        className,
      )}
    >
      {/* Image Container */}
      <Link
        href={`/produk/${product.slug}`}
        className="relative aspect-square overflow-hidden"
      >
        <Image
          src={
            product.images && product.images[0]
              ? product.images[0].includes("/uploads/")
                ? product.images[0].substring(
                    product.images[0].indexOf("/uploads/"),
                  )
                : product.images[0].startsWith("http") ||
                    product.images[0].startsWith("/")
                  ? product.images[0]
                  : `/uploads/${product.images[0]}`
              : "/images/placeholder.webp"
          }
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/10 transition-colors duration-500" />

        {/* Category Tag */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-terracotta uppercase tracking-wider">
          {typeof product.category === "object" ? product.category?.name : (product.category || "Lainnya")}
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
        <div className="flex gap-2 mt-auto">
          <Button
            variant="whatsapp"
            size="sm"
            className="flex-1 rounded-xl px-2"
            onClick={() =>
              window.open(
                `https://wa.me/${waNumber}?text=${encodeURIComponent(product.whatsappMessage || `Halo Kak, saya tertarik dengan produk ${product.name}. Apakah masih tersedia?`)}`,
                "_blank",
              )
            }
          >
            <WhatsAppIcon className="w-4 h-4 mr-1" />
            <span className="text-[10px] md:text-xs">Chat</span>
          </Button>
          {product.tiktokUrl && (
            <Button
              variant="tiktok"
              size="sm"
              className="flex-1 rounded-xl px-2"
              onClick={() => window.open(product.tiktokUrl, "_blank")}
            >
              <ShoppingBag className="w-4 h-4 mr-1" />
              <span className="text-[10px] md:text-xs">TikTok</span>
            </Button>
          )}
          {product.shopeeUrl && (
            <Button
              variant="shopee"
              size="sm"
              className="flex-1 rounded-xl px-2"
              onClick={() => window.open(product.shopeeUrl, "_blank")}
            >
              <ShoppingBag className="w-4 h-4 mr-1" />
              <span className="text-[10px] md:text-xs">Shopee</span>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
