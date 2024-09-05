"use client";

import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/magicui/border-beam";
import { motion, useInView } from "framer-motion";
import { ArrowRightIcon, ChevronRight } from "lucide-react";
import { useRef } from "react";
import AnimatedShinyText from "../magicui/animated-shiny-text";
import { getServerSession } from "next-auth";
import ShimmerButton from "../magicui/shimmer-button";
import Particles from "../magicui/particles";
import DashboardButton from "./dashboard-button";

export function Hero() {
  const fadeInRef = useRef(null);
  const fadeInInView = useInView(fadeInRef, {
    once: true,
  });

  const fadeUpVariants = {
    initial: {
      opacity: 0,
      y: 24,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section id="hero">
      <div className="relative h-full overflow-hidden py-14">
        <Particles className="absolute inset-0"
        quantity={100}
        ease={80}
      
        refresh
        />
        <div className="container z-10 flex flex-col">
          <div className="mt-20 grid grid-cols-1">
            <div className="flex flex-col items-center gap-4 pb-0 text-center">
            <div className="z-0 flex items-center justify-center">
              <motion.div
                  animate={fadeInInView ? "animate" : "initial"}
                  variants={fadeUpVariants}
                  className="group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                  initial={false}
                  transition={{
                    duration: 0.6,
                    delay: 0.3,
                    ease: [0.21, 0.47, 0.32, 0.98],
                    type: "spring",
                  }}
                >
                  <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                    <span>✨ Introducing Flik</span>
                    <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                  </AnimatedShinyText>
                </motion.div>
              </div>
              <div className="gap-2 mb-4">
              <motion.h1
                ref={fadeInRef}
                className="text-balance bg-gradient-to-br from-black from-30% to-black/60 bg-clip-text p-2 text-5xl font-medium leading-none tracking-tighter text-transparent dark:from-white dark:to-white/40 sm:text-6xl md:text-7xl lg:text-8xl"
                animate={fadeInInView ? "animate" : "initial"}
                variants={fadeUpVariants}
                initial={false}
                transition={{
                  duration: 0.6,
                  delay: 0.1,
                  ease: [0.21, 0.47, 0.32, 0.98],
                  type: "spring",
                }}
              >
                Turn visitors <br /> Into Bookings<br />
              </motion.h1>
              <motion.p
                className="text-balance text-lg tracking-tight text-gray-400 md:text-xl"
                animate={fadeInInView ? "animate" : "initial"}
                variants={fadeUpVariants}
                initial={false}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                  ease: [0.21, 0.47, 0.32, 0.98],
                  type: "spring",
                }}
              >
                Create your website in minutes and start to get bookings easy
              </motion.p>
              </div>
              <motion.div
                animate={fadeInInView ? "animate" : "initial"}
                variants={fadeUpVariants}
                className="flex flex-col gap-4 lg:flex-row"
                initial={false}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                  ease: [0.21, 0.47, 0.32, 0.98],
                  type: "spring",
                }}
              >
               <DashboardButton/>
              </motion.div>
              <motion.div
                animate={fadeInInView ? "animate" : "initial"}
                variants={fadeUpVariants}
                className="flex flex-col gap-4 lg:flex-row"
                initial={false}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                  ease: [0.21, 0.47, 0.32, 0.98],
                  type: "spring",
                }}
              >
               <p className="text-balance text-sm tracking-tight text-gray-400 md:text-xl>Start your 14 day free trial today. No credit card required."></p>
              </motion.div>
            </div>
           
          </div>
          
          <motion.div
            animate={fadeInInView ? "animate" : "initial"}
            variants={fadeUpVariants}
            initial={false}
            transition={{
              duration: 1.4,
              delay: 0.4,
              ease: [0.21, 0.47, 0.32, 0.98],
              type: "spring",
            }}
            className="relative mt-24 h-full w-full rounded-xl after:absolute after:inset-0 after:z-10 after:[background:linear-gradient(to_top,#fff_30%,transparent)] dark:after:[background:linear-gradient(to_top,#000000_30%,transparent)]"
          >
            <div
              className={cn(
                "absolute inset-0 bottom-1/2 h-full w-full transform-gpu [filter:blur(120px)]",

                // light styles
                "[background-image:linear-gradient(to_bottom,#ffaa40,transparent_30%)]",

                // dark styles
                "dark:[background-image:linear-gradient(to_bottom,#ffffff,transparent_30%)]",
              )}
            />



            {/* <img
              src="/dashboard-light.png"
              className="relative block h-full w-full rounded-xl border dark:hidden"
            />
            <img
              src="/dashboard-dark.png"
              className="relative hidden h-full w-full rounded-xl border dark:block"
            />
            {/* <video
              autoPlay
              loop
              muted
              src="demo.mp4"
              className="h-auto w-full"
            /> */}

            {/* <BorderBeam size={150} />
            <BorderBeam size={150} delay={7} /> */} 
          </motion.div>
        </div>
      </div>
    </section>
  );
}
