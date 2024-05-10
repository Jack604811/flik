import { StarIcon } from "lucide-react";

const testimonials = [
  {
    message:
      "I'm so glad I found this company. The products are top-notch, and the customer service is friendly and helpful. Highly recommended!",
    rating: 4,
    user: "John Doe",
  },
  {
    message:
      "The products I ordered exceeded my expectations. The quality is fantastic, and everything was packaged with care. I'll definitely be shopping here again!",
    rating: 5,
    user: "Jane Doe",
  },
  {
    message:
      "The customer service I received was exceptional. The support team went above and beyond to address my concerns. Thanks for making my experience a positive one!",
    rating: 3,
    user: "John Smith",
  },
];

export function Testimonials2() {
  return (
    <section className="w-full py-12">
      <div className="mx-auto px-4 md:px-6 max-w-2xl grid gap-6">
        <div className="text-center space-y-2">
          <div className="inline-block rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm">
            Testimonials
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            Customers Love Us
          </h2>
          <p className="max-w-[600px] mx-auto text-gray-500 dark:text-gray-400">
            Our customers have great things to say about their experiences with
            our products and services. Check out some of the glowing reviews
            they&apos;ve shared.
          </p>
        </div>
        <div className="grid gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.user} className="grid gap-2">
              <div className="flex items-center gap-2">
                {Array.from({ length: testimonial.rating }, (_, index) => (
                  <StarIcon
                    key={index}
                    className="w-6 h-6 text-yellow-500 fill-accent"
                  />
                ))}
                <span className="text-gray-500 dark:text-gray-400">
                  {testimonial.user}
                </span>
              </div>
              <blockquote className="text-lg leading-snug xl:text-xl xl:leading-normal">
                “I&apos;m so glad I found this company. The products are top-notch,
                and the customer service is friendly and helpful. Highly
                recommended!“
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
