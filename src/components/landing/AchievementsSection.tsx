/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Achievements — Spector-style 3-up cylinder coverflow (ref MP4).
 * Cards ride a circular path: advance swings the next card in from behind.
 */

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type PanInfo } from "motion/react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import type { Achievement } from "@/data/achievements";

const FILTER_TABS = ["University", "Office", "Projects", "Others"] as const;
type FilterTab = (typeof FILTER_TABS)[number];

const DRAG_VELOCITY = 480;

/** Desktop always shows 3 cards (ref MP4). */
const DESKTOP_VISIBLE = 3;
const DESKTOP_GAP = 18;
const DESKTOP_CARD_W_MIN = 260;
const DESKTOP_CARD_W_MAX = 400;
const DESKTOP_SIDE_PAD = 48;
const MOBILE_VISIBLE = 1;

const PERSPECTIVE = 1400;
/** Degrees between neighboring slots on the cylinder (Spector “ghure” path). */
const ANGLE_STEP = 30;
const DURATION = 0.48;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const LOCK_MS = Math.round(DURATION * 1000) + 40;
/** Auto-advance beat — snappy enough to feel alive. */
const AUTO_MS = 2800;
/** Delay after section enters view before the “tease” step. */
const INTRO_TEASE_MS = 380;

type PanelPose = {
  x: number;
  z: number;
  rotateY: number;
  opacity: number;
  scale: number;
  zIndex: number;
};

function wrapIndex(i: number, count: number) {
  return ((i % count) + count) % count;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function useContainerWidth(padding = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      setWidth(Math.max(0, Math.floor(el.clientWidth - padding)));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [padding]);

  return { ref, width };
}

function achievementMatchesTab(a: Achievement, tab: FilterTab): boolean {
  const blob = `${a.title} ${a.issuer}`.toLowerCase();
  switch (tab) {
    case "University":
      return (
        a.type === "education" ||
        a.type === "award" ||
        /university|nasa|hult|innovate|millionx|sust|ssa|debate|metropolitan|bubt/.test(
          blob,
        )
      );
    case "Office":
      return a.type === "milestone" && /kraft|kode/.test(blob);
    case "Projects":
      return a.type === "milestone" && !/kraft|kode/.test(blob);
    case "Others":
      return a.type === "certification";
    default:
      return true;
  }
}

function achievementHighlights(achievement: Achievement): string[] {
  const rows: string[] = [];
  if (achievement.date) rows.push(achievement.date);
  if (achievement.issuer) rows.push(achievement.issuer);
  if (achievement.type === "award") rows.push("Competition win");
  else if (achievement.type === "certification")
    rows.push("Verified credential");
  else if (achievement.type === "education") rows.push("CSE · Software focus");
  else rows.push(achievement.link ? "Live / verified work" : "Shipped delivery");
  return rows.slice(0, 3);
}

function AchievementCard({
  achievement,
  index,
  compact = false,
  dimmed = false,
}: {
  achievement: Achievement;
  index: number;
  compact?: boolean;
  dimmed?: boolean;
}) {
  const number = String(index + 1).padStart(2, "0");
  const highlights = achievementHighlights(achievement);
  const ink = dimmed ? "text-muted" : "text-ink";
  const bar = dimmed ? "bg-muted" : "bg-ink";

  return (
    <article
      className={`relative flex h-full w-full flex-col overflow-hidden rounded-[30px] border-[5px] border-solid border-ink bg-card ${
        compact ? "p-4 sm:p-5" : "p-5"
      } ${ink}`}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3.5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2.5">
            <div
              className={`flex items-start justify-between gap-3 font-audiowide leading-[1.2] ${
                compact
                  ? "text-[20px] sm:text-[22px]"
                  : "text-[22px] xl:text-[26px]"
              }`}
            >
              <h3 className="min-w-0 flex-1 line-clamp-2">{achievement.title}</h3>
              <span className="shrink-0 tabular-nums">/{number}</span>
            </div>
            <div className={`h-1 w-[100px] rounded-full ${bar}`} />
          </div>

          <p
            className={`font-baumans ${
              compact
                ? "line-clamp-3 text-[15px] leading-[1.5]"
                : "line-clamp-3 text-[18px] leading-[1.55] xl:text-[20px] xl:leading-9"
            }`}
          >
            {achievement.description ||
              `${achievement.issuer}. ${achievement.date}.`}
          </p>
        </div>

        {achievement.image && (
          <div
            className={`relative w-full shrink-0 overflow-hidden rounded-2xl bg-surface ${
              compact
                ? "aspect-[16/10] min-h-[148px]"
                : "aspect-[16/10] xl:min-h-[200px]"
            }`}
          >
            <Image
              src={achievement.image}
              alt={achievement.imageAlt ?? achievement.title}
              fill
              sizes="(max-width: 1024px) 90vw, 32vw"
              className="object-cover object-center"
              draggable={false}
            />
          </div>
        )}

        <ul className={`mt-auto flex flex-col ${compact ? "gap-1.5" : "gap-2"}`}>
          {highlights.map((item) => (
            <li key={item} className="flex items-center gap-3 sm:gap-4">
              <Plus
                className={`shrink-0 ${compact ? "h-4 w-4" : "h-5 w-5"}`}
                strokeWidth={2.5}
                aria-hidden
              />
              <span
                className={`min-w-0 font-baumans ${
                  compact
                    ? "text-[13px] leading-[1.35]"
                    : "text-[15px] leading-9 xl:text-[16px]"
                }`}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/**
 * Slot poses on a cylinder — cards swing from behind (not a flat side-slide).
 * angle 0 = center facing camera; ±ANGLE_STEP = left/right; further = enter/exit from back.
 */
function poseForSlot(
  slot: number,
  cardWidth: number,
  front: number,
  gap: number,
  flat: boolean,
): PanelPose {
  const step = cardWidth + gap;
  const mid = (front - 1) / 2;
  const originX = mid * step;

  if (flat) {
    const inFront = slot >= 0 && slot < front;
    return {
      x: slot * step,
      z: 0,
      rotateY: 0,
      opacity: inFront ? 1 : 0,
      scale: 1,
      zIndex: inFront ? 20 : 1,
    };
  }

  const angle = (slot - mid) * ANGLE_STEP;
  const rad = (angle * Math.PI) / 180;
  // Keep visible spacing ≈ step: R = step / sin(ANGLE_STEP)
  const radius = step / Math.sin((ANGLE_STEP * Math.PI) / 180);
  const absSlot = Math.abs(slot - mid);
  // Rest: only |slot-mid| ≤ 1 (the 3 cards). Enter/exit fade via pose lerp while swinging.
  const fadeStart = mid + 0.05;
  const fadeEnd = mid + 0.85;

  let opacity = 1;
  if (absSlot >= fadeEnd) opacity = 0;
  else if (absSlot > fadeStart) {
    opacity = Math.max(
      0,
      1 - (absSlot - fadeStart) / (fadeEnd - fadeStart),
    );
  }

  const depth = Math.max(0, absSlot - mid);
  return {
    x: originX + Math.sin(rad) * radius,
    z: (Math.cos(rad) - 1) * radius,
    rotateY: -angle,
    opacity,
    scale: absSlot <= mid ? (absSlot < 0.2 ? 1 : 0.96) : 0.9 - depth * 0.04,
    zIndex: Math.round(40 - absSlot * 10),
  };
}

function poseAt(
  slot: number,
  cardWidth: number,
  front: number,
  gap: number,
  flat: boolean,
): PanelPose {
  const lo = Math.floor(slot);
  const t = slot - lo;
  if (t < 0.001) return poseForSlot(lo, cardWidth, front, gap, flat);
  if (t > 0.999) return poseForSlot(lo + 1, cardWidth, front, gap, flat);
  const a = poseForSlot(lo, cardWidth, front, gap, flat);
  const b = poseForSlot(lo + 1, cardWidth, front, gap, flat);
  // Ease z/rotate a bit more than x so the arc reads as “ghure” not a slide
  const arcT = t * t * (3 - 2 * t);
  return {
    x: lerp(a.x, b.x, t),
    z: lerp(a.z, b.z, arcT),
    rotateY: lerp(a.rotateY, b.rotateY, arcT),
    opacity: lerp(a.opacity, b.opacity, t),
    scale: lerp(a.scale, b.scale, t),
    zIndex: t < 0.5 ? a.zIndex : b.zIndex,
  };
}

/**
 * Circle coverflow: auto-advances; arrows + drag still work (hover/drag pauses).
 * On section enter → one tease step so it’s obvious more cards are waiting.
 */
function CircleCarousel({
  achievements,
  visible,
  cardWidth,
  compact = false,
  stageHeight,
  gap = 0,
}: {
  achievements: Achievement[];
  visible: number;
  cardWidth: number;
  compact?: boolean;
  stageHeight: number;
  gap?: number;
}) {
  const reduceMotion = useReducedMotion();
  const count = achievements.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrubX, setScrubX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const teaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasInViewRef = useRef(false);
  const busyRef = useRef(false);
  /** Lock pan to one axis so vertical page scroll isn’t stolen on mobile. */
  const panAxisRef = useRef<"x" | "y" | null>(null);

  const front = Math.min(visible, Math.max(1, count));
  const flat = compact || Boolean(reduceMotion);
  const step = cardWidth + gap;
  const stripWidth = front * cardWidth + Math.max(0, front - 1) * gap;
  const floatIndex = activeIndex - (step > 0 ? scrubX / step : 0);

  busyRef.current = isAnimating || isDragging;

  useEffect(() => {
    setActiveIndex(0);
    setScrubX(0);
    wasInViewRef.current = false;
  }, [achievements]);

  useEffect(() => {
    return () => {
      if (unlockTimer.current) clearTimeout(unlockTimer.current);
      if (teaseTimer.current) clearTimeout(teaseTimer.current);
    };
  }, []);

  const lockBriefly = useCallback(() => {
    setIsAnimating(true);
    const ms = reduceMotion ? 40 : LOCK_MS;
    if (unlockTimer.current) clearTimeout(unlockTimer.current);
    unlockTimer.current = setTimeout(() => setIsAnimating(false), ms);
  }, [reduceMotion]);

  const advance = useCallback(
    (dir: -1 | 1 = 1) => {
      if (count <= 1 || busyRef.current || cardWidth <= 0) return;
      lockBriefly();
      setScrubX(0);
      setActiveIndex((i) => i + dir);
    },
    [count, cardWidth, lockBriefly],
  );

  const go = useCallback(
    (dir: -1 | 1) => {
      if (count <= 1 || isAnimating || isDragging || cardWidth <= 0) return;
      advance(dir);
    },
    [count, isAnimating, isDragging, cardWidth, advance],
  );

  // Tease + in-view tracking: every time the section scrolls into view, step once
  useEffect(() => {
    const el = rootRef.current;
    if (!el || count <= 1 || cardWidth <= 0) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const visibleNow = entry.isIntersecting;
        setInView(visibleNow);

        if (visibleNow && !wasInViewRef.current) {
          wasInViewRef.current = true;
          if (reduceMotion) return;
          if (teaseTimer.current) clearTimeout(teaseTimer.current);
          teaseTimer.current = setTimeout(() => {
            advance(1);
          }, INTRO_TEASE_MS);
        } else if (!visibleNow) {
          wasInViewRef.current = false;
          if (teaseTimer.current) {
            clearTimeout(teaseTimer.current);
            teaseTimer.current = null;
          }
        }
      },
      { threshold: 0.4, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (teaseTimer.current) clearTimeout(teaseTimer.current);
    };
  }, [count, cardWidth, reduceMotion, advance]);

  // Auto-advance while in view; `activeIndex` resets the beat after each step
  useEffect(() => {
    if (
      paused ||
      !inView ||
      reduceMotion ||
      count <= 1 ||
      cardWidth <= 0
    ) {
      return;
    }

    const id = window.setInterval(() => {
      advance(1);
    }, AUTO_MS);

    return () => window.clearInterval(id);
  }, [
    paused,
    inView,
    reduceMotion,
    count,
    cardWidth,
    advance,
    activeIndex,
  ]);

  const onPan = useCallback(
    (_: PointerEvent, info: PanInfo) => {
      if (count <= 1 || isAnimating || reduceMotion) return;

      if (!panAxisRef.current) {
        const ax = Math.abs(info.offset.x);
        const ay = Math.abs(info.offset.y);
        if (ax < 8 && ay < 8) return;
        panAxisRef.current = ax >= ay ? "x" : "y";
      }
      // Vertical intent → let the page (Lenis) scroll; don’t scrub cards
      if (panAxisRef.current === "y") return;

      setIsDragging(true);
      setScrubX(info.offset.x);
    },
    [count, isAnimating, reduceMotion],
  );

  const onPanEnd = useCallback(
    (_: PointerEvent, info: PanInfo) => {
      const axis = panAxisRef.current;
      panAxisRef.current = null;

      if (axis === "y" || count <= 1 || cardWidth <= 0) {
        setIsDragging(false);
        setScrubX(0);
        return;
      }

      const raw = -info.offset.x / step;
      let steps = Math.round(raw);
      if (info.velocity.x < -DRAG_VELOCITY) steps = Math.max(steps, 1);
      else if (info.velocity.x > DRAG_VELOCITY) steps = Math.min(steps, -1);

      setIsDragging(false);
      setScrubX(0);
      if (steps !== 0) {
        lockBriefly();
        setActiveIndex((i) => i + steps);
      }
    },
    [count, cardWidth, step, lockBriefly],
  );

  const scrubPad = isDragging
    ? Math.ceil(Math.abs(scrubX) / Math.max(step, 1)) + 2
    : 0;
  // Extra ±2 so enter/exit cards exist on the back of the cylinder during the swing
  const start = Math.floor(floatIndex) - (flat ? 1 : 2) - scrubPad;
  const end = Math.ceil(floatIndex) + front + (flat ? 0 : 2) + scrubPad;
  const virtuals: number[] = [];
  for (let v = start; v <= end; v++) virtuals.push(v);

  const tween =
    isDragging || reduceMotion
      ? { duration: 0 }
      : { duration: DURATION, ease: EASE };

  if (cardWidth <= 0 || count === 0) {
    return (
      <div className="w-full" style={{ height: stageHeight }} aria-hidden />
    );
  }

  return (
    <div
      ref={rootRef}
      className="flex w-full max-w-full flex-col items-center gap-8 sm:gap-10"
      data-achievements-carousel={compact ? "mobile" : "desktop"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div
        className="relative w-full overflow-visible"
        style={{ height: stageHeight }}
      >
        <motion.div
          className="absolute top-0 left-1/2 cursor-grab active:cursor-grabbing"
          style={{
            width: stripWidth,
            height: stageHeight,
            marginLeft: -stripWidth / 2,
            ...(flat
              ? {}
              : {
                  perspective: `${PERSPECTIVE}px`,
                  perspectiveOrigin: "50% 50%",
                }),
            // pan-y: vertical page scroll works; horizontal pans still drive the carousel
            touchAction: "pan-y",
            userSelect: "none",
          }}
          onPan={onPan}
          onPanEnd={onPanEnd}
        >
          <div
            className="relative h-full w-full"
            style={flat ? undefined : { transformStyle: "preserve-3d" }}
          >
            {virtuals.map((virtual) => {
              const slot = virtual - floatIndex;
              const dataIndex = wrapIndex(virtual, count);
              const achievement = achievements[dataIndex];
              const pose = poseAt(slot, cardWidth, front, gap, flat);
              const mid = (front - 1) / 2;
              const inBand = slot >= -0.2 && slot < front + 0.2;
              const isSide = Math.abs(slot - mid) > 0.35;

              return (
                <motion.div
                  key={virtual}
                  className="absolute top-0 left-0"
                  style={{
                    width: cardWidth,
                    height: "100%",
                    zIndex: pose.zIndex,
                    pointerEvents: isDragging || !inBand ? "none" : "auto",
                  }}
                  initial={false}
                  animate={{
                    x: pose.x,
                    opacity: pose.opacity,
                    scale: pose.scale,
                  }}
                  transition={tween}
                >
                  {/*
                    CSS rotateY (center origin) — Spector 3-up coverflow.
                    Keep rotate off Motion's x node so cards don't mid-fold.
                  */}
                  <div
                    className="h-full w-full"
                    style={{
                      transformOrigin: "center center",
                      transformStyle: flat ? undefined : "preserve-3d",
                      transform: flat
                        ? undefined
                        : `translateZ(${pose.z}px) rotateY(${pose.rotateY}deg)`,
                      transition: isDragging || reduceMotion
                        ? "none"
                        : `transform ${DURATION}s cubic-bezier(0.22, 1, 0.36, 1)`,
                      willChange: flat ? undefined : "transform",
                    }}
                  >
                    <AchievementCard
                      achievement={achievement}
                      index={dataIndex}
                      compact={compact}
                      dimmed={!flat && isSide}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {count > 1 && (
        <div className="flex items-center gap-[30px]">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={isAnimating || isDragging}
            aria-label="Previous slide"
            className="flex h-[50px] w-[50px] items-center justify-center text-ink transition-opacity hover:opacity-60 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ChevronLeft className="h-10 w-10" strokeWidth={1.25} />
          </button>
          <span className="min-w-[3ch] text-center font-anon text-sm text-muted lg:hidden">
            {wrapIndex(Math.round(floatIndex), count) + 1}/{count}
          </span>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={isAnimating || isDragging}
            aria-label="Next slide"
            className="flex h-[50px] w-[50px] items-center justify-center text-ink transition-opacity hover:opacity-60 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ChevronRight className="h-10 w-10" strokeWidth={1.25} />
          </button>
        </div>
      )}
    </div>
  );
}

function MobileAchievementsCarousel({
  achievements,
}: {
  achievements: Achievement[];
}) {
  const { ref, width } = useContainerWidth(0);
  const cardWidth = width > 0 ? width : 0;
  // Title + copy + 16/10 photo + meta — keep stage tall enough not to clip
  const stageHeight =
    cardWidth > 0
      ? Math.round(Math.min(Math.max(cardWidth * 1.55, 460), 560))
      : 480;

  return (
    <div ref={ref} className="w-full min-w-0 max-w-full">
      <CircleCarousel
        achievements={achievements}
        visible={MOBILE_VISIBLE}
        cardWidth={cardWidth}
        compact
        stageHeight={stageHeight}
      />
    </div>
  );
}

/** Full-viewport desktop — always 3 cards (Spector ref). */
function DesktopAchievementsCarousel({
  achievements,
}: {
  achievements: Achievement[];
}) {
  const { ref, width } = useContainerWidth(0);

  const cardWidth = useMemo(() => {
    if (width <= 0) return DESKTOP_CARD_W_MAX;
    const usable = Math.max(0, width - DESKTOP_SIDE_PAD * 2);
    const raw = Math.floor(
      (usable - DESKTOP_GAP * (DESKTOP_VISIBLE - 1)) / DESKTOP_VISIBLE,
    );
    return Math.min(
      DESKTOP_CARD_W_MAX,
      Math.max(DESKTOP_CARD_W_MIN, raw),
    );
  }, [width]);

  const stageHeight = Math.round(
    Math.min(640, Math.max(500, cardWidth * 1.45)),
  );

  return (
    <div
      ref={ref}
      className="relative w-screen max-w-[100vw]"
      style={{ marginLeft: "calc(50% - 50vw)" }}
    >
      <CircleCarousel
        achievements={achievements}
        visible={DESKTOP_VISIBLE}
        cardWidth={cardWidth}
        gap={DESKTOP_GAP}
        stageHeight={stageHeight}
      />
    </div>
  );
}

function FilterPills({
  activeTab,
  onChange,
  size = "desktop",
}: {
  activeTab: FilterTab;
  onChange: (tab: FilterTab) => void;
  size?: "desktop" | "mobile";
}) {
  const desktop = size === "desktop";
  return (
    <div
      className={
        desktop
          ? "flex gap-[26px]"
          : "-mx-1 flex w-full max-w-full gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:gap-3 sm:overflow-visible [&::-webkit-scrollbar]:hidden"
      }
    >
      {FILTER_TABS.map((tab) => {
        const active = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`rounded-full font-anon font-bold transition-colors ${
              desktop
                ? "px-5 py-3 text-[16px] leading-[22px]"
                : "shrink-0 px-3.5 py-2 text-[13px] sm:px-4 sm:text-sm"
            } ${
              active
                ? "bg-accent text-on-accent"
                : "border border-solid border-border bg-transparent text-ink hover:bg-surface"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

export function AchievementsSection({
  achievements,
}: {
  achievements: Achievement[];
}) {
  const [activeTab, setActiveTab] = useState<FilterTab>("University");

  const filtered = useMemo(() => {
    const list = achievements.filter((a) =>
      achievementMatchesTab(a, activeTab),
    );
    return list.length > 0 ? list : achievements;
  }, [achievements, activeTab]);

  return (
    <section
      id="achievements"
      className="relative overflow-x-clip overflow-y-visible bg-bg py-14 sm:py-20 lg:py-0 lg:overflow-x-visible"
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-[80px] hidden w-px bg-ink/10 lg:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-[80px] hidden w-px bg-ink/10 lg:block"
        aria-hidden
      />

      <div className="relative hidden min-h-[min(100vh,1128px)] w-full lg:block">
        <div className="flex w-full flex-col items-center gap-[60px] px-6 pb-20 pt-[100px]">
          <div className="flex w-full max-w-[616px] flex-col items-center gap-6">
            <div className="flex w-full flex-col items-center gap-4 text-center">
              <h2 className="font-audiowide text-[48px] leading-[72px] text-ink">
                ACHIEVEMENTS
              </h2>
              <p className="w-full font-baumans text-[24px] leading-[36px] text-ink">
                Trust is the foundation of every great project.
              </p>
            </div>
            <FilterPills activeTab={activeTab} onChange={setActiveTab} />
          </div>

          <DesktopAchievementsCarousel
            key={activeTab}
            achievements={filtered}
          />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-6 px-4 sm:gap-8 sm:px-10 lg:hidden">
        <div className="flex w-full flex-col items-center gap-3 text-center sm:gap-4">
          <h2 className="font-audiowide text-[28px] leading-[36px] text-ink sm:text-[40px] sm:leading-[48px]">
            ACHIEVEMENTS
          </h2>
          <p className="max-w-[34ch] font-baumans text-[16px] leading-[26px] text-ink sm:max-w-none sm:text-[20px] sm:leading-[28px]">
            Trust is the foundation of every great project.
          </p>
        </div>

        <FilterPills
          activeTab={activeTab}
          onChange={setActiveTab}
          size="mobile"
        />

        <MobileAchievementsCarousel key={activeTab} achievements={filtered} />
      </div>
    </section>
  );
}
