import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is it accessible?",
    answer: "Yes. It adheres to the WAI-ARIA design pattern.",
  },
  {
    question: "How can I make payment using Paypal?",
    answer:
      "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
  },
  {
    question: "Do I have a refund guarantee?",
    answer:
      "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
  },
];

export function Faqs1() {
  return (
    <section className="py-10 sm:py-16 lg:py-24">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold leading-tight  sm:text-4xl lg:text-5xl">
            Commonly Asked Questions
          </h2>
          <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed ">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-8 space-y-4 md:mt-16">
          {faqs.map((faq, index) => (
            <Accordion key={faq.question} type="single" collapsible>
              <AccordionItem
                className="bg-accent text-accent-foreground px-4 py-3 rounded hover:bg-accent/90 transition-colors"
                value={`faq-${index}`}
              >
                <AccordionTrigger className="text-xl">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-lg">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
        <p className="text-center  textbase mt-9">
          Didn’t find the answer you are looking for?{" "}
          <a
            href="#"
            title=""
            className="font-medium transition-all duration-200  hover:underline text-accent hover:text-accent/80"
          >
            Contact our support
          </a>
        </p>
      </div>
    </section>
  );
}
