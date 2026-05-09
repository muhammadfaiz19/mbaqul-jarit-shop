"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { WhatsAppIcon } from "../ui/icons";
import { usePathname } from "next/navigation";
import { settingsService } from "@/services/settings.service";
import type { SiteSettings } from "@/types";

const NAV_ITEMS = [
  { label: "Beranda", href: "/" },
  { label: "Tentang", href: "/tentang" },
  { label: "Produk", href: "/produk" },
  { label: "Galeri", href: "/galeri" },
  { label: "Kontak", href: "/kontak" },
];

export default function Footer() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    settingsService.get()
      .then(res => {
        if (res.data.success && res.data.data) {
          setSettings(res.data.data);
        }
      })
      .catch(err => {
        console.error("Failed to load settings in Footer:", err);
      });
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const brandName = settings?.brandName ?? "mbaQul Jarit";
  const tagline = settings?.tagline ?? "Menghadirkan kenyamanan dan gaya harian untuk wanita Indonesia.";
  const tiktokUrl = settings?.tiktokUrl ?? "";
  const whatsappNumber = settings?.whatsappNumber ?? "";
  const operationalHours = settings?.operationalHours ?? "Senin - Sabtu: 08:00 - 17:00";
  const currentYear = new Date().getFullYear();
  const copyrightText = `© ${currentYear} ${brandName}. Hak Cipta Dilindungi.`;

  // Find instagram if exists in settings.socialLinks
  const instagramUrl = settings?.socialLinks?.find(l => l.platform.toLowerCase() === "instagram")?.url ?? "#";

  return (
    <footer className="bg-white pt-24 pb-12 px-6 border-t border-terracotta/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand Col */}
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-3 mb-6">
            <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-terracotta/20">
              <Image
                src="/logo.png"
                alt={brandName}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <span className="font-display text-2xl font-bold">
              {brandName}
            </span>
          </Link>
          <p className="text-soft-brown text-lg max-w-sm mb-8">
            {tagline}
          </p>
          <div className="flex gap-4">
            {tiktokUrl && (
              <Link href={tiktokUrl} className="w-10 h-10 rounded-full bg-dark text-white flex items-center justify-center hover:bg-terracotta transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </Link>
            )}
            {whatsappNumber && (
              <Link href={`https://wa.me/${whatsappNumber}`} className="w-10 h-10 rounded-full bg-whatsapp text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                <WhatsAppIcon className="w-5 h-5" />
              </Link>
            )}
            {instagramUrl && instagramUrl !== "#" && (
              <Link href={instagramUrl} className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Links Col */}
        <div>
          <h4 className="font-display text-xl mb-6">Navigasi</h4>
          <ul className="space-y-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-soft-brown hover:text-terracotta transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info Col */}
        <div>
          <h4 className="font-display text-xl mb-6">Informasi</h4>
          <ul className="space-y-4 text-soft-brown">
            <li>
              <span className="block font-bold text-dark text-sm uppercase tracking-wider mb-1">Jam Operasional</span>
              {operationalHours}
            </li>
            {whatsappNumber && (
              <li>
                <span className="block font-bold text-dark text-sm uppercase tracking-wider mb-1">Kontak WhatsApp</span>
                +{whatsappNumber}
              </li>
            )}
            <li>
              <span className="block font-bold text-dark text-sm uppercase tracking-wider mb-1">Lokasi</span>
              Cirebon, Indonesia
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-terracotta/10 text-center md:flex md:justify-between md:text-left">
        <p className="text-soft-brown text-sm mb-4 md:mb-0">
          {copyrightText}
        </p>
        <p className="text-soft-brown text-sm">
          Fashion lokal yang mengutamakan kenyamanan harian.
        </p>
      </div>
    </footer>
  );
}
