'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';

// Sample projects data - in a real app, this would come from a CMS or API
const projectsData = [
  {
    id: 1,
    slug: 'e-commerce-platform',
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce solution built with Next.js, featuring user authentication, payment processing, and admin dashboard.',
    image: '/api/placeholder/400/250',
    technologies: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL', 'Tailwind CSS'],
    category: 'Full Stack',
    status: 'Completed',
    year: '2024',
    githubUrl: 'https://github.com/example/ecommerce',
    liveUrl: 'https://ecommerce-demo.vercel.app'
  },
  {
    id: 2,
    slug: 'task-management-app',
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
    image: '/api/placeholder/400/250',
    technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express'],
    category: 'Web App',
    status: 'Completed',
    year: '2024',
    githubUrl: 'https://github.com/example/taskmanager',
    liveUrl: 'https://taskmanager-demo.vercel.app'
  },
  {
    id: 3,
    slug: 'portfolio-website',
    title: 'Portfolio Website',
    description: 'A modern, responsive portfolio website showcasing projects and skills with smooth animations and optimized performance.',
    image: '/api/placeholder/400/250',
    technologies: ['Next.js', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
    category: 'Frontend',
    status: 'Completed',
    year: '2024',
    githubUrl: 'https://github.com/example/portfolio',
    liveUrl: 'https://portfolio-demo.vercel.app'
  },
  {
    id: 4,
    slug: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    description: 'A comprehensive analytics dashboard with interactive charts, real-time data visualization, and customizable widgets.',
    image: '/api/placeholder/400/250',
    technologies: ['React', 'D3.js', 'Python', 'FastAPI', 'PostgreSQL'],
    category: 'Data Visualization',
    status: 'Completed',
    year: '2023',
    githubUrl: 'https://github.com/example/analytics',
    liveUrl: 'https://analytics-demo.vercel.app'
  },
  {
    id: 5,
    slug: 'mobile-fitness-app',
    title: 'Mobile Fitness App',
    description: 'A React Native fitness tracking app with workout plans, progress tracking, and social features for fitness enthusiasts.',
    image: '/api/placeholder/400/250',
    technologies: ['React Native', 'TypeScript', 'Firebase', 'Redux'],
    category: 'Mobile',
    status: 'In Progress',
    year: '2024',
    githubUrl: 'https://github.com/example/fitness-app',
    liveUrl: null
  },
  {
    id: 6,
    slug: 'ai-content-generator',
    title: 'AI Content Generator',
    description: 'An AI-powered content generation tool that helps create blog posts, social media content, and marketing copy using GPT models.',
    image: '/api/placeholder/400/250',
    technologies: ['Next.js', 'OpenAI API', 'Prisma', 'PostgreSQL', 'Stripe'],
    category: 'AI/ML',
    status: 'Completed',
    year: '2024',
    githubUrl: 'https://github.com/example/ai-content',
    liveUrl: 'https://ai-content-demo.vercel.app'
  }
];

const categories = ['All', 'Full Stack', 'Frontend', 'Web App', 'Mobile', 'Data Visualization', 'AI/ML'];
const statuses = ['All', 'Completed', 'In Progress'];

export default function ProjectsPage() {
  const [filteredProjects, setFilteredProjects] = useState(projectsData);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let filtered = projectsData;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Filter by status
    if (selectedStatus !== 'All') {
      filtered = filtered.filter(project => project.status === selectedStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProjects(filtered);
  }, [selectedCategory, selectedStatus, searchTerm]);

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
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-16">
            <h1 className="font-light text-3xl sm:text-4xl mb-4">
              All Projects
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              A collection of projects I've worked on, showcasing different technologies and problem-solving approaches.
            </p>
          </div>

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
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
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
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
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
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group block rounded-lg border border-border p-6 transition-all duration-500 hover:border-muted-foreground/50 hover:shadow-lg sm:p-8"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between font-mono text-muted-foreground text-xs">
                    <span>{project.year}</span>
                    <span className="rounded-full bg-muted px-2 py-1 text-xs">
                      {project.status}
                    </span>
                  </div>

                  <h3 className="font-medium text-lg transition-colors group-hover:text-muted-foreground sm:text-xl">
                    {project.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
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
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                    
                    <div className="flex gap-2">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        title="View on GitHub"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="w-4 h-4" />
                      </a>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          title="View Live Demo"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* No Results */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">No projects found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedStatus('All');
                  setSearchTerm('');
                }}
                className="text-foreground hover:text-muted-foreground transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}