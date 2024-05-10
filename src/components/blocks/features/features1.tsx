import { Card, CardContent } from "@/components/ui/card";
import { Headphones } from "lucide-react";

const features = [
  {
    title: "Feature 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin id justo sit amet.",
    icon: Headphones,
  },
  {
    title: "Feature 2",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin id justo sit amet.",
    icon: Headphones,
  },
  {
    title: "Feature 3",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin id justo sit amet.",
    icon: Headphones,
  },
  {
    title: "Feature 4",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin id justo sit amet.",
    icon: Headphones,
  },
  {
    title: "Feature 5",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin id justo sit amet.",
    icon: Headphones,
  },
  {
    title: "Feature 6",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin id justo sit amet.",
    icon: Headphones,
  },
];

export function Features1() {
  return (
    <section className="py-12  sm:py-16 lg:py-20 bg-accent text-accent-foreground">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl xl:text-5xl ">
            Title for your features
          </h2>
          <p className="mt-4 text-base leading-7 sm:mt-8 text-accent-foreground/80">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
        <div className="grid grid-cols-1 mt-10 text-center sm:mt-16 sm:grid-cols-2 sm:gap-x-12 gap-y-12 md:grid-cols-3  xl:mt-24 ">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent>
                <div className="md:p-8 lg:p-14">
                  <feature.icon className="mx-auto" size={46} />
                  <h3 className="mt-12 text-xl font-bold  ">{feature.title}</h3>
                  <p className="mt-5 text-base text-foreground/80 ">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Third card and beyond remain similar */}
        </div>
      </div>
    </section>
  );
}
