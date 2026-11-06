import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: "http://localhost:5173",
  },
  webServer: {
    // Dev server, not a production build: ContactForm's dev-mode branch
    // (ContactForm.tsx) fast-forwards submission without a live Netlify Forms
    // backend, which is what makes a deterministic contact-form E2E possible here.
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
