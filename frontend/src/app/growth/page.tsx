"use client";

import { motion } from "framer-motion";
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
import { growthForecasts, growthTimelineData, velocityData } from "@/data/growth";

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
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-xl text-xs">
      <p className="mb-1 font-medium text-zinc-300">{label}</p>
      {payload.map((p) =>
        p.value ? (
          <p key={p.name} style={{ color: p.color }}>
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
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-xl text-xs">
      <p className="mb-1 font-medium text-zinc-300">{label}</p>
      <p className="text-violet-400">Growth: {formatDelta(payload[0].value)}</p>
    </div>
  );
};

export default function GrowthPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PageHeader
          title="Growth Forecast"
          description="AI-powered follower growth predictions with confidence intervals"
        />
      </motion.div>

      {/* Forecast Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {growthForecasts.map((forecast, i) => (
          <motion.div
            key={forecast.period}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.06 + i * 0.07 }}
            whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                <Calendar className="size-3.5" />
                {forecast.label}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                <Percent className="size-3" />
                {forecast.confidence}% conf.
              </span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">
              {formatDelta(forecast.predictedGrowth)}
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">predicted new followers</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-500">
              <TrendingUp className="size-3.5 text-violet-400" />
              <span>Based on 18-month trend model</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Timeline chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.28 }}
        className="mb-4"
      >
        <ChartCard
          title="Follower Growth Timeline"
          subtitle="6 months historical + 3 months AI-projected (shaded = confidence band)"
        >
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={growthTimelineData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="confidenceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v: number) => formatFollowers(v)}
                tick={{ fontSize: 11, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
                width={54}
              />
              <Tooltip content={<TimelineTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#71717a", paddingTop: 8 }} />

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
                fill="#09090b"
                stroke="none"
                legendType="none"
              />

              {/* Actual line */}
              <Line
                type="monotone"
                dataKey="actual"
                name="Historical"
                stroke="#a78bfa"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
                connectNulls={false}
              />
              {/* Predicted line */}
              <Line
                type="monotone"
                dataKey="predicted"
                name="Projected"
                stroke="#c4b5fd"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                activeDot={{ r: 4 }}
                connectNulls={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>

      {/* Velocity chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.36 }}
      >
        <ChartCard
          title="Growth Velocity"
          subtitle="Week-over-week follower gain"
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={velocityData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 11, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v: number) => formatDelta(v)}
                tick={{ fontSize: 11, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip content={<VelocityTooltip />} />
              <Bar
                dataKey="growth"
                radius={[4, 4, 0, 0]}
                fill="#7c3aed"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>
    </div>
  );
}
