"use client";

import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ShieldCheck, AlertTriangle, Bot, Users, Award } from "lucide-react";
import { ScoreRing } from "@/components/shared/score-ring";
import { AnimatedProgressBar } from "@/components/shared/progress-bar";
import { RiskBadge } from "@/components/shared/risk-badge";
import { PageHeader } from "@/components/shared/page-header";
import { ChartCard } from "@/components/shared/chart-card";
import { authenticityData } from "@/data/authenticity";

const riskIcons: Record<string, React.ElementType> = {
  "ri-001": AlertTriangle,
  "ri-002": ShieldCheck,
  "ri-003": Users,
  "ri-004": Bot,
  "ri-005": Award,
};

const compositionData = [
  { name: "Real", value: authenticityData.followerComposition.real, color: "#10b981" },
  { name: "Suspicious", value: authenticityData.followerComposition.suspicious, color: "#f59e0b" },
  { name: "Bot", value: authenticityData.followerComposition.bot, color: "#f43f5e" },
];

const PieTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs shadow-xl">
      <p style={{ color: payload[0].payload.color }} className="font-medium">
        {payload[0].name}: {payload[0].value}%
      </p>
    </div>
  );
};

export default function AuthenticityPage() {
  const d = authenticityData;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PageHeader
          title="Authenticity Analysis"
          description="Fake follower detection, bot engagement, and audience quality scoring"
        />
      </motion.div>

      {/* Hero Score */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="mb-6 flex flex-col items-center justify-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 py-10"
      >
        <ScoreRing score={d.overallScore} size={160} strokeWidth={12} labelSuffix="/ 100" />
        <div className="flex flex-col items-center gap-1">
          <RiskBadge level={d.riskLevel} />
          <p className="text-sm text-zinc-500 mt-1">Overall Authenticity Score</p>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: "Fake Follower Risk", value: d.fakeFollowerRisk, isRisk: true },
          { label: "Bot Engagement", value: d.botEngagement, isRisk: true },
          { label: "Engagement Authenticity", value: d.engagementAuthenticity, isRisk: false },
          { label: "Audience Quality Score", value: d.audienceQualityScore, isRisk: false },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.12 + i * 0.06 }}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{m.label}</p>
            <p className={`mt-2 text-3xl font-bold tracking-tight ${m.isRisk ? "text-rose-400" : "text-emerald-400"}`}>
              {m.value}
              <span className="text-base font-medium text-zinc-500">%</span>
            </p>
            <div className="mt-3">
              <AnimatedProgressBar
                label=""
                value={m.value}
                delay={0.3 + i * 0.06}
                colorClass={m.isRisk ? "bg-rose-500" : "bg-emerald-500"}
                showPercent={false}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts + Risk Indicators */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-6">
        {/* Donut chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
        >
          <ChartCard
            title="Follower Composition"
            subtitle="Breakdown of audience quality segments"
          >
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={compositionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  animationBegin={300}
                  animationDuration={900}
                >
                  {compositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }}
                  formatter={(value) => <span style={{ color: "#a1a1aa" }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        {/* Risk Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.36 }}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
        >
          <h3 className="mb-4 text-sm font-medium text-zinc-100">Risk Indicators</h3>
          <div className="flex flex-col gap-3">
            {d.riskIndicators.map((indicator, i) => {
              const Icon = riskIcons[indicator.id] ?? ShieldCheck;
              return (
                <motion.div
                  key={indicator.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.4 + i * 0.07 }}
                  className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3"
                >
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                    <Icon className="size-4 text-zinc-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-zinc-200">{indicator.label}</span>
                      <RiskBadge level={indicator.risk} />
                    </div>
                    <p className="mt-1 text-xs text-zinc-500 leading-relaxed">{indicator.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
