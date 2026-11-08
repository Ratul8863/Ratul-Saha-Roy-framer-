/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * What Can I Do — scroll-driven sticky stacking panels (reference interaction).
 * CSS sticky + document scroll + z-index occlusion — no accordion, no GSAP pin.
 */

"use client";

import Image from "next/image";
import { SKILLS } from "./landingData";

/** Sticky offset — pins panels just below the floating LandingHeader pill */
const STICKY_TOP =
  "max(5.25rem, calc(env(safe-area-inset-top, 0px) + 4.5rem))";

/** Full-height panels so the next slide fully covers image + text */
const PANEL_MIN_HEIGHT =
  "calc(100dvh - max(5.25rem, calc(env(safe-area-inset-top, 0px) + 4.5rem)))";

const PANEL_SURFACES = ["bg-bg", "bg-surface", "bg-card"] as const;

/** Desktop image frame — 3:2 matches generated service art (1536×1024) */
const DESKTOP_IMAGE_CLASS =
  "relative aspect-[3/2] w-full max-w-[520px] shrink-0 overflow-hidden rounded-lg bg-surface shadow-[10px_10px_10px_0px_rgba(31,29,29,0.2)]";
const IMAGE_CLASS = "object-cover object-center";

function ServicePanel({
  skill,
  index,
  variant,
}: {
  skill: (typeof SKILLS)[number];
  index: number;
  variant: "desktop" | "mobile";
}) {
  const surface = PANEL_SURFACES[index % PANEL_SURFACES.length] ?? "bg-bg";

  if (variant === "desktop") {
    return (
      <article
        className={`sticky isolate ${surface} ${
          index < SKILLS.length - 1 ? "-mb-[12dvh]" : ""
        }`}
        style={{
          top: STICKY_TOP,
          zIndex: index + 1,
          minHeight: index === SKILLS.length - 1 ? "auto" : PANEL_MIN_HEIGHT,
        }}
      >
        <div
          className="pointer-events-none absolute right-[111px] top-8 flex items-center gap-2"
          aria-hidden
        >
          <span className="font-anon text-[11px] font-bold tracking-[0.16em] text-muted">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-1.5">
            {SKILLS.map((item, dotIndex) => (
              <span
                key={item.name}
                className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                  dotIndex === index ? "w-7 bg-accent" : "w-1.5 bg-ink/20"
                }`}
              />
            ))}
          </div>
          <span className="font-anon text-[11px] font-bold tracking-[0.16em] text-muted">
            {String(SKILLS.length).padStart(2, "0")}
          </span>
        </div>

        <div className="mx-auto grid min-h-[inherit] max-w-[1440px] grid-cols-[minmax(0,1fr)_minmax(320px,520px)] content-start items-start gap-x-12 px-[111px] pb-14 pt-[clamp(5.5rem,12vh,7.5rem)]">
          <div className="flex min-w-0 flex-col gap-4 pr-6">
            <h3 className="font-baumans text-[24px] leading-[36px] text-ink">
              {String(index + 1).padStart(2, "0")}. {skill.name}
            </h3>
            <p className="max-w-[620px] font-baumans text-[20px] leading-[36px] text-justify text-ink">
              {skill.description}
            </p>
          </div>
          <div className={DESKTOP_IMAGE_CLASS}>
            <Image
              src={skill.image}
              alt={skill.name}
              fill
              sizes="520px"
              className={IMAGE_CLASS}
            />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`sticky isolate ${surface}`}
      style={{
        top: STICKY_TOP,
        zIndex: index + 1,
        minHeight: PANEL_MIN_HEIGHT,
      }}
    >
      <div className="flex min-h-[inherit] flex-col justify-start gap-5 px-6 py-8 sm:gap-6 sm:px-10">
        <h3 className="font-baumans text-[20px] leading-[1.3] text-ink sm:text-[22px]">
          {String(index + 1).padStart(2, "0")}. {skill.name}
        </h3>
        <p className="font-baumans text-[16px] leading-[1.55] text-ink sm:text-[18px]">
          {skill.description}
        </p>
        <div className="relative aspect-[3/2] w-full shrink-0 overflow-hidden rounded-lg bg-surface shadow-[10px_10px_10px_0px_rgba(31,29,29,0.2)]">
          <Image
            src={skill.image}
            alt={skill.name}
            fill
            sizes="(max-width: 640px) 100vw, 520px"
            className={IMAGE_CLASS}
          />
        </div>
      </div>
    </article>
  );
}

export function WhatCanIDoSection() {
  return (
    <section
      id="services"
      className="relative isolate z-[1] scroll-mt-24 bg-bg"
      style={{ ["--services-sticky-top" as string]: STICKY_TOP }}
    >
      {/* Side guides — desktop */}
      <div
        className="pointer-events-none absolute inset-y-0 left-[80px] hidden w-px bg-ink/10 lg:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-[80px] hidden w-px bg-ink/10 lg:block"
        aria-hidden
      />

      {/* Section intro — scrolls away before sticky panels pin */}
      <div className="relative mx-auto max-w-[1440px] px-6 pb-10 pt-16 sm:px-10 sm:pb-12 sm:pt-20 lg:px-[111px] lg:pb-14 lg:pt-24">
        <div className="flex max-w-[689px] flex-col gap-4 text-ink">
          <p className="font-anon text-[12px] font-bold uppercase tracking-[0.22em] text-accent">
            Capabilities
          </p>
          <h2 className="font-audiowide text-[32px] leading-[1.2] sm:text-[40px] lg:text-[48px] lg:leading-[72px]">
            WHAT I DO
          </h2>
          <p className="font-baumans text-[18px] leading-[1.55] text-muted sm:text-[20px] lg:text-[24px] lg:leading-[36px]">
            I work across software development, artificial intelligence, and
            data-driven research—turning ideas into practical systems,
            intelligent solutions, and production-ready applications.
          </p>
        </div>
      </div>

      {/* Sticky stack — each panel pins; the next scrolls over it */}
      <div className="services-stack relative">
        <div className="hidden lg:block">
          {SKILLS.map((skill, i) => (
            <ServicePanel key={skill.name} skill={skill} index={i} variant="desktop" />
          ))}
        </div>
        <div className="lg:hidden">
          {SKILLS.map((skill, i) => (
            <ServicePanel key={skill.name} skill={skill} index={i} variant="mobile" />
          ))}
        </div>
      </div>
    </section>
  );
}
