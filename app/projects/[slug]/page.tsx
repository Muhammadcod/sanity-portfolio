import { sanityFetch } from '@/sanity/lib/live';
import { projectBySlugQuery } from '@/sanity/lib/queries';
import type { SanityProject } from '@/lib/sanity';
import ProjectDetailClient from '@/app/projects/[slug]/ProjectDetailClient';

type ProjectDetail = SanityProject & { gallery?: string[] };

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const { data } = await sanityFetch({
    query: projectBySlugQuery,
    params: { slug: params.slug },
  });

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <a href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
            ← Back to Portfolio
          </a>
        </div>
      </div>
    );
  }

  // Normalize fields for UI
  const normalized: ProjectDetail & { images?: string[]; displayStatus?: string } = {
    ...(data as ProjectDetail),
    images: (data as any)?.gallery?.length ? (data as any).gallery : (data as any)?.image ? [
      (data as any).image
    ] : [],
    displayStatus: (data as any)?.status?.replace('-', ' ')?.replace(/\b\w/g, (c: string) => c.toUpperCase()),
  };

  return <ProjectDetailClient project={normalized} />;
}