"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { TrendingUp, Calendar, Percent } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ChartCard } from "@/components/shared/chart-card";
import { Card } from "@/components/ui/card";
import { growthForecasts, growthTimelineData, velocityData } from "@/data/growth";
import { containerVariants, cardVariants, fadeUpVariants } from "@/lib/animations";

function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function formatDelta(n: number) {
  if (n >= 1_000) return `+${(n / 1_000).toFixed(1)}K`;
  return `+${n}`;
}

const TimelineTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[10px] border border-[var(--border-default)] bg-[var(--bg-overlay)] p-3.5 shadow-[var(--shadow-lg)] text-xs backdrop-blur-md">
      <p className="mb-1.5 font-semibold text-[var(--text-primary)]">{label}</p>
      {payload.map((p) =>
        p.value ? (
          <p key={p.name} className="py-0.5 font-medium" style={{ color: p.color }}>
            {p.name}: {formatFollowers(p.value)}
          </p>
        ) : null
      )}
    </div>
  );
};

const VelocityTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[10px] border border-[var(--border-default)] bg-[var(--bg-overlay)] p-3.5 shadow-[var(--shadow-lg)] text-xs backdrop-blur-md">
      <p className="mb-1.5 font-semibold text-[var(--text-primary)]">{label}</p>
      <p className="text-[var(--accent-light)] font-medium">Growth: {formatDelta(payload[0].value)}</p>
    </div>
  );
};

export default function GrowthPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={fadeUpVariants}>
        <PageHeader
          title="Growth Forecast"
          description="AI-powered follower growth predictions with confidence intervals"
        />
      </motion.div>

      {/* Forecast Cards Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 gap-5 sm:grid-cols-3"
      >
        {growthForecasts.map((forecast, i) => (
          <motion.div key={forecast.period} variants={cardVariants}>
            <Card variant="default" className="p-5 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                    <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    {forecast.label}
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-[var(--success-subtle)] px-2 py-0.5 text-[10px] font-bold text-[var(--success)] border border-[var(--success)]/10 uppercase tracking-wide">
                    <Percent className="w-3 h-3" />
                    {forecast.confidence}% conf.
                  </span>
                </div>
                <p className="text-2xl font-bold text-[var(--success)] tracking-tight">
                  {formatDelta(forecast.predictedGrowth)}
                </p>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">predicted new followers</p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border-subtle)]">
                <TrendingUp className="w-3.5 h-3.5 text-[var(--accent-light)]" />
                <span>Based on 18-month trend model</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Timeline chart */}
      <motion.div variants={cardVariants}>
        <ChartCard
          title="Follower Growth Timeline"
          subtitle="6 months historical + 3 months AI-projected (shaded = confidence band)"
        >
          <div className="h-[300px] w-full mt-2">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={growthTimelineData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="confidenceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v: number) => formatFollowers(v)}
                    tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                    axisLine={false}
                    tickLine={false}
                    width={54}
                  />
                  <Tooltip content={<TimelineTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "var(--text-secondary)", paddingTop: 10 }} />

                  {/* Confidence band */}
                  <Area
                    type="monotone"
                    dataKey="confidenceHigh"
                    name="Confidence High"
                    fill="url(#confidenceGrad)"
                    stroke="none"
                    legendType="none"
                  />
                  <Area
                    type="monotone"
                    dataKey="confidenceLow"
                    name="Confidence Low"
                    fill="var(--bg-surface)"
                    stroke="none"
                    legendType="none"
                  />

                  {/* Actual line */}
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="Historical"
                    stroke="var(--accent)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: "var(--accent)" }}
                    connectNulls={false}
                  />
                  {/* Predicted line */}
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    name="Projected"
                    stroke="var(--accent-light)"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: "var(--accent-light)" }}
                    connectNulls={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="skeleton w-full h-full rounded-2xl" />
            )}
          </div>
        </ChartCard>
      </motion.div>

      {/* Velocity chart */}
      <motion.div variants={cardVariants}>
        <ChartCard
          title="Growth Velocity"
          subtitle="Week-over-week follower gain"
        >
          <div className="h-[220px] w-full mt-2">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={velocityData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v: number) => formatDelta(v)}
                    tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                  />
                  <Tooltip content={<VelocityTooltip />} />
                  <Bar
                    dataKey="growth"
                    radius={[6, 6, 0, 0]}
                    fill="var(--accent)"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="skeleton w-full h-full rounded-2xl" />
            )}
          </div>
        </ChartCard>
      </motion.div>
    </motion.div>
  );
}
