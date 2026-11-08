"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
let scrollLockCount = 0;

/** Shared Lenis instance for scroll restore / programmatic scroll. */
export function getLenis() {
  return lenisInstance;
}

function applyScrollLock() {
  const lenis = lenisInstance;
  const pending = document.documentElement.classList.contains("intro-pending");
  if (scrollLockCount > 0 || pending) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = scrollLockCount > 0 ? "hidden" : "";
  document.body.style.overflow = scrollLockCount > 0 ? "hidden" : "";
  document.documentElement.style.touchAction = scrollLockCount > 0 ? "none" : "";
}

/** Hard-stop page scroll (mobile hero tap-to-lock). Nested / ref-counted. */
export function lockPageScroll() {
  scrollLockCount += 1;
  applyScrollLock();
}

export function unlockPageScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  applyScrollLock();
}

export function scrollToY(
  y: number,
  options?: { immediate?: boolean; force?: boolean },
) {
  const lenis = lenisInstance;
  if (lenis) {
    lenis.scrollTo(y, {
      immediate: options?.immediate ?? false,
      force: options?.force ?? false,
    });
    return;
  }
  window.scrollTo({
    top: y,
    left: 0,
    behavior: options?.immediate ? "auto" : "smooth",
  });
}

export function scrollToElement(
  target: string | Element,
  options?: { immediate?: boolean; offset?: number },
) {
  const lenis = lenisInstance;
  if (lenis) {
    lenis.scrollTo(target, {
      immediate: options?.immediate ?? false,
      offset: options?.offset ?? 0,
    });
    return;
  }
  if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView({
      behavior: options?.immediate ? "auto" : "smooth",
      block: "start",
    });
    return;
  }
  target.scrollIntoView({
    behavior: options?.immediate ? "auto" : "smooth",
    block: "start",
  });
}

/**
 * Site-wide Lenis smooth scroll, driven by the GSAP ticker so
 * ScrollTrigger (projects pin/scrub) stays in sync.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Keep Lenis light: no allowNestedScroll DOM walks; mark heavy/nested
    // regions with data-lenis-prevent instead.
    const lenis = new Lenis({
      autoRaf: false,
      /* Honors CSS scroll-margin on targets (mobile sticky header clearance). */
      anchors: true,
      allowNestedScroll: false,
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
      lerp: 0.1,
      wheelMultiplier: 0.85,
      touchMultiplier: 1,
      prevent: (node) => {
        if (!(node instanceof HTMLElement)) return false;
        return Boolean(
          node.closest("[data-lenis-prevent], .intro-preloader"),
        );
      },
    });

    lenisInstance = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const syncIntroGate = () => {
      applyScrollLock();
    };
    syncIntroGate();

    const observer = new MutationObserver(syncIntroGate);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      observer.disconnect();
      gsap.ticker.remove(onTick);
      lenis.destroy();
      if (lenisInstance === lenis) lenisInstance = null;
    };
  }, []);

  return children;
}
