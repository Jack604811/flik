"use client";
/* eslint-disable react/no-unescaped-entities */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AMENITIES } from "@/lib/constant";
import { addBooking } from "@/server/actions/booking.action";
import { Spot, SpotImages, User } from "@prisma/client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { v4 } from "uuid";

export default function SpotDetails({
  spot,
}: {
  spot: Spot & { owner: User; images: SpotImages[] };
}) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<
    Date | DateRange | undefined
  >();
  const [currentIndex, setCurrentIndex] = useState(0);
  const workingHours: {
    day: string;
    price: number;
    start: string;
    end: string;
  }[] = spot.workingHours as any;

  const calculateDays = (
    selectedDate: Date | DateRange | undefined
  ): number => {
    if (!selectedDate) return 0;

    if ("from" in selectedDate && "to" in selectedDate) {
      return (
        moment(selectedDate.to).diff(moment(selectedDate.from), "days") + 1
      );
    }

    return 1; // If it's a single date
  };

  const getDatesArray = (
    selectedDate: Date | DateRange | undefined
  ): Date[] => {
    if (!selectedDate) return [];

    if ("from" in selectedDate && "to" in selectedDate) {
      const startDate = moment(selectedDate.from);
      const endDate = moment(selectedDate.to);
      const days: Date[] = [];
      for (
        let date = startDate;
        date.isSameOrBefore(endDate);
        date.add(1, "day")
      ) {
        days.push(date.toDate());
      }
      return days;
    }

    return [selectedDate as Date]; // If it's a single date
  };

  const getPriceForDay = (day: string): number => {
    const workingHour = workingHours?.find((wh) => wh.day === day);
    console.log(day, workingHour, workingHours);
    return workingHour ? workingHour.price : 0;
  };

  const calculateSubtotal = (
    selectedDate: Date | DateRange | undefined
  ): number => {
    const days = getDatesArray(selectedDate);
    return days.reduce((total, date) => {
      const dayOfWeek = moment(date).format("dddd");
      return total + getPriceForDay(dayOfWeek);
    }, 0);
  };

  const getStartEndDates = (selectedDate: Date | DateRange | undefined) => {
    if (!selectedDate) return { startDate: null, endDate: null };
    if (selectedDate && "from" in selectedDate && "to" in selectedDate)
      return { startDate: selectedDate.from!, endDate: selectedDate.to! };

    return { startDate: selectedDate as Date, endDate: selectedDate as Date };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const total = calculateSubtotal(selectedDate);
      const { startDate, endDate } = getStartEndDates(selectedDate);
      const booking = await addBooking({
        startDate,
        endDate,
        subtotal: total,
        totalPrice: total,
        spotId: spot.id,
      });
      router.push(`/booking/${booking.id}`);
    } catch (error: any) {
      toast.error(`There was an error adding booking ${error?.message}`);
    }
  };

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
      <Carousel className="w-full max-w-6xl">
      <CarouselContent>
      {spot.images.map((image, index) => (
          <CarouselItem key={image.id} className={index === currentIndex ? 'block' : 'hidden'}>
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
      <button onClick={handlePrevious} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2">
        <ChevronLeftIcon className="w-6 h-6" />
        <span className="sr-only">Previous slide</span>
      </button>
      <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-center gap-8">
                Check Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 justify-center">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-2 ">
                  <Calendar
                    className="p-0 hidden xl:flex [&_td]:w-10 [&_td]:h-10 [&_th]:w-10 [&_[name=day]]:w-10 [&_[name=day]]:h-10 [&>div]:space-x-0 [&>div]:gap-6"
                    mode={spot.durationType === "hours" ? "single" : "range"}
                    numberOfMonths={1}
                    defaultMonth={(selectedDate as DateRange)?.from}
                    onSelect={setSelectedDate}
                    selected={selectedDate as any}
                    disabled={{ from: new Date(1970), to: new Date() }}
                  />
                  {/* <Calendar className="flex xl:hidden p-0" /> */}
                </div>
                {spot.durationType === "hours" && (
                  <div className="max-w-md my-4 p-0 space-y-4">
                    <h2 className="text-md font-bold">Select a Time Slot</h2>
                    <div className="grid grid-cols-3 gap-2">
                      <button className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md py-1 px-2 transition-colors">
                        9:00 AM
                      </button>
                      <button className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md py-1 px-2 transition-colors">
                        10:00 AM
                      </button>
                      <button className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md py-1 px-2 transition-colors">
                        11:00 AM
                      </button>
                      <button className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md py-1 px-2 transition-colors">
                        12:00 PM
                      </button>
                      <button className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md py-1 px-2 transition-colors">
                        1:00 PM
                      </button>
                      <button className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md py-1 px-2 transition-colors">
                        2:00 PM
                      </button>
                      <button className="text-sm bg-primary text-white hover:bg-primary-700 rounded-md py-1 px-2 transition-colors">
                        3:00 PM
                      </button>
                      <button className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md py-1 px-2 transition-colors">
                        4:00 PM
                      </button>
                      <button className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md py-1 px-2 transition-colors">
                        5:00 PM
                      </button>
                    </div>
                  </div>
                )}
                <div>
                  <Button type="submit" className="w-full h-12 mt-3" size="lg">
                    Continue
                  </Button>
                </div>
                <div className="text-sm text-gray-500 text-center dark:text-gray-400">
                  You won't be charged yet
                </div>
              </form>

              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <div className="text-gray-500 dark:text-gray-400">
                    Subtotal for {calculateDays(selectedDate)} day(s)
                  </div>
                  <div>${calculateSubtotal(selectedDate)}</div>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div className="font-semibold">Total before taxes</div>
                <div>${calculateSubtotal(selectedDate)}</div>
              </div>
            </CardContent>
          </Card>
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
