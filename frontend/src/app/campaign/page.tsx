"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Target, DollarSign, Users, TrendingUp, Activity } from "lucide-react";
import { ScoreRing } from "@/components/shared/score-ring";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ApiErrorBanner, LiveBadge } from "@/components/shared/api-error";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { historicalCampaigns, calculateCampaignMetrics } from "@/data/campaigns";
import { useCampaignMetrics } from "@/hooks/use-api";
import type { CampaignMetrics, CampaignStatus, CampaignType } from "@/types";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

const statusConfig: Record<CampaignStatus, { variant: "success" | "sky" | "violet"; label: string }> = {
  Completed: { variant: "success", label: "Completed" },
  Active:    { variant: "sky",     label: "Active"    },
  Planned:   { variant: "violet",  label: "Planned"   },
};

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  index: number;
}

function MetricCard({ icon: Icon, label, value, index }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.12 + index * 0.06 }}
      className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="flex size-7 items-center justify-center rounded-lg bg-violet-500/10">
          <Icon className="size-3.5 text-violet-400" />
        </div>
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</span>
      </div>
      <motion.p
        key={value}
        initial={{ opacity: 0.4, y: 4 }} animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold tracking-tight text-zinc-100"
      >
        {value}
      </motion.p>
    </motion.div>
  );
}

export default function CampaignPage() {
  const { data: apiMetrics, isError, isFetching } = useCampaignMetrics();
  const isBackendOffline = isError;

  const [budget, setBudget]           = useState(10000);
  const [duration, setDuration]       = useState(30);
  const [campaignType, setCampaignType] = useState<CampaignType>("Awareness");

  // Simulator: always use local formula (instant feedback)
  const [simMetrics, setSimMetrics]   = useState<CampaignMetrics | null>(null);

  const recalculate = useCallback(
    (b: number, d: number, t: CampaignType) => {
      setSimMetrics(calculateCampaignMetrics(b, d, t));
    },
    []
  );

  // Display simulated metrics if user adjusted sliders, otherwise use API/mock
  const metrics = simMetrics ?? apiMetrics;

  return (
    <div>
      <ApiErrorBanner show={isBackendOffline} />

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between">
          <PageHeader title="Campaign Success" description="Predict campaign performance and simulate different budget scenarios" />
          <LiveBadge isLive={!isBackendOffline} />
        </div>
      </motion.div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }}
        className="mb-6 flex flex-col items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 py-10"
      >
        <ScoreRing score={metrics?.successProbability ?? 0} size={160} strokeWidth={12} labelSuffix="%" />
        <p className="text-sm text-zinc-400 font-medium">Campaign Success Probability</p>
        <Badge variant="success" className="text-xs">High Confidence Prediction</Badge>
      </motion.div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MetricCard icon={Users}      label="Est. Reach"            value={formatNumber(metrics?.estimatedReach ?? 0)} index={0} />
        <MetricCard icon={Activity}   label="Est. Engagement"       value={formatNumber(metrics?.estimatedEngagement ?? 0)} index={1} />
        <MetricCard icon={TrendingUp} label="Predicted ROI"         value={`${metrics?.predictedROI ?? 0}x`} index={2} />
        <MetricCard icon={DollarSign} label="Avg Cost / Engagement" value={`$${(metrics?.avgCostPerEngagement ?? 0).toFixed(2)}`} index={3} />
      </div>

      {/* Simulator */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.3 }}
        className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900 p-5"
      >
        <h3 className="mb-5 text-sm font-medium text-zinc-100">Campaign Simulator</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Budget */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-zinc-400">Budget</label>
              <span className="text-sm font-semibold text-zinc-100">${budget.toLocaleString()}</span>
            </div>
            <Slider
              min={1000} max={50000} step={1000} value={[budget]}
              onValueChange={([v]) => { setBudget(v); recalculate(v, duration, campaignType); }}
            />
            <div className="flex justify-between text-xs text-zinc-600">
              <span>$1K</span><span>$50K</span>
            </div>
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-zinc-400">Duration</label>
              <span className="text-sm font-semibold text-zinc-100">{duration} days</span>
            </div>
            <Slider
              min={7} max={90} step={1} value={[duration]}
              onValueChange={([v]) => { setDuration(v); recalculate(budget, v, campaignType); }}
            />
            <div className="flex justify-between text-xs text-zinc-600">
              <span>7 days</span><span>90 days</span>
            </div>
          </div>

          {/* Campaign Type */}
          <div className="flex flex-col gap-3">
            <label className="text-sm text-zinc-400">Campaign Type</label>
            <Select
              value={campaignType}
              onValueChange={(v) => {
                const t = v as CampaignType;
                setCampaignType(t);
                recalculate(budget, duration, t);
              }}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Awareness">Awareness</SelectItem>
                <SelectItem value="Conversion">Conversion</SelectItem>
                <SelectItem value="Product Launch">Product Launch</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-zinc-600">
              {campaignType === "Awareness"      && "Maximize brand visibility and reach"}
              {campaignType === "Conversion"     && "Drive measurable purchase actions"}
              {campaignType === "Product Launch" && "Build hype and initial adoption"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Historical campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.38 }}
        className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-100">Historical Campaign Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                {["Campaign", "Brand", "Reach", "Engagement", "ROI", "Type", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {historicalCampaigns.map((c, i) => {
                const { variant, label } = statusConfig[c.status];
                return (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 + i * 0.05 }}
                    className="hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-medium text-zinc-200">{c.name}</td>
                    <td className="px-5 py-3.5 text-zinc-400">{c.brand}</td>
                    <td className="px-5 py-3.5 text-zinc-300">{formatNumber(c.reach)}</td>
                    <td className="px-5 py-3.5 text-zinc-300">{formatNumber(c.engagement)}</td>
                    <td className="px-5 py-3.5 text-emerald-400 font-semibold">{c.roi}x</td>
                    <td className="px-5 py-3.5 text-zinc-400">{c.type}</td>
                    <td className="px-5 py-3.5"><Badge variant={variant}>{label}</Badge></td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
