import {ArrowDown, ArrowRight} from "lucide-react";
import {AnimatedBackground} from "~/components/animated-background";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-4 pt-20 pb-10"
    >
      <AnimatedBackground/>
      <div className="container mx-auto">
        <div className="max-w-3xl animate-fade-up">
          <h1 className="mb-6 font-semibold text-4xl leading-tight md:text-5xl lg:text-6xl">
            Software Engineer, Developer Experience
          </h1>
          <p className="mb-8 text-foreground/80 text-xl leading-relaxed md:text-2xl">
            I'm Mohammed Adebayo, a Lead Frontend Engineer at Summitech I build
            accessible, pixel-perfect digital experiences for the web — where
            every interaction feels seamless, every detail is intentional, and
            every user is included.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/#work"
              className="inline-flex items-center border-primary border-b-2 pb-1 text-foreground transition-safe hover:text-foreground/80"
            >
              See my work <ArrowRight className="ml-2 h-4 w-4"/>
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center border-primary border-b-2 pb-1 text-foreground transition-safe hover:text-foreground/80"
            >
              Contact me <ArrowRight className="ml-2 h-4 w-4"/>
            </Link>
          </div>
        </div>
      </div>

      <div className="-translate-x-1/2 absolute bottom-8 left-1/2 hidden transform animate-bounce md:block">
        <a href="#about" aria-label="Scroll to About section">
          <ArrowDown className="text-primary" size={32}/>
        </a>
      </div>

      <div className="-right-20 absolute top-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl"/>
      <div className="-left-20 absolute bottom-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl"/>
    </section>
  );
};
