import React from "react";
import Link from "next/link";
import Image from "next/image";

interface CarouselProps {
  siteData: any; 
  excludeSpotId?: string;
  title: string;
  subtitle: string;
}

const CarouselSpots: React.FC<CarouselProps> = ({
  siteData,
  excludeSpotId,
  title,
  subtitle,
}) => {
  return (
    <section className="w-full pt-12 md:pt-16 lg:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-gray-500">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {siteData?.spots
            ?.filter((spot: { id: string }) => spot.id !== excludeSpotId)
            .map((spot: {
              id: string;
              path?: string;
              name: string;
              images: { url: string }[];
              description: string;
            }) => (
              <div
                className="group relative overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-lg dark:border-2 dark:rounded-xl"
                key={spot.id}
              >
                <Link href={`/${spot.path ? spot.path : spot.id}`}>
                  <Image
                    alt={spot.name}
                    className="h-64 w-full object-cover"
                    height={300}
                    src={spot.images.length > 0 ? spot.images[0].url : "/placeholder.svg"}
                    style={{
                      aspectRatio: "16/9",
                      objectFit: "cover",
                    }}
                    width={320}
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold">{spot.name}</h3>
                    <p className="mt-2 line-clamp-3">{spot.description}</p>
                    <div className="mt-4">
                      <button
                        style={{ backgroundColor: "var(--primary-color)" }}
                        className="hover:scale-105 py-2 px-4 rounded"
                      >
                        Explore
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default CarouselSpots;
