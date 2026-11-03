import { Link } from "react-router-dom";

import { AboutCtaRow } from "../components/AboutCtaRow";
import { NavBar } from "../components/NavBar";
import { NAV_ITEMS } from "../data/navItems";
import { useHomeAnchor } from "../hooks/useHomeAnchor";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

export function About() {
  useRevealOnScroll();
  // On /about there's no Home-page scroll target, so cross-page anchors always
  // take the navigate("/#id") branch of useHomeAnchor.
  const goToAnchor = useHomeAnchor(() => {});

  return (
    <>
      {/* No scroll-spy or hide-on-scroll off the page: NavBar always visible here,
          "About" highlighted via its own route match (see NavBar's isActive for type:"route"). */}
      <NavBar items={NAV_ITEMS} activeSection="" hidden={false} onNavigate={() => {}} />
      <div className="section-band min-h-screen pt-24 sm:pt-28">
        <div className="content-shell mx-auto max-w-3xl">
          <Link to="/" className="focus-ring mb-10 inline-block text-sm text-[var(--color-link)] underline">
            ← Back to home
          </Link>

          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-[var(--color-soft)]">
            // about
          </p>
          <h1 className="section-title text-left">My Story</h1>

          {/* TODO: user to fill in real bio details — placeholder narrative below */}
          <div className="text-column space-y-6 text-base leading-7 text-[var(--color-muted)] sm:text-lg sm:leading-8">
            <p>
              I got into coding the unglamorous way: something broke, I refused to accept
              "that's just how it is," and a few hundred Stack Overflow tabs later I had
              accidentally learned to program. {/* TODO: replace with real origin story */}
            </p>
            <p>
              What keeps me here is the same thing that got me in trouble as a kid taking
              apart the family <span className="keyword-link">VCR</span> — I like knowing
              how things actually work underneath, from the Postgres row all the way up to
              the pixel. {/* TODO: replace with real "why I stayed" details */}
            </p>
            <p>
              Outside of a keyboard, you'll find me doing a rotating cast of hobbies I will
              not elaborate on here. {/* TODO: user to fill in real hobbies/interests */}
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
          </div>

          <AboutCtaRow onNavigate={goToAnchor} />
        </div>
      </div>
    </>
  );
}
