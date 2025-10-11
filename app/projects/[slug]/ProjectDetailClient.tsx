"use client";

import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SanityProject } from "@/lib/sanity";

type ProjectDetail = SanityProject & {
  images?: string[];
  displayStatus?: string;
  learnings?: string;
};

export default function ProjectDetailClient({ project }: { project: ProjectDetail }) {
  const [activeImage, setActiveImage] = useState(0);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = sectionsRef.current.indexOf(entry.target as HTMLElement);
            if (index !== -1) {
              setActiveSection(index);
            }
          }
        }
      },
      { threshold: 0.3, rootMargin: "-20% 0px -20% 0px" }
    );

    for (const section of sectionsRef.current) {
      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const sectionNames = ["overview", "features", "challenges", "learnings"];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors" aria-label="Back to portfolio">
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </a>

          <div className="flex items-center gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
                aria-label="View on GitHub"
              >
                <Github className="w-4 h-4" />
                Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
                aria-label="View live project"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Side Navigation */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
        <div className="flex flex-col gap-4">
          {sectionNames.map((section, index) => {
            const isActive = activeSection === index;
            return (
              <button
                key={section}
                type="button"
                onClick={() => {
                  const element = sectionsRef.current[index];
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="group relative flex items-center"
                aria-label={`Go to ${section} section`}
              >
                <div
                  className={`w-2 h-2 rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? "bg-foreground border-foreground scale-125"
                      : "border-foreground/30 hover:border-foreground/60"
                  }`}
                />
                {isActive && (
                  <div className="absolute left-6 ml-2 text-sm font-medium text-foreground transition-all duration-300 capitalize whitespace-nowrap">
                    {section}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
          {/* Hero Section */}
          <section ref={(el) => { sectionsRef.current[0] = el; }} className="mb-16">
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {project.year && <span className="text-sm text-foreground/60">{project.year}</span>}
                {project.status && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status?.toLowerCase().includes("completed")
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                    }`}
                  >
                    {project.displayStatus ?? project.status}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6">{project.title}</h1>

              {project.longDescription && (
                <p className="text-xl text-foreground/70 mb-8 leading-relaxed">{project.longDescription}</p>
              )}

              {project.technologies?.length ? (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-foreground/5 border border-foreground/10 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Image Gallery */}
            {project.images && project.images.length > 0 && (
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-foreground/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.images[activeImage]}
                    alt={`${project.title} screenshot ${activeImage + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {project.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {project.images.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActiveImage(index)}
                        className={`flex-shrink-0 w-20 h-12 rounded overflow-hidden border-2 transition-all ${
                          activeImage === index ? "border-foreground" : "border-transparent hover:border-foreground/30"
                        }`}
                        aria-label={`View image ${index + 1}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image} alt={`${project.title} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Features Section */}
          {project.features?.length ? (
            <section ref={(el) => { sectionsRef.current[1] = el; }} className="mb-16">
              <h2 className="text-2xl font-bold mb-8">Key Features</h2>
              <div className="grid gap-4">
                {project.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-foreground/5 border border-foreground/10">
                    <div className="w-2 h-2 rounded-full bg-foreground mt-2 flex-shrink-0" />
                    <span className="text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* Challenges Section */}
          {project.challenges ? (
            <section ref={(el) => { sectionsRef.current[2] = el; }} className="mb-16">
              <h2 className="text-2xl font-bold mb-8">Challenges & Solutions</h2>
              <div className="p-6 rounded-lg bg-foreground/5 border border-foreground/10">
                <p className="text-foreground/80 leading-relaxed">{project.challenges}</p>
              </div>
            </section>
          ) : null}

          {/* Learnings Section */}
          {project.learnings ? (
            <section ref={(el) => { sectionsRef.current[3] = el; }} className="mb-16">
              <h2 className="text-2xl font-bold mb-8">Key Learnings</h2>
              <div className="p-6 rounded-lg bg-foreground/5 border border-foreground/10">
                <p className="text-foreground/80 leading-relaxed">{project.learnings}</p>
              </div>
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
}