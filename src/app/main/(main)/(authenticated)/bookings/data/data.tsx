import { BookingStatus } from "@prisma/client"
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

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
]
