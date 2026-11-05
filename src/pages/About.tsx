import { Link } from "react-router-dom";

import { AboutCtaRow } from "../components/AboutCtaRow";
import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";
import { SectionRule } from "../components/SectionRule";
import { ContactSection } from "../components/sections/ContactSection";
import { NAV_ITEMS } from "../data/navItems";
import { useHomeAnchor } from "../hooks/useHomeAnchor";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { scrollToId } from "../lib/scrollToId";

export function About() {
  useRevealOnScroll();
  // ContactSection now renders on every page (id="contact" always in the DOM), so
  // useHomeAnchor's DOM-presence check always takes the scroll branch instead of
  // routing - it needs a real scroll, not the no-op it used to get away with.
  // AboutCtaRow only passes raw hrefs (#experience/#contact), not full NavItems -
  // resolve against NAV_ITEMS so "Experience" still gets the anchor-or-route ->
  // /experience routing behavior.
  const handleNavigate = (href: `#${string}`) => scrollToId(href.slice(1));
  const goToAnchor = useHomeAnchor(handleNavigate);
  const handleCtaNavigate = (href: `#${string}`) => {
    const item = NAV_ITEMS.find((navItem) => navItem.type !== "route" && navItem.href === href);
    goToAnchor(item ?? { type: "anchor", label: "", href });
  };

  return (
    <>
      {/* No scroll-spy or hide-on-scroll off the page: NavBar always visible here,
          "About" highlighted via its own route match (see NavBar's isActive for type:"route"). */}
      <NavBar items={NAV_ITEMS} activeSection="" hidden={false} compact={false} onNavigate={handleNavigate} />
      <div className="section-band page-offset">
        <div className="content-shell mx-auto max-w-5xl">
          <Link to="/" className="back-link">
            ← Back to home
          </Link>

          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-[var(--color-soft)]">
            // about
          </p>
          <h1 className="section-title text-left">My Story</h1>

          <div className="text-column space-y-8 text-base leading-7 text-[var(--color-muted)] sm:text-lg sm:leading-8">
            <p>
              I got into coding the unglamorous way: something broke, I refused to accept
              "that's just how it is," and a few hundred Stack Overflow tabs later I had
              accidentally learned to program. I've always loved computers and how they work,
              and I pick up new things fast, so coding seemed right up my alley.
              One thing led to another and I ended up at Codecademy, and the rest is history.
            </p>
            <p>
              What keeps me here is the same thing that got me in trouble as a kid messing with
              too many computer settings running <span className="keyword-link">Roller Coaster Tycoon 2</span> to make the perfect 
              park. I like knowing how things actually work underneath, from the Postgres row all the way up to
              the pixel. I love the feeling of building something from scratch, and seeing it come to life.
              It has been so fun to learn how code can shape a website from nothing into a 
              functional and beautiful experience for the user.
            </p>
            <p>
              Outside of a keyboard, you'll find me doing a rotating cast of hobbies I will
              not elaborate on here. I love to play video games, specifically competitive shooters.
              But I also love to play other games too. From Rocket League to CS2, I love all sorts of
              multiplayer games. I also love college football. It is WAY better than the NFL.
              Seeing the passion and energy of the players and fans is something I love and the
              pure chaos of college football outweighs the NFL any day. I love learning new things,
              I try my best to learn something new every day and try really hard to keep up with the
              ever changing world of technology.
            </p>

            <div className="viewport-animate border-l-2 border-[color-mix(in_srgb,var(--color-link)_45%,transparent)] pl-4">
              <p className="font-mono text-xs uppercase tracking-wide text-[var(--color-soft)] mb-1">
                // status
              </p>
              <ul className="space-y-1 font-mono text-sm text-[var(--color-muted)] sm:text-base">
                <li>
                  <span className="text-[var(--color-link)]">@</span> Data Labeller · Tesla
                </li>
                <li>
                  <span className="text-[var(--color-accent)]">→</span> Open to full-stack roles
                </li>
              </ul>
            </div>

            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/in/nicholas-griffiths-1a1883220/"
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex items-center rounded-md px-2 py-2 font-mono text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-dev)]"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/nickgriff99"
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex items-center rounded-md px-2 py-2 font-mono text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-dev)]"
              >
                GitHub
              </a>
            </div>
          </div>

          <AboutCtaRow onNavigate={handleCtaNavigate} />
        </div>
      </div>

      <SectionRule label="contact" />
      <ContactSection />
      <Footer />
    </>
  );
}
