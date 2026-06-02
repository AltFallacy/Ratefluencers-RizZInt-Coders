"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { brandMatches, allIndustries } from "@/data/brands";
import { PageHeader } from "@/components/shared/page-header";
import { ScoreRing } from "@/components/shared/score-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatedProgressBar as ProgressBar } from "@/components/shared/progress-bar";
import { ArrowRight, Filter, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { containerVariants, cardVariants, fadeUpVariants } from "@/lib/animations";
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
    if (selectedIndustries.length > 0) {
      result = result.filter((brand) =>
        brand.industry.some((ind) => selectedIndustries.includes(ind))
      );
    }
    result = [...result].sort((a, b) => {
      if (sortOption === "score") return b.matchScore - a.matchScore;
      return a.name.localeCompare(b.name);
    });
    return result;
  }, [selectedIndustries, sortOption]);

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={fadeUpVariants}>
        <PageHeader
          title="Brand Matching"
          description="Discover which brands align best with this influencer based on audience and content compatibility."
        />
      </motion.div>

      {/* Filter & Sort Bar */}
      <motion.div variants={cardVariants}>
        <Card variant="default" className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 md:flex-1">
            <div className="flex items-center gap-2">
              <Filter className="size-3.5 text-[var(--accent-light)]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Filter by Industry
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allIndustries.map((ind) => {
                const isSelected = selectedIndustries.includes(ind);
                return (
                  <button
                    key={ind}
                    onClick={() => toggleIndustry(ind)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 ${
                      isSelected
                        ? "bg-[var(--accent)] text-white shadow-sm shadow-[var(--accent-glow)]"
                        : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--highlight)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]"
                    }`}
                  >
                    {ind}
                  </button>
                );
              })}
              {selectedIndustries.length > 0 && (
                <button
                  onClick={() => setSelectedIndustries([])}
                  className="rounded-full px-3 py-1 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 md:w-48 shrink-0">
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="size-3 text-[var(--text-muted)]" />
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Sort by</label>
            </div>
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
        </Card>
      </motion.div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        {filteredAndSortedBrands.map((brand, i) => (
          <motion.div
            key={brand.id}
            variants={cardVariants}
            whileHover={{ y: -2, scale: 1.005 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card variant="default" className="flex flex-col h-full p-6 hover:border-[var(--border-default)] transition-colors">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white shadow-inner"
                    style={{ backgroundColor: brand.color }}
                  >
                    {brand.initials}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[var(--text-primary)]">
                      {brand.name}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
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
                    size={60}
                    strokeWidth={5}
                    labelSuffix="%"
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Progress Bars */}
              <div className="flex-1 space-y-3.5">
                <ProgressBar label="Audience Overlap" value={brand.compatibility.audienceOverlap} />
                <ProgressBar label="Content Style" value={brand.compatibility.contentStyle} />
                <ProgressBar label="Engagement Quality" value={brand.compatibility.engagementQuality} />
                <ProgressBar label="Brand Safety" value={brand.compatibility.brandSafety} />
              </div>

              {/* Footer */}
              <div className="mt-5 border-t border-[var(--border-subtle)] pt-4">
                <Button
                  variant="ghost"
                  className="w-full justify-between text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--highlight)]"
                >
                  View Match Details
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}

        {filteredAndSortedBrands.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-subtle)] py-20 text-center">
            <p className="text-[var(--text-muted)] mb-3 text-sm">No brands match the selected filters.</p>
            <Button variant="outline" onClick={() => setSelectedIndustries([])}>
              Clear Filters
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
