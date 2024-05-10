import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "@/components/ui/button";
export function Hero2() {
  return (
    <section className="p-8 text-center flex flex-col gap-4 xl:flex-row xl:text-left xl:items-center max-w-[800px] mx-auto xl:max-w-[1500px] xl:justify-around ">
      <div className="space-y-6 xl:max-w-xl">
        <h1 className="text-3xl font-bold text-balance md:text-5xl/snug ">
          My product solves this X problem for this Y people{" "}
        </h1>
        <p className="lg:text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vehicula
          massa in enim luctus. Rutrum arcu.
        </p>
        <form className="flex flex-col gap-2">
          <Input required placeholder="Enter email address" />
          <Button>Join Now</Button>
        </form>
        <div className="flex flex-col items-center gap-3 mt-4 xl:items-start">
          <p>Trusted by the best brands</p>
          <div className="opacity-50 flex overflow-scroll md:overflow-auto gap-3 flex-none xl:grid xl:grid-cols-2">
            <Image src="/assets/logo.svg" width={200} height={200} alt="" />
            <Image src="/assets/logo.svg" width={200} height={200} alt="" />
            <Image src="/assets/logo.svg" width={200} height={200} alt="" />
            <Image src="/assets/logo.svg" width={200} height={200} alt="" />
          </div>
        </div>
      </div>
      <Image
        src={"/assets/placeholder.svg"}
        width={1000}
        height={600}
        alt="Placeholder hero image"
        className=" w-full  max-h-[600px] object-cover rounded mt-6 xl:max-w-[500px] xl:max-h-[700px] "
      />
    </section>
  );
}
