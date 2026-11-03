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
              accidentally learned to program. That's not really how it had went down,
              but it's a good story to tell. I have always loved computers and how they work,
              and I have always been interested in how things work. I move quickly learning new things,
              and I am always looking for new challenges. So coding was seemed right up my alley.
              One thing lead to another and I ended up at Codecademy, and the rest is history.
            </p>
            <p>
              What keeps me here is the same thing that got me in trouble as a kid taking
              apart the family <span className="keyword-link">Super Nintendo</span>. I like knowing
              how things actually work underneath, from the Postgres row all the way up to
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
          </div>

          <AboutCtaRow onNavigate={goToAnchor} />
        </div>
      </div>
    </>
  );
}
