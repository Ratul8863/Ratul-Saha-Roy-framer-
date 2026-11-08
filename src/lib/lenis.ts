"use client";

import { createContext, useContext } from "react";

/** Minimal Lenis-like surface used across the app. */
export type SmoothScroller = {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: Record<string, unknown>,
  ) => void;
  start: () => void;
  stop: () => void;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  off: (event: string, callback: (...args: unknown[]) => void) => void;
  destroy: () => void;
};

export const LenisContext = createContext<SmoothScroller | null>(null);

/** Access the site-wide smooth scroller (null until mounted / if reduced motion). */
export function useLenis() {
  return useContext(LenisContext);
}
