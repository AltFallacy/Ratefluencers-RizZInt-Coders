"use client";

import { useSearchStore } from "@/store";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const PLATFORMS = ["Instagram", "TikTok", "YouTube", "Twitter", "LinkedIn"];
const CATEGORIES = ["Fashion", "Tech", "Fitness", "Luxury", "Food", "Travel", "Gaming"];
const CAMPAIGNS = ["Awareness", "Conversion", "Product Launch", "Event"];

export function FilterPanel() {
  const { filters, setFilter, clearFilters } = useSearchStore();

  const togglePlatform = (platform: string) => {
    const active = filters.platforms.includes(platform);
    const updated = active
      ? filters.platforms.filter((p) => p !== platform)
      : [...filters.platforms, platform];
    setFilter("platforms", updated);
  };

  const toggleCategory = (category: string) => {
    const active = filters.categories.includes(category);
    const updated = active
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    setFilter("categories", updated);
  };

  const toggleCampaignType = (type: string) => {
    const active = filters.campaignTypes.includes(type);
    const updated = active
      ? filters.campaignTypes.filter((t) => t !== type)
      : [...filters.campaignTypes, type];
    setFilter("campaignTypes", updated);
  };

  const formatFollowerLabel = (val: number) => {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
    return String(val);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] mt-4">
      {/* Col 1: Range Sliders */}
      <div className="space-y-5">
        {/* Score Range */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Ratefluencer Score
            </label>
            <span className="text-xs text-[var(--text-primary)] font-medium">
              {filters.scoreRange[0]} – {filters.scoreRange[1]}
            </span>
          </div>
          <Slider
            min={0}
            max={100}
            step={1}
            value={filters.scoreRange}
            onValueChange={(val) => setFilter("scoreRange", val as [number, number])}
          />
        </div>

        {/* Followers Range */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Followers Count
            </label>
            <span className="text-xs text-[var(--text-primary)] font-medium">
              {formatFollowerLabel(filters.followersRange[0])} – {formatFollowerLabel(filters.followersRange[1])}
            </span>
          </div>
          <Slider
            min={1000}
            max={10000000}
            step={10000}
            value={filters.followersRange}
            onValueChange={(val) => setFilter("followersRange", val as [number, number])}
          />
        </div>

        {/* Engagement Rate */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Engagement Rate
            </label>
            <span className="text-xs text-[var(--text-primary)] font-medium">
              {filters.engagementRange[0]}% – {filters.engagementRange[1]}%
            </span>
          </div>
          <Slider
            min={0}
            max={25}
            step={0.5}
            value={filters.engagementRange}
            onValueChange={(val) => setFilter("engagementRange", val as [number, number])}
          />
        </div>
      </div>

      {/* Col 2: Platform & Campaign Multi-Select */}
      <div className="space-y-5">
        {/* Platform Selection */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Platform Focus
          </label>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {PLATFORMS.map((platform) => {
              const active = filters.platforms.includes(platform);
              return (
                <button
                  key={platform}
                  onClick={() => togglePlatform(platform)}
                  className={cn(
                    "px-3 py-1 text-xs rounded-full border transition-all cursor-pointer font-medium",
                    active
                      ? "bg-[var(--accent-subtle)] text-[var(--accent-light)] border-[var(--accent-glow)]"
                      : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-default)]"
                  )}
                >
                  {platform}
                </button>
              );
            })}
          </div>
        </div>

        {/* Campaign Type Selection */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Campaign Objectives
          </label>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {CAMPAIGNS.map((type) => {
              const active = filters.campaignTypes.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleCampaignType(type)}
                  className={cn(
                    "px-3 py-1 text-xs rounded-full border transition-all cursor-pointer font-medium",
                    active
                      ? "bg-[var(--accent-subtle)] text-[var(--accent-light)] border-[var(--accent-glow)]"
                      : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-default)]"
                  )}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Col 3: Category, Location & Controls */}
      <div className="space-y-5 flex flex-col justify-between">
        {/* Category Selection */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Category / Niche
          </label>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {CATEGORIES.map((cat) => {
              const active = filters.categories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={cn(
                    "px-2.5 py-1 text-xs rounded-full border transition-all cursor-pointer font-medium",
                    active
                      ? "bg-[var(--accent-subtle)] text-[var(--accent-light)] border-[var(--accent-glow)]"
                      : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-default)]"
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Location Search Input & Reset Button */}
        <div className="flex items-center gap-3 pt-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Filter by country / city..."
              value={filters.location}
              onChange={(e) => setFilter("location", e.target.value)}
              className="w-full h-8 px-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
          
          <button
            onClick={clearFilters}
            className="h-8 px-3 rounded-lg border border-[var(--border-subtle)] bg-transparent text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer font-medium"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
