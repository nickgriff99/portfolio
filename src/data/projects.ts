import type { Project } from "../types";

export const projectsData: Project[] = [
  {
    id: 1,
    title: "Discord Bot",
    category: "backend",
    description:
      "A feature-rich Discord bot built with Node.js, providing server management, moderation tools, and interactive commands for enhanced community engagement.",
    tech: ["Node.js", "Discord.js", "JavaScript", "API Integration"],
    githubLink: "https://github.com/nickgriff99/discord-bot",
    featured: true,
  },
  {
    id: 2,
    title: "SaaS Landing Page",
    category: "frontend",
    description:
      "A modern, responsive SaaS landing page showcasing advanced CSS techniques, animations, and mobile-first design principles.",
    tech: ["HTML5", "CSS3", "Responsive Design", "CSS Animations"],
    githubLink: "https://github.com/nickgriff99/css-final-project-saas",
    featured: true,
  },
  {
    id: 3,
    title: "Battleship Game",
    category: "frontend",
    description:
      "An interactive Battleship game application featuring game logic, user interface design, and engaging gameplay mechanics.",
    tech: ["JavaScript", "HTML5", "CSS3", "Game Logic"],
    githubLink: "https://github.com/nickgriff99/battleship-app",
    featured: true,
  },
  {
    id: 4,
    title: "Node.js Calculator",
    category: "backend",
    description:
      "A server-side calculator application built with Node.js, demonstrating backend development skills and mathematical operations processing.",
    tech: ["Node.js", "Express.js", "JavaScript", "Backend Logic"],
    githubLink: "https://github.com/nickgriff99/node-calculator",
    featured: false,
  },
  {
    id: 5,
    title: "Responsive Website",
    category: "frontend",
    description:
      "A fully responsive website demonstrating modern CSS techniques, mobile-first design, and cross-device compatibility.",
    tech: ["HTML5", "CSS3", "Responsive Design", "Mobile-First"],
    githubLink: "https://github.com/nickgriff99/css-responsive-website",
    featured: false,
  },
];
