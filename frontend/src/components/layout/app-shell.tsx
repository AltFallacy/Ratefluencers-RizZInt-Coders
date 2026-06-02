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
  Menu,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import { useUIStore } from "@/store/ui-store";
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
    <div className="flex min-h-screen bg-zinc-950">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sheet */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-64 bg-zinc-900 border-zinc-800 p-0">
          <SheetHeader className="px-4 py-3 border-b border-zinc-800">
            <SheetTitle className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
              <div className="flex size-7 items-center justify-center rounded-lg bg-violet-600">
                <Zap className="size-3.5 text-white" />
              </div>
              Ratefluencer AI
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-0.5 p-2">
            {mobileNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-violet-500/10 text-violet-400"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="flex md:hidden h-14 items-center gap-3 border-b border-zinc-800 bg-zinc-900 px-4 shrink-0">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-violet-600">
              <Zap className="size-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-zinc-100">Ratefluencer AI</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-screen-xl px-4 py-6 md:px-6 md:py-8">
            {children}
          </div>
        </main>

        {/* Mobile bottom tab bar */}
        <nav className="flex md:hidden items-center justify-around border-t border-zinc-800 bg-zinc-900 px-2 py-2 shrink-0">
          {mobileNavItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                  isActive ? "text-violet-400" : "text-zinc-500"
                )}
              >
                <Icon className="size-5" />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
