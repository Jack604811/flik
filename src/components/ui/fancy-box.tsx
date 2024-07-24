"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Edit2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DialogClose } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// FIXME: https://twitter.com/lemcii/status/1659649371162419202?s=46&t=gqNnMIjMWXiG2Rbrr5gT6g
// Removing states would help maybe?

type Option = {
  value: string;
  label: string;
};
const badgeStyle = (color: string) => ({
  borderColor: `${color}20`,
  backgroundColor: `${color}30`,
  color,
});

export function FancyBox({
  options,
  values,
  onCreate,
  onSelect,
  isEditable,
  label = "item",
  isDisabled
}: {
  options: Option[];
  values: string[];
  onCreate?: (value: string) => void;
  onSelect: (value: string) => void;
  isEditable?: boolean;
  isDisabled?: boolean;
  label?: string
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [openCombobox, setOpenCombobox] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>("");

  const updateFramework = (
    framework: Option["value"],
    newFramework: Option
  ) => {
    // setoptions((prev) =>
    //   prev.map((f) => (f.value === framework.value ? newFramework : f))
    // );
    // setSelectedValues((prev) =>
    //   prev.map((f) => (f.value === framework.value ? newFramework : f))
    // );
  };

  const deleteFramework = (framework: Option["value"]) => {
    // setoptions((prev) => prev.filter((f) => f.value !== framework.value));
    // setSelectedValues((prev) =>
    //   prev.filter((f) => f.value !== framework.value)
    // );
  };

  const onComboboxOpenChange = (value: boolean) => {
    inputRef.current?.blur(); // HACK: otherwise, would scroll automatically to the bottom of page
    setOpenCombobox(value);
  };

  return (
    <div className="max-w-full">
      <Popover open={openCombobox} onOpenChange={onComboboxOpenChange}>
        <PopoverTrigger asChild disabled={isDisabled}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCombobox}
            className="w-full justify-between text-foreground"
          >
            <span className="truncate">
              {values.length === 0 && `Select ${label}`}
              {values.length === 1 && options.find(opt => opt.value === values[0])?.label }
              {/* {selectedValues.length === 2 &&
                selectedValues.map(({ label }) => label).join(", ")}
              {selectedValues.length > 2 &&
                `${selectedValues.length} labels selected`} */}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="min-w-[300px] p-0">
          <Command loop>
            <CommandInput
              ref={inputRef}
              placeholder={`Search or Create new ${label}...`}
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandGroup className="max-h-[145px] overflow-auto">
                {options.map((option) => {
                  const isActive = values.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() =>{
                         onSelect(option.value);
                         inputRef?.current?.focus();
                    }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isActive ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex-1">{option.label}</div>
                    </CommandItem>
                  );
                })}
                {onCreate && (
                  <CommandItemCreate
                    label={label}
                    onSelect={() => onCreate(inputValue)}
                    {...{ inputValue, options }}
                  />
                )}
              </CommandGroup>
              <CommandSeparator alwaysRender />
              {isEditable && (
                <CommandGroup>
                <CommandItem
                  value={`:${inputValue}:`} // HACK: that way, the edit button will always be shown
                  className="text-xs text-muted-foreground"
                  onSelect={() => setOpenDialog(true)}
                >
                  <div className={cn("mr-2 h-4 w-4")} />
                  <Edit2 className="mr-2 h-2.5 w-2.5" />
                  Edit Labels
                </CommandItem>
              </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          if (!open) {
            setOpenCombobox(true);
          }
          setOpenDialog(open);
        }}
      >
        <DialogContent className="flex max-h-[90vh] flex-col">
          <DialogHeader>
            <DialogTitle>Edit Labels</DialogTitle>
            <DialogDescription>
              Change the label names or delete the labels. Create a label
              through the combobox though.
            </DialogDescription>
          </DialogHeader>
          <div className="-mx-6 flex-1 overflow-scroll px-6 py-2">
            {options.map((option) => {
              return (
                <DialogListItem
                  key={option.value}
                  onDelete={() => deleteFramework(option.value)}
                  onSubmit={(e) => {
                    e.preventDefault();
                    const target = e.target as typeof e.target &
                      Record<"name" | "color", { value: string }>;
                    const newFramework = {
                      value: target.name.value.toLowerCase(),
                      label: target.name.value,
                    };
                    updateFramework(option.value, newFramework);
                  }}
                  {...option}
                />
              );
            })}
          </div>
          <DialogFooter className="bg-opacity-40">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* <div className="relative -mb-24 mt-3 h-24 overflow-y-auto">
        {values.map((value) => (
          <Badge key={value} variant="outline" className="mb-2 mr-2">
            {options.find((v) => v.value === value)?.label}
          </Badge>
        ))}
      </div> */}
    </div>
  );
}

const CommandItemCreate = ({
  inputValue,
  options,
  onSelect,
  label
}: {
  inputValue: string;
  options: Option[];
  label:string
  onSelect: () => void;
}) => {
  const hasNoOption = !options
    .map(({ label }) => label.toLowerCase())
    .includes(`${inputValue.toLowerCase()}`);

  const render = inputValue !== "" && hasNoOption;

  if (!render) return null;

  // BUG: whenever a space is appended, the Create-Button will not be shown.
  return (
    <CommandItem
      key={`${inputValue}`}
      value={`${inputValue}`}
      className="text-xs text-muted-foreground"
      onSelect={onSelect}
    >
      <div className={cn("mr-2 h-4 w-4")} />
      Create new {label} &quot;{inputValue}&quot;
    </CommandItem>
  );
};

const DialogListItem = ({
  value,
  label,
  onSubmit,
  onDelete,
}: Option & {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [accordionValue, setAccordionValue] = React.useState<string>("");
  const [inputValue, setInputValue] = React.useState<string>(label);
  const disabled = label === inputValue;

  React.useEffect(() => {
    if (accordionValue !== "") {
      inputRef.current?.focus();
    }
  }, [accordionValue]);

  return (
    <Accordion
      key={value}
      type="single"
      collapsible
      value={accordionValue}
      onValueChange={setAccordionValue}
    >
      <AccordionItem value={value}>
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline">{label}</Badge>
          </div>
          <div className="flex items-center gap-4">
            <AccordionTrigger>Edit</AccordionTrigger>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                {/* REMINDER: size="xs" */}
                <Button variant="destructive" size="xs">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You are about to delete the label{" "}
                    <Badge variant="outline">{label}</Badge> .
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <AccordionContent>
          <form
            className="flex items-end gap-4"
            onSubmit={(e) => {
              onSubmit(e);
              setAccordionValue("");
            }}
          >
            <div className="grid w-full gap-3">
              <Label htmlFor="name">Label name</Label>
              <Input
                ref={inputRef}
                id="name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="h-8"
              />
            </div>
            {/* REMINDER: size="xs" */}
            <Button type="submit" disabled={disabled} size="xs">
              Save
            </Button>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
