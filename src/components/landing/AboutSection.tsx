/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Image from "next/image";
import { ABOUT_FOCUS, RESUME_HREF } from "./landingData";
import { ArrowDownRight } from "lucide-react";

const ABOUT_COPY =
  "I'm a Computer Science & Engineering student and Junior Software Developer at Kode By Kraft, working across full-stack development, artificial intelligence, and research-driven computing. I build production-ready software while exploring Machine Learning, Deep Learning, climate data, GIS, and emerging areas of computer science — turning ideas into practical solutions across hackathons, research, and client work.";

export function AboutSection() {
  return (
    <section id="about" className="relative z-[2] overflow-hidden bg-bg py-16 sm:py-20 lg:py-0">
      <div
        className="pointer-events-none absolute inset-y-0 left-[80px] hidden w-px bg-ink/10 lg:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-[80px] hidden w-px bg-ink/10 lg:block"
        aria-hidden
      />

      {/* Desktop — Figma rhythm: text left, portrait right */}
      <div className="relative mx-auto hidden min-h-[873px] w-full max-w-[1440px] lg:block lg:px-[111px] lg:pb-16 lg:pt-[140px]">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex min-w-0 flex-col">
            <h2 className="px-5 font-audiowide text-[48px] leading-[72px] text-ink">
              ABOUT ME
            </h2>

            <div className="mt-4 flex flex-col gap-[30px] px-5">
              <p className="font-baumans text-[20px] leading-[36px] text-justify text-ink">
                {ABOUT_COPY}
              </p>

              <div className="flex flex-wrap gap-4">
                {ABOUT_FOCUS.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-ink px-4 py-[10px] font-anon text-[16px] font-bold leading-[22px] text-bg"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-col gap-4 border-l-2 border-accent/70 pl-5">
                <h3 className="font-audiowide text-[30px] leading-[40px] text-ink">
                  Education
                </h3>
                <div>
                  <p className="font-baumans text-[20px] leading-[36px] text-ink">
                    B.Sc. in Computer Science &amp; Engineering
                  </p>
                  <p className="font-baumans text-[16px] leading-[28px] text-muted">
                    Metropolitan University, Sylhet · July 2023 – Present
                    (Expected Graduation: 2027)
                  </p>
                </div>
              </div>

              <div
                id="experience"
                className="flex scroll-mt-28 flex-col gap-4 border-l-2 border-ink/15 pl-5"
              >
                <h3 className="font-audiowide text-[30px] leading-[40px] text-ink">
                  Experience
                </h3>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-col">
                    <p className="font-baumans text-[20px] leading-[36px] text-ink">
                      Kode By Kraft
                    </p>
                    <p className="font-baumans text-[14px] leading-[21px] text-muted">
                      Junior Software Developer
                    </p>
                  </div>
                  <p className="shrink-0 font-baumans text-[16px] leading-[24px] text-ink">
                    2025 – Present
                  </p>
                </div>
                <p className="font-baumans text-[16px] leading-[28px] text-muted">
                  Promoted from Web Developer Intern. Shipping production web
                  apps, React/Next.js interfaces, APIs, and Figma-to-production
                  UI with the team.
                </p>
              </div>
            </div>
          </div>

          <div className="flex w-[360px] shrink-0 flex-col items-center gap-6 justify-self-end lg:sticky lg:top-28">
            <div className="relative h-[460px] w-[360px] overflow-hidden rounded-lg shadow-[0_24px_48px_-24px_rgba(0,0,0,0.55)] ring-1 ring-ink/10">
              <Image
                src="/landing/hero-portrait-v3.png"
                alt="Ratul Saha Roy"
                fill
                sizes="360px"
                className="object-cover object-top"
              />
            </div>
            <a
              href={RESUME_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-accent py-5 pr-2 pl-5 transition-transform hover:scale-105"
            >
              <span className="font-anon text-[18px] font-bold text-on-accent">
                View My Resume
              </span>
              <span className="flex h-[47px] w-[47px] items-center justify-center rounded-full bg-on-accent/15">
                <ArrowDownRight className="h-5 w-5 text-on-accent" />
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-6 sm:px-10 lg:hidden">
        <div className="relative h-[320px] w-full max-w-[360px] overflow-hidden rounded-lg sm:h-[400px]">
          <Image
            src="/landing/hero-portrait-v3.png"
            alt="Ratul Saha Roy"
            fill
            sizes="(max-width: 640px) 100vw, 360px"
            className="object-cover object-top"
          />
        </div>

        <h2 className="font-audiowide text-[32px] leading-[48px] text-ink sm:text-[40px]">
          ABOUT ME
        </h2>

        <p className="max-w-[600px] text-center font-baumans text-[18px] leading-[30px] text-ink sm:text-[20px] sm:leading-[36px]">
          {ABOUT_COPY}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {ABOUT_FOCUS.map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-ink px-3 py-2 font-anon text-sm font-bold text-bg"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="w-full max-w-[500px] space-y-6">
          <div>
            <h3 className="font-audiowide text-[24px] leading-[36px] text-ink">
              Education
            </h3>
            <p className="font-baumans text-[18px] leading-[30px] text-ink">
              B.Sc. in CSE, Metropolitan University, Sylhet
            </p>
            <p className="font-baumans text-[14px] text-muted">
              July 2023 – Present · Expected Graduation: 2027
            </p>
          </div>
          <div>
            <h3 className="font-audiowide text-[24px] leading-[36px] text-ink">
              Experience
            </h3>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <p className="font-baumans text-[18px] leading-[30px] text-ink">
                  Kode By Kraft
                </p>
                <p className="font-baumans text-[14px] text-muted">
                  Junior Software Developer
                </p>
              </div>
              <p className="shrink-0 font-baumans text-[14px] text-ink">
                2025 – Present
              </p>
            </div>
          </div>
        </div>

        <a
          href={RESUME_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-accent py-4 pr-2 pl-5 transition-transform hover:scale-105"
        >
          <span className="font-anon text-[16px] font-bold text-on-accent">
            View My Resume
          </span>
          <span className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-on-accent/15">
            <ArrowDownRight className="h-5 w-5 text-on-accent" />
          </span>
        </a>
      </div>
    </section>
  );
}
