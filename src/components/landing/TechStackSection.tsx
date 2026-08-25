/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type PanInfo } from "motion/react";
import { TECH_STACK, type TechStackItem } from "./landingData";

/** Left → right order for the Figma arc. */
const ITEMS: TechStackItem[] = [
  TECH_STACK[4],
  TECH_STACK[3],
  TECH_STACK[2],
  TECH_STACK[1],
  TECH_STACK[0],
  TECH_STACK[5],
  TECH_STACK[6],
  TECH_STACK[7],
  TECH_STACK[8],
].filter(Boolean) as TechStackItem[];

const N = ITEMS.length;
const MID = 4;
/** Gentle auto-advance — slow enough to read each card. */
const AUTO_MS = 4200;
const CARD = 300;

/**
 * Card-center X as % of full screen width (0% = left edge, 100% = right).
 * Uses the entire viewport — maximum width.
 */
const SLOT_X_PCT = [4, 15.5, 27, 38.5, 50, 61.5, 73, 84.5, 96];

const SLOT_META = [
  { y: 185, scale: 250 / 300, z: 1 },
  { y: 137, scale: 250 / 300, z: 2 },
  { y: 85, scale: 250 / 300, z: 3 },
  { y: 25, scale: 250 / 300, z: 4 },
  { y: 0, scale: 1, z: 10 },
  { y: 31, scale: 250 / 300, z: 4 },
  { y: 97, scale: 250 / 300, z: 3 },
  { y: 155, scale: 250 / 300, z: 2 },
  { y: 208, scale: 250 / 300, z: 1 },
] as const;

const move = {
  type: "spring" as const,
  stiffness: 48,
  damping: 22,
  mass: 1.15,
};

function wrap(i: number) {
  return ((i % N) + N) % N;
}

function TechCard({
  name,
  icon,
  featured,
}: {
  name: string;
  icon: string;
  featured: boolean;
}) {
  return (
    <div
      className="flex h-[300px] w-[300px] items-center justify-center rounded-lg bg-ink p-[15px]"
      style={{
        boxShadow: featured
          ? "0 24px 56px rgba(0,0,0,0.22)"
          : "0 10px 28px rgba(0,0,0,0.1)",
      }}
    >
      <div className="flex h-[260px] w-[260px] flex-col items-center justify-center gap-2 rounded-lg bg-card p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={icon} alt="" className="h-[48px] w-[48px] object-contain" />
        <p className="font-audiowide text-[30px] leading-[40px] text-ink">{name}</p>
      </div>
    </div>
  );
}

function DesktopFan() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(MID);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = window.setInterval(() => setActive((a) => wrap(a + 1)), AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, reduceMotion]);

  const onDragEnd = useCallback((_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) {
      setActive((a) => wrap(a + 1));
    } else if (info.offset.x > 60 || info.velocity.x > 400) {
      setActive((a) => wrap(a - 1));
    }
  }, []);

  return (
    <div
      className="relative hidden h-[729px] w-screen overflow-hidden lg:block"
      style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <h2 className="pointer-events-none absolute left-1/2 top-[100px] z-20 -translate-x-1/2 whitespace-nowrap font-audiowide text-[48px] leading-[72px] text-ink">
        Tech Stack
      </h2>

      <motion.div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        drag={reduceMotion ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={onDragEnd}
      >
        {ITEMS.map((tech, itemIndex) => {
          const slotIndex = wrap(itemIndex - active + MID);
          const meta = SLOT_META[slotIndex];
          const featured = slotIndex === MID;
          const leftPct = SLOT_X_PCT[slotIndex];

          return (
            <motion.button
              key={`${tech.name}-${itemIndex}`}
              type="button"
              aria-label={tech.name}
              aria-current={featured || undefined}
              className="absolute border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
              style={{
                top: 224 + CARD / 2,
                marginTop: -CARD / 2,
                width: CARD,
                height: CARD,
                zIndex: meta.z,
                marginLeft: -CARD / 2,
              }}
              initial={false}
              animate={{
                left: `${leftPct}%`,
                y: meta.y,
                scale: meta.scale,
              }}
              transition={reduceMotion ? { duration: 0 } : move}
              onClick={() => setActive(itemIndex)}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: meta.y - 10,
                      transition: { type: "spring", stiffness: 300, damping: 24 },
                    }
              }
            >
              <TechCard name={tech.name} icon={tech.icon} featured={featured} />
            </motion.button>
          );
        })}
      </motion.div>

      <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {ITEMS.map((tech, i) => (
          <button
            key={`dot-${tech.name}-${i}`}
            type="button"
            aria-label={`Show ${tech.name}`}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === active ? "w-6 bg-accent" : "w-2 bg-ink/25 hover:bg-ink/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

const MOBILE_CARD = 168;
const MOBILE_SWIPE_PX = 48;

/** Single ease for all props — no spring bounce / no left% layout thrash. */
const MOVE_MOBILE = {
  duration: 0.88,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

/**
 * Fan arc as offset from center (fraction of stage half-width).
 * Driven with translateX — GPU only, butter-smooth on mobile.
 */
const MOBILE_META = [
  { xFrac: -0.96, y: 78, scale: 0.58, z: 1, rot: 32 },
  { xFrac: -0.72, y: 58, scale: 0.66, z: 2, rot: 24 },
  { xFrac: -0.46, y: 36, scale: 0.76, z: 3, rot: 14 },
  { xFrac: -0.23, y: 14, scale: 0.88, z: 5, rot: 7 },
  { xFrac: 0, y: 0, scale: 1, z: 12, rot: 0 },
  { xFrac: 0.23, y: 14, scale: 0.88, z: 5, rot: -7 },
  { xFrac: 0.46, y: 36, scale: 0.76, z: 3, rot: -14 },
  { xFrac: 0.72, y: 58, scale: 0.66, z: 2, rot: -24 },
  { xFrac: 0.96, y: 78, scale: 0.58, z: 1, rot: -32 },
] as const;

function MobileFan() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(MID);
  const [paused, setPaused] = useState(false);
  const [stageW, setStageW] = useState(360);
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const panAxis = useRef<"x" | "y" | null>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setStageW(Math.max(280, el.clientWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = window.setInterval(() => setActive((a) => wrap(a + 1)), AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, reduceMotion]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setPaused(true);
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
    panAxis.current = null;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current || panAxis.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    panAxis.current = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      setPaused(false);
      const start = touchStart.current;
      const axis = panAxis.current;
      touchStart.current = null;
      panAxis.current = null;
      if (!start || axis !== "x" || reduceMotion) return;

      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      if (dx <= -MOBILE_SWIPE_PX) setActive((a) => wrap(a + 1));
      else if (dx >= MOBILE_SWIPE_PX) setActive((a) => wrap(a - 1));
    },
    [reduceMotion],
  );

  const half = stageW * 0.48;
  const tween = reduceMotion ? { duration: 0 } : MOVE_MOBILE;

  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-6 overflow-x-clip px-0 py-4 sm:gap-8 sm:px-2 lg:hidden">
      <h2 className="px-4 font-audiowide text-[clamp(1.75rem,8vw,2.5rem)] leading-tight text-ink">
        Tech Stack
      </h2>

      <div
        ref={stageRef}
        className="relative h-[300px] w-full max-w-[100vw] select-none sm:h-[340px]"
        style={{
          touchAction: "pan-y",
          perspective: reduceMotion ? undefined : "1200px",
          perspectiveOrigin: "50% 42%",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={() => {
          setPaused(false);
          touchStart.current = null;
          panAxis.current = null;
        }}
      >
        {ITEMS.map((tech, itemIndex) => {
          const slotIndex = wrap(itemIndex - active + MID);
          const meta = MOBILE_META[slotIndex];
          const featured = slotIndex === MID;
          const far = Math.abs(slotIndex - MID) >= 4;
          const x = meta.xFrac * half;

          return (
            <motion.button
              key={`m-${tech.name}-${itemIndex}`}
              type="button"
              aria-label={tech.name}
              aria-current={featured || undefined}
              tabIndex={featured ? 0 : -1}
              className="absolute top-[52px] left-1/2 border-0 bg-transparent p-0 sm:top-[60px]"
              style={{
                width: MOBILE_CARD,
                height: MOBILE_CARD,
                marginLeft: -MOBILE_CARD / 2,
                zIndex: meta.z,
                pointerEvents: Math.abs(slotIndex - MID) <= 2 ? "auto" : "none",
                transformStyle: "preserve-3d",
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
              initial={false}
              animate={{
                x,
                y: meta.y,
                scale: meta.scale,
                rotateY: reduceMotion ? 0 : meta.rot,
                opacity: far ? 0 : 1,
              }}
              transition={tween}
              onClick={() => setActive(itemIndex)}
            >
              {/* Solid shell — opaque while cards pass each other */}
              <div
                className={`flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-ink p-2 ${
                  featured
                    ? "shadow-[0_18px_40px_rgba(0,0,0,0.3)]"
                    : "shadow-md"
                }`}
              >
                <div className="flex h-full w-full flex-col items-center justify-center gap-2.5 rounded-lg bg-card px-2 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tech.icon}
                    alt=""
                    className="h-11 w-11 object-contain sm:h-12 sm:w-12"
                    draggable={false}
                  />
                  <p className="max-w-full truncate px-1 text-center font-audiowide text-[13px] leading-tight text-ink sm:text-[15px]">
                    {tech.name}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-2 px-4">
        {ITEMS.map((tech, i) => (
          <button
            key={`md-${tech.name}-${i}`}
            type="button"
            aria-label={`Show ${tech.name}`}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === active ? "w-6 bg-accent" : "w-2 bg-ink/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function TechStackSection() {
  return (
    <section
      id="stack"
      className="relative w-full overflow-x-hidden bg-bg py-16 sm:py-20 lg:py-0"
    >
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 hidden h-px bg-ink/10 lg:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-0 right-0 top-[9px] hidden h-px bg-ink/10 lg:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[9px] left-0 right-0 hidden h-px bg-ink/10 lg:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 hidden h-px bg-ink/10 lg:block"
        aria-hidden
      />

      <DesktopFan />
      <MobileFan />
    </section>
  );
}
