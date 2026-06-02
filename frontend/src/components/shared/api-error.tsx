"use client";

import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface ApiErrorBannerProps {
  /** Show the banner only when the backend is unreachable */
  show?: boolean;
  className?: string;
}

/**
 * Shown at the top of a page when the backend is offline.
 * Displays a "Demo Data" notice and a refresh button.
 */
export function ApiErrorBanner({ show = true, className = "" }: ApiErrorBannerProps) {
  const qc = useQueryClient();

  const handleRefresh = () => {
    qc.invalidateQueries();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="api-error-banner"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className={`mb-4 flex items-center justify-between gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 ${className}`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
              <WifiOff className="size-3.5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-amber-300">Backend Offline — Demo Data</p>
              <p className="text-[11px] text-amber-400/70 leading-snug">
                The AI engine is not running. Showing sample data.
                Start FastAPI to see live predictions.
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            title="Retry connection"
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-500/20"
          >
            <RefreshCw className="size-3" />
            Retry
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Tiny inline badge used within cards to indicate live vs demo data. */
export function LiveBadge({ isLive }: { isLive: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
        isLive
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          : "bg-zinc-700/40 text-zinc-500 border border-zinc-700/40"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${isLive ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`}
      />
      {isLive ? "Live" : "Demo"}
    </span>
  );
}
