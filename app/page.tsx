import { Portfolio } from "@/components/portfolio/portfolio"
import { sortByYear, toArticle, toProject } from "@/components/portfolio/data"
import { getAllProjects, getHomeArticles } from "@/lib/sanity"

export const revalidate = 1800

export default async function Home() {
  const [projects, articles] = await Promise.all([getAllProjects(), getHomeArticles()])

  return <Portfolio projects={sortByYear(projects.map(toProject))} articles={articles.map(toArticle)} />
}
