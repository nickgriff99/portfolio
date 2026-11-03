// Pin Reachability Guard — Step 3 curtain reveal
// For each viewport in the matrix, scrolls through the hero in steps and checks:
//   1. At SOME scroll position, each hero element (badge, h1, h2, p, cta1, cta2)
//      must be fully inside the viewport and be the top hit via elementFromPoint.
//   2. Once scrollY >= hero height + 1 viewport, hero must be fully covered
//      (elementFromPoint at multiple hero center points returns curtain content, not hero).
//   3. The hero section must have `inert` set at that scroll position.
//   4. Scrolling back to 0 must clear `inert`.
//
// Usage: node verify-pin-reachability.mjs [baseUrl]
//   or:  $env:PLAYWRIGHT_BROWSERS_PATH = "$env:LOCALAPPDATA\ms-playwright"
//        node verify-pin-reachability.mjs
//
// Load playwright via createRequire from the portfolio package to reuse its installation.

import { createRequire } from "module";
const require = createRequire("C:/coding/portfolio/package.json");
const { chromium } = require("playwright");

const BASE_URL = process.argv[2] || process.env.BASE_URL || "http://localhost:5174";

const VIEWPORTS = [
  [320, 480],
  [568, 320],
  [667, 375],
  [844, 390],
  [1024, 600],
  [1366, 500],
  [1703, 500],
  [1920, 1080],
  [390, 844],
  [768, 1024],
  [1703, 844],
];

const SCREENSHOT_DIR =
  "C:\\Users\\nichg\\AppData\\Local\\Cursor\\AgentStores\\cursor_agent_stores\\789896e6-8b24-4e3e-ad37-3deef6b8d6e0\\files\\pin-reachability";

const failures = [];
const passes = [];

async function dismissCookieBanner(page) {
  try {
    const selectors = [
      'button:has-text("Decline")',
      'button:has-text("Reject")',
      'button:has-text("No thanks")',
      '[data-testid*="cookie"] button',
      ".cookie-banner button",
    ];
    for (const sel of selectors) {
      const btn = page.locator(sel).first();
      if ((await btn.count()) > 0) {
        await btn.click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(400);
        return;
      }
    }
  } catch {
    // no banner
  }
}

async function runViewport(browser, width, height) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  const label = `${width}x${height}`;
  const vf = [];

  try {
    await page.goto(BASE_URL, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(2000);
    await dismissCookieBanner(page);

    // Hero element selectors (same as verify-hero-viewports.mjs)
    const heroSelectors = [
      { name: "badge", sel: "section.section-hero span" },
      { name: "h1",    sel: "section.section-hero h1" },
      { name: "h2",    sel: "section.section-hero h2" },
      { name: "p",     sel: "section.section-hero p" },
      { name: "cta1",  sel: "section.section-hero button:first-of-type" },
      { name: "cta2",  sel: "section.section-hero button:last-of-type" },
    ];

    // Measure hero height and viewport size
    const { heroH, vpW, vpH } = await page.evaluate(() => ({
      heroH: document.getElementById("home")?.offsetHeight ?? window.innerHeight,
      vpW: window.innerWidth,
      vpH: window.innerHeight,
    }));

    // --- CHECK 1: reachability ---
    // Scroll in steps through the hero; at EACH step check if any element becomes
    // fully visible + top-hit. Track which elements have been "seen".
    const STEPS = 8;
    const stepSize = Math.floor(heroH / STEPS);
    const reached = new Set();

    for (let s = 0; s <= STEPS; s++) {
      const scrollY = s * stepSize;
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), scrollY);
      await page.waitForTimeout(60); // brief settle for rAF

      for (const { name, sel } of heroSelectors) {
        if (reached.has(name)) continue;
        const locator = page.locator(sel).first();
        if ((await locator.count()) === 0) continue;

        const visible = await locator.evaluate((el, vph) => {
          const rect = el.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return false;
          if (rect.top < 0 || rect.bottom > vph) return false;
          if (rect.left < 0 || rect.right > window.innerWidth) return false;
          // elementFromPoint at center
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const hit = document.elementFromPoint(cx, cy);
          return hit !== null && (hit === el || el.contains(hit));
        }, vpH);

        if (visible) reached.add(name);
      }
      if (reached.size === heroSelectors.length) break;
    }

    // --- CHECK 1b: pinned-rect assertion ---
    // At 70% scroll through the hero the hero's getBoundingClientRect().top must equal
    // max(stickyTop, -scrollY) ± 2px, where stickyTop = min(0, vpH - heroH).
    // If sticky is broken (e.g. overflow-x:hidden on body makes body a scroll container),
    // the hero just scrolls with the page and this fails.
    // Also verifies the About section has slid into view over the hero (curtain overlap).
    const pinTestScrollY = Math.round(heroH * 0.7);
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), pinTestScrollY);
    await page.waitForTimeout(120);

    const pinnedCheck = await page.evaluate(({ scrollY }) => {
      const hero = document.getElementById("home");
      if (!hero) return { ok: false, msg: "hero element not found" };
      const rect = hero.getBoundingClientRect();
      // Use live offsetHeight (not the stale value from page-load measurement) so that
      // stickyTop reflects the actual --hero-h value the CSS is using after layout settles.
      const liveHeroH = hero.offsetHeight;
      const liveVpH = window.innerHeight;
      const stickyTop = Math.min(0, liveVpH - liveHeroH);
      const expectedTop = Math.max(stickyTop, -scrollY);
      const tolerance = 2;
      const ok = Math.abs(rect.top - expectedTop) <= tolerance;
      return { ok, actual: Math.round(rect.top * 10) / 10, expected: Math.round(expectedTop * 10) / 10, stickyTop, scrollY, liveHeroH };
    }, { scrollY: pinTestScrollY });

    if (!pinnedCheck.ok) {
      vf.push({ check: "pinned-rect", element: "hero", msg: `hero.top=${pinnedCheck.actual} expected=${pinnedCheck.expected} (stickyTop=${pinnedCheck.stickyTop}, scrollY=${pinnedCheck.scrollY}) — hero not pinned!` });
    }

    // Curtain-overlap: at pinTestScrollY the About section must have scrolled into
    // the viewport and be overlapping the (pinned) hero.
    const curtainCheck = await page.evaluate(() => {
      const hero = document.getElementById("home");
      const about = document.getElementById("about-me");
      if (!hero || !about) return { ok: true, skip: true };
      const heroRect = hero.getBoundingClientRect();
      const aboutRect = about.getBoundingClientRect();
      // About's top must be inside the viewport (< vpH) to be sliding over
      const ok = aboutRect.top < window.innerHeight && aboutRect.top < heroRect.bottom;
      return { ok, aboutTop: Math.round(aboutRect.top), heroBottom: Math.round(heroRect.bottom) };
    });
    if (!curtainCheck.ok && !curtainCheck.skip) {
      vf.push({ check: "curtain-overlap", element: "hero/about", msg: `About not sliding over hero: aboutTop=${curtainCheck.aboutTop} heroBottom=${curtainCheck.heroBottom}` });
    }

    // Take screenshot at 0% scroll (committed look check)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(100);
    try {
      await page.screenshot({ path: `${SCREENSHOT_DIR}\\${label}-0pct.png`, fullPage: false });
    } catch { /* non-critical */ }

    for (const { name } of heroSelectors) {
      if (!reached.has(name)) {
        vf.push({ check: "reachability", element: name, msg: `never fully visible+topHit in ${STEPS} scroll steps through heroH=${heroH}px at ${label}` });
      }
    }

    // --- CHECK 2 & 3: covered + inert when scrollY >= heroH + 1 viewport ---
    const coveredScrollY = heroH + vpH;
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), coveredScrollY);
    await page.waitForTimeout(150);

    // Screenshot at "fully covered" point
    try {
      await page.screenshot({ path: `${SCREENSHOT_DIR}\\${label}-covered.png`, fullPage: false });
    } catch { /* non-critical */ }

    // Check inert on hero
    const isInert = await page.evaluate(() => {
      const hero = document.getElementById("home");
      return hero ? hero.hasAttribute("inert") : false;
    });
    if (!isInert) {
      vf.push({ check: "inert-set", element: "hero", msg: `hero missing inert at scrollY=${coveredScrollY} (heroH=${heroH})` });
    }

    // Check hero is covered: elementFromPoint at 3 points should NOT return a hero descendant
    const heroCovered = await page.evaluate(() => {
      const hero = document.getElementById("home");
      if (!hero) return true; // can't check, skip
      const heroRect = hero.getBoundingClientRect();
      // Sample 3 horizontal points at ~50% viewport height
      const testPoints = [
        { x: Math.round(window.innerWidth * 0.25), y: Math.round(window.innerHeight * 0.5) },
        { x: Math.round(window.innerWidth * 0.5),  y: Math.round(window.innerHeight * 0.5) },
        { x: Math.round(window.innerWidth * 0.75), y: Math.round(window.innerHeight * 0.5) },
      ];
      for (const { x, y } of testPoints) {
        const hit = document.elementFromPoint(x, y);
        if (hit && hero.contains(hit)) return false; // hero node is top hit = NOT covered
      }
      return true;
    });
    if (!heroCovered) {
      vf.push({ check: "hero-covered", element: "viewport", msg: `hero node is top hit at scrollY=${coveredScrollY} — curtain not covering` });
    }

    // --- CHECK 4: inert cleared when scrolling back to 0 ---
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(150);

    const inertCleared = await page.evaluate(() => {
      const hero = document.getElementById("home");
      return hero ? !hero.hasAttribute("inert") : true;
    });
    if (!inertCleared) {
      vf.push({ check: "inert-cleared", element: "hero", msg: "hero still has inert after scrolling back to top" });
    }

  } catch (err) {
    vf.push({ check: "navigation", element: "page", msg: String(err) });
  } finally {
    await context.close();
  }

  if (vf.length > 0) {
    console.log(`  FAIL ${label} — ${vf.length} failure(s):`);
    for (const f of vf) console.log(`    [${f.check}/${f.element}] ${f.msg}`);
    failures.push({ viewport: label, issues: vf });
  } else {
    console.log(`  PASS ${label}`);
    passes.push(label);
  }
}

async function main() {
  console.log(`\nverify-pin-reachability — base: ${BASE_URL}`);
  console.log(`Testing ${VIEWPORTS.length} viewports...\n`);

  // Ensure screenshot dir exists
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
      for (const { check, element, msg } of issues) {
        console.log(`    - [${check}/${element}] ${msg}`);
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
