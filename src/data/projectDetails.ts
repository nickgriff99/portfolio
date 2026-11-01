import type { ProjectDetail } from "../types";

/** Richer per-project detail content, keyed by Project.id. Powers expanded card/detail views. */
export const projectDetails: Record<number, ProjectDetail> = {
  7: {
    cardSnippet:
      "Full-stack e-commerce store for custom mechanical keyboards, built around a real-time 3D configurator backed by a real Postgres database.",
    featureBreakdown: [
      "3D configurator at /build with procedural keyboards (layouts, cases, plates, switches, keycaps, per-key recoloring), schema-driven compatibility rules, server-reruns pricing so the client price is never trusted, plus shareable URLs, undo/redo, and camera presets.",
      "Filterable, sorted, and paginated catalog with generated SVG product art instead of image assets.",
      "Group buy drops with live countdown and stock, 10-minute inventory holds enforced via database row lock, verified under a concurrent-browser test where only one of several simultaneous reservations wins.",
      "Accounts via email/password and Google OAuth sharing one user table with server-side sessions, guest cart merge on login, and Stripe Checkout test mode with idempotent webhooks.",
      "Admin dashboard with product/variant CRUD, enforced order status transitions, and revenue/order-trend analytics from real data.",
      "Everything 3D also exists as accessible text with full keyboard navigation, and prefers-reduced-motion is honored throughout.",
    ],
  },
  8: {
    cardSnippet:
      "Modern rebuild of a commercial real estate classifieds platform with Supabase auth, Stripe checkout, and a motion-driven listings UX.",
    featureBreakdown: [
      "Marketing home plus a full listings flow: /listings catalog, /listings/[slug] detail with express interest, login, account profile, and a sponsor checkout flow at /get-listed.",
      "Supabase Auth (email and Google) with row-level security policies guarding Postgres data, not just app-layer checks.",
      "Stripe Checkout Sessions with signed webhooks writing sponsor payments into a listing_payments table.",
      "Built with Next.js 16 App Router, React 19, Tailwind CSS v4, and Framer Motion for the marketing and listings UX.",
      "Demo flow runs end to end: sign in, browse listings, express interest, pay with a Stripe test card, and see the resulting rows land in Supabase.",
    ],
  },
  10: {
    cardSnippet:
      "Discord AI voice companion bot that listens, transcribes, and talks back in real time through a streaming speech pipeline.",
    featureBreakdown: [
      "Full pipeline wired end to end: per-user Opus voice decode, VAD segmentation, Deepgram streaming speech-to-text, Claude Haiku for responses and memory extraction, and ElevenLabs streaming text-to-speech with barge-in playback.",
      "Two independent consent gates (accepted and opted-out) checked before any audio is subscribed to or transcribed, re-checked again at the orchestrator level as defense in depth.",
      "Raw audio is never persisted, only transcripts and derived memory facts, and per-user profile facts are capped rather than growing unbounded.",
      "Every API call logged to a usage_log table, with a sliding 60-second per-guild rate limit and a minimum-gap cooldown between responses as a hard cost backstop.",
      "Slash commands for join/leave, active/quiet mode, opt-in/opt-out, consent channel setup, and temporary context overrides.",
      "Discontinued after a few months once the combined Deepgram, Claude, and ElevenLabs API costs weren't sustainable for a just-for-fun project.",
    ],
  },
  9: {
    cardSnippet:
      "Habit tracker where each habit is a plant that grows with daily check-ins and wilts when you miss a day.",
    featureBreakdown: [
      "Growth stage is never stored, it's always computed from checkin history on read, so there's a single source of truth: seed, sprout, sapling, bloom, then flourishing as the streak climbs.",
      "Missing a day resets the streak to 0 and marks the habit wilted, computed the same way from the most recent checkin.",
      "Each habit has a cosmetic species, sunflower, cactus, mushroom, clover, or bonsai, picked at creation and validated server-side.",
      "Client is Vite plus plain JavaScript React with React Router, server is Node/Express using plain SQL through the pg package against PostgreSQL on Supabase, no TypeScript and no ORM by choice for code that's easy to read end to end.",
      "Deploys as two Render services, server and client, via a render.yaml blueprint.",
      "Recently went through a dedicated security and reliability hardening pass.",
    ],
  },
  6: {
    cardSnippet:
      "Production marketing and booking site for a mobile car detailing business, live with real client traffic.",
    featureBreakdown: [
      "Booking-first hero with clear service tiers positioned for a premium mobile detailing brand.",
      "Built in React and TypeScript with a responsive, performance-minded layout.",
      "Live on Netlify, a real client site serving real traffic and real business outcomes.",
      "Solo build covering UI, content structure, and deploy.",
    ],
  },
  11: {
    cardSnippet:
      "Event-sourced digital wallet backend where balances are never stored directly, only derived by replaying an immutable event log.",
    featureBreakdown: [
      "Every financial action, deposit, withdrawal, or transfer, is stored as an immutable event, including a compensating EventReverted event that undoes a previous one.",
      "Snapshots cache the current balance after every 50 events on an account, so replay starts from the latest snapshot instead of event one, keeping reads fast as history grows.",
      "Optimistic concurrency control: a unique constraint on account and version number means a concurrent write race returns a 409 VERSION_CONFLICT instead of corrupting state.",
      "REST API for create account, deposit, withdraw, transfer, get balance, point-in-time balance queries, history, rollback, and listing accounts, with typed error codes throughout.",
      "WebSocket protocol lets clients subscribe per account and receive balance.updated pushes with the triggering event attached.",
      "Vitest coverage of the replay engine itself: event application, insufficient funds, snapshot starting points, rollback inverses, and concurrency checks.",
    ],
  },
};
