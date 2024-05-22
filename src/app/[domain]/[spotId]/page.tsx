/* eslint-disable react/no-unescaped-entities */
import { getSiteSpotData } from "@/server/actions/domain.action";
import React from "react";
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { PopoverTrigger, PopoverContent, Popover } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectItem, SelectContent } from "@/components/ui/select"
import Image from "next/image";

async function Page({ params }: { params: { spotId: string; domain: string } }) {
  const domain = decodeURIComponent(params.domain);
  const spotData = await getSiteSpotData(domain, params.spotId);
  return (
    <div>
      {spotData ? (
        <SpotDetails />
      ) : (
        <div>
          <h1>Did you get lost?</h1>
          <div>
          <Link
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            href={`/`}
          >
            Home
          </Link>
            </div>
          
        </div>
      )}
    </div>
  );
}

export default Page;


function SpotDetails() {
  return (
    <div key="1" className="max-w-6xl mx-auto p-4 lg:px-6 sm:py-8 md:py-10">
      <section className="relative bg-gray-100 dark:bg-gray-800">
        <div className="grid sm:grid-cols-4 gap-2">
          <Link
            className="col-span-2 row-span-2 relative after:opacity-0 after:absolute after:inset-0 after:bg-black hover:after:opacity-20 focus:after:opacity-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 transition-all rounded-xl sm:rounded-l-xl overflow-hidden dark:focus-visible:ring-gray-300"
            href="#"
          >
            <Image
              alt="Property Image 1"
              className="aspect-square object-cover w-[400px]"
              height="400"
              src="/placeholder.svg"
              width="400"
            />
          </Link>
          <Link
            className="relative after:opacity-0 after:absolute after:inset-0 after:bg-black hover:after:opacity-20 focus:after:opacity-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 transition-all rounded-tl-xl overflow-hidden dark:focus-visible:ring-gray-300"
            href="#"
          >
            <Image
              alt="Property Image 2"
              className="aspect-square object-cover"
              height="600"
              src="/placeholder.svg"
              width="600"
            />
          </Link>
          <Link
            className="relative after:opacity-0 after:absolute after:inset-0 after:bg-black hover:after:opacity-20 focus:after:opacity-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 transition-all overflow-hidden rounded-tr-xl dark:focus-visible:ring-gray-300"
            href="#"
          >
            <Image
              alt="Property Image 3"
              className="aspect-square object-cover"
              height="600"
              src="/placeholder.svg"
              width="600"
            />
          </Link>
          <Link
            className="relative after:opacity-0 after:absolute after:inset-0 after:bg-black hover:after:opacity-20 focus:after:opacity-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 transition-all rounded-bl-xl overflow-hidden dark:focus-visible:ring-gray-300"
            href="#"
          >
            <Image
              alt="Property Image 4"
              className="aspect-square object-cover w-[84px] h-[84px]"
              height="84"
              src="/placeholder.svg"
              width="84"
            />
          </Link>
          <Link
            className="relative after:opacity-0 after:absolute after:inset-0 after:bg-black hover:after:opacity-20 focus:after:opacity-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 transition-all overflow-hidden rounded-br-xl dark:focus-visible:ring-gray-300"
            href="#"
          >
            <Image
              alt="Property Image 5"
              className="aspect-square object-cover"
              height="600"
              src="/placeholder.svg"
              width="600"
            />
          </Link>
        </div>
      </section>
      <section className="py-8 grid md:grid-cols-2 lg:grid-cols-[1fr_400px] gap-8 sm:gap-12 md:gap-16 items-start">
        <div className="grid gap-8">
          <div className="hidden md:flex flex-col gap-1">
            <h2 className="text-3xl font-semibold">Cozy Mountain Retreat with Hot Tub</h2>
          </div>
          <div className="prose">
            <p>
              Welcome to our serene mountain retreat! Nestled amidst the tranquil beauty of the mountains, this cozy
              home is your perfect getaway for relaxation and adventure.
            </p>
            <p>
              Wake up to breathtaking vistas from every window. Enjoy your morning coffee on the balcony, taking in the
              serene landscape. This mountain haven is perfect for families, friends, and couples seeking a blend of
              adventure and relaxation.
            </p>
          </div>
          <Separator />
          <div className="grid gap-8">
            <h3 className="text-xl font-semibold">What this place offers</h3>
            <ul className="grid lg:grid-cols-2 gap-6">
              <li className="flex gap-4">
                <MountainSnowIcon className="w-6 h-6" />
                Mountain view
              </li>
              <li className="flex gap-4">
                <WavesIcon className="w-6 h-6" />
                Beach access
              </li>
              <li className="flex gap-4">
                <ChefHatIcon className="w-6 h-6" />
                Private chef
              </li>
              <li className="flex gap-4">
                <WifiIcon className="w-6 h-6" />
                Wifi
              </li>
              <li className="flex gap-4">
                <CarIcon className="w-6 h-6" />
                Parking
              </li>
              <li className="flex gap-4">
                <CameraIcon className="w-6 h-6" />
                Security cameras
              </li>
              <li className="flex gap-4">
                <AccessibilityIcon className="w-6 h-6" />
                Wheelchair accessible
              </li>
              <li className="flex gap-4">
                <WindIcon className="w-6 h-6" />
                Patio
              </li>
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
                    <div className="text-gray-500 text-sm dark:text-gray-400">Bernard Hill, California</div>
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
                  ·
                  <span>1 week ago</span>
                </div>
                <div>
                  Catherine's place was amazing! The views were incredible and the house was very clean. We had a great
                  time.
                </div>
              </article>
              <article className="grid gap-3">
                <div className="flex items-center gap-4">
                  <Avatar className="w-11 h-11 border">
                    <AvatarImage alt="@username" src="/placeholder-user.jpg" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="grid">
                    <div className="font-semibold">Julie</div>
                    <div className="text-gray-500 text-sm dark:text-gray-400">Miami, California</div>
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
                  ·
                  <span>1 week ago</span>
                </div>
                <div>We had a great time and would definitely stay again! Gorgeous views and a beautiful home.</div>
              </article>
              <article className="grid gap-3">
                <div className="flex items-center gap-4">
                  <Avatar className="w-11 h-11 border">
                    <AvatarImage alt="@username" src="/placeholder-user.jpg" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="grid">
                    <div className="font-semibold">Nicole</div>
                    <div className="text-gray-500 text-sm dark:text-gray-400">Nevada, California</div>
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
                  ·
                  <span>1 week ago</span>
                </div>
                <div>
                  This is my second time staying at Catherine's place and it was just as amazing as the first time. I
                  would definitely stay again!
                </div>
              </article>
            </div>
            <Button variant="outline">Show all reviews</Button>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="flex sm:hidden flex-col gap-1">
            <h2 className="sm:text-3xl font-semibold">Cozy Mountain Retreat with Hot Tub</h2>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>
                $400
                <span className="text-sm text-gray-500 font-normal dark:text-gray-400">/ night</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <form>
                <div className="grid gap-2">
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className="w-full flex-col h-auto items-start" variant="outline">
                          <span className="font-semibold uppercase text-[0.65rem]">Check in</span>
                          <span className="font-normal">4/2/2024</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 max-w-[276px]">
                        <Calendar />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className="w-full flex-col h-auto items-start" variant="outline">
                          <span className="font-semibold uppercase text-[0.65rem]">Check out</span>
                          <span className="font-normal">10/2/2024</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 max-w-[276px]">
                        <Calendar />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Select>
                    <SelectContent>
                      <SelectItem value="1">1 adult</SelectItem>
                      <SelectItem value="2">2 adults</SelectItem>
                      <SelectItem value="3">2 adults + 1 child</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  
                </div>
                <div>
                  <Button className="w-full h-12" size="lg">
                    Reserve
                  </Button>
                </div>
                <div className="text-sm text-gray-500 text-center dark:text-gray-400">You won't be charged yet</div>
              </form>
            </CardContent>
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <div className="text-gray-500 dark:text-gray-400">$400 x 3 nights</div>
                <div>$1,200</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-500 dark:text-gray-400">
                  Cleaning fee
                  <span className="text-xs">(one-time)</span>
                </div>
                <div>$130</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-500 dark:text-gray-400">Service fee</div>
                <div>$188</div>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div className="font-semibold">Total before taxes</div>
              <div>$1,518</div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}

function AccessibilityIcon(props: any) {
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
      <circle cx="16" cy="4" r="1" />
      <path d="m18 19 1-7-6 1" />
      <path d="m5 8 3-3 5.5 3-2.36 3.5" />
      <path d="M4.24 14.5a5 5 0 0 0 6.88 6" />
      <path d="M13.76 17.5a5 5 0 0 0-6.88-6" />
    </svg>
  )
}


function CameraIcon(props: any) {
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
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  )
}


function CarIcon(props: any) {
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
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  )
}


function ChefHatIcon(props: any) {
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
      <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z" />
      <path d="M6 17h12" />
    </svg>
  )
}


function MountainSnowIcon(props: any) {
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
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
      <path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19" />
    </svg>
  )
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
  )
}


function WavesIcon(props: any) {
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
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </svg>
  )
}


function WifiIcon(props: any) {
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
      <path d="M12 20h.01" />
      <path d="M2 8.82a15 15 0 0 1 20 0" />
      <path d="M5 12.859a10 10 0 0 1 14 0" />
      <path d="M8.5 16.429a5 5 0 0 1 7 0" />
    </svg>
  )
}


function WindIcon(props: any) {
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
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </svg>
  )
}