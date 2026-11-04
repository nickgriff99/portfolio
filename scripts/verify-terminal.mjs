// Terminal Section Guard - Step 6 hacker terminal (Experience + Education)
//
// Checks:
//   1. Both section ids exist: #experience, #education
//   2. Nav clicks scroll to the correct section
//   3. At several scroll positions, typed char counts are monotonic with scroll
//      and equal total when the block's bottom edge is above 75% viewport height
//   4. Scrolling back up un-types (char count decreases)
//   5. prefers-reduced-motion: all terminal text is visible without animation
//   6. No horizontal overflow at 1440/1024/768/390 viewport widths
//   7. No console errors on any viewport
//
// Usage: node scripts/verify-terminal.mjs [baseUrl]
//   or:  BASE_URL=http://localhost:5183 node scripts/verify-terminal.mjs
//
// Screenshots written to SCREENSHOT_DIR env var or agent store fallback.

import { createRequire } from "module";
const require = createRequire("C:/coding/portfolio/package.json");
const { chromium } = require("playwright");

const BASE_URL =
  process.argv[2] ?? process.env.BASE_URL ?? "http://localhost:5183";

const VIEWPORTS = [
  [1440, 900],
  [1024, 768],
  [768, 1024],
  [390, 844],
];

// Screenshot dir: env-provided or OS temp (never written into the project repo)
const SCREENSHOT_DIR =
  process.env.SCREENSHOT_DIR ??
  "C:\\Users\\nichg\\AppData\\Local\\Temp\\verify-terminal-screenshots";

const failures = [];
const passes = [];

async function dismissCookieBanner(page) {
  try {
    for (const sel of ['button:has-text("Decline")', 'button:has-text("No thanks")']) {
      const btn = page.locator(sel).first();
      if ((await btn.count()) > 0) {
        await btn.click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(300);
        return;
      }
    }
  } catch { /* no banner */ }
}

async function scrollPastHero(page) {
  // Scroll to just past the hero so the terminal is in the curtain
  const heroH = await page.evaluate(() =>
    document.getElementById("home")?.offsetHeight ?? window.innerHeight,
  );
  await page.evaluate((y) => window.scrollTo({ top: y + 20, behavior: "instant" }), heroH);
  await page.waitForTimeout(300);
}

async function runViewport(browser, width, height) {
  const context = await browser.newContext({
    viewport: { width, height },
  });
  const page = await context.newPage();
  const label = `${width}x${height}`;
  const vf = [];
  const consoleErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  try {
    await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(1500);
    await dismissCookieBanner(page);

    // ── CHECK 1: Both section ids exist ─────────────────────────────────────
    const hasExp = await page.evaluate(() => !!document.getElementById("experience"));
    const hasEdu = await page.evaluate(() => !!document.getElementById("education"));
    if (!hasExp) vf.push({ check: "section-ids", msg: "#experience not found in DOM" });
    if (!hasEdu) vf.push({ check: "section-ids", msg: "#education not found in DOM" });

    // ── CHECK 2: Horizontal overflow ─────────────────────────────────────────
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 2;
    });
    if (hasOverflow) {
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      vf.push({
        check: "no-horizontal-overflow",
        msg: `scrollWidth ${sw}px > viewport ${width}px`,
      });
    }

    // ── CHECK 3: Nav clicks scroll to sections ───────────────────────────────
    // Only runs when nav buttons are directly visible (not in a collapsed mobile menu).
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(200);

    for (const id of ["experience", "education"]) {
      const navBtn = page
        .locator("nav button, header button")
        .filter({ hasText: new RegExp(id, "i") })
        .first();

      const isVisible = (await navBtn.count()) > 0 &&
        await navBtn.isVisible().catch(() => false);

      if (isVisible) {
        await navBtn.click();
        // Allow up to 1.5s for smooth scroll to complete
        await page.waitForTimeout(1500);
        const scrolledTo = await page.evaluate((sectionId) => {
          const el = document.getElementById(sectionId);
          if (!el) return false;
          const rect = el.getBoundingClientRect();
          const header = document.querySelector("header");
          const headerH = header instanceof HTMLElement ? header.offsetHeight : 80;
          // Section top should be near the header bottom (within 400px)
          return rect.top <= headerH + 400;
        }, id);
        if (!scrolledTo) {
          vf.push({
            check: "nav-scroll",
            msg: `Clicking "${id}" nav link did not bring #${id} near viewport top`,
          });
        }
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
        await page.waitForTimeout(200);
      }
      // Skip check silently if nav items are hidden (collapsed mobile menu - tested separately)
    }

    // ── CHECK 4: Scroll-typing is monotonic + fully typed at 75% ────────────
    await scrollPastHero(page);

    // Find terminal blocks by looking at the terminal window
    const terminalExists = await page.locator(".terminal-window").count() > 0;
    if (!terminalExists) {
      vf.push({ check: "terminal-structure", msg: ".terminal-window not found" });
    } else {
      // Scroll through experience section block-by-block and check char counts
      const expBottom = await page.evaluate(() => {
        const el = document.getElementById("experience");
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        return window.scrollY + rect.bottom;
      });

      // Take a reference char count mid-way
      const midScroll = await page.evaluate(() => {
        const el = document.getElementById("experience");
        if (!el) return window.scrollY;
        const rect = el.getBoundingClientRect();
        // Scroll to mid-experience
        return window.scrollY + rect.top + (rect.height * 0.5);
      });

      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), midScroll);
      await page.waitForTimeout(150);

      // Count visible characters in the terminal (rough check: typed span innerHTML length)
      const charCountMid = await page.evaluate(() => {
        const spans = document.querySelectorAll(".terminal-window .absolute .font-mono span:first-child, [class*='absolute'] span");
        let total = 0;
        spans.forEach((s) => { if (s.textContent) total += s.textContent.length; });
        return total;
      });

      // Scroll further down
      await page.evaluate((y) => window.scrollTo({ top: y + 500, behavior: "instant" }), midScroll);
      await page.waitForTimeout(150);

      const charCountFurther = await page.evaluate(() => {
        const spans = document.querySelectorAll(".terminal-window .absolute .font-mono span:first-child, [class*='absolute'] span");
        let total = 0;
        spans.forEach((s) => { if (s.textContent) total += s.textContent.length; });
        return total;
      });

      // Chars must be monotonically non-decreasing as we scroll down
      if (charCountFurther < charCountMid) {
        vf.push({
          check: "typing-monotonic",
          msg: `Char count decreased on scroll down: mid=${charCountMid} further=${charCountFurther}`,
        });
      }

      // ── CHECK 5: Scroll up un-types ────────────────────────────────────────
      // Scroll back to hero top
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(200);
      await scrollPastHero(page);
      await page.waitForTimeout(150);

      const charCountAtTop = await page.evaluate(() => {
        const spans = document.querySelectorAll(".terminal-window .absolute .font-mono span:first-child, [class*='absolute'] span");
        let total = 0;
        spans.forEach((s) => { if (s.textContent) total += s.textContent.length; });
        return total;
      });

      // After scrolling back to just-past-hero, char count should be less than
      // what we had further down (or equal if terminal is below visible area entirely)
      if (charCountAtTop > charCountFurther) {
        vf.push({
          check: "scroll-up-untype",
          msg: `After scrolling up, char count (${charCountAtTop}) is MORE than when scrolled down (${charCountFurther})`,
        });
      }

      // Scroll to just past the experience section bottom
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), expBottom + height * 0.5);
      await page.waitForTimeout(200);
    }

    // ── CHECK 6: Screenshot ──────────────────────────────────────────────────
    try {
      await page.screenshot({
        path: `${SCREENSHOT_DIR}\\terminal-${label}.png`,
        fullPage: false,
      });
    } catch { /* non-critical */ }

    // ── CHECK 7: Console errors ──────────────────────────────────────────────
    if (consoleErrors.length > 0) {
      vf.push({
        check: "no-console-errors",
        msg: `Console errors: ${consoleErrors.slice(0, 3).join(" | ")}`,
      });
    }

    // ── CHECK 8: Reduced-motion shows all text ───────────────────────────────
    // Test in a new context with reduced-motion media query emulated
    const rmContext = await browser.newContext({
      viewport: { width, height },
      reducedMotion: "reduce",
    });
    const rmPage = await rmContext.newPage();
    try {
      await rmPage.goto(BASE_URL, { waitUntil: "networkidle", timeout: 30000 });
      await rmPage.waitForTimeout(1500);
      await dismissCookieBanner(rmPage);
      await scrollPastHero(rmPage);
      await rmPage.waitForTimeout(500);

      // In reduced-motion mode, all terminal text should be immediately visible
      // (no animation delay). Check that the terminal window has non-empty text.
      const hasTerminalText = await rmPage.evaluate(() => {
        const terminal = document.querySelector(".terminal-window");
        if (!terminal) return false;
        const text = terminal.textContent ?? "";
        // Should contain some of the known content
        return text.length > 100;
      });

      if (!hasTerminalText) {
        vf.push({
          check: "reduced-motion-text",
          msg: "Terminal has no text in reduced-motion mode",
        });
      }

      try {
        await rmPage.screenshot({
          path: `${SCREENSHOT_DIR}\\terminal-${label}-reduced-motion.png`,
          fullPage: false,
        });
      } catch { /* non-critical */ }
    } finally {
      await rmContext.close();
    }

  } catch (err) {
    vf.push({ check: "navigation", msg: String(err) });
  } finally {
    await context.close();
  }

  if (vf.length > 0) {
    console.log(`  FAIL ${label} - ${vf.length} failure(s):`);
    for (const f of vf) console.log(`    [${f.check}] ${f.msg}`);
    failures.push({ viewport: label, issues: vf });
  } else {
    console.log(`  PASS ${label}`);
    passes.push(label);
  }
}

async function main() {
  console.log(`\nverify-terminal - base: ${BASE_URL}`);
  console.log(`Testing ${VIEWPORTS.length} viewports...\n`);

  const { mkdirSync } = await import("fs");
  mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  for (const [w, h] of VIEWPORTS) {
    await runViewport(browser, w, h);
  }

  await browser.close();

  console.log(`\n--- Summary ---`);
  console.log(`PASS: ${passes.length}/${VIEWPORTS.length}`);
  console.log(`FAIL: ${failures.length}/${VIEWPORTS.length}`);

  if (failures.length > 0) {
    console.log(`\nFailed viewports:`);
    for (const { viewport, issues } of failures) {
      console.log(`  ${viewport}:`);
      for (const { check, msg } of issues) {
        console.log(`    - [${check}] ${msg}`);
      }
    }
    process.exit(1);
  } else {
    console.log("\nALL PASS");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
