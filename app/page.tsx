"use client";

import Link from "next/link";
import {useEffect, useRef, useState} from "react";

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
            setActiveSection(entry.target.id);
          }
        }
      },
      {threshold: 0.3, rootMargin: "0px 0px -20% 0px"},
    );

    for (const section of sectionsRef.current) {
      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <nav className="-translate-y-1/2 fixed top-1/2 left-8 z-10 hidden lg:block">
        <div className="flex flex-col gap-4">
          {["intro", "work", "projects", "thoughts", "connect"].map((section) => (
            <button
              type="button"
              key={section}
              onClick={() =>
                document
                  .getElementById(section)
                  ?.scrollIntoView({behavior: "smooth"})
              }
              className={`h-8 w-2 rounded-full transition-all duration-500 ${
                activeSection === section
                  ? "bg-foreground"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
              aria-label={`Navigate to ${section}`}
            />
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-16">
        <header
          id="intro"
          ref={(el) => {
            sectionsRef.current[0] = el;
          }}
          className="flex min-h-screen items-center opacity-0"
        >
          <div className="grid w-full gap-12 sm:gap-16 lg:grid-cols-5">
            <div className="space-y-6 sm:space-y-8 lg:col-span-3">
              <div className="space-y-3 sm:space-y-2">
                <div className="font-mono text-muted-foreground text-sm tracking-wider">
                  PORTFOLIO / 2025
                </div>
                <h1 className="font-light text-5xl tracking-tight sm:text-6xl lg:text-7xl">
                  Mohammed
                  <br/>
                  <span className="text-muted-foreground">Adebayo</span>
                </h1>
              </div>

              <div className="max-w-md space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed sm:text-xl">
                  Frontend Developer Lead crafting digital experiences at the
                  intersection of
                  <span className="text-foreground"> design</span>,
                  <span className="text-foreground"> technology</span>, and
                  <span className="text-foreground"> user experience</span>.
                </p>

                <div className="flex flex-col gap-3 text-muted-foreground text-sm sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"/>
                    Available for work
                  </div>
                  <div>Osogbo, Nigeria</div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col justify-end space-y-6 sm:space-y-8 lg:col-span-2 lg:mt-0">
              <div className="space-y-4">
                <div className="font-mono text-muted-foreground text-sm">
                  CURRENTLY
                </div>
                <div className="space-y-2">
                  <div className="text-foreground">Frontend Developer Lead</div>
                  <div className="text-muted-foreground">@ Summitech</div>
                  <div className="text-muted-foreground text-xs">
                    2021 — Present
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="font-mono text-muted-foreground text-sm">
                  FOCUS
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "React",
                    "TypeScript",
                    "Nextjs",
                    "Tailwind",
                    "Convex",
                    "Vue",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-border px-3 py-1 text-xs transition-colors duration-300 hover:border-muted-foreground/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <section
          id="work"
          ref={(el) => {
            sectionsRef.current[1] = el;
          }}
          className="min-h-screen py-20 opacity-0 sm:py-32"
        >
          <div className="space-y-12 sm:space-y-16">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="font-light text-3xl sm:text-4xl">Selected Work</h2>
              <div className="font-mono text-muted-foreground text-sm">
                2021 — 2025
              </div>
            </div>

            <div className="space-y-8 sm:space-y-12">
              {[
                {
                  year: "2024",
                  role: "Frontend Developer",
                  company: "Borderpal",
                  description:
                    "Led the end-to-end development of Borderpal's frontend, building the platform from scratch using React/Next.js. Designed and implemented scalable architecture, reusable UI components, and API integrations.",
                  tech: ["Next.js", "Tailwind CSS"],
                },
                {
                  year: "2021",
                  role: "Frontend Developer",
                  company: "Midst",
                  description:
                    "Contributed to building and optimizing frontend applications, ensuring seamless user experiences through modern frameworks and scalable UI components.",
                  tech: ["React", "Next.js"],
                },
                {
                  year: "2021",
                  role: "Frontend Developer",
                  company: "Summitech",
                  description:
                    "Contributed to frontend development focusing on building reusable components, integrating APIs, and optimizing application performance while collaborating with designers and backend engineers.",
                  tech: [
                    "React",
                    "Nuxt.js",
                    "Next.js",
                    "Bootstrap",
                    "Tailwind CSS",
                  ],
                },
                {
                  year: "2020",
                  role: "Web Developer",
                  company: "Freelance (Contract)",
                  description:
                    "Worked with different clients to build websites and web applications, collaborating with designers to ensure seamless user experiences.",
                  tech: [
                    "React",
                    "Gatsby",
                    "Next.js",
                    "Bootstrap",
                    "Tailwind CSS",
                  ],
                },
              ].map((job) => (
                <div
                  key={`${job.company}-${job.year}`}
                  className="group grid gap-4 border-border/50 border-b py-6 transition-colors duration-500 hover:border-border sm:gap-8 sm:py-8 lg:grid-cols-12"
                >
                  <div className="lg:col-span-2">
                    <div
                      className="font-light text-muted-foreground text-xl transition-colors duration-500 group-hover:text-foreground sm:text-2xl">
                      {job.year}
                    </div>
                  </div>

                  <div className="space-y-3 lg:col-span-6">
                    <div>
                      <h3 className="font-medium text-lg sm:text-xl">
                        {job.role}
                      </h3>
                      <div className="text-muted-foreground">{job.company}</div>
                    </div>
                    <p className="max-w-lg text-muted-foreground leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2 lg:col-span-4 lg:mt-0 lg:justify-end">
                    {job.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded px-2 py-1 text-muted-foreground text-xs transition-colors duration-500 group-hover:border-muted-foreground/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="projects"
          ref={(el) => {
            sectionsRef.current[2] = el;
          }}
          className="min-h-screen py-20 opacity-0 sm:py-32"
        >
          <div className="space-y-12 sm:space-y-16">
            <h2 className="font-light text-3xl sm:text-4xl">Past Projects / Highlights</h2>

            <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
              {[
                {
                  title: "E-commerce Platform",
                  description: "Built a full-stack e-commerce solution with Next.js, featuring user authentication, payment integration, and admin dashboard.",
                  tech: ["Next.js", "TypeScript", "Stripe", "Prisma"],
                  status: "Live",
                  year: "2024",
                },
                {
                  title: "Task Management App",
                  description: "Developed a collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
                  tech: ["React", "Node.js", "Socket.io", "MongoDB"],
                  status: "Live",
                  year: "2023",
                },
                {
                  title: "Portfolio Website",
                  description: "Designed and developed a responsive portfolio website with dark/light theme toggle and smooth animations.",
                  tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
                  status: "Live",
                  year: "2024",
                },
                {
                  title: "Analytics Dashboard",
                  description: "Created a comprehensive analytics dashboard with data visualization, real-time metrics, and customizable reporting features.",
                  tech: ["Vue.js", "D3.js", "Express", "PostgreSQL"],
                  status: "Live",
                  year: "2023",
                },
              ].map((project) => (
                <article
                  key={project.title}
                  className="group cursor-pointer rounded-lg border border-border p-6 transition-all duration-500 hover:border-muted-foreground/50 hover:shadow-lg sm:p-8"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between font-mono text-muted-foreground text-xs">
                      <span>{project.year}</span>
                      <span className="rounded-full bg-muted px-2 py-1 text-xs">{project.status}</span>
                    </div>

                    <h3
                      className="font-medium text-lg transition-colors duration-300 group-hover:text-muted-foreground sm:text-xl">
                      {project.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="rounded px-2 py-1 text-muted-foreground text-xs transition-colors duration-500 group-hover:border-muted-foreground/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div
                      className="flex items-center gap-2 text-muted-foreground text-sm transition-colors duration-300 group-hover:text-foreground">
                      <span>View project</span>
                      <svg
                        className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="thoughts"
          ref={(el) => {
            sectionsRef.current[3] = el;
          }}
          className="min-h-screen py-20 opacity-0 sm:py-32"
        >
          <div className="space-y-12 sm:space-y-16">
            <h2 className="font-light text-3xl sm:text-4xl">Recent Thoughts</h2>

            <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
              {[
                {
                  title: "The Future of Web Development",
                  excerpt:
                    "Exploring how AI and automation are reshaping the way we build for the web.",
                  date: "Dec 2024",
                  readTime: "5 min",
                },
                {
                  title: "Design Systems at Scale",
                  excerpt:
                    "Lessons learned from building and maintaining design systems across multiple products.",
                  date: "Nov 2024",
                  readTime: "8 min",
                },
                {
                  title: "Performance-First Development",
                  excerpt:
                    "Why performance should be a first-class citizen in your development workflow.",
                  date: "Oct 2024",
                  readTime: "6 min",
                },
                {
                  title: "The Art of Code Review",
                  excerpt:
                    "Building better software through thoughtful and constructive code reviews.",
                  date: "Sep 2024",
                  readTime: "4 min",
                },
              ].map((post) => (
                <article
                  key={post.title}
                  className="group cursor-pointer rounded-lg border border-border p-6 transition-all duration-500 hover:border-muted-foreground/50 hover:shadow-lg sm:p-8"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between font-mono text-muted-foreground text-xs">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3
                      className="font-medium text-lg transition-colors duration-300 group-hover:text-muted-foreground sm:text-xl">
                      {post.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div
                      className="flex items-center gap-2 text-muted-foreground text-sm transition-colors duration-300 group-hover:text-foreground">
                      <span>Read more</span>
                      <svg
                        className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="connect"
          ref={(el) => {
            sectionsRef.current[4] = el;
          }}
          className="py-20 opacity-0 sm:py-32"
        >
          <div className="grid gap-12 sm:gap-16 lg:grid-cols-2">
            <div className="space-y-6 sm:space-y-8">
              <h2 className="font-light text-3xl sm:text-4xl">Let's Connect</h2>

              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed sm:text-xl">
                  Always interested in new opportunities, collaborations, and
                  conversations about technology and design.
                </p>

                <div className="space-y-4">
                  <Link
                    href="mailto:adebayomuhammad47@gmail.com"
                    className="group flex items-center gap-3 text-foreground transition-colors duration-300 hover:text-muted-foreground"
                  >
                    <span className="text-base sm:text-lg">
                      adebayomuhammad47@gmail.com
                    </span>
                    <svg
                      className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="font-mono text-muted-foreground text-sm">
                ELSEWHERE
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    name: "GitHub",
                    handle: "@Muhammadcod",
                    url: "https://github.com/Muhammadcod",
                  },
                  {
                    name: "Twitter",
                    handle: "@muhbiy",
                    url: "https://twitter.com/muhbiy",
                  },
                  {
                    name: "LinkedIn",
                    handle: "adebayo-mohammed",
                    url: "https://linkedin.com/in/adebayo-mohammed",
                  },
                  {
                    name: "TikTok",
                    handle: "@muhbiy",
                    url: "https://tiktok.com/@muhbiy",
                  },
                ].map((social) => (
                  <Link
                    key={social.name}
                    href={social.url}
                    className="group rounded-lg border border-border p-4 transition-all duration-300 hover:border-muted-foreground/50 hover:shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="text-foreground transition-colors duration-300 group-hover:text-muted-foreground">
                        {social.name}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {social.handle}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="border-border border-t py-12 sm:py-16">
          <div className="flex flex-col items-start justify-between gap-6 sm:gap-8 lg:flex-row lg:items-center">
            <div className="space-y-2">
              <div className="text-muted-foreground text-sm">
                © 2025 Mohammed Adebayo. All rights reserved.
              </div>
              <div className="text-muted-foreground text-xs">
                Built with Next.js by Mohammed Adebayo
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleTheme}
                className="group rounded-lg border border-border p-3 transition-all duration-300 hover:border-muted-foreground/50"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg
                    className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-foreground"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-foreground"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                  </svg>
                )}
              </button>

              <button
                type="button"
                className="group rounded-lg border border-border p-3 transition-all duration-300 hover:border-muted-foreground/50"
                aria-label="Open chat"
              >
                <svg
                  className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </footer>
      </main>

      <div
        className="pointer-events-none fixed right-0 bottom-0 left-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent"/>
    </div>
  );
}
