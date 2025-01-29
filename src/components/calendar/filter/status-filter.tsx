import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { BookingStatus } from "@prisma/client";
import { useEffect, useState } from "react";

interface StatusFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  selectedStatuses: string[];
  onStatusSelected: (selected: string[]) => void;
  bookings: { status: BookingStatus }[];
}

const statusOptions = Object.values(BookingStatus).map((status) => ({
  label: status.replace(/_/g, " "),
  value: status,
}));

export function StatusFilter<TData, TValue>({
  column,
  title,
  selectedStatuses,
  onStatusSelected,
  bookings,
}: StatusFilterProps<TData, TValue>) {
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const counts = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    setStatusCounts(counts);
  }, [bookings]);

  const handleSelect = (status: string) => {
    const newSelectedStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    onStatusSelected(newSelectedStatuses);
    column?.setFilterValue(newSelectedStatuses);
  };

  const clearFilters = () => {
    onStatusSelected([]);
    column?.setFilterValue(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full h-auto min-h-10 font-normal text-muted-foreground flex flex-wrap justify-start items-center gap-2"
        >
       
          {selectedStatuses.length > 0 && (
            <>

              <div className="flex flex-wrap gap-1 py-2">
                {statusOptions
                  .filter((option) => selectedStatuses.includes(option.value))
                  .map((option) => (
                    <Badge key={option.value} variant="secondary" className="rounded-sm px-1 font-normal">
                      {option.label}
                    </Badge>
                  ))}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="bg-background w-[216px] space-y-2 p-0">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No statuses found.</CommandEmpty>
            <CommandGroup>
              {statusOptions.map((option) => (
                <CommandItem key={option.value} onSelect={() => handleSelect(option.value)}>
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      selectedStatuses.includes(option.value)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    {selectedStatuses.includes(option.value) && <CheckIcon className="h-4 w-4" />}
                  </div>
                  <span>{option.label}</span>
                  <span className="ml-auto text-muted-foreground">{statusCounts[option.value] || 0}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            {selectedStatuses.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={clearFilters} className="justify-center text-center">
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
