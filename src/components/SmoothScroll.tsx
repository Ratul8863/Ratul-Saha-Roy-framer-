"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LenisContext, type SmoothScroller } from "@/lib/lenis";

type SmoothScrollOpts = {
  lerp?: number;
  duration?: number;
  immediate?: boolean;
  offset?: number;
};

/**
 * Butter-smooth wheel scrolling without third-party packages
 * (avoids Next.js webpack chunk bugs with Lenis).
 * Touch / keyboard / scrollbar stay native.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [scroller, setScroller] = useState<SmoothScroller | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    let current = window.scrollY;
    let target = window.scrollY;
    let raf = 0;
    let running = true;
    let stopped = false;
    let animatingProgrammatic = false;
    /** Creamier = lower (0.04–0.06). */
    const ease = 0.048;

    const maxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const setTarget = (y: number) => {
      target = Math.max(0, Math.min(maxScroll(), y));
    };

    const tick = () => {
      if (!running) return;
      const prev = current;
      current += (target - current) * ease;
      if (Math.abs(target - current) < 0.12) current = target;
      if (current !== prev) {
        window.scrollTo(0, current);
      }
      raf = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      if (stopped || e.ctrlKey) return;
      const el = e.target as HTMLElement | null;
      if (el?.closest?.("[data-scroll-lock], [data-lenis-prevent]")) return;

      let node: HTMLElement | null = el;
      while (node && node !== document.body) {
        const style = window.getComputedStyle(node);
        const oy = style.overflowY;
        if (
          (oy === "auto" || oy === "scroll") &&
          node.scrollHeight > node.clientHeight + 1
        ) {
          return;
        }
        node = node.parentElement;
      }

      e.preventDefault();
      animatingProgrammatic = false;
      const delta =
        e.deltaMode === 1
          ? e.deltaY * 16
          : e.deltaMode === 2
            ? e.deltaY * window.innerHeight
            : e.deltaY;
      setTarget(target + delta * 0.92);
    };

    const onScroll = () => {
      if (stopped || animatingProgrammatic) return;
      if (Math.abs(window.scrollY - current) > 2) {
        current = window.scrollY;
        target = window.scrollY;
      }
    };

    const scrollTo = (
      to: number | string | HTMLElement,
      options: SmoothScrollOpts = {},
    ) => {
      let y = 0;
      if (typeof to === "number") {
        y = to;
      } else if (typeof to === "string") {
        const el = document.querySelector(to);
        if (!el) return;
        y =
          el.getBoundingClientRect().top +
          window.scrollY +
          (options.offset ?? 0);
      } else {
        y =
          to.getBoundingClientRect().top +
          window.scrollY +
          (options.offset ?? 0);
      }

      if (options.immediate) {
        current = y;
        target = y;
        window.scrollTo(0, y);
        return;
      }

      animatingProgrammatic = true;
      setTarget(y);
      const check = () => {
        if (Math.abs(target - current) < 0.5) {
          animatingProgrammatic = false;
          return;
        }
        requestAnimationFrame(check);
      };
      requestAnimationFrame(check);
    };

    const api: SmoothScroller = {
      scrollTo: (t, o) => scrollTo(t, o as SmoothScrollOpts),
      start: () => {
        stopped = false;
        // Don't clobber an in-flight nav scroll (e.g. menu close → Home)
        if (!animatingProgrammatic) {
          current = window.scrollY;
          target = window.scrollY;
        }
      },
      stop: () => {
        stopped = true;
        target = current;
      },
      on: () => {},
      off: () => {},
      destroy: () => {
        running = false;
        cancelAnimationFrame(raf);
      },
    };

    setScroller(api);
    document.documentElement.classList.add("lenis", "lenis-smooth");
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.(
        "a[href^='#']",
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      // Sticky hero: #home must scroll to page top, not the stuck element's rect
      if (id === "#home") {
        e.preventDefault();
        scrollTo(0);
        history.pushState(null, "", id);
        return;
      }
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      scrollTo(el as HTMLElement, { offset: 0 });
      history.pushState(null, "", id);
    };
    document.addEventListener("click", onClick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      setScroller(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={scroller}>{children}</LenisContext.Provider>
  );
}
