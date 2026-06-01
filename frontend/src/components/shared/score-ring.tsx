"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  labelSuffix?: string;
}

function getScoreColor(score: number): { ring: string; text: string } {
  if (score >= 80) return { ring: "#10b981", text: "text-emerald-400" }; // emerald
  if (score >= 60) return { ring: "#f59e0b", text: "text-amber-400" };   // amber
  return { ring: "#f43f5e", text: "text-rose-400" };                     // rose
}

export function ScoreRing({
  score,
  maxScore = 100,
  size = 160,
  strokeWidth = 10,
  className,
  showLabel = true,
  labelSuffix,
}: ScoreRingProps) {
  const { ring: ringColor, text: textColor } = getScoreColor(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const motionProgress = useMotionValue(0);
  const dashOffset = useTransform(
    motionProgress,
    [0, score],
    [circumference, circumference - (score / maxScore) * circumference]
  );
  const displayScore = useMotionValue(0);
  const rounded = useTransform(displayScore, (v) => Math.round(v));

  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    animate(motionProgress, score, { duration: 1.2, ease: "easeOut" });
    animate(displayScore, score, { duration: 1.2, ease: "easeOut" });
  }, [score, motionProgress, displayScore]);

  const cx = size / 2;
  const cy = size / 2;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        aria-hidden="true"
      >
        {/* Background ring */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-zinc-800"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
        />
      </svg>

      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn("text-3xl font-bold tabular-nums leading-none", textColor)}
          >
            {rounded}
          </motion.span>
          {labelSuffix && (
            <span className="mt-0.5 text-xs text-zinc-500 font-medium">
              {labelSuffix}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
