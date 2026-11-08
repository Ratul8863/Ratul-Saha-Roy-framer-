export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  skills: string[];
  tone: "navy" | "slate";
};

export const servicesIntro =
  "Practical software services spanning full-stack product delivery, AI/ML exploration, and research-driven computing.";

export const services: ServiceItem[] = [
  {
    id: "full-stack",
    title: "Full-Stack Development",
    description:
      "I build complete web applications across the frontend and backend using React.js, Next.js, Node.js, Express.js, MongoDB, and MySQL. I work with authentication, REST APIs, dashboards, CRUD systems, payment integrations, and real-world application workflows.",
    skills: [
      "React.js",
      "Next.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "REST APIs",
    ],
    tone: "navy",
  },
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    description:
      "I work with Artificial Intelligence and Machine Learning and am currently expanding into Deep Learning. I enjoy building predictive and intelligent systems, experimenting with data-driven approaches, and exploring how AI can be applied to practical software and research problems.",
    skills: [
      "Machine Learning",
      "Deep Learning",
      "Data Analysis",
      "Python",
      "Predictive Systems",
    ],
    tone: "slate",
  },
  {
    id: "research-data",
    title: "Research, Data & Geospatial",
    description:
      "I work on research problems involving Machine Learning, climate data, GIS, remote sensing, and environmental analysis — including satellite-data processing and spatiotemporal analysis.",
    skills: [
      "GIS",
      "Remote Sensing",
      "Climate Data",
      "QGIS",
      "Spatiotemporal Analysis",
    ],
    tone: "navy",
  },
];

export const certificationsIntro =
  "Selected recognitions and credentials from hackathons, competitions, and professional development.";

export const ctaCopy =
  "Got a product idea or technical challenge? Let's turn it into working software.";
