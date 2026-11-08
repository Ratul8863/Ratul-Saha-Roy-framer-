"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { HeroFieldGL } from "@/lib/hero-field-gl";
import { cn } from "@/lib/utils";

export type HeroAmbientFieldHandle = {
  setPointer: (nx: number, ny: number, active: boolean) => void;
};

export const HeroAmbientField = forwardRef<HeroAmbientFieldHandle, { className?: string }>(
  function HeroAmbientField({ className }, ref) {
    const rootRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<HeroFieldGL | null>(null);

    useImperativeHandle(ref, () => ({
      setPointer: (nx, ny, active) => {
        engineRef.current?.setPointer(nx, ny, active);
      },
    }));

    useEffect(() => {
      const root = rootRef.current;
      const canvas = canvasRef.current;
      if (!root || !canvas) return;
      const engine = new HeroFieldGL(canvas, root);
      engineRef.current = engine;
      engine.start();
      return () => {
        engine.dispose();
        if (engineRef.current === engine) engineRef.current = null;
      };
    }, []);

    return (
      <div
        ref={rootRef}
        className={cn("pointer-events-none absolute inset-0 z-1", className)}
        aria-hidden="true"
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>
    );
  },
);
