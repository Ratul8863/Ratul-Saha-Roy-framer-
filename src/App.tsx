/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  ChevronDown,
  Globe,
  GraduationCap,
  Award,
  Download,
  Menu,
  X,
  Server,
  Flame,
  Braces,
  Link2,
  Layers
} from "lucide-react";
import { useState, useEffect } from "react";

// --- Types ---
interface Project {
  title: string;
  description: string;
  tags: string[];
  link: string;
  image: string;
  category: string;
}

interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  highlights?: string[];
  link?: string;
}

/** Place your PDF at public/doc/RATUL SAHA ROY_New_FS.pdf (same filename as your resume). */
const RESUME_HREF = "/doc/RATUL%20SAHA%20ROY_New_FS.pdf";

const LINKEDIN_HREF = "https://www.linkedin.com/in/ratulroy8863";

// --- Data ---
const PROJECTS: Project[] = [
  {
    title: "Assubah",
    description:
      "Developed a modern, responsive marketing and platform experience for Assubah—structured layout, clear information hierarchy, and attention to performance. Focused on clean UI, smooth interactions, and a maintainable front-end so the site stays fast and easy to extend.",
    tags: ["React", "Tailwind CSS", "Responsive UI", "Performance"],
    link: "https://www.assubah.com/",
    image: "https://picsum.photos/seed/assubah/800/600",
    category: "Live site"
  },
  {
    title: "As-Subah Outreach",
    description:
      "Charity website for sustainable support across multiple countries—donations, appeals, and impact storytelling for As-Subah Outreach. Emphasis on readable content, responsive sections, and reliable structure so donors can explore appeals and trust how the organization presents its work online.",
    tags: ["React", "Express", "MongoDB", "REST APIs"],
    link: "https://www.assubahoutreach.com/",
    image: "https://picsum.photos/seed/outreach/800/600",
    category: "Live site"
  },
  {
    title: "Hostel Meals",
    description:
      "Full stack app for hostel meal management: role-based access, orders, and secure flows. Sharpens my MERN patterns—REST APIs, auth-minded design, and dashboards that stay usable on mobile.",
    tags: ["React", "Node.js", "Stripe", "JWT"],
    link: "#",
    image: "https://picsum.photos/seed/hostel/800/600",
    category: "Full stack"
  },
  {
    title: "HobbyHub",
    description:
      "Community product for discovering and joining local hobby groups—real-time friendly features with Firebase plus Express APIs. Practice in list/detail UX, forms, and collaborative data.",
    tags: ["React", "Firebase", "Express"],
    link: "#",
    image: "https://picsum.photos/seed/hobby/800/600",
    category: "Community"
  }
];

const EXPERIENCES: Experience[] = [
  {
    role: "Web Developer Intern",
    company: "KodeByKraft",
    period: "Internship · ~3 months · ongoing",
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

// --- Components ---

type NavLinkItem = { href: string; label: string; cta?: boolean };

const navLinks: NavLinkItem[] = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact", cta: true },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-3 left-3 right-3 sm:top-6 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 sm:w-fit sm:max-w-none max-w-none"
    >
      <div className="glass-pill px-3 py-2.5 sm:px-6 sm:py-3 flex items-center justify-between gap-3 sm:gap-8 sm:justify-start">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 shrink-0 rounded-full bg-accent flex items-center justify-center text-white font-bold text-xs">R</div>
          <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase hidden sm:block truncate max-w-[9rem] sm:max-w-none">MERN · Sylhet</span>
          <div className="w-2 h-2 shrink-0 rounded-full bg-green-500 animate-pulse" aria-hidden />
        </div>
        <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-[10px] xl:text-[11px] font-bold uppercase tracking-widest text-black/60 flex-wrap justify-end">
          {navLinks.map(({ href, label, cta }) =>
            cta ? (
              <a key={href} href={href} className="px-4 py-2 bg-black text-white rounded-full hover:opacity-90 transition-opacity">
                {label}
              </a>
            ) : (
              <a key={href} href={href} className="hover:text-black transition-colors">
                {label}
              </a>
            )
          )}
        </div>
        <button
          type="button"
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full border border-black/10 bg-white/80 text-black"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 top-0 z-40 bg-black/40 backdrop-blur-sm"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 rounded-3xl border border-black/10 bg-white/95 backdrop-blur-md shadow-xl p-4 max-h-[min(70vh,28rem)] overflow-y-auto"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map(({ href, label, cta }) => (
                  <a
                    key={href}
                    href={href}
                    className={
                      cta
                        ? "mt-2 text-center py-3.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-widest"
                        : "py-3.5 px-4 rounded-2xl text-sm font-bold uppercase tracking-widest text-black/70 hover:bg-muted hover:text-black transition-colors"
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="min-h-dvh flex flex-col items-center justify-center pt-28 pb-12 sm:pt-32 sm:pb-16 px-4 sm:px-6 overflow-x-hidden">
      <div className="max-w-6xl w-full min-w-0 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-10 xl:gap-12 items-center">
        <div className="lg:col-span-7 min-w-0 max-w-full space-y-6 sm:space-y-8 order-2 lg:order-1 text-center lg:text-left lg:pr-2 xl:pr-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
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
              Based in Sylhet, Bangladesh—I build modern, responsive, user-friendly web apps on the MERN stack, with smooth motion and interfaces that feel as good as they look. Always learning, always shipping.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start w-full sm:w-auto"
          >
            <a href="#projects" className="px-6 sm:px-8 py-3.5 sm:py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest text-[10px] sm:text-xs text-center hover:scale-[1.02] sm:hover:scale-105 transition-transform">View My Work</a>
            <a href={RESUME_HREF} download target="_blank" rel="noopener noreferrer" className="px-6 sm:px-8 py-3.5 sm:py-4 border border-black/10 rounded-full font-bold uppercase tracking-widest text-[10px] sm:text-xs hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Resume
            </a>
          </motion.div>
        </div>

        <div className="lg:col-span-5 min-w-0 relative perspective-1000 order-1 lg:order-2 max-w-md mx-auto w-full lg:max-w-none lg:pl-2 xl:pl-0">
          <motion.div
            initial={{ opacity: 0, rotateY: 20, scale: 0.8 }}
            whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 isolate aspect-[4/5] rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] overflow-hidden shadow-2xl"
          >
            <img 
              src="https://picsum.photos/seed/ratul/800/1000" 
              alt="Ratul Saha Roy" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 p-4 sm:p-6 glass-pill flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">Based in</p>
                <p className="text-sm font-bold truncate">Sylhet, BD</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-accent" />
              </div>
            </div>
          </motion.div>
          
          {/* Decorative elements */}
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/5 rounded-full blur-3xl"
          />
        </div>
      </div>
      
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-12 sm:mt-20 flex flex-col items-center gap-2 opacity-30"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll to explore</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-muted">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-8 sm:space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-[clamp(2.25rem,min(10vw,14dvh),5.5rem)] lg:text-[clamp(2.5rem,min(8vw,12dvh),6rem)] leading-none mb-6 sm:mb-8">My <br /> Journey</h2>
              <div className="text-base sm:text-lg lg:text-xl text-black/60 font-light leading-relaxed space-y-4">
                <p>
                  I am a passionate and dedicated web developer with a strong focus on building modern, responsive, and user-friendly web applications. I enjoy the MERN stack and love crafting interfaces with smooth animations and interactions—as a developer who cares about UX, not as a separate UI/UX designer role.
                </p>
                <p>
                  I am continuously learning new technologies and sharpening problem-solving through real-world projects and team collaboration. Currently a Web Developer Intern at{" "}
                  <a href="https://kodebykraft.com/" className="text-accent font-medium underline underline-offset-4">KodeByKraft</a>
                  , my goal is to build impactful digital products and grow as a professional developer.
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
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-display mb-1 sm:mb-2">{stat.value}</p>
                  <p className="text-[8px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest font-bold text-black/40 leading-tight">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <h3 className="text-xl sm:text-2xl mb-6 sm:mb-8">Experience & Education</h3>
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
                      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-accent mb-1">{exp.period}</p>
                      <h4 className="text-lg sm:text-xl lg:text-2xl font-display">{exp.role}</h4>
                      <p className="text-sm opacity-60">{exp.company}</p>
                    </div>
                    {exp.link && <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </div>
                  <p className="text-sm font-light leading-relaxed opacity-60 group-hover:opacity-80">{exp.description}</p>
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
                    <h4 className="text-lg sm:text-xl lg:text-2xl font-display">Bachelor&apos;s in CSE</h4>
                    <p className="text-sm opacity-60">Metropolitan University, Bangladesh · Sylhet</p>
                  </div>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-black/40">Ongoing · Bachelor&apos;s degree</p>
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
  key?: number | string;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-white rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] overflow-hidden border border-black/5 hover:shadow-2xl transition-all duration-700"
    >
      <div className="aspect-[16/11] sm:aspect-[16/10] overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-5 sm:p-8 lg:p-10 space-y-4 sm:space-y-6">
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-accent px-2.5 sm:px-3 py-1 bg-accent/10 rounded-full mb-3 sm:mb-4 inline-block">
              {project.category}
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display leading-tight sm:leading-none">{project.title}</h3>
          </div>
          <a 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-11 h-11 sm:w-14 sm:h-14 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all group/btn shrink-0 mt-1"
          >
            <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:rotate-45 transition-transform" />
          </a>
        </div>
        <p className="text-sm sm:text-base text-black/60 font-light leading-relaxed">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag, i) => (
            <span key={i} className="text-[10px] font-bold uppercase tracking-widest text-black/40 border border-black/5 px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 sm:mb-16 lg:mb-20 gap-6 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-[clamp(2.25rem,min(10vw,14dvh),5.5rem)] lg:text-[clamp(2.5rem,min(8vw,12dvh),6rem)] leading-none">Featured <br /> Projects</h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-black/40 max-w-sm text-left md:text-right font-light italic text-sm sm:text-base"
          >
            &ldquo;First make it work, then make it right, then make it fast.&rdquo; — Kent Beck
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TechStack = () => {
  const skills = [
    { name: "React.js", icon: <Layout className="w-6 h-6" />, category: "Frontend" },
    { name: "JavaScript (ES6+)", icon: <Braces className="w-6 h-6" />, category: "Frontend" },
    { name: "Tailwind CSS", icon: <Layers className="w-6 h-6" />, category: "Frontend" },
    { name: "HTML5 & CSS3", icon: <Layout className="w-6 h-6" />, category: "Frontend" },
    { name: "Node.js", icon: <Code2 className="w-6 h-6" />, category: "Backend" },
    { name: "Express.js", icon: <Server className="w-6 h-6" />, category: "Backend" },
    { name: "MongoDB", icon: <Database className="w-6 h-6" />, category: "Database" },
    { name: "MySQL", icon: <Database className="w-6 h-6" />, category: "Database" },
    { name: "Git & GitHub", icon: <Github className="w-6 h-6" />, category: "Tools" },
    { name: "Framer Motion", icon: <Smartphone className="w-6 h-6" />, category: "Animation" },
    { name: "Firebase", icon: <Flame className="w-6 h-6" />, category: "Tools" },
    { name: "REST APIs", icon: <Link2 className="w-6 h-6" />, category: "Integration" },
  ];

  return (
    <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-black text-white overflow-hidden">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20 items-center">
          <div className="lg:col-span-5 text-center lg:text-left">
            <h2 className="text-[clamp(2.25rem,min(10vw,14dvh),5.5rem)] lg:text-[clamp(2.5rem,min(8vw,12dvh),6rem)] leading-none mb-6 sm:mb-8">Tech <br /> Stack</h2>
            <p className="text-white/60 font-light leading-relaxed text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
              I build with intention. Each tool in my arsenal is selected to ensure performance, scalability, and a delightful user experience.
            </p>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {skills.map((skill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[28px] lg:rounded-[32px] border border-white/10 flex flex-col items-center justify-center gap-2 sm:gap-4 text-center transition-colors min-h-[7rem] sm:min-h-0"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center text-accent [&_svg]:w-5 [&_svg]:h-5 sm:[&_svg]:w-6 sm:[&_svg]:h-6">
                  {skill.icon}
                </div>
                <div className="min-w-0 w-full px-0.5">
                  <p className="font-display text-sm sm:text-lg lg:text-xl leading-tight break-words">{skill.name}</p>
                  <p className="text-[8px] sm:text-[9px] uppercase tracking-wider sm:tracking-widest text-white/40 mt-1">{skill.category}</p>
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
    <section id="contact" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto w-full">
        <div className="bg-muted rounded-[28px] sm:rounded-[40px] lg:rounded-[60px] p-6 sm:p-12 md:p-16 lg:p-24 overflow-hidden relative">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20">
            <div className="space-y-8 sm:space-y-12">
              <h2 className="text-[clamp(2.25rem,min(10vw,14dvh),5.5rem)] lg:text-[clamp(2.5rem,min(8vw,12dvh),6rem)] leading-none">Let's <br /> Connect</h2>
              <div className="space-y-5 sm:space-y-6">
                <div className="flex items-start gap-4 sm:gap-6 group cursor-pointer min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-white flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">Email me at</p>
                    <p className="text-base sm:text-lg lg:text-xl font-medium break-all sm:break-words">ratulroy8863@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 sm:gap-6 group cursor-pointer min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-white flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                    <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">Call me at</p>
                    <p className="text-base sm:text-lg lg:text-xl font-medium break-all">+8801795908863</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {[
                  { icon: <Github />, link: "https://github.com/ratulroy8863" },
                  { icon: <Linkedin />, link: LINKEDIN_HREF },
                  { icon: <Mail />, link: "mailto:ratulroy8863@gmail.com" }
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.link} 
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all shrink-0"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <form className="space-y-5 sm:space-y-6 min-w-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 ml-3 sm:ml-4">Name</label>
                  <input type="text" placeholder="John Doe" className="w-full min-w-0 px-5 sm:px-8 py-3.5 sm:py-4 bg-white rounded-full border border-black/5 focus:outline-none focus:border-accent transition-colors text-base" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 ml-3 sm:ml-4">Email</label>
                  <input type="email" placeholder="john@example.com" className="w-full min-w-0 px-5 sm:px-8 py-3.5 sm:py-4 bg-white rounded-full border border-black/5 focus:outline-none focus:border-accent transition-colors text-base" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 ml-3 sm:ml-4">Message</label>
                <textarea rows={4} placeholder="Tell me about your project..." className="w-full min-w-0 px-5 sm:px-8 py-5 sm:py-6 bg-white rounded-[24px] sm:rounded-[32px] border border-black/5 focus:outline-none focus:border-accent transition-colors resize-y min-h-[120px] text-base"></textarea>
              </div>
              <button type="button" className="w-full py-4 sm:py-6 bg-black text-white rounded-full font-bold uppercase tracking-widest text-[10px] sm:text-xs hover:scale-[1.02] transition-transform">Send Message</button>
            </form>
          </div>
          
          {/* Decorative background text */}
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
    <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-black/5 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 text-center md:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 shrink-0 rounded-full bg-black flex items-center justify-center text-white font-bold">R</div>
          <p className="text-xs sm:text-sm font-medium max-w-xs sm:max-w-none">© 2026 Ratul Saha Roy. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-black/40">
          <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
          <a href={RESUME_HREF} download target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors inline-flex items-center gap-1">
            <Download className="w-3 h-3 shrink-0" />
            Resume
          </a>
        </div>
      </div>
    </footer>
  );
};

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-accent transition-colors"
        >
          <ArrowUpRight className="w-6 h-6 -rotate-45" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const SERVICES = [
  {
    id: "01",
    title: "Responsive UI (front-end)",
    description:
      "I turn layouts into fast, responsive React and Tailwind interfaces—clear structure, thoughtful spacing, and motion where it helps. I am a developer who cares about usability and polish; I do not position myself as a dedicated UI/UX designer, but I ship interfaces that feel intentional.",
    icon: <Layout className="w-6 h-6" />
  },
  {
    id: "02",
    title: "Full stack (MERN)",
    description:
      "End-to-end features with MongoDB, Express, React, and Node—REST APIs, auth-aware flows, and dashboards that stay maintainable. Same mindset I use on internships and personal builds: real data, real constraints, real users.",
    icon: <Code2 className="w-6 h-6" />
  },
  {
    id: "03",
    title: "APIs, data & integrations",
    description:
      "REST APIs, Firebase when the product needs realtime or auth helpers, and sensible database choices (MongoDB or MySQL). I focus on predictable contracts between client and server so features are easier to test and extend.",
    icon: <Link2 className="w-6 h-6" />
  }
];

const TESTIMONIALS = [
  {
    name: "Team feedback",
    role: "Development environment",
    text: "Ratul asks good questions before he builds, ships UI that matches the spec, and is easy to collaborate with on day-to-day tickets.",
    avatar: "https://i.pravatar.cc/150?u=ratul-peer-a"
  },
  {
    name: "Mentor note",
    role: "Code review & pairing",
    text: "Strong React fundamentals and a clear willingness to learn—he iterates quickly when we discuss performance or cleaner component structure.",
    avatar: "https://i.pravatar.cc/150?u=ratul-peer-b"
  }
];

const Services = () => {
  const [activeTab, setActiveTab] = useState("01");

  return (
    <section id="services" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20">
          <div className="space-y-8 sm:space-y-12 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-[clamp(2.25rem,min(10vw,14dvh),5.5rem)] lg:text-[clamp(2.5rem,min(8vw,12dvh),6rem)] leading-none mb-6 sm:mb-8">What I <br /> Can Do</h2>
              <p className="text-base sm:text-lg lg:text-xl text-black/60 font-light leading-relaxed">
                Three ways I help teams and my own projects: solid front-end implementation, MERN-style full stack delivery, and clean integration between apps, APIs, and data stores.
              </p>
            </motion.div>

            <div className="space-y-3 sm:space-y-4">
              {SERVICES.map((service) => (
                <motion.div
                  key={service.id}
                  layout
                  onClick={() => setActiveTab(service.id)}
                  className={`p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[28px] lg:rounded-[32px] cursor-pointer transition-all duration-500 border ${
                    activeTab === service.id 
                    ? "bg-black text-white border-black" 
                    : "bg-muted text-black border-transparent hover:border-black/10"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 min-w-0">
                      <span className="text-xl sm:text-2xl font-display opacity-40 shrink-0">{service.id}</span>
                      <h3 className="text-lg sm:text-2xl lg:text-3xl font-display leading-tight">{service.title}</h3>
                    </div>
                    <motion.div
                      animate={{ rotate: activeTab === service.id ? 45 : 0 }}
                      className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full border border-current flex items-center justify-center self-end sm:self-auto"
                    >
                      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                  </div>
                  
                  <AnimatePresence>
                    {activeTab === service.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg opacity-60 font-light leading-relaxed">
                          {service.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative w-full aspect-[4/3] sm:aspect-square mx-auto lg:mx-0 rounded-[32px] sm:rounded-[48px] lg:rounded-[60px] overflow-hidden order-1 lg:order-2 max-w-lg lg:max-w-none">
            <motion.img
              key={activeTab}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              src={`https://picsum.photos/seed/service-${activeTab}/1000/1000`}
              alt="Service"
              className="w-full h-full object-cover grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-accent/10 mix-blend-overlay" />
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  return (
    <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-muted">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-[clamp(2.25rem,min(10vw,14dvh),5.5rem)] lg:text-[clamp(2.5rem,min(8vw,12dvh),6rem)] leading-none mb-4 sm:mb-6">Client <br /> Voices</h2>
          <p className="text-black/40 font-light italic text-sm sm:text-base px-2">"Trust is the foundation of every great project."</p>
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
                {[...Array(5)].map((_, j) => <Award key={j} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />)}
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-light leading-relaxed italic">"{t.text}"</p>
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full grayscale" />
                <div className="min-w-0 text-left">
                  <p className="font-display text-lg sm:text-xl truncate">{t.name}</p>
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-black/40">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function App() {
  return (
    <div className="relative">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Projects />
      <TechStack />
      <Testimonials />
      <Contact />
      <Footer />
      <BackToTop />
      
      {/* Global background elements */}
      <div className="fixed inset-0 -z-50 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(93,95,239,0.03),transparent_70%)]" />
      </div>
    </div>
  );
}
