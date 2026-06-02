"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  TrendingUp,
  Target,
  Handshake,
  Star,
  ChevronLeft,
  ChevronRight,
  Settings,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Influencers", icon: Users, href: "/influencers" },
  { label: "Authenticity", icon: ShieldCheck, href: "/authenticity" },
  { label: "Growth Forecast", icon: TrendingUp, href: "/growth" },
  { label: "Campaign Success", icon: Target, href: "/campaign" },
  { label: "Brand Matching", icon: Handshake, href: "/matching" },
  { label: "Ratefluencer Score", icon: Star, href: "/score" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative hidden md:flex flex-col shrink-0 bg-zinc-900 border-r border-zinc-800 overflow-hidden h-screen sticky top-0"
    >
      {/* Logo */}
      <div className="flex h-14 items-center px-3 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-600">
            <Zap className="size-4 text-white" />
          </div>
          <AnimatePresence initial={false}>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-semibold text-zinc-100 whitespace-nowrap overflow-hidden"
              >
                Ratefluencer AI
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 p-2 flex-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          const linkEl = (
            <Link
              href={item.href}
              className={cn(
                "group relative flex h-9 items-center gap-3 rounded-lg px-2.5 text-sm font-medium transition-colors duration-150",
                isActive
                  ? "bg-violet-500/10 text-violet-400"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              )}
            >
              {/* Active accent bar */}
              {isActive && (
                <motion.div
                  layoutId="active-nav-bar"
                  className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-violet-500"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  isActive ? "text-violet-400" : "text-zinc-400 group-hover:text-zinc-200"
                )}
              />
              <AnimatePresence initial={false}>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.18 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );

          if (sidebarCollapsed) {
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.href}>{linkEl}</div>;
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-2 border-t border-zinc-800 flex flex-col gap-0.5 shrink-0">
        {/* User avatar */}
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg px-2.5 py-2",
            "hover:bg-zinc-800 cursor-pointer transition-colors"
          )}
        >
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-700 text-xs font-semibold text-white">
            A
          </div>
          <AnimatePresence initial={false}>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <p className="text-xs font-medium text-zinc-200 whitespace-nowrap">Aria Westfield</p>
                <p className="text-xs text-zinc-500 whitespace-nowrap">@ariawestfield</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button className="flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors">
              <Settings className="size-4 shrink-0" />
              <AnimatePresence initial={false}>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.18 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    Settings
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </TooltipTrigger>
          {sidebarCollapsed && (
            <TooltipContent side="right" className="text-xs">
              Settings
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-[72px] z-10 flex size-6 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 transition-colors shadow-md"
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="size-3" />
        ) : (
          <ChevronLeft className="size-3" />
        )}
      </button>
    </motion.aside>
  );
}
