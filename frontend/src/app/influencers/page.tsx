"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowRight, Star, Globe, Users, CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ApiErrorBanner, LiveBadge } from "@/components/shared/api-error";
import { Skeleton } from "@/components/shared/loading-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useInfluencerList } from "@/hooks/use-api";
import { useInfluencerStore } from "@/store";
import { cn } from "@/lib/utils";

function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

const platformColors: Record<string, string> = {
  Instagram: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  YouTube: "bg-red-500/10 text-red-400 border-red-500/20",
  TikTok: "bg-zinc-100/10 text-zinc-100 border-zinc-100/20",
  Twitter: "bg-sky-500/10 text-sky-400 border-sky-500/20",
};

export default function InfluencersPage() {
  const router = useRouter();
  const { data: influencers, isError, isFetching } = useInfluencerList();
  const { activeInfluencerId, setActiveInfluencerId } = useInfluencerStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");

  const isBackendOffline = isError;

  const platforms = ["All", "Instagram", "YouTube", "TikTok", "Twitter"];

  const filteredInfluencers = useMemo(() => {
    let result = influencers ?? [];

    if (searchQuery.trim()) {
      result = result.filter(
        (inf) =>
          inf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inf.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inf.niche.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedPlatform !== "All") {
      result = result.filter((inf) => inf.platform === selectedPlatform);
    }

    return result;
  }, [influencers, searchQuery, selectedPlatform]);

  const handleSelectInfluencer = (id: string) => {
    setActiveInfluencerId(id);
    router.push("/dashboard");
  };

  return (
    <div className="space-y-6">
      <ApiErrorBanner show={isBackendOffline} />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <PageHeader
          title="Influencer Profiles"
          description="Browse and inspect individual creator intelligence profiles and predictive AI scoring dashboards."
        />
        <LiveBadge isLive={!isBackendOffline} />
      </motion.div>

      {/* Search and Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:flex-row sm:items-center"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name, username or niche..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 rounded-lg border border-zinc-800 bg-zinc-950 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-zinc-700 transition-colors"
          />
        </div>

        {/* Platform Pill Selector */}
        <div className="flex flex-wrap gap-1.5 shrink-0">
          {platforms.map((p) => {
            const isSelected = selectedPlatform === p;
            return (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={cn(
                  "rounded-full px-3.5 py-1 text-xs font-semibold border transition-all cursor-pointer",
                  isSelected
                    ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm"
                    : "bg-zinc-800/40 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200"
                )}
              >
                {p}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Influencers Grid */}
      {isFetching && !influencers ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col h-[280px]"
            >
              <div className="flex items-start gap-4 mb-4">
                <Skeleton className="size-12 rounded-full shrink-0" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="space-y-3 flex-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-9 w-full mt-4 rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredInfluencers.map((inf, i) => {
            const isActive = activeInfluencerId === inf.id;
            const compositeScore = inf.scores?.composite ?? 80;

            return (
              <motion.div
                key={inf.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.15 } }}
                className={cn(
                  "relative rounded-xl border bg-zinc-900 p-6 flex flex-col transition-all duration-200",
                  isActive
                    ? "border-[var(--accent)] ring-1 ring-[var(--accent-glow)] shadow-[var(--shadow-lg)]"
                    : "border-zinc-800 hover:border-zinc-700 hover:shadow-md"
                )}
              >
                {/* Active Indicator Pin */}
                {isActive && (
                  <span className="absolute top-3 right-3 flex h-2 w-2 rounded-full bg-[var(--accent)] ring-4 ring-[var(--accent-subtle)]" />
                )}

                {/* Identity Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] text-lg font-bold text-white shadow-sm">
                    {inf.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-semibold text-zinc-100 truncate text-sm sm:text-base leading-tight">
                        {inf.name}
                      </h3>
                      {inf.verified && (
                        <CheckCircle className="size-3.5 text-violet-400 fill-violet-400/10 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">{inf.username}</p>
                  </div>
                </div>

                {/* Niche Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {inf.niche.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] bg-zinc-850 text-zinc-400 border-zinc-800">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4 rounded-lg bg-zinc-950 p-3 border border-zinc-850 text-xs mb-5">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Followers</span>
                    <span className="font-bold text-zinc-200 mt-0.5 block flex items-center gap-1">
                      <Users className="size-3.5 text-zinc-500" />
                      {formatFollowers(inf.followerCount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Engagement</span>
                    <span className="font-bold text-zinc-200 mt-0.5 block flex items-center gap-1">
                      <Star className="size-3.5 text-amber-500 fill-amber-500/10" />
                      {inf.engagementRate}%
                    </span>
                  </div>
                </div>

                {/* Footer Details */}
                <div className="flex items-center justify-between mt-auto mb-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Globe className="size-3.5" />
                    {inf.location}
                  </span>
                  <Badge className={cn("text-[10px] border px-2 py-0.5 shrink-0", platformColors[inf.platform] ?? "bg-zinc-800 text-zinc-400")}>
                    {inf.platform}
                  </Badge>
                </div>

                {/* Inspect Action */}
                <div className="flex items-center gap-3 border-t border-zinc-850 pt-4 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Composite Score</span>
                    <span className="text-sm font-bold text-violet-400">{compositeScore} / 100</span>
                  </div>

                  <Button
                    onClick={() => handleSelectInfluencer(inf.id)}
                    size="sm"
                    className={cn(
                      "ml-auto text-xs gap-1.5 h-8 px-3 cursor-pointer",
                      isActive
                        ? "bg-[var(--accent-subtle)] text-[var(--accent-light)] border border-[var(--accent-glow)] hover:bg-[var(--accent-glow)]/20"
                        : "bg-[var(--accent)] hover:bg-[var(--accent-light)] text-white"
                    )}
                  >
                    {isActive ? "Viewing Profile" : "Inspect Dashboard"}
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isFetching && filteredInfluencers.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-16 text-center">
          <p className="text-zinc-400 mb-2">No creators match your search criteria or platform filter.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedPlatform("All");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
