"use client";
import React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { Option } from "@/types";

type Props = {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string
};

export default function MultiSelect({ options, onChange, selected=[], placeholder }: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback((option: Option) => {
    onChange(selected.filter((value) => option.value !== value));
  }, [selected, onChange]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) return;

      if ((e.key === "Delete" || e.key === "Backspace") && input.value === "") {
        onChange(selected.slice(0,selected.length - 1));
      }

      if (e.key === "Escape") {
        input.blur();
      }
    },
    [selected, onChange]
  );

  const selectables = options.filter(
    (option) => !selected.includes(option.value)
  );

  return (
    <>
      <Command
        onKeyDown={handleKeyDown}
        className="overflow-visible bg-transparent"
      >
        <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <div className="flex gap-2 flex-wrap">
            {selected.map((value, key) => {
              const option = options.find((option) => option.value === value)!;
              return (
                <Badge key={key} variant="secondary">
                  {option?.label}
                  <button
                    type="button"
                    className="flex justify-between items-center gap-8 ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(option);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(option)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              );
            })}
            <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder ?? "Select option..."}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
          </div>
        </div>
        {open && selectables.length > 0 ? (
          <div className="relative mt-2">
            <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandEmpty>Option not found...</CommandEmpty>
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        onChange([...selected, option.value]);
                      }}
                      className="cursor-pointer"
                    >
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          </div>
        ) : null}
      </Command>
    </>
  );
}
