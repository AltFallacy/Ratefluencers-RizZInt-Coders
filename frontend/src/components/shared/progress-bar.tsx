"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedProgressBarProps {
  label?: string;
  value: number;
  max?: number;
  delay?: number;
  colorClass?: string;
  showPercent?: boolean;
  rightLabel?: string;
  className?: string;
}

function getColorFromValue(value: number): string {
  if (value >= 75) return "bg-emerald-500";
  if (value >= 50) return "bg-violet-500";
  if (value >= 30) return "bg-amber-500";
  return "bg-rose-500";
}

export function AnimatedProgressBar({
  label,
  value,
  max = 100,
  delay = 0,
  colorClass,
  showPercent = true,
  rightLabel,
  className,
}: AnimatedProgressBarProps) {
  const width = useMotionValue(0);
  const hasAnimated = useRef(false);
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  const barColor = colorClass ?? getColorFromValue(value);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    animate(width, pct, {
      duration: 0.8,
      delay,
      ease: "easeOut",
    });
  }, [pct, delay, width]);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {(label || showPercent || rightLabel !== undefined) && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-300">{label}</span>
          <span className="text-sm font-semibold text-zinc-200">
            {rightLabel ?? (showPercent ? `${value}%` : value)}
          </span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          className={cn("h-full rounded-full", barColor)}
          style={{ width: width.get() === 0 ? "0%" : undefined }}
          animate={{ width: `${pct}%` }}
          initial={{ width: 0 }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
