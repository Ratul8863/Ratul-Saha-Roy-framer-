/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  title: string;
  description: string;
  tags: string[];
  link: string;
  image: string;
  category: string;
}

export const PROJECTS: Project[] = [
  {
    title: "Assubah",
    description:
      "Developed a modern, responsive marketing and platform experience for Assubah—structured layout, clear information hierarchy, and attention to performance. Focused on clean UI, smooth interactions, and a maintainable front-end so the site stays fast and easy to extend.",
    tags: ["React", "Tailwind CSS", "Responsive UI", "Performance"],
    link: "https://www.assubah.com/",
    image: "/assubah.png",
    category: "Live site",
  },
  {
    title: "As-Subah Outreach",
    description:
      "Charity website for sustainable support across multiple countries—donations, appeals, and impact storytelling for As-Subah Outreach. Emphasis on readable content, responsive sections, and reliable structure so donors can explore appeals and trust how the organization presents its work online.",
    tags: ["React", "Express", "MongoDB", "REST APIs"],
    link: "https://www.assubahoutreach.com/",
    image: "/outreach.png",
    category: "Live site",
  },
  {
    title: "Jubileean Football Fest",
    description:
      "Official site for the annual alumni football tournament at Government Jubilee High School, Sunamganj. Includes live match control and scores (real-time updates), fixtures, teams, players, leaderboards, gallery, news, and an admin CMS—built with React, Node, MongoDB, and Socket.IO. Deployed on Vercel.",
    tags: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "MongoDB",
      "Socket.IO",
      "REST API",
    ],
    link: "https://jubileean-football-fest.vercel.app/",
    image: "/jubileanfest.png",
    category: "Live site",
  },
  {
    title: "Hostel Meals",
    description:
      "Full stack app for hostel meal management: role-based access, orders, and secure flows. Sharpens my MERN patterns—REST APIs, auth-minded design, and dashboards that stay usable on mobile.",
    tags: ["React", "Node.js", "Stripe", "JWT"],
    link: "#",
    image: "https://picsum.photos/seed/hostel/800/600",
    category: "Full stack",
  },
  {
    title: "HobbyHub",
    description:
      "Community product for discovering and joining local hobby groups—real-time friendly features with Firebase plus Express APIs. Practice in list/detail UX, forms, and collaborative data.",
    tags: ["React", "Firebase", "Express"],
    link: "#",
    image: "https://picsum.photos/seed/hobby/800/600",
    category: "Community",
  },
];
