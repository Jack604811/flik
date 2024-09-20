import Link from "next/link";
import { Companies } from "@/components/marketing-blocks/companies";
import { FAQ } from "@/components/marketing-blocks/faq";
import { Features } from "@/components/marketing-blocks/features";
import { Hero } from "@/components/marketing-blocks/hero";
import { SocialProofTestimonials } from "@/components/marketing-blocks/testimonials";
import { Pricing } from "@/components/marketing-blocks/pricing/pricing-table";
import { Button } from "@/components/ui/button";




export default function Home() {
  return (
    <>
    <Hero />
    <Companies />
    <section id="features">
    <Features />
    </section>
    <SocialProofTestimonials />
    <Pricing />
    <div className="flex justify-center">
    <Link href="/pricing/#compare-plans">
    <Button variant="outline">Compare plans 👉</Button>
    </Link>
    </div>
    <FAQ />
    </>
  );
}
