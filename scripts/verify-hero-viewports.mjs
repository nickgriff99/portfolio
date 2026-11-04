// Usage: node scripts/verify-hero-viewports.mjs [baseUrl]
// Or via: npm run verify:hero
// Needs: $env:PLAYWRIGHT_BROWSERS_PATH = "$env:LOCALAPPDATA\ms-playwright"
//        Playwright loaded via createRequire

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const BASE_URL = process.argv[2] || process.env.BASE_URL || "http://localhost:5174";

// [width, height]
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
  "C:\\Users\\nichg\\AppData\\Local\\Cursor\\AgentStores\\cursor_agent_stores\\789896e6-8b24-4e3e-ad37-3deef6b8d6e0\\files\\verify";

const failures = [];
const passes = [];

async function dismissCookieBanner(page) {
  try {
    // Try multiple selectors for cookie banner decline/reject
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
    // banner absent - ignore
  }
}

async function getElementInfo(page, locator) {
  // scrollIntoView + gather computed style + bounding rect
  const info = await locator.evaluate((el) => {
    el.scrollIntoView({ block: "nearest", inline: "nearest" });
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const opacity = parseFloat(style.opacity);
    const display = style.display;
    const visibility = style.visibility;

    // Check for overflow clipping by ancestors
    let clipped = false;
    let ancestor = el.parentElement;
    while (ancestor && ancestor !== document.body) {
      const aStyle = window.getComputedStyle(ancestor);
      const aRect = ancestor.getBoundingClientRect();
      const overflow = aStyle.overflow + aStyle.overflowX + aStyle.overflowY;
      if (overflow.includes("hidden") || overflow.includes("clip")) {
        // Check if el rect is outside ancestor rect
        if (
          rect.right < aRect.left ||
          rect.left > aRect.right ||
          rect.bottom < aRect.top ||
          rect.top > aRect.bottom
        ) {
          clipped = true;
          break;
        }
      }
      ancestor = ancestor.parentElement;
    }

    // elementFromPoint at center
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let topHit = null;
    try {
      const hit = document.elementFromPoint(cx, cy);
      if (hit) {
        topHit = hit === el || el.contains(hit);
      }
    } catch {
      topHit = null;
    }

    return {
      opacity,
      display,
      visibility,
      rect: { top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height },
      clipped,
      topHit,
    };
  });
  return info;
}

async function getNavbarBottom(page) {
  return page.evaluate(() => {
    const nav = document.querySelector("header");
    if (!nav) return 0;
    return nav.getBoundingClientRect().bottom;
  });
}

async function runViewport(browser, width, height) {
  const context = await browser.newContext({
    viewport: { width, height },
  });
  const page = await context.newPage();

  const viewportLabel = `${width}x${height}`;
  const viewportFailures = [];

  try {
    await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2500);

    await dismissCookieBanner(page);

    // Hero element selectors
    const elements = [
      { name: "badge", locator: page.locator("section.section-hero span").filter({ hasText: /available/i }).first() },
      { name: "h1", locator: page.locator("section.section-hero h1").first() },
      { name: "h2", locator: page.locator("section.section-hero h2").first() },
      { name: "paragraph", locator: page.locator("section.section-hero p").first() },
      { name: "cta1", locator: page.locator("section.section-hero button").filter({ hasText: /view my work/i }).first() },
      { name: "cta2", locator: page.locator("section.section-hero a").filter({ hasText: /resume/i }).first() },
    ];

    // Wait for opacity to settle (CSS animations complete up to 1s)
    await page.waitForTimeout(1200);

    const navbarBottom = await getNavbarBottom(page);

    for (const { name, locator } of elements) {
      const count = await locator.count();
      if (count === 0) {
        viewportFailures.push({ element: name, mode: "not-found", measurements: "element not found in DOM" });
        continue;
      }

      let info;
      try {
        info = await getElementInfo(page, locator);
      } catch (e) {
        viewportFailures.push({ element: name, mode: "evaluate-error", measurements: String(e) });
        continue;
      }

      // Assert opacity > 0.99
      if (info.opacity < 0.99) {
        viewportFailures.push({
          element: name,
          mode: "opacity",
          measurements: `opacity=${info.opacity}`,
        });
      }

      // Assert not display:none or visibility:hidden
      if (info.display === "none") {
        viewportFailures.push({ element: name, mode: "display:none", measurements: `display=${info.display}` });
      }
      if (info.visibility === "hidden") {
        viewportFailures.push({ element: name, mode: "visibility:hidden", measurements: `visibility=${info.visibility}` });
      }

      // Assert non-empty bounding box
      if (info.rect.width <= 0 || info.rect.height <= 0) {
        viewportFailures.push({
          element: name,
          mode: "zero-size",
          measurements: `width=${info.rect.width}, height=${info.rect.height}`,
        });
      }

      // Assert not covered by navbar (rect.top > navbarBottom at scrollY=0)
      // Only check if element is in viewport (rect.top >= 0)
      if (info.rect.top >= 0 && info.rect.top < navbarBottom) {
        viewportFailures.push({
          element: name,
          mode: "navbar-overlap",
          measurements: `element.top=${info.rect.top.toFixed(1)}, navbar.bottom=${navbarBottom.toFixed(1)}`,
        });
      }

      // Assert not clipped by overflow:hidden ancestor
      if (info.clipped) {
        viewportFailures.push({
          element: name,
          mode: "clipped",
          measurements: `element clipped by overflow:hidden ancestor`,
        });
      }
    }

    // Take screenshot
    try {
      await page.screenshot({
        path: `${SCREENSHOT_DIR}\\${viewportLabel}.png`,
        fullPage: false,
      });
    } catch {
      // screenshot failure is non-critical
    }
  } catch (err) {
    viewportFailures.push({ element: "page", mode: "navigation-error", measurements: String(err) });
  } finally {
    await context.close();
  }

  if (viewportFailures.length > 0) {
    console.log(`  FAIL ${viewportLabel} - ${viewportFailures.length} failure(s):`);
    for (const f of viewportFailures) {
      console.log(`    [${f.element}] ${f.mode}: ${f.measurements}`);
    }
    failures.push({ viewport: viewportLabel, issues: viewportFailures });
  } else {
    console.log(`  PASS ${viewportLabel}`);
    passes.push(viewportLabel);
  }
}

async function main() {
  console.log(`\nverify-hero-viewports - base: ${BASE_URL}`);
  console.log(`Testing ${VIEWPORTS.length} viewports...\n`);

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
      for (const { element, mode, measurements } of issues) {
        console.log(`    - [${element}] ${mode}: ${measurements}`);
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
