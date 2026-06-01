"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KpiCardData } from "@/types";

interface KpiCardProps {
  data: KpiCardData;
  index?: number;
}

export function KpiCard({ data, index = 0 }: KpiCardProps) {
  const isPositive = data.trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl border border-zinc-800",
        "bg-zinc-900 px-5 py-4 cursor-default",
        "hover:border-zinc-700 transition-colors duration-200"
      )}
    >
      {/* Label */}
      <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        {data.label}
      </span>

      {/* Value */}
      <div className="flex items-baseline gap-0.5">
        {data.prefix && (
          <span className="text-lg font-semibold text-zinc-300">{data.prefix}</span>
        )}
        <span className="text-3xl font-bold tracking-tight text-zinc-100">
          {typeof data.value === "number" ? data.value.toLocaleString() : data.value}
        </span>
        {data.suffix && (
          <span className="text-base font-medium text-zinc-500">{data.suffix}</span>
        )}
      </div>

      {/* Trend */}
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
            isPositive
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-rose-500/10 text-rose-400"
          )}
        >
          {isPositive ? (
            <TrendingUp className="size-3" />
          ) : (
            <TrendingDown className="size-3" />
          )}
          {isPositive ? "+" : ""}
          {data.trend.toFixed(1)}%
        </span>
        <span className="text-xs text-zinc-500">{data.trendLabel}</span>
      </div>
    </motion.div>
  );
}
