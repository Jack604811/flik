import { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Sample data for cards
const cardData = [
  {
    title: "SSO and Domain Capture",
    subtitle: "Seamlessly manage users with SSO and domain capture",
    image: "/path/to/your/image1.png", // Replace with the correct path or component for the image/icon
  },
  {
    title: "SOC 2 Compliance",
    subtitle:
      "Our product meets SOC 2 standards for secure handling of sensitive information",
    image: "/path/to/your/image2.png",
  },
  {
    title: "Fine-Grained Permissions",
    subtitle: "Effortlessly assign and manage fine-grained permissions.",
    image: "/path/to/your/image3.png",
  },
  // Add more card objects here
];

const BentoGrid = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3",
        className,
      )}
    >
      {/* Iterate over card data to render each card */}
      {cardData.map((card, idx) => (
        <BentoCard
          key={idx}
          title={card.title}
          subtitle={card.subtitle}
          image={card.image}
        />
      ))}
    </div>
  );
};

const BentoCard = ({
  className,
  title,
  subtitle,
  image,
}: {
  className?: string;
  title: string;
  subtitle: string;
  image: string;
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
    {/* Image or Icon */}
    <div className="flex justify-center items-center p-6">
      <Image
        src={image}
        alt={title}
        width={96} // example width
        height={96} // example height
        className="h-24 w-24 object-contain"
      />
    </div>

    {/* Title and Subtitle */}
    <div className="p-6 mt-auto">
      <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
        {title}
      </h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {subtitle}
      </p>
    </div>

    <div
      className={cn(
        "absolute bottom-0 flex w-full transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <a className="text-sm text-neutral-600 dark:text-neutral-300">
        {/* Empty Call to Action */}
      </a>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:dark:bg-neutral-800/10" />
  </div>
);

export { BentoGrid, BentoCard };
