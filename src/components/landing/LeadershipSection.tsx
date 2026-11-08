/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Two-column editorial roles + problem-solving note — no card chrome.
 */

"use client";

import { motion, useReducedMotion } from "motion/react";
import { LEADERSHIP_ITEMS } from "./landingData";

const ease = [0.22, 1, 0.36, 1] as const;

export function LeadershipSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="leadership"
      className="relative scroll-mt-24 overflow-hidden bg-surface py-16 sm:py-20 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-[80px] hidden w-px bg-ink/10 lg:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-[80px] hidden w-px bg-ink/10 lg:block"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-[111px]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease }}
        >
          <p className="font-anon text-[12px] font-bold uppercase tracking-[0.22em] text-accent">
            Roles &amp; ownership
          </p>
          <h2 className="mt-3 font-audiowide text-[32px] leading-[1.2] text-ink sm:text-[40px] lg:text-[48px] lg:leading-[72px]">
            LEADERSHIP &amp; COMMUNITY
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-x-12 gap-y-0 sm:mt-12 lg:mt-14 lg:grid-cols-2 lg:gap-x-16">
          {LEADERSHIP_ITEMS.map((item, i) => (
            <motion.article
              key={`${item.role}-${item.org}`}
              className="group relative border-t border-ink/10 py-8 sm:py-9"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.45,
                delay: reduceMotion ? 0 : i * 0.05,
                ease,
              }}
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="font-anon text-[12px] font-bold tabular-nums text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-ink/10 transition-colors duration-300 group-hover:bg-accent/40" />
              </div>
              <p className="font-anon text-[12px] font-bold uppercase tracking-[0.18em] text-accent">
                {item.role}
              </p>
              <h3 className="mt-2 font-baumans text-[22px] leading-[1.3] text-ink transition-colors duration-300 group-hover:text-accent sm:text-[24px]">
                {item.org}
              </h3>
              <p className="mt-2 max-w-[420px] font-baumans text-[16px] leading-[1.55] text-muted sm:text-[17px]">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="mt-6 flex flex-col gap-6 border-t border-ink/10 pt-10 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:pt-12"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease }}
        >
          <div className="max-w-[560px]">
            <p className="font-anon text-[12px] font-bold uppercase tracking-[0.2em] text-muted">
              Problem solving
            </p>
            <h3 className="mt-2 font-audiowide text-[22px] leading-[1.3] text-ink sm:text-[28px]">
              Competitive Programming
            </h3>
            <p className="mt-3 font-baumans text-[17px] leading-[1.55] text-muted sm:text-[18px]">
              Practice with{" "}
              <span className="font-semibold text-ink">C and C++</span> — Data
              Structures, Algorithms, and computational problem solving.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-ink px-5 py-3 font-anon text-[13px] font-bold uppercase tracking-[0.14em] text-bg sm:self-center">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            Codeforces
          </span>
        </motion.div>
      </div>
    </section>
  );
}
