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
    value: TransactionStatus.Approved,
    label: "Approved",
    icon: StopwatchIcon,
  },
  {
    value: TransactionStatus.Pending,
    label: "Pending",
    icon: CheckCircledIcon,
  },
  {
    value: TransactionStatus.Declined,
    label: "Declined",
    icon: CrossCircledIcon,
  },
]