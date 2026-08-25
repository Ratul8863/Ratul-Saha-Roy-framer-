/**

 * @license

 * SPDX-License-Identifier: Apache-2.0

 */



import Image from "next/image";

import { SKILL_TAGS, RESUME_HREF } from "./landingData";

import { ArrowDownRight } from "lucide-react";



export function AboutSection() {

  return (

    <section id="about" className="relative z-[2] overflow-hidden bg-bg py-16 sm:py-20 lg:py-0">

      {/* Vertical border lines (desktop) */}

      <div className="pointer-events-none absolute inset-y-0 left-[80px] w-px bg-ink/10 hidden lg:block" aria-hidden />

      <div className="pointer-events-none absolute inset-y-0 right-[80px] w-px bg-ink/10 hidden lg:block" aria-hidden />



      {/* Desktop layout: 1440 x 873, content at y=140 */}

      <div className="relative mx-auto hidden h-[873px] w-full max-w-[1440px] lg:flex lg:items-start lg:justify-center lg:pt-[140px]">

        <div className="flex items-start gap-[102px] px-[160px]">

          {/* Left: portrait + resume CTA */}

          <div className="flex w-[360px] shrink-0 flex-col items-center gap-6">

            <div

              data-float-slot="about"

              className="relative h-[460px] w-[360px] overflow-hidden rounded-lg"

            >

              <Image

                src="/landing/hero-portrait-v3.png"

                alt="Ratul Saha Roy"

                fill

                sizes="360px"

                className="float-slot-art object-cover object-top"

              />

            </div>

            <a

              href={RESUME_HREF}

              target="_blank"

              rel="noopener noreferrer"

              className="flex items-center gap-2 rounded-full bg-accent py-5 pl-5 pr-2 transition-transform hover:scale-105"

            >

              <span className="font-anon text-[18px] font-bold text-on-accent">

                View My Resume

              </span>

              <span className="flex h-[47px] w-[47px] items-center justify-center rounded-full bg-on-accent/15">

                <ArrowDownRight className="h-5 w-5 text-on-accent" />

              </span>

            </a>

          </div>



          {/* Right: text content */}

          <div className="flex w-[738px] flex-col">

            <h2 className="px-5 font-audiowide text-[48px] leading-[72px] text-ink">

              ABOUT ME

            </h2>



            <div className="mt-4 flex flex-col gap-[30px] px-5">

              <p className="font-baumans text-[20px] leading-[36px] text-ink text-justify">

                I am a Junior Software Developer at Kode By Kraft and a CSE student at Metropolitan University, Sylhet.
                I build modern, responsive web apps with the MERN stack and ship production work including Assubah,
                As-Subah Outreach, and EcoScrap — with awards from Hult Prize, NASA Space Apps, MillionX, and InnovateX.
                I care about UX as a developer, not as a separate UI/UX designer role.

              </p>



              {/* Skill tags */}

              <div className="flex flex-wrap gap-4">

                {SKILL_TAGS.map((tag) => (

                  <span

                    key={tag}

                    className="rounded-lg bg-ink px-4 py-[10px] font-anon text-[16px] font-bold leading-[22px] text-bg"

                  >

                    {tag}

                  </span>

                ))}

              </div>



              {/* Education */}

              <div className="flex flex-col gap-4">

                <h3 className="font-audiowide text-[30px] leading-[40px] text-ink">

                  Education:

                </h3>

                <p className="font-baumans text-[20px] leading-[36px] text-ink">

                  Bachelor&apos;s in CSE, Metropolitan University.

                </p>

              </div>



              {/* Work Experience */}

              <div className="flex flex-col gap-4">

                <h3 className="font-audiowide text-[30px] leading-[40px] text-ink">

                  Work Experience:

                </h3>

                <div className="flex items-start justify-between">

                  <div className="flex flex-col">

                    <p className="font-baumans text-[20px] leading-[36px] text-ink">

                      Kode By Kraft

                    </p>

                    <p className="font-baumans text-[14px] leading-[21px] text-muted">

                      Web Developer

                    </p>

                  </div>

                  <p className="font-baumans text-[16px] leading-[24px] text-ink">

                    January,2026 - Present{" "}

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>



      {/* Mobile / Tablet */}

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

          I am a Junior Software Developer at Kode By Kraft and a CSE student at Metropolitan University, Sylhet.
          I build modern, responsive web apps with the MERN stack and ship production work including Assubah,
          As-Subah Outreach, and EcoScrap — with awards from Hult Prize, NASA Space Apps, MillionX, and InnovateX.
          I care about UX as a developer, not as a separate UI/UX designer role.

        </p>



        <div className="flex flex-wrap justify-center gap-3">

          {SKILL_TAGS.map((tag) => (

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

            <h3 className="font-audiowide text-[24px] leading-[36px] text-ink">Education:</h3>

            <p className="font-baumans text-[18px] leading-[30px] text-ink">

              Bachelor&apos;s in CSE, Metropolitan University.

            </p>

          </div>

          <div>

            <h3 className="font-audiowide text-[24px] leading-[36px] text-ink">Work Experience:</h3>

            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">

              <div className="min-w-0">

                <p className="font-baumans text-[18px] leading-[30px] text-ink">Kode By Kraft</p>

                <p className="font-baumans text-[14px] text-muted">Web Developer</p>

              </div>

              <p className="shrink-0 font-baumans text-[14px] text-ink">

                January,2026 - Present

              </p>

            </div>

          </div>

        </div>



        <a

          href={RESUME_HREF}

          target="_blank"

          rel="noopener noreferrer"

          className="flex items-center gap-2 rounded-full bg-accent py-4 pl-5 pr-2 transition-transform hover:scale-105"

        >

          <span className="font-anon text-[16px] font-bold text-on-accent">View My Resume</span>

          <span className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-on-accent/15">

            <ArrowDownRight className="h-5 w-5 text-on-accent" />

          </span>

        </a>

      </div>

    </section>

  );

}


