"use client";

import * as React from "react";
import {
  AccessibilityIcon,
  CameraIcon,
  CarIcon,
  ChefHatIcon,
  MountainSnowIcon,
  WavesIcon,
  WifiIcon,
  WindIcon,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

type Amenity = {
  value: string;
  label: React.ReactNode;
};

const AMENITIES: Amenity[] = [
    {
        value: "mountain_view",
        label: (
          <>
            <MountainSnowIcon className="w-6 h-6 mr-2" />
            Mountain view
          </>
        ),
      },
      {
        value: "beach_access",
        label: (
          <>
            <WavesIcon className="w-6 h-6 mr-2" />
            Beach access
          </>
        ),
      },
      {
        value: "private_chef",
        label: (
          <>
            <ChefHatIcon className="w-6 h-6 mr-2" />
            Private chef
          </>
        ),
      },
      {
        value: "wifi",
        label: (
          <>
            <WifiIcon className="w-6 h-6 mr-2" />
            Wifi
          </>
        ),
      },
      {
        value: "parking",
        label: (
          <>
            <CarIcon className="w-6 h-6 mr-1" />
            Parking
          </>
        ),
      },
      {
        value: "security_cameras",
        label: (
          <>
            <CameraIcon className="w-6 h-6 mr-2" />
            Security cameras
          </>
        ),
      },
      {
        value: "wheelchair_accessible",
        label: (
          <>
            <AccessibilityIcon className="w-6 h-6 mr-2" />
            Wheelchair accessible
          </>
        ),
      },
      {
        value: "patio",
        label: (
          <>
            <WindIcon className="w-6 h-6 mr-2" />
            Patio
          </>
        ),
      },
      
];

export function MultiSelect() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Amenity[]>([AMENITIES[4]]);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback((amenity: Amenity) => {
    setSelected(prev => prev.filter(s => s.value !== amenity.value));
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) return;
      
      if ((e.key === "Delete" || e.key === "Backspace") && input.value === "") {
        setSelected(prev => prev.slice(0, -1));
      }
      
      if (e.key === "Escape") {
        input.blur();
      }
    },
    []
  );

  const selectables = AMENITIES.filter(amenity => !selected.includes(amenity));

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-2 flex-wrap">
          {selected.map(amenity => (
            <Badge key={amenity.value} variant="secondary">
              {amenity.label}
              <button
                className="flex justify-between items-center gap-8 ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(amenity);
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleUnselect(amenity)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
            
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select amenities..."
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 1 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((amenity) => {
                return (
                  <CommandItem
                    key={amenity.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue("");
                      setSelected((prev) => [...prev, amenity]);
                    }}
                    className="cursor-pointer"
                  >
                    {amenity.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
