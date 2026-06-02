"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { useInfluencer } from "@/hooks/use-api";

const routeTitleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/influencers": "Influencers Profiles",
  "/authenticity": "Authenticity & Bot Risk",
  "/growth": "Growth Predictions",
  "/campaign": "Campaign Simulator",
  "/matching": "Brand Matchmaking",
  "/score": "Ratefluencer Score",
};

export function Navbar() {
  const pathname = usePathname();
  const { toggleMobileSidebar } = useUIStore();
  const { data: influencer } = useInfluencer();

  const displayName = influencer?.name ?? "Aria Westfield";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const shortName = displayName.split(" ").length > 1
    ? `${displayName.split(" ")[0]} ${displayName.split(" ")[1][0]}.`
    : displayName;

  // Find matching title or default to parent path
  const currentTitle =
    routeTitleMap[pathname] ||
    Object.keys(routeTitleMap).find((key) => pathname.startsWith(key + "/"))
      ? routeTitleMap[Object.keys(routeTitleMap).find((key) => pathname.startsWith(key + "/"))!]
      : "Ratefluencer AI";

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-glass)] px-6 backdrop-blur-md saturate-[180%] transition-colors">
      {/* Left: Hamburger & Dynamic Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileSidebar}
          className="flex md:hidden rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors focus:outline-none"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-semibold tracking-tight text-[var(--text-primary)] md:text-base">
          {currentTitle}
        </h1>
      </div>

      {/* Right: Actions & User Avatar Chip */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          className="relative rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors focus:outline-none cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--accent)] ring-1 ring-[var(--bg-surface)] animate-pulse" />
        </button>

        {/* Theme Switching System */}
        <ThemeToggle />

        {/* User Profile Avatar Chip */}
        <div className="flex h-[34px] items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)] pl-1.5 pr-2.5 hover:bg-[var(--bg-overlay)] hover:border-[var(--border-default)] transition-all cursor-pointer">
          <div className="flex w-[22px] h-[22px] items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] text-[10px] font-bold text-white shadow-sm shrink-0">
            {initials}
          </div>
          <span className="hidden sm:inline text-xs font-semibold text-[var(--text-primary)] select-none">
            {shortName}
          </span>
        </div>
      </div>
    </header>
  );
}
