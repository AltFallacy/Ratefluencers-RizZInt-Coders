"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  TrendingUp,
  Target,
  Handshake,
  Star,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useUIStore } from "@/store/ui-store";
import { pageVariants } from "@/lib/animations";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const mobileNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Influencers", icon: Users, href: "/influencers" },
  { label: "Authenticity", icon: ShieldCheck, href: "/authenticity" },
  { label: "Growth", icon: TrendingUp, href: "/growth" },
  { label: "Campaign", icon: Target, href: "/campaign" },
  { label: "Matching", icon: Handshake, href: "/matching" },
  { label: "Score", icon: Star, href: "/score" },
] as const;

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();

  return (
    <div className="flex min-h-screen bg-[var(--bg-base)] transition-colors duration-200">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sheet drawer */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-[280px] bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] p-0 backdrop-blur-md">
          <SheetHeader className="px-4 py-4 border-b border-[var(--border-subtle)]">
            <SheetTitle className="flex items-center gap-2.5 text-sm font-semibold text-[var(--text-primary)]">
              <div className="flex size-7 items-center justify-center rounded-lg bg-[var(--accent)]">
                <Zap className="size-3.5 text-white" />
              </div>
              Ratefluencer AI
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-0.5 p-2.5">
            {mobileNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors mb-0.5",
                    isActive
                      ? "bg-[var(--accent-subtle)] text-[var(--text-primary)] border-l-2 border-[var(--accent)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--highlight)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <Icon className={cn("size-4 shrink-0", isActive ? "text-[var(--accent-light)]" : "text-[var(--text-muted)]")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Sticky top glassbar */}
        <Navbar />

        {/* Page content with smooth Framer Motion routing transition */}
        <main className="flex-1 overflow-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              className="mx-auto max-w-[1600px] w-full px-4 py-6 md:px-6 md:py-8 lg:px-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile bottom tab bar */}
        <nav className="flex md:hidden items-center justify-around border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-2 shrink-0 z-30">
          {mobileNavItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors",
                  isActive ? "text-[var(--accent-light)]" : "text-[var(--text-muted)]"
                )}
              >
                <Icon className="size-[20px]" />
                <span className="text-[10px] scale-90">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
