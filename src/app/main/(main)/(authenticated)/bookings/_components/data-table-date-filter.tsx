import * as React from "react";
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";
import { DateRangePicker } from "rsuite";
import { addDays } from "date-fns";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { daDK } from "rsuite/esm/locales";

interface DataTableDateFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
}

const predefinedRanges = [
  {
    label: "Today",
    value: [new Date(), new Date()],
    placement: "left",
  },
  {
    label: "Yesterday",
    value: [addDays(new Date(), -1), addDays(new Date(), -1)],
    placement: "left",
  },
  {
    label: "Last 7 Days",
    value: [addDays(new Date(), -7), new Date()],
    placement: "left",
  },
  {
    label: "Last 30 Days",
    value: [addDays(new Date(), -30), new Date()],
    placement: "left",
  },
];

export function DataTableDateFilter<TData, TValue>({
  column,
  title,
}: DataTableDateFilterProps<TData, TValue>) {
  const selectedValue = column?.getFilterValue() as [Date, Date] | null;

  return (
    <>
      <DateRangePicker
        showHeader={false}
        showOneCalendar
        ranges={predefinedRanges as any}
        format="MM/dd/yyyy HH:mm"
        editable={false}
        placeholder={title}
        value={selectedValue??null}
        defaultValue={selectedValue??null}
        onChange={(v) =>column?.setFilterValue(v)}
      />
    </>
  );
}
