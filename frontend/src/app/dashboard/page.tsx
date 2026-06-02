"use client";

import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";
import {
  Trophy, Zap, Target, TrendingUp, CheckCircle2, AlertCircle, Flag, Star,
} from "lucide-react";
import { KpiCard } from "@/components/shared/kpi-card";
import { ChartCard } from "@/components/shared/chart-card";
import { PageHeader } from "@/components/shared/page-header";
import { ApiErrorBanner, LiveBadge } from "@/components/shared/api-error";
import { KpiSkeletonRow, ChartSkeleton, IdentityCardSkeleton } from "@/components/shared/loading-skeleton";
import { dashboardKpis, followerGrowthData, engagementData, activityFeed } from "@/data/dashboard";
import { useInfluencer } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import type { ActivityEvent } from "@/types";

const activityConfig: Record<ActivityEvent["type"], { icon: React.ElementType; color: string }> = {
  campaign:   { icon: Trophy,       color: "text-violet-400 bg-violet-500/10" },
  evaluation: { icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10" },
  milestone:  { icon: Star,         color: "text-amber-400 bg-amber-500/10" },
  alert:      { icon: AlertCircle,  color: "text-rose-400 bg-rose-500/10" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-xl text-xs">
      <p className="mb-1 font-medium text-zinc-300">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {formatFollowers(p.value)}
        </p>
      ))}
    </div>
  );
};

const EngagementTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-xl text-xs">
      <p className="mb-1 font-medium text-zinc-300">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { data: influencer, isError, isFetching } = useInfluencer();
  const isBackendOffline = isError;

  const name          = influencer?.name          ?? "—";
  const username      = influencer?.username       ?? "—";
  const niche         = influencer?.niche          ?? [];
  const followerCount = influencer?.followerCount  ?? 0;
  const engagementRate = influencer?.engagementRate ?? 0;

  return (
    <div>
      {/* Offline Banner */}
      <ApiErrorBanner show={isBackendOffline} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <PageHeader
          title="Executive Overview"
          description="Full intelligence profile for the selected influencer"
        />

        {/* Influencer identity */}
        {isFetching && !influencer ? (
          <IdentityCardSkeleton />
        ) : (
          <div className="mb-6 flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-700 text-lg font-bold text-white">
              {name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base font-semibold text-zinc-100">{name}</span>
                <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-xs font-medium text-violet-400 border border-violet-500/20">
                  Verified ✓
                </span>
                <LiveBadge isLive={!isBackendOffline} />
              </div>
              <p className="text-sm text-zinc-500">
                {username} · {niche.join(", ")} · {formatFollowers(followerCount)} followers ·{" "}
                {engagementRate}% engagement
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* KPI Row */}
      {isFetching && !influencer ? (
        <KpiSkeletonRow />
      ) : (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 mb-6">
          {dashboardKpis.map((kpi, i) => (
            <KpiCard key={kpi.id} data={kpi} index={i} />
          ))}
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-6">
        {/* Follower Growth */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.25 }}>
          <ChartCard title="Follower Growth Trend" subtitle="Total vs Organic — last 12 months">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={followerGrowthData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v: number) => formatFollowers(v)} tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} width={48} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#71717a", paddingTop: 8 }} />
                <Line type="monotone" dataKey="total"   name="Total Followers"   stroke="#a78bfa" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#a78bfa" }} />
                <Line type="monotone" dataKey="organic" name="Organic Followers" stroke="#38bdf8" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#38bdf8" }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        {/* Engagement Rate */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.31 }}>
          <ChartCard title="Engagement Rate" subtitle="Weekly rate vs industry average (3.1%)">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={engagementData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v: number) => `${v}%`} tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<EngagementTooltip />} />
                <ReferenceLine y={3.1} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Avg", position: "right", fontSize: 10, fill: "#f59e0b" }} />
                <Bar dataKey="rate" name="Engagement %" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>
      </div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.38 }}
        className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
      >
        <h3 className="mb-4 text-sm font-medium text-zinc-100">Recent Activity</h3>
        <div className="flex flex-col divide-y divide-zinc-800">
          {activityFeed.map((event) => {
            const { icon: Icon, color } = activityConfig[event.type];
            return (
              <div key={event.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <div className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg", color)}>
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-200">{event.title}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{event.description}</p>
                </div>
                <span className="shrink-0 text-xs text-zinc-600">{formatDate(event.timestamp)}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
