/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ComponentType } from "react";
import { Facebook, Instagram, Linkedin, Github, ArrowDownRight } from "lucide-react";
import { SOCIAL_LINKS } from "./landingData";

const SOCIAL_ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
};

export function ContactSection() {
  return (
    <section id="contact" className="relative overflow-hidden bg-surface py-16 sm:py-20 lg:py-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/landing/contact-bg.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 dark:opacity-15 dark:invert dark:hue-rotate-180"
      />

      <div
        className="pointer-events-none absolute inset-y-0 left-[79px] hidden w-px bg-ink/10 lg:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-[81px] hidden w-px bg-ink/10 lg:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-0 right-0 left-0 hidden h-px bg-ink/10 lg:block"
        aria-hidden
      />

      <div className="relative mx-auto hidden h-[535px] w-full max-w-[1440px] items-center justify-center lg:flex">
        <div className="flex w-[810px] flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-center font-audiowide text-[48px] leading-[72px] text-ink">
              Curious about what we can create together?
            </h2>
            <a
              href="mailto:ratulroy8863@gmail.com"
              className="flex h-[60px] items-center gap-2 rounded-full bg-accent py-4 pr-2 pl-5 shadow-[0_4px_5px_rgba(0,0,0,0.35)] transition-transform hover:scale-105"
            >
              <span className="font-anon text-[16px] font-bold text-on-accent">
                Book a Free Call
              </span>
              <span className="flex h-[47px] w-[47px] items-center justify-center rounded-full bg-on-accent/15">
                <ArrowDownRight className="h-5 w-5 text-on-accent" />
              </span>
            </a>
          </div>

          <div className="flex items-center gap-5 p-4">
            {SOCIAL_LINKS.map((link) => {
              const Icon = SOCIAL_ICON_MAP[link.icon];
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="flex h-[35px] w-[35px] items-center justify-center text-ink transition-opacity hover:opacity-70"
                >
                  {Icon && <Icon className="h-[24px] w-[24px]" />}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-6 sm:px-10 lg:hidden">
        <h2 className="text-center font-audiowide text-[clamp(1.35rem,6.5vw,2.25rem)] leading-[1.35] text-ink">
          Curious about what we can create together?
        </h2>
        <a
          href="mailto:ratulroy8863@gmail.com"
          className="flex items-center gap-2 rounded-full bg-accent py-3 pr-2 pl-5 shadow-[0_4px_5px_rgba(0,0,0,0.35)] transition-transform hover:scale-105"
        >
          <span className="font-anon text-sm font-bold text-on-accent">
            Book a Free Call
          </span>
          <span className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-on-accent/15">
            <ArrowDownRight className="h-4 w-4 text-on-accent" />
          </span>
        </a>
        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map((link) => {
            const Icon = SOCIAL_ICON_MAP[link.icon];
            return (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="text-ink transition-opacity hover:opacity-70"
              >
                {Icon && <Icon className="h-6 w-6" />}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
