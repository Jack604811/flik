"use client";

import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ArrowRightIcon } from "lucide-react";
import AnimatedShinyText from "../magicui/animated-shiny-text";
import ShimmerButton from "../magicui/shimmer-button";
import Particles from "../magicui/particles";
import DashboardButton from "./dashboard-button";
import { AnimationContainer } from "@/components/marketing-blocks/animations/animation-container";


export function Hero() {
  return (
    <section id="hero">
      <div className="relative h-full overflow-hidden py-32">
        <Particles className="absolute inset-0" quantity={100} ease={80} refresh />
        <div className="container z-10 flex flex-col items-center text-center">
          <div className="mt-20 grid grid-cols-1">
            <div className="flex flex-col items-center gap-4 pb-8">
              <AnimationContainer delay={0.3} duration={1.8}>
                <div className="z-0 flex items-center justify-center group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                  <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                    <span>✨ Introducing Flik</span>
                    <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                  </AnimatedShinyText>
                </div>
              </AnimationContainer>

              <AnimationContainer delay={0.4} duration={2.5}>
                <h1 className="max-w-7xl text-balance bg-gradient-to-br from-black from-30% to-black/60 bg-clip-text p-2 text-4xl font-semibold leading-none tracking-tighter text-transparent dark:from-white dark:to-white/40 sm:text-5xl md:text-6xl lg:text-7xl">
                  Transform Your Business with All-in-One Booking Software
                </h1>
              </AnimationContainer>

              <AnimationContainer delay={0.6} duration={2.8}>
                <p className="max-w-xl text-center text-base tracking-tight text-gray-400 sm:text-lg md:text-xl lg:text-2xl">
                  Booking, AI Chat, Website Builder, E-Commerce Tailored for Hotels, Spa, Barbershops & More
                </p>
              </AnimationContainer>

              <AnimationContainer delay={0.8} duration={2.9}>
                <div className="flex flex-row justify-center space-y-4">
                  <DashboardButton />
                </div>
              </AnimationContainer>

            </div>

            
          </div>
        </div>
      </div>
    </section>
  );
}
