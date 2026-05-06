"use client";

import { categories, microcopy } from "@/lib/data";
import SectionHeading from "../ui/section-heading";
import CategoryCard from "../ui/category-card";
import BlobDecoration from "../ui/blob-decoration";

export default function Categories() {
  return (
    <section className="relative py-24 overflow-hidden bg-linen/30">
      <BlobDecoration variant={3} color="var(--color-mauve)" className="w-96 h-96 -top-20 -right-20 opacity-20" />
      
      <div className="section-padding relative z-10">
        <SectionHeading
          title="Koleksi Pilihan"
          subtitle={microcopy.categorySection}
        />
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.slug}
              category={category}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
