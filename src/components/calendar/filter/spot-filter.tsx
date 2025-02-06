import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
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
import { getSpotsByWorkspace } from "@/server/actions/spot.action";
import { getCurrentWorkspace } from "@/server/actions/user.action";
import { useEffect, useMemo } from "react";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Spot {
  id: string;
  name: string;
}

interface SpotFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  selectedSpots: string[];
  onSpotSelected: (selected: string[]) => void;
  bookings: { spotId: string }[];
}

export function SpotFilter<TData, TValue>({
  column,
  title,
  selectedSpots,
  onSpotSelected,
  bookings,
}: SpotFilterProps<TData, TValue>) {
  const [workspaceId, setWorkspaceId] = React.useState<string | null>(null);
  const { data: spotsData, isSuccess } = useQuery({
    queryKey: ["spots", workspaceId],
    queryFn: () => getSpotsByWorkspace({ workspaceId: workspaceId as string }),
    enabled: !!workspaceId,
  });

  useEffect(() => {
    async function fetchWorkspace() {
      const currentWorkspace = await getCurrentWorkspace();
      if (currentWorkspace) {
        setWorkspaceId(currentWorkspace.id);
      }
    }
    fetchWorkspace();
  }, []);

  const spots = spotsData || [];

  const spotCounts = useMemo(() => {
    return bookings.reduce((acc, booking) => {
      acc[booking.spotId] = (acc[booking.spotId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [bookings]);

  const handleSelect = (spotId: string) => {
    const newSelectedSpots = selectedSpots.includes(spotId)
      ? selectedSpots.filter((id) => id !== spotId)
      : [...selectedSpots, spotId];
    onSpotSelected(newSelectedSpots);
    column?.setFilterValue(newSelectedSpots);
  };

  const clearFilters = () => {
    onSpotSelected([]);
    column?.setFilterValue(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full h-auto min-h-10 font-normal text-muted-foreground flex flex-wrap justify-start items-center gap-2">
          {selectedSpots.length > 0 && (
            <>
              <div className="flex flex-wrap gap-1 py-2 overflow-hidden">
                {spots
                  .filter((spot) => selectedSpots.includes(spot.id))
                  .map((spot) => (
                    <Badge key={spot.id} variant="secondary" className="rounded-sm px-1 font-normal">
                      {spot.name}
                    </Badge>
                  ))}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" className="bg-background w-[216px] space-y-2 p-0">
        <Command>
          <CommandInput placeholder={title} />
          <div className="max-h-64">
            <CommandList>
              <CommandEmpty>No spots found.</CommandEmpty>
              <ScrollArea>
              <CommandGroup>
                {spots.map((spot) => (
                  <CommandItem key={spot.id} onSelect={() => handleSelect(spot.id)}>
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selectedSpots.includes(spot.id)
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      {selectedSpots.includes(spot.id) && <CheckIcon className="h-4 w-4" />}
                    </div>
                    <span>{spot.name}</span>
                    <span className="ml-auto text-muted-foreground">{spotCounts[spot.id] || 0}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              </ScrollArea>
              {selectedSpots.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem onSelect={clearFilters} className="justify-center text-center cursor-pointer">
                      Clear filters
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
