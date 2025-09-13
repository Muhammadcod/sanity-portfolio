'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Sample project data - in a real app, this would come from a CMS or API
const projectsData = {
  'ecommerce-platform': {
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce solution built with modern web technologies',
    longDescription: 'This comprehensive e-commerce platform features user authentication, product management, shopping cart functionality, payment processing, and an admin dashboard. Built with a focus on performance and user experience.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
    year: '2024',
    status: 'Completed',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/example/project',
    images: ['/api/placeholder/800/400', '/api/placeholder/800/400', '/api/placeholder/800/400'],
    features: [
      'User authentication and authorization',
      'Product catalog with search and filtering',
      'Shopping cart and checkout process',
      'Payment integration with Stripe',
      'Admin dashboard for inventory management',
      'Responsive design for all devices'
    ],
    challenges: 'The main challenge was implementing a scalable architecture that could handle high traffic while maintaining fast load times. We solved this by implementing proper caching strategies and optimizing database queries.',
    learnings: 'This project taught me the importance of proper state management in large applications and how to structure code for maintainability.'
  },
  'task-management-app': {
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates',
    longDescription: 'A modern task management application that allows teams to collaborate effectively with real-time updates, drag-and-drop functionality, and comprehensive project tracking.',
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'Socket.io', 'Tailwind CSS'],
    year: '2023',
    status: 'In Progress',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/example/project',
    images: ['/api/placeholder/800/400', '/api/placeholder/800/400'],
    features: [
      'Real-time collaboration',
      'Drag and drop task management',
      'Team member assignments',
      'Progress tracking and analytics',
      'File attachments and comments',
      'Mobile-responsive interface'
    ],
    challenges: 'Implementing real-time updates across multiple users while maintaining data consistency was complex. We used Socket.io for real-time communication and implemented optimistic updates.',
    learnings: 'This project enhanced my understanding of real-time applications and the complexities of state synchronization across multiple clients.'
  },
  'portfolio-website': {
    title: 'Portfolio Website',
    description: 'A modern portfolio website showcasing projects and skills',
    longDescription: 'A responsive portfolio website built with Next.js and Tailwind CSS, featuring smooth animations, dark mode support, and optimized performance. Designed to showcase projects and technical skills effectively.',
    technologies: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'TypeScript'],
    year: '2024',
    status: 'Completed',
    liveUrl: 'https://muhbi.vercel.app',
    githubUrl: 'https://github.com/example/portfolio',
    images: ['/api/placeholder/800/400', '/api/placeholder/800/400'],
    features: [
      'Responsive design for all devices',
      'Dark/light mode toggle',
      'Smooth scroll animations',
      'Project showcase with filtering',
      'Contact form integration',
      'SEO optimized'
    ],
    challenges: 'Creating smooth animations while maintaining performance across different devices was challenging. We optimized by using CSS transforms and implementing proper loading strategies.',
    learnings: 'This project improved my understanding of modern CSS techniques and the importance of performance optimization in web applications.'
  },
  'analytics-dashboard': {
    title: 'Analytics Dashboard',
    description: 'A comprehensive analytics dashboard with real-time data visualization',
    longDescription: 'An advanced analytics dashboard that provides real-time insights through interactive charts and data visualizations. Built for scalability and performance with modern web technologies.',
    technologies: ['React', 'D3.js', 'Node.js', 'MongoDB', 'WebSocket'],
    year: '2023',
    status: 'Completed',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/example/analytics',
    images: ['/api/placeholder/800/400', '/api/placeholder/800/400', '/api/placeholder/800/400'],
    features: [
      'Real-time data visualization',
      'Interactive charts and graphs',
      'Custom dashboard layouts',
      'Data export functionality',
      'User role management',
      'Mobile-responsive design'
    ],
    challenges: 'Handling large datasets while maintaining smooth interactions required careful optimization of data processing and rendering techniques.',
    learnings: 'This project deepened my knowledge of data visualization libraries and taught me effective strategies for handling real-time data updates.'
  }
};

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [activeSection, setActiveSection] = useState(0);

  const slug = params.slug as string;
  const project = projectsData[slug as keyof typeof projectsData];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = sectionsRef.current.indexOf(entry.target as HTMLElement);
            if (index !== -1) {
              setActiveSection(index);
            }
          }
        }
      },
      { threshold: 0.3, rootMargin: '-20% 0px -20% 0px' }
    );

    for (const section of sectionsRef.current) {
      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  const sectionNames = ['overview', 'features', 'challenges', 'learnings'];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
            aria-label="Back to portfolio"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </button>
          
          <div className="flex items-center gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
                aria-label="View on GitHub"
              >
                <Github className="w-4 h-4" />
                Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
                aria-label="View live project"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Side Navigation */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
        <div className="flex flex-col gap-4">
          {sectionNames.map((section, index) => {
            const isActive = activeSection === index;
            return (
              <button
                key={section}
                type="button"
                onClick={() => {
                  const element = sectionsRef.current[index];
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="group relative flex items-center"
                aria-label={`Go to ${section} section`}
              >
                <div
                  className={`w-2 h-2 rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-foreground border-foreground scale-125'
                      : 'border-foreground/30 hover:border-foreground/60'
                  }`}
                />
                {isActive && (
                  <div className="absolute left-6 ml-2 text-sm font-medium text-foreground transition-all duration-300 capitalize whitespace-nowrap">
                    {section}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
          {/* Hero Section */}
          <section
            ref={(el) => { sectionsRef.current[0] = el; }}
            className="mb-16"
          >
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="text-sm text-foreground/60">{project.year}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'Completed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {project.title}
              </h1>
              
              <p className="text-xl text-foreground/70 mb-8 leading-relaxed">
                {project.longDescription}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-foreground/5 border border-foreground/10 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Image Gallery */}
            {project.images && project.images.length > 0 && (
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-foreground/5">
                  <img
                    src={project.images[activeImage]}
                    alt={`${project.title} screenshot ${activeImage + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {project.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {project.images.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActiveImage(index)}
                        className={`flex-shrink-0 w-20 h-12 rounded overflow-hidden border-2 transition-all ${
                          activeImage === index
                            ? 'border-foreground'
                            : 'border-transparent hover:border-foreground/30'
                        }`}
                        aria-label={`View image ${index + 1}`}
                      >
                        <img
                          src={image}
                          alt={`${project.title} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Features Section */}
          <section
            ref={(el) => { sectionsRef.current[1] = el; }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-8">Key Features</h2>
            <div className="grid gap-4">
              {project.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-foreground/5 border border-foreground/10"
                >
                  <div className="w-2 h-2 rounded-full bg-foreground mt-2 flex-shrink-0" />
                  <span className="text-foreground/80">{feature}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Challenges Section */}
          <section
            ref={(el) => { sectionsRef.current[2] = el; }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-8">Challenges & Solutions</h2>
            <div className="p-6 rounded-lg bg-foreground/5 border border-foreground/10">
              <p className="text-foreground/80 leading-relaxed">
                {project.challenges}
              </p>
            </div>
          </section>

          {/* Learnings Section */}
          <section
            ref={(el) => { sectionsRef.current[3] = el; }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-8">Key Learnings</h2>
            <div className="p-6 rounded-lg bg-foreground/5 border border-foreground/10">
              <p className="text-foreground/80 leading-relaxed">
                {project.learnings}
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}