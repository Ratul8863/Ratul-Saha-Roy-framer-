"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ProjectsLiquidCursor } from "@/lib/projects-liquid-cursor";
import {
  SpinCursorArrow,
  type SpinCursorArrowHandle,
} from "@/components/layout/spin-cursor-arrow";

const subscribeNoop = () => () => {};
const getClientTrue = () => true;
const getServerFalse = () => false;

function canUseCustomCursor() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(min-width: 1024px)").matches &&
    window.matchMedia("(any-pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Liquid trail off over CTAs / buttons / exclusive cursors. */
function shouldHideLiquid(under: Element | null) {
  if (!(under instanceof Element)) return false;
  return Boolean(
    under.closest(
      [
        "button",
        "[role='button']",
        "input[type='submit']",
        "input[type='button']",
        "label[for]",
        "[data-project-hit]",
        "[data-liquid-cursor-hide]",
      ].join(","),
    ),
  );
}

/**
 * Arrow stays except where another custom cursor owns the pointer
 * (Feature Projects VIEW PROJECT / All Projects Website ball).
 */
function shouldHideArrow(under: Element | null) {
  if (!(under instanceof Element)) return false;
  return Boolean(
    under.closest(
      "[data-project-hit], .all-projects__list, .all-projects.is-cursor-active",
    ),
  );
}

/**
 * Site cursor: Originkit spin arrow + Kala liquid trail.
 * - Liquid runs with the arrow on open canvas
 * - On buttons: liquid off, arrow still on
 * - Exclusive hit zones: both off (native / section cursor)
 */
export function SiteLiquidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arrowRef = useRef<SpinCursorArrowHandle | null>(null);
  const ready = useSyncExternalStore(
    subscribeNoop,
    getClientTrue,
    getServerFalse,
  );

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const liquid = new ProjectsLiquidCursor(canvas);
    let enabled = false;
    let resizeTimer = 0;
    let hideStyle: HTMLStyleElement | null = null;

    // Force-hide OS pointer on every element (inputs/buttons set cursor:text/pointer).
    const setNativeHidden = (hide: boolean) => {
      if (hide) {
        if (!hideStyle) {
          hideStyle = document.createElement("style");
          hideStyle.setAttribute("data-rsr-hide-cursor", "");
          hideStyle.textContent =
            "html.rsr-spin-cursor, html.rsr-spin-cursor * { cursor: none !important; }";
          document.head.appendChild(hideStyle);
        }
        document.documentElement.classList.add("rsr-spin-cursor");
      } else {
        document.documentElement.classList.remove("rsr-spin-cursor");
        hideStyle?.remove();
        hideStyle = null;
      }
    };

    const syncEnabled = () => {
      enabled = canUseCustomCursor();
      if (enabled) {
        liquid.resize();
        liquid.start();
        setNativeHidden(true);
        canvas.classList.remove("hidden");
      } else {
        liquid.setPointer(0, 0, false);
        liquid.stop();
        setNativeHidden(false);
        arrowRef.current?.setVisible(false);
        canvas.classList.add("hidden");
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!enabled) return;
      const under = document.elementFromPoint(event.clientX, event.clientY);
      const hideLiquid = shouldHideLiquid(under);
      const hideArrow = shouldHideArrow(under);

      arrowRef.current?.setPointer(event.clientX, event.clientY, true);
      arrowRef.current?.setVisible(!hideArrow);
      // OS pointer stays hidden everywhere while spin cursor mode is on
      // (exclusive zones still use cursor:none for their own ball).

      liquid.setOverHit(hideLiquid || hideArrow);
      liquid.setPointer(event.clientX, event.clientY, true);
    };

    const onPointerLeave = () => {
      liquid.setPointer(0, 0, false);
      arrowRef.current?.setPointer(0, 0, false);
      arrowRef.current?.setVisible(false);
    };

    const onPointerEnter = (event: MouseEvent) => {
      if (!enabled) return;
      const under = document.elementFromPoint(event.clientX, event.clientY);
      const hideLiquid = shouldHideLiquid(under);
      const hideArrow = shouldHideArrow(under);
      arrowRef.current?.setPointer(event.clientX, event.clientY, true);
      arrowRef.current?.setVisible(!hideArrow);
      liquid.setOverHit(hideLiquid || hideArrow);
      liquid.setPointer(event.clientX, event.clientY, true);
    };

    const onDown = () => arrowRef.current?.setPressed(true);
    const onUp = () => arrowRef.current?.setPressed(false);

    const onBlur = () => {
      liquid.setPointer(0, 0, false);
      arrowRef.current?.setPointer(0, 0, false);
      arrowRef.current?.setVisible(false);
      arrowRef.current?.setPressed(false);
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        syncEnabled();
        if (enabled) liquid.resize();
      }, 140);
    };

    syncEnabled();

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onPointerLeave);
    document.documentElement.addEventListener("mouseenter", onPointerEnter);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("blur", onBlur);
    window.addEventListener("resize", onResize);

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fineMq = window.matchMedia("(any-pointer: fine)");
    const widthMq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => syncEnabled();
    reduceMq.addEventListener("change", onMq);
    fineMq.addEventListener("change", onMq);
    widthMq.addEventListener("change", onMq);

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", onPointerLeave);
      document.documentElement.removeEventListener("mouseenter", onPointerEnter);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("resize", onResize);
      reduceMq.removeEventListener("change", onMq);
      fineMq.removeEventListener("change", onMq);
      widthMq.removeEventListener("change", onMq);
      setNativeHidden(false);
      liquid.dispose();
    };
  }, [ready]);

  if (!ready) return null;

  return createPortal(
    <>
      <canvas
        ref={canvasRef}
        data-site-liquid-cursor
        className="pointer-events-none fixed inset-0 z-89 hidden lg:block"
        style={{ mixBlendMode: "difference" }}
        aria-hidden="true"
      />
      <SpinCursorArrow
        arrowRef={arrowRef}
        fillColor="#f9f4eb"
        cursorSize={34}
        enableStretch
      />
    </>,
    document.body,
  );
}
