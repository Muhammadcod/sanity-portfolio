import { Portfolio } from "@/components/modernist/portfolio";
import { type Article, FALLBACK_PROJECTS, type Project } from "@/components/modernist/data";
import { getAllProjects, getRecentArticles } from "@/lib/sanity";

export const revalidate = 3600;

export default async function Home() {
  const [all, recent] = await Promise.all([getAllProjects(), getRecentArticles()]);

  // Featured first, then the rest — the homepage lists the first few and offers "show all".
  const sorted = [...all].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  const projects: Project[] = sorted.length
    ? sorted.map((p) => ({
        key: p._id,
        name: p.title,
        year: p.year,
        stack: p.technologies ?? [],
        built: p.description,
        slug: p.slug.current,
        kind: p.category,
        role: p.role,
        status: p.status,
        liveUrl: p.liveUrl,
        image: p.image,
        imageAlt: p.imageAlt,
        buildImage: p.buildImage,
        buildImageAlt: p.buildImageAlt,
        layers: p.stackLayers,
        problem: p.problem,
        approach: p.approach,
        details: p.challenges,
        result: p.result?.length ? p.result : p.learnings,
      }))
    : FALLBACK_PROJECTS;

  const articles: Article[] = (recent ?? []).map((a) => ({
    key: a._id,
    title: a.title,
    meta: a.tags?.[0] ?? "Article",
    date: a.publishedAt,
    readTime: a.readTime,
    author: a.author,
    href: a.externalUrl,
    content: a.content,
  }));

  return <Portfolio projects={projects} articles={articles} />;
}
