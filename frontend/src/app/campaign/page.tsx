"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Target, DollarSign, Users, TrendingUp, Activity } from "lucide-react";
import { ScoreRing } from "@/components/shared/score-ring";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { defaultCampaignMetrics, historicalCampaigns, calculateCampaignMetrics } from "@/data/campaigns";
import { containerVariants, cardVariants, fadeUpVariants } from "@/lib/animations";
import type { CampaignMetrics, CampaignStatus, CampaignType } from "@/types";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

const statusConfig: Record<CampaignStatus, { variant: "success" | "sky" | "violet"; label: string }> = {
  Completed: { variant: "success", label: "Completed" },
  Active: { variant: "sky", label: "Active" },
  Planned: { variant: "violet", label: "Planned" },
};

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  index: number;
}

function MetricCard({ icon: Icon, label, value, index }: MetricCardProps) {
  return (
    <motion.div variants={cardVariants}>
      <Card variant="default" className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent-glow)]">
            <Icon className="size-3.5 text-[var(--accent-light)]" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">{label}</span>
        </div>
        <motion.p
          key={value}
          initial={{ opacity: 0.5, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-2xl font-bold tracking-tight text-[var(--text-primary)]"
        >
          {value}
        </motion.p>
      </Card>
    </motion.div>
  );
}

export default function CampaignPage() {
  const [budget, setBudget] = useState(10000);
  const [duration, setDuration] = useState(30);
  const [campaignType, setCampaignType] = useState<CampaignType>("Awareness");
  const [metrics, setMetrics] = useState<CampaignMetrics>(defaultCampaignMetrics);

  const recalculate = useCallback(
    (b: number, d: number, t: CampaignType) => {
      setMetrics(calculateCampaignMetrics(b, d, t));
    },
    []
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={fadeUpVariants}>
        <PageHeader
          title="Campaign Success"
          description="Predict campaign performance and simulate different budget scenarios"
        />
      </motion.div>

      {/* Hero Score */}
      <motion.div variants={cardVariants}>
        <Card variant="elevated" className="flex flex-col items-center justify-center gap-4 py-10">
          <ScoreRing score={metrics.successProbability} size={160} strokeWidth={12} labelSuffix="%" />
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-semibold text-[var(--text-secondary)]">Campaign Success Probability</p>
            <Badge variant="success">High Confidence Prediction</Badge>
          </div>
        </Card>
      </motion.div>

      {/* KPI Metric Cards */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-2 gap-5 xl:grid-cols-4"
      >
        <MetricCard icon={Users} label="Est. Reach" value={formatNumber(metrics.estimatedReach)} index={0} />
        <MetricCard icon={Activity} label="Est. Engagement" value={formatNumber(metrics.estimatedEngagement)} index={1} />
        <MetricCard icon={TrendingUp} label="Predicted ROI" value={`${metrics.predictedROI}x`} index={2} />
        <MetricCard icon={DollarSign} label="Avg Cost / Engagement" value={`$${metrics.avgCostPerEngagement.toFixed(2)}`} index={3} />
      </motion.div>

      {/* Simulator Panel */}
      <motion.div variants={cardVariants}>
        <Card variant="default" className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex size-7 items-center justify-center rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent-glow)]">
              <Target className="size-3.5 text-[var(--accent-light)]" />
            </div>
            <h3 className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">Campaign Simulator</h3>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Budget */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Budget</label>
                <span className="text-sm font-bold text-[var(--text-primary)]">${budget.toLocaleString()}</span>
              </div>
              <Slider
                min={1000}
                max={50000}
                step={1000}
                value={[budget]}
                onValueChange={([v]) => {
                  setBudget(v);
                  recalculate(v, duration, campaignType);
                }}
              />
              <div className="flex justify-between text-[10px] font-medium text-[var(--text-muted)]">
                <span>$1K</span>
                <span>$50K</span>
              </div>
            </div>

            {/* Duration */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Duration</label>
                <span className="text-sm font-bold text-[var(--text-primary)]">{duration} days</span>
              </div>
              <Slider
                min={7}
                max={90}
                step={1}
                value={[duration]}
                onValueChange={([v]) => {
                  setDuration(v);
                  recalculate(budget, v, campaignType);
                }}
              />
              <div className="flex justify-between text-[10px] font-medium text-[var(--text-muted)]">
                <span>7 days</span>
                <span>90 days</span>
              </div>
            </div>

            {/* Campaign Type */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Campaign Type</label>
              <Select
                value={campaignType}
                onValueChange={(v) => {
                  const t = v as CampaignType;
                  setCampaignType(t);
                  recalculate(budget, duration, t);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Awareness">Awareness</SelectItem>
                  <SelectItem value="Conversion">Conversion</SelectItem>
                  <SelectItem value="Product Launch">Product Launch</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-[var(--text-muted)]">
                {campaignType === "Awareness" && "Maximize brand visibility and reach"}
                {campaignType === "Conversion" && "Drive measurable purchase actions"}
                {campaignType === "Product Launch" && "Build hype and initial adoption"}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Historical campaigns table */}
      <motion.div variants={cardVariants}>
        <Card variant="default" className="overflow-hidden p-0">
          <div className="px-6 py-4 border-b border-[var(--border-subtle)]">
            <h3 className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">Historical Campaign Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]">
                  {["Campaign", "Brand", "Reach", "Engagement", "ROI", "Type", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {historicalCampaigns.map((c, i) => {
                  const { variant, label } = statusConfig[c.status];
                  return (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--highlight)] transition-colors duration-100"
                    >
                      <td className="px-5 py-3.5 font-semibold text-[var(--text-primary)]">{c.name}</td>
                      <td className="px-5 py-3.5 text-[var(--text-secondary)]">{c.brand}</td>
                      <td className="px-5 py-3.5 text-[var(--text-secondary)] font-medium">{formatNumber(c.reach)}</td>
                      <td className="px-5 py-3.5 text-[var(--text-secondary)] font-medium">{formatNumber(c.engagement)}</td>
                      <td className="px-5 py-3.5 text-[var(--success)] font-bold">{c.roi}x</td>
                      <td className="px-5 py-3.5 text-[var(--text-muted)]">{c.type}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={variant}>{label}</Badge>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
