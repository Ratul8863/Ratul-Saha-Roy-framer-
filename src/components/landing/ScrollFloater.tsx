/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Lightweight scroll floater — About → What Can I Do.
 * One <img> only (no dual-face 3D card). Fake flip via scaleX + src swap.
 */

"use client";

import { useLayoutEffect, useRef, useState } from "react";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function bezier2(a: number, b: number, c: number, t: number) {
  const u = 1 - t;
  return u * u * a + 2 * u * t * c + t * t * b;
}

function visibleSlot(name: string): HTMLElement | null {
  const nodes = document.querySelectorAll<HTMLElement>(
    `[data-float-slot="${name}"]`
  );
  for (const el of nodes) {
    const r = el.getBoundingClientRect();
    if (r.width > 1 && r.height > 1) return el;
  }
  return null;
}

const DISABLE_MQ = "(max-width: 1023px), (prefers-reduced-motion: reduce)";
const SLOTS = ["about", "services"] as const;

const ABOUT_SRC = "/landing/hero-portrait-v3.png";
const SERVICES_SRC = "/service-02.png";

const ABOUT_LEAN_Z = 0;
const SERVICES_LEAN_Z = 0;

export function ScrollFloater() {
  const floaterRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const showingServices = useRef(false);
  const [mode, setMode] = useState<"pending" | "scroll" | "static">("pending");

  useLayoutEffect(() => {
    const mq = window.matchMedia(DISABLE_MQ);
    const apply = () => setMode(mq.matches ? "static" : "scroll");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useLayoutEffect(() => {
    if (mode === "scroll") {
      document.documentElement.setAttribute("data-scroll-floater", "active");
    } else if (mode === "static") {
      document.documentElement.removeAttribute("data-scroll-floater");
    }
    return () => {
      document.documentElement.removeAttribute("data-scroll-floater");
    };
  }, [mode]);

  useLayoutEffect(() => {
    if (mode !== "scroll") return;
    const floater = floaterRef.current;
    const img = imgRef.current;
    if (!floater || !img) return;

    // Preload second face so swap is instant (still only one drawn)
    const preload = new window.Image();
    preload.src = SERVICES_SRC;

    let raf = 0;
    let baseW = 1;
    let running = true;
    let lastKey = "";

    const syncBaseSize = () => {
      const el = visibleSlot(SLOTS[0]);
      if (!el) return;
      const r = el.getBoundingClientRect();
      baseW = r.width || 1;
      floater.style.width = `${baseW}px`;
      floater.style.height = `${r.height}px`;
    };

    const setFace = (services: boolean) => {
      const slot = visibleSlot("services");
      const servicesSrc =
        slot?.getAttribute("data-float-image") || SERVICES_SRC;
      const next = services ? servicesSrc : ABOUT_SRC;
      const current = img.getAttribute("data-face-src");
      if (current === next) return;
      img.setAttribute("data-face-src", next);
      img.src = next;
      showingServices.current = services;
      img.classList.toggle("object-top", !services);
    };

    const place = (
      left: number,
      top: number,
      width: number,
      leanZ: number,
      flipT: number,
      lift: number,
      moving: boolean
    ) => {
      const scale = (width / Math.max(1, baseW)) * (1 + lift * 0.12);
      const squeeze = Math.max(0.04, Math.abs(Math.cos(flipT * Math.PI)));
      setFace(flipT >= 0.5);

      const key = `${left | 0},${top | 0},${(scale * 100) | 0},${(squeeze * 100) | 0},${leanZ | 0},${moving ? 1 : 0},${img.getAttribute("data-face-src") ?? ""}`;
      if (key === lastKey) return;
      lastKey = key;

      floater.style.transform =
        `translate3d(${left}px, ${top}px, 0) scale(${scale}) ` +
        `rotate(${leanZ}deg) scaleX(${squeeze})`;
      floater.style.zIndex = moving ? "40" : "5";
      floater.style.boxShadow = moving
        ? `0 ${10 + lift * 16}px ${20 + lift * 24}px rgba(0,0,0,${0.12 + lift * 0.12})`
        : "0 8px 20px rgba(0,0,0,0.1)";
    };

    const tick = () => {
      if (!running) return;

      const slotEls = SLOTS.map((name) => visibleSlot(name));
      if (slotEls.some((el) => !el)) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const rects = slotEls.map((el) => el!.getBoundingClientRect());
      const y = window.scrollY;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const docTops = rects.map((r) => r.top + y);

      const start = docTops[0] - vh * 0.06;
      const end = docTops[1] - vh * 0.2;

      if (y <= start) {
        const r = rects[0];
        place(r.left, r.top, r.width, ABOUT_LEAN_Z, 0, 0, false);
      } else if (y >= end) {
        const r = rects[1];
        place(r.left, r.top, r.width, SERVICES_LEAN_Z, 1, 0, false);
      } else {
        const raw = clamp01((y - start) / Math.max(1, end - start));
        const t = easeInOutCubic(raw);
        const from = rects[0];
        const to = rects[1];
        const apex = Math.sin(raw * Math.PI);

        const ctrlX =
          (from.left + to.left) / 2 +
          (vw * 0.5 - (from.left + to.left + from.width) / 2) * 0.28;
        const ctrlY = Math.min(from.top, to.top) - vh * 0.12;

        place(
          bezier2(from.left, to.left, ctrlX, t),
          bezier2(from.top, to.top, ctrlY, t),
          lerp(from.width, to.width, t),
          lerp(ABOUT_LEAN_Z, SERVICES_LEAN_Z, t) + apex * 2,
          easeInOutCubic(raw),
          apex,
          true
        );
      }

      raf = requestAnimationFrame(tick);
    };

    floater.style.position = "fixed";
    floater.style.top = "0";
    floater.style.left = "0";
    floater.style.margin = "0";
    floater.style.transformOrigin = "top left";
    floater.style.pointerEvents = "none";
    floater.style.willChange = "transform";
    floater.style.borderRadius = "8px";
    floater.style.overflow = "hidden";
    floater.style.backfaceVisibility = "hidden";

    syncBaseSize();
    setFace(false);
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", syncBaseSize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", syncBaseSize);
    };
  }, [mode]);

  if (mode !== "scroll") return null;

  return (
    <div ref={floaterRef} className="scroll-floater" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={ABOUT_SRC}
        alt=""
        className="size-full object-cover object-top"
        decoding="async"
        fetchPriority="high"
        draggable={false}
      />
    </div>
  );
}
