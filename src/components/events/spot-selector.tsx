'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Check, ChevronDown, Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command';
import { getSpotsByWorkspace } from '@/server/actions/spot.action';

type Spot = {
  id: string;
  name: string;
  image: string;
  price: number;
  workingHours: any;
  duration: number;
  durationType: string;
  units: number;
};

type SpotSelectorProps = {
  workspaceId: string;
  onSelect: (spot: Spot) => void;
};

export default function SpotSelector({ workspaceId, onSelect }: SpotSelectorProps) {
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [spots, setSpots] = useState<Spot[]>([]);
  const [filteredSpots, setFilteredSpots] = useState<Spot[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchSpots() {
      try {
        const data = await getSpotsByWorkspace({ workspaceId });
        const formattedSpots = data.map((spot: any) => ({
          id: spot.id,
          name: spot.name,
          image: spot.images[0]?.url || '/placeholder.svg',
          price: spot.price || 0,
          workingHours: spot.workingHours,
          duration: spot.duration,
          durationType: spot.durationType,
          units: spot.units,
        }));
        setSpots(formattedSpots);
        setFilteredSpots(formattedSpots);
      } catch (error) {
        console.error('Failed to fetch spots:', error);
      }
    }

    fetchSpots();
  }, [workspaceId]);

  useEffect(() => {
    const filtered = spots.filter((spot) =>
      spot.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSpots(filtered);
  }, [searchTerm, spots]);

  const handleSelect = (spot: Spot) => {
    setSelectedSpot(spot);
    onSelect(spot);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-between px-2',
              selectedSpot ? 'h-16' : 'h-16'
            )}
          >
            {selectedSpot ? (
              <div className="flex items-center py-8">
                <Image
                  src={selectedSpot.image}
                  alt={selectedSpot.name}
                  width={50}
                  height={50}
                  className="mr-2 h-12 w-12 rounded-md object-cover"
                />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{selectedSpot.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ${selectedSpot.price.toFixed(0)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center h-40 py-8">
                <Image
                  src="/placeholder.svg"
                  alt="Placeholder"
                  width={60}
                  height={60}
                  className="mr-2 h-12 w-12 rounded-md object-cover"
                />
                <span>Select a spot</span>
              </div>
            )}
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <div className="items-center p-2">
              <div className="relative">
                <CommandInput
                  placeholder="Search spots..."
                  defaultValue={searchTerm}
                  onValueChange={setSearchTerm}
                  className=""
                />
              </div>
            </div>
            <CommandList>
              {filteredSpots.length > 0 ? (
                filteredSpots.map((spot) => (
                  <CommandItem
                    key={spot.id}
                    onSelect={() => handleSelect(spot)}
                    className={cn(
                      "flex items-center py-2 cursor-pointer", 
                      selectedSpot?.id === spot.id && "bg-neutral-100"
                    )}
                  >
                    <Image
                      src={spot.image}
                      alt={spot.name}
                      width={50}
                      height={50}
                      className="mr-3 h-12 w-12 rounded-md object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{spot.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ${spot.price.toFixed(0)}
                      </span>
                    </div>
                    {selectedSpot?.id === spot.id && (
                      <Check className="ml-auto h-4 w-4 opacity-50" />
                    )}
                  </CommandItem>
                ))
              ) : (
                <CommandEmpty>No spots found</CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
