import { TransactionStatus } from "@prisma/client"
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
    value: TransactionStatus.Pending,
    label: "Pending",
    icon: StopwatchIcon,
  },
  {
    value: TransactionStatus.Paid,
    label: "Paid",
    icon: CheckCircledIcon,
  },
  {
    value: TransactionStatus.Cancelled,
    label: "Canceled",
    icon: CrossCircledIcon,
  },
]