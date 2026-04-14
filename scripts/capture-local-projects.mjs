/**
 * Regenerates SaaS, responsive, calculator, and Battleship preview PNGs.
 * Requires: `scripts/.capture-work/saas` and `responsive` (git clone — see README in script).
 * Terminal shots use committed HTML under scripts/capture-assets/.
 *
 * Run from repo root: npm run capture:local-projects
 */
import { spawn } from "child_process";
import { existsSync } from "fs";
import { chromium } from "playwright";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const VIEW = { width: 1600, height: 1000 };

function spawnHttpServer(staticDir, port) {
  return spawn(
    "npx",
    ["--yes", "http-server", staticDir, "-p", String(port), "-a", "127.0.0.1", "-c-1", "--silent"],
    { cwd: root, shell: true, stdio: "ignore", detached: false },
  );
}

async function waitForUrl(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (r.ok) return;
    } catch {
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  throw new Error(`Timeout waiting for ${url}`);
}

async function capture() {
  const saasDir = join(root, "scripts", ".capture-work", "saas");
  const responsiveDir = join(root, "scripts", ".capture-work", "responsive");

  if (!existsSync(join(saasDir, "index.html"))) {
    console.error(
      "Missing scripts/.capture-work/saas — clone: git clone --depth 1 https://github.com/nickgriff99/css-final-project-saas.git scripts/.capture-work/saas",
    );
    process.exit(1);
  }
  if (!existsSync(join(responsiveDir, "index.html"))) {
    console.error(
      "Missing scripts/.capture-work/responsive — clone: git clone --depth 1 https://github.com/nickgriff99/css-responsive-website.git scripts/.capture-work/responsive",
    );
    process.exit(1);
  }

  const s1 = spawnHttpServer(saasDir, 5190);
  const s2 = spawnHttpServer(responsiveDir, 5191);

  try {
    await waitForUrl("http://127.0.0.1:5190/");
    await waitForUrl("http://127.0.0.1:5191/");

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: VIEW });
    const page = await context.newPage();

    console.error("Capturing SaaS hero…");
    await page.goto("http://127.0.0.1:5190/", { waitUntil: "networkidle", timeout: 120000 });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({
      path: join(root, "public/projects/saas-hero.png"),
      type: "png",
      clip: { x: 0, y: 0, width: VIEW.width, height: VIEW.height },
    });

    console.error("Capturing responsive site hero…");
    await page.goto("http://127.0.0.1:5191/", { waitUntil: "networkidle", timeout: 120000 });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({
      path: join(root, "public/projects/responsive-hero.png"),
      type: "png",
      clip: { x: 0, y: 0, width: VIEW.width, height: VIEW.height },
    });

    const terminalShots = [
      ["calculator-terminal.html", "public/projects/node-calculator-hero.png"],
      ["battleship-terminal.html", "public/projects/battleship-hero.png"],
    ];
    for (const [html, out] of terminalShots) {
      console.error(`Capturing ${html}…`);
      const u = pathToFileURL(join(root, "scripts/capture-assets", html)).href;
      await page.goto(u, { waitUntil: "load" });
      await page.screenshot({
        path: join(root, out),
        type: "png",
        clip: { x: 0, y: 0, width: VIEW.width, height: VIEW.height },
      });
    }

    await browser.close();
  } finally {
    s1.kill();
    s2.kill();
  }

  console.error("Done. Wrote PNGs under public/projects/");
}

capture().catch((e) => {
  console.error(e);
  process.exit(1);
});
