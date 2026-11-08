"use client";

import { useEffect, useRef, type ReactNode } from "react";

const CURTAIN_DELAY_MS = 40;
const CURTAIN_DURATION_MS = 1150;
const COMPLETE_MS = CURTAIN_DELAY_MS + CURTAIN_DURATION_MS;
const FAILSAFE_MS = 2400;
const PANEL_TRAVEL = -122;
const PAGE_START_VH = 0.18;

/** Page offset as a fraction of startPx, keyed to curtain progress. */
const PULL_KEYS: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [0.25, 0.906],
  [0.5, 0.656],
  [0.75, 0.344],
  [0.9, 0.125],
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeInOutPower4(t: number) {
  const p = clamp(t, 0, 1);
  return p < 0.5 ? 8 * p * p * p * p : 1 - (-2 * p + 2) ** 4 / 2;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function easeInCubic(t: number) {
  return t * t * t;
}

function curveScale(progress: number) {
  if (progress <= 0) return 0;
  if (progress < 0.3) return easeOutCubic(progress / 0.3);
  return Math.max(0, 1 - easeInCubic((progress - 0.3) / 0.7));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function samplePullRatio(progress: number) {
  const p = clamp(progress, 0, 1);
  for (let i = 1; i < PULL_KEYS.length; i += 1) {
    const [x1, y1] = PULL_KEYS[i];
    if (p <= x1) {
      const [x0, y0] = PULL_KEYS[i - 1];
      const u = smoothstep(x0, x1, p);
      return y0 + (y1 - y0) * u;
    }
  }
  return PULL_KEYS[PULL_KEYS.length - 1][1];
}

function pagePullPx(panelT: number, startPx: number) {
  if (panelT >= 1) return 0;
  if (panelT >= 0.9) {
    const from = startPx * 0.125;
    const u = clamp((panelT - 0.9) / 0.1, 0, 1);
    return from * (1 - smoothstep(0, 1, u));
  }
  return startPx * samplePullRatio(panelT);
}

function applyPagePull(px: number) {
  const html = document.documentElement;
  if (!html.classList.contains("intro-prepare-hero")) return;
  html.style.setProperty("--intro-pull", `${px.toFixed(2)}px`);
}

export function CurvedCurtainTransition({
  playing,
  onComplete,
  children,
}: {
  playing: boolean;
  onComplete: () => void;
  children?: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const curveRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!playing) return;

    completedRef.current = false;
    let frame = 0;
    let start = 0;
    let failsafe = 0;
    let watchdog = 0;
    const panel = panelRef.current;
    const curve = curveRef.current;
    const startPx = Math.round(window.innerHeight * PAGE_START_VH);
    applyPagePull(startPx);

    const stopTimers = () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(watchdog);
      window.clearTimeout(failsafe);
    };

    const finish = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      stopTimers();
      if (panel) panel.style.transform = `translate3d(0, ${PANEL_TRAVEL}%, 0)`;
      if (curve) curve.style.transform = "translate3d(0, 99%, 0) scaleY(0)";
      applyPagePull(0);
      onCompleteRef.current();
    };

    const tick = (now: number) => {
      if (completedRef.current) return;
      if (!start) start = now;
      const elapsed = now - start;

      const panelT = easeInOutPower4(
        (elapsed - CURTAIN_DELAY_MS) / CURTAIN_DURATION_MS,
      );
      if (panel) {
        panel.style.transform = `translate3d(0, ${(PANEL_TRAVEL * panelT).toFixed(3)}%, 0)`;
      }
      if (curve) {
        curve.style.transform = `translate3d(0, 99%, 0) scaleY(${curveScale(panelT).toFixed(4)})`;
      }
      applyPagePull(pagePullPx(panelT, startPx));

      if (elapsed < COMPLETE_MS) {
        frame = window.requestAnimationFrame(tick);
        return;
      }
      finish();
    };

    failsafe = window.setTimeout(finish, FAILSAFE_MS);
    watchdog = window.setInterval(() => {
      if (!completedRef.current) tick(performance.now());
    }, 32);

    try {
      if (panel) panel.style.transform = "translate3d(0, 0, 0)";
      if (curve) curve.style.transform = "translate3d(0, 99%, 0) scaleY(0)";
      frame = window.requestAnimationFrame(tick);
    } catch {
      finish();
    }

    return stopTimers;
  }, [playing]);

  return (
    <div ref={panelRef} className="intro-preloader__panel">
      <div ref={curveRef} className="intro-preloader__curve-wrap">
        <div className="intro-preloader__curve" />
      </div>
      {children}
    </div>
  );
}
