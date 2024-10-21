import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimationContainer } from "@/components/marketing-blocks/animations/animation-container";

const faqs = [
  {
    section: "",
    qa: [
      {
        question: "How can I use the website to attract more bookings?",
        answer: (
          <span>
            The automatically generated website is SEO-friendly, 
            allowing you to optimize it for search engines. 
            You can also use the custom URL in your paid advertising 
            campaigns to drive traffic directly to your booking site.
          </span>
        ),
      },
      {
        question: "What customization options are available for the website?",
        answer: (
          <span>
            You can customize your website with your logo, favicon, 
            and a custom domain to ensure it aligns with your brand. 
            Currently we are working on our website builder to improve the customization.
          </span>
        ),
      },
      {
        question: "How does the calendar work for each spot?",
        answer: (
          <span>
            Our platform features an intuitive calendar system that allows you to customize 
            booking availability for each spot. You can set different time slots, durations, 
            and even block out specific times or days as needed. This flexibility lets you 
            tailor each spot&apos;s calendar to fit your unique scheduling needs, 
            whether it&apos;s for hourly, daily, or multi-day bookings. All changes are reflected in real-time, 
            ensuring your customers always see the most up-to-date availability.
          </span>
        ),
      },
      {
        question: "Can I import my current bookings from another platform?",
        answer: (
          <span>
            Yes, you can easily import your existing bookings from other platforms into our system. 
            Simply export your bookings into a CSV file from your current platform, and then upload 
            that file directly into our platform. Our user-friendly interface allows you to import 
            your bookings without any need for coding or technical skills. This way, you can seamlessly 
            transition to our platform while keeping all your existing data intact.
          </span>
        ),
      },
      {
        question: "Is the website optimized for mobile devices?",
        answer: (
          <span>
            Absolutely! Our generated websites are fully responsive, 
            ensuring a seamless experience for your customers 
            on both desktop and mobile devices.
          </span>
        ),
      },
      {
        question: "Is there a limit to the number of spots or upsells I can add?",
        answer: (
          <span>
            No, there are no limits! You can add as many spots 
            and upsells as you need to accommodate your business offerings.
          </span>
        ),
      },
    ],
  },
];

export function FAQ() {
  return (
    <section id="faq">
      <div className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto text-center">
            <AnimationContainer delay={0.1} duration={0.8}>
              <h5 className="text-lg tracking-tight text-gray-500">
                FAQs
              </h5>
            </AnimationContainer>
            <AnimationContainer delay={0.2} duration={0.8}>
              <h2 className="text-4xl font-medium tracking-tight text-black dark:text-white sm:text-5xl">
                Frequently Asked Questions
              </h2>
            </AnimationContainer>
            <AnimationContainer delay={0.3} duration={0.8}>
              <p className="text-lg tracking-tight text-gray-500 py-4">
                Need help with something? Here are some of the most common
                questions we get.
              </p>
            </AnimationContainer>
          </div>
          <div className="container mx-auto my-12 max-w-[1200px] space-y-12">
            {faqs.map((faq, idx) => (
              <section key={idx} id={"faq-" + faq.section}>
                <h2 className="mb-4 text-left text-base font-semibold tracking-tight text-foreground/60">
                  {faq.section}
                </h2>
                <Accordion
                  type="single"
                  collapsible
                  className="flex w-full flex-col items-center justify-center"
                >
                  {faq.qa.map((faq, idx) => (
                    <AnimationContainer key={idx} delay={0.2 * idx} duration={0.8}>
                      <AccordionItem
                        value={faq.question}
                        className="w-full max-w-[600px]"
                      >
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent className=" bg-neutral-900 rounded-xl p-4 border-none">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </AnimationContainer>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>
          <AnimationContainer delay={0.5} duration={0.8}>
            <h4 className="mb-12 text-center text-sm font-medium tracking-tight text-foreground/80">
              Still have questions? Email us at{" "}
              <a href="mailto:support@flik.com" className="underline">
                support@flik.com
              </a>
            </h4>
          </AnimationContainer>
        </div>
      </div>
    </section>
  );
}
