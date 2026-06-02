"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Star, TrendingUp, AlertCircle, Users } from "lucide-react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { AnimatedProgressBar as ProgressBar } from "@/components/shared/progress-bar";
import { ApiErrorBanner, LiveBadge } from "@/components/shared/api-error";
import { ScoreRingSkeleton } from "@/components/shared/loading-skeleton";
import { useRatefluencerScore } from "@/hooks/use-api";

export default function ScorePage() {
  const { data: scoreData, isError, isFetching } = useRatefluencerScore();
  const isBackendOffline = isError;

  const [mounted, setMounted] = useState(false);
  const scoreValue   = useMotionValue(0);
  const roundedScore = useTransform(scoreValue, (latest) => Math.round(latest));

  useEffect(() => {
    setMounted(true);
    if (!scoreData) return;
    const controls = animate(scoreValue, scoreData.composite, {
      duration: 1.2,
      ease: "easeOut",
    });
    return controls.stop;
  }, [scoreValue, scoreData]);

  const radarData = (scoreData?.categories ?? []).map((c) => ({
    subject:     c.name,
    score:       c.score,
    industryAvg: c.industryAvg,
    fullMark:    100,
  }));

  const circumference     = 2 * Math.PI * 120;
  const strokeDashoffset  = circumference - ((scoreData?.composite ?? 0) / 100) * circumference;

  if (!mounted || (isFetching && !scoreData)) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 py-16">
          <ScoreRingSkeleton size={288} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ApiErrorBanner show={isBackendOffline} />

      <div className="flex justify-end">
        <LiveBadge isLive={!isBackendOffline} />
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-10 text-center shadow-2xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-zinc-950 to-zinc-950" />
        <div className="relative z-10 mx-auto max-w-2xl">
          <Badge variant="violet" className="mb-6 px-4 py-1 text-sm">
            <Star className="mr-2 size-4" />
            {scoreData!.tierLabel}
          </Badge>

          <div className="relative mx-auto flex size-72 items-center justify-center">
            <svg className="absolute inset-0 size-full -rotate-90 transform">
              <circle cx="144" cy="144" r="120" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-zinc-800" />
              <motion.circle
                cx="144" cy="144" r="120" stroke="currentColor" strokeWidth="12" fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round"
                className="text-violet-500"
              />
            </svg>
            <div className="text-center">
              <motion.span className="text-7xl font-bold tracking-tighter text-white">{roundedScore}</motion.span>
              <span className="text-3xl font-medium text-zinc-500">/100</span>
            </div>
          </div>
          <p className="mt-6 text-lg font-medium text-zinc-300">
            Top <span className="text-emerald-400 font-bold">{100 - scoreData!.percentile}%</span> of all analyzed influencers
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
        >
          <h3 className="mb-6 text-lg font-semibold text-zinc-100">Category Breakdown</h3>
          <div className="space-y-6">
            {scoreData!.categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-200">{cat.name}</span>
                    <Badge variant="secondary" className="text-[10px]">{cat.weight}% Weight</Badge>
                  </div>
                  <span className="text-sm font-bold text-zinc-100">{cat.score} / 100</span>
                </div>
                <ProgressBar value={cat.score} showPercent={false} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col"
        >
          <h3 className="mb-6 text-lg font-semibold text-zinc-100">Performance vs Industry</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke="#3f3f46" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", color: "#f4f4f5", borderRadius: "8px" }} itemStyle={{ color: "#c4b5fd" }} />
                <Radar name="This Influencer" dataKey="score"       stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                <Radar name="Industry Avg"    dataKey="industryAvg" stroke="#52525b" fill="#52525b" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-6 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-sm bg-violet-500/40 border border-violet-500" />
              <span>This Influencer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-sm bg-zinc-600/30 border border-zinc-500" />
              <span>Industry Avg</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <TrendingUp className="size-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-100">Top Strengths</h3>
          </div>
          <ul className="space-y-3">
            {scoreData!.strengths.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-zinc-300">
                <div className="size-1.5 rounded-full bg-emerald-400" />
                {s}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Improvement Areas */}
        <motion.div
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.45 }}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10">
              <AlertCircle className="size-4 text-amber-400" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-100">Areas for Improvement</h3>
          </div>
          <ul className="space-y-3">
            {scoreData!.improvementAreas.map((w) => (
              <li key={w} className="flex items-center gap-2 text-sm text-zinc-300">
                <div className="size-1.5 rounded-full bg-amber-400" />
                {w}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Comparables */}
        <motion.div
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-sky-500/10">
              <Users className="size-4 text-sky-400" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-100">Comparable Influencers</h3>
          </div>
          <div className="space-y-3">
            {scoreData!.comparableInfluencers.map((comp) => (
              <div key={comp.id} className="flex items-center justify-between rounded-lg bg-zinc-950 px-3 py-2 border border-zinc-800/50">
                <div>
                  <p className="text-xs font-medium text-zinc-200">{comp.name}</p>
                  <p className="text-[10px] text-zinc-500">{comp.platform}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="size-3 text-violet-400" />
                  <span className="text-xs font-bold text-zinc-100">{comp.score}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
