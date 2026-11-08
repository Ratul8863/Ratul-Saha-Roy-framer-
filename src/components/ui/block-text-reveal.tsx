"use client";

import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type TagName = "p" | "h2" | "h3" | "h4";

/** One line's cover-to-uncover span, in timeline units. */
const PER_LINE_SPAN = 0.85;
const BASE_DURATION_MS = 2200;
const SPEED = 50;
const SPEED_DIVISOR = 25;
const COVER = 42;
const STAGGER = 7;
const LINE_PAD_X = 2;
const LINE_TOP_LIFT = 0.08;
const LINE_HEIGHT = 1.18;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOutCubic = (t: number) => {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
};
const px = (n: number) =>
  Number.isFinite(n) ? Math.round(n * 1e3) / 1e3 : 0;

interface WordToken {
  text: string;
  breaks: number;
}

function parseWords(text: string): WordToken[] {
  const out: WordToken[] = [];
  const lines = String(text ?? "").split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    for (const part of lines[i].split(/\s+/)) {
      if (part) out.push({ text: part, breaks: 0 });
    }
    if (i < lines.length - 1 && out.length > 0) out[out.length - 1].breaks += 1;
  }
  return out;
}

interface WordRect {
  x: number;
  yText: number;
  w: number;
  hText: number;
  line: number;
}

interface LineRect {
  line: number;
  minX: number;
  maxX: number;
  yText: number;
  hText: number;
}

interface Measurement {
  rects: WordRect[];
  lines: LineRect[];
  lineCount: number;
  sig: string;
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Line sweep reveal. A bar in the text colour covers each line from the left,
 * then uncovers the words. No separate highlight colour.
 */
export const BlockTextReveal = forwardRef<
  HTMLElement,
  {
    text: string;
    as?: TagName;
    className?: string;
    textColor: string;
    style?: CSSProperties;
  }
>(function BlockTextReveal(
  { text, as = "p", className, textColor, style },
  forwardedRef,
) {
  const textRef = useRef<HTMLElement | null>(null);
  const wordElsRef = useRef<(HTMLElement | null)[]>([]);
  const strutElsRef = useRef<(HTMLElement | null)[]>([]);
  const lineBlockElsRef = useRef<(HTMLElement | null)[]>([]);
  const measureRef = useRef<Measurement | null>(null);
  const progressRef = useRef(0);
  const [measurement, setMeasurement] = useState<Measurement | null>(null);
  measureRef.current = measurement;

  const words = useMemo(() => parseWords(text), [text]);

  const wordsKeyRef = useRef<WordToken[] | null>(null);
  if (wordsKeyRef.current !== words) {
    wordsKeyRef.current = words;
    wordElsRef.current = [];
    strutElsRef.current = [];
    lineBlockElsRef.current = [];
  }

  const setNode = (node: HTMLElement | null) => {
    textRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  const measure = () => {
    const host = textRef.current;
    if (!host || typeof window === "undefined") return;
    const els = wordElsRef.current;
    if (els.length === 0) return;

    const baseCS = window.getComputedStyle(host);
    const rects: WordRect[] = [];
    let lineIdx = -1;
    let lineBaseline = Number.NaN;

    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      if (!el) continue;
      const strut = strutElsRef.current[i];
      const baseline = el.offsetTop + (strut ? strut.offsetTop : 0);
      if (!Number.isFinite(lineBaseline) || baseline - lineBaseline > 0.5) {
        lineIdx += 1;
        lineBaseline = baseline;
      }

      const fontSizePx = parseFloat(baseCS.fontSize);
      const lineHeightPx = parseFloat(baseCS.lineHeight);
      const safeFont =
        Number.isFinite(fontSizePx) && fontSizePx > 0
          ? fontSizePx
          : el.offsetHeight;
      const safeLine =
        Number.isFinite(lineHeightPx) && lineHeightPx > 0
          ? lineHeightPx
          : el.offsetHeight;

      rects.push({
        x: el.offsetLeft,
        w: el.offsetWidth,
        yText: el.offsetTop + Math.max(0, (safeLine - safeFont) / 2),
        hText: safeFont,
        line: Math.max(0, lineIdx),
      });
    }

    if (rects.length === 0) return;

    const lineCount = Math.max(1, lineIdx + 1);
    const lines: LineRect[] = [];
    for (let li = 0; li < lineCount; li++) {
      let minX = Number.POSITIVE_INFINITY;
      let maxX = Number.NEGATIVE_INFINITY;
      let top = Number.POSITIVE_INFINITY;
      let bottom = Number.NEGATIVE_INFINITY;
      let has = false;
      for (const r of rects) {
        if (r.line !== li) continue;
        has = true;
        minX = Math.min(minX, r.x);
        maxX = Math.max(maxX, r.x + r.w);
        top = Math.min(top, r.yText);
        bottom = Math.max(bottom, r.yText + r.hText);
      }
      if (!has || !Number.isFinite(minX) || !Number.isFinite(maxX)) continue;
      lines.push({
        line: li,
        minX,
        maxX,
        yText: top,
        hText: Math.max(1, bottom - top),
      });
    }

    const sig = rects
      .map(
        (r) =>
          `${Math.round(r.x)},${Math.round(r.yText)},${Math.round(r.w)},${Math.round(r.hText)},${r.line}`,
      )
      .join("|");
    if (measureRef.current?.sig === sig) return;
    setMeasurement({ rects, lines, lineCount, sig });
  };

  const measureFnRef = useRef(measure);
  measureFnRef.current = measure;

  const applyProgress = (p: number) => {
    const m = measureRef.current;
    if (!m) return;
    const { rects, lines, lineCount } = m;
    const delayStep = PER_LINE_SPAN * (STAGGER / 100);
    const timeline = PER_LINE_SPAN + delayStep * Math.max(0, lineCount - 1);
    const enterEnd = Math.min(0.98, Math.max(0.02, COVER / 100));
    const exitDuration = Math.max(1e-5, 1 - enterEnd);

    for (const lr of lines) {
      const el = lineBlockElsRef.current[lr.line];
      if (!el) continue;
      const local = clamp01(
        (p * timeline - lr.line * delayStep) / Math.max(1e-4, PER_LINE_SPAN),
      );
      const boxWidth = lr.maxX - lr.minX + LINE_PAD_X * 2;
      const entering = local < enterEnd;
      const sx = entering
        ? easeOutCubic(local / Math.max(1e-5, enterEnd))
        : Math.max(0, 1 - easeOutCubic((local - enterEnd) / exitDuration));
      if (boxWidth * sx <= 1) {
        el.style.visibility = "hidden";
        continue;
      }
      el.style.visibility = "visible";
      el.style.transformOrigin = entering ? "0% 50%" : "100% 50%";
      el.style.transform = `scaleX(${px(sx)})`;
    }

    for (let i = 0; i < rects.length; i++) {
      const el = wordElsRef.current[i];
      if (!el) continue;
      const local = clamp01(
        (p * timeline - rects[i].line * delayStep) /
          Math.max(1e-4, PER_LINE_SPAN),
      );
      el.style.opacity = local >= enterEnd ? "1" : "0";
    }
  };

  const applyRef = useRef(applyProgress);
  applyRef.current = applyProgress;

  useIsomorphicLayoutEffect(() => {
    measureFnRef.current();
  }, [words, className]);

  useIsomorphicLayoutEffect(() => {
    applyRef.current(progressRef.current);
  });

  useEffect(() => {
    const el = textRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    let raf = 0;
    const observer = new ResizeObserver(() => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        measureFnRef.current();
      });
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const fonts = (document as Document & { fonts?: { ready?: Promise<unknown> } })
      .fonts;
    if (!fonts?.ready) return;
    let alive = true;
    fonts.ready.then(() => {
      if (alive) measureFnRef.current();
    });
    return () => {
      alive = false;
    };
  }, [className]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      progressRef.current = 1;
      applyRef.current(1);
      return;
    }

    let tickRaf = 0;
    let armed = false;
    let mo: MutationObserver | null = null;
    let frame = 0;

    const stopTick = () => {
      if (tickRaf) cancelAnimationFrame(tickRaf);
      tickRaf = 0;
    };

    const hide = () => {
      stopTick();
      progressRef.current = 0;
      applyRef.current(0);
    };

    const play = () => {
      stopTick();
      const lineCount = measureRef.current?.lineCount ?? 1;
      const factor = Math.max(0.1, SPEED / SPEED_DIVISOR);
      const delayStep = PER_LINE_SPAN * (STAGGER / 100);
      const timeline = PER_LINE_SPAN + delayStep * Math.max(0, lineCount - 1);
      const duration = Math.max(
        1,
        (BASE_DURATION_MS / factor) * (timeline / PER_LINE_SPAN),
      );
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = clamp01((now - t0) / duration);
        progressRef.current = t;
        applyRef.current(t);
        if (t < 1) tickRaf = requestAnimationFrame(tick);
        else tickRaf = 0;
      };
      tickRaf = requestAnimationFrame(tick);
    };

    const onScreen = (node: HTMLElement) => {
      const rect = node.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return false;
      return (
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        rect.right > 8 &&
        rect.left < window.innerWidth - 8
      );
    };

    // Fully clear of the viewport before we allow another play, so the
    // pin/edge of Feature Projects doesn't flicker the reveal.
    const fullyOff = (node: HTMLElement) => {
      const rect = node.getBoundingClientRect();
      return (
        rect.bottom <= 0 ||
        rect.top >= window.innerHeight ||
        rect.right <= 0 ||
        rect.left >= window.innerWidth
      );
    };

    const check = () => {
      const node = textRef.current;
      if (!node) return;
      if (onScreen(node)) {
        if (armed) return;
        armed = true;
        play();
        return;
      }
      if (armed && fullyOff(node)) {
        armed = false;
        hide();
      }
    };

    const arm = () => {
      check();
      window.addEventListener("scroll", check, { passive: true });
      window.addEventListener("resize", check);
    };

    const begin = () => {
      if (document.documentElement.classList.contains("intro-pending")) {
        mo = new MutationObserver(() => {
          if (document.documentElement.classList.contains("intro-pending")) return;
          mo?.disconnect();
          arm();
        });
        mo.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["class"],
        });
        return;
      }
      arm();
    };

    frame = requestAnimationFrame(begin);
    progressRef.current = 0;
    applyRef.current(0);

    return () => {
      cancelAnimationFrame(frame);
      stopTick();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      mo?.disconnect();
    };
  }, [text]);

  const Tag = as as ElementType;

  return (
    <Tag
      ref={setNode}
      className={cn("relative text-left", className)}
      style={style}
    >
      {measurement ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-2 overflow-hidden"
        >
          {measurement.lines.map((lr) => (
            <span
              key={`line-${lr.line}`}
              className="absolute"
              style={{
                left: px(lr.minX - LINE_PAD_X),
                top: px(lr.yText - lr.hText * LINE_TOP_LIFT),
                width: px(lr.maxX - lr.minX + LINE_PAD_X * 2),
                height: px(lr.hText * LINE_HEIGHT),
              }}
            >
              <span
                ref={(el) => {
                  lineBlockElsRef.current[lr.line] = el;
                }}
                className="absolute inset-0 origin-left"
                style={{
                  background: textColor,
                  transform: "scaleX(0)",
                  visibility: "hidden",
                }}
              />
            </span>
          ))}
        </span>
      ) : null}

      {words.map((word, i) => {
        const breaks: ReactNode[] = [];
        for (let b = 0; b < word.breaks; b++) breaks.push(<br key={`br-${i}-${b}`} />);
        return (
          <span key={`word-${i}`}>
            <span
              ref={(el) => {
                wordElsRef.current[i] = el;
              }}
              className="relative z-1 inline-block align-baseline"
              style={{ marginRight: "0.35em", opacity: 0, color: textColor }}
            >
              <span
                ref={(el) => {
                  strutElsRef.current[i] = el;
                }}
                aria-hidden="true"
                className="inline-block h-0 w-0"
              />
              {word.text}
            </span>
            {breaks}
          </span>
        );
      })}
    </Tag>
  );
});

BlockTextReveal.displayName = "BlockTextReveal";
