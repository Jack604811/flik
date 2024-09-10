import { Companies } from "@/components/marketing/companies";
import { FAQ } from "@/components/marketing/faq";
import { Features } from "@/components/marketing/features";
import { Hero } from "@/components/marketing/hero";
import { SocialProofTestimonials } from "@/components/marketing/testimonials";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
    <Hero />
    <Companies />
    <Features />
    <SocialProofTestimonials/>
    <FAQ/>
    </>
  );
}
