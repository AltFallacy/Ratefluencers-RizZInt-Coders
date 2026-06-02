"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import {
  Trophy,
  CheckCircle2,
  AlertCircle,
  Star,
} from "lucide-react";
import { KpiCard } from "@/components/shared/kpi-card";
import { ChartCard } from "@/components/shared/chart-card";
import { PageHeader } from "@/components/shared/page-header";
import { SearchZone } from "@/components/search/SearchZone";
import { dashboardKpis, followerGrowthData, engagementData, activityFeed } from "@/data/dashboard";
import { mockInfluencer } from "@/data/influencer";
import { cn } from "@/lib/utils";
import type { ActivityEvent } from "@/types";
import { Card } from "@/components/ui/card";
import { containerVariants, cardVariants, fadeUpVariants } from "@/lib/animations";

const activityConfig: Record<ActivityEvent["type"], { icon: React.ElementType; color: string }> = {
  campaign: { icon: Trophy, color: "text-[var(--accent-light)] bg-[var(--accent-subtle)]" },
  evaluation: { icon: CheckCircle2, color: "text-[var(--success)] bg-[var(--success-subtle)]" },
  milestone: { icon: Star, color: "text-[var(--warning)] bg-[var(--warning-subtle)]" },
  alert: { icon: AlertCircle, color: "text-[var(--danger)] bg-[var(--danger-subtle)]" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

const CustomTooltip = ({
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
      {payload.map((p) => (
        <p key={p.name} className="py-0.5 font-medium" style={{ color: p.color }}>
          {p.name}: {formatFollowers(p.value)}
        </p>
      ))}
    </div>
  );
};

const EngagementTooltip = ({
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
      {payload.map((p) => (
        <p key={p.name} className="py-0.5 font-medium" style={{ color: p.color }}>
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { name, username, followerCount, engagementRate, niche } = mockInfluencer;
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
      {/* Header and Profile Brief */}
      <motion.div variants={fadeUpVariants} className="space-y-4">
        <PageHeader
          title="Executive Overview"
          description={`Overview of ${username}`}
        />

        {/* Influencer Profile Subcard */}
        <Card variant="default" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] text-lg font-bold text-white shadow-sm">
              {name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-[var(--text-primary)]">{name}</span>
                <span className="rounded-full bg-[var(--accent-subtle)] px-2 py-0.5 text-xs font-semibold text-[var(--accent-light)] border border-[var(--accent-glow)] select-none">
                  Verified ✓
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {username} · {niche.join(", ")} · {formatFollowers(followerCount)} followers · {engagementRate}% engagement
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Dynamic Search & Filter Hub */}
      <motion.div variants={fadeUpVariants}>
        <SearchZone />
      </motion.div>

      {/* Metric Cards Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {dashboardKpis.map((kpi) => (
          <motion.div key={kpi.id} variants={cardVariants}>
            <KpiCard data={kpi} />
          </motion.div>
        ))}
      </motion.div>

      {/* Analytics Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Follower Growth Trend */}
        <motion.div variants={cardVariants}>
          <ChartCard
            title="Follower Growth Trend"
            subtitle="Total vs Organic growth — last 12 months"
          >
            <div className="h-[280px] w-full mt-2">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={followerGrowthData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v: number) => formatFollowers(v)}
                      tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                      width={48}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: 11, color: "var(--text-secondary)", paddingTop: 12 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      name="Total Followers"
                      stroke="var(--accent-light)"
                      strokeWidth={2.5}
                      fill="url(#colorTotal)"
                      activeDot={{ r: 4, strokeWidth: 0, fill: "var(--accent-light)" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="organic"
                      name="Organic Followers"
                      stroke="var(--accent2)"
                      strokeWidth={2}
                      strokeDasharray="5 3"
                      fill="transparent"
                      activeDot={{ r: 4, strokeWidth: 0, fill: "var(--accent2)" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="skeleton w-full h-full rounded-2xl" />
              )}
            </div>
          </ChartCard>
        </motion.div>

        {/* Engagement Rate */}
        <motion.div variants={cardVariants}>
          <ChartCard
            title="Weekly Engagement Rate"
            subtitle="Weekly performance metrics vs industry average (3.1%)"
          >
            <div className="h-[280px] w-full mt-2">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={engagementData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                    <XAxis
                      dataKey="week"
                      tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v: number) => `${v}%`}
                      tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                      width={36}
                    />
                    <Tooltip content={<EngagementTooltip />} />
                    <ReferenceLine
                      y={3.1}
                      stroke="var(--warning)"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{ value: "Industry Avg", position: "right", fontSize: 10, fill: "var(--warning)", fontWeight: 500 }}
                    />
                    <Bar dataKey="rate" name="Engagement %" fill="var(--success)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="skeleton w-full h-full rounded-2xl" />
              )}
            </div>
          </ChartCard>
        </motion.div>
      </div>

      {/* Activity Feed */}
      <motion.div variants={fadeUpVariants}>
        <Card variant="default" className="p-6">
          <h3 className="mb-4 text-sm font-semibold tracking-tight text-[var(--text-primary)]">Recent Activity</h3>
          <div className="flex flex-col divide-y divide-[var(--border-subtle)]">
            {activityFeed.map((event) => {
              const { icon: Icon, color } = activityConfig[event.type];
              return (
                <div key={event.id} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
                  <div className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg shadow-sm", color)}>
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--text-primary)] leading-tight">{event.title}</p>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">{event.description}</p>
                  </div>
                  <span className="shrink-0 text-xs text-[var(--text-muted)] font-medium">{formatDate(event.timestamp)}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
