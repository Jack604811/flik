
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
import { useEffect, useState } from "react";

// Define the type for the Spot object based on your data structure
interface Spot {
  id: string;
  name: string;
}

interface DataTableSpotFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  spots: Spot[];
  reset?: boolean;
}

export function DataTableSpotFilter<TData, TValue>({ column, title }: DataTableSpotFilterProps<TData, TValue>) {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [spots, setSpots] = useState<Spot[]>([]); // Array of spots

  // Fetch the current workspace when the component mounts
  useEffect(() => {
    async function fetchWorkspace() {
      const currentWorkspace = await getCurrentWorkspace(); // Fetch the current workspace from the server
      if (currentWorkspace) {
        setWorkspaceId(currentWorkspace.id); // Set the workspaceId state
      }
    }

    fetchWorkspace();
  }, []);

  // Fetch spots based on the workspaceId
  const { data: spotsData, isSuccess } = useQuery({
    queryKey: ["spots", workspaceId], // The query key
    queryFn: () => getSpotsByWorkspace({ workspaceId: workspaceId as string }), // Fetch spots
    enabled: !!workspaceId, // Only run the query when workspaceId is available
  });

  // UseEffect to update spots when data is fetched successfully
  useEffect(() => {
    if (isSuccess && spotsData) {
      setSpots(spotsData);
    }
  }, [spotsData, isSuccess]);

  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 font-normal text-muted-foreground">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  spots
                    .filter((spot: { id: string; }) => selectedValues.has(spot.id))
                    .map((spot: Spot) => (
                      <Badge key={spot.id} variant="secondary" className="rounded-sm px-1 font-normal">
                        {spot.name}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No spots found.</CommandEmpty>
            <CommandGroup>
              {spots.map((spot: Spot) => {
                const isSelected = selectedValues.has(spot.id);
                return (
                  <CommandItem
                    key={spot.id}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(spot.id);
                      } else {
                        selectedValues.add(spot.id);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(filterValues.length ? filterValues : undefined);
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    <span>{spot.name}</span>
                    {facets?.get(spot.id) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(spot.id)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => column?.setFilterValue(undefined)} className="justify-center text-center">
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
