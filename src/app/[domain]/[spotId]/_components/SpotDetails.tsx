"use client";
/* eslint-disable react/no-unescaped-entities */
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { AMENITIES } from "@/lib/constant";
import { Spot, SpotImages, User, Workspace } from "@prisma/client";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, X, XIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import { BookingDates } from "@/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CalendarAvailability from "@/components/events/calendar-availability";
import moment from "moment";
import { DateRange } from "react-day-picker";
import Link from "next/link";
import CardList from "@/app/[domain]/_components/card-list";
import { Button } from "@/components/ui/button";

interface SpotDetailsProps {
  spot: Spot & { bookings: BookingDates[]; workspace: Workspace; images: SpotImages[] };
  siteData: {
    // Define the structure of siteData here
  };
}

const SpotDetails: React.FC<SpotDetailsProps> = ({ spot, siteData }) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();

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

  const onBookingDateChanged = (data: {
    startDate: Date | null | undefined;
    endDate: Date | null | undefined;
    subTotal: number;
  }) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set(
      "check-in",
      data.startDate ? moment(data.startDate).format("YYYY-MM-DD hh:mm A") : ""
    );
    current.set(
      "check-out",
      data.endDate ? moment(data.endDate).format("YYYY-MM-DD hh:mm A") : ""
    );

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`${pathname}${query}`, { scroll: false });
  };

  const onAvailabilityChecked = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`${pathname}/book${query}`, { scroll: true });
  };

  const selectedDate: Date | DateRange | undefined = !searchParams.get(
    "check-in"
  )
    ? undefined
    : spot.durationType === "hours"
    ? moment(searchParams.get("check-in")).toDate()
    : {
        from: moment(searchParams.get("check-in")).toDate(),
        to: searchParams.get("check-out")
          ? moment(searchParams.get("check-out")).toDate()
          : undefined,
      };

  // const swipeHandlers = useSwipeable({
  //   onSwipedLeft: () => handleNext(),
  //   onSwipedRight: () => handlePrevious(),
  //   preventScrollOnSwipe: true,
  //   trackMouse: true,
  // });

  return (
    <div className="max-w-6xl mx-auto p-4 lg:px-6 sm:py-8 md:py-10">
      
        <div className="flex items-center gap-2 h-10 mb-2">
            <Link href="/">
              <Button
                type="button"
                className="h-7 w-7"
                size="icon"
                variant="outline"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h3 className="whitespace-nowrap text-xl font-semibold tracking-tight ">
              Back
            </h3>
        </div>
      

      {spot.images.length > 0 ? (
        <>
          <Carousel opts={{ loop: true }} className="w-full max-w-6xl">
            <CarouselContent>
              {spot.images.map((image, index) => (
                <CarouselItem
                  key={image.id}
                  className={index === currentIndex ? "block" : "hidden"}
                >
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <div className="relative cursor-pointer after:opacity-0 after:absolute after:inset-0 after:bg-black hover:after:opacity-20 focus:after:opacity-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 transition-all rounded-xl overflow-hidden dark:focus-visible:ring-gray-300">
                        <Image
                          alt={`Image ${image.id}`}
                          className="aspect-video object-cover"
                          height={450}
                          src={image.url}
                          width={1920}
                          onClick={() => {
                            setCurrentIndex(index);
                            setIsDialogOpen(true);
                          }}
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="p-0 bg-black">
                      <Button
                        onClick={() => setIsDialogOpen(false)}
                        variant="destructive"
                        className="absolute top-4 right-4 rounded-full !p-0.5 h-auto z-50"
                      >
                        <X size={16} />
                        <span className="sr-only">Close dialog</span>
                      </Button>
                      <div>
                        <Carousel opts={{ loop: true }} className="w-full h-full">
                          <CarouselContent>
                            {spot.images.map((image, idx) => (
                              <CarouselItem
                                key={image.id}
                                className={idx === currentIndex ? "block" : "hidden"}
                              >
                                <div className="relative after:opacity-0 after:absolute after:inset-0 after:bg-black hover:after:opacity-20 focus:after:opacity-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 transition-all overflow-hidden">
                                  <Image
                                    alt={`Image ${image.id}`}
                                    className="object-cover"
                                    height={450}
                                    src={image.url}
                                    width={1920}
                                  />
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>

                          {spot.images.length > 1 && (
                            <>
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
                            </>
                          )}
                        </Carousel>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CarouselItem>
              ))}
            </CarouselContent>

            {spot.images.length > 1 && (
              <>
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
              </>
            )}
          </Carousel>
        </>
      ) : (
        // Placeholder Image when there are no images
        <div className="w-full max-w-6xl">
          <div className="relative rounded-xl overflow-hidden shadow-md">
            <Image
              alt="Placeholder Image"
              className="aspect-video object-cover"
              height={450}
              src="/placeholder.svg" // Path to your placeholder image
              width={1920}
            />
          </div>
        </div>
      )}

      <section className="py-8 grid md:grid-cols-2 lg:grid-cols-[1fr_360px] gap-8 sm:gap-12 md:gap-16 items-start">
        <div className="grid gap-4">
          <div className="md:flex flex-col gap-1">
            <h1 className="text-3xl font-semibold">{spot.name}</h1>
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
        </div>
        <div className="grid gap-4">
          
          <Card>
            <CardHeader>
              <div className="flex gap-2 justify-center">
                <div>
                  <h2 className="text-2xl font-bold">Book Now</h2>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CalendarAvailability
                bookings={spot.bookings}
                callback={onAvailabilityChecked}
                selectedDate={selectedDate}
                onDateSelected={(data) => onBookingDateChanged(data)}
                spot={spot as any}
              />
            </CardContent>
          </Card>
        </div>
      </section>
      <CardList excludeSpotId={spot.id} siteData={siteData} title={"Maybe can interest you"} subtitle={"Select a spot to explore"} />
    </div>
  );
};

export default SpotDetails;
