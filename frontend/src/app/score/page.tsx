"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Star, TrendingUp, AlertCircle, Users, Award } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ratefluencerScore } from "@/data/score";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AnimatedProgressBar as ProgressBar } from "@/components/shared/progress-bar";
import { containerVariants, cardVariants, fadeUpVariants } from "@/lib/animations";

export default function ScorePage() {
  const [mounted, setMounted] = useState(false);
  const scoreValue = useMotionValue(0);
  const roundedScore = useTransform(scoreValue, (latest) => Math.round(latest));

  useEffect(() => {
    setMounted(true);
    const controls = animate(scoreValue, ratefluencerScore.composite, {
      duration: 1.4,
      ease: "easeOut",
    });
    return controls.stop;
  }, [scoreValue]);

  const radarData = ratefluencerScore.categories.map((c) => ({
    subject: c.name,
    score: c.score,
    industryAvg: c.industryAvg,
    fullMark: 100,
  }));

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset =
    circumference - (ratefluencerScore.composite / 100) * circumference;

  if (!mounted) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Hero Section */}
      <motion.div variants={fadeUpVariants}>
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-10 text-center">
          {/* Radial gradient glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, var(--accent-subtle) 0%, transparent 70%)",
            }}
          />
          {/* Decorative ring blur */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
            style={{ background: "var(--accent)" }}
          />

          <div className="relative z-10 mx-auto max-w-2xl">
            <Badge variant="violet" className="mb-8 px-4 py-1.5 text-xs">
              <Award className="mr-1.5 size-3.5" />
              {ratefluencerScore.tierLabel}
            </Badge>

            {/* Score Ring */}
            <div className="relative mx-auto flex size-72 items-center justify-center">
              <svg className="absolute inset-0 size-full -rotate-90 transform">
                {/* Track */}
                <circle
                  cx="144"
                  cy="144"
                  r="120"
                  stroke="var(--border-subtle)"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Glow fill (faint) */}
                <circle
                  cx="144"
                  cy="144"
                  r="120"
                  stroke="var(--accent-glow)"
                  strokeWidth="20"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  opacity={0.3}
                />
                {/* Primary arc */}
                <motion.circle
                  cx="144"
                  cy="144"
                  r="120"
                  stroke="var(--accent)"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-center">
                <motion.span
                  className="block text-7xl font-extrabold tracking-tighter text-[var(--text-primary)]"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {roundedScore}
                </motion.span>
                <span className="text-2xl font-medium text-[var(--text-muted)]">
                  / 100
                </span>
              </div>
            </div>

            <p className="mt-6 text-base font-medium text-[var(--text-secondary)]">
              Top{" "}
              <span className="font-bold text-[var(--success)]">
                {100 - ratefluencerScore.percentile}%
              </span>{" "}
              of all analyzed influencers
            </p>
          </div>
        </div>
      </motion.div>

      {/* Category Breakdown + Radar */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Category Breakdown */}
        <motion.div variants={cardVariants}>
          <Card variant="default" className="h-full p-6">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-md bg-[var(--accent-subtle)] border border-[var(--accent-glow)]">
                <Star className="size-3 text-[var(--accent-light)]" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Category Breakdown
              </h3>
            </div>
            <div className="space-y-5">
              {ratefluencerScore.categories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--text-secondary)]">
                        {cat.name}
                      </span>
                      <Badge variant="secondary" className="text-[9px] px-1.5">
                        {cat.weight}%
                      </Badge>
                    </div>
                    <span className="text-sm font-bold tabular-nums text-[var(--text-primary)]">
                      {cat.score}
                      <span className="font-normal text-[var(--text-muted)]">
                        /100
                      </span>
                    </span>
                  </div>
                  <ProgressBar value={cat.score} showPercent={false} />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Radar Chart */}
        <motion.div variants={cardVariants}>
          <Card variant="default" className="flex h-full flex-col p-6">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-md bg-[var(--accent-subtle)] border border-[var(--accent-glow)]">
                <TrendingUp className="size-3 text-[var(--accent-light)]" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Performance vs Industry
              </h3>
            </div>
            <div className="flex-1 min-h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  data={radarData}
                  margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                >
                  <PolarGrid stroke="var(--border-subtle)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "var(--text-muted)", fontSize: 11, fontWeight: 500 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--bg-elevated)",
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-primary)",
                      borderRadius: "10px",
                      fontSize: "12px",
                    }}
                    itemStyle={{ color: "var(--accent-light)" }}
                  />
                  <Radar
                    name="This Influencer"
                    dataKey="score"
                    stroke="var(--accent)"
                    fill="var(--accent)"
                    fillOpacity={0.35}
                  />
                  <Radar
                    name="Industry Avg"
                    dataKey="industryAvg"
                    stroke="var(--border-default)"
                    fill="var(--border-default)"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div
                  className="size-2.5 rounded-sm border"
                  style={{
                    background: "color-mix(in srgb, var(--accent) 35%, transparent)",
                    borderColor: "var(--accent)",
                  }}
                />
                <span className="text-[11px] text-[var(--text-muted)]">
                  This Influencer
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="size-2.5 rounded-sm border"
                  style={{
                    background: "color-mix(in srgb, var(--border-default) 20%, transparent)",
                    borderColor: "var(--border-default)",
                  }}
                />
                <span className="text-[11px] text-[var(--text-muted)]">
                  Industry Avg
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Summary Cards: Strengths / Improvements / Comparables */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 gap-5 md:grid-cols-3"
      >
        {/* Strengths */}
        <motion.div variants={cardVariants}>
          <Card variant="default" className="h-full p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-[var(--success-subtle)]">
                <TrendingUp className="size-3.5 text-[var(--success)]" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Top Strengths
              </h3>
            </div>
            <ul className="space-y-3">
              {ratefluencerScore.strengths.map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.06 }}
                  className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]"
                >
                  <div
                    className="size-1.5 shrink-0 rounded-full"
                    style={{ background: "var(--success)" }}
                  />
                  {s}
                </motion.li>
              ))}
            </ul>
          </Card>
        </motion.div>

        {/* Weaknesses */}
        <motion.div variants={cardVariants}>
          <Card variant="default" className="h-full p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-[var(--warning-subtle)]">
                <AlertCircle className="size-3.5 text-[var(--warning)]" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Areas for Improvement
              </h3>
            </div>
            <ul className="space-y-3">
              {ratefluencerScore.improvementAreas.map((w, i) => (
                <motion.li
                  key={w}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.06 }}
                  className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]"
                >
                  <div
                    className="size-1.5 shrink-0 rounded-full"
                    style={{ background: "var(--warning)" }}
                  />
                  {w}
                </motion.li>
              ))}
            </ul>
          </Card>
        </motion.div>

        {/* Comparables */}
        <motion.div variants={cardVariants}>
          <Card variant="default" className="h-full p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-[var(--info-subtle)]">
                <Users className="size-3.5 text-[var(--info)]" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Comparable Influencers
              </h3>
            </div>
            <div className="space-y-2.5">
              {ratefluencerScore.comparableInfluencers.map((comp, i) => (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2.5 hover:border-[var(--border-default)] transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-primary)]">
                      {comp.name}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      {comp.platform}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="size-3 text-[var(--accent-light)]" />
                    <span className="text-xs font-bold tabular-nums text-[var(--text-primary)]">
                      {comp.score}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
