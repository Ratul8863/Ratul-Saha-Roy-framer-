"use client";

/**
 * Originkit Spin Cursor (arrow) — site tip for the liquid cursor system.
 * Follow / stretch / click squash; rotation tracks movement direction.
 */

import { useEffect, useRef, type MutableRefObject } from "react";

const FOLLOW_TAU = 0.02;
const VELOCITY_TAU = 0.05;
const CLICK_EFFECT = true;

const ARROW = "M0,0 L18,11 L9,13 L6,21 Z";
const ARROW_W = 18;
const ARROW_H = 21;
const ARROW_REST = Math.atan2(-15, -12);

function angleDelta(from: number, to: number) {
  let d = (to - from) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}

export type SpinCursorArrowHandle = {
  setPointer: (x: number, y: number, inside: boolean) => void;
  setPressed: (down: boolean) => void;
  setVisible: (on: boolean) => void;
};

type SpinCursorArrowProps = {
  fillColor?: string;
  cursorSize?: number;
  enableStretch?: boolean;
  arrowRef?: MutableRefObject<SpinCursorArrowHandle | null>;
};

export function SpinCursorArrow({
  fillColor = "#f9f4eb",
  cursorSize = 36,
  enableStretch = true,
  arrowRef,
}: SpinCursorArrowProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const live = useRef({ cursorSize, enableStretch, fillColor });

  useEffect(() => {
    live.current = { cursorSize, enableStretch, fillColor };
  }, [cursorSize, enableStretch, fillColor]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let targetX = -9999;
    let targetY = -9999;
    let x = targetX;
    let y = targetY;
    let vx = 0;
    let vy = 0;
    let angle = 0;
    let pressed = 0;
    let down = false;
    let seen = false;
    let inside = false;
    let show = true;
    let raf = 0;
    let last = performance.now();

    const handle: SpinCursorArrowHandle = {
      setPointer(px, py, on) {
        if (!on) {
          inside = false;
          return;
        }
        targetX = px;
        targetY = py;
        if (!seen || !inside) {
          x = px;
          y = py;
          vx = 0;
          vy = 0;
          seen = true;
        }
        inside = true;
      },
      setPressed(next) {
        down = next;
      },
      setVisible(on) {
        show = on;
        if (!on) host.style.opacity = "0";
      },
    };
    if (arrowRef) arrowRef.current = handle;

    const frame = (now: number) => {
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      const p = live.current;

      const followEase = 1 - Math.exp(-dt / FOLLOW_TAU);
      const prevX = x;
      const prevY = y;
      x += (targetX - x) * followEase;
      y += (targetY - y) * followEase;

      if (dt > 0) {
        const vEase = 1 - Math.exp(-dt / VELOCITY_TAU);
        vx += ((x - prevX) / dt - vx) * vEase;
        vy += ((y - prevY) / dt - vy) * vEase;
      }

      const speed = Math.hypot(vx, vy);
      if (speed > 40) {
        const target = Math.atan2(vy, vx) - ARROW_REST;
        angle += angleDelta(angle, target) * (1 - Math.exp(-dt / 0.06));
      }

      const stretch = p.enableStretch ? 1 + Math.min(speed / 3000, 0.35) : 1;
      const squash = p.enableStretch ? 1 / Math.sqrt(stretch) : 1;
      const clickTarget = CLICK_EFFECT && down ? 1 : 0;
      pressed += (clickTarget - pressed) * (1 - Math.exp(-dt / 0.05));
      const press = 1 - pressed * 0.2;
      const s = (p.cursorSize / ARROW_H) * press;

      host.style.opacity = show && seen && inside ? "1" : "0";
      host.style.transform =
        `translate3d(${x}px, ${y}px, 0) ` +
        `rotate(${angle}rad) ` +
        `scale(${s * squash}, ${s * stretch})`;

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      if (arrowRef) arrowRef.current = null;
    };
  }, [arrowRef]);

  return (
    <div
      ref={hostRef}
      data-site-spin-cursor
      className="pointer-events-none fixed top-0 left-0 z-90 opacity-0"
      style={{
        transformOrigin: "0 0",
        willChange: "transform",
        // Solid tip — no difference blend, so it doesn't "eat" the liquid blob
      }}
      aria-hidden
    >
      <svg
        width={ARROW_W}
        height={ARROW_H}
        viewBox={`0 0 ${ARROW_W} ${ARROW_H}`}
        className="block overflow-visible"
        aria-hidden
      >
        <path
          d={ARROW}
          fill={fillColor}
          stroke="rgba(0,0,0,0.2)"
          strokeWidth={0.6}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
