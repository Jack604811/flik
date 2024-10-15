import { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
        "grid w-full auto-rows-[22rem] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3",
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
}: {
  name: string;
  description: string;
  background?: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "group relative flex flex-col justify-between overflow-hidden rounded-xl border",
      // light styles
      "bg-white shadow-lg", // Optional light background and shadow
      // dark styles
      "transform-gpu dark:bg-background/10 dark:[border:1px_solid_rgba(255,255,255,.1)]",
      className,
    )}
  >
    {/* Optional background content */}
    <div>{background}</div>

    {/* Title and Subtitle */}
    <div className="p-6 mt-auto">
      <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
        {name}
      </h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {description}
      </p>
    </div>

    <div
      className={cn(
        "absolute bottom-0 flex w-full transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      {/* Add optional call to action or link here */}
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:dark:bg-neutral-800/10" />
  </div>
);

export { BentoCard, BentoGrid };
