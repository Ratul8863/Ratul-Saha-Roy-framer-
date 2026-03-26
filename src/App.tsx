/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code2, 
  Layout, 
  Database, 
  Smartphone,
  ArrowUpRight,
  ChevronDown,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Download
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

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
  link?: string;
}

// --- Data ---
const PROJECTS: Project[] = [
  {
    title: "Assubah",
    description: "A professional platform built for Assubah, focusing on clean UI and robust functionality.",
    tags: ["React", "Tailwind", "Node.js"],
    link: "https://www.assubah.com/",
    image: "https://picsum.photos/seed/assubah/800/600",
    category: "Real Project"
  },
  {
    title: "Assubah Outreach",
    description: "An extension project for Assubah focusing on community outreach and engagement.",
    tags: ["React", "Express", "MongoDB"],
    link: "https://www.assubahoutreach.com/",
    image: "https://picsum.photos/seed/outreach/800/600",
    category: "Real Project"
  },
  {
    title: "Hostel Meals",
    description: "A web app that streamlines hostel food management through a secure role-based system.",
    tags: ["React", "Node.js", "Stripe", "JWT"],
    link: "#",
    image: "https://picsum.photos/seed/hostel/800/600",
    category: "Full Stack"
  },
  {
    title: "HobbyHub",
    description: "A community-driven web app where people can discover, join, or create local hobby-based groups.",
    tags: ["React", "Firebase", "Express"],
    link: "#",
    image: "https://picsum.photos/seed/hobby/800/600",
    category: "Community"
  }
];

const EXPERIENCES: Experience[] = [
  {
    role: "Web Developer Intern",
    company: "Kodebykraft",
    period: "Jan 2024 - Present",
    description: "Working on real-world projects, building scalable web applications and collaborating with senior developers.",
    link: "https://kodebykraft.com/"
  }
];

// --- Components ---

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-fit"
    >
      <div className="glass-pill px-6 py-3 flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold text-xs">R</div>
          <span className="text-xs font-semibold tracking-widest uppercase hidden sm:block">Available for work</span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
        <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-black/60">
          <a href="#home" className="hover:text-black transition-colors">Home</a>
          <a href="#about" className="hover:text-black transition-colors">About</a>
          <a href="#services" className="hover:text-black transition-colors">Services</a>
          <a href="#projects" className="hover:text-black transition-colors">Projects</a>
          <a href="#contact" className="hover:text-black transition-colors px-4 py-2 bg-black text-white rounded-full">Contact</a>
        </div>
      </div>
    </motion.nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center pt-32 px-6 overflow-hidden">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl md:text-9xl leading-[0.85] mb-6">
              Digital <br />
              <span className="text-accent">Architect</span>
            </h1>
            <p className="text-lg md:text-xl text-black/60 max-w-lg font-light leading-relaxed">
              I'm Ratul Saha Roy, a Full Stack Developer based in Bangladesh. I blend strategy and creativity to build high-performance web experiences.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4"
          >
            <a href="#projects" className="px-8 py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform">View My Work</a>
            <a href="#" download className="px-8 py-4 border border-black/10 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Resume
            </a>
          </motion.div>
        </div>

        <div className="lg:col-span-5 relative perspective-1000">
          <motion.div
            initial={{ opacity: 0, rotateY: 20, scale: 0.8 }}
            whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl"
          >
            <img 
              src="https://picsum.photos/seed/ratul/800/1000" 
              alt="Ratul Saha Roy" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-8 left-8 right-8 p-6 glass-pill flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">Based in</p>
                <p className="text-sm font-bold">Sylhet, BD</p>
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
        className="mt-20 flex flex-col items-center gap-2 opacity-30"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll to explore</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-32 px-6 bg-muted">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-6xl md:text-8xl leading-none mb-8">My <br /> Journey</h2>
              <p className="text-xl text-black/60 font-light leading-relaxed">
                Currently a Web Developer Intern at <a href="https://kodebykraft.com/" className="text-accent font-medium underline underline-offset-4">Kodebykraft</a>, I've spent the last few months diving deep into real-world production environments. 
                My focus is on creating seamless, high-performance digital experiences that solve complex problems.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-8">
              {[
                { label: "Completed Projects", value: "10+" },
                { label: "Real World Apps", value: "2" },
                { label: "Technologies", value: "15+" },
                { label: "Happy Clients", value: "5+" }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 bg-white rounded-3xl border border-black/5"
                >
                  <p className="text-4xl font-display mb-2">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl mb-8">Experience & Education</h3>
            <div className="space-y-4">
              {EXPERIENCES.map((exp, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="p-8 bg-white rounded-3xl border border-black/5 group hover:bg-black hover:text-white transition-all duration-500 cursor-default"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">{exp.period}</p>
                      <h4 className="text-2xl font-display">{exp.role}</h4>
                      <p className="text-sm opacity-60">{exp.company}</p>
                    </div>
                    {exp.link && <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </div>
                  <p className="text-sm font-light leading-relaxed opacity-60 group-hover:opacity-80">{exp.description}</p>
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="p-8 bg-white rounded-3xl border border-black/5"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-black/40" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-display">B.Sc. in CSE</h4>
                    <p className="text-sm opacity-60">Metropolitan University, Sylhet</p>
                  </div>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-black/40">2023 - Present</p>
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
      className="group relative bg-white rounded-[40px] overflow-hidden border border-black/5 hover:shadow-2xl transition-all duration-700"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-10 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent px-3 py-1 bg-accent/10 rounded-full mb-4 inline-block">
              {project.category}
            </span>
            <h3 className="text-4xl font-display leading-none">{project.title}</h3>
          </div>
          <a 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all group/btn"
          >
            <ArrowUpRight className="w-6 h-6 group-hover/btn:rotate-45 transition-transform" />
          </a>
        </div>
        <p className="text-black/60 font-light leading-relaxed">{project.description}</p>
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
    <section id="projects" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-6xl md:text-8xl leading-none">Featured <br /> Projects</h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-black/40 max-w-sm text-right font-light italic"
          >
            "Design is not just what it looks like and feels like. Design is how it works."
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
    { name: "Node.js", icon: <Code2 className="w-6 h-6" />, category: "Backend" },
    { name: "MongoDB", icon: <Database className="w-6 h-6" />, category: "Database" },
    { name: "Tailwind CSS", icon: <Layout className="w-6 h-6" />, category: "Styling" },
    { name: "Framer Motion", icon: <Smartphone className="w-6 h-6" />, category: "Animation" },
    { name: "TypeScript", icon: <Code2 className="w-6 h-6" />, category: "Language" },
  ];

  return (
    <section className="py-32 px-6 bg-black text-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          <div className="lg:col-span-5">
            <h2 className="text-6xl md:text-8xl leading-none mb-8">Tech <br /> Stack</h2>
            <p className="text-white/60 font-light leading-relaxed text-lg">
              I build with intention. Each tool in my arsenal is selected to ensure performance, scalability, and a delightful user experience.
            </p>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {skills.map((skill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                className="p-8 rounded-[32px] border border-white/10 flex flex-col items-center justify-center gap-4 text-center transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-accent">
                  {skill.icon}
                </div>
                <div>
                  <p className="font-display text-xl">{skill.name}</p>
                  <p className="text-[9px] uppercase tracking-widest text-white/40">{skill.category}</p>
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
    <section id="contact" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-muted rounded-[60px] p-12 md:p-24 overflow-hidden relative">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-12">
              <h2 className="text-6xl md:text-8xl leading-none">Let's <br /> Connect</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">Email me at</p>
                    <p className="text-xl font-medium">ratulroy8863@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">Call me at</p>
                    <p className="text-xl font-medium">+8801795908863</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                {[
                  { icon: <Github />, link: "https://github.com/ratulroy8863" },
                  { icon: <Linkedin />, link: "https://linkedin.com/in/ratulroy8863" },
                  { icon: <Mail />, link: "mailto:ratulroy8863@gmail.com" }
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.link} 
                    className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 ml-4">Name</label>
                  <input type="text" placeholder="John Doe" className="w-full px-8 py-4 bg-white rounded-full border border-black/5 focus:outline-none focus:border-accent transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 ml-4">Email</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-8 py-4 bg-white rounded-full border border-black/5 focus:outline-none focus:border-accent transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 ml-4">Message</label>
                <textarea rows={4} placeholder="Tell me about your project..." className="w-full px-8 py-6 bg-white rounded-[32px] border border-black/5 focus:outline-none focus:border-accent transition-colors resize-none"></textarea>
              </div>
              <button className="w-full py-6 bg-black text-white rounded-full font-bold uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform">Send Message</button>
            </form>
          </div>
          
          {/* Decorative background text */}
          <div className="absolute -bottom-20 -right-20 text-[20vw] font-display text-black/5 leading-none pointer-events-none select-none">
            HIRE
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-black/5 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold">R</div>
          <p className="text-sm font-medium">© 2026 Ratul Saha Roy. All rights reserved.</p>
        </div>
        <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-black/40">
          <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
          <a href="#" download className="hover:text-black transition-colors flex items-center gap-1">
            <Download className="w-3 h-3" />
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
          className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-accent transition-colors"
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
    title: "UI/UX Design",
    description: "Creating intuitive, user-centered digital experiences that blend storytelling, structure, and design into every project.",
    icon: <Layout className="w-6 h-6" />
  },
  {
    id: "02",
    title: "Full Stack Development",
    description: "Building robust, scalable web applications using modern technologies like React, Node.js, and MongoDB.",
    icon: <Code2 className="w-6 h-6" />
  },
  {
    id: "03",
    title: "Brand Identity",
    description: "Developing cohesive brand identities that communicate your message effectively and resonate with your audience.",
    icon: <Award className="w-6 h-6" />
  }
];

const TESTIMONIALS = [
  {
    name: "John Harris",
    role: "Marketing Director",
    text: "Ratul truly understood my vision and turned it into impactful designs. The results went beyond my expectations!",
    avatar: "https://i.pravatar.cc/150?u=john"
  },
  {
    name: "Michael Lee",
    role: "Product Manager",
    text: "He took the time to understand our goals and delivered a design that resonated perfectly with our audience.",
    avatar: "https://i.pravatar.cc/150?u=michael"
  }
];

const Services = () => {
  const [activeTab, setActiveTab] = useState("01");

  return (
    <section id="services" className="py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-6xl md:text-8xl leading-none mb-8">What I <br /> Can Do</h2>
              <p className="text-xl text-black/60 font-light leading-relaxed">
                As a digital architect, I am a visual storyteller, crafting experiences that connect deeply and spark creativity.
              </p>
            </motion.div>

            <div className="space-y-4">
              {SERVICES.map((service) => (
                <motion.div
                  key={service.id}
                  layout
                  onClick={() => setActiveTab(service.id)}
                  className={`p-8 rounded-[32px] cursor-pointer transition-all duration-500 border ${
                    activeTab === service.id 
                    ? "bg-black text-white border-black" 
                    : "bg-muted text-black border-transparent hover:border-black/10"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-6">
                      <span className="text-2xl font-display opacity-40">{service.id}</span>
                      <h3 className="text-3xl font-display">{service.title}</h3>
                    </div>
                    <motion.div
                      animate={{ rotate: activeTab === service.id ? 45 : 0 }}
                      className="w-10 h-10 rounded-full border border-current flex items-center justify-center"
                    >
                      <ArrowUpRight className="w-5 h-5" />
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
                        <p className="mt-6 text-lg opacity-60 font-light leading-relaxed">
                          {service.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative aspect-square rounded-[60px] overflow-hidden">
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
    <section className="py-32 px-6 bg-muted">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-6xl md:text-8xl leading-none mb-6">Client <br /> Voices</h2>
          <p className="text-black/40 font-light italic">"Trust is the foundation of every great project."</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-12 bg-white rounded-[40px] border border-black/5 space-y-8"
            >
              <div className="flex gap-1 text-accent">
                {[...Array(5)].map((_, i) => <Award key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-2xl font-light leading-relaxed italic">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full grayscale" />
                <div>
                  <p className="font-display text-xl">{t.name}</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">{t.role}</p>
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
