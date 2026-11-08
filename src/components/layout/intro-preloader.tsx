"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CurvedCurtainTransition } from "@/components/layout/curved-curtain-transition";
import {
  getLenis,
  scrollToElement,
  scrollToY,
} from "@/providers/smooth-scroll-provider";

const GREETINGS = [
  "Hello",
  "Bonjour",
  "स्वागत है",
  "Ciao",
  "Olá",
  "おい",
  "Hallå",
  "Guten Tag",
  "Hallo",
] as const;

/** Hold Hello, then swap remaining greetings. Curtain starts as Hallo lands. */
const SWAP_AT_MS = [550, 705, 860, 1015, 1170, 1325, 1480, 1635] as const;
const EXIT_AT_MS = SWAP_AT_MS[SWAP_AT_MS.length - 1];
const WORDS_EXIT_MS = 400;
const REVEAL_LEAD_MS = 40;
const REVEAL_FAILSAFE_MS = 2800;

const SCROLL_STORAGE_KEY = "rsr-intro-scroll";

let introHasPlayed = false;

type SavedScroll = {
  path: string;
  x: number;
  y: number;
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function shouldForceReplay() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("intro") === "1";
}

function navigationType() {
  const entry = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  return entry?.type ?? "navigate";
}

function saveScrollPosition() {
  try {
    const payload: SavedScroll = {
      path: window.location.pathname,
      x: window.scrollX,
      y: window.scrollY,
    };
    sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* private mode */
  }
}

function honorHashIfNeeded() {
  const type = navigationType();
  if (type === "reload" || type === "back_forward" || shouldForceReplay()) {
    return;
  }
  const hash = window.location.hash;
  if (!hash || hash === "#" || hash === "#hero") return;
  const target = document.querySelector(hash);
  if (target instanceof HTMLElement) {
    scrollToElement(target, { immediate: true });
  }
}

function restoreScrollPosition() {
  const html = document.documentElement;
  const previous = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";

  const type = navigationType();
  if (type === "reload" || type === "back_forward" || shouldForceReplay()) {
    try {
      const raw = sessionStorage.getItem(SCROLL_STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as SavedScroll;
        if (saved.path === window.location.pathname) {
          // force: allow restore while Lenis is stopped during intro
          scrollToY(saved.y, { immediate: true, force: true });
          getLenis()?.resize();
          html.style.scrollBehavior = previous;
          return;
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
  }

  honorHashIfNeeded();
  html.style.scrollBehavior = previous;
}

function clearHeroEntrance() {
  document.documentElement.classList.remove("intro-prepare-hero");
  document.documentElement.style.removeProperty("--intro-pull");
}

function shouldPlayHeroEntrance() {
  const hash = window.location.hash;
  if (hash && hash !== "#" && hash !== "#hero") return false;
  return window.scrollY < 32;
}

function waitForPortrait(timeoutMs: number) {
  const img = document.querySelector<HTMLImageElement>('img[alt*="Portrait"]');
  if (!img || img.complete) return Promise.resolve();

  return Promise.race([
    new Promise<void>((resolve) => {
      img.addEventListener("load", () => resolve(), { once: true });
      img.addEventListener("error", () => resolve(), { once: true });
    }),
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, timeoutMs);
    }),
  ]);
}

export function IntroPreloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState<"enter" | "hold" | "exit" | "reveal" | "done">(
    "enter",
  );

  const finishIntro = useCallback(() => {
    introHasPlayed = true;
    clearHeroEntrance();
    setPhase("done");
    setActive(false);
    document.documentElement.classList.remove("intro-pending");
  }, []);

  useEffect(() => {
    window.replayIntro = () => {
      saveScrollPosition();
      const url = new URL(window.location.href);
      url.searchParams.set("intro", "1");
      window.location.replace(url);
    };
  }, []);

  useEffect(() => {
    const persist = () => saveScrollPosition();
    window.addEventListener("pagehide", persist);
    window.addEventListener("beforeunload", persist);
    return () => {
      window.removeEventListener("pagehide", persist);
      window.removeEventListener("beforeunload", persist);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let finished = false;
    const timers: number[] = [];
    let enterFrame = 0;

    const later = (fn: () => void, ms: number) => {
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) fn();
        }, ms),
      );
    };

    const boot = window.setTimeout(() => {
      if (cancelled) return;

      if (prefersReducedMotion()) {
        introHasPlayed = true;
        restoreScrollPosition();
        clearHeroEntrance();
        setActive(false);
        setPhase("done");
        return;
      }

      if (introHasPlayed && !shouldForceReplay()) {
        setActive(false);
        setPhase("done");
        return;
      }

      document.documentElement.classList.add("intro-pending");

      enterFrame = window.requestAnimationFrame(() => {
        if (!cancelled) setPhase("hold");
      });

      void waitForPortrait(EXIT_AT_MS);

      SWAP_AT_MS.forEach((ms, offset) => {
        later(() => setWordIndex(offset + 1), ms);
      });

      later(() => {
        if (cancelled) return;
        restoreScrollPosition();
        requestAnimationFrame(() => {
          restoreScrollPosition();
          if (cancelled) return;
          setPhase("exit");
          later(() => {
            if (cancelled) return;
            restoreScrollPosition();
            if (shouldPlayHeroEntrance()) {
              document.documentElement.classList.add("intro-prepare-hero");
              document.documentElement.style.setProperty(
                "--intro-pull",
                `${Math.round(window.innerHeight * 0.18)}px`,
              );
            }
            setPhase("reveal");
          }, REVEAL_LEAD_MS);
          later(() => {
            if (cancelled || finished) return;
            finished = true;
            finishIntro();
          }, REVEAL_LEAD_MS + REVEAL_FAILSAFE_MS);
        });
      }, EXIT_AT_MS);
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(boot);
      window.cancelAnimationFrame(enterFrame);
      timers.forEach((id) => window.clearTimeout(id));
      if (!finished) {
        document.documentElement.classList.remove("intro-pending");
      }
    };
  }, [finishIntro]);

  useEffect(() => {
    const node = overlayRef.current;
    if (!node || !active) return;

    const blockScroll = (event: Event) => {
      event.preventDefault();
    };
    const blockKeys = (event: KeyboardEvent) => {
      if (
        event.key === " " ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "PageUp" ||
        event.key === "PageDown" ||
        event.key === "Home" ||
        event.key === "End"
      ) {
        event.preventDefault();
      }
    };

    node.addEventListener("wheel", blockScroll, { passive: false });
    node.addEventListener("touchmove", blockScroll, { passive: false });
    window.addEventListener("keydown", blockKeys);

    return () => {
      node.removeEventListener("wheel", blockScroll);
      node.removeEventListener("touchmove", blockScroll);
      window.removeEventListener("keydown", blockKeys);
    };
  }, [active]);

  if (!active || phase === "done") return null;

  const greeting = GREETINGS[wordIndex] ?? GREETINGS[0];
  const revealing = phase === "reveal";
  const shown = phase === "hold" || phase === "exit" || revealing;
  const exiting = phase === "exit" || revealing;

  return (
    <div
      ref={overlayRef}
      className="intro-preloader"
      data-lenis-prevent
      data-phase={phase}
      aria-hidden="true"
      role="presentation"
      style={{
        ["--intro-exit-ms" as string]: `${WORDS_EXIT_MS}ms`,
      }}
    >
      <style>{`html{scroll-behavior:auto!important}`}</style>
      <CurvedCurtainTransition
        playing={revealing}
        onComplete={finishIntro}
      >
        <div className="intro-preloader__screen">
          <div
            className={`intro-preloader__words${shown ? " is-in" : ""}${
              exiting ? " is-out" : ""
            }`}
          >
            <span className="intro-preloader__dot" />
            <p className="intro-preloader__word">{greeting}</p>
          </div>
        </div>
      </CurvedCurtainTransition>
    </div>
  );
}

declare global {
  interface Window {
    replayIntro?: () => void;
  }
}
