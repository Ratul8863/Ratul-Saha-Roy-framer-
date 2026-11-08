"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  DEFAULT_FULL_MOTION,
  MOTION_MODE_EVENT,
  readFullMotion,
  writeFullMotion,
} from "@/lib/motion-mode";
import { cn } from "@/lib/utils";

const subscribeNoop = () => () => {};
const getClientTrue = () => true;
const getServerFalse = () => false;

function subscribeMotionMode(onStoreChange: () => void) {
  window.addEventListener(MOTION_MODE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(MOTION_MODE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

/**
 * Site-wide FX toggle — sharp square tile.
 * Desktop-only; position tracks home chrome padding so it stays inside
 * the content panel from lg (1024) through xl (1440+).
 */
export function MotionModeToggle() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const ready = useSyncExternalStore(
    subscribeNoop,
    getClientTrue,
    getServerFalse,
  );
  const enabled = useSyncExternalStore(
    subscribeMotionMode,
    readFullMotion,
    () => DEFAULT_FULL_MOTION,
  );

  if (!ready) return null;

  return (
    <button
      type="button"
      onClick={() => {
        writeFullMotion(!enabled);
      }}
      data-liquid-cursor-hide
      className={cn(
        "group fixed z-[80] hidden items-center border font-ui font-semibold uppercase lg:inline-flex",
        "transition-[background-color,border-color,color,transform] duration-300",
        "hover:-translate-y-px active:translate-y-0 active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        // Compact at lg (1024–1279), roomier from xl — avoids edge collision.
        "h-9 gap-2 px-2.5 text-[10px] tracking-[0.14em]",
        "xl:h-10 xl:gap-2.5 xl:px-3.5 xl:text-[11px] xl:tracking-[0.16em]",
        // Home chrome is lg:pt-5 lg:px-5 — nest inside that panel, not on its rim.
        isHome
          ? "top-10 right-10 xl:top-11 xl:right-11"
          : "top-5 right-5 xl:top-6 xl:right-6",
        isHome
          ? enabled
            ? "border-cream bg-cream text-ink focus-visible:ring-cream focus-visible:ring-offset-black"
            : "border-cream/40 bg-black text-cream/75 hover:border-cream/70 hover:text-cream focus-visible:ring-cream focus-visible:ring-offset-black"
          : enabled
            ? "border-ink bg-ink text-cream focus-visible:ring-ink focus-visible:ring-offset-white"
            : "border-ink/25 bg-white text-ink/55 hover:border-ink/50 hover:text-ink focus-visible:ring-ink focus-visible:ring-offset-white",
      )}
      aria-pressed={enabled}
      title={
        enabled
          ? "Full motion on — click for lighter mode"
          : "Lighter mode — click for full motion FX"
      }
    >
      <span
        className={cn(
          "size-1.5 shrink-0 transition-colors duration-300",
          enabled
            ? isHome
              ? "bg-ink"
              : "bg-cream"
            : "bg-current opacity-50",
        )}
        aria-hidden
      />
      <span>{enabled ? "FX On" : "FX Off"}</span>
    </button>
  );
}
