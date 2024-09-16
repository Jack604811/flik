import { BookingStatus, Spot } from "@prisma/client"
import { z } from "zod"

import {
  CheckCircledIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"

export const statuses = [
  {
    value: BookingStatus.In_progress,
    label: "In progress",
    icon: StopwatchIcon,
  },
  {
    value: BookingStatus.Confirmed,
    label: "Confirmed",
    icon: CheckCircledIcon,
  },
  {
    value: BookingStatus.Waiting_for_payment,
    label: "Waiting for Payment",
    icon: StopwatchIcon,
  },
  {
    value: BookingStatus.Cancelled,
    label: "Cancelled",
    icon: CrossCircledIcon,
  },
]

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const bookingSchema = z.object({
  id: z.string(),
  subtotal: z.number(),
  totalPrice: z.number(),
  status: z.nativeEnum(BookingStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
  startDate: z.date(),
  endDate: z.date(),
  spotId: z.string(),
  spot: z.object({
    id: z.string(),
    name: z.string(),
    durationType: z.string(),
    duration: z.number(),
    units: z.number(),
    workingHours: z.array(z.any())
  }),
  customer: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    dni: z.string(),
    note: z.string().optional()
  }),
})

export type Booking = z.infer<typeof bookingSchema>