"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Clock, FileText, Target, Users, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchStore, useInfluencerStore } from "@/store";
import { mockInfluencerList } from "@/data/influencer";
import { historicalCampaigns } from "@/data/campaigns";
import { overlayVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface FlatResult {
  type: "influencer" | "campaign" | "report";
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  url: string;
}

const mockReports = [
  { id: "rep-1", title: "Q2 Influencer Performance Audit", url: "/dashboard" },
  { id: "rep-2", title: "Bot and Authenticity Campaign Cleanup Report", url: "/authenticity" },
  { id: "rep-3", title: "Gen-Z Micro-Influencer Expansion Plan", url: "/matching" },
  { id: "rep-4", title: "Lifestyle Creators Growth Forecast Report", url: "/growth" },
  { id: "rep-5", title: "High-Engagement TikTok Brand Alignments", url: "/score" },
];

export function CommandPalette() {
  const router = useRouter();
  const { isOpen, setOpen, query, setQuery, history, addToHistory } = useSearchStore();
  const setActiveInfluencerId = useInfluencerStore((state) => state.setActiveInfluencerId);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Key Listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!isOpen);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filtering Logic
  const filteredInfluencers = query.trim()
    ? mockInfluencerList.filter(
        (inf) =>
          inf.name.toLowerCase().includes(query.toLowerCase()) ||
          inf.username.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredCampaigns = query.trim()
    ? historicalCampaigns.filter(
        (camp) =>
          camp.name.toLowerCase().includes(query.toLowerCase()) ||
          camp.brand.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredReports = query.trim()
    ? mockReports.filter((rep) =>
        rep.title.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Construct Flat List for Keyboard Nav
  const flatResults: FlatResult[] = [];
  filteredInfluencers.forEach((inf) => {
    flatResults.push({
      type: "influencer",
      id: inf.id,
      title: inf.name,
      subtitle: `${inf.username} · ${inf.platform}`,
      badgeText: `Score: ${inf.scores.composite}`,
      url: `/dashboard`,
    });
  });

  filteredCampaigns.forEach((camp) => {
    flatResults.push({
      type: "campaign",
      id: camp.id,
      title: camp.name,
      subtitle: `${camp.brand} · ${camp.type}`,
      badgeText: `${camp.roi}x ROI`,
      url: `/campaign`,
    });
  });

  filteredReports.forEach((rep) => {
    flatResults.push({
      type: "report",
      id: rep.id,
      title: rep.title,
      subtitle: "Report Profile",
      badgeText: "PDF",
      url: rep.url,
    });
  });

  // Handle Keyboard Nav
  useEffect(() => {
    if (!isOpen || flatResults.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % flatResults.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + flatResults.length) % flatResults.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = flatResults[selectedIndex];
        if (selected) {
          addToHistory(query);
          if (selected.type === "influencer") {
            setActiveInfluencerId(selected.id);
          }
          router.push(selected.url);
          setOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, flatResults, selectedIndex, query, router, addToHistory, setOpen, setActiveInfluencerId]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] px-4">
        {/* Backdrop glass blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
        />

        {/* Command Panel Container */}
        <motion.div
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative w-full max-w-[640px] bg-[var(--bg-overlay)] border border-[var(--border-default)] rounded-2xl shadow-[var(--shadow-xl)] overflow-hidden"
        >
          {/* Input Row */}
          <div className="flex h-14 items-center gap-3 px-4 border-b border-[var(--border-subtle)]">
            <Search className="w-5 h-5 text-[var(--text-muted)] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search creators, campaigns, reports... (e.g. Aria)"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              className="flex-1 bg-transparent border-none text-[15px] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 hover:bg-[var(--bg-elevated)] rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0 select-none">
              <kbd className="px-1.5 py-0.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[10px] text-[var(--text-muted)] font-mono">
                Esc
              </kbd>
            </div>
          </div>

          {/* Results Area */}
          <div className="max-h-[360px] overflow-y-auto p-2 space-y-2">
            {!query.trim() ? (
              // Recent Searches
              <div className="py-2 px-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] px-3 mb-2">
                  Recent Searches
                </p>
                {history.length > 0 ? (
                  <div className="space-y-0.5">
                    {history.map((h, i) => (
                      <button
                        key={i}
                        onClick={() => setQuery(h)}
                        className="w-full flex h-9 items-center gap-3 rounded-lg px-3 text-xs text-[var(--text-secondary)] hover:bg-[var(--highlight)] hover:text-[var(--text-primary)] transition-colors cursor-pointer text-left"
                      >
                        <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        <span>{h}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-muted)] px-3 py-1.5 italic">
                    No recent searches. Type to start matching.
                  </p>
                )}
              </div>
            ) : flatResults.length > 0 ? (
              // Search Matches Grouped Visually
              <div className="space-y-3">
                {/* Group: Influencers */}
                {filteredInfluencers.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] px-3 py-1 shrink-0">
                      Creators ({filteredInfluencers.length})
                    </div>
                    {filteredInfluencers.map((inf) => {
                      const flatIndex = flatResults.findIndex((r) => r.id === inf.id && r.type === "influencer");
                      const isSelected = selectedIndex === flatIndex;
                      return (
                        <div
                          key={inf.id}
                          onClick={() => {
                            addToHistory(query);
                            setActiveInfluencerId(inf.id);
                            router.push(`/dashboard`);
                            setOpen(false);
                          }}
                          className={cn(
                            "flex h-12 items-center justify-between rounded-lg px-3 cursor-pointer transition-all duration-150 relative",
                            isSelected ? "bg-[var(--highlight)] text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:bg-[var(--highlight)]"
                          )}
                        >
                          {isSelected && <div className="absolute left-0 top-[15%] bottom-[15%] w-[2.5px] rounded-r-md bg-[var(--accent)]" />}
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] text-[10px] font-bold text-white shadow-sm">
                              {inf.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{inf.name}</p>
                              <p className="text-[10px] text-[var(--text-muted)] truncate">{inf.username} · {inf.platform}</p>
                            </div>
                          </div>
                          <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-light)] font-bold">
                            Score: {inf.scores.composite}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Group: Campaigns */}
                {filteredCampaigns.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] px-3 py-1 shrink-0">
                      Campaigns ({filteredCampaigns.length})
                    </div>
                    {filteredCampaigns.map((camp) => {
                      const flatIndex = flatResults.findIndex((r) => r.id === camp.id && r.type === "campaign");
                      const isSelected = selectedIndex === flatIndex;
                      return (
                        <div
                          key={camp.id}
                          onClick={() => {
                            addToHistory(query);
                            router.push(`/campaign`);
                            setOpen(false);
                          }}
                          className={cn(
                            "flex h-12 items-center justify-between rounded-lg px-3 cursor-pointer transition-all duration-150 relative",
                            isSelected ? "bg-[var(--highlight)] text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:bg-[var(--highlight)]"
                          )}
                        >
                          {isSelected && <div className="absolute left-0 top-[15%] bottom-[15%] w-[2.5px] rounded-r-md bg-[var(--accent)]" />}
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                              <Target className="w-3.5 h-3.5 text-[var(--accent-light)]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{camp.name}</p>
                              <p className="text-[10px] text-[var(--text-muted)] truncate">{camp.brand} · {camp.type}</p>
                            </div>
                          </div>
                          <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[var(--success-subtle)] text-[var(--success)] font-bold">
                            {camp.roi}x ROI
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Group: Reports */}
                {filteredReports.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] px-3 py-1 shrink-0">
                      Reports ({filteredReports.length})
                    </div>
                    {filteredReports.map((rep) => {
                      const flatIndex = flatResults.findIndex((r) => r.id === rep.id && r.type === "report");
                      const isSelected = selectedIndex === flatIndex;
                      return (
                        <div
                          key={rep.id}
                          onClick={() => {
                            addToHistory(query);
                            router.push(rep.url);
                            setOpen(false);
                          }}
                          className={cn(
                            "flex h-12 items-center justify-between rounded-lg px-3 cursor-pointer transition-all duration-150 relative",
                            isSelected ? "bg-[var(--highlight)] text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:bg-[var(--highlight)]"
                          )}
                        >
                          {isSelected && <div className="absolute left-0 top-[15%] bottom-[15%] w-[2.5px] rounded-r-md bg-[var(--accent)]" />}
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                              <FileText className="w-3.5 h-3.5 text-[var(--accent2)]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{rep.title}</p>
                              <p className="text-[10px] text-[var(--text-muted)] truncate">System Analytics PDF Audit</p>
                            </div>
                          </div>
                          <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                            PDF
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-[var(--text-muted)] text-center py-6">
                No results found for &ldquo;{query}&rdquo;
              </p>
            )}
          </div>

          {/* Footer Navigation Hints */}
          <div className="flex h-9 items-center justify-between px-4 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50 select-none">
            <span className="text-[10px] text-[var(--text-muted)]">
              Press <kbd className="px-1 font-mono font-bold">↵</kbd> to select · <kbd className="px-1 font-mono font-bold">↑↓</kbd> to navigate
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">
              Esc to close
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
