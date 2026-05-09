"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import { settingsService } from "@/services/settings.service";
import { cn } from "@/lib/utils";
import Button from "../ui/button";

const NAV_ITEMS = [
  { label: "Beranda", href: "/" },
  { label: "Tentang", href: "/tentang" },
  { label: "Produk", href: "/produk" },
  { label: "Galeri", href: "/galeri" },
  { label: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [brandName, setBrandName] = React.useState("mbaQul Jarit");
  const [tiktokUrl, setTiktokUrl] = React.useState("");
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Fetch site settings
    settingsService.get()
      .then(res => {
        if (res.data.success && res.data.data) {
          if (res.data.data.brandName) setBrandName(res.data.data.brandName);
          if (res.data.data.tiktokUrl) setTiktokUrl(res.data.data.tiktokUrl);
        }
      })
      .catch(err => {
        console.error("Failed to fetch settings in Navbar:", err);
      });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6",
        scrolled ? "py-4" : "py-8",
      )}
    >
      <div
        className={cn(
          "relative z-50 max-w-7xl mx-auto flex items-center justify-between transition-all duration-500 px-6 py-3 rounded-full",
          scrolled
            ? "bg-white/70 backdrop-blur-lg shadow-md"
            : "bg-transparent",
        )}
      >
        {/* Logo */}
        <Link href="/" className="relative z-50 flex items-center gap-3">
          <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-terracotta/20">
            <Image
              src="/logo.png"
              alt={brandName}
              fill
              sizes="40px"
              priority
              className="object-cover"
            />
          </div>
          <span className="font-display text-lg sm:text-xl font-bold">
            {brandName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors relative py-1",
                pathname === item.href
                  ? "text-terracotta"
                  : "text-dark hover:text-terracotta",
              )}
            >
              {item.label}
              {pathname === item.href && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta rounded-full"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Action Button */}
        <div className="hidden md:block">
          <Button
            variant="whatsapp"
            size="sm"
            onClick={() => window.open(tiktokUrl, "_blank")}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Shop Now
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden relative z-50 p-2 text-dark"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-cream/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-2xl font-display",
                    pathname === item.href ? "text-terracotta" : "text-dark",
                  )}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: NAV_ITEMS.length * 0.1 }}
            >
              <Button
                variant="whatsapp"
                size="lg"
                className="mt-4"
                onClick={() => window.open(tiktokUrl, "_blank")}
              >
                <ShoppingBag className="w-5 h-5 mr-3" />
                TikTok Shop
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
