import Image from "next/image";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion"; // Import motion

// Animation variant for the fade-up effect with custom delay
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2, // Delay based on the index
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  description,
  background,
  className,
  index,
}: {
  name: string;
  description: string;
  background?: ReactNode;
  className?: string;
  index: number; 
}) => (

  <motion.div
    className={cn(
      "group relative flex flex-col justify-between overflow-hidden rounded-2xl p-[1px] dark:bg-gradient-to-b from-neutral-800 via-neutral-500 to-neutral-800", 
      className,
    )}
    custom={index} 
    initial="hidden"
    whileInView="visible" 
    viewport={{ once: false, amount: 0.3 }} 
    variants={cardVariants} 
  >
    {/* Inner content with solid background */}
    <div className="relative h-full rounded-2xl bg-background p-6 flex flex-col justify-end border-2 dark:border-none">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent"></div>

      {/* Subtle inner glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-20 blur-xl"></div>

      {/* Optional background content */}
      <div className="absolute inset-0 z-0">{background}</div>

      {/* Title and Subtitle at the bottom */}
      <div className="relative z-10 mt-auto text-left">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">{name}</h3>
        <p className="text-sm text-gray-400 mb-2">{description}</p>
      </div>
    </div>
  </motion.div>
);

export { BentoCard, BentoGrid };
