"use client";

import { useState, useEffect } from "react";
import { categoryService } from "@/services/category.service";
import type { Category } from "@/types";
import SectionHeading from "../ui/section-heading";
import CategoryCard from "../ui/category-card";
import BlobDecoration from "../ui/blob-decoration";

export default function Categories() {
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService.getAll()
      .then(res => {
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          setCategoriesList(res.data.data);
        }
      })
      .catch(err => {
        console.error("Failed to load categories from API:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <section className="relative py-24 overflow-hidden bg-linen/30">
      <BlobDecoration variant={3} color="var(--color-mauve)" className="w-96 h-96 -top-20 -right-20 opacity-20" />
      
      <div className="section-padding relative z-10">
        <SectionHeading
          title="Koleksi Pilihan"
          subtitle="Temukan pilihan busana ternyaman untukmu."
        />
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
          </div>
        ) : categoriesList.length === 0 ? (
          <div className="text-center text-soft-brown py-12">
            Belum ada kategori pilihan yang tersedia.
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {categoriesList.map((category, index) => (
              <CategoryCard
                key={category.slug}
                category={category}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
