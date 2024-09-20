import { Pricing as PricingTable } from "@/components/marketing-blocks/pricing/pricing-table";
import { ComparePlans } from "@/components/marketing-blocks/pricing/compare-plans";
import { SocialProofTestimonials } from "@/components/marketing-blocks/testimonials";
import { FAQ } from "@/components/marketing-blocks/faq";


export default function Pricing() {
  return (
    <>
      <PricingTable />
      <section id="compare-plans">
      <ComparePlans />
      </section>
      <SocialProofTestimonials />
      <FAQ />
    </>
  )
}
     