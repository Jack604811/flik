"use client";
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation";

export default function BookingInfo({onCompleted}: {onCompleted: (status: boolean) => void}) {
    const router = useRouter()
  return (
    <div key="1" className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md bg-white rounded-lg dark:bg-gray-950">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Progress className="w-full" value={33} />
          </div>
          <div className="space-y-6">
            <div className="flex gap-2 justify-between">
              <span>
                <h2 className="text-2xl font-bold">Personal Details</h2>
                <p className="text-gray-500 dark:text-gray-400">Enter your personal details to create a booking.</p>
              </span>
              <div className="flex gap-2">
                <Button className="border border-gray-300 w-8 h-8" variant="outline">
                  {`<`}
                </Button>
                <Button className="border border-gray-300 w-8 h-8" variant="outline">
                  {`>`}
                </Button>
              </div>
            </div>
            <form className="flex flex-col gap-2 space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Enter your email" type="email" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Enter your phone number" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="dni">DNI</Label>
                <Input id="dni" placeholder="Enter your DNI number" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Enter your address" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="note">Add a note</Label>
                <Textarea className="w-full" placeholder="Enter your note here..." rows={4} />
              </div>
            </form>
          </div>
        </div>
        <div className="flex gap-2 ml-6 mr-6 py-4 border-t dark:border-gray-800 justify-between">
          <Button variant="outline" onClick={() => router.back()}>Back</Button>
          <Button onClick={() => onCompleted(true)}>Book Now</Button>
        </div>
      </div>
    </div>
  )
}