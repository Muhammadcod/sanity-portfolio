"use client";
import {ExternalLink, Github} from "lucide-react";
import {useState, useEffect} from "react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import { SanityProject, getFeaturedProjects } from "@/lib/sanity";

interface ProjectsSectionProps {
  initialProjects?: SanityProject[];
  showAll?: boolean;
}

export const ProjectsSection = ({ initialProjects, showAll = false }: ProjectsSectionProps) => {
  const [projects, setProjects] = useState<SanityProject[]>(initialProjects || []);
  const [visibleProjects, setVisibleProjects] = useState(3);
  const [loading, setLoading] = useState(!initialProjects);

  useEffect(() => {
    if (!initialProjects) {
      const fetchProjects = async () => {
        try {
          setLoading(true);
          const fetchedProjects = await getFeaturedProjects();
          setProjects(fetchedProjects);
        } catch (error) {
          console.error('Error fetching projects:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchProjects();
    }
  }, [initialProjects]);

  const handleShowMore = () => {
    setVisibleProjects(projects.length);
  };

  const handleShowLess = () => {
    setVisibleProjects(3);
    // Scroll back to the projects section
    document.getElementById("projects")?.scrollIntoView({behavior: "smooth"});
  };

  if (loading) {
    return (
      <section id="projects" className="px-4 py-16">
        <div className="container mx-auto">
          <h2 className="relative mb-4 mb-6 font-bold text-3xl after:absolute after:bottom-0 after:left-0 after:h-1 after:w-12 after:rounded after:bg-primary after:content-[''] md:text-4xl">
            Projects
          </h2>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

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
          {projects.slice(0, visibleProjects).map((project: SanityProject, index: number) => (
            <Card
              key={project._id}
              className="glass-card flex h-full flex-col overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative h-48 overflow-hidden">
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.imageAlt || project.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                )}
              </div>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.technologies.map((tech: string, i: number) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <Badge key={i} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {project.githubUrl && (
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
                )}
                {project.liveUrl && (
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
                )}
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
