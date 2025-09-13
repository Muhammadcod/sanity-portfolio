"use client";
import {ExternalLink, Github} from "lucide-react";
import {useState} from "react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description:
      "A modern e-commerce application with product listings, shopping cart, and payment integration.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/muhbi/ecommerce",
  },
  {
    id: 2,
    title: "Task Management App",
    description:
      "A productivity application for managing tasks, projects, and deadlines with team collaboration features.",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12",
    technologies: ["React", "Firebase", "Tailwind CSS", "Redux"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/muhbi/taskmanager",
  },
  {
    id: 3,
    title: "Real Estate Listings",
    description:
      "A property listing website with search filters, property details, and contact forms.",
    image: "https://images.unsplash.com/photo-1448630360428-65456885c650",
    technologies: ["Next.js", "Prisma", "PostgreSQL", "Google Maps API"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/muhbi/realestate",
  },
  {
    id: 4,
    title: "Portfolio Website",
    description:
      "A personal portfolio website showcasing skills, projects, and professional experience.",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/muhbi/portfolio",
  },
  {
    id: 5,
    title: "Fitness Tracker",
    description:
      "A fitness tracking application for monitoring workouts, nutrition, and health metrics.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    technologies: ["React Native", "Firebase", "Redux", "Chart.js"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/muhbi/fitness",
  },
  {
    id: 6,
    title: "Recipe App",
    description:
      "A cooking recipe application with search, filtering, and bookmarking features.",
    image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352",
    technologies: ["Vue.js", "Express", "MongoDB", "Cloudinary"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/muhbi/recipes",
  },
];

export const ProjectsSection = () => {
  const [visibleProjects, setVisibleProjects] = useState(3);

  const handleShowMore = () => {
    setVisibleProjects(projects.length);
  };

  const handleShowLess = () => {
    setVisibleProjects(3);
    // Scroll back to the projects section
    document.getElementById("projects")?.scrollIntoView({behavior: "smooth"});
  };

  return (
    <section id="projects" className="px-4 py-16">
      <div className="container mx-auto">
        <h2
          className="relative mb-4 mb-6 font-bold text-3xl after:absolute after:bottom-0 after:left-0 after:h-1 after:w-12 after:rounded after:bg-primary after:content-[''] md:text-4xl"
          data-aos="fade-up"
        >
          Projects
        </h2>
        <p
          className="mb-10 max-w-3xl text-lg"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Here are some of my recent projects that showcase my skills and
          expertise. Each project represents unique challenges and solutions.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, visibleProjects).map((project, index) => (
            <Card
              key={project.id}
              className="glass-card flex h-full flex-col overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <Badge key={i} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <Github size={16}/> Code
                  </a>
                </Button>
                <Button size="sm" asChild>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <ExternalLink size={16}/> Demo
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          {visibleProjects < projects.length ? (
            <Button
              onClick={handleShowMore}
              variant="outline"
              size="lg"
              data-aos="fade-up"
            >
              Show More Projects
            </Button>
          ) : (
            <Button
              onClick={handleShowLess}
              variant="outline"
              size="lg"
              data-aos="fade-up"
            >
              Show Less
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
