"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  MOTION_MODE_EVENT,
  readFullMotion,
} from "@/lib/motion-mode";

const PERSPECTIVE = 800;
const INTENSITY = 0.35;
const DAMP = 0.12;
const DEPTH = 140;
const ROTATE = 18;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Same pointer tilt as the feature-project cards: follow the cursor, then settle back. */
export function FooterWordmark() {
  const boxRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const mark = markRef.current;
    if (!box || !mark) return;

    const pointer = { nx: 0, ny: 0, tx: 0, ty: 0 };
    let raf = 0;
    let running = false;
    let inside = false;
    let visible = true;
    let reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let fine = window.matchMedia("(any-pointer: fine)").matches;
    let fullMotion = readFullMotion();

    const canMove = () => fine && !reduced && fullMotion && visible;

    const apply = () => {
      pointer.tx += (pointer.nx - pointer.tx) * DAMP;
      pointer.ty += (pointer.ny - pointer.ty) * DAMP;

      const dx = -pointer.tx * DEPTH * INTENSITY;
      const dy = -pointer.ty * DEPTH * INTENSITY;
      const ry = pointer.tx * ROTATE * INTENSITY;
      const rx = pointer.ty * -ROTATE * INTENSITY;
      mark.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg)`;

      if (
        Math.abs(pointer.nx - pointer.tx) > 0.001 ||
        Math.abs(pointer.ny - pointer.ty) > 0.001
      ) {
        raf = requestAnimationFrame(apply);
      } else {
        raf = 0;
        running = false;
      }
    };

    const start = () => {
      if (running || !canMove()) return;
      running = true;
      raf = requestAnimationFrame(apply);
    };

    const reset = () => {
      pointer.nx = 0;
      pointer.ny = 0;
      if (!canMove()) {
        pointer.tx = 0;
        pointer.ty = 0;
        mark.style.transform = "translate3d(0,0,0)";
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        running = false;
        return;
      }
      start();
    };

    const onMove = (event: PointerEvent) => {
      if (!canMove()) return;
      const rect = box.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      inside = true;
      pointer.nx = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
      pointer.ny = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
      start();
    };

    const onLeave = () => {
      inside = false;
      pointer.nx = 0;
      pointer.ny = 0;
      start();
    };

    const onMotion = () => {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      fine = window.matchMedia("(any-pointer: fine)").matches;
      if (!inside) {
        pointer.nx = 0;
        pointer.ny = 0;
      }
      reset();
    };

    const onMode = () => {
      fullMotion = readFullMotion();
      onMotion();
    };

    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerleave", onLeave);
    window.addEventListener(MOTION_MODE_EVENT, onMode);
    window.addEventListener("resize", onMotion);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionQuery.addEventListener("change", onMotion);

    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        if (!visible) reset();
      },
      { threshold: 0.05 },
    );
    intersection.observe(box);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerleave", onLeave);
      window.removeEventListener(MOTION_MODE_EVENT, onMode);
      window.removeEventListener("resize", onMotion);
      motionQuery.removeEventListener("change", onMotion);
      intersection.disconnect();
    };
  }, []);

  return (
    <div
      ref={boxRef}
      className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8 sm:py-10 md:px-[50px] md:py-11"
      style={{ perspective: `${PERSPECTIVE}px` }}
    >
      <div ref={markRef} className="w-full max-w-[775px] will-change-transform">
        <Image
          src="/assets/footer-ratul.svg"
          alt="RATUL"
          width={775}
          height={332}
          className="h-auto w-full"
          priority={false}
        />
      </div>
    </div>
  );
}
