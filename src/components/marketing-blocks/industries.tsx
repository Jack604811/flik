import {
    Frame,
    Gauge,
    Download,
    Globe,
    Sparkles,
    LayoutDashboard,
    Palette,
    CodeXml,
    Hotel,
    Utensils,
    Scissors,
    Stethoscope,
    BookOpen,
    Syringe,
    HandHeart,
  } from "lucide-react";
import { AnimationContainer } from "../animations/animation-container";
import { Badge } from "../ui/badge";
  
  export function Industries() {
    return (
      <section className="container flex flex-col items-center gap-2 py-24">
        <div className="flex flex-col justify-center gap-2">
          <AnimationContainer delay={0.1} duration={1.2}>
            <div className="flex justify-center">
            <Badge variant={"outline"} className="text-muted-foreground">Industries</Badge>
            </div>
          </AnimationContainer>
          <h2 className="text-4xl font-medium tracking-tight text-black dark:text-white sm:text-5xl text-center">
            The fastest and easiest way to improve your business operations
          </h2>
        </div>
        <p className="text-lg text-muted-foreground text-balance max-w-xl text-center">
          Reweb brings the best of two worlds together: the speed of development of no-code tools, and
          the flexibility of code.
        </p>
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="group/feature relative flex flex-col py-10 lg:border-r lg:border-l lg:border-b">
            <div className="pointer-events-none absolute inset-0 size-full from-primary/20 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 bg-gradient-to-t" />
            <div className="relative z-10 mb-4 px-10">
              <Hotel size={24} className="text-primary" />
            </div>
            <div className="relative z-10 mb-2 px-10 text-lg font-bold">
              <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-r-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-primary" />
              <span className="inline-block">Hotels</span>
            </div>
            <p className="relative z-10 max-w-xs px-10 text-sm text-muted-foreground">
              Edit HTML, Tailwind & React components visually.
            </p>
          </div>
          <div className="group/feature relative flex flex-col py-10 lg:border-r lg:border-b">
            <div className="pointer-events-none absolute inset-0 size-full from-primary/20 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 bg-gradient-to-t" />
            <div className="relative z-10 mb-4 px-10">
              <Utensils size={24} className="text-primary" />
            </div>
            <div className="relative z-10 mb-2 px-10 text-lg font-bold">
              <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-r-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-primary" />
              <span className="inline-block">Restaurants</span>
            </div>
            <p className="relative z-10 max-w-xs px-10 text-sm text-muted-foreground">
              No new mental models to learn. It feels like magic.
            </p>
          </div>
          <div className="group/feature relative flex flex-col py-10 lg:border-r lg:border-b">
            <div className="pointer-events-none absolute inset-0 size-full from-primary/20 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 bg-gradient-to-t" />
            <div className="relative z-10 mb-4 px-10">
              <Scissors size={24} className="text-primary" />
            </div>
            <div className="relative z-10 mb-2 px-10 text-lg font-bold">
              <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-r-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-primary" />
              <span className="inline-block">Barbershops</span>
            </div>
            <p className="relative z-10 max-w-xs px-10 text-sm text-muted-foreground">
              Export your website to a Next.js & Tailwind app.
            </p>
          </div>
          <div className="group/feature relative flex flex-col py-10 lg:border-r lg:border-b">
            <div className="pointer-events-none absolute inset-0 size-full from-primary/20 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 bg-gradient-to-t" />
            <div className="relative z-10 mb-4 px-10">
              <HandHeart size={24} className="text-primary" />
            </div>
            <div className="relative z-10 mb-2 px-10 text-lg font-bold">
              <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-r-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-primary" />
              <span className="inline-block">Spa</span>
            </div>
            <p className="relative z-10 max-w-xs px-10 text-sm text-muted-foreground">
              Customize without limitations and host anywhere.
            </p>
          </div>
          <div className="group/feature relative flex flex-col py-10 lg:border-r lg:border-l">
            <div className="pointer-events-none absolute inset-0 size-full from-primary/20 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 bg-gradient-to-b" />
            <div className="relative z-10 mb-4 px-10">
              <Syringe size={24} className="text-primary" />
            </div>
            <div className="relative z-10 mb-2 px-10 text-lg font-bold">
              <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-r-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-primary" />
              <span className="inline-block">Tatto Studio</span>
            </div>
            <p className="relative z-10 max-w-xs px-10 text-sm text-muted-foreground">
              Works with Next.js, Tailwind and Shadcn UI.
            </p>
          </div>
          <div className="group/feature relative flex flex-col py-10 lg:border-r">
            <div className="pointer-events-none absolute inset-0 size-full from-primary/20 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 bg-gradient-to-b" />
            <div className="relative z-10 mb-4 px-10">
              <BookOpen size={24} className="text-primary" />
            </div>
            <div className="relative z-10 mb-2 px-10 text-lg font-bold">
              <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-r-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-primary" />
              <span className="inline-block">Coaching</span>
            </div>
            <p className="relative z-10 max-w-xs px-10 text-sm text-muted-foreground">
              Get started quickly with ready templates and sections.
            </p>
          </div>
          <div className="group/feature relative flex flex-col py-10 lg:border-r">
            <div className="pointer-events-none absolute inset-0 size-full from-primary/20 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 bg-gradient-to-b" />
            <div className="relative z-10 mb-4 px-10">
              <Stethoscope size={24} className="text-primary" />
            </div>
            <div className="relative z-10 mb-2 px-10 text-lg font-bold">
              <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-r-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-primary" />
              <span className="inline-block">Medical</span>
            </div>
            <p className="relative z-10 max-w-xs px-10 text-sm text-muted-foreground">
              Generate beautiful themes and color palettes with AI.
            </p>
          </div>
          <div className="group/feature relative flex flex-col py-10 lg:border-r">
            <div className="pointer-events-none absolute inset-0 size-full from-primary/20 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 bg-gradient-to-b" />
            <div className="relative z-10 mb-4 px-10">
              <CodeXml size={24} className="text-primary" />
            </div>
            <div className="relative z-10 mb-2 px-10 text-lg font-bold">
              <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-r-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-primary" />
              <span className="inline-block">And more</span>
            </div>
            <p className="relative z-10 max-w-xs px-10 text-sm text-muted-foreground">
              Reweb is built by developers for developers.
            </p>
          </div>
        </div>
      </section>
    );
  }
  