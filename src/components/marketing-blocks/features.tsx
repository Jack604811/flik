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
    name: "Website builder",
    description:
      "Set up your booking durations and time slots with complete flexibility",
    className: "col-span-3 lg:col-span-1",
    href: "#",
    cta: "Learn more 👉",
    background: (
      <div></div>
    ),
  },
  {
    name: "24/7 Online Bookings",
    description:
      "Automatically generate a professional, SEO-friendly website based on your spaces. Customize it with your logo, favicon, and domain to match your brand perfectly",
    href: "#",
    cta: "Learn more 👉",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute right-2 top-10 h-[300px] w-full max-w-[600px] mx-4 transition-all duration-300 ease-out group-hover:scale-105 [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)]">
       
      </div>
    ),
  },
  {
    name: "Insightful Analytics",
    description:
      "Connect with leading payment platforms or manually track transactions for cash, bank transfers, and more. Our system supports multiple payment methods.",
    href: "#",
    cta: "Learn more 👉",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="flex absolute right-2 top-10 h-[200px] max-w-[600px] justify-center transition-all duration-300 ease-out group-hover:scale-105 [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)]">
      {/* <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification key={idx} {...item} />
        ))}
      </AnimatedList> */}
      </div>
    ),
  },
  {
    name: "Integrated Payment System",
    description:
      "Detailed analytics to track your bookings, transactions and revenue",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div></div>
    ),
  },
];

export function Features() {
  return (
    <section id="features" className="relative">
      {/* Glow Effect */}
      <div className="absolute inset-0 z-0 flex justify-center items-center">
        {/* <div className="h-[1000px] w-[1000px] bg-[radial-gradient(ellipse_at_center,_#ffffff,_transparent)] opacity-5 blur-3xl rounded-full"></div> */}
      </div>

      <div className="py-24">
        <div className="container max-w-5xl mx-auto px-4 md:px-8">
          <div className="mx-auto text-center max-w-2xl">
            <h5 className="text-xl font-semibold tracking-tight text-gray-500">
              Explore
            </h5>
            <h2 className="text-4xl font-medium tracking-tight text-black dark:text-white sm:text-5xl">
              Flik is All You Need to Run Your Business Efficiently
            </h2>
            <p className="text-balance text-lg tracking-tight text-gray-400 md:text-xl py-4">
              Manage your day-to-day operations, freeing up time to focus on growth.
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

