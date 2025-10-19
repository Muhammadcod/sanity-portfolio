import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { sanityFetch } from '@/sanity/lib/live';
import { projectsQuery } from '@/sanity/lib/queries';
import type { SanityProject } from '@/lib/sanity';
import ProjectsListClient from './ProjectsListClient';

export default async function ProjectsPage() {
  const { data } = await sanityFetch({
    query: projectsQuery,
    params: {},
  });

  const projects: SanityProject[] = Array.isArray(data) ? data : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </Link>
            <h1 className="font-light text-xl">All Projects</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-16">
            <h1 className="font-light text-3xl sm:text-4xl mb-4">All Projects</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              A collection of projects I've worked on, showcasing different technologies and problem-solving approaches.
            </p>
          </div>

          {/* Client list with filters/search */}
          <ProjectsListClient initialProjects={projects} />
        </div>
      </main>
    </div>
  );
}