import {Briefcase, Download, GraduationCap} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "~/components/ui/card";

const experiences = [
  {
    id: 1,
    title: "Lead Frontend Developer",
    company: "Summitech",
    location: "Ikeja, Lagos",
    period: "2021 - Present",
    description:
      "Led the frontend development team in building responsive web applications. Implemented modern UI/UX designs and optimized performance for better user experience.",
    type: "work",
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "Borderpal.",
    location: "Ikeja, Lagos",
    period: "2024 - 2025",
    description:
      "Developed and maintained web app using React, Nextjs and TypeScript. Collaborated with designers to implement pixel-perfect interfaces and improve application performance.",
    type: "work",
  },
  {
    id: 3,
    title: "Freelance Frontend Developer",
    company: "Freelance",
    location: "Ibadan",
    period: "2018 - 2021",
    description: `Designed and built responsive websites and web applications, specializing in front-end development, 
    user experience, and custom solutions for clients across different industries.`,
    type: "work",
  },
  {
    id: 4,
    title: "Master of Chemical & Polymer Engineering",
    company: "Lagos State University",
    location: "Epe, Lagos",
    period: "2018- 2020",
    description: `Focused on advanced chemical engineering principles and polymer science, including polymer synthesis, 
    materials processing, and industrial applications. Developed strong technical, research, and problem-solving skills 
    for innovation in engineering and materials industries.`,
    type: "education",
  },
  {
    id: 6,
    title: "Bachelor of Science in Chemistry",
    company: "University of Ilorin",
    location: "Ilorin, Kwara",
    period: "2008 - 2012",
    description: `Provided a solid foundation in chemical principles, laboratory techniques, and analytical methods, 
    with applications across research, industry, and technology.`,
    type: "education",
  },
];

export const ExperienceSection = () => {
  const workExperiences = experiences.filter((exp) => exp.type === "work");
  const educationExperiences = experiences.filter(
    (exp) => exp.type === "education",
  );

  return (
    <section id="experience" className="bg-secondary/50 px-4 py-16">
      <div className="container mx-auto">
        <h2
          className="relative mb-10 font-bold text-3xl after:absolute after:bottom-0 after:left-0 after:h-1 after:w-12 after:rounded after:bg-primary after:content-[''] md:text-4xl"
          data-aos="fade-up"
        >
          Experience & Education
        </h2>

        <div className="space-y-16">
          <div>
            <div className="mb-6 flex items-center gap-4" data-aos="fade-up">
              <Briefcase size={24} className="text-primary"/>
              <h3 className="font-semibold text-2xl">Work Experience</h3>
            </div>

            <div className="space-y-6">
              {workExperiences.map((exp, index) => (
                <Card
                  key={exp.id}
                  className="relative overflow-hidden border-l-4 border-l-primary shadow-sm transition-shadow hover:shadow"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="absolute top-0 left-0 h-full w-1 bg-primary"/>
                  <CardHeader>
                    <CardTitle>{exp.title}</CardTitle>
                    <CardDescription>
                      {exp.company} • {exp.location} • {exp.period}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{exp.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center gap-4" data-aos="fade-up">
              <GraduationCap size={24} className="text-primary"/>
              <h3 className="font-semibold text-2xl">Education</h3>
            </div>

            <div className="space-y-6">
              {educationExperiences.map((exp, index) => (
                <Card
                  key={exp.id}
                  className="relative overflow-hidden border-l-4 border-l-primary shadow-sm transition-shadow hover:shadow"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="absolute top-0 left-0 h-full w-1 bg-primary"/>
                  <CardHeader>
                    <CardTitle>{exp.title}</CardTitle>
                    <CardDescription>
                      {exp.company} • {exp.location} • {exp.period}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{exp.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center" data-aos="fade-up">
          <a
            href="/"
            className="inline-flex items-center text-primary transition-colors hover:text-primary/80"
            download="muhbi-resume.pdf"
          >
            <span className="mr-2">Download Full Resume</span>
            <Download/>
          </a>
        </div>
      </div>
    </section>
  );
};
