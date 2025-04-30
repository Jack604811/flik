"use client";

import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

export default function Home() {
  return (
    <div className="m-20 space-y-16">
      {Array.from(Array(100).keys()).map((i) => (
        <AnimationContainer delay={0.25} duration={1} key={i}>
          <p className="text-2xl">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam
            nemo iure, pariatur consequuntur, ad nam eveniet praesentium
            voluptas nesciunt quas corrupti dolorem, blanditiis eaque! Illum ab
            dolores accusamus repellat? Tempora.
          </p>
        </AnimationContainer>
      ))}
    </div>
  );
}

export function AnimationContainer({
  children,
  delay = 0,
  duration = 0.5,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: {
          opacity: 0,
          y: 15,
        },
        visible: {
          opacity: 1,
          y: 0,
        },
      }}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ delay, type: "spring", duration }}
    >
      {children}
    </motion.div>
  );
}