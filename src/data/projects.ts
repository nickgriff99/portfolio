import type { Project } from "../types";

/** Showcase order: strongest technical depth first, client work close behind. Swap image paths to WebP/PNG captures when available. */
export const projectsData: Project[] = [
  {
    id: 7,
    title: "ClackForge",
    category: "fullstack",
    tagline: "Custom mechanical keyboard e-commerce with a live 3D configurator.",
    description:
      "Full-stack e-commerce platform for custom mechanical keyboards. Real-time Three.js configurator, Stripe checkout, Google/email auth, and a concurrency-safe inventory system backing it all — built and tested like production software, not a demo.",
    highlights: [
      "Live 3D keyboard configurator built with Three.js and React Three Fiber.",
      "Full auth (Passport local + Google OAuth), Stripe Checkout, and Resend transactional email.",
      "Full test pyramid: Vitest unit tests, Playwright end-to-end, and axe-core accessibility checks.",
    ],
    role: "Solo full-stack build — frontend, backend, 3D, payments",
    metrics: ["React 19 + Three.js", "Stripe", "Full test coverage"],
    tech: ["React", "TypeScript", "Three.js", "Express", "PostgreSQL", "Prisma", "Stripe", "Tailwind CSS"],
    imageSrc: "/projects/clackforge-hero.png",
    imageAlt: "Hero section of ClackForge: live 3D mechanical keyboard configurator and product layout",
    liveUrl: "https://clackforge-client.onrender.com",
    githubLink: "https://github.com/nickgriff99/clackforge",
  },
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
    id: 8,
    title: "TheListingHub",
    category: "fullstack",
    tagline: "Commercial real estate classifieds platform rebuild.",
    description:
      "Rebuild of a CRE (commercial real estate) listings platform: Next.js front end, Supabase Postgres with row-level security for auth and data access, and Stripe Checkout for paid listings.",
    highlights: [
      "Next.js 16 + React 19 app — shows range beyond the Vite-based projects elsewhere on this page.",
      "Supabase Auth with Postgres row-level security policies, not just app-layer permission checks.",
      "Stripe Checkout integration for paid listing tiers.",
    ],
    role: "Solo full-stack rebuild",
    metrics: ["Next.js 16", "Supabase RLS", "Stripe"],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Stripe", "Framer Motion"],
    imageSrc: "/projects/thelistinghub-hero.png",
    imageAlt: "Hero section of TheListingHub: commercial real estate listings platform",
    liveUrl: "https://thelistinghub-demo.netlify.app",
    githubLink: "https://github.com/nickgriff99/preishare-project",
  },
  {
    id: 9,
    title: "Streak Garden",
    category: "fullstack",
    tagline: "Habit tracker where your plants grow from real check-ins.",
    description:
      "A PERN-stack habit tracker: consistent daily check-ins grow a small garden over time. Plain SQL over an ORM by choice, for direct control and clarity. Recently went through a dedicated security and reliability hardening pass.",
    highlights: [
      "Vite + React frontend, Express + PostgreSQL backend, deployed on Render.",
      "Hand-written SQL (no ORM) for transparent, auditable queries.",
      "Hardened for production: crash-proof connection pool, pinned JWT algorithm, input-length limits, real error boundaries.",
    ],
    role: "Solo full-stack build",
    metrics: ["PERN stack", "Security-hardened"],
    tech: ["React", "Vite", "Express", "PostgreSQL", "JavaScript", "JWT Auth"],
    imageSrc: "/projects/streak-garden-hero.png",
    imageAlt: "Hero section of Streak Garden: habit tracker with a growing garden visual",
    liveUrl: "https://streak-garden-client.onrender.com/",
    githubLink: "https://github.com/nickgriff99/streak-garden",
  },
  {
    id: 10,
    title: "receipts-bot",
    category: "backend",
    tagline: "A Discord AI voice companion — named as a joke, built for real.",
    description:
      "An ambient AI co-host for Discord voice channels: listens, transcribes, responds in character using Claude, and talks back — a real-time streaming pipeline across four different services. Discontinued after a few months once the combined Deepgram, Claude, and ElevenLabs API costs weren't sustainable for a just-for-fun project.",
    highlights: [
      "Real-time pipeline: Deepgram speech-to-text to Claude Haiku to ElevenLabs text-to-speech, all streaming.",
      "PostgreSQL-backed memory: per-user facts and running jokes, capped and pruned automatically.",
      "Built-in cost control, rate limiting, and explicit opt-in/opt-out consent gates for every listener.",
    ],
    role: "Solo build — real-time audio pipeline + multi-API integration",
    metrics: ["Streaming STT/TTS", "Multi-API pipeline", "Discontinued — cost"],
    tech: ["TypeScript", "Node.js", "Discord.js", "Deepgram", "Anthropic API", "ElevenLabs", "PostgreSQL", "Docker"],
    githubLink: "https://github.com/nickgriff99/receipts-bot",
    deploymentNote:
      "No public demo possible — it's a Discord bot that needs its own bot token and paid API keys to run. See the repo's README and ARCHITECTURE.md for the full pipeline breakdown.",
  },
];
