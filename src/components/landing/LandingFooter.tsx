/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useEffect, useState } from "react";
import { Mail, Phone } from "lucide-react";

function useDhakaTime(): string {
  const [time, setTime] = useState("");

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Dhaka",
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      })
        .format(new Date())
        .replace(":", ".");

    setTime(format());
    const id = window.setInterval(() => setTime(format()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}

export function LandingFooter() {
  const time = useDhakaTime();

  return (
    <footer className="relative overflow-hidden bg-ink dark:bg-[#0a0a0a]">
      <div className="relative overflow-hidden bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/landing/footer-bg.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25 dark:opacity-10 dark:invert"
        />

        <div
          className="pointer-events-none absolute inset-y-0 left-[79px] hidden w-px bg-ink/10 lg:block"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-[79px] hidden w-px bg-ink/10 lg:block"
          aria-hidden
        />

        <div className="relative mx-auto max-w-[1440px] px-6 pt-[50px] pb-8 sm:px-10 lg:px-[160px] lg:pb-10">
          <h2 className="text-center font-anton text-[clamp(2.25rem,11vw,4.5rem)] leading-[1.15] tracking-[1.8px] text-ink md:text-[clamp(3rem,12vw,180px)] md:leading-[1.3]">
            RATUL SAHA ROY
          </h2>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between lg:mt-10">
            <div className="flex min-w-0 flex-col gap-4 sm:gap-6">
              <div className="flex min-w-0 items-center gap-[10px]">
                <Mail className="h-6 w-6 shrink-0 text-ink sm:h-[30px] sm:w-[30px]" />
                <a
                  href="mailto:ratulroy8863@gmail.com"
                  className="min-w-0 break-all font-anon text-[16px] leading-[28px] text-ink transition-opacity hover:opacity-70 sm:text-[20px] sm:leading-[30px]"
                >
                  ratulroy8863@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-[10px]">
                <Phone className="h-6 w-6 shrink-0 text-ink sm:h-[30px] sm:w-[30px]" />
                <a
                  href="tel:+8801795908863"
                  className="font-anon text-[16px] leading-[28px] text-ink transition-opacity hover:opacity-70 sm:text-[20px] sm:leading-[30px]"
                >
                  +8801795908863
                </a>
              </div>
            </div>

            <div className="flex flex-col">
              <p className="font-anon text-[20px] leading-[36px] text-ink sm:text-[24px]">
                My Current Time:
              </p>
              <div className="flex items-center gap-3">
                <span className="font-audiowide text-[26px] leading-[40px] text-ink sm:text-[30px]">
                  {time || "12.00"}
                </span>
                <span className="font-anon text-[18px] leading-[30px] text-muted sm:text-[20px]">
                  Dhaka GMT 6+
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-[#0a0a0a] px-6 py-[38px] sm:px-10 lg:px-[80px] dark:bg-black">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-baumans text-[16px] leading-[30px] text-[#f5f5f5] sm:text-[20px]">
            2026 Ratul Saha Roy. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="font-baumans text-[16px] leading-[30px] text-[#f5f5f5] underline transition-opacity hover:opacity-70 sm:text-[20px]"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="font-baumans text-[16px] leading-[30px] text-[#f5f5f5] underline transition-opacity hover:opacity-70 sm:text-[20px]"
            >
              Term of Services
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
