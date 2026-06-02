"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ShieldCheck, AlertTriangle, Bot, Users, Award, LucideIcon } from "lucide-react";
import { ScoreRing } from "@/components/shared/score-ring";
import { AnimatedProgressBar } from "@/components/shared/progress-bar";
import { RiskBadge } from "@/components/shared/risk-badge";
import { PageHeader } from "@/components/shared/page-header";
import { ChartCard } from "@/components/shared/chart-card";
import { authenticityData } from "@/data/authenticity";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { containerVariants, cardVariants, fadeUpVariants } from "@/lib/animations";

const riskIcons: Record<string, LucideIcon> = {
  "ri-001": AlertTriangle,
  "ri-002": ShieldCheck,
  "ri-003": Users,
  "ri-004": Bot,
  "ri-005": Award,
};

const compositionData = [
  { name: "Real", value: authenticityData.followerComposition.real, color: "var(--success)" },
  { name: "Suspicious", value: authenticityData.followerComposition.suspicious, color: "var(--warning)" },
  { name: "Bot", value: authenticityData.followerComposition.bot, color: "var(--danger)" },
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
    <div className="rounded-[10px] border border-[var(--border-default)] bg-[var(--bg-overlay)] p-3.5 shadow-[var(--shadow-lg)] text-xs backdrop-blur-md">
      <p style={{ color: payload[0].payload.color }} className="font-semibold">
        {payload[0].name}: {payload[0].value}%
      </p>
    </div>
  );
};

export default function AuthenticityPage() {
  const d = authenticityData;
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
          title="Authenticity Analysis"
          description="Fake follower detection, bot engagement, and audience quality scoring"
        />
      </motion.div>

      {/* Hero Score Card */}
      <motion.div variants={cardVariants}>
        <Card variant="elevated" className="flex flex-col items-center justify-center gap-4 py-10">
          <ScoreRing score={d.overallScore} size={160} strokeWidth={12} labelSuffix="/ 100" />
          <div className="flex flex-col items-center gap-1.5 mt-2">
            <RiskBadge level={d.riskLevel} />
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Overall Authenticity Score</p>
          </div>
        </Card>
      </motion.div>

      {/* Metric Cards Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {[
          { label: "Fake Follower Risk", value: d.fakeFollowerRisk, isRisk: true, colorClass: "bg-[var(--danger)]" },
          { label: "Bot Engagement", value: d.botEngagement, isRisk: true, colorClass: "bg-[var(--danger)]" },
          { label: "Engagement Authenticity", value: d.engagementAuthenticity, isRisk: false, colorClass: "bg-[var(--success)]" },
          { label: "Audience Quality Score", value: d.audienceQualityScore, isRisk: false, colorClass: "bg-[var(--success)]" },
        ].map((m, i) => (
          <motion.div key={m.label} variants={cardVariants}>
            <Card variant="default" className="p-5 flex flex-col justify-between h-full">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">{m.label}</p>
                <p className={cn(
                  "mt-2 text-3xl font-bold tracking-tight",
                  m.isRisk ? "text-[var(--danger)]" : "text-[var(--success)]"
                )}>
                  {m.value}
                  <span className="text-base font-semibold text-[var(--text-muted)] ml-0.5">%</span>
                </p>
              </div>
              <div className="mt-4">
                <AnimatedProgressBar
                  label=""
                  value={m.value}
                  delay={0.1 + i * 0.05}
                  colorClass={m.colorClass}
                  showPercent={false}
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts + Risk Indicators */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Donut chart */}
        <motion.div variants={cardVariants}>
          <ChartCard
            title="Follower Composition"
            subtitle="Breakdown of audience quality segments"
          >
            <div className="h-[260px] w-full mt-2">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={compositionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                      animationBegin={200}
                      animationDuration={800}
                    >
                      {compositionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: 11, color: "var(--text-secondary)", paddingTop: 10 }}
                      formatter={(value) => <span className="text-[var(--text-secondary)] font-medium">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="skeleton w-full h-full rounded-2xl" />
              )}
            </div>
          </ChartCard>
        </motion.div>

        {/* Risk Indicators List */}
        <motion.div variants={cardVariants}>
          <Card variant="default" className="p-6">
            <h3 className="mb-4 text-sm font-semibold tracking-tight text-[var(--text-primary)]">Risk Indicators</h3>
            <div className="flex flex-col gap-3">
              {d.riskIndicators.map((indicator, i) => {
                const Icon = riskIcons[indicator.id] ?? ShieldCheck;
                return (
                  <motion.div
                    key={indicator.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.15 + i * 0.05 }}
                    className="flex items-start gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/30 p-3.5 hover:border-[var(--border-default)] transition-colors duration-150"
                  >
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-sm">
                      <Icon className="size-4 text-[var(--text-secondary)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[var(--text-primary)]">{indicator.label}</span>
                        <RiskBadge level={indicator.risk} />
                      </div>
                      <p className="mt-1.5 text-xs text-[var(--text-muted)] leading-relaxed">{indicator.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
