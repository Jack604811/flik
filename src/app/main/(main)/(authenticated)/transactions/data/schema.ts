import { BookingStatus, TransactionStatus } from "@prisma/client"
import { z } from "zod"
import { bookingSchema } from "../../bookings/data/schema"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const schema = z.object({
  id: z.string(),
  amount: z.number(),
  paymentDate: z.date(),
  paymentType: z.string(),
  status: z.nativeEnum(TransactionStatus),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  booking: bookingSchema,
})

export type Schema = z.infer<typeof schema>
