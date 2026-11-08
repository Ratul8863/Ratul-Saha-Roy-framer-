"use client";

import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        isDark ? "bg-accent" : "bg-ink/20"
      } ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full shadow-sm transition-transform duration-200 ${
          isDark
            ? "translate-x-[22px] bg-on-accent"
            : "translate-x-0.5 bg-surface"
        }`}
        aria-hidden
      />
    </button>
  );
}
