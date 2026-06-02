"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchStore } from "@/store";
import { FilterPanel } from "./FilterPanel";
import { CommandPalette } from "./CommandPalette";
import { cn } from "@/lib/utils";

export function SearchZone() {
  const { setOpen, filters, setFilter, clearFilters } = useSearchStore();
  const [showFilters, setShowFilters] = useState(false);
  const [shortcutText, setShortcutText] = useState("⌘K");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMac = navigator.userAgent.toLowerCase().includes("mac");
      setShortcutText(isMac ? "⌘K" : "Ctrl+K");
    }
  }, []);

  // Check if any filters are active
  const hasActiveFilters =
    filters.platforms.length > 0 ||
    filters.categories.length > 0 ||
    filters.campaignTypes.length > 0 ||
    filters.location !== "" ||
    filters.scoreRange[0] !== 0 ||
    filters.scoreRange[1] !== 100 ||
    filters.followersRange[0] !== 1000 ||
    filters.followersRange[1] !== 10000000 ||
    filters.engagementRange[0] !== 0 ||
    filters.engagementRange[1] !== 25;

  const removePlatform = (platform: string) => {
    setFilter("platforms", filters.platforms.filter((p) => p !== platform));
  };

  const removeCategory = (category: string) => {
    setFilter("categories", filters.categories.filter((c) => c !== category));
  };

  const removeCampaignType = (type: string) => {
    setFilter("campaignTypes", filters.campaignTypes.filter((t) => t !== type));
  };

  return (
    <div className="w-full">
      {/* Interactive Main Input Row */}
      <div className="flex gap-3">
        <div
          onClick={() => setOpen(true)}
          className={cn(
            "flex-1 flex h-[52px] items-center gap-3 px-5 rounded-[14px] border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)] transition-all cursor-pointer group select-none"
          )}
        >
          <Search className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent-light)] transition-colors shrink-0" />
          <span className="text-[14px] text-[var(--text-muted)] flex-1">
            Search influencers, brands, campaigns...
          </span>
          <div className="flex items-center gap-1.5 select-none shrink-0">
            <kbd className="px-1.5 py-0.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[10px] text-[var(--text-muted)] font-mono font-medium">
              {shortcutText}
            </kbd>
          </div>
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex h-[52px] px-5 items-center gap-2 rounded-[14px] border transition-all cursor-pointer text-sm font-semibold select-none shadow-[var(--shadow-sm)]",
            showFilters
              ? "bg-[var(--accent-subtle)] text-[var(--text-primary)] border-[var(--accent)]"
              : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-default)] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]"
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="flex size-2 rounded-full bg-[var(--accent)] animate-pulse" />
          )}
        </button>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 mt-3 px-1">
          {/* Platforms */}
          {filters.platforms.map((p) => (
            <span
              key={p}
              className="flex h-[26px] items-center gap-1 bg-[var(--accent-subtle)] border border-[var(--accent-glow)] rounded-full px-2.5 text-xs text-[var(--accent-light)] font-semibold uppercase tracking-wider"
            >
              <span>{p}</span>
              <button onClick={() => removePlatform(p)} className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Categories */}
          {filters.categories.map((c) => (
            <span
              key={c}
              className="flex h-[26px] items-center gap-1 bg-[var(--accent-subtle)] border border-[var(--accent-glow)] rounded-full px-2.5 text-xs text-[var(--accent-light)] font-semibold uppercase tracking-wider"
            >
              <span>{c}</span>
              <button onClick={() => removeCategory(c)} className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Campaign Types */}
          {filters.campaignTypes.map((t) => (
            <span
              key={t}
              className="flex h-[26px] items-center gap-1 bg-[var(--accent-subtle)] border border-[var(--accent-glow)] rounded-full px-2.5 text-xs text-[var(--accent-light)] font-semibold uppercase tracking-wider"
            >
              <span>{t}</span>
              <button onClick={() => removeCampaignType(t)} className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Location */}
          {filters.location && (
            <span
              className="flex h-[26px] items-center gap-1 bg-[var(--accent-subtle)] border border-[var(--accent-glow)] rounded-full px-2.5 text-xs text-[var(--accent-light)] font-semibold uppercase tracking-wider"
            >
              <span>Loc: {filters.location}</span>
              <button onClick={() => setFilter("location", "")} className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Ranges indicators if modified */}
          {(filters.scoreRange[0] !== 0 || filters.scoreRange[1] !== 100) && (
            <span className="flex h-[26px] items-center gap-1 bg-[var(--accent-subtle)] border border-[var(--accent-glow)] rounded-full px-2.5 text-xs text-[var(--accent-light)] font-semibold uppercase tracking-wider">
              Score: {filters.scoreRange[0]}–{filters.scoreRange[1]}
              <button onClick={() => setFilter("scoreRange", [0, 100])} className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Clear All Trigger */}
          <button
            onClick={clearFilters}
            className="text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--accent)] underline ml-2 cursor-pointer uppercase tracking-wider"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Collapsible Filter Panel */}
      <AnimatePresence initial={false}>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <FilterPanel />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Spotlight Overlay Dialog */}
      <CommandPalette />
    </div>
  );
}
