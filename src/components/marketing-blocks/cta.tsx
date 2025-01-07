import Link from "next/link";
import Image from "next/image"; 
import { AnimationContainer } from "../animations/animation-container";
import DashboardButton from "./dashboard-button";

export function CTA() {
  return (
    <section className="container relative pb-24">
      <AnimationContainer delay={0.1} duration={1.2}>

        <div className="flex flex-col items-center gap-4 rounded-xl bg-primary/80 dark:bg-background border px-6 py-24 sm:gap-2 relative z-10"> 
          <div className="absolute inset-0 -z-10 h-full w-full">
            <Image
              src="/assets/marketing/Bookings.svg" 
              alt="Background Image"
              fill
              priority={true}
              className="object-cover"
            />
          </div>

          {/* Overlay Layer */}
          <div className="absolute inset-0 bg-black/60 -z-[9] rounded-xl"></div> 
          
          <AnimationContainer delay={0.2} duration={1.2}>
            <h2 className="text-4xl max-w-xl font-medium tracking-tight text-black dark:text-white sm:text-5xl text-center">
              Ready to take your business to the next level?
            </h2>
          </AnimationContainer>

          <AnimationContainer delay={0.4} duration={1.2}>
            <p className="text-lg text-muted-foreground text-balance text-center max-w-xl mb-4">
              Build at the speed of no-code. Export to Next.js and Tailwind code. Customize without limits.
            </p>
          </AnimationContainer>

          <AnimationContainer delay={0.6} duration={1.2}>
            <DashboardButton />
          </AnimationContainer>
        </div>
      </AnimationContainer>
    </section>
  );
}
