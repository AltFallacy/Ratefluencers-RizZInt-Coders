"use client";

import { useState, useEffect } from "react";
import { Key } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApiSettingsStore } from "@/store";

export function SettingsDialog() {
  const { openRouterKey, setOpenRouterKey } = useApiSettingsStore();
  const [localKey, setLocalKey] = useState(openRouterKey);
  const [isOpen, setIsOpen] = useState(false);

  // Sync state when opened
  useEffect(() => {
    if (isOpen) {
      setLocalKey(openRouterKey);
    }
  }, [isOpen, openRouterKey]);

  const handleSave = () => {
    setOpenRouterKey(localKey);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="relative rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors focus:outline-none cursor-pointer"
          aria-label="API Settings"
        >
          <Key className="w-5 h-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-primary)]">
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
          <DialogDescription className="text-[var(--text-secondary)]">
            Bring your own API key to power AI-generated explanations and campaign recommendations.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="openrouter" className="text-sm font-medium">
              OpenRouter API Key
            </label>
            <Input
              id="openrouter"
              type="password"
              placeholder="sk-or-v1-..."
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              className="bg-[var(--bg-elevated)] border-[var(--border-subtle)] focus-visible:ring-[var(--accent)]"
            />
            <p className="text-xs text-[var(--text-muted)]">
              Your key is stored locally in your browser and sent securely to the backend for inference.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[var(--accent)] text-white hover:bg-[var(--accent-light)]"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
