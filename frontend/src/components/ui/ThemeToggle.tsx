"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-[10px] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]" />;
  }

  const isDark = theme === "dark";

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="relative flex items-center justify-center w-8 h-8 rounded-[10px] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:bg-[var(--bg-overlay)] hover:border-[var(--border-default)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] outline-none cursor-pointer overflow-hidden"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute"
            >
              {isDark ? (
                <Sun className="w-4.5 h-4.5 text-[var(--accent-light)]" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-[var(--accent)]" />
              )}
            </motion.div>
          </AnimatePresence>
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {isDark ? "Switch to light mode" : "Switch to dark mode"}
      </TooltipContent>
    </Tooltip>
  );
}
