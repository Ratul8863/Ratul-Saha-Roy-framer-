/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "motion/react";
import { ChevronDown, Globe, Download } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { BackToTop } from "../components/BackToTop";

const RESUME_HREF = "/doc/RATUL%20SAHA%20ROY_New_FS.pdf";

const VIEWPORT_ONCE = { once: true, margin: "0px 0px -12% 0px" } as const;

const HomeBelowFold = dynamic(() => import("./HomeBelowFold"), {
  loading: () => <div className="min-h-[40vh] bg-bg" aria-hidden />,
});

const Hero = () => {
  return (
    <section
      id="home"
      className="flex min-h-dvh flex-col items-center justify-center overflow-x-hidden px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-10 xl:px-12"
    >
      <div className="max-w-6xl w-full min-w-0 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-10 xl:gap-12 items-center">
        <div className="lg:col-span-7 min-w-0 max-w-full space-y-6 sm:space-y-8 order-2 lg:order-1 text-center lg:text-left lg:pr-2 xl:pr-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.8 }}
            className="min-w-0 max-w-full"
          >
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.12em] sm:tracking-[0.2em] text-black/45 mb-3 sm:mb-4 text-pretty max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Ratul Saha Roy · Full Stack Web Developer (MERN)
            </p>
            <h1 className="max-w-full min-w-0 text-[clamp(2.25rem,9.5vw,4.25rem)] sm:text-[clamp(2.5rem,8vw,5rem)] lg:text-[clamp(2.75rem,6.5vw,5.25rem)] xl:text-[clamp(3rem,5.8vw,6.25rem)] 2xl:text-[clamp(3.25rem,5vw,7.25rem)] leading-[0.92] sm:leading-[0.88] mb-4 sm:mb-6 [overflow-wrap:anywhere]">
              Full Stack <br />
              <span className="text-accent">Developer</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-black/60 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed text-pretty">
              Based in Sylhet, Bangladesh—I build modern, responsive,
              user-friendly web apps on the MERN stack, with smooth motion and
              interfaces that feel as good as they look. Always learning, always
              shipping.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start w-full sm:w-auto"
          >
            <a
              href="#projects"
              className="px-6 sm:px-8 py-3.5 sm:py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest text-[10px] sm:text-xs text-center hover:scale-[1.02] sm:hover:scale-105 transition-transform"
            >
              View My Work
            </a>
            <a
              href={RESUME_HREF}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 sm:px-8 py-3.5 sm:py-4 border border-black/10 rounded-full font-bold uppercase tracking-widest text-[10px] sm:text-xs hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Resume
            </a>
          </motion.div>
        </div>

        <div className="lg:col-span-5 min-w-0 relative perspective-1000 order-1 lg:order-2 max-w-md mx-auto w-full lg:max-w-none lg:pl-2 xl:pl-0">
          <motion.div
            initial={{ opacity: 0, rotateY: 20, scale: 0.8 }}
            whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 isolate aspect-[4/5] rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] overflow-hidden shadow-2xl"
          >
            <Image
              src="/profileimage.png"
              alt="Ratul Saha Roy"
              fill
              priority
              quality={85}
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-top grayscale transition-all duration-700 hover:grayscale-0"
            />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 p-4 sm:p-6 glass-pill flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">
                  Based in
                </p>
                <p className="text-sm font-bold truncate">Sylhet, BD</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-accent" />
              </div>
            </div>
          </motion.div>

          <div
            className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-accent/10 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-black/5 blur-3xl"
            aria-hidden
          />
        </div>
      </div>

      <div className="mt-12 sm:mt-20 flex flex-col items-center gap-2 opacity-30">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">
          Scroll to explore
        </span>
        <ChevronDown
          className="h-4 w-4 motion-safe:animate-bounce"
          aria-hidden
        />
      </div>
    </section>
  );
};

export default function HomePage() {
  return (
    <div className="relative">
      <Navbar />
      <main id="main-content">
        <Hero />
        <HomeBelowFold />
      </main>
      <BackToTop />

      <div
        className="pointer-events-none fixed inset-0 -z-50 isolate"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(93,95,239,0.03),transparent_70%)]" />
      </div>
    </div>
  );
}
