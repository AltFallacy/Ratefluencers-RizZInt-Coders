"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

/** A single pulsing skeleton block. */
export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-zinc-800/60",
        className
      )}
      style={style}
    />
  );
}

/** 4-column KPI card skeleton row. */
export function KpiSkeletonRow() {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 mb-6">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
          <Skeleton className="h-3 w-24 mb-3" />
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-2 w-32" />
        </div>
      ))}
    </div>
  );
}

/** Chart card skeleton. */
export function ChartSkeleton({ height = 220 }: { height?: number }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <Skeleton className="h-4 w-40 mb-1" />
      <Skeleton className="h-3 w-56 mb-4" />
      <Skeleton style={{ height }} className="w-full" />
    </div>
  );
}

/** Score ring skeleton. */
export function ScoreRingSkeleton({ size = 160 }: { size?: number }) {
  return (
    <div
      className="rounded-full border-8 border-zinc-800 animate-pulse bg-zinc-900"
      style={{ width: size, height: size }}
    />
  );
}

/** Generic hero card skeleton. */
export function HeroSkeleton() {
  return (
    <div className="mb-6 flex flex-col items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 py-10">
      <ScoreRingSkeleton size={160} />
      <Skeleton className="h-4 w-32 mt-2" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

/** Influencer identity card skeleton. */
export function IdentityCardSkeleton() {
  return (
    <div className="mb-6 flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
      <Skeleton className="size-12 rounded-full shrink-0" />
      <div className="flex-1 min-w-0">
        <Skeleton className="h-4 w-40 mb-2" />
        <Skeleton className="h-3 w-64" />
      </div>
    </div>
  );
}

/** List skeleton (for brand cards, activity feed rows, etc.). */
export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
          <Skeleton className="size-8 shrink-0 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-3 w-32 mb-2" />
            <Skeleton className="h-2 w-48" />
          </div>
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      ))}
    </div>
  );
}
