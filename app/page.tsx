import Hero from "@/components/sections/hero";
import Categories from "@/components/sections/categories";
import FeaturedProducts from "@/components/sections/featured-products";
import AboutPreview from "@/components/sections/about-preview";
import GalleryPreview from "@/components/sections/gallery-preview";
import FAQ from "@/components/sections/faq";
import CTABanner from "@/components/sections/cta-banner";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <AboutPreview />
      <GalleryPreview />
      <FAQ />
      <CTABanner />
    </div>
  );
}
