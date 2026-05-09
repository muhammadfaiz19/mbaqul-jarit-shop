export interface SiteSettings {
  id?: number;
  brandName: string;
  tagline: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  tiktokUrl?: string;
  tiktokHandle?: string;
  operationalHours?: string;
  heroHeadline: string;
  heroSubtext: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  aboutTitle: string;
  aboutParagraphs: string[];
  aboutQuote: string;
  aboutTarget: string;
  aboutValues: Array<{ title: string; description: string }>;
  socialLinks: Array<{ platform: string; url: string; icon: string }>;
  createdAt?: string;
  updatedAt?: string;
}
