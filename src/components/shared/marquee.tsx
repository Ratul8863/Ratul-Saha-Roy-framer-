"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: readonly string[];
  className?: string;
  speed?: number;
}

export function Marquee({ items, className, speed = 40 }: MarqueeProps) {
  const reduceMotion = useReducedMotion();
  const sequence = [...items, ...items];

  return (
    <div
      className={cn("relative overflow-hidden bg-white", className)}
      aria-label="Skills marquee"
    >
      <div className="overflow-hidden py-2.5">
        <motion.div
          className="flex w-max items-center gap-10 whitespace-nowrap"
          animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: speed, ease: "linear", repeat: Infinity }
          }
        >
          {sequence.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex items-center gap-10 font-display text-[clamp(2.5rem,10vw,9.375rem)] uppercase leading-[1.2] text-navy"
            >
              {item}
              <span className="relative inline-block size-8 shrink-0 md:size-10">
                <Image
                  src="/assets/star.svg"
                  alt=""
                  fill
                  className="object-contain"
                  sizes="40px"
                />
              </span>
            </span>
          ))}
        </motion.div>
      </div>
      <div className="h-0.5 w-full bg-navy" aria-hidden />
    </div>
  );
}
