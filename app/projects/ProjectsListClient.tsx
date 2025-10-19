"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Github } from "lucide-react";
import type { SanityProject } from "@/lib/sanity";

function toDisplayStatus(status?: string) {
  if (!status) return "";
  switch (status) {
    case "completed":
      return "Completed";
    case "in-progress":
      return "In Progress";
    case "planned":
      return "Planned";
    default:
      return status;
  }
}

type Props = {
  initialProjects: SanityProject[];
};

export default function ProjectsListClient({ initialProjects }: Props) {
  const router = useRouter();
  const [projects] = useState<SanityProject[]>(initialProjects || []);
  const [filteredProjects, setFilteredProjects] = useState<SanityProject[]>(projects);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const categories = useMemo(() => {
    const set = new Set<string>(projects.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [projects]);

  const statuses = useMemo(() => {
    const set = new Set<string>(projects.map((p) => p.status).filter(Boolean));
    const display = Array.from(set).map(toDisplayStatus);
    return ["All", ...display];
  }, [projects]);

  useEffect(() => {
    let filtered = projects;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((project) => project.category === selectedCategory);
    }

    if (selectedStatus !== "All") {
      filtered = filtered.filter((project) => toDisplayStatus(project.status) === selectedStatus);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((project) => {
        const titleMatch = project.title?.toLowerCase().includes(term);
        const descMatch = project.description?.toLowerCase().includes(term);
        const techMatch = (project.technologies || []).some((tech) => tech.toLowerCase().includes(term));
        return Boolean(titleMatch || descMatch || techMatch);
      });
    }

    setFilteredProjects(filtered);
  }, [projects, selectedCategory, selectedStatus, searchTerm]);

  return (
    <div>
      {/* Filters */}
      <div className="mb-12 space-y-6">
        {/* Search */}
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-muted-foreground/50 transition-colors text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Category and Status Filters */}
        <div className="flex flex-wrap gap-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  selectedCategory === category
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  selectedStatus === status
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        {filteredProjects.map((project) => (
          <div
            key={project._id}
            role="link"
            tabIndex={0}
            onClick={() => router.push(`/projects/${project.slug?.current || ""}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                router.push(`/projects/${project.slug?.current || ""}`);
              }
            }}
            className="group block rounded-lg border border-border p-6 transition-all duration-500 hover:border-muted-foreground/50 hover:shadow-lg sm:p-8 cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-muted-foreground text-xs">
                <span>{project.year || project._createdAt?.slice(0, 4)}</span>
                <span className="rounded-full bg-muted px-2 py-1 text-xs">
                  {toDisplayStatus(project.status)}
                </span>
              </div>

              <h3 className="font-medium text-lg transition-colors group-hover:text-muted-foreground sm:text-xl">
                {project.title}
              </h3>

              <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {(project.technologies || []).map((tech) => (
                  <span
                    key={`${project._id}-${tech}`}
                    className="rounded-md bg-muted px-2 py-1 font-mono text-muted-foreground text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground text-sm transition-colors duration-300 group-hover:text-foreground">
                  <span>View project</span>
                  <svg
                    className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>

                <div className="flex gap-2">
                  {project.githubUrl && (
                    <button
                      type="button"
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      title="View on GitHub"
                      aria-label="View on GitHub"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (project.githubUrl) {
                          window.open(project.githubUrl, "_blank", "noopener,noreferrer");
                        }
                      }}
                    >
                      <Github className="w-4 h-4" />
                    </button>
                  )}
                  {(project.liveUrl || project.demoUrl) && (
                    <button
                      type="button"
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      title="View Live Demo"
                      aria-label="View Live Demo"
                      onClick={(e) => {
                        e.stopPropagation();
                        const url = project.liveUrl || project.demoUrl;
                        if (url) {
                          window.open(url, "_blank", "noopener,noreferrer");
                        }
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-4">No projects found matching your criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedStatus("All");
              setSearchTerm("");
            }}
            className="text-foreground hover:text-muted-foreground transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}