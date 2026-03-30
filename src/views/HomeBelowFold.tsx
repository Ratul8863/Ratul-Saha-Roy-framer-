/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Github,
  Linkedin,
  Mail,
  Code2,
  Layout,
  Database,
  Smartphone,
  ArrowUpRight,
  GraduationCap,
  Award,
  Download,
  Server,
  Flame,
  Braces,
  Link2,
  Layers,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import type { Project } from "../data/projects";
import { PROJECTS } from "../data/projects";

const RESUME_HREF = "/doc/RATUL%20SAHA%20ROY_New_FS.pdf";
const LINKEDIN_HREF = "https://www.linkedin.com/in/ratulroy8863";

interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  highlights?: string[];
  link?: string;
}

const EXPERIENCES: Experience[] = [
  {
    role: "Web Developer Intern",
    company: "KodeByKraft",
    period: "Internship ┬╖ ~3 months ┬╖ ongoing",
    description:
      "Hands-on internship shipping features on real-world web applications alongside the team at KodeByKraft.",
    highlights: [
      "Working on production web applications end-to-end",
      "Building responsive UI components with React and modern CSS",
      "Improving performance and overall user experience",
      "Collaborating with teammates on shared codebases and reviews",
    ],
    link: "https://kodebykraft.com/",
  },
];

const About = () => {
  return (
    <section
      id="about"
      className="bg-muted px-5 py-16 sm:px-8 sm:py-24 lg:px-10 lg:py-32 xl:px-12"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-8 sm:space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className="whitespace-nowrap text-[clamp(2.25rem,min(10vw,14dvh),5.5rem)] lg:text-[clamp(2.5rem,min(8vw,12dvh),6rem)] leading-none mb-6 sm:mb-8 [text-wrap:normal]">
                My Journey
              </h2>
              <div className="text-base sm:text-lg lg:text-xl text-black/60 font-light leading-relaxed space-y-4">
                <p>
                  I am a passionate and dedicated web developer with a strong
                  focus on building modern, responsive, and user-friendly web
                  applications. I enjoy the MERN stack and love crafting
                  interfaces with smooth animations and interactions—as a
                  developer who cares about UX, not as a separate UI/UX designer
                  role.
                </p>
                <p>
                  I am continuously learning new technologies and sharpening
                  problem-solving through real-world projects and team
                  collaboration. Currently a Web Developer Intern at{" "}
                  <a
                    href="https://kodebykraft.com/"
                    className="text-accent font-medium underline underline-offset-4"
                  >
                    KodeByKraft
                  </a>
                  , my goal is to build impactful digital products and grow as a
                  professional developer.
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
              {[
                { label: "Projects shipped", value: "10+" },
                { label: "Live production sites", value: "2" },
                { label: "Stack & tools", value: "12+" },
                { label: "Internship", value: "3 mo+" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 sm:p-6 lg:p-8 bg-white rounded-2xl sm:rounded-3xl border border-black/5"
                >
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-display mb-1 sm:mb-2">
                    {stat.value}
                  </p>
                  <p className="text-[8px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest font-bold text-black/40 leading-tight">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-6 sm:mt-10 sm:space-y-8 lg:mt-16 xl:mt-20">
            <h3 className="text-xl sm:text-2xl mb-6 sm:mb-8">
              Experience & Education
            </h3>
            <div className="space-y-4">
              {EXPERIENCES.map((exp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="p-5 sm:p-6 lg:p-8 bg-white rounded-2xl sm:rounded-3xl border border-black/5 group hover:bg-black hover:text-white transition-all duration-500 cursor-default"
                >
                  <div className="flex justify-between items-start gap-3 mb-3 sm:mb-4">
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-accent mb-1">
                        {exp.period}
                      </p>
                      <h4 className="text-lg sm:text-xl lg:text-2xl font-display">
                        {exp.role}
                      </h4>
                      <p className="text-sm opacity-60">{exp.company}</p>
                    </div>
                    {exp.link && (
                      <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  <p className="text-sm font-light leading-relaxed opacity-60 group-hover:opacity-80">
                    {exp.description}
                  </p>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-4 space-y-2 text-sm font-light leading-relaxed opacity-70 group-hover:opacity-90 list-disc pl-5 marker:text-accent">
                      {exp.highlights.map((line, hi) => (
                        <li key={hi}>{line}</li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="p-5 sm:p-6 lg:p-8 bg-white rounded-2xl sm:rounded-3xl border border-black/5"
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-2xl bg-muted flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-black/40" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-lg sm:text-xl lg:text-2xl font-display">
                      Bachelor&apos;s in CSE
                    </h4>
                    <p className="text-sm opacity-60">
                      Metropolitan University, Bangladesh ┬╖ Sylhet
                    </p>
                  </div>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-black/40">
                  Ongoing ┬╖ Bachelor&apos;s degree
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const canVisit = project.link && project.link !== "#";
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-[24px] border border-black/5 bg-white transition-all duration-700 hover:shadow-2xl sm:rounded-[32px] lg:rounded-[40px]"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-[1]"
        aria-label={`View ${project.title} case study`}
      />
      <div className="pointer-events-none relative z-0">
        <div className="relative aspect-[16/11] overflow-hidden sm:aspect-[16/10]">
          <Image
            src={project.image}
            alt={`${project.title} project preview`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="space-y-4 p-5 sm:space-y-6 sm:p-8 lg:p-10">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="mb-3 inline-block rounded-full bg-accent/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-accent sm:mb-4 sm:px-3 sm:text-[10px]">
                {project.category}
              </span>
              <h3 className="font-display text-2xl leading-tight sm:text-3xl sm:leading-none lg:text-4xl">
                {project.title}
              </h3>
            </div>
            {canVisit ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto relative z-[2] mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 transition-all hover:bg-black hover:text-white sm:h-14 sm:w-14 group/btn"
                aria-label={`Open ${project.title} live site`}
              >
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover/btn:rotate-45 sm:h-6 sm:w-6" />
              </a>
            ) : (
              <span className="relative z-[2] mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-dashed border-black/15 text-black/30 sm:h-14 sm:w-14">
                <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
            )}
          </div>
          <p className="text-sm font-light leading-relaxed text-black/60 sm:text-base">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <span
                key={i}
                className="rounded-full border border-black/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black/40"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/35">
            Case study →
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  return (
    <section
      id="projects"
      className="px-5 py-16 sm:px-8 sm:py-24 lg:px-10 lg:py-32 xl:px-12"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-12 flex flex-col gap-6 sm:mb-16 sm:gap-8 lg:mb-20 xl:flex-row xl:items-end xl:justify-between">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="min-w-0"
          >
            <h2 className="whitespace-nowrap text-[clamp(2rem,min(8vw,12dvh),5.5rem)] leading-none [text-wrap:normal] lg:text-[clamp(2.25rem,min(7vw,11dvh),5.75rem)]">
              Featured Projects
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="max-w-sm text-left font-light italic text-black/40 text-sm sm:text-base xl:text-right xl:shrink-0"
          >
            &ldquo;First make it work, then make it right, then make it fast.&rdquo;
            — Kent Beck
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-12 flex justify-center sm:mt-16"
        >
          <Link
            href="/projects"
            className="glass-pill group inline-flex items-center gap-3 px-8 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-black/70 transition-all hover:border-black/15 hover:text-black"
          >
            View all projects
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-45" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const TechStack = () => {
  const skills = [
    { name: "React.js", icon: <Layout className="w-6 h-6" />, category: "Frontend" },
    {
      name: "JavaScript (ES6+)",
      icon: <Braces className="w-6 h-6" />,
      category: "Frontend",
    },
    { name: "Tailwind CSS", icon: <Layers className="w-6 h-6" />, category: "Frontend" },
    { name: "HTML5 & CSS3", icon: <Layout className="w-6 h-6" />, category: "Frontend" },
    { name: "Node.js", icon: <Code2 className="w-6 h-6" />, category: "Backend" },
    { name: "Express.js", icon: <Server className="w-6 h-6" />, category: "Backend" },
    { name: "MongoDB", icon: <Database className="w-6 h-6" />, category: "Database" },
    { name: "MySQL", icon: <Database className="w-6 h-6" />, category: "Database" },
    { name: "Git & GitHub", icon: <Github className="w-6 h-6" />, category: "Tools" },
    {
      name: "Framer Motion",
      icon: <Smartphone className="w-6 h-6" />,
      category: "Animation",
    },
    { name: "Firebase", icon: <Flame className="w-6 h-6" />, category: "Tools" },
    { name: "REST APIs", icon: <Link2 className="w-6 h-6" />, category: "Integration" },
  ];

  return (
    <section className="overflow-hidden bg-black px-5 py-16 text-white sm:px-8 sm:py-24 lg:px-10 lg:py-32 xl:px-12">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20 items-center">
          <div className="lg:col-span-5 text-center lg:text-left">
            <h2 className="text-[clamp(2.25rem,min(10vw,14dvh),5.5rem)] lg:text-[clamp(2.5rem,min(8vw,12dvh),6rem)] leading-none mb-6 sm:mb-8">
              Tech <br /> Stack
            </h2>
            <p className="text-white/60 font-light leading-relaxed text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
              I build with intention. Each tool in my arsenal is selected to
              ensure performance, scalability, and a delightful user experience.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {skills.map((skill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
                className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[28px] lg:rounded-[32px] border border-white/10 flex flex-col items-center justify-center gap-2 sm:gap-4 text-center transition-colors min-h-[7rem] sm:min-h-0"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center text-accent [&_svg]:w-5 [&_svg]:h-5 sm:[&_svg]:w-6 sm:[&_svg]:h-6">
                  {skill.icon}
                </div>
                <div className="min-w-0 w-full px-0.5">
                  <p className="font-display text-sm sm:text-lg lg:text-xl leading-tight break-words">
                    {skill.name}
                  </p>
                  <p className="text-[8px] sm:text-[9px] uppercase tracking-wider sm:tracking-widest text-white/40 mt-1">
                    {skill.category}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section
      id="contact"
      className="px-5 py-16 sm:px-8 sm:py-24 lg:px-10 lg:py-32 xl:px-12"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="bg-muted rounded-[28px] sm:rounded-[40px] lg:rounded-[60px] p-6 sm:p-12 md:p-16 lg:p-24 overflow-hidden relative">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20">
            <div className="space-y-8 sm:space-y-12">
              <h2 className="text-[clamp(2.25rem,min(10vw,14dvh),5.5rem)] lg:text-[clamp(2.5rem,min(8vw,12dvh),6rem)] leading-none">
                Let&apos;s <br /> Connect
              </h2>
              <div className="space-y-5 sm:space-y-6">
                <div className="flex items-start gap-4 sm:gap-6 group cursor-pointer min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-white flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">
                      Email me at
                    </p>
                    <p className="text-base sm:text-lg lg:text-xl font-medium break-all sm:break-words">
                      ratulroy8863@gmail.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 sm:gap-6 group cursor-pointer min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-white flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                    <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">
                      Call me at
                    </p>
                    <p className="text-base sm:text-lg lg:text-xl font-medium break-all">
                      +8801795908863
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 sm:gap-4">
                {[
                  {
                    icon: <Github className="w-5 h-5 sm:w-6 sm:h-6" />,
                    link: "https://github.com/ratulroy8863",
                    label: "GitHub profile",
                  },
                  {
                    icon: <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />,
                    link: LINKEDIN_HREF,
                    label: "LinkedIn profile",
                  },
                  {
                    icon: <Mail className="w-5 h-5 sm:w-6 sm:h-6" />,
                    link: "mailto:ratulroy8863@gmail.com",
                    label: "Email Ratul Saha Roy",
                  },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.link}
                    aria-label={social.label}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all shrink-0"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <form className="space-y-5 sm:space-y-6 min-w-0" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="contact-name"
                    className="text-[10px] uppercase tracking-widest font-bold text-black/40 ml-3 sm:ml-4"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    className="w-full min-w-0 px-5 sm:px-8 py-3.5 sm:py-4 bg-white rounded-full border border-black/5 focus:outline-none focus:border-accent transition-colors text-base"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="contact-email"
                    className="text-[10px] uppercase tracking-widest font-bold text-black/40 ml-3 sm:ml-4"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="john@example.com"
                    className="w-full min-w-0 px-5 sm:px-8 py-3.5 sm:py-4 bg-white rounded-full border border-black/5 focus:outline-none focus:border-accent transition-colors text-base"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="contact-message"
                  className="text-[10px] uppercase tracking-widest font-bold text-black/40 ml-3 sm:ml-4"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  placeholder="Tell me about your project..."
                  className="w-full min-w-0 px-5 sm:px-8 py-5 sm:py-6 bg-white rounded-[24px] sm:rounded-[32px] border border-black/5 focus:outline-none focus:border-accent transition-colors resize-y min-h-[120px] text-base"
                />
              </div>
              <button
                type="button"
                className="w-full py-4 sm:py-6 bg-black text-white rounded-full font-bold uppercase tracking-widest text-[10px] sm:text-xs hover:scale-[1.02] transition-transform"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="absolute -bottom-16 sm:-bottom-20 -right-8 sm:-right-20 text-[clamp(4rem,22vw,12rem)] sm:text-[20vw] font-display text-black/5 leading-none pointer-events-none select-none max-w-[100%] overflow-hidden">
            HIRE
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-black/5 bg-white px-5 py-8 sm:px-8 sm:py-12 lg:px-10 xl:px-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 text-center md:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 shrink-0 rounded-full bg-black flex items-center justify-center text-white font-bold">
            R
          </div>
          <p className="text-xs sm:text-sm font-medium max-w-xs sm:max-w-none">
            ┬⌐ 2026 Ratul Saha Roy. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-black/40">
          <a href="#" className="hover:text-black transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-black transition-colors">
            Terms of Service
          </a>
          <a
            href={RESUME_HREF}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition-colors inline-flex items-center gap-1"
          >
            <Download className="w-3 h-3 shrink-0" />
            Resume
          </a>
        </div>
      </div>
    </footer>
  );
};

const SERVICES = [
  {
    id: "01",
    title: "Responsive UI (front-end)",
    description:
      "I turn layouts into fast, responsive React and Tailwind interfaces—clear structure, thoughtful spacing, and motion where it helps. I am a developer who cares about usability and polish; I do not position myself as a dedicated UI/UX designer, but I ship interfaces that feel intentional.",
    bullets: [
      "Component-driven React and Tailwind UI",
      "Responsive layouts, spacing, and readable structure",
      "Motion only where it supports usability and polish",
    ],
    imageSrc: "/service-01.png",
  },
  {
    id: "02",
    title: "Full stack (MERN)",
    description:
      "End-to-end features with MongoDB, Express, React, and Node—REST APIs, auth-aware flows, and dashboards that stay maintainable. Same mindset I use on internships and personal builds: real data, real constraints, real users.",
    bullets: [
      "MERN features from database to dashboard",
      "REST APIs and auth-aware product flows",
      "Maintainable code under real data and constraints",
    ],
    imageSrc: "/service-02.png",
  },
  {
    id: "03",
    title: "APIs, data & integrations",
    description:
      "REST APIs, Firebase when the product needs realtime or auth helpers, and sensible database choices (MongoDB or MySQL). I focus on predictable contracts between client and server so features are easier to test and extend.",
    bullets: [
      "REST APIs with clear, predictable contracts",
      "Firebase when realtime or auth helpers fit the product",
      "MongoDB or MySQL chosen to match the problem",
    ],
    imageSrc: "/service-03.png",
  },
] as const;

const TESTIMONIALS = [
  {
    name: "Team feedback",
    role: "Development environment",
    text: "Ratul asks good questions before he builds, ships UI that matches the spec, and is easy to collaborate with on day-to-day tickets.",
    avatar: "https://i.pravatar.cc/150?u=ratul-peer-a",
  },
  {
    name: "Mentor note",
    role: "Code review & pairing",
    text: "Strong React fundamentals and a clear willingness to learn—he iterates quickly when we discuss performance or cleaner component structure.",
    avatar: "https://i.pravatar.cc/150?u=ratul-peer-b",
  },
];

const Services = () => {
  const [openId, setOpenId] = useState<string | null>(SERVICES[0].id);

  return (
    <section
      id="services"
      className="bg-white px-5 py-16 text-black sm:px-8 sm:py-24 lg:px-10 lg:py-32 xl:px-12"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 sm:gap-12 lg:gap-14">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl"
        >
          <h2 className="font-display text-[80px] font-extrabold uppercase leading-[1.08] tracking-tight">
            What I Can Do
          </h2>
          <p className="mt-5 text-base font-normal leading-relaxed text-[#4B5563] sm:mt-6 sm:text-lg">
            Three ways I help teams and my own projects: solid front-end
            implementation, MERN-style full stack delivery, and clean integration
            between apps, APIs, and data stores.
          </p>
        </motion.header>

        <ul
          role="list"
          className="divide-y divide-neutral-200 border-y border-neutral-200"
        >
          {SERVICES.map((service) => {
            const isOpen = openId === service.id;
            return (
              <li key={service.id}>
                <button
                  type="button"
                  id={`service-trigger-${service.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`service-panel-${service.id}`}
                  aria-label={`${isOpen ? "Collapse" : "Expand"} ${service.title} details`}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 py-6 text-left font-display text-base font-bold uppercase tracking-wide text-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/20 sm:py-7 sm:text-lg lg:text-xl"
                  onClick={() =>
                    setOpenId((prev) =>
                      prev === service.id ? null : service.id
                    )
                  }
                >
                  <span className="min-w-0">{service.title}</span>
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-black shadow-none transition-transform duration-300 ease-out sm:h-11 sm:w-11 ${isOpen ? "rotate-90" : "rotate-0"}`}
                    aria-hidden
                  >
                    <ArrowUpRight
                      className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
                      strokeWidth={1.75}
                    />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`service-panel-${service.id}`}
                      role="region"
                      aria-labelledby={`service-trigger-${service.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.38,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 gap-8 pb-8 pt-1 lg:grid-cols-2 lg:gap-14 lg:pb-10 lg:pt-0">
                        <div className="min-w-0 space-y-5">
                          <p className="text-sm leading-relaxed text-[#4B5563] sm:text-base">
                            {service.description}
                          </p>
                          <ul className="list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-[#4B5563] marker:text-black/35 sm:text-base">
                            {service.bullets.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="relative min-h-[12rem] lg:min-h-[14rem]">
                          <div className="relative h-[min(52vw,320px)] min-h-[12rem] w-full overflow-hidden rounded-[28px] border border-black/5 bg-muted sm:rounded-[32px] lg:h-[min(40vw,360px)] lg:min-h-[14rem] lg:rounded-[36px]">
                            <Image
                              src={service.imageSrc}
                              alt={`Illustration for ${service.title}`}
                              fill
                              sizes="(max-width: 1024px) 90vw, 40vw"
                              className="object-cover object-center"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

const Testimonials = () => {
  return (
    <section className="bg-muted px-5 py-16 sm:px-8 sm:py-24 lg:px-10 lg:py-32 xl:px-12">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="mb-4 whitespace-nowrap text-[clamp(2rem,min(8vw,12dvh),5.5rem)] leading-none [text-wrap:normal] sm:mb-6 lg:text-[clamp(2.25rem,min(7vw,11dvh),5.75rem)]">
            Client Voices
          </h2>
          <p className="text-black/40 font-light italic text-sm sm:text-base px-2">
            &ldquo;Trust is the foundation of every great project.&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 sm:p-10 lg:p-12 bg-white rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] border border-black/5 space-y-5 sm:space-y-8"
            >
              <div className="flex flex-wrap gap-1 text-accent">
                {[...Array(5)].map((_, j) => (
                  <Award key={j} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                ))}
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-light leading-relaxed italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full sm:h-12 sm:w-12">
                  <Image
                    src={t.avatar}
                    alt={`Portrait for ${t.name}`}
                    fill
                    sizes="48px"
                    className="object-cover grayscale"
                  />
                </div>
                <div className="min-w-0 text-left">
                  <p className="font-display text-lg sm:text-xl truncate">
                    {t.name}
                  </p>
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-black/40">
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function HomeBelowFold() {
  return (
    <>
      <About />
      <Services />
      <Projects />
      <TechStack />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}
