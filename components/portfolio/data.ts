import type { SanityArticle, SanityProject } from "@/lib/sanity"

export interface Project {
  slug: string
  name: string
  year: string
  cat: string
  status: string
  stack: string[]
  blurb: string
  overview: string
  repo?: string
  live?: string
  image?: string
  imageAlt?: string
  gallery: string[]
  demo?: string
  features: string[]
  solutions: string[]
  tags: string[]
  // biome-ignore lint/suspicious/noExplicitAny: Portable Text blocks
  challenges: any[]
  // biome-ignore lint/suspicious/noExplicitAny: Portable Text blocks
  learnings: any[]
}

export interface Article {
  slug: string
  title: string
  author: string
  excerpt?: string
  date?: string
  readTime?: string
  topic: string
  tags: string[]
  cover?: string
  coverAlt?: string
  externalUrl?: string
  // biome-ignore lint/suspicious/noExplicitAny: Portable Text blocks
  content: any[]
}

/** Let the Sanity CDN resize and pick a modern format, since next/image optimisation is off. */
function cdn(url: string | undefined, width: number) {
  if (!url?.startsWith("https://cdn.sanity.io/")) return url || undefined
  return `${url}?w=${width}&q=80&auto=format`
}

export function toProject(p: SanityProject): Project {
  return {
    slug: p.slug.current,
    name: p.title,
    year: p.year ?? "",
    cat: p.category ?? "project",
    status: p.status ?? "live",
    stack: p.technologies ?? [],
    blurb: p.description ?? "",
    overview: p.longDescription || p.description || "",
    repo: p.githubUrl || undefined,
    live: p.liveUrl || p.demoUrl || undefined,
    image: cdn(p.image, 2000),
    imageAlt: p.imageAlt || undefined,
    gallery: (p.gallery ?? []).filter(Boolean).map((url) => cdn(url, 1400) as string),
    demo: p.demoUrl && p.demoUrl !== p.liveUrl ? p.demoUrl : undefined,
    features: p.features?.filter(Boolean) ?? [],
    solutions: p.solutions?.filter(Boolean) ?? [],
    tags: p.tags?.filter(Boolean) ?? [],
    challenges: Array.isArray(p.challenges) ? p.challenges : [],
    learnings: Array.isArray(p.learnings) ? p.learnings : [],
  }
}

/** Newest first; Sanity's orderRank breaks ties because Array.sort is stable. */
export function sortByYear(list: Project[]) {
  return [...list].sort((a, b) => (Number.parseInt(b.year) || 0) - (Number.parseInt(a.year) || 0))
}

export function toArticle(a: SanityArticle): Article {
  return {
    slug: a.slug.current,
    title: a.title,
    author: a.author || "Mohammed Adebayo",
    excerpt: a.excerpt,
    date: a.publishedAt
      ? new Date(a.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
      : undefined,
    readTime: a.readTime,
    topic: a.tags?.[0]?.toLowerCase() ?? "article",
    tags: a.tags ?? [],
    cover: a.coverImage,
    coverAlt: a.coverImageAlt,
    externalUrl: a.externalUrl,
    content: Array.isArray(a.content) ? a.content : [],
  }
}

/** Label a repo link by its host so GitLab repos aren't called GitHub. */
export function repoLabel(url: string) {
  if (url.includes("gitlab.")) return "GitLab"
  if (url.includes("bitbucket.")) return "Bitbucket"
  return "GitHub"
}

export interface Job {
  hash: string
  years: string
  msg: string
  company: string
  role: string
  desc: string
  stack: string
}

export const jobs: Job[] = [
  {
    hash: "e41c7a2",
    years: "2021 — present",
    msg: "feat: lead frontend",
    company: "Summitech",
    role: "Frontend Developer Lead",
    desc: "Leading frontend work — reusable component systems, API integration and performance, in close loops with designers and backend engineers.",
    stack: "React · Nuxt.js · Next.js · Tailwind",
  },
  {
    hash: "9b03df8",
    years: "2024",
    msg: "init: platform from scratch",
    company: "Borderpal",
    role: "Frontend Developer",
    desc: "Owned Borderpal's frontend end to end: scalable architecture, reusable UI and API integrations, built from an empty repo.",
    stack: "Next.js · Tailwind CSS",
  },
  {
    hash: "57ae1c0",
    years: "2021",
    msg: "perf: optimise frontend apps",
    company: "Midst",
    role: "Frontend Developer",
    desc: "Built and optimised frontend applications with modern frameworks and scalable UI components.",
    stack: "React · Next.js",
  },
  {
    hash: "0c9f3b4",
    years: "2020",
    msg: "chore: first commits",
    company: "Freelance",
    role: "Web Developer (Contract)",
    desc: "Built websites and web apps for a range of clients, working alongside designers.",
    stack: "React · Gatsby · Next.js",
  },
]

export const aboutText =
  "I'm Mohammed, a frontend lead from Nigeria. For Six years I've turned designs into interfaces that load fast, read clearly and hold up at scale — mostly React and TypeScript, sometimes Vue, always with an eye on the small details."

export const facts = [
  { k: "location", v: "Nigeria — remote" },
  { k: "role", v: "Frontend Developer Lead" },
  { k: "experience", v: "6 years" },
  { k: "focus", v: "React, TypeScript, Next.js, Tailwind, Convex, Vue" },
]

export const socials = [
  { short: "gh/Muhammadcod", href: "https://github.com/Muhammadcod" },
  { short: "x/muhbiy", href: "https://twitter.com/muhbiy" },
  { short: "in/adebayo-mohammed", href: "https://linkedin.com/in/adebayo-mohammed" },
  { short: "tt/muhbiy", href: "https://tiktok.com/@muhbiy" },
]

export const email = "adebayomuhammad47@gmail.com"

export const rotWords = ["interfaces", "design systems", "dashboards", "fast frontends", "tiny details"]
