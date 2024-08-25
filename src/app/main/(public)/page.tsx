import { Companies } from "@/components/marketing-blocks/companies";
import { Hero } from "@/components/marketing-blocks/hero";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
    <Hero />
    <Companies />
    </>
  );
}
