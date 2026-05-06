"use client";

import { products, microcopy } from "@/lib/data";
import SectionHeading from "../ui/section-heading";
import ProductCard from "../ui/product-card";
import Button from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FeaturedProducts() {
  const featured = products.filter(p => p.isFeatured).slice(0, 3);

  return (
    <section className="py-24 bg-white">
      <div className="section-padding">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeading
            title="Favorit mbaQul"
            subtitle={microcopy.featuredSection}
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
      </div>
    </section>
  );
}
