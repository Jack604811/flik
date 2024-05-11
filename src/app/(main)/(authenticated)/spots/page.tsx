import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Page() {
  return (
    <div
      className="flex h-screen w-full items-center justify-center"
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          You have no spots
        </h3>
        <p className="text-sm text-muted-foreground">
          You can start selling as soon as you add a spot.
        </p>
        <Link href="/spots/new">
        <Button className="mt-4">Add a new spot</Button>
        </Link>
      </div>
    </div>
  )
}
