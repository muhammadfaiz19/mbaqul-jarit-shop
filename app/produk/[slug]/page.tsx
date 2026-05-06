"use client";

import * as React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Ruler, Info, ArrowLeft } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { products, siteConfig, microcopy } from "@/lib/data";
import Button from "@/components/ui/button";
import ProductCard from "@/components/ui/product-card";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DetailProdukPage() {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);
  const [activeImage, setActiveImage] = React.useState(0);

  if (!product) return (
    <div className="pt-40 pb-24 text-center">
      <h1 className="text-3xl font-display mb-4">Produk tidak ditemukan</h1>
      <Link href="/produk">
        <Button variant="outline">Kembali ke Produk</Button>
      </Link>
    </div>
  );

  const related = products
    .filter(p => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  return (
    <div className="pt-32 pb-24">
      <div className="section-padding">
        {/* Breadcrumb / Back */}
        <Link href="/produk" className="inline-flex items-center text-soft-brown hover:text-terracotta mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Katalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Left: Gallery */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-[3rem] overflow-hidden shadow-xl"
            >
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </motion.div>
            
            {product.images.length > 1 && (
              <div className="flex gap-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "relative w-24 aspect-square rounded-2xl overflow-hidden border-2 transition-all",
                      activeImage === i ? "border-terracotta shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image src={img} alt={product.name} fill sizes="100px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-terracotta/10 text-terracotta font-bold text-xs uppercase tracking-widest mb-4">
              {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-display mb-6 leading-tight">
              {product.name}
            </h1>
            
            <div className="space-y-6 text-soft-brown text-lg leading-relaxed mb-10">
              <p>{product.fullDescription}</p>
            </div>

            {/* Product Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12 py-8 border-y border-terracotta/10">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-cream">
                  <Info className="w-6 h-6 text-terracotta" />
                </div>
                <div>
                  <h4 className="font-bold text-dark text-sm uppercase tracking-wider mb-1">Bahan</h4>
                  <p className="text-soft-brown">{product.material}</p>
                </div>
              </div>
              
              {product.sizes && (
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-cream">
                    <Ruler className="w-6 h-6 text-terracotta" />
                  </div>
                  <div>
                    <h4 className="font-bold text-dark text-sm uppercase tracking-wider mb-1">Ukuran</h4>
                    <p className="text-soft-brown">{product.sizes.join(", ")}</p>
                  </div>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="whatsapp"
                size="lg"
                className="grow shadow-lg"
                onClick={() => window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(product.whatsappMessage)}`, '_blank')}
              >
                <WhatsAppIcon className="w-6 h-6 mr-3" />
                Beli via WhatsApp
              </Button>
              <Button
                variant="tiktok"
                size="lg"
                className="grow shadow-lg"
                onClick={() => window.open(product.tiktokUrl, '_blank')}
              >
                <ShoppingBag className="w-6 h-6 mr-3" />
                Checkout di TikTok
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="pt-24 border-t border-terracotta/10">
            <h3 className="text-3xl font-display mb-12 text-center md:text-left">
              {microcopy.relatedProducts}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {related.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
