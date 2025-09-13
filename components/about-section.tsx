import {Code, Sparkles} from "lucide-react";

export const AboutSection = () => {
  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Tanstack Query",
    "React Hooks Form",
    "AI",
    "Git",
    "RESTful APIs",
  ];

  const services = [
    {
      icon: <Code className="h-10 w-10 text-primary"/>,
      title: "Frontend Development",
      description:
        "Building responsive, accessible and performant user interfaces with modern frameworks.",
    },
    {
      icon: <Sparkles className="h-10 w-10 text-primary"/>,
      title: "Performance Optimization",
      description:
        "Improving application speed, responsiveness, and overall user experience.",
    },
  ];

  return (
    <section id="about" className="bg-secondary/50 px-4 py-16">
      <div className="container mx-auto">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2
              className="relative mb-4 font-bold text-3xl after:absolute after:bottom-0 after:left-0 after:h-1 after:w-12 after:rounded after:bg-primary after:content-[''] md:text-4xl"
              data-aos="fade-up"
            >
              About Me
            </h2>
            <p className="mb-4 text-lg" data-aos="fade-up" data-aos-delay="100">
              I&#39;m a passionate software engineer with a focus on creating
              elegant, efficient, and user-friendly applications. With a
              background in frontend development, I bridge the gap between
              aesthetics and functionality.
            </p>
            <p className="mb-6 text-lg" data-aos="fade-up" data-aos-delay="200">
              My work combines precise engineering with thoughtful design
              principles, ensuring that the products I build are not only
              visually polished but also intuitive, fast, and usable by
              everyone. Whether it’s crafting scalable component systems,
              fine-tuning performance, or championing best practices, I focus on
              delivering frontend solutions that set a high standard for quality
              and accessibility.
            </p>

            <div className="mb-8" data-aos="fade-up" data-aos-delay="300">
              <h3 className="mb-3 font-semibold text-xl">
                Skills & Technologies
              </h3>
              <div className="flex flex-wrap">
                {skills.map((skill, index) => (
                  <span
                    key={skill}
                    className="mr-2 mb-2 inline-block rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground text-sm"
                    style={{animationDelay: `${0.1 * index}s`}}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className="relative z-10 overflow-hidden rounded-lg shadow-lg"
              data-aos="fade-left"
            >
              <img
                src="https://images.unsplash.com/photo-1649972954912-d0cd0c673cf1"
                alt="Muhbi"
                className="h-auto w-full rounded-lg object-cover"
              />
            </div>
            <div
              className="-right-4 -z-10 absolute top-4 h-full w-full rounded-lg border-4 border-primary"
              data-aos="fade-up"
              data-aos-delay="200"
            />
          </div>
        </div>

        <div className="mt-16">
          <h3
            className="mb-10 text-center font-semibold text-2xl"
            data-aos="fade-up"
          >
            What I Do
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="glass-card flex flex-col items-center p-6 text-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  {service.icon}
                </div>
                <h4 className="mb-2 font-semibold text-xl">{service.title}</h4>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
