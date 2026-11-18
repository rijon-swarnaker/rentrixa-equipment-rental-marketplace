"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        "relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center justify-between rounded-full bg-accent px-1.5 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      {/* Sliding knob — CSS driven off the .dark class, so there is no hydration flash */}
      <span
        aria-hidden="true"
        className="absolute top-1 left-0.5 size-6 rounded-full bg-background shadow-sm ring-1 ring-border transition-transform dark:translate-x-7"
      />
      <Sun className="relative z-10 size-4 text-foreground/70 dark:text-muted-foreground" />
      <Moon className="relative z-10 size-4 text-muted-foreground dark:text-foreground/70" />
    </button>
  );
}
