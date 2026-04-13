import type { Project } from "../types";

/** Order is showcase order: B.G.M.I.D. first. Swap `/projects/placeholder.svg` for WebP/PNG (~16:10, ~1600px wide) when you have captures. */
export const projectsData: Project[] = [
  {
    id: 6,
    title: "B.G.M.I.D.",
    category: "frontend",
    tagline: "Mobile car detailing — booking-focused marketing site.",
    description:
      "Production site for a mobile detailing business: clear service positioning, strong calls to action, and a polished feel that matches the on-site brand experience.",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Responsive UI"],
    imageSrc: "/projects/placeholder.svg",
    imageAlt: "Screenshot of the B.G.M.I.D. mobile car detailing website",
    liveUrl: "https://bg-details.com/",
    isClientProject: true,
  },
  {
    id: 1,
    title: "Discord Bot",
    category: "backend",
    tagline: "Server automation and community tooling in Node.js.",
    description:
      "A feature-rich Discord bot providing server management, moderation tools, and interactive commands for stronger community engagement.",
    tech: ["Node.js", "Discord.js", "JavaScript", "API Integration"],
    imageSrc: "/projects/placeholder.svg",
    imageAlt: "Abstract placeholder representing the Discord bot project",
    githubLink: "https://github.com/nickgriff99/discord-bot",
    deploymentNote: "Runs inside Discord — there is no public web URL. Invite and run from your server to try it.",
  },
  {
    id: 2,
    title: "SaaS Landing Page",
    category: "frontend",
    tagline: "Marketing layout with motion and mobile-first CSS.",
    description:
      "A responsive SaaS landing page showcasing advanced CSS, subtle animations, and a tight visual hierarchy.",
    tech: ["HTML5", "CSS3", "Responsive Design", "CSS Animations"],
    imageSrc: "/projects/placeholder.svg",
    imageAlt: "Abstract placeholder representing the SaaS landing page project",
    githubLink: "https://github.com/nickgriff99/css-final-project-saas",
    deploymentNote: "Not hosted online — open the repo locally or run a static server to view the full layout.",
  },
  {
    id: 3,
    title: "Battleship Game",
    category: "frontend",
    tagline: "Classic naval strategy in the browser.",
    description:
      "An interactive Battleship game with clear UI feedback, game-state logic, and engaging two-player flow.",
    tech: ["JavaScript", "HTML5", "CSS3", "Game Logic"],
    imageSrc: "/projects/placeholder.svg",
    imageAlt: "Abstract placeholder representing the Battleship game project",
    githubLink: "https://github.com/nickgriff99/battleship-app",
    deploymentNote: "Not deployed publicly — clone the repo and open the app locally for the full interactive experience.",
  },
  {
    id: 4,
    title: "Node.js Calculator",
    category: "backend",
    tagline: "HTTP API and server-side math handling.",
    description:
      "A server-side calculator built with Node.js and Express, focused on request handling and clean backend structure.",
    tech: ["Node.js", "Express.js", "JavaScript", "Backend Logic"],
    imageSrc: "/projects/placeholder.svg",
    imageAlt: "Abstract placeholder representing the Node.js calculator project",
    githubLink: "https://github.com/nickgriff99/node-calculator",
    deploymentNote: "Backend-only demo — start the server from the repo to exercise the API or use the bundled client if present.",
  },
  {
    id: 5,
    title: "Responsive Website",
    category: "frontend",
    tagline: "Cross-device layout and typographic rhythm.",
    description:
      "A fully responsive marketing-style site demonstrating modern CSS, fluid spacing, and mobile-first patterns.",
    tech: ["HTML5", "CSS3", "Responsive Design", "Mobile-First"],
    imageSrc: "/projects/placeholder.svg",
    imageAlt: "Abstract placeholder representing the responsive website project",
    githubLink: "https://github.com/nickgriff99/css-responsive-website",
    deploymentNote: "Not hosted publicly — open files locally or use Live Server for a faithful preview matching the screenshots.",
  },
];
