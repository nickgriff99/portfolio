import type { ProjectReadme } from "../types";

/** Fuller README-depth content per project, keyed by Project.id. Powers a dedicated
 * "see more" README view beyond the featureBreakdown summary in projectDetails.ts. */
export const projectReadmes: Record<number, ProjectReadme> = {
  7: {
    intro:
      "CLACKFORGE is a full-stack e-commerce store for custom mechanical keyboards, built around a real-time 3D configurator. The store is fictional but the engineering is real: every feature runs against a live Postgres database, not mock data. It includes a group-buy drop with proven oversell protection, an admin dashboard with real analytics, and a hero where typing on your physical keyboard presses the matching key on screen.",
    sections: [
      {
        heading: "What this is",
        body: [
          "Most portfolio e-commerce projects stop at a product grid and a cart. CLACKFORGE goes further on purpose: a real 3D keyboard you can rotate and customize key by key, a group-buy drop with database-level oversell protection proven under concurrent load, a hero where typing on your physical keyboard presses the matching key on screen, and an admin dashboard with aggregate analytics over real configurator data.",
          "The goal was software that behaves like production software: real auth, real sessions, server-enforced price integrity, an accessibility pass, and tests at every layer.",
        ],
      },
      {
        heading: "Architecture",
        body: [
          "The repo is split into /client (Vite + React SPA with routes, components, 3D scenes, and client state), /server (Express API with routes, Prisma models, auth, and the Stripe webhook), and /shared (Zod schemas and the pricing engine, imported by both sides). Client and server never redefine a shape independently: every request and response is validated against the same Zod schema both sides import from /shared, and the pricing engine lives there too, so the server can re-run the exact calculation the client used and reject anything that does not match.",
          "Price integrity runs end to end. The client computes a price locally for responsiveness, but every write path (saving a build, adding to cart, checking out) recomputes it server-side from the same shared function, so a tampered request is rejected rather than silently accepted.",
          "Oversell prevention holds up under real concurrency. The group-buy drop uses a row-level lock inside a database transaction rather than an optimistic check. A Playwright test opens independent browser contexts and fires simultaneous reservations at the last unit, and exactly one succeeds.",
          "Everything 3D is also real text. The configurator and switch pages mirror every spec, price, and selection the canvas shows as labeled, screen-reader-accessible markup, and prefers-reduced-motion is honored throughout so scroll animations and camera tweens become instant cuts rather than just faster ones.",
        ],
      },
      {
        heading: "Tech stack",
        body: [
          "Client: Vite, React 19, TypeScript (strict), React Router. 3D: three.js via @react-three/fiber and @react-three/drei. UI: Tailwind CSS v4 with shadcn/ui and Base UI primitives restyled to brand tokens. Client state: Zustand for cart and configurator state, TanStack Query for server state.",
          "Server: Node.js, Express 5, TypeScript, with PostgreSQL via Prisma developed against Supabase. Auth is Passport.js (local and Google OAuth) with server-side sessions via express-session and connect-pg-simple. Payments run through Stripe Checkout in test mode with idempotent webhook handling, and transactional email goes through Resend.",
          "Validation is a single Zod schema package shared by client and server, so there are no duplicated types. Testing covers Vitest for unit and integration tests, plus Playwright with axe-core for end-to-end and accessibility checks. CI/CD runs on GitHub Actions and Render.",
        ],
      },
      {
        heading: "Security",
        body: [
          "Helmet secure headers run on every response. Sessions are httpOnly cookies, Secure and SameSite=None in production, with a 7-day expiry and a server-side store. CSRF defense rejects state-changing requests with an Origin other than the configured client (403), backed by a CORS allowlist with credentials.",
          "Rate limiting via express-rate-limit covers login, register, the demo-admin endpoint, and the API as a whole. Passwords are hashed with bcrypt at cost 12 and the hash never leaves the server. Every input is validated with Zod, and the Stripe webhook verifies its signature against the raw body.",
        ],
      },
      {
        heading: "Running it and known limitations",
        body: [
          "The live demo runs on free hosting and sleeps when idle, so the first request can take up to a minute to wake the API. Reviewing it does not require an account: a 'Try as admin' button on the About page signs straight into the admin dashboard. Checkout only ever runs in Stripe test mode with the card 4242 4242 4242 4242.",
          "The main known gap is mobile performance on the 3D-heavy routes. This is a client-rendered SPA with no server-rendering tier, so there is an unavoidable blank window before the bundle downloads on a throttled connection. Closing it further would mean revisiting the rendering strategy. Every page is lazy-loaded at the route level, and the 3D engine only loads on routes that render a scene, which keeps the rest of the app light.",
        ],
      },
    ],
  },
  8: {
    intro:
      "TheListingHub is a modern rebuild of a live commercial real estate investment classifieds platform, built as an independent redesign concept rather than an affiliated deployment. It demonstrates a rebuilt marketing and listings experience with Framer Motion and Tailwind v4, Supabase Auth and PostgreSQL persistence, and a Stripe Checkout sponsor-listing flow, all against real product requirements.",
    sections: [
      {
        heading: "Overview",
        body: [
          "This project is an independent redesign inspired by thelistinghub.com, not affiliated with, endorsed by, or deployed on behalf of the real company. It exists as a portfolio piece demonstrating full-stack implementation against real product requirements: rebuilt marketing and listings UX, Supabase Auth with row-level security and PostgreSQL persistence, Stripe Checkout Sessions with signed webhooks writing to a listing_payments table, and an auth-gated catalog with express-interest, account profile, and sponsor checkout flows.",
        ],
      },
      {
        heading: "Routes",
        body: [
          "The marketing home lives at /. /listings is the catalog, gated behind auth when Supabase is configured, and /listings/[slug] is the listing detail page with an express-interest action. /login handles sign in and sign up, /account is the authenticated profile settings page, and /get-listed is the authenticated $499 test-mode sponsor listing checkout with a /get-listed/success confirmation page. /pricing covers plans and /contact is a contact form.",
        ],
      },
      {
        heading: "Tech stack",
        body: [
          "Next.js 16 with the App Router, React 19, and TypeScript. Styling and motion use Tailwind CSS v4 and Framer Motion. Supabase provides Auth (Google and email), PostgreSQL, and row-level security policies guarding data at the database layer, not just the app layer. Stripe handles Checkout Sessions and webhooks in test mode. The app deploys to Netlify.",
        ],
      },
      {
        heading: "Demo flow and known mode",
        body: [
          "A two-minute reviewer flow: open the live Netlify URL to see the home page and featured listings, sign in with Google or email (the header then shows the user's name and a sign-out option), browse to /listings and open a deal to express interest (which writes to Supabase), then go to /pricing, click through to /get-listed, and pay with the Stripe test card 4242 4242 4242 4242 to land on the success page. The resulting listing_interests and listing_payments rows can optionally be shown in Supabase directly.",
          "Stripe only ever runs in test mode, no real charges are possible. Without Supabase credentials configured, the app falls back to a demo mode with seeded listing data instead of a live database.",
        ],
      },
    ],
  },
  9: {
    intro:
      "Streak Garden is a habit tracker where each habit is a plant: checking in waters it and it grows through stages, and missing a day lets it wilt. Growth stage is never stored in the database, it is always computed from checkin history on read, so there is a single source of truth and no risk of a stored stage drifting from the actual streak.",
    sections: [
      {
        heading: "Growth stages and plant species",
        body: [
          "Growth stage is computed from the current streak length in server/src/utils/growth.js: 0-1 days is a seed, 2-4 days a sprout, 5-9 days a sapling, 10-20 days a bloom, and 21+ days flourishing. If the most recent checkin is more than one day old, the streak resets to 0 and the habit is marked wilted, using the same read-time computation rather than a stored flag.",
          "Each habit also has a cosmetic species (sunflower, cactus, mushroom, clover, or bonsai) picked at creation and defaulting to sunflower. Species only changes which pixel art renders, it has no effect on growth-stage computation, and the allowed list is validated server-side.",
        ],
      },
      {
        heading: "Architecture and tech stack",
        body: [
          "The client is a Vite plus plain JavaScript React single-page app using React Router for client-side routing, talking to the API over fetch. The server is a Node.js and Express REST API using plain SQL through the pg package against PostgreSQL hosted on Supabase. There is no TypeScript and no ORM, and no supabase-js SDK, by choice, so the code stays easy to read and debug end to end.",
          "The data model is three tables: users (id, email, password_hash, created_at), habits (id, user_id, name, species, created_at), and checkins (id, habit_id, date, created_at, unique on habit_id and date).",
        ],
      },
      {
        heading: "Deploying",
        body: [
          "The app deploys as two Render services via a render.yaml blueprint: a Node web service for the server and a static site for the client. Deploy order matters, server first, then the client pointed at the server's real URL, then the server again configured with the client's real URL for CORS, because the two services' URLs don't exist until each has deployed once.",
        ],
      },
      {
        heading: "Known limitations and recent hardening",
        body: [
          "The project recently went through a dedicated security and reliability hardening pass: a crash-proof connection pool, a pinned JWT algorithm, input-length limits, and real error boundaries.",
        ],
      },
    ],
  },
  10: {
    intro:
      "receipts-bot is a Discord AI voice companion bot in the style of an ambient co-host: it listens in a voice channel, transcribes speech, responds in character, and talks back through a real-time streaming pipeline across four different services. The repo name is legacy and unrelated to receipts, this is the whole bot.",
    sections: [
      {
        heading: "Status and pipeline",
        body: [
          "The bot is wired end to end. Every stage of the pipeline, Discord voice receive with per-user Opus decode, VAD segmentation, Deepgram streaming speech-to-text, Claude Haiku for a cheap-gate check plus full response plus memory extraction, ElevenLabs streaming text-to-speech, @discordjs/voice playback with barge-in, PostgreSQL-backed memory and usage logging, rate limiting, and all slash commands, is real code against each SDK's actual documented API, not a stub. What can't be verified without a live bot token and paid API keys is an actual Discord gateway connection and actual paid API responses, but every call site was checked against the installed type definitions for the pinned package version.",
        ],
      },
      {
        heading: "Compliance and consent",
        body: [
          "Two independent gates must both pass before a user's voice or text is processed: whether the user has ever accepted the visible consent notice posted in the paired text channel, and whether a user who already accepted later opted out via /optout. Both gates are checked at multiple call sites as defense in depth. Raw audio is never persisted, only transcripts and derived memory facts are stored in PostgreSQL. The conversation log is prunable for a stated retention policy, and per-user profile facts and running jokes are capped rather than growing unbounded.",
          "Recording consent itself is the deploying admin's legal responsibility. This software provides the mechanical pieces, a visible notice, opt-out, no raw-audio persistence, and prunable logs, to build a compliant deployment on top of, not legal advice.",
        ],
      },
      {
        heading: "Cost control and slash commands",
        body: [
          "Every Deepgram, Claude, and ElevenLabs call is logged to a usage_log PostgreSQL table. Rate limiting is the hard cost backstop: a sliding 60-second per-guild cap (default 5 responses per minute) plus a minimum-gap cooldown between responses, with explicit mention or reply triggers bypassing only the minimum-gap half, never the cap. Latency from speech-end to bot-starts-speaking is logged as a warning past a 2.5 second threshold.",
          "Slash commands cover /join and /leave for voice channel presence, /mode active or quiet (with /active and /quiet as one-word aliases) for ambient versus addressed-only behavior, /optout and /optin for consent, /setconsentchannel to pin the consent notice, and /setcontext/clearcontext to temporarily steer the bot's tone (defaulting to 2 hours, capped at 12).",
        ],
      },
      {
        heading: "Prerequisites and why it was discontinued",
        body: [
          "Running it requires Node.js 22.12 or newer (needed by @discordjs/voice), a PostgreSQL instance for memory, usage, and conversation-log storage (docker compose starts one automatically), ffmpeg on PATH to transcode ElevenLabs mp3 output into Opus for playback, and API keys for Anthropic, Deepgram, and ElevenLabs.",
          "The bot was discontinued after a few months once the combined Deepgram, Claude, and ElevenLabs API costs weren't sustainable for a just-for-fun project.",
        ],
      },
    ],
  },
  11: {
    intro:
      "This is a real-time digital wallet backend built with event sourcing: every financial action is stored as an immutable event, and the current balance is always derived by replaying the event log, never stored directly on an account row. It pairs a REST API with a WebSocket protocol for live balance updates to a dashboard.",
    sections: [
      {
        heading: "Why event sourcing",
        body: [
          "Traditional systems store a current balance and overwrite it on each transaction, losing history. Event sourcing instead stores every action as an append-only record, which gives a complete audit trail, time-travel queries such as what the balance was at a specific point in time, no lost history since events are never updated or deleted, and concurrency safety via version numbers that prevent race conditions when two writes hit the same account.",
        ],
      },
      {
        heading: "Event types, snapshots, and concurrency",
        body: [
          "Five event types drive the system: AccountCreated initializes an account at balance 0, MoneyDeposited and MoneyWithdrawn adjust a single account's balance, MoneyTransferred adjusts both a sender and receiver in one event, and EventReverted is a compensating event that undoes a previous one.",
          "After every 50 events on an account, the current balance is cached in a snapshots table, so replay starts from the latest snapshot instead of event one, keeping reads fast even with long histories.",
          "Each event has a monotonically increasing version per account. A unique constraint on aggregate id plus version prevents duplicate versions, and concurrent writes that race receive a 409 VERSION_CONFLICT response instead of corrupting state.",
        ],
      },
      {
        heading: "API and WebSocket protocol",
        body: [
          "The REST API covers create account, deposit, withdraw, transfer, get balance, get history, get balance at a point in time, rollback the last event, and list accounts, with typed error codes including ACCOUNT_NOT_FOUND (404), INSUFFICIENT_FUNDS (400), VERSION_CONFLICT (409), INVALID_AMOUNT (400), and ROLLBACK_NOT_ALLOWED (400).",
          "Clients connect over WebSocket and subscribe to an account by id, then receive balance.updated server pushes containing the new balance, version, and the triggering event (type, payload, timestamp).",
        ],
      },
      {
        heading: "Logging and tests",
        body: [
          "Every HTTP request gets a correlation ID, taken from an X-Correlation-Id header or auto-generated, and all event writes are logged with it alongside aggregate id, event type, version, and amount.",
          "Vitest unit tests cover the replay engine: event application, insufficient funds, snapshot starting points, rollback inverses, optimistic concurrency checks, and snapshot interval rules.",
        ],
      },
    ],
  },
  6: {
    intro:
      "B.G.M.I.D. is a production marketing and booking site for a mobile car detailing business, built solo and live with real client traffic. It focuses on booking-first positioning for a premium mobile detailing brand rather than any backend complexity.",
    sections: [
      {
        heading: "What this is",
        body: [
          "A booking-focused hero and clear service tiers position the brand as a premium mobile detailing service. The site was built in React and TypeScript with a responsive, performance-minded layout, and is live on Netlify serving real traffic for a real business.",
          "This was a solo build covering UI, content structure, and deploy, with no public repository or README to draw deeper architecture notes from.",
        ],
      },
    ],
  },
  12: {
    intro:
      "The rest of this portfolio is a static frontend, so the guestbook exists to show a real backend behind it: a separate Express + PostgreSQL service, deployed independently on Render, with its own Zod-validated API contract and its own spam protection.",
    sections: [
      {
        heading: "What this is",
        body: [
          "Visitors can read existing entries and leave their own name and a short message on the live /guestbook page. Every write hits a real Postgres table, there's no mock data and no client-side-only state standing in for persistence.",
        ],
      },
      {
        heading: "Architecture",
        body: [
          "The backend lives in /server at the root of this repo as its own Node project, with its own package.json and tsconfig so it's built and deployed independently of the Vite frontend. It's an Express app with two routes (GET and POST /api/entries), a plain SQL migration against PostgreSQL (no ORM), and a Zod schema that both validates incoming requests and defines the TypeScript types the route handlers use.",
          "The frontend page (src/pages/Guestbook.tsx) talks to this service over plain fetch calls against a URL set via VITE_GUESTBOOK_API_URL, same pattern as any other external API this site could call.",
        ],
      },
      {
        heading: "Spam protection",
        body: [
          "A hidden honeypot field (named bot_field, same idea as the contact form's Netlify honeypot) has to stay empty or the request is rejected. There's also a per-IP rate limit of one post every 30 seconds.",
          "The rate limiter is a known shortcut: it's an in-memory map, not backed by the database, so it resets on every Render restart or redeploy. Fine for a low-traffic guestbook; if abuse ever became a real problem, the fix is moving that check into Postgres.",
        ],
      },
      {
        heading: "Running it locally",
        body: [
          "Run the SQL in server/migrations/001_init.sql against a Postgres instance, copy server/.env.example to server/.env and fill in DATABASE_URL/PORT/ALLOWED_ORIGIN, then npm install && npm run dev inside /server. On the frontend, set VITE_GUESTBOOK_API_URL to wherever that server is running.",
        ],
      },
    ],
  },
};
