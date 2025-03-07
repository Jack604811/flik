import { useState } from "react";
import { Filter } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SpotFilter } from "@/components/calendar/filter/spot-filter";
import { StatusFilter } from "@/components/calendar/filter/status-filter";

export function FilterPopover({
  bookings,
  onSpotSelected,
  onStatusSelected,
}: {
  bookings: any;
  onSpotSelected: (selected: string[]) => void;
  onStatusSelected: (selected: string[]) => void;
}) {
  const [selectedSpots, setSelectedSpots] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const hasFilters = selectedSpots.length > 0 || selectedStatuses.length > 0;

  const clearAllFilters = () => {
    setSelectedSpots([]);
    setSelectedStatuses([]);
    onSpotSelected([]);
    onStatusSelected([]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-10 font-normal flex items-center gap-2 bg-muted/50">
          <Filter className="h-4 w-4" /> <span className="hidden md:block">Filter</span>
          {hasFilters && <span className="text-xs px-2 py-1 bg-primary/10 rounded-md">{selectedSpots.length + selectedStatuses.length}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="bg-background w-[250px] p-4 space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Filters</h3>
        <Separator />
        <div className="space-y-2">
        <h3 className="text-xs font-medium text-primary">Spots</h3>
        <SpotFilter
          title="Spot"
          bookings={bookings}
          selectedSpots={selectedSpots}
          onSpotSelected={(selected) => {
            setSelectedSpots(selected);
            onSpotSelected(selected);
          }}
        />
        </div>
        <div className="space-y-2">
        <h3 className="text-xs font-medium text-primary">Status</h3>
        <StatusFilter
          title="Status"
          bookings={bookings}
          selectedStatuses={selectedStatuses}
          onStatusSelected={(selected) => {
            setSelectedStatuses(selected);
            onStatusSelected(selected);
          }}
        />
        </div>
        {hasFilters && (
          <>
            <Separator />
            <Button
              variant="destructive"
              size="sm"
              className="w-full flex items-center justify-center gap-2"
              onClick={clearAllFilters}
            >
     
              Clear All Filters
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
