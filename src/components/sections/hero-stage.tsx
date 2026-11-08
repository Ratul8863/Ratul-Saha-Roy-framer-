"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  HeroAmbientField,
  type HeroAmbientFieldHandle,
} from "@/components/sections/hero-ambient-field";
import {
  HoverMaskReveal,
  type HoverMaskRevealHandle,
} from "@/components/sections/hover-mask-reveal";
import {
  lockPageScroll,
  unlockPageScroll,
} from "@/providers/smooth-scroll-provider";
import { cn } from "@/lib/utils";

const PORTRAIT_X = 24;
const PORTRAIT_Y = 14;
const NAME_PARALLAX_X = 8;
const NAME_PARALLAX_Y = 3;
const NAME_AMBIENT_X = 7;
const NAME_AMBIENT_Y = 2.2;
const BREATH_Y = 1.4;
const PORTRAIT_OMEGA = 8.4;
const NAME_OMEGA = 5.2;
const NAME_AMBIENT_PERIOD = 20;
const BREATH_PERIOD = 6.2;
const OVERSCAN = 28;

function canUsePointerMotion() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(hover: hover)").matches &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function springStep(
  pos: number,
  vel: number,
  dest: number,
  omega: number,
  dt: number,
) {
  const acc = omega * omega * (dest - pos) - 2 * omega * vel;
  const nextVel = vel + acc * dt;
  return { pos: pos + nextVel * dt, vel: nextVel };
}

export function HeroStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const spillRef = useRef<HTMLCanvasElement>(null);
  const ambientRef = useRef<HeroAmbientFieldHandle>(null);
  const nameMotionRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HoverMaskRevealHandle>(null);
  const lockRef = useRef(false);
  const [locked, setLocked] = useState(false);
  const motion = useRef({
    inside: false,
    targetX: 0,
    targetY: 0,
    portraitX: 0,
    portraitY: 0,
    portraitVX: 0,
    portraitVY: 0,
    nameX: 0,
    nameY: 0,
    nameVX: 0,
    nameVY: 0,
    last: 0,
    raf: 0,
    visible: true,
    reduced: false,
    pointerMotion: false,
    appliedX: 0,
    appliedY: 0,
  });

  useEffect(() => {
    lockRef.current = locked;
  }, [locked]);

  useEffect(() => {
    if (!locked) return;
    lockPageScroll();
    return () => unlockPageScroll();
  }, [locked]);

  useEffect(() => {
    const stage = stageRef.current;
    const fieldEl = fieldRef.current;
    const spillEl = spillRef.current;
    const nameEl = nameMotionRef.current;
    const portraitEl = portraitRef.current;
    if (!stage || !fieldEl || !spillEl || !nameEl || !portraitEl) return;

    const state = motion.current;
    state.reduced = prefersReducedMotion();
    state.pointerMotion = canUsePointerMotion();

    const apply = (
      px: number,
      py: number,
      nx: number,
      ny: number,
      hx: number,
      hy: number,
    ) => {
      state.appliedX = px;
      state.appliedY = py;
      const portraitShift = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0)`;
      portraitEl.style.transform = portraitShift;
      spillEl.style.transform = portraitShift;
      nameEl.style.transform = `translate3d(${nx.toFixed(2)}px, ${ny.toFixed(2)}px, 0)`;
      fieldEl.style.setProperty("--hero-hx", hx.toFixed(3));
      fieldEl.style.setProperty("--hero-hy", hy.toFixed(3));
    };

    const reset = () => {
      state.portraitX = 0;
      state.portraitY = 0;
      state.portraitVX = 0;
      state.portraitVY = 0;
      state.nameX = 0;
      state.nameY = 0;
      state.nameVX = 0;
      state.nameVY = 0;
      apply(0, 0, 0, 0, 0, 0);
    };

    const frame = (now: number) => {
      if (state.reduced || !state.visible) {
        state.raf = 0;
        reset();
        return;
      }

      const dt = Math.min(0.04, (now - state.last) / 1000 || 0.016);
      state.last = now;
      const t = now / 1000;

      const destX = state.inside && state.pointerMotion ? state.targetX : 0;
      const destY = state.inside && state.pointerMotion ? state.targetY : 0;

      const portraitX = springStep(
        state.portraitX,
        state.portraitVX,
        destX,
        PORTRAIT_OMEGA,
        dt,
      );
      const portraitY = springStep(
        state.portraitY,
        state.portraitVY,
        destY,
        PORTRAIT_OMEGA,
        dt,
      );
      const nameX = springStep(state.nameX, state.nameVX, destX, NAME_OMEGA, dt);
      const nameY = springStep(state.nameY, state.nameVY, destY, NAME_OMEGA, dt);
      state.portraitX = portraitX.pos;
      state.portraitVX = portraitX.vel;
      state.portraitY = portraitY.pos;
      state.portraitVY = portraitY.vel;
      state.nameX = nameX.pos;
      state.nameVX = nameX.vel;
      state.nameY = nameY.pos;
      state.nameVY = nameY.vel;

      const breath = Math.sin((t * Math.PI * 2) / BREATH_PERIOD) * BREATH_Y;
      const ambientX =
        Math.sin((t * Math.PI * 2) / NAME_AMBIENT_PERIOD) * NAME_AMBIENT_X;
      const ambientY =
        Math.cos((t * Math.PI * 2) / (NAME_AMBIENT_PERIOD * 1.15)) *
        NAME_AMBIENT_Y;

      const portraitLift = Math.min(
        OVERSCAN - 8,
        Math.max(-OVERSCAN + 8, state.portraitY * PORTRAIT_Y + breath),
      );

      apply(
        state.portraitX * PORTRAIT_X,
        portraitLift,
        state.nameX * NAME_PARALLAX_X + ambientX,
        state.nameY * NAME_PARALLAX_Y + ambientY,
        state.nameX,
        state.nameY,
      );

      state.raf = requestAnimationFrame(frame);
    };

    const startLoop = () => {
      if (state.raf || state.reduced || !state.visible) return;
      state.last = performance.now();
      state.raf = requestAnimationFrame(frame);
    };

    const stopLoop = () => {
      if (state.raf) cancelAnimationFrame(state.raf);
      state.raf = 0;
    };

    const setFromEvent = (event: PointerEvent) => {
      const bounds = stage.getBoundingClientRect();
      if (bounds.width < 1 || bounds.height < 1) return;
      const nxScreen = (event.clientX - bounds.left) / bounds.width;
      const nyScreen = (event.clientY - bounds.top) / bounds.height;
      state.targetX = Math.max(-1, Math.min(1, nxScreen * 2 - 1));
      state.targetY = Math.max(-1, Math.min(1, nyScreen * 2 - 1));
      const totalH = bounds.height + OVERSCAN;
      const nx = (event.clientX - (bounds.left + state.appliedX)) / bounds.width;
      const ny = 1 - (event.clientY - (bounds.top + state.appliedY)) / totalH;
      maskRef.current?.setPointer(
        Math.max(0, Math.min(1, nx)),
        Math.max(0, Math.min(1, ny)),
      );
      ambientRef.current?.setPointer(
        Math.max(0, Math.min(1, nxScreen)),
        Math.max(0, Math.min(1, nyScreen)),
        true,
      );
    };

    const onEnter = (event: PointerEvent) => {
      state.inside = true;
      setFromEvent(event);
      maskRef.current?.enter();
      startLoop();
    };

    const onMove = (event: PointerEvent) => {
      if (!state.inside) state.inside = true;
      setFromEvent(event);
      startLoop();
    };

    const onLeave = () => {
      state.inside = false;
      state.targetX = 0;
      state.targetY = 0;
      maskRef.current?.leave();
      ambientRef.current?.setPointer(0.5, 0.5, false);
      startLoop();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!lockRef.current) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest("[data-hero-lock-toggle]")
      ) {
        return;
      }
      event.preventDefault();
      stage.setPointerCapture(event.pointerId);
      state.inside = true;
      setFromEvent(event);
      maskRef.current?.enter();
      startLoop();
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!lockRef.current) return;
      if (stage.hasPointerCapture(event.pointerId)) {
        stage.releasePointerCapture(event.pointerId);
      }
      onLeave();
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!lockRef.current) return;
      event.preventDefault();
    };

    const onCapability = () => {
      state.reduced = prefersReducedMotion();
      state.pointerMotion = canUsePointerMotion();
      if (state.reduced) {
        stopLoop();
        reset();
        maskRef.current?.leave();
        ambientRef.current?.setPointer(0.5, 0.5, false);
        return;
      }
      startLoop();
    };

    stage.addEventListener("pointerenter", onEnter);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("pointercancel", onPointerUp);
    stage.addEventListener("touchmove", onTouchMove, { passive: false });

    const hoverQuery = window.matchMedia("(hover: hover)");
    const fineQuery = window.matchMedia("(pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    hoverQuery.addEventListener("change", onCapability);
    fineQuery.addEventListener("change", onCapability);
    motionQuery.addEventListener("change", onCapability);

    const intersection = new IntersectionObserver(
      ([entry]) => {
        state.visible = Boolean(entry?.isIntersecting);
        if (state.visible) startLoop();
        else stopLoop();
      },
      { root: null, rootMargin: "80px", threshold: 0.01 },
    );
    intersection.observe(stage);

    const onVisibility = () => {
      if (document.visibilityState === "hidden") stopLoop();
      else if (state.visible) startLoop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    startLoop();

    return () => {
      stopLoop();
      stage.removeEventListener("pointerenter", onEnter);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("pointercancel", onPointerUp);
      stage.removeEventListener("touchmove", onTouchMove);
      hoverQuery.removeEventListener("change", onCapability);
      fineQuery.removeEventListener("change", onCapability);
      motionQuery.removeEventListener("change", onCapability);
      intersection.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      data-hero-stage
      data-hero-locked={locked ? "true" : "false"}
      className={cn(
        "relative isolate h-full overflow-clip",
        locked && "touch-none",
      )}
    >
      <div ref={fieldRef} className="absolute inset-0 z-0 overflow-hidden bg-white">
        <canvas
          ref={spillRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 w-full"
          style={{ height: `calc(100% + ${OVERSCAN}px)` }}
        />
        <HeroAmbientField ref={ambientRef} />
      </div>

      {/*
        Figma 528:1231 — native 1606×147 name, centered; overflows the phone
        frame (only mid letters show). Do NOT scale with w-full on mobile.
        Desktop keeps the previous full-bleed band.
      */}
      <div
        className={cn(
          "pointer-events-none absolute z-1",
          "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "lg:inset-x-5 lg:top-[47.57%] lg:left-auto lg:right-auto lg:translate-x-0 lg:translate-y-0",
        )}
      >
        <div ref={nameMotionRef} className="will-change-transform">
          <Image
            src="/assets/ratul-saha-roy.svg"
            alt="Ratul Saha Roy"
            width={1606}
            height={147}
            className="h-[147px] w-[1606px] max-w-none origin-center lg:h-auto lg:w-full lg:max-w-full"
            priority
            unoptimized
          />
        </div>
      </div>

      {/*
        Figma 528:1218 — portrait band top 296/896 (~33%), height 600/896.
        Desktop stays full-stage with overscan for the scroll parallax.
      */}
      <div
        ref={portraitRef}
        className={cn(
          "pointer-events-none absolute inset-x-0 z-10 will-change-transform",
          // Match Suhan hero framing — assets already composed chest-up / recessed.
          "top-[22%] h-[78%]",
          "lg:top-12 lg:h-[calc(100%-3rem+28px)]",
        )}
      >
        <HoverMaskReveal
          ref={maskRef}
          frontImage="/assets/ratul-hero-v3.png"
          backImage="/assets/ratul-hero-mask-v3.png"
          alt="Portrait of Ratul Saha Roy"
          className="h-full w-full"
          capturePointer={false}
          spillCanvasRef={spillRef}
          forceInteractive={locked}
          size={0.1}
          strength={0.7}
          returnTime={1}
          edgeGrain={0.3}
          swirl={20}
          parallaxEnabled={false}
          parallaxAmount={0}
          smoothing={0}
        />
      </div>

      {/* Figma 535:1436 — left 230 / top 844 on 390×896 → ~10px from edges */}
      <button
        type="button"
        data-hero-lock-toggle
        className={cn(
          "absolute right-2.5 bottom-2.5 z-20 flex items-center gap-2.5 bg-[#f9f4eb] py-[3px] pr-[3px] pl-2.5 lg:hidden",
          "font-body text-base leading-6 tracking-[1.6px] text-[#1e1e1e]",
        )}
        aria-pressed={locked}
        aria-label={locked ? "Tap to unlock scroll" : "Tap to lock scroll"}
        onClick={() => {
          setLocked((prev) => {
            const next = !prev;
            if (!next) {
              maskRef.current?.leave();
              ambientRef.current?.setPointer(0.5, 0.5, false);
            }
            return next;
          });
        }}
      >
        <span>{locked ? "Tap to unlock" : "Tap to lock"}</span>
        <span className="flex size-9 items-center justify-center bg-[#1e1e1e]">
          <Image
            src="/assets/hand-tap.svg"
            alt=""
            width={24}
            height={24}
            className="size-6"
            unoptimized
          />
        </span>
      </button>
    </div>
  );
}
