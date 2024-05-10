import Image from "next/image";

const testimonials = [
  {
    message:
      "The platform is intuitive and easy to use. It has streamlined our workflow and improved team collaboration.",
    user: {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      picture: "/assets/placeholder.svg",
    },
  },
  {
    message:
      "The platform is intuitive and easy to use. It has streamlined our workflow and improved team collaboration.",
    user: {
      name: "David Johnson",
      role: "Marketing Manager",
      picture: "/assets/placeholder.svg",
    },
  },
  {
    message:
      "The platform is intuitive and easy to use. It has streamlined our workflow and improved team collaboration.",
    user: {
      name: "Charlie Johnson",
      role: "Marketing Manager",
      picture: "/assets/placeholder.svg",
    },
  },
  {
    message:
      "The platform is intuitive and easy to use. It has streamlined our workflow and improved team collaboration.",
    user: {
      name: " Bob Johnson",
      role: "Marketing Manager",
      picture: "/assets/placeholder.svg",
    },
  },
  {
    message:
      "The platform is intuitive and easy to use. It has streamlined our workflow and improved team collaboration.",
    user: {
      name: " Tom Johnson",
      role: "Marketing Manager",
      picture: "/assets/placeholder.svg",
    },
  },
  {
    message:
      "The platform is intuitive and easy to use. It has streamlined our workflow and improved team collaboration.",
    user: {
      name: "Alice Johnson",
      role: "Marketing Manager",
      picture: "/assets/placeholder.svg",
    },
  },
];

export function Testimonials1() {
  return (
    <div className="w-full py-12 lg:py-24 px-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold leading-tight sm:text-4xl xl:text-5xl ">
          Testimonials
        </h2>
        <p className="mt-4 text-base leading-7 sm:mt-8 text-foreground/80">
          What our clients say of us
        </p>
      </div>
      <div className="container grid max-w-3xl gap-6 px-4 text-center md:grid-cols-2 md:gap-8 lg:max-w-5xl lg:gap-10 xl:max-w-6xl xl:grid-cols-2xl xl:gap-16 mt-12">
        {testimonials.map((testimonial) => (
          <div key={testimonial.user.name} className="flex flex-col justify-between space-y-4 md:space-y-6">
            <div className="space-y-4 md:space-y-6">
              <Image
                alt={testimonial.user.name}
                className="mx-auto rounded-full"
                height="150"
                src={testimonial.user.picture}
                style={{
                  aspectRatio: "150/150",
                  objectFit: "cover",
                }}
                width="150"
              />
            </div>
            <div className="space-y-2">
              <blockquote className="text-lg font-semibold leading-snug md:text-xl md:leading-normal">
                {testimonial.message}
              </blockquote>
              <div className="text-sm font-semibold">
                <span className="inline-block">{testimonial.user.name}</span>{" "}
                <span className="inline-block text-sm text-gray-500 dark:text-gray-400">
                  ({testimonial.user.role})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
