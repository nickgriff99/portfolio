import type { Project } from "../types";

/** Showcase order: strongest / client work first. Swap image paths to WebP/PNG captures when available. */
export const projectsData: Project[] = [
  {
    id: 6,
    title: "B.G.M.I.D.",
    category: "frontend",
    tagline: "Mobile car detailing — booking-focused marketing site.",
    description:
      "Production site for a mobile detailing business: clear service positioning, strong calls to action, and a polished feel that matches the on-site brand experience.",
    highlights: [
      "Positioned premium mobile detailing with a booking-first hero and clear service tiers.",
      "Built in React + TypeScript with a responsive, performance-minded layout.",
      "Live on Netlify — real traffic, real business outcomes.",
    ],
    role: "Solo build — UI, content structure, deploy",
    metrics: ["Production", "React + Vite"],
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Responsive UI"],
    imageSrc: "/projects/bgmid-hero.png",
    imageAlt:
      "Hero section of the B.G.M.I.D. site: headline, branding, and booking-focused layout for mobile car detailing",
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
    highlights: [
      "Slash commands and automation tailored for community moderators.",
      "Modular handlers and API integration for extensible server tooling.",
      "Public Netlify demo for the music-bot build; invite from the repo to run in your server.",
    ],
    role: "Solo backend + Discord integration",
    metrics: ["Discord.js", "Live demo"],
    tech: ["Node.js", "Discord.js", "JavaScript", "API Integration"],
    imageSrc: "/projects/discord-bot-hero.png",
    imageAlt:
      "Hero section of the YouTube music Discord bot demo: headline and call-to-action on Netlify",
    liveUrl: "https://youtubemusicbot.netlify.app/",
    githubLink: "https://github.com/nickgriff99/discord-bot",
    deploymentNote: "Open the live demo above, or invite the bot from the repo to use it in Discord.",
  },
  {
    id: 2,
    title: "SaaS Landing Page",
    category: "frontend",
    tagline: "Marketing layout with motion and mobile-first CSS.",
    description:
      "A responsive SaaS landing page showcasing advanced CSS, subtle animations, and a tight visual hierarchy.",
    highlights: [
      "Marketing sections with strong typographic hierarchy and CTA rhythm.",
      "CSS-driven motion and responsive breakpoints without a JS framework.",
      "Static assets — clone and open locally for the full experience.",
    ],
    role: "Front-end — layout & motion study",
    metrics: ["Static HTML/CSS"],
    tech: ["HTML5", "CSS3", "Responsive Design", "CSS Animations"],
    imageSrc: "/projects/saas-hero.png",
    imageAlt: "Hero section of the SaaS landing page: headline, product visuals, and marketing layout",
    githubLink: "https://github.com/nickgriff99/css-final-project-saas",
    deploymentNote: "Not hosted online — run a static server from the repo to view.",
  },
  {
    id: 3,
    title: "Battleship Game",
    category: "frontend",
    tagline: "Classic naval strategy in the browser.",
    description:
      "An interactive Battleship game with clear UI feedback, game-state logic, and engaging two-player flow.",
    highlights: [
      "Game loop with placement, turns, and hit/miss feedback in the DOM.",
      "Readable state handling for ships, shots, and win conditions.",
      "Best experienced locally — full interactivity after clone.",
    ],
    role: "Solo — game logic + UI",
    metrics: ["Vanilla JS"],
    tech: ["JavaScript", "HTML5", "CSS3", "Game Logic"],
    imageSrc: "/projects/battleship-hero.png",
    imageAlt:
      "Terminal session running Battleship with debug board and a guess in progress (Node.js CLI)",
    githubLink: "https://github.com/nickgriff99/battleship-app",
    deploymentNote: "Not deployed publicly — open from the repo for the interactive build.",
  },
  {
    id: 4,
    title: "Node.js Calculator",
    category: "backend",
    tagline: "HTTP API and server-side math handling.",
    description:
      "A server-side calculator built with Node.js and Express, focused on request handling and clean backend structure.",
    highlights: [
      "REST-style routes for calculator operations and validation.",
      "Express middleware structure ready to extend with tests or a thin client.",
      "Clone locally to hit the API or bundled client.",
    ],
    role: "Backend API focus",
    metrics: ["Express"],
    tech: ["Node.js", "Express.js", "JavaScript", "Backend Logic"],
    imageSrc: "/projects/node-calculator-hero.png",
    imageAlt:
      "Terminal session using the Node.js calculator CLI with a full equation and computed result",
    githubLink: "https://github.com/nickgriff99/node-calculator",
    deploymentNote: "Start the server from the repo to exercise the API.",
  },
  {
    id: 5,
    title: "Responsive Website",
    category: "frontend",
    tagline: "Cross-device layout and typographic rhythm.",
    description:
      "A fully responsive marketing-style site demonstrating modern CSS, fluid spacing, and mobile-first patterns.",
    highlights: [
      "Fluid spacing scale and breakpoint strategy across viewports.",
      "Semantic HTML with accessible landmarks and readable type rhythm.",
      "Open locally for a faithful preview matching the coursework layout.",
    ],
    role: "Responsive CSS study",
    metrics: ["Mobile-first"],
    tech: ["HTML5", "CSS3", "Responsive Design", "Mobile-First"],
    imageSrc: "/projects/responsive-hero.png",
    imageAlt: "Hero section of the responsive marketing-style site showing layout and typography",
    githubLink: "https://github.com/nickgriff99/css-responsive-website",
    deploymentNote: "Not hosted publicly — use Live Server or similar from the repo.",
  },
];
