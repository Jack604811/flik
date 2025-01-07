"use client";
import { cn } from "@/lib/utils";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import Image from "next/image";
import { motion } from "framer-motion"; 
import { AnimationContainer } from "../animations/animation-container";
import { Badge } from "../ui/badge";


const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.4, 
      duration: 0.8,
      ease: "easeOut",
    },
  }),
};

const features = [
  {
    name: "Advanced AI Chat Assistant",
    description:
      "Set up your booking durations and time slots with complete flexibility.",
    className: "col-span-3 lg:col-span-1",
    href: "#",
    cta: "Learn more 👉",
    background: (
      <div className="relative h-full w-full transition-all duration-300 ease-out group-hover:scale-105">
        <Image
          src="/assets/marketing/AI.svg"
          alt="Advanced AI"
          fill
          priority={true}
          className="object-cover"
        />
      </div>
    ),
  },
  {
    name: "24/7 Online Bookings",
    description:
      "Automatically generate a professional, SEO-friendly website based on your spaces.",
    href: "#",
    cta: "Learn more 👉",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute right-2 top-10 h-[300px] w-full max-w-[600px] mx-4 transition-all duration-300 ease-out group-hover:scale-105">
        <Image
          src="/assets/marketing/Bookings.svg"
          alt="24/7 Online Bookings"
          fill
          priority={true}
          className="object-cover"
        />
      </div>
    ),
  },
  {
    name: "Insightful Analytics",
    description:
      "Connect with leading payment platforms or manually track transactions for cash, bank transfers, and more.",
    href: "#",
    cta: "Learn more 👉",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute right-2 top-10 h-[300px] w-full max-w-[600px] mx-4 transition-all duration-300 ease-out group-hover:scale-105">
        <Image
          src="/assets/marketing/Bookings.svg"
          alt="Placeholder for Insightful Analytics"
          fill
          priority={true}
          className="object-cover"
        />
      </div>
    ),
  },
  {
    name: "Integrated Payment System",
    description: "Detailed analytics to track your bookings, transactions, and revenue.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="relative h-full w-full transition-all duration-300 ease-out group-hover:scale-105">
        <Image
          src="/assets/marketing/Bookings.svg"
          alt="Integrated Payment System"
          fill
          priority={true}
          className="object-cover"
        />
      </div>
    ),
  },
];

export function Features() {
  return (
    <section id="features" className="relative">
      <div className="py-24 gap-2">
        <div className="flex flex-col justify-center items-center container max-w-5xl mx-auto px-4 md:px-8 gap-2">
      
          <AnimationContainer delay={0.1} duration={1.2}>
            <div className="flex justify-center">
             <Badge variant={"outline"} className="text-muted-foreground">Features</Badge>
            </div>
          </AnimationContainer>

          <AnimationContainer delay={0.2} duration={1.4}>
            <h2
              className="text-4xl max-w-xl font-medium tracking-tight text-black dark:text-white sm:text-5xl text-center" >
              Flik is All You Need to Run Your Business Efficiently
            </h2>
          </AnimationContainer>

          <AnimationContainer delay={0.4} duration={1.6}>
            <p className="text-lg text-muted-foreground text-balance text-center">
              Manage your day-to-day operations, freeing up time to focus on growth.
            </p>
          </AnimationContainer>
          <AnimationContainer delay={0.6} duration={1.8}>
          <div className="container mx-auto my-12 max-w-[1200px] space-y-12">
            <BentoGrid>
              {features.map((feature, idx) => (
                <BentoCard key={idx} {...feature} index={idx} />
              ))}
            </BentoGrid>
          <div>
          
        </div>
        
      </div>
      </AnimationContainer>
      </div>
      </div>
    </section>
  );
}
