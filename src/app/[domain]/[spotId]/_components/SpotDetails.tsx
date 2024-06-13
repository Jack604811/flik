"use client";
/* eslint-disable react/no-unescaped-entities */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { AMENITIES } from "@/lib/constant";
import { Booking, Spot, SpotImages, User } from "@prisma/client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import Image from "next/image";
import { useState } from "react";

import BookingSection from "./BookingSection";
import { BookingDates } from "@/lib/types";

export default function SpotDetails({
  spot,
}: {
  spot: Spot & { bookings: BookingDates[]; owner: User; images: SpotImages[] };
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? spot.images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === spot.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:px-6 sm:py-8 md:py-10">
      <Carousel opts={{ loop: true }} className="w-full max-w-6xl">
        <CarouselContent>
          {spot.images.map((image, index) => (
            <CarouselItem
              key={image.id}
              className={index === currentIndex ? "block" : "hidden"}
            >
              <div className="relative after:opacity-0 after:absolute after:inset-0 after:bg-black hover:after:opacity-20 focus:after:opacity-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 transition-all rounded-xl overflow-hidden dark:focus-visible:ring-gray-300">
                <Image
                  alt={`Image ${image.id}`}
                  className=" aspect-video object-cover"
                  height={450}
                  src={image.url}
                  width={1920}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2"
        >
          <ChevronLeftIcon className="w-6 h-6" />
          <span className="sr-only">Previous slide</span>
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2"
        >
          <ChevronRightIcon className="w-6 h-6" />
          <span className="sr-only">Next slide</span>
        </button>
      </Carousel>

      <section className="py-8 grid md:grid-cols-2 lg:grid-cols-[1fr_360px] gap-8 sm:gap-12 md:gap-16 items-start">
        <div className="grid gap-4">
          <div className="hidden md:flex flex-col gap-1">
            <h2 className="text-3xl font-semibold">{spot.name}</h2>
          </div>
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: spot.description?.replace(/\r?\n/g, "<br />"),
            }}
          />
          <Separator />
          <div className="grid gap-8">
            <h3 className="text-xl font-semibold">What this place offers</h3>
            <ul className="grid lg:grid-cols-2 gap-6">
              {AMENITIES.filter((amenity) =>
                spot.amenities.includes(amenity.value)
              ).map((amenity, key) => (
                <li key={key} className="flex gap-4">
                  {amenity.label}
                </li>
              ))}
            </ul>
          </div>
          <Separator />
          <div className="grid gap-8">
            <div className="grid gap-0.5">
              <h3 className="text-xl font-semibold">Reviews</h3>
              <div className="text-gray-500 dark:text-gray-400">
                See what previous guests have said about this property.
              </div>
            </div>
            <div className="grid gap-4">
              <article className="grid gap-3">
                <div className="flex items-center gap-4">
                  <Avatar className="w-11 h-11 border">
                    <AvatarImage alt="@username" src="/placeholder-user.jpg" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="grid">
                    <div className="font-semibold">Scott</div>
                    <div className="text-gray-500 text-sm dark:text-gray-400">
                      Bernard Hill, California
                    </div>
                  </div>
                </div>
                <div className="font-semibold flex items-center text-xs gap-2">
                  <div className="flex items-center gap-px">
                    <StarIcon className="w-2.5 h-2.5 fill-primary" />
                    <StarIcon className="w-2.5 h-2.5 fill-primary" />
                    <StarIcon className="w-2.5 h-2.5 fill-primary" />
                    <StarIcon className="w-2.5 h-2.5 fill-primary" />
                    <StarIcon className="w-2.5 h-2.5" />
                  </div>
                  ·<span>1 week ago</span>
                </div>
                <div>
                  Catherine's place was amazing! The views were incredible and
                  the house was very clean. We had a great time.
                </div>
              </article>
            </div>
            <Button variant="outline">Show all reviews</Button>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="flex sm:hidden flex-col gap-1">
            <h2 className="sm:text-3xl font-semibold">{spot.name}</h2>
          </div>
          <BookingSection spot={spot} />
        </div>
      </section>
    </div>
  );
}

function StarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}