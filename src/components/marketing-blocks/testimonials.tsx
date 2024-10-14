"use client";

import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";
import { StarFilledIcon } from "@radix-ui/react-icons";
import Image from "next/image";

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "bg-cyan-600/20 p-1 py-0.5 font-bold text-cyan-600 dark:bg-cyan-600/20 dark:text-cyan-600",
        className,
      )}
    >
      {children}
    </span>
  );
};

export interface TestimonialCardProps {
  name: string;
  role: string;
  img?: string;
  description: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const TestimonialCard = ({
  description,
  name,
  img,
  role,
  className,
  ...props
}: TestimonialCardProps) => (
  <div
    className={cn(
      "mb-4 flex w-[384px] cursor-pointer break-inside-avoid flex-col items-center justify-between gap-6 rounded-xl p-4",
      "border border-neutral-200", // light styles
      "dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]", // dark styles
      className,
    )}
    {...props}
  >
    <div className="select-none text-sm font-normal text-neutral-700 dark:text-neutral-400">
      {description}
      <div className="flex flex-row py-1">
        <StarFilledIcon className="size-4 text-yellow-500" />
        <StarFilledIcon className="size-4 text-yellow-500" />
        <StarFilledIcon className="size-4 text-yellow-500" />
        <StarFilledIcon className="size-4 text-yellow-500" />
        <StarFilledIcon className="size-4 text-yellow-500" />
      </div>
    </div>

    <div className="flex w-full select-none items-center justify-start gap-5">
      {img && (
        <Image
          src={img}
          alt={`${name}'s profile picture`}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full ring-1 ring-border ring-offset-4"
        />
      )}

      <div>
        <p className="font-medium text-neutral-500">{name}</p>
        <p className="text-xs font-normal text-neutral-400">{role}</p>
      </div>
    </div>
  </div>
);

const testimonials = [
  {
    name: "Alex Rivera",
    role: "CTO at InnovateTech",
    img: "https://randomuser.me/api/portraits/men/91.jpg",
    description: (
      <p>
        The AI-driven analytics from #QuantumInsights have revolutionized our
        product development cycle.
        <Highlight>
          Insights are now more accurate and faster than ever.
        </Highlight>{" "}
        A game-changer for tech companies.
      </p>
    ),
  },
  {
    name: "Samantha Lee",
    role: "Marketing Director at NextGen Solutions",
    img: "https://randomuser.me/api/portraits/women/12.jpg",
    description: (
      <p>
        Implementing #AIStream&apos;s customer prediction model has drastically
        improved our targeting strategy.
        <Highlight>Seeing a 50% increase in conversion rates!</Highlight> Highly
        recommend their solutions.
      </p>
    ),
  },
  {
    name: "Raj Patel",
    role: "Founder & CEO at StartUp Grid",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    description: (
      <p>
        As a startup, we need to move fast and stay ahead. #CodeAI&apos;s automated
        coding assistant helps us do just that.
        <Highlight>Our development speed has doubled.</Highlight> Essential tool
        for any startup.
      </p>
    ),
  },
  // Additional testimonials...
];

export function SocialProofTestimonials() {
  return (
    <section id="testimonials">
      <div className="py-14">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto text-center">
            <h5 className="text-xl font-bold tracking-tight text-gray-500">
              What our clients are saying
            </h5>
            <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-6xl">
              Testimonials
            </h2>
            <p className="text-balance text-lg tracking-tight text-gray-400 md:text-xl py-4">
              See how our platform has helped businesses like yours manage
              spaces effortlessly, attract more traffic, and maximize their
              bookings.
            </p>
          </div>
          <div className="relative mt-6 max-h-[650px] overflow-hidden">
            <div className="gap-4">
              {Array(Math.ceil(testimonials.length / 3))
                .fill(0)
                .map((_, i) => (
                  <Marquee
                    key={i}
                    reverse={i % 2 === 0} // For a reverse effect on alternate rows
                    className={cn({
                      "[--duration:60s]": i === 1,
                      "[--duration:30s]": i === 2,
                      "[--duration:70s]": i === 3,
                    })}
                  >
                    {testimonials.slice(i * 3, (i + 1) * 3).map((card, idx) => (
                      <TestimonialCard {...card} key={idx} />
                    ))}
                  </Marquee>
                ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 h-full w-1/3 bg-gradient-to-r from-[hsl(var(--background))] to-transparent dark:from-[hsl(var(--background))]"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/3 bg-gradient-to-l from-[hsl(var(--background))] to-transparent dark:from-[hsl(var(--background))]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

