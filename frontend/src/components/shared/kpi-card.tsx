"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, ShieldCheck, Target, Star, LucideIcon } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import type { KpiCardData } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface KpiCardProps {
  data: KpiCardData;
  index?: number;
}

const iconMap: Record<string, LucideIcon> = {
  "kpi-authenticity": ShieldCheck,
  "kpi-growth": TrendingUp,
  "kpi-campaign": Target,
  "kpi-composite": Star,
};

const sparklineDataMap: Record<string, { value: number }[]> = {
  "kpi-authenticity": [{ value: 80 }, { value: 82 }, { value: 81 }, { value: 85 }, { value: 84 }, { value: 86 }, { value: 87 }],
  "kpi-growth": [{ value: 70 }, { value: 71 }, { value: 73 }, { value: 72 }, { value: 75 }, { value: 73 }, { value: 74 }],
  "kpi-campaign": [{ value: 85 }, { value: 86 }, { value: 88 }, { value: 89 }, { value: 87 }, { value: 90 }, { value: 91 }],
  "kpi-composite": [{ value: 80 }, { value: 81 }, { value: 83 }, { value: 82 }, { value: 84 }, { value: 83 }, { value: 84 }],
};

export function KpiCard({ data, index = 0 }: KpiCardProps) {
  const isPositive = data.trend >= 0;
  const Icon = iconMap[data.id] || Star;
  
  const [mounted, setMounted] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setMounted(true);
    const controls = animate(count, Number(data.value), {
      duration: 1.0,
      ease: [0.0, 0.0, 0.2, 1.0], // ease.out
    });

    return rounded.on("change", (latest) => {
      if (spanRef.current) {
        spanRef.current.textContent = latest.toLocaleString();
      }
    });
  }, [data.value]);

  return (
    <Card variant="elevated" className="relative p-6">
      {/* Top Row: Label & Icon */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          {data.label}
        </span>
        <Icon className="w-4 h-4 text-[var(--text-muted)]" />
      </div>

      {/* Middle Row: Metric & Trend Chip */}
      <div className="mt-3 flex items-baseline justify-between">
        <div className="flex items-baseline gap-0.5">
          {data.prefix && (
            <span className="text-sm font-semibold text-[var(--text-secondary)] mr-0.5">{data.prefix}</span>
          )}
          <span
            ref={spanRef}
            className="text-3xl font-bold tracking-tight text-[var(--text-primary)]"
          >
            0
          </span>
          {data.suffix && (
            <span className="text-xs font-semibold text-[var(--text-muted)] ml-0.5">{data.suffix}</span>
          )}
        </div>

        {/* Trend Chip */}
        <span
          className={cn(
            "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold",
            isPositive
              ? "bg-[var(--success-subtle)] text-[var(--success)]"
              : "bg-[var(--danger-subtle)] text-[var(--danger)]"
          )}
        >
          {isPositive ? (
            <ArrowUp className="w-3 h-3 text-[var(--success)]" />
          ) : (
            <ArrowDown className="w-3 h-3 text-[var(--danger)]" />
          )}
          {isPositive ? "+" : ""}
          {data.trend.toFixed(1)}%
        </span>
      </div>

      {/* Bottom Row: Sparkline */}
      <div className="mt-4 h-14 w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineDataMap[data.id] || []} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
              <defs>
                <linearGradient id={`gradient-${data.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--accent-light)"
                strokeWidth={2}
                fill={`url(#gradient-${data.id})`}
                dot={false}
                activeDot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <Skeleton className="h-full w-full rounded-[10px]" />
        )}
      </div>
    </Card>
  );
}
