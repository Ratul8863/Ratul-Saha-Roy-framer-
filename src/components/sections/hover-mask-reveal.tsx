"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type RefObject } from "react";
import { cn } from "@/lib/utils";
import {
  HoverMaskFluid,
  type HoverMaskFluidConfig,
} from "@/lib/hover-mask-fluid";

export interface HoverMaskRevealProps {
  /** Default portrait shown underneath the mask. */
  frontImage: string;
  /** Alternate portrait revealed through the liquid density mask. */
  backImage: string;
  /**
   * UV splat radius of the liquid blob (0.02–0.2).
   * Larger values uncover more of the back image at once.
   */
  size?: number;
  /**
   * Reveal intensity (0.2–1). Mapped internally to shader boost.
   */
  strength?: number;
  /**
   * Seconds for density to fade to ~1% after pointer leave (0.5–10).
   */
  returnTime?: number;
  /**
   * Simplex-noise amplitude on the mask boundary (0–1).
   */
  edgeGrain?: number;
  /**
   * Vorticity confinement strength (0–100). Higher values curl the fluid.
   */
  swirl?: number;
  /** When true, the revealed image shifts opposite the pointer. */
  parallaxEnabled?: boolean;
  /** Maximum parallax offset in CSS pixels (0–200). */
  parallaxAmount?: number;
  /**
   * Pointer / parallax follow damping (0–1). 0 snaps like the inspected
   * Framer component; 1 is a slow ease.
   */
  smoothing?: number;
  className?: string;
  alt?: string;
  /**
   * When false, the parent owns pointer tracking and should call the
   * imperative handle. Keeps mask UVs on a stable, untransformed box.
   */
  capturePointer?: boolean;
  /** Receives the same fluid circle, placed behind the portrait. */
  spillCanvasRef?: RefObject<HTMLCanvasElement | null>;
  /**
   * Force the WebGL mask on (mobile tap-to-lock) even without a fine pointer.
   */
  forceInteractive?: boolean;
}

export type HoverMaskRevealHandle = {
  enter: () => void;
  leave: () => void;
  setPointer: (nx: number, ny: number) => void;
};

const DEFAULTS: HoverMaskFluidConfig = {
  size: 0.1,
  strength: 0.7,
  returnTime: 1,
  edgeGrain: 0.3,
  swirl: 20,
  parallaxEnabled: false,
  parallaxAmount: 100,
  smoothing: 0,
};

function readConfig(
  props: Partial<HoverMaskFluidConfig>,
): HoverMaskFluidConfig {
  return {
    size: props.size ?? DEFAULTS.size,
    strength: props.strength ?? DEFAULTS.strength,
    returnTime: props.returnTime ?? DEFAULTS.returnTime,
    edgeGrain: props.edgeGrain ?? DEFAULTS.edgeGrain,
    swirl: props.swirl ?? DEFAULTS.swirl,
    parallaxEnabled: props.parallaxEnabled ?? DEFAULTS.parallaxEnabled,
    parallaxAmount: props.parallaxAmount ?? DEFAULTS.parallaxAmount,
    smoothing: props.smoothing ?? DEFAULTS.smoothing,
  };
}

function canUseHover() {
  if (typeof window === "undefined") return false;
  const hover = window.matchMedia("(hover: hover)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return hover && fine && !reduced;
}

function canUseTouchMask() {
  if (typeof window === "undefined") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const HoverMaskReveal = forwardRef<HoverMaskRevealHandle, HoverMaskRevealProps>(
  function HoverMaskReveal(
    {
      frontImage,
      backImage,
      className,
      alt = "",
      capturePointer = true,
      spillCanvasRef,
      forceInteractive = false,
      ...rest
    },
    ref,
  ) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<HoverMaskFluid | null>(null);
  const configRef = useRef(readConfig(rest));
  const pendingEnterRef = useRef(false);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const [interactive, setInteractive] = useState(false);

  configRef.current = readConfig(rest);

  useImperativeHandle(ref, () => ({
    enter: () => {
      pendingEnterRef.current = true;
      engineRef.current?.enter();
    },
    leave: () => {
      pendingEnterRef.current = false;
      engineRef.current?.leave();
    },
    setPointer: (nx: number, ny: number) => {
      lastPointerRef.current = { x: nx, y: ny };
      engineRef.current?.setPointer(nx, ny);
    },
  }));

  useEffect(() => {
    const syncCapability = () =>
      setInteractive(canUseHover() || (forceInteractive && canUseTouchMask()));
    syncCapability();

    const hoverQuery = window.matchMedia("(hover: hover)");
    const fineQuery = window.matchMedia("(pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    hoverQuery.addEventListener("change", syncCapability);
    fineQuery.addEventListener("change", syncCapability);
    motionQuery.addEventListener("change", syncCapability);
    window.addEventListener("resize", syncCapability);

    return () => {
      hoverQuery.removeEventListener("change", syncCapability);
      fineQuery.removeEventListener("change", syncCapability);
      motionQuery.removeEventListener("change", syncCapability);
      window.removeEventListener("resize", syncCapability);
    };
  }, [forceInteractive]);

  useEffect(() => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    const container = rootRef.current;
    if (!canvas || !container) return;

    let cancelled = false;
    const engine = new HoverMaskFluid(canvas, container, backImage, configRef.current);
    engineRef.current = engine;

    void engine.start().then((ok) => {
      if (cancelled || !ok) {
        engine.dispose();
        if (engineRef.current === engine) engineRef.current = null;
        return;
      }
      if (pendingEnterRef.current) engine.enter();
      engine.attachSpill(spillCanvasRef?.current ?? null);
      const pointer = lastPointerRef.current;
      if (pointer) engine.setPointer(pointer.x, pointer.y);
    });

    return () => {
      cancelled = true;
      engine.dispose();
      if (engineRef.current === engine) engineRef.current = null;
    };
  }, [backImage, interactive, spillCanvasRef]);

  useEffect(() => {
    engineRef.current?.setConfig(configRef.current);
  });

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const engine = engineRef.current;
    const container = rootRef.current;
    if (!engine || !container) return;
    const bounds = container.getBoundingClientRect();
    if (bounds.width < 1 || bounds.height < 1) return;
    const nx = (event.clientX - bounds.left) / bounds.width;
    const ny = 1 - (event.clientY - bounds.top) / bounds.height;
    engine.setPointer(nx, ny);
  };

  return (
    <div
      ref={rootRef}
      className={cn("relative h-full w-full", className)}
      onPointerEnter={capturePointer ? () => engineRef.current?.enter() : undefined}
      onPointerMove={capturePointer ? onPointerMove : undefined}
      onPointerLeave={capturePointer ? () => engineRef.current?.leave() : undefined}
    >
      <img
        src={frontImage}
        alt={alt}
        width={3292}
        height={1854}
        fetchPriority="high"
        className={cn(
          "pointer-events-none absolute inset-0 block h-full w-full max-w-none object-cover",
          // Mobile: bottom-weighted band. Desktop: lock the crown — short
          // viewports + object-bottom was slicing the head off.
          "object-bottom lg:object-[center_top]",
        )}
        draggable={false}
      />
      {interactive ? (
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-1 h-full w-full"
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
  },
);
