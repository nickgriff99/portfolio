# Nicholas Griffiths — Portfolio

Personal portfolio site. Live at [nickhgriffiths.com](https://nickhgriffiths.com/).

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v3
- React Router
- Vitest (unit) + Playwright (e2e, devDependency)

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Command | Does what |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Typecheck + production build |
| `npm run typecheck` | Type-check only, no emit |
| `npm run lint` | Lint with ESLint |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run preview` | Preview the production build locally |

## Resume

[resume.pdf](./public/resume.pdf)

## Project structure

```
src/
  components/    Shared UI components (NavBar, Footer, ContactForm, ...)
  components/sections/  Page-level sections (HeroSection, AboutMe, ContactSection, ...)
  pages/         Routed pages (Home, About, Experience, Projects, ...)
  hooks/         Custom hooks (scroll, media queries, reduced motion, ...)
  lib/           Small framework-agnostic helpers
  data/          Static content (projects, experience, education, skills, nav)
  bits/          Standalone animated/text-effect components
```
