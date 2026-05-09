"use client";

import { useState, useEffect } from "react";
import { productService } from "@/services/product.service";
import type { Product } from "@/types";
import SectionHeading from "../ui/section-heading";
import ProductCard from "../ui/product-card";
import Button from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService
      .getFeatured()
      .then((res) => {
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          setFeatured(res.data.data.slice(0, 3));
        }
      })
      .catch((err) => {
        console.error("Failed to load featured products from API:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="section-padding">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeading
            title="Favorit mbaQul"
            subtitle="Koleksi favorit pelanggan kami."
            align="left"
            className="mb-0"
          />
          <Link href="/produk" className="mt-6 md:mt-0">
            <Button variant="ghost" className="group">
              Lihat Semua Produk
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center text-soft-brown py-12">
            Belum ada produk unggulan yang tersedia.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {featured.map((product, index) => (
              <ProductCard
                key={product.slug}
                product={product}
                index={index}
                priority={true}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
