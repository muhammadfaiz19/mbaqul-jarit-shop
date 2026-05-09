import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import FloatingWA from "../components/layout/floating-wa";
import Chatbot from "../components/layout/chatbot";
import { settingsService } from "@/services/settings.service";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    // Get settings from Express backend
    const res = await settingsService.get();
    if (res.data.success && res.data.data) {
      const brandName = res.data.data.brandName || "mbaQul Jarit";
      const tagline = res.data.data.tagline || "Fashion jarit modern premium";
      return {
        title: {
          default: brandName,
          template: `%s | ${brandName}`,
        },
        description: tagline,
      };
    }
  } catch (err) {
    console.error("Failed to load metadata settings:", err);
  }

  return {
    title: {
      default: "mbaQul Jarit",
      template: "%s | mbaQul Jarit",
    },
    description: "Fashion jarit modern premium",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${fraunces.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        <Navbar />
        <main className="grow">{children}</main>
        <Footer />
        <FloatingWA />
        <Chatbot />
      </body>
    </html>
  );
}
