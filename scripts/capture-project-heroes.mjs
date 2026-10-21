/**
 * Captures first-viewport (hero) screenshots for featured project cards.
 * Run: node scripts/capture-project-heroes.mjs
 */
import { chromium } from "playwright";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const shots = [
  {
    url: "https://bg-details.com/",
    out: join(root, "public/projects/bgmid-hero.png"),
  },
  {
    url: "https://clackforge-client.onrender.com",
    out: join(root, "public/projects/clackforge-hero.png"),
  },
  {
    url: "https://thelistinghub-demo.netlify.app",
    out: join(root, "public/projects/thelistinghub-hero.png"),
  },
  {
    url: "https://streak-garden-client.onrender.com/",
    out: join(root, "public/projects/streak-garden-hero.png"),
  },
];

// Match card aspect ratio (16:10) used in ProjectsShowcase
const VIEW = { width: 1600, height: 1000 };

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: VIEW,
  deviceScaleFactor: 1,
});
const page = await context.newPage();

for (const { url, out } of shots) {
  console.error(`Capturing ${url} -> ${out}`);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForLoadState("networkidle", { timeout: 60000 }).catch(() => {});
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 3000));
  await page.screenshot({
    path: out,
    type: "png",
    clip: { x: 0, y: 0, width: VIEW.width, height: VIEW.height },
  });
}

await browser.close();
console.error("Done.");
