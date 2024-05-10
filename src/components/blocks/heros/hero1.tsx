import Image from "next/image";
import { Button } from "@/components/ui/button";
export function Hero1() {
  return (
    <section className="text-center p-8 flex flex-col gap-4 items-center max-w-[1000px] mx-auto">
      <h2 className="text-foreground/80 md:text-lg lg:text-xl">
        {" "}
        Here would go a short and clear description of your product{" "}
      </h2>
      <h1 className="text-3xl font-bold text-balance md:text-5xl/snug lg:text-6xl/snug">
        My product solves this X problem for this Y people{" "}
      </h1>
      <div className="  p-1 mt-4 flex flex-col gap-4 md:flex-row md:justify-center md:items-center">
        <Button className="w-full text-lg h-12 ">
          Primary call to action
        </Button>
        <Button variant={"secondary"} className="w-full text-lg h-12">
          Secondary call to action
        </Button>
      </div>
      <Image
        src={"/assets/placeholder.svg"}
        width={1000}
        height={600}
        alt="Placeholder hero image"
        className=" w-full  max-h-[600px] object-cover rounded mt-6 "
      />
    </section>
  );
}
