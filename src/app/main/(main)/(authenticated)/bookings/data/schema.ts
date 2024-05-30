import { BookingStatus } from "@prisma/client"
import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const bookingSchema = z.object({
  id: z.string(),
  totalPrice: z.number(),
  status: z.nativeEnum(BookingStatus),
  createdAt: z.date(),
  startDate: z.date(),
  endDate: z.date(),
  spot: z.object({
    id: z.string(),
    name: z.string()
  }),
  guest: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
  })
})

export type Booking = z.infer<typeof bookingSchema>
