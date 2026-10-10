import type { PortableTextBlock } from "@portabletext/types";

export type Project = {
  key: string;
  name: string;
  year: string;
  stack: string[];
  built: string;
  /* case study — all optional, sections hide when empty */
  kind?: string;
  role?: string;
  status?: string;
  liveUrl?: string;
  image?: string;
  imageAlt?: string;
  buildImage?: string;
  buildImageAlt?: string;
  layers?: string[];
  problem?: PortableTextBlock[];
  approach?: PortableTextBlock[];
  details?: PortableTextBlock[];
  result?: PortableTextBlock[];
  slug?: string;
};

export const FALLBACK_PROJECTS: Project[] = [
  { key: "breeg", name: "Breeg", year: "2025", stack: ["Next.js", "Convex"], built: "An all-in-one cohort platform that helps creators and educators launch, manage and scale collaborative learning experiences." },
  { key: "alvin", name: "Alvin", year: "2025", stack: ["Next.js", "Auth.js", "Tailwind CSS"], built: "A sleek, content-first reading app — discover and read curated articles in a visually engaging grid." },
  { key: "admin", name: "Admin Dashboard", year: "2021", stack: ["React", "Axios", "Placeholder APIs"], built: "A web dashboard for managing engineering teams efficiently." },
  { key: "gallery", name: "Image Gallery", year: "2021", stack: ["Vue", "Unsplash API"], built: "A curated gallery of photography with search, plus shadow placeholders that hold the layout while images load." },
  { key: "myreads", name: "MyReads", year: "2020", stack: ["React", "JavaScript", "Netlify"], built: "A React book tracker for what you are reading, want to read and have finished — after Udacity’s MyReads project." },
];

export const EXP = [
  { co: "Summitech", role: "Frontend Developer Lead", period: "2021 — Present", year: "2021—NOW", text: "Leading frontend at Summitech: reusable component systems, API integration and application performance — in close collaboration with designers and backend engineers.", tech: ["React", "Nuxt.js", "Next.js", "Bootstrap", "Tailwind CSS"] },
  { co: "Borderpal", role: "Frontend Developer", period: "2024", year: "2024", text: "Led Borderpal’s frontend end to end — built the platform from scratch in React and Next.js, with a scalable architecture, a reusable UI component library and the API integrations behind it.", tech: ["Next.js", "Tailwind CSS"] },
  { co: "Midst", role: "Frontend Developer", period: "2021", year: "2021", text: "Built and optimised frontend applications on modern frameworks, with scalable UI components focused on a seamless user experience.", tech: ["React", "Next.js"] },
  { co: "Freelance", role: "Web Developer — Contract", period: "2020", year: "2020", text: "Built websites and web applications for a range of clients, partnering with their designers to ship polished, seamless experiences.", tech: ["React", "Gatsby", "Next.js", "Bootstrap", "Tailwind CSS"] },
];

export const ABOUT = [
  { t: "Engineering", lead: "Architecture you can read in one pass.", body: "Typed boundaries, predictable state, components with one job. I write for the engineer who opens the file a year from now.", pts: ["TypeScript-first contracts", "Reusable component systems", "Maintainability over cleverness"] },
  { t: "Design", lead: "The design file is intent, not instructions.", body: "I close the gap between Figma and the browser — motion, edge cases, empty and loading states — and bring designers in early when the platform suggests a better answer.", pts: ["Fidelity to the detail", "The states designs forget", "Motion with a purpose"] },
  { t: "Product", lead: "Start from what the user is trying to finish.", body: "I ask why before how, cut scope that doesn’t serve the outcome, and agree API contracts with backend engineers before an endpoint ships.", pts: ["Contracts before code", "Scope to the outcome", "Ship, learn, iterate"] },
  { t: "Performance", lead: "Fast is a feature.", body: "Less JavaScript, compositor-only animation, lazy everything below the fold. Measure first — then fix what is actually slow.", pts: ["Core Web Vitals", "GPU-friendly motion", "Code splitting by route"] },
];

export type Tool = { k: string; label: string; x: number; y: number; big?: boolean; desc: string; used: string };

export const TOOLS: Tool[] = [
  { k: "react", label: "React", x: 48, y: 40, big: true, desc: "Primary frontend framework — the default for product UI.", used: "Summitech · Borderpal · Midst · Freelance" },
  { k: "next", label: "Next.js", x: 66, y: 26, big: true, desc: "Routing, rendering and the production shell for most of my React work.", used: "Summitech · Borderpal · Midst · Breeg · Alvin" },
  { k: "ts", label: "TypeScript", x: 30, y: 22, big: true, desc: "Used for scalable application architecture — types are the contract between teams.", used: "Current focus" },
  { k: "js", label: "JavaScript", x: 14, y: 40, desc: "The foundation everything else compiles down to.", used: "MyReads · everywhere" },
  { k: "tw", label: "Tailwind CSS", x: 84, y: 44, desc: "Utility-first styling for fast, consistent UI systems.", used: "Summitech · Borderpal · Freelance · Alvin" },
  { k: "vue", label: "Vue", x: 20, y: 66, desc: "A second framework — reactive UI with a different mental model.", used: "Image Gallery" },
  { k: "nuxt", label: "Nuxt.js", x: 34, y: 82, desc: "Vue’s application framework.", used: "Summitech" },
  { k: "redux", label: "Redux", x: 40, y: 58, desc: "Client state for complex, shared flows.", used: "" },
  { k: "tq", label: "TanStack Query", x: 62, y: 62, desc: "Server state — caching, retries and background refetching.", used: "" },
  { k: "node", label: "Node.js", x: 82, y: 72, desc: "Tooling, scripts and the occasional API.", used: "" },
  { k: "convex", label: "Convex", x: 86, y: 16, desc: "Reactive backend for full-stack builds.", used: "Breeg" },
  { k: "gatsby", label: "Gatsby", x: 58, y: 84, desc: "Static sites for client work.", used: "Freelance" },
  { k: "git", label: "Git", x: 12, y: 14, desc: "Version control — and the review culture around it.", used: "Every project" },
];

export const EDGES: [string, string][] = [
  ["react", "next"], ["react", "ts"], ["react", "redux"], ["react", "tq"], ["react", "gatsby"],
  ["next", "tw"], ["next", "convex"], ["next", "node"], ["ts", "js"], ["ts", "convex"],
  ["js", "vue"], ["vue", "nuxt"], ["git", "js"], ["js", "react"], ["tq", "next"],
];

export const SOCIAL = [
  { label: "GitHub", handle: "@Muhammadcod", href: "https://github.com/Muhammadcod" },
  { label: "LinkedIn", handle: "adebayo-mohammed", href: "https://linkedin.com/in/adebayo-mohammed" },
  { label: "X", handle: "@muhbiy", href: "https://twitter.com/muhbiy" },
  { label: "TikTok", handle: "@muhbiy", href: "https://tiktok.com/@muhbiy" },
];

export const SECTIONS: [string, string, string][] = [
  ["work", "Work", "01"], ["about", "About", "02"], ["experience", "Experience", "03"],
  ["lab", "Lab", "05"], ["writing", "Writing", "06"], ["contact", "Contact", "07"],
];

export type Article = {
  key: string;
  title: string;
  meta: string;
  date?: string;
  readTime?: string;
  author?: string;
  href?: string;
  content?: PortableTextBlock[];
};

export const FEATURED_COUNT = 5;

export const STEPS = ["Measure", "Prototype", "Build", "Polish", "Ship"];
export const EMAIL = "adebayomuhammad47@gmail.com";
