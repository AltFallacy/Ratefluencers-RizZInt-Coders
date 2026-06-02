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
  FileText,
  Settings,
  ChevronLeft,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store";
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

const workspaceItems = [
  { label: "Reports", icon: FileText, href: "#reports" },
  { label: "Settings", icon: Settings, href: "#settings" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed: sidebarCollapsed, toggle: toggleSidebar } = useSidebarStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 60 : 240 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="relative hidden md:flex flex-col shrink-0 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] overflow-hidden h-screen sticky top-0 z-40 transition-colors"
    >
      {/* Brand Section */}
      <div className="flex h-14 items-center px-4 shrink-0 overflow-hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] shadow-sm">
            <Zap className="size-4 text-white" />
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
                exit={{ opacity: 0, x: -8 }}
                className="text-sm font-semibold text-[var(--text-primary)] whitespace-nowrap overflow-hidden tracking-tight"
              >
                Ratefluencer
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden p-2">
        {/* Navigation Label */}
        <div className="h-6 flex items-center justify-between px-3 mt-4 mb-2 overflow-hidden shrink-0">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest block whitespace-nowrap"
              >
                Navigation
              </motion.span>
            ) : (
              <div className="h-px w-full bg-[var(--border-subtle)]" />
            )}
          </AnimatePresence>
        </div>

        <nav className="flex flex-col gap-0.5 shrink-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            const linkEl = (
              <Link
                href={item.href}
                className={cn(
                  "group relative flex h-[38px] items-center gap-2.5 rounded-[10px] px-3 text-sm font-medium transition-all duration-150 mb-[2px] overflow-visible",
                  isActive
                    ? "bg-[var(--accent-subtle)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--highlight)] hover:text-[var(--text-primary)] bg-transparent"
                )}
              >
                {/* Active Left Border - flush to sidebar edge */}
                {isActive && (
                  <div className="absolute left-[-8px] top-[15%] bottom-[15%] w-[2.5px] rounded-r-md bg-[var(--accent)]" />
                )}

                <Icon
                  className={cn(
                    "size-[16px] shrink-0 transition-colors duration-150",
                    isActive ? "text-[var(--accent-light)]" : "text-[var(--text-muted)] group-hover:text-[var(--accent-light)]"
                  )}
                />
                
                <AnimatePresence mode="wait" initial={false}>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      className="whitespace-nowrap overflow-hidden text-[13px] font-medium"
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

        {/* Workspace Section */}
        <div className="h-6 flex items-center justify-between px-3 mt-6 mb-2 overflow-hidden shrink-0">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest block whitespace-nowrap"
              >
                Workspace
              </motion.span>
            ) : (
              <div className="h-px w-full bg-[var(--border-subtle)]" />
            )}
          </AnimatePresence>
        </div>

        <nav className="flex flex-col gap-0.5 shrink-0">
          {workspaceItems.map((item) => {
            const isActive = false;
            const Icon = item.icon;

            const linkEl = (
              <Link
                href={item.href}
                className={cn(
                  "group relative flex h-[38px] items-center gap-2.5 rounded-[10px] px-3 text-sm font-medium transition-all duration-150 mb-[2px] overflow-visible",
                  isActive
                    ? "bg-[var(--accent-subtle)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--highlight)] hover:text-[var(--text-primary)] bg-transparent"
                )}
              >
                <Icon
                  className={cn(
                    "size-[16px] shrink-0 transition-colors duration-150",
                    isActive ? "text-[var(--accent-light)]" : "text-[var(--text-muted)] group-hover:text-[var(--accent-light)]"
                  )}
                />
                
                <AnimatePresence mode="wait" initial={false}>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      className="whitespace-nowrap overflow-hidden text-[13px] font-medium"
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
      </div>

      {/* Collapse Toggle Chevron */}
      <div className="p-2 flex justify-center shrink-0 border-t border-[var(--border-subtle)]">
        <button
          onClick={toggleSidebar}
          className="flex h-9 w-full items-center justify-center rounded-[10px] text-[var(--text-secondary)] hover:bg-[var(--highlight)] hover:text-[var(--text-primary)] transition-all cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-glow)]"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <motion.div
            animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronLeft className="size-4" />
          </motion.div>
        </button>
      </div>

      {/* Pinned Bottom User Info Section */}
      <div className="p-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between shrink-0 bg-[var(--bg-elevated)]/30">
        <div className="flex items-center gap-2.5 overflow-hidden">
          {/* Avatar with gradient background */}
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] text-xs font-semibold text-white shadow-sm">
            JC
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="overflow-hidden flex flex-col justify-center"
              >
                <p className="text-[13px] font-semibold text-[var(--text-primary)] leading-tight whitespace-nowrap">Jane Cooper</p>
                <p className="text-[11px] text-[var(--text-muted)] leading-tight whitespace-nowrap">jane@brand.co</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Settings Icon */}
        {!sidebarCollapsed && (
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <button
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-md transition-colors cursor-pointer"
                aria-label="Settings"
              >
                <Settings className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Account Settings
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </motion.aside>
  );
}
