"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { brandMatches, allIndustries } from "@/data/brands";
import { PageHeader } from "@/components/shared/page-header";
import { ScoreRing } from "@/components/shared/score-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedProgressBar as ProgressBar } from "@/components/shared/progress-bar";
import { ArrowRight, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SortOption } from "@/types";

export default function BrandMatchingPage() {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("score");

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
  };

  const filteredAndSortedBrands = useMemo(() => {
    let result = brandMatches;

    // Filter
    if (selectedIndustries.length > 0) {
      result = result.filter((brand) =>
        brand.industry.some((ind) => selectedIndustries.includes(ind))
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortOption === "score") {
        return b.matchScore - a.matchScore;
      }
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [selectedIndustries, sortOption]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PageHeader
          title="Brand Matching"
          description="Discover which brands align best with this influencer based on audience and content compatibility."
        />
      </motion.div>

      {/* Filter & Sort Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex flex-col gap-3 md:flex-1">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
            <Filter className="size-4" />
            <span>Filter by Industry</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allIndustries.map((ind) => {
              const isSelected = selectedIndustries.includes(ind);
              return (
                <button
                  key={ind}
                  onClick={() => toggleIndustry(ind)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-violet-500 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {ind}
                </button>
              );
            })}
            {selectedIndustries.length > 0 && (
              <button
                onClick={() => setSelectedIndustries([])}
                className="rounded-full px-3 py-1 text-xs font-medium text-zinc-500 hover:text-zinc-300"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 md:w-48 shrink-0">
          <label className="text-sm font-medium text-zinc-400">Sort by</label>
          <Select
            value={sortOption}
            onValueChange={(val) => setSortOption(val as SortOption)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Match Score</SelectItem>
              <SelectItem value="alpha">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredAndSortedBrands.map((brand, i) => (
          <motion.div
            key={brand.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
            className="group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-all hover:scale-[1.01] hover:border-zinc-700"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div
                  className="flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white shadow-inner"
                  style={{ backgroundColor: brand.color }}
                >
                  {brand.initials}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100">
                    {brand.name}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {brand.industry.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                <ScoreRing
                  score={brand.matchScore}
                  size={64}
                  strokeWidth={6}
                  labelSuffix="%"
                  className="text-lg"
                />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <ProgressBar
                label="Audience Overlap"
                value={brand.compatibility.audienceOverlap}
              />
              <ProgressBar
                label="Content Style"
                value={brand.compatibility.contentStyle}
              />
              <ProgressBar
                label="Engagement Quality"
                value={brand.compatibility.engagementQuality}
              />
              <ProgressBar
                label="Brand Safety"
                value={brand.compatibility.brandSafety}
              />
            </div>

            <div className="mt-6 border-t border-zinc-800 pt-5">
              <Button
                variant="ghost"
                className="w-full justify-between text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
              >
                View Match Details
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </motion.div>
        ))}
        {filteredAndSortedBrands.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-16 text-center">
            <p className="text-zinc-400 mb-2">No brands match the selected filters.</p>
            <Button variant="outline" onClick={() => setSelectedIndustries([])}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
