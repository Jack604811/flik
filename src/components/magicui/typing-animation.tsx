"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypingAnimationProps {
  text: string;
  duration?: number;
  loop?: boolean;
  delayAfterEnd?: number; // New prop for delay after typing ends
  className?: string;
}

export default function TypingAnimation({
  text,
  duration = 200,
  loop = false, // Default to false
  delayAfterEnd = 1000, // Default delay after typing ends
  className,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [i, setI] = useState<number>(0);

  useEffect(() => {
    const typingEffect = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        setI(i + 1);
      } else if (loop) {
        clearInterval(typingEffect); // Clear the interval when the text finishes typing
        setTimeout(() => {
          setI(0);
          setDisplayedText("");
        }, delayAfterEnd); // Delay before restarting
      } else {
        clearInterval(typingEffect); // Stop the animation
      }
    }, duration);

    return () => {
      clearInterval(typingEffect);
    };
  }, [i, text, duration, loop, delayAfterEnd]);

  return (
    <h1
      className={cn(
        "font-display text-center text-4xl font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm",
        className,
      )}
    >
      {displayedText}
    </h1>
  );
}
