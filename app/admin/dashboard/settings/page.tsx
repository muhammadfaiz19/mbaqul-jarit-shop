"use client";

import { useState, useEffect } from "react";
import { settingsService } from "@/services/settings.service";
import type { SiteSettings } from "@/types";
import {
  Settings,
  Save,
  Check,
  UserCheck,
  Megaphone,
  BookOpen,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ActiveTab = "general" | "hero" | "about" | "social";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("general");

  // Site Settings Form Fields
  const [brandName, setBrandName] = useState("");
  const [tagline, setTagline] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappDefaultMessage, setWhatsappDefaultMessage] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [tiktokHandle, setTiktokHandle] = useState("");
  const [operationalHours, setOperationalHours] = useState("");

  // Hero Fields
  const [heroHeadline, setHeroHeadline] = useState("");
  const [heroSubtext, setHeroSubtext] = useState("");
  const [heroCtaPrimary, setHeroCtaPrimary] = useState("");
  const [heroCtaSecondary, setHeroCtaSecondary] = useState("");

  // About Fields
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutParagraphsText, setAboutParagraphsText] = useState(""); // newline-separated
  const [aboutQuote, setAboutQuote] = useState("");
  const [aboutTarget, setAboutTarget] = useState("");
  const [aboutValue1Title, setAboutValue1Title] = useState("");
  const [aboutValue1Desc, setAboutValue1Desc] = useState("");
  const [aboutValue2Title, setAboutValue2Title] = useState("");
  const [aboutValue2Desc, setAboutValue2Desc] = useState("");
  const [aboutValue3Title, setAboutValue3Title] = useState("");
  const [aboutValue3Desc, setAboutValue3Desc] = useState("");

  // Social Links Fields
  const [socialTiktok, setSocialTiktok] = useState("");
  const [socialShopee, setSocialShopee] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");

  useEffect(() => {
    settingsService
      .get()
      .then((res) => {
        if (res.data.success && res.data.data) {
          const s = res.data.data;
          setBrandName(s.brandName);
          setTagline(s.tagline);
          setWhatsappNumber(s.whatsappNumber);
          setWhatsappDefaultMessage(s.whatsappDefaultMessage);
          setTiktokUrl(s.tiktokUrl || "");
          setTiktokHandle(s.tiktokHandle || "");
          setOperationalHours(s.operationalHours || "");

          setHeroHeadline(s.heroHeadline);
          setHeroSubtext(s.heroSubtext);
          setHeroCtaPrimary(s.heroCtaPrimary);
          setHeroCtaSecondary(s.heroCtaSecondary);

          setAboutTitle(s.aboutTitle);
          setAboutParagraphsText(s.aboutParagraphs?.join("\n\n") || "");
          setAboutQuote(s.aboutQuote);
          setAboutTarget(s.aboutTarget);

          setAboutValue1Title(s.aboutValues?.[0]?.title || "");
          setAboutValue1Desc(s.aboutValues?.[0]?.description || "");
          setAboutValue2Title(s.aboutValues?.[1]?.title || "");
          setAboutValue2Desc(s.aboutValues?.[1]?.description || "");
          setAboutValue3Title(s.aboutValues?.[2]?.title || "");
          setAboutValue3Desc(s.aboutValues?.[2]?.description || "");

          const tkLink = s.socialLinks?.find((l) => l.platform === "tiktok")?.url || "";
          const spLink = s.socialLinks?.find((l) => l.platform === "shopee")?.url || "";
          const igLink = s.socialLinks?.find((l) => l.platform === "instagram")?.url || "";
          setSocialTiktok(tkLink);
          setSocialShopee(spLink);
          setSocialInstagram(igLink);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch settings:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      // Split about paragraphs
      const paragraphs = aboutParagraphsText
        .split("\n")
        .map((p) => p.trim())
        .filter((p) => p !== "");

      // Format about values
      const aboutValues = [
        { title: aboutValue1Title, description: aboutValue1Desc },
        { title: aboutValue2Title, description: aboutValue2Desc },
        { title: aboutValue3Title, description: aboutValue3Desc },
      ].filter((v) => v.title !== "");

      // Format social links
      const socialLinks = [
        { platform: "tiktok", url: socialTiktok, icon: "ShoppingBag" },
        { platform: "shopee", url: socialShopee, icon: "ShoppingBag" },
        { platform: "instagram", url: socialInstagram, icon: "Instagram" },
      ].filter((s) => s.url !== "");

      const payload: Partial<SiteSettings> = {
        brandName,
        tagline,
        whatsappNumber,
        whatsappDefaultMessage,
        tiktokUrl,
        tiktokHandle,
        operationalHours,
        heroHeadline,
        heroSubtext,
        heroCtaPrimary,
        heroCtaSecondary,
        aboutTitle,
        aboutParagraphs: paragraphs,
        aboutQuote,
        aboutTarget,
        aboutValues,
        socialLinks,
      };

      const res = await settingsService.update(payload);
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
      alert("Gagal menyimpan konfigurasi situs.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark">
            Konfigurasi <span className="text-terracotta italic">Situs Utama</span>
          </h1>
          <p className="text-sm text-soft-brown">Sesuaikan informasi toko, teks hero banner, cerita tentang kami, dan sosial link.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/30 shadow-sm">
          <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-soft-brown font-medium">Memuat konfigurasi...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation vertical tabs */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
            <button
              onClick={() => setActiveTab("general")}
              className={cn(
                "flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 w-full whitespace-nowrap cursor-pointer",
                activeTab === "general"
                  ? "bg-terracotta text-white shadow-md shadow-terracotta/10"
                  : "bg-white/40 text-soft-brown hover:bg-white/70 border border-white/30"
              )}
            >
              <Settings className="w-4.5 h-4.5" />
              <span>Profil & Kontak</span>
            </button>
            <button
              onClick={() => setActiveTab("hero")}
              className={cn(
                "flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 w-full whitespace-nowrap cursor-pointer",
                activeTab === "hero"
                  ? "bg-terracotta text-white shadow-md shadow-terracotta/10"
                  : "bg-white/40 text-soft-brown hover:bg-white/70 border border-white/30"
              )}
            >
              <Megaphone className="w-4.5 h-4.5" />
              <span>Halaman Hero</span>
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={cn(
                "flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 w-full whitespace-nowrap cursor-pointer",
                activeTab === "about"
                  ? "bg-terracotta text-white shadow-md shadow-terracotta/10"
                  : "bg-white/40 text-soft-brown hover:bg-white/70 border border-white/30"
              )}
            >
              <BookOpen className="w-4.5 h-4.5" />
              <span>Tentang Kami</span>
            </button>
            <button
              onClick={() => setActiveTab("social")}
              className={cn(
                "flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 w-full whitespace-nowrap cursor-pointer",
                activeTab === "social"
                  ? "bg-terracotta text-white shadow-md shadow-terracotta/10"
                  : "bg-white/40 text-soft-brown hover:bg-white/70 border border-white/30"
              )}
            >
              <Share2 className="w-4.5 h-4.5" />
              <span>Tautan Toko</span>
            </button>
          </div>

          {/* Form wrapper */}
          <form onSubmit={handleSubmit} className="lg:col-span-9 bg-white/40 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-[2rem] border border-white/30 shadow-sm space-y-8">
            {/* Tab: General config */}
            {activeTab === "general" && (
              <div className="space-y-6 animate-fade-in">
                <div className="pb-4 border-b border-terracotta/10 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-terracotta" />
                  <h2 className="text-xl font-display font-bold text-dark">Profil Dasar & Kontak Pemesanan</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">Nama Brand</label>
                    <input
                      type="text"
                      required
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">Tagline / Slogan Brand</label>
                    <input
                      type="text"
                      required
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">No WhatsApp Pemesanan (Format: 628xxx)</label>
                    <input
                      type="text"
                      required
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">Jam Operasional Toko</label>
                    <input
                      type="text"
                      required
                      value={operationalHours}
                      onChange={(e) => setOperationalHours(e.target.value)}
                      placeholder="Contoh: Senin - Sabtu: 08:00 - 17:00"
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">Pesan WhatsApp Default Pengunjung</label>
                    <input
                      type="text"
                      required
                      value={whatsappDefaultMessage}
                      onChange={(e) => setWhatsappDefaultMessage(e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">Tiktok Handle Username</label>
                    <input
                      type="text"
                      value={tiktokHandle}
                      onChange={(e) => setTiktokHandle(e.target.value)}
                      placeholder="Contoh: @mbaquljarit"
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">Tiktok Toko Link</label>
                    <input
                      type="url"
                      value={tiktokUrl}
                      onChange={(e) => setTiktokUrl(e.target.value)}
                      placeholder="Contoh: https://www.tiktok.com/@mbaquljarit"
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Hero Banner */}
            {activeTab === "hero" && (
              <div className="space-y-6 animate-fade-in">
                <div className="pb-4 border-b border-terracotta/10 flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-terracotta" />
                  <h2 className="text-xl font-display font-bold text-dark">Headline Utama Hero Banner</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">Hero Headline</label>
                    <input
                      type="text"
                      required
                      value={heroHeadline}
                      onChange={(e) => setHeroHeadline(e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">Hero Subtext Deskripsi</label>
                    <textarea
                      required
                      value={heroSubtext}
                      onChange={(e) => setHeroSubtext(e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark h-24"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">Tombol CTA Utama</label>
                      <input
                        type="text"
                        required
                        value={heroCtaPrimary}
                        onChange={(e) => setHeroCtaPrimary(e.target.value)}
                        className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">Tombol CTA Sekunder</label>
                      <input
                        type="text"
                        required
                        value={heroCtaSecondary}
                        onChange={(e) => setHeroCtaSecondary(e.target.value)}
                        className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: About us section */}
            {activeTab === "about" && (
              <div className="space-y-6 animate-fade-in">
                <div className="pb-4 border-b border-terracotta/10 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-terracotta" />
                  <h2 className="text-xl font-display font-bold text-dark">Bagian Tentang Kami (Filosofi & Nilai)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">Tentang Kami Title</label>
                    <input
                      type="text"
                      required
                      value={aboutTitle}
                      onChange={(e) => setAboutTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">Cerita Narasi (Pisahkan paragraf dengan baris kosong ganda)</label>
                    <textarea
                      required
                      value={aboutParagraphsText}
                      onChange={(e) => setAboutParagraphsText(e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark h-40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">Kutipan Quote Filosofis</label>
                    <input
                      type="text"
                      required
                      value={aboutQuote}
                      onChange={(e) => setAboutQuote(e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">Target Konsumen Cerita</label>
                    <input
                      type="text"
                      required
                      value={aboutTarget}
                      onChange={(e) => setAboutTarget(e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                    />
                  </div>

                  {/* Nilai / Values */}
                  <div className="md:col-span-2 space-y-4">
                    <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-1 font-body">Nilai Utama Merek (3 Nilai)</label>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Value 1 */}
                      <div className="p-4 bg-white/40 border border-terracotta/10 rounded-2xl space-y-3">
                        <input
                          type="text"
                          value={aboutValue1Title}
                          onChange={(e) => setAboutValue1Title(e.target.value)}
                          placeholder="Nilai 1: Kenyamanan"
                          className="w-full px-3 py-2 bg-white/70 border border-white/20 rounded-xl text-xs font-bold font-body"
                        />
                        <textarea
                          value={aboutValue1Desc}
                          onChange={(e) => setAboutValue1Desc(e.target.value)}
                          placeholder="Keterangan..."
                          className="w-full px-3 py-2 bg-white/70 border border-white/20 rounded-xl text-xs font-body h-16 resize-none"
                        />
                      </div>

                      {/* Value 2 */}
                      <div className="p-4 bg-white/40 border border-terracotta/10 rounded-2xl space-y-3">
                        <input
                          type="text"
                          value={aboutValue2Title}
                          onChange={(e) => setAboutValue2Title(e.target.value)}
                          placeholder="Nilai 2: Jahitan Rapi"
                          className="w-full px-3 py-2 bg-white/70 border border-white/20 rounded-xl text-xs font-bold font-body"
                        />
                        <textarea
                          value={aboutValue2Desc}
                          onChange={(e) => setAboutValue2Desc(e.target.value)}
                          placeholder="Keterangan..."
                          className="w-full px-3 py-2 bg-white/70 border border-white/20 rounded-xl text-xs font-body h-16 resize-none"
                        />
                      </div>

                      {/* Value 3 */}
                      <div className="p-4 bg-white/40 border border-terracotta/10 rounded-2xl space-y-3">
                        <input
                          type="text"
                          value={aboutValue3Title}
                          onChange={(e) => setAboutValue3Title(e.target.value)}
                          placeholder="Nilai 3: Desain Eksklusif"
                          className="w-full px-3 py-2 bg-white/70 border border-white/20 rounded-xl text-xs font-bold font-body"
                        />
                        <textarea
                          value={aboutValue3Desc}
                          onChange={(e) => setAboutValue3Desc(e.target.value)}
                          placeholder="Keterangan..."
                          className="w-full px-3 py-2 bg-white/70 border border-white/20 rounded-xl text-xs font-body h-16 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Social / Marketplace link */}
            {activeTab === "social" && (
              <div className="space-y-6 animate-fade-in">
                <div className="pb-4 border-b border-terracotta/10 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-terracotta" />
                  <h2 className="text-xl font-display font-bold text-dark">Marketplace & Media Sosial Resmi</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">Link TikTok Shop</label>
                    <input
                      type="url"
                      value={socialTiktok}
                      onChange={(e) => setSocialTiktok(e.target.value)}
                      placeholder="https://tiktok.com/@..."
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">Link Shopee Toko</label>
                    <input
                      type="url"
                      value={socialShopee}
                      onChange={(e) => setSocialShopee(e.target.value)}
                      placeholder="https://shopee.co.id/..."
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">Link Instagram Resmi</label>
                    <input
                      type="url"
                      value={socialInstagram}
                      onChange={(e) => setSocialInstagram(e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Footer with success label and save CTA */}
            <div className="pt-6 border-t border-terracotta/10 flex items-center justify-between">
              <div>
                {success && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl text-xs font-bold uppercase tracking-wider animate-fade-in">
                    <UserCheck className="w-4 h-4" />
                    <span>Konfigurasi Berhasil Disimpan</span>
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3.5 bg-terracotta hover:bg-soft-brown disabled:bg-terracotta/60 text-white rounded-2xl text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
