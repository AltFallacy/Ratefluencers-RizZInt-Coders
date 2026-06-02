import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types";

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

const config: Record<RiskLevel, { dot: string; chip: string; label: string }> = {
  Low: {
    dot: "bg-emerald-400",
    chip: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    label: "Low",
  },
  Medium: {
    dot: "bg-amber-400",
    chip: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    label: "Medium",
  },
  High: {
    dot: "bg-rose-400",
    chip: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    label: "High",
  },
};

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const { dot, chip, label } = config[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        chip,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}
