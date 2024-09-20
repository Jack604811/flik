"use client";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { AnimatedBeamMultipleOutputDemo } from "@/components/magicui/animated-beam-multiple-outputs";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import Marquee from "@/components/magicui/marquee";
import { AnimatedList } from "@/components/magicui/animated-list";
import SleekBrowserFrame from "../magicui/sleek-browser-frame";

const files = [
  {
    name: "bitcoin.pdf",
    body: "Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group of people using the name Satoshi Nakamoto.",
  },
  {
    name: "finances.xlsx",
    body: "A spreadsheet or worksheet is a file made of rows and columns that help sort data, arrange data easily, and calculate numerical data.",
  },
  {
    name: "logo.svg",
    body: "Scalable Vector Graphics is an Extensible Markup Language-based vector image format for two-dimensional graphics with support for interactivity and animation.",
  },
  {
    name: "keys.gpg",
    body: "GPG keys are used to encrypt and decrypt email, files, directories, and whole disk partitions and to authenticate messages.",
  },
  {
    name: "seed.txt",
    body: "A seed phrase, seed recovery phrase or backup seed phrase is a list of words which store all the information needed to recover Bitcoin funds on-chain.",
  },
];

let notifications = [
  {
    name: "Payment received",
    description: "Stripe",
    time: "Now",
    icon: "💸",
    color: "#00C9A7",
  },
  {
    name: "Payment received",
    description: "Stripe",
    time: "Now",
    icon: "💸",
    color: "#FFB800",
  },
  {
    name: "Payment received",
    description: "Stripe",
    time: "Now",
    icon: "💸",
    color: "#FF3D71",
  },
  {
    name: "Payment received",
    description: "Stripe",
    time: "Now",
    icon: "💸",
    color: "#1E86FF",
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({ name, description, icon, color, time }: any) => (
  <div style={{ borderLeft: `4px solid ${color}` }} className="p-2 mb-2">
    <h4>{icon} {name}</h4>
    <p>{description}</p>
    <span>{time}</span>
  </div>
);

const features = [
  {
    name: "Dynamic Booking Flexibility",
    description:
      "Set up your booking durations and time slots with complete flexibility. Tailor your availability down to the hour, day, or week – whatever suits your business needs.",
    className: "col-span-3 lg:col-span-1",
    href: "#",
    cta: "Learn more 👉",
    background: (
      <Calendar
        mode="single"
        selected={new Date(2022, 4, 11, 0, 0, 0)}
        className="absolute right-0 top-10 origin-top rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-105"
      />
    ),
  },
  {
    name: "Instant Website Creation",
    description:
      "Automatically generate a professional, SEO-friendly website based on your spaces. Customize it with your logo, favicon, and domain to match your brand perfectly. Drive traffic with paid ads or organic searches to boost your bookings.",
    href: "#",
    cta: "Learn more 👉",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute right-2 top-10 h-[300px] w-[600px] transition-all duration-300 ease-out group-hover:scale-105 [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)]">
        <SleekBrowserFrame />
      </div>
    ),
  },
  {
    name: "Integrated Payment Solutions",
    description:
      "Connect with leading payment platforms or manually track transactions for cash, bank transfers, and more. Our system supports multiple payment methods, ensuring you never miss a payment.",
    href: "#",
    cta: "Learn more 👉",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute right-2 top-10 h-[200px] w-[600px] transition-all duration-300 ease-out group-hover:scale-105 [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)]">
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification key={idx} {...item} />
        ))}
      </AnimatedList>
      </div>
    ),
  },
  {
    name: "Insightful Analytics",
    description:
      "Dive into detailed analytics to track your bookings, transactions, and revenues. Understand your performance at a glance with metrics like occupancy rates, total visits, and upsell effectiveness.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]"
      >
        {files.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white ">
                  {f.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
];

export function Features() {
  return (
    <section id="features">
      <div className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto text-center">
            <h5 className="text-xl font-bold tracking-tight text-gray-500">
              Explore
            </h5>
            <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-6xl">
              Features
            </h2>
            <p className="text-balance text-lg tracking-tight text-gray-400 md:text-xl py-4">
              Discover Our Tools and Flexibility You Need to Manage Your Spaces,
              Drive Traffic, and Maximize Bookings.
            </p>
          </div>
          <div className="container mx-auto my-12 max-w-[1200px] space-y-12">
            <BentoGrid>
              {features.map((feature, idx) => (
                <BentoCard key={idx} {...feature} />
              ))}
            </BentoGrid>
          </div>
        </div>
      </div>
    </section>
  );
}
