/**
 * TerminalSession — ONE shared hacker-aesthetic terminal window for Experience + Education.
 *
 * Structure:
 *  - Two <section> elements (id="experience" / id="education") in normal flow → nav/scroll-spy works.
 *  - Each section: visible glitch <h2>, then a ReadableTimeline (real content, always visible,
 *    no scroll-scrub required) — this is the only copy now, for sighted and AT users alike.
 *  - Visual terminal (glitch title bar, animated typing) is aria-hidden, below the readable
 *    timeline — atmosphere, not the primary way to read the content.
 *  - ScrollTypedText is lazy → own chunk, main bundle stays flat.
 *  - Cert link is outside the aria-hidden tree — keyboard-focusable, always visible.
 *  - Reduced-motion: static full text, no glitch, no scanlines, no cursor blink.
 */

import { lazy, Suspense } from 'react';
import type { TypedBlock, TypedLine, TypedToken } from '../../bits/ScrollTypedText';
import { educationData } from '../../data/education';
import { experienceData } from '../../data/experience';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import type { TimelineEntry } from '../../types';

// Lazy import — creates its own chunk so main bundle stays ~flat
const ScrollTypedText = lazy(() => import('../../bits/ScrollTypedText'));

// ─── Token colour aliases ─────────────────────────────────────────────────────
// Values are CSS custom-property references; safe as inline style strings.
const C = {
  cmd:    'var(--color-accent)',     // lime   — commands, prompt text
  flag:   'var(--color-link)',       // teal   — flags / options
  str:    'var(--color-dev)',        // amber  — quoted strings
  cmt:    'var(--color-muted)',      // gray   — # comments / metadata
  vr:     'var(--color-highlight)',  // red    — $VARIABLES
  op:     'var(--color-soft)',       // soft   — operators: | && ;
  out:    'var(--color-text)',       // text   — plain output
  dim:    'var(--color-muted)',      // muted  — secondary output lines
} as const;

// ─── Line / token builders ────────────────────────────────────────────────────

const t = (text: string, color?: string): TypedToken => ({ text, color });
const ol  = (text: string, color?: string): TypedLine => ({ tokens: [t(text, color ?? C.out)] });
const cl  = (text: string): TypedLine => ({ tokens: [t(text, C.cmt)] });
const bl  = (): TypedLine => ({ tokens: [t('')] });

/** Prompt line: renders the prompt prefix, then the given tokens inline. */
function promptLine(prompt: string, ...tokens: TypedToken[]): TypedLine {
  return { tokens: [t(prompt, C.cmd), ...tokens] };
}

// ─── Decorative entry hashes ──────────────────────────────────────────────────
// Cosmetic 7-char hex IDs derived from org+title via djb2. They look like git
// short-hashes for atmosphere only — they are NOT real commit hashes.
function djb2(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (((h << 5) + h) ^ s.charCodeAt(i)) >>> 0;
  }
  return h.toString(16).padStart(8, '0').slice(0, 7);
}

const H = {
  spotParking: djb2('Spot ParkingJunior React Developer Intern'),
  tesla:       djb2('TeslaData Labeller'),
  bambooHR:    djb2('BambooHRSales Development Representative'),
  wiggyWash:   djb2('Wiggy WashSite Manager'),
  codecademy:  djb2('CodecademyFull-Stack Engineer — Professional Certification'),
  devslopes:   djb2('Devslopes AcademyFull-Stack Software Engineering Certificate'),
} as const;

// ─── Terminal content blocks ──────────────────────────────────────────────────

// BLOCK 0 — intrusion prelude (lives in section#experience, sets the hacked atmosphere)
const PRELUDE_BLOCK: TypedBlock = {
  id: 'prelude',
  lines: [
    promptLine('nick@portfolio:~$ ',
      t('ssh', C.cmd), t(' -p ', C.out), t('2222', C.str), t(' root@portfolio', C.str)),
    ol('ssh: connect to host portfolio port 2222: Permission denied (publickey).', C.dim),
    bl(),
    promptLine('nick@portfolio:~$ ',
      t('ssh', C.cmd), t(' -p ', C.out), t('2222', C.str), t(' nick@portfolio', C.str)),
    ol('Permission denied (publickey,gssapi-keyex,gssapi-with-mic).', C.dim),
    bl(),
    promptLine('nick@portfolio:~$ ', t('sudo', C.cmd), t(' -s', C.flag)),
    ol('[sudo] password for nick: ········', C.dim),
    ol('[ OK ] Session opened for user root by (uid=0)', C.cmd),
    promptLine('root@portfolio:~# ',
      t('export', C.cmd), t(' ACCESS', C.vr), t('=', C.op), t('granted', C.str)),
    promptLine('root@portfolio:~# ',
      t('echo', C.cmd), t(' "', C.str), t('$USER', C.vr), t(' has root access"', C.str)),
    ol('root has root access', C.out),
  ],
};

// BLOCK 1 — experience directory listing + git log summary
const EXP_HEADER_BLOCK: TypedBlock = {
  id: 'exp-header',
  lines: [
    bl(),
    promptLine('root@portfolio:~# ',
      t('cd', C.cmd), t(' ~/career', C.str),
      t(' &&', C.op),
      t(' ls', C.cmd), t(' -la', C.flag), t(' experience/', C.str)),
    ol('total 4', C.dim),
    ol(`-rw-r--r--  nick  staff  1.4K  2026-01  ${H.spotParking}.log`, C.out),
    ol(`-rw-r--r--  nick  staff  1.1K  2025-02  ${H.tesla}.log`, C.out),
    ol(`-rw-r--r--  nick  staff   920  2021-09  ${H.bambooHR}.log`, C.out),
    ol(`-rw-r--r--  nick  staff   780  2017-12  ${H.wiggyWash}.log`, C.out),
    bl(),
    promptLine('root@portfolio:~/career# ',
      t('git', C.cmd), t(' log', C.flag),
      t(" --pretty=format:'%h %ad  %s'", C.str),
      t(' --date=', C.flag), t('short', C.str),
      t(' --', C.op), t(' experience/', C.str)),
    ol(`${H.spotParking} 2026-01  Junior React Developer Intern @ Spot Parking`, C.out),
    ol(`${H.tesla} 2025-02  Data Labeller @ Tesla`, C.out),
    ol(`${H.bambooHR} 2021-09  Sales Development Representative @ BambooHR`, C.out),
    ol(`${H.wiggyWash} 2017-12  Site Manager @ Wiggy Wash`, C.out),
  ],
};

// BLOCKS 2-5 — individual experience entry log files
function makeExpBlock(
  hash: string, title: string, org: string, duration: string, bullets: string[],
): TypedBlock {
  const lines: TypedLine[] = [
    bl(),
    promptLine('root@portfolio:~/career# ',
      t('cat', C.cmd), t(` experience/${hash}.log`, C.str),
      t(' |', C.op), t(' less', C.cmd)),
    cl(`# ${hash} · ${title} — ${org}`),
    cl(`# date: ${duration}`),
    bl(),
    ...bullets.map((b) => ol(`  ${b}`, C.out)),
  ];
  return { id: `exp-${hash}`, lines };
}

const ORG_HASH_EXP: Record<string, string> = {
  'Spot Parking': H.spotParking,
  'Tesla':        H.tesla,
  'BambooHR':     H.bambooHR,
  'Wiggy Wash':   H.wiggyWash,
};

const EXP_ENTRY_BLOCKS: TypedBlock[] = experienceData.map((e) =>
  makeExpBlock(
    ORG_HASH_EXP[e.organization] ?? djb2(e.organization + e.title),
    e.title, e.organization, e.duration, e.bullets,
  ),
);

// BLOCK 6 — education section header
const EDU_HEADER_BLOCK: TypedBlock = {
  id: 'edu-header',
  lines: [
    bl(),
    promptLine('root@portfolio:~/career# ',
      t('cd', C.cmd), t(' ~/career/education', C.str),
      t(' &&', C.op),
      t(' cat', C.cmd), t(' education.md', C.str),
      t(' |', C.op), t(' less', C.cmd)),
    cl('# education.md — credentials on file'),
    bl(),
  ],
};

// BLOCKS 7-8 — individual education entries
function makeEduBlock(
  hash: string, title: string, org: string, duration: string, bullets: string[],
): TypedBlock {
  const lines: TypedLine[] = [
    cl(`## ${hash} · ${title} — ${org}`),
    cl(`## date: ${duration}`),
    bl(),
    ...bullets.map((b) => ol(`  ${b}`, C.out)),
    bl(),
  ];
  return { id: `edu-${hash}`, lines };
}

const ORG_HASH_EDU: Record<string, string> = {
  'Codecademy':        H.codecademy,
  'Devslopes Academy': H.devslopes,
};

const EDU_ENTRY_BLOCKS: TypedBlock[] = educationData.map((e) =>
  makeEduBlock(
    ORG_HASH_EDU[e.organization] ?? djb2(e.organization + e.title),
    e.title, e.organization, e.duration, e.bullets,
  ),
);

// Block sets per section
const EXP_BLOCKS: TypedBlock[] = [PRELUDE_BLOCK, EXP_HEADER_BLOCK, ...EXP_ENTRY_BLOCKS];
const EDU_BLOCKS: TypedBlock[] = [EDU_HEADER_BLOCK, ...EDU_ENTRY_BLOCKS];

// ─── Static fallback ──────────────────────────────────────────────────────────
// Rendered while the lazy chunk loads (brief window) or as a no-JS fallback.
// Height matches animated version → no layout shift when chunk resolves.
// aria-hidden: bash syntax is visual atmosphere; sr-only in the section provides real content.

function StaticContent({ blocks }: { blocks: TypedBlock[] }) {
  return (
    <div aria-hidden="true" className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
      {blocks.map((block) =>
        block.lines.map((line, li) => (
          <div key={`${block.id}-${li}`}>
            {line.tokens.map((tok, ti) => (
              <span key={ti} style={tok.color ? { color: tok.color } : undefined}>
                {tok.text}
              </span>
            ))}
          </div>
        )),
      )}
    </div>
  );
}

// ─── Terminal chrome ──────────────────────────────────────────────────────────

function TitleBar() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_92%,var(--color-accent)_4%)] px-4 py-2.5"
    >
      {/* Traffic-light dots */}
      <span className="h-3 w-3 rounded-full bg-[var(--color-highlight)] opacity-75 flex-shrink-0" />
      <span className="h-3 w-3 rounded-full bg-[var(--color-dev)] opacity-75 flex-shrink-0" />
      <span className="h-3 w-3 rounded-full bg-[var(--color-accent)] opacity-75 flex-shrink-0" />
      {/* Title — glitch animation for the title bar too */}
      <span className="terminal-glitch-title flex-1 text-center font-mono text-xs text-[var(--color-muted)] tracking-wider select-none truncate px-2">
        root@portfolio: ~/career — bash
      </span>
      {/* Status chip */}
      <span className="flex-shrink-0 rounded border border-[var(--color-highlight)] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-highlight)] select-none">
        SYSTEM COMPROMISED
      </span>
    </div>
  );
}

/**
 * Readable timeline — the real content, visible unconditionally above the terminal.
 * A recruiter never has to wait on the scroll-typed animation to read company/title/
 * dates/bullets: this renders immediately, in normal document flow. Reuses the same
 * entry shape (title/organization/duration/bullets) the terminal below also types out,
 * so there's no parallel copy to keep in sync.
 */
function ReadableTimeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="mb-8 space-y-6">
      {entries.map((entry) => (
        <article
          key={entry.organization + entry.title}
          className="border-l-2 border-[color-mix(in_srgb,var(--color-link)_45%,transparent)] pl-4"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
            <h3 className="font-display text-base font-bold tracking-tight text-[var(--color-text)] sm:text-lg">
              {entry.title}
            </h3>
            <time className="shrink-0 font-mono text-xs text-[var(--color-muted)]">{entry.duration}</time>
          </div>
          <p className="text-sm font-medium text-[var(--color-link)]">{entry.organization}</p>
          <ul className="mt-2 space-y-1 text-sm leading-relaxed text-[var(--color-muted)]">
            {entry.bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span aria-hidden="true" className="text-[var(--color-accent)]">
                  —
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          {entry.credentialUrl && (
            <p className="mt-2 text-xs text-[var(--color-soft)]">
              Certificate ID: {entry.credentialId}.{' '}
              <a
                href={entry.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-link)] underline-offset-2 hover:underline"
              >
                View credential
              </a>
            </p>
          )}
        </article>
      ))}
    </div>
  );
}

/**
 * Real visible section heading — hacker terminal style.
 *
 * Anatomy (left→right):
 *   > [aria-hidden prompt glyph]  LABEL [glitch-animated span]  █ [aria-hidden cursor]
 *
 * Screen readers see only the label text — prompt glyph + cursor are aria-hidden.
 * Glitch effect: existing terminal-glitch-h2 keyframes (transform + text-shadow only;
 * no DOM duplication of text). Static under prefers-reduced-motion.
 *
 * Font-size: clamp(1.75rem, 8vw, 3.5rem) — never overflows at 390 px, matches
 * .section-title visual weight at wider breakpoints.
 */
function SectionHeading({ label, delay = '0s' }: { label: string; delay?: string }) {
  return (
    <div className="mb-5 pt-2">
      {/*
        h2 colour = --color-text for base legibility; prompt + cursor use --color-accent.
        break-words prevents any edge-case overflow on extreme narrow viewports.
      */}
      <h2
        className="break-words font-mono font-extrabold leading-tight tracking-tight text-[clamp(1.75rem,8vw,3.5rem)]"
        style={{ color: 'var(--color-text)' }}
      >
        {/* Prompt glyph — decorative, not announced by AT */}
        <span
          aria-hidden="true"
          className="select-none"
          style={{ color: 'var(--color-accent)' }}
        >
          {'> '}
        </span>
        {/*
          Label span carries the glitch animation.
          terminal-glitch-h2 uses transform + text-shadow only — no pseudo-elements,
          no DOM text duplication → screen readers read the real text node unaffected.
        */}
        <span
          className="terminal-glitch-h2"
          style={{ animationDelay: delay }}
        >
          {label}
        </span>
        {/* Block cursor — decorative blink, aria-hidden; static under reduced-motion */}
        <span
          aria-hidden="true"
          className="terminal-cursor ml-1 select-none font-normal"
        >
          {'█'}
        </span>
      </h2>
      {/* ASCII rule line — decorative accent beneath heading; overflow-hidden prevents layout bleed */}
      <div
        aria-hidden="true"
        className="mt-2 overflow-hidden select-none font-mono text-xs text-[var(--color-accent)] opacity-40"
      >
        {'──────────────────────────────────────────▶'}
      </div>
    </div>
  );
}

// ─── TerminalSession ──────────────────────────────────────────────────────────

export function TerminalSession() {
  const rm = usePrefersReducedMotion();

  // Find education entry with a credential URL (Codecademy is first)
  const certEntry = educationData.find((e) => e.credentialUrl);

  return (
    <div className="w-full px-4 py-16 sm:px-6 sm:py-20 md:py-28 lg:px-8 lg:py-32">
      {/* Terminal window frame — one visual block containing both sections */}
      <div className="terminal-window relative mx-auto w-full max-w-5xl overflow-hidden rounded-lg border border-[var(--color-border)]">

        {/* CRT scanlines — decorative, pointer-events:none, aria-hidden; gated on motion pref */}
        {!rm && (
          <div
            aria-hidden="true"
            className="terminal-scanlines pointer-events-none absolute inset-0 z-10"
          />
        )}

        <TitleBar />

        <div className="bg-[var(--color-surface)] px-4 pb-8 pt-4 sm:px-6">

          {/* ── EXPERIENCE SECTION ─────────────────────────────────────────── */}
          <section id="experience">
            {/* Real visible heading — first child so nav scroll lands on it */}
            <SectionHeading label="Experience" delay="0s" />

            {/* Readable timeline — real content, visible immediately, no scroll-scrub required.
                Also the only accessible copy now (terminal below stays aria-hidden). */}
            <ReadableTimeline entries={experienceData} />

            {/* Typed terminal content — visual only (aria-hidden); lazy chunk */}
            <div aria-hidden="true">
              <Suspense fallback={<StaticContent blocks={EXP_BLOCKS} />}>
                <ScrollTypedText
                  blocks={EXP_BLOCKS}
                  reducedMotion={rm}
                  className="text-sm leading-relaxed"
                />
              </Suspense>
            </div>
          </section>

          {/* ── EDUCATION SECTION ──────────────────────────────────────────── */}
          <section id="education">
            {/* Real visible heading — first child so nav scroll lands on it */}
            <SectionHeading label="Education" delay="1.3s" />

            {/* Readable timeline — real content, visible immediately, no scroll-scrub required.
                Also the only accessible copy now (terminal below stays aria-hidden). */}
            <ReadableTimeline entries={educationData} />

            {/* Typed terminal content — visual only (aria-hidden); lazy chunk */}
            <div aria-hidden="true">
              <Suspense fallback={<StaticContent blocks={EDU_BLOCKS} />}>
                <ScrollTypedText
                  blocks={EDU_BLOCKS}
                  reducedMotion={rm}
                  className="text-sm leading-relaxed"
                />
              </Suspense>
            </div>
          </section>

        </div>
      </div>

      {/* ── Credential link ─────────────────────────────────────────────────── */}
      {/* Lives OUTSIDE the aria-hidden terminal so AT / keyboard can always reach it.
          Visible to sighted users too. */}
      {certEntry && (
        <div className="mt-4 flex justify-center">
          <a
            href={certEntry.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-2 rounded border border-[color-mix(in_srgb,var(--color-link)_30%,transparent)] px-3 py-2 font-mono text-xs text-[var(--color-link)] transition-colors hover:border-[color-mix(in_srgb,var(--color-accent)_40%,transparent)] hover:text-[var(--color-accent)]"
          >
            <span className="text-[var(--color-muted)]">↳</span>
            View certificate
            {certEntry.credentialId && (
              <span className="text-[var(--color-muted)]">[{certEntry.credentialId}]</span>
            )}
          </a>
        </div>
      )}
    </div>
  );
}
