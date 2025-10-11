import {client} from '@/sanity/lib/client'
import {
  featuredProjectsQuery,
  projectBySlugQuery,
  projectCategoriesQuery,
  projectsByCategoryQuery,
  projectsQuery,
  projectStatsQuery,
  articleBySlugQuery,
  recentArticlesQuery
} from '@/sanity/lib/queries'

export interface SanityProject {
  _id: string
  _createdAt: string
  _updatedAt: string
  title: string
  slug: {
    current: string
  }
  description: string
  year: string
  longDescription?: string
  image?: string
  imageAlt?: string
  category: string
  status: 'completed' | 'in-progress' | 'planned'
  featured: boolean
  orderRank?: number
  technologies: string[]
  features?: string[]
  challenges?: string[]
  solutions?: string[]
  liveUrl?: string
  githubUrl?: string
  demoUrl?: string
  tags?: string[]
  relatedProjects?: SanityProject[]
}

export interface ProjectStats {
  total: number
  completed: number
  inProgress: number
  planned: number
  featured: number
}

export interface ProjectCategory {
  category: string
}

// Types for articles
export interface SanityArticle {
  _id: string
  _createdAt: string
  _updatedAt: string
  title: string
  slug: { current: string }
  author?: string
  excerpt?: string
  coverImage?: string
  coverImageAlt?: string
  publishedAt?: string
  readTime?: string
  tags?: string[]
  externalUrl?: string
  content: any // Portable Text blocks
}

// Summary type for listing articles on the homepage
export interface SanityArticleSummary {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  publishedAt?: string
  readTime?: string
  tags?: string[]
}

// Service functions for fetching project data
export class ProjectService {
  /**
   * Fetch all projects with caching
   */
  static async getAllProjects(): Promise<SanityProject[]> {
    try {
      const projects = await client.fetch(projectsQuery, {}, {
        cache: 'force-cache',
        next: {revalidate: 3600} // Revalidate every hour
      })
      return projects || []
    } catch (error) {
      console.error('Error fetching projects:', error)
      return []
    }
  }

  /**
   * Fetch featured projects only
   */
  static async getFeaturedProjects(): Promise<SanityProject[]> {
    try {
      const projects = await client.fetch(featuredProjectsQuery, {}, {
        cache: 'force-cache',
        next: {revalidate: 3600}
      })
      return projects || []
    } catch (error) {
      console.error('Error fetching featured projects:', error)
      return []
    }
  }

  /**
   * Fetch a single project by slug
   */
  static async getProjectBySlug(slug: string): Promise<SanityProject | null> {
    try {
      const project = await client.fetch(projectBySlugQuery, {slug}, {
        cache: 'force-cache',
        next: {revalidate: 3600}
      })
      return project || null
    } catch (error) {
      console.error(`Error fetching project with slug ${slug}:`, error)
      return null
    }
  }

  /**
   * Fetch projects by category
   */
  static async getProjectsByCategory(category: string): Promise<SanityProject[]> {
    try {
      const projects = await client.fetch(projectsByCategoryQuery, {category}, {
        cache: 'force-cache',
        next: {revalidate: 3600}
      })
      return projects || []
    } catch (error) {
      console.error(`Error fetching projects for category ${category}:`, error)
      return []
    }
  }

  /**
   * Fetch all project categories
   */
  static async getProjectCategories(): Promise<string[]> {
    try {
      const categories = await client.fetch(projectCategoriesQuery, {}, {
        cache: 'force-cache',
        next: {revalidate: 7200} // Revalidate every 2 hours
      })

      // Extract unique categories
      const uniqueCategories = [...new Set(categories.map((item: ProjectCategory) => item.category))]
      return uniqueCategories.filter(Boolean) as string[]
    } catch (error) {
      console.error('Error fetching project categories:', error)
      return []
    }
  }

  /**
   * Fetch project statistics
   */
  static async getProjectStats(): Promise<ProjectStats> {
    try {
      const stats = await client.fetch(projectStatsQuery, {}, {
        cache: 'force-cache',
        next: {revalidate: 3600}
      })
      return stats || {
        total: 0,
        completed: 0,
        inProgress: 0,
        planned: 0,
        featured: 0
      }
    } catch (error) {
      console.error('Error fetching project stats:', error)
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        planned: 0,
        featured: 0
      }
    }
  }

  /**
   * Search projects by title or description
   */
  static async searchProjects(searchTerm: string): Promise<SanityProject[]> {
    try {
      const searchQuery = `
        *[_type == "project" && (
          title match $searchTerm + "*" ||
          description match $searchTerm + "*" ||
          $searchTerm in technologies[]
        )] | order(orderRank) {
          _id,
          title,
          slug,
          description,
          "image": image.asset->url,
          "imageAlt": image.alt,
          category,
          technologies[],
          liveUrl,
          githubUrl
        }
      `

      const projects = await client.fetch(searchQuery, {searchTerm}, {
        cache: 'no-store' // Don't cache search results
      })
      return projects || []
    } catch (error) {
      console.error(`Error searching projects with term "${searchTerm}":`, error)
      return []
    }
  }
}

// Service functions for fetching article data
export class ArticleService {
  /**
   * Fetch a single article by slug
   */
  static async getArticleBySlug(slug: string): Promise<SanityArticle | null> {
    try {
      const article = await client.fetch(articleBySlugQuery, {slug}, {
        cache: 'force-cache',
        next: {revalidate: 3600}
      })
      return article || null
    } catch (error) {
      console.error(`Error fetching article with slug ${slug}:`, error)
      return null
    }
  }

  /**
   * Fetch recent articles for homepage Thoughts section
   */
  static async getRecentArticles(): Promise<SanityArticleSummary[]> {
    try {
      const articles = await client.fetch(recentArticlesQuery, {}, {
        cache: 'force-cache',
        next: { revalidate: 1800 } // Revalidate every 30 minutes
      })
      return articles || []
    } catch (error) {
      console.error('Error fetching recent articles:', error)
      return []
    }
  }
}

// Export individual functions for convenience
export const {
  getAllProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectsByCategory,
  getProjectCategories,
  getProjectStats,
  searchProjects
} = ProjectService

export const { getArticleBySlug, getRecentArticles } = ArticleService