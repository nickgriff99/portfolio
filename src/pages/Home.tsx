import { useMemo, useState } from "react";

import { ContactForm } from "../components/ContactForm";
import { ProjectCarousel } from "../components/ProjectCarousel";
import { SkillsWidget } from "../components/SkillsWidget";
import { educationData } from "../data/education";
import { experienceData } from "../data/experience";
import { usePortfolioScroll } from "../hooks/usePortfolioScroll";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import type { NavItem, TimelineEntry } from "../types";

function Timeline({ items }: { items: TimelineEntry[] }) {
  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="absolute bottom-0 left-[21px] top-0 w-0.5 bg-brand-primary md:left-1/2 md:-translate-x-1/2" />

      {items.map((item, index) => {
        const isEven = index % 2 === 1;

        return (
          <article
            key={`${item.organization}-${item.title}`}
            className={`viewport-animate relative mb-8 w-full pl-12 pr-4 md:w-1/2 ${
              isEven ? "md:left-1/2 md:pl-10 md:pr-0" : "md:left-0 md:pl-0 md:pr-10"
            }`}
          >
            <div
              className={`absolute left-[15px] top-[15px] z-10 h-3 w-3 rounded-full border-4 border-slate-100 bg-brand-primary md:h-5 md:w-5 ${
                isEven ? "md:left-[-10px]" : "md:left-auto md:right-[-10px]"
              }`}
            />

            <div className="rounded-md bg-slate-100 px-5 py-5 shadow-[0_4px_15px_rgba(31,41,55,0.1)] md:px-8">
              <h3 className="mb-2 text-2xl font-semibold text-brand-primary">
                {item.title}
              </h3>
              <h4 className="mb-2 text-lg font-medium text-zinc-800">
                {item.organization}
              </h4>
              <p className="mb-4 italic text-zinc-500">{item.duration}</p>
              <ul className="space-y-2">
                {item.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="relative pl-6 text-zinc-600 before:absolute before:left-0 before:text-accent-emerald before:content-['▶']"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function Home() {
  const navItems = useMemo<NavItem[]>(
    () => [
      { label: "About", href: "#about" },
      { label: "Experience", href: "#experience" },
      { label: "Projects", href: "#projects" },
      { label: "Contact", href: "#contact" },
    ],
    [],
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sectionIds = [
    "home",
    "about",
    "skills",
    "experience",
    "education",
    "projects",
    "contact",
  ];

  const { activeSection, headerHidden, showBackToTop, scrollToSection } =
    usePortfolioScroll(sectionIds);

  useRevealOnScroll();

  const handleNavClick = (href: string) => {
    const id = href.replace("#", "");
    scrollToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 w-full border-b border-white/40 bg-slate-50/95 shadow-lg shadow-slate-900/10 backdrop-blur transition-all duration-300 ${
          headerHidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <nav className="py-4">
          <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-7 md:px-10 lg:px-20">
            <a
              href="#home"
              onClick={(event) => {
                event.preventDefault();
                handleNavClick("#home");
              }}
              className="text-2xl font-extrabold tracking-tight text-zinc-800"
            >
              Nicholas Griffiths
            </a>

            <ul
              className={`fixed top-[70px] z-40 flex w-full flex-col gap-7 bg-white py-8 text-center shadow-lg shadow-zinc-900/10 transition-all duration-150 md:static md:w-auto md:flex-row md:bg-transparent md:py-0 md:shadow-none ${
                mobileMenuOpen ? "left-0" : "-left-full"
              }`}
            >
              {navItems.map((item) => {
                const sectionId = item.href.replace("#", "");
                const isActive = sectionId === activeSection;

                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={(event) => {
                        event.preventDefault();
                        handleNavClick(item.href);
                      }}
                      className={`text-base font-semibold transition-colors duration-150 ${
                        isActive
                          ? "text-brand-primary"
                          : "text-zinc-500 hover:text-brand-primary"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            <button
              className="flex cursor-pointer flex-col gap-[6px] rounded p-2 transition-colors hover:bg-white md:hidden"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Open mobile menu"
            >
              <span
                className={`block h-[3px] w-[25px] bg-zinc-800 transition-all duration-150 ${
                  mobileMenuOpen ? "translate-y-[9px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[3px] w-[25px] bg-zinc-800 transition-all duration-150 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-[3px] w-[25px] bg-zinc-800 transition-all duration-150 ${
                  mobileMenuOpen ? "-translate-y-[9px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section
          id="home"
          className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-primary via-brand-dark to-accent-emerald bg-[length:400%_400%] px-5 pt-20 text-center text-slate-50 animate-gradientMove md:px-8"
        >
          <div className="mx-auto w-full max-w-4xl">
            <h1 className="viewport-animate keep-visible mb-4 text-4xl font-bold md:text-6xl">
              Hello, I&apos;m <span className="text-amber-400">Nicholas Griffiths</span>
            </h1>
            <h2 className="viewport-animate keep-visible mb-6 text-2xl font-semibold opacity-90 md:text-3xl">
              Full Stack Web Developer
            </h2>
            <p className="viewport-animate mb-8 text-lg opacity-80 md:text-xl">
              I create exceptional digital experiences through clean code and
              innovative design.
            </p>
            <div className="viewport-animate flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
              <button
                onClick={() => handleNavClick("#projects")}
                className="btn-glass"
              >
                View My Work
              </button>
              <button
                onClick={() => handleNavClick("#contact")}
                className="btn-glass"
              >
                Get In Touch
              </button>
            </div>
          </div>
        </section>

        <section id="about" className="section-shell">
          <div className="site-container">
            <h2 className="section-title viewport-animate">About Me</h2>
            <div className="flex flex-col items-center justify-center gap-10 lg:flex-row lg:items-start">
              <div>
                <p className="viewport-animate mb-8 max-w-2xl text-lg leading-8 text-zinc-600">
                  Hello world! I&apos;m Nick, a web developer with a strong focus on
                  professionalism and attention to detail-making your site look
                  EXTRA nice. With a diverse background spanning management,
                  sales, and quality assurance, I bring valuable real-world
                  experience and exceptional time management skills to every
                  project.
                </p>
                <p className="viewport-animate mb-8 max-w-2xl text-lg leading-8 text-zinc-600">
                  As a natural leader who believes in team success, I work
                  tirelessly to ensure the highest quality in everything I
                  deliver. Now working as a QA/R&D Engineer with Tesla and
                  freelance web developer, I specialize in creating user-friendly,
                  gorgeous websites that enhance your online presence and drive
                  results.
                </p>
                <p className="viewport-animate mb-8 max-w-2xl text-lg leading-8 text-zinc-600">
                  I&apos;m passionate about continuous learning and staying current
                  with emerging technologies and trends. My approach combines
                  strong people skills and work ethic from my previous roles with
                  ever-evolving web development expertise, always looking for ways
                  to improve operations and enhance the user experience.
                </p>
              </div>
              <div className="viewport-animate w-full max-w-xl">
                <img
                  src="/assets/images/profile-family.jpg"
                  alt="Nicholas Griffiths"
                  className="w-full rounded-xl shadow-[0_10px_30px_rgba(31,41,55,0.1)]"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="section-shell mx-auto w-full max-w-6xl">
          <div className="site-container">
            <h2 className="section-title viewport-animate">Skills & Technologies</h2>
            <SkillsWidget />
          </div>
        </section>

        <section id="experience" className="section-shell">
          <div className="site-container">
            <h2 className="section-title viewport-animate">Experience</h2>
            <Timeline items={experienceData} />
          </div>
        </section>

        <section id="education" className="section-shell">
          <div className="site-container">
            <h2 className="section-title viewport-animate">Education</h2>
            <Timeline items={educationData} />
          </div>
        </section>

        <section id="projects" className="section-shell">
          <div className="site-container pb-14">
            <h2 className="section-title viewport-animate">Featured Projects</h2>
            <ProjectCarousel />
          </div>
        </section>

        <section id="contact" className="section-shell">
          <div className="site-container">
            <h2 className="section-title viewport-animate">Get In Touch</h2>
            <div className="flex flex-col justify-center gap-8 lg:flex-row lg:gap-12">
              <div className="viewport-animate max-w-2xl">
                <h3 className="mb-8 text-3xl font-semibold text-zinc-800">
                  Let&apos;s Work Together
                </h3>
                <p className="mb-10 leading-7 text-zinc-600">
                  I&apos;m always interested in new opportunities and exciting
                  projects. Whether you have a question or just want to say hi,
                  I&apos;ll try my best to get back to you!
                </p>
                <div className="mb-8">
                  <div className="mb-4 py-2 text-zinc-600">
                    <strong>Email:</strong> nichg999@gmail.com
                  </div>
                  <div className="mb-4 py-2 text-zinc-600">
                    <strong>Phone:</strong> Available upon request
                  </div>
                  <div className="mb-4 py-2 text-zinc-600">
                    <strong>Location:</strong> Available for remote work
                  </div>
                </div>
                <div className="flex gap-4">
                  <a
                    href="https://www.linkedin.com/in/nicholas-griffiths-1a1883220/"
                    className="font-semibold text-brand-primary transition-colors hover:text-brand-dark"
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/nickgriff99"
                    className="font-semibold text-brand-primary transition-colors hover:text-brand-dark"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                </div>
              </div>

              <div className="viewport-animate rounded-xl bg-slate-100 p-8 shadow-card">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full bg-slate-100 py-8 text-center">
        <div className="site-container py-0">
          <p>&copy; 2025 Nicholas Griffiths. All rights reserved.</p>
        </div>
      </footer>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary text-xl text-white shadow-lg shadow-zinc-900/20 transition-all duration-300 hover:brightness-110 ${
          showBackToTop ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        ↑
      </button>
    </>
  );
}
