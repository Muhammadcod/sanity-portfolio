import { groq } from 'next-sanity'

// Query to fetch all projects with essential fields
export const projectsQuery = groq`
  *[_type == "project"] | order(orderRank) {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    description,
    longDescription,
    "image": image.asset->url,
    "imageAlt": image.alt,
    year,
    category,
    status,
    featured,
    orderRank,
    technologies[],
    features[],
    challenges[],
    solutions[],
    liveUrl,
    githubUrl,
    demoUrl,
    tags[]
  }
`

// Query to fetch featured projects only
export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(orderRank) {
    _id,
    title,
    slug,
    description,
    "image": image.asset->url,
    "imageAlt": image.alt,
    category,
    status,
    technologies[],
     _createdAt,
     year,
    liveUrl,
    githubUrl
  }
`

// Query to fetch a single project by slug
export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    description,
    longDescription,
    "image": image.asset->url,
    "imageAlt": image.alt,
    year,
    category,
    status,
    featured,
    orderRank,
    technologies[],
    features[],
    challenges[],
    solutions[],
    liveUrl,
    githubUrl,
    demoUrl,
    tags[],
    "gallery": gallery[].asset->url,
    "relatedProjects": *[_type == "project" && slug.current != $slug && category == ^.category][0...3] {
      _id,
      title,
      slug,
      description,
      "image": image.asset->url,
      category,
      technologies[]
    }
  }
`

// Query to fetch projects by category
export const projectsByCategoryQuery = groq`
  *[_type == "project" && category == $category] | order(orderRank) {
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

// Query to fetch project categories (for filtering)
export const projectCategoriesQuery = groq`
  *[_type == "project" && defined(category)] {
    category
  } | order(category) | {
    "category": category
  }
`

// Query to get project count by status
export const projectStatsQuery = groq`
  {
    "total": count(*[_type == "project"]),
    "completed": count(*[_type == "project" && status == "completed"]),
    "inProgress": count(*[_type == "project" && status == "in-progress"]),
    "planned": count(*[_type == "project" && status == "planned"]),
    "featured": count(*[_type == "project" && featured == true])
  }
`

// Query to fetch a single article by slug
export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    author,
    excerpt,
    "coverImage": coverImage.asset->url,
    "coverImageAlt": coverImage.alt,
    publishedAt,
    readTime,
    tags[],
    externalUrl,
    content
  }
`

// Query to fetch recent articles for the homepage Thoughts section
export const recentArticlesQuery = groq`
  *[_type == "article"] | order(publishedAt desc)[0...4] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    readTime,
    tags[]
  }
`