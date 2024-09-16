import { TransactionStatus } from "@prisma/client"
import { z } from "zod"
import { bookingSchema } from "@/schemas/booking.schema"
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"

export const statuses = [
  {
    value: TransactionStatus.Approved,
    label: "Approved",
    icon: CheckCircledIcon,
  },
  {
    value: TransactionStatus.Pending,
    label: "Pending",
    icon: StopwatchIcon,
  },
  {
    value: TransactionStatus.Declined,
    label: "Declined",
    icon: CrossCircledIcon,
  },
]


// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const schema = z.object({
  id: z.string(),
  amount: z.number(),
  paymentDate: z.date(),
  paymentMethod: z.string(),
  status: z.nativeEnum(TransactionStatus),
  description: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  booking: bookingSchema,
})

export type Schema = z.infer<typeof schema>
