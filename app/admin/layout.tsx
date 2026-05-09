"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  Image as ImageIcon,
  HelpCircle,
  Bot,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  User,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Produk", href: "/admin/dashboard/products", icon: ShoppingBag },
  { label: "Kategori", href: "/admin/dashboard/categories", icon: FolderTree },
  { label: "Galeri", href: "/admin/dashboard/gallery", icon: ImageIcon },
  { label: "FAQs", href: "/admin/dashboard/faqs", icon: HelpCircle },
  { label: "Chatbot AI", href: "/admin/dashboard/chatbot", icon: Bot },
  { label: "Pengaturan Situs", href: "/admin/dashboard/settings", icon: SettingsIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string>("");

  // Determine if we are on the login page
  const isLoginPage = pathname === "/admin/login";

  // Get current session admin info
  useEffect(() => {
    if (!isLoginPage) {
      authService
        .me()
        .then((res) => {
          if (res.success && res.data?.admin) {
            setAdminEmail(res.data.admin.email);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch admin profile:", err);
        });
    }
  }, [isLoginPage, pathname]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // If on login page, don't show admin layout decorations or sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-cream text-dark font-body relative">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-dark text-cream z-30 shadow-md">
        <Link href="/admin/dashboard" className="font-display font-bold text-lg text-linen">
          mbaQul Backstage
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-linen"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar - Desktop and Mobile Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-dark text-cream p-6 flex flex-col justify-between border-r border-terracotta/10 transition-transform duration-300 md:translate-x-0 md:static md:shrink-0 md:h-screen md:z-10",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col gap-8 grow">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between pb-6 border-b border-cream/10">
            <div>
              <Link href="/admin/dashboard" className="font-display font-bold text-xl text-linen block mb-1">
                mbaQul Jarit
              </Link>
              <span className="text-[10px] tracking-widest uppercase text-terracotta font-semibold">
                Control Room
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1.5 rounded-lg bg-white/10 text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 grow overflow-y-auto pr-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                    isActive
                      ? "bg-terracotta text-white shadow-md shadow-terracotta/10 font-semibold"
                      : "text-linen/80 hover:bg-cream/5 hover:text-linen"
                  )}
                >
                  <Icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-white" : "text-terracotta")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Profile & Logout */}
        <div className="pt-6 border-t border-cream/10 flex flex-col gap-4 mt-auto">
          {adminEmail && (
            <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-2xl">
              <div className="w-9 h-9 rounded-full bg-terracotta/20 text-terracotta flex items-center justify-center font-bold text-sm">
                <User className="w-4 h-4 text-terracotta" />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-semibold block text-linen truncate">
                  Admin Active
                </span>
                <span className="text-[10px] text-linen/60 truncate block leading-normal">
                  {adminEmail}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-3 bg-white/5 hover:bg-white/10 text-linen/80 hover:text-white transition-all text-xs rounded-xl flex items-center justify-center gap-1.5 border border-white/5 font-semibold"
            >
              <span>Situs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-3 bg-red-950/20 hover:bg-red-900/40 text-red-300 hover:text-red-200 transition-all text-xs rounded-xl flex items-center justify-center gap-1.5 border border-red-950/30 font-semibold cursor-pointer"
            >
              <span>Logout</span>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className="grow flex flex-col min-w-0 md:h-screen md:overflow-y-auto">
        {/* Subtle background aesthetic texture */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZHRoPSI4IiBmaWxsPSIjMmIyYjJiIiBmaWxsLW9wYWNpdHk9Ii4xIi8+Cjwvc3ZnPg==')]"></div>

        {/* Content Wrapper */}
        <main className="p-6 md:p-10 lg:p-12 relative z-10 flex flex-col gap-8 grow pb-24 md:pb-12">
          {children}
        </main>
      </div>

      {/* Mobile Side Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </div>
  );
}
