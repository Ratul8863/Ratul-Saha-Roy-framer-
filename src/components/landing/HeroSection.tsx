/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Portavia-inspired hero: flanking display type + centered portrait card.
 */

"use client";

import Image from "next/image";

export function HeroSection() {
  return (
    <section
      aria-label="Hero — Ratul Saha Roy, Full Stack Web Developer"
      className="relative z-[1] flex min-h-svh w-full items-center justify-center overflow-x-clip bg-bg"
    >
      <h1 className="sr-only">
        Ratul Saha Roy — Full Stack Web Developer (MERN) | React, Node.js, MongoDB, Express, TypeScript Portfolio
      </h1>
      <div className="relative mx-auto hidden w-full max-w-[1200px] items-center justify-center gap-3 px-10 pt-28 pb-16 lg:flex xl:gap-6">
        <div className="flex min-w-0 flex-1 flex-col items-end justify-center pr-2 text-right">
          <p className="hero-enter-below hero-enter--badge mb-3 font-anon text-[13px] font-bold uppercase tracking-[0.22em] text-muted">
            Ratul Saha Roy
          </p>
          <span
            aria-hidden="true"
            className="hero-enter-above hero-enter--headline font-audiowide text-[clamp(3.5rem,6.5vw,5.75rem)] leading-[0.92] tracking-tight text-ink"
          >
            Full
            <br />
            Stack
          </span>
        </div>

        <div className="relative shrink-0">
          <div className="hero-object relative h-[420px] w-[280px] xl:h-[460px] xl:w-[300px]">
            <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-black shadow-[0_28px_60px_-20px_rgba(0,0,0,0.4),0_12px_24px_-12px_rgba(0,0,0,0.2)]">
              <Image
                src="/landing/hero-portrait-v3.png"
                alt="Ratul Saha Roy"
                fill
                priority
                fetchPriority="high"
                sizes="300px"
                className="object-cover object-top"
              />
            </div>
          </div>
          <div
            className="hero-enter-below hero-enter--cta absolute -bottom-1 -left-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent font-anon text-[15px] font-bold text-on-accent shadow-[0_10px_24px_-8px_rgba(200,255,0,0.45)] xl:h-16 xl:w-16 xl:text-[16px]"
            aria-hidden
          >
            Hi
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-start justify-center pl-2">
          <p className="hero-enter-above hero-enter--headline-2 font-audiowide text-[clamp(3.5rem,6.5vw,5.75rem)] leading-[0.92] tracking-tight text-ink">
            Developer
          </p>
          <p className="hero-enter-below hero-enter--copy mt-5 max-w-[280px] font-baumans text-[17px] leading-[1.55] text-muted xl:text-[18px]">
            A collection of projects where thoughtful design meets practical development.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center px-6 pb-20 pt-28 text-center lg:hidden">
        <p className="hero-enter-below hero-enter--badge font-anon text-[12px] font-bold uppercase tracking-[0.2em] text-muted">
          Ratul Saha Roy
        </p>
        <span
          aria-hidden="true"
          className="hero-enter-above hero-enter--headline mt-3 font-audiowide text-[clamp(2rem,10vw,3.5rem)] leading-[0.95] text-ink"
        >
          Full Stack
        </span>

        <div className="relative my-8">
          <div className="hero-object relative h-[min(320px,55vw)] w-[min(214px,56vw)] sm:h-[400px] sm:w-[260px]">
            <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-black shadow-[0_24px_50px_-18px_rgba(0,0,0,0.38)]">
              <Image
                src="/landing/hero-portrait-v3.png"
                alt="Ratul Saha Roy"
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 640px) 214px, 260px"
                className="object-cover object-top"
              />
            </div>
          </div>
          <div
            className="hero-enter-below hero-enter--cta absolute -bottom-1 left-0 flex h-12 w-12 items-center justify-center rounded-full bg-accent font-anon text-sm font-bold text-on-accent shadow-lg"
            aria-hidden
          >
            Hi
          </div>
        </div>

        <p className="hero-enter-above hero-enter--headline-2 font-audiowide text-[clamp(2rem,10vw,3.5rem)] leading-[0.95] text-ink">
          Developer
        </p>
        <p className="hero-enter-below hero-enter--copy mx-auto mt-5 max-w-[360px] font-baumans text-[17px] leading-[1.55] text-muted sm:text-[18px]">
          A collection of projects where thoughtful design meets practical development.
        </p>

        <a
          href="#contact"
          className="hero-enter-below hero-enter--stat-1 mt-10 inline-block rounded-full bg-accent px-6 py-3.5 font-anon text-[14px] font-bold text-on-accent transition-opacity hover:opacity-85"
        >
          Contact
        </a>
      </div>

      <div className="sr-only">
        <p>
          Ratul Saha Roy is a Junior Software Developer at Kode By Kraft and a CSE
          student at Metropolitan University, Sylhet, Bangladesh. Full Stack MERN
          developer (MongoDB, Express.js, React, Node.js, TypeScript, Tailwind CSS).
          Contact: ratulroy8863@gmail.com | +8801795908863
        </p>
      </div>
    </section>
  );
}
