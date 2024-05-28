"use client";
/* eslint-disable react/no-unescaped-entities */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AMENITIES } from "@/lib/constant";
import { Spot, SpotImages, User } from "@prisma/client";
import moment from "moment";
import Image from "next/image";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { v4 } from "uuid";

export default function SpotDetails({
  spot,
}: {
  spot: Spot & { owner: User; images: SpotImages[] };
}) {
  const [selectedDate, setSelectedDate] = useState<
    Date | DateRange | undefined
  >();
  const firstSpotImage = spot.images[0];
  const workingHours: {
    day: string;
    price: number;
    start: string;
    end: string;
  }[] = spot.workingHours as any;
  const todayWorkingHour = workingHours.find(
    (w) => w.day === moment().format("dddd")
  );

  return (
    <div key="1" className="max-w-6xl mx-auto p-4 lg:px-6 sm:py-8 md:py-10">
      <section className="relative bg-gray-100 dark:bg-gray-800 rounded-xl">
        <div className="grid sm:grid-cols-4 gap-2">
          <div className="col-span-2 row-span-2 relative after:opacity-0 after:absolute after:inset-0 after:bg-black hover:after:opacity-20 focus:after:opacity-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 transition-all rounded-xl sm:rounded-l-xl overflow-hidden dark:focus-visible:ring-gray-300">
            <Image
              alt="Property Image 1"
              className="aspect-square object-cover w-full h-full"
              height={1080}
              src={firstSpotImage.url}
              width="1920"
            />
          </div>

          {spot.images.slice(1).map((image) => (
            <div
              key={image.id}
              className="relative after:opacity-0 after:absolute after:inset-0 after:bg-black hover:after:opacity-20 focus:after:opacity-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 transition-all rounded-xl overflow-hidden dark:focus-visible:ring-gray-300"
            >
              <Image
                alt="Property Image 2"
                className="aspect-square object-cover"
                height={1080}
                src={image.url}
                width="1920"
              />
            </div>
          ))}
        </div>
      </section>
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
              <form action={`/booking/${spot.id}/${v4()}`}>
                <div className="grid gap-2 ">
                  <Calendar
                    className="p-0 hidden xl:flex [&_td]:w-10 [&_td]:h-10 [&_th]:w-10 [&_[name=day]]:w-10 [&_[name=day]]:h-10 [&>div]:space-x-0 [&>div]:gap-6"
                    mode={
                      spot.durationType === "hours"
                        ? "single"
                        : spot.durationType === "days" &&
                          (spot.duration ?? 0) <= 1
                        ? "single"
                        : "range"
                    }
                    numberOfMonths={1}
                    defaultMonth={(selectedDate as DateRange)?.from}
                    onSelect={setSelectedDate}
                    selected={selectedDate as any}
                    disabled={{ from: new Date(1970), to: new Date() }}
                  />
                  {/* <Calendar className="flex xl:hidden p-0" /> */}
                </div>
                {(spot.durationType === "hours" ||
                  (spot.durationType === "days" &&
                    (spot.duration ?? 0) <= 1)) && (
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
                    ${todayWorkingHour?.price} x{" "}
                    {(selectedDate as any)?.to
                      ? moment((selectedDate as any).from).to(
                          (selectedDate as any).to,
                          true
                        )
                      : "a day"}
                  </div>
                  <div>
                    $
                    {todayWorkingHour?.price ??
                      0 *
                        Number(
                          (selectedDate as any)?.to
                            ? moment((selectedDate as any).from)
                                .to((selectedDate as any).to, true)
                                .replace(" days", "")
                                .replace("a day", "1")
                            : "2"
                        )}
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div className="font-semibold">Total before taxes</div>
                <div>${todayWorkingHour?.price ?? 0 * 1}</div>
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
