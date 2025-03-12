"use client";

import * as React from "react";
import {
  Check,
  ChevronsUpDown,
  Edit2,
  CirclePlus,
  MoreVertical,
  Circle,
} from "lucide-react";
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
  DialogClose,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Option = {
  value: string;
  label: string;
};

export function FancyBox({
  options,
  values,
  onCreate,
  onSelect,
  onDelete,
  onEdit,
  isEditable,
  label = "item",
  isDisabled,
}: {
  options: Option[];
  values: string[];
  onCreate?: (value: string) => void;
  onDelete?: (value: string) => void;
  onEdit?: (option: Option) => void;
  onSelect: (value: string) => void;
  isEditable?: boolean;
  isDisabled?: boolean;
  label?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [openCombobox, setOpenCombobox] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);
  const [editingItem, setEditingItem] = React.useState<string | null>(null);
  const [editingValue, setEditingValue] = React.useState<string>("");

  const onComboboxOpenChange = (value: boolean) => {
    setOpenCombobox(value);
  };

  const handleSelect = (value: string) => {
    handleCommandItemSelect();
    onSelect(value);
    setOpenCombobox(false);
    setEditingItem(null);
  };

  const handleCreate = (newValue: string) => {
    if (newValue.trim() === "") return;
    onCreate?.(newValue);
    setInputValue("");
    setOpenCombobox(true);
    onSelect(newValue);
    setEditingItem(null);
  };

  const handleDelete = (value: string) => {
    setSelectedItem(value);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      onDelete?.(selectedItem);
      setSelectedItem(null);
    }
    setOpenDialog(false);
  };

  const selectedItemLabel =
    options.find((option) => option.value === selectedItem)?.label || "";

  const handleRename = (value: string) => {
    setEditingItem(value);
    setEditingValue(
      options.find((option) => option.value === value)?.label || ""
    );
    setOpenCombobox(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleEditSubmit = () => {
    if (editingItem) {
      onEdit?.({ value: editingItem, label: editingValue });
      setEditingItem(null);
    }
  };

  const handleCommandItemSelect = () => {
    setEditingItem(null);
  };

  return (
    <div className="w-full">
      <Popover open={openCombobox} onOpenChange={onComboboxOpenChange}>
        <PopoverTrigger asChild disabled={isDisabled}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCombobox}
            className="w-full justify-between text-foreground"
          >
            {/* Wrap icon + text in a single <span> */}
            <span className="flex items-center justify-between w-full">
              <span className="truncate">
                {values.length === 0 && `Select ${label}`}
                {values.length === 1 &&
                  options.find((opt) => opt.value === values[0])?.label}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 hover:bg-inherit">
          <Command loop>
            <CommandInput
              ref={inputRef}
              placeholder={`Search or Create new ${label}...`}
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              {options.length === 0 && inputValue === "" ? (
                <div className="flex justify-center px-8 py-8 text-muted-foreground">
                  Write something to create your first {label}.
                </div>
              ) : (
                <>
                  <CommandGroup className="max-h-[145px] w-full overflow-auto">
                    {options.map((option) => {
                      const isActive = values.includes(option.value);
                      return (
                        // Instead of <Button asChild> (which can cause multi-children issues),
                        // we directly use <CommandItem> as the clickable element.
                        <CommandItem
                          key={option.value}
                          className={cn(
                            "relative h-10 cursor-pointer px-2",
                            // data-[highlighted] for Radix highlight
                            "data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800"
                          )}
                          onSelect={() => {
                            if (editingItem !== option.value) {
                              handleCommandItemSelect();
                              handleSelect(option.value);
                            }
                          }}
                        >
                          {/* Single parent to avoid multiple children */}
                          <div className="flex w-full items-center justify-between">
                            <div className="flex-1">
                              {editingItem === option.value ? (
                                <Input
                                  ref={inputRef}
                                  value={editingValue}
                                  onChange={(e) => setEditingValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleEditSubmit();
                                    }
                                  }}
                                  className={`border ${
                                    editingItem === option.value
                                      ? "border-2"
                                      : "border-transparent"
                                  } h-8`}
                                />
                              ) : (
                                <span>{option.label}</span>
                              )}
                            </div>

                            {/* If you want an "active" style, use data-[highlighted]: classes */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <span className="flex items-center gap-1">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                  </span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    handleRename(option.value);
                                  }}
                                >
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    handleDelete(option.value);
                                  }}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CommandItem>
                      );
                    })}
                    {onCreate && (
                      <CommandItemCreate
                        label={label}
                        onSelect={() => handleCreate(inputValue)}
                        {...{ inputValue, options }}
                      />
                    )}
                  </CommandGroup>
                  {editingItem && inputValue === "" && (
                    <>
                      <CommandSeparator />
                      <div className="p-2 text-xs text-muted-foreground">
                        Press Enter to save
                      </div>
                    </>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Dialog for Editing Labels */}
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
                  onDelete={() => onDelete && onDelete(option.value)}
                  onSubmit={(updatedOption) => {
                    onEdit && onEdit(updatedOption);
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

      {/* AlertDialog for Deletion Confirmation */}
      <AlertDialog
        open={!!selectedItem}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedItem(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete the label{" "}
              <Badge variant="outline">{selectedItemLabel}</Badge>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedItem(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Helper Component: Create a new item
const CommandItemCreate = ({
  inputValue,
  options,
  onSelect,
  label,
}: {
  inputValue: string;
  options: Option[];
  label: string;
  onSelect: () => void;
}) => {
  const hasNoOption = !options
    .map(({ label }) => label.toLowerCase())
    .includes(inputValue.toLowerCase());

  const render = inputValue !== "" && hasNoOption;
  if (!render) return null;

  return (
    <CommandItem
      key={inputValue}
      value={inputValue}
      className="flex cursor-pointer items-center text-sm text-muted-foreground data-[highlighted]:bg-green-200"
      onSelect={onSelect}
    >
      <CirclePlus className="mr-2 h-4 w-4 text-muted-foreground" />
      Create new {label} &quot;{inputValue}&quot;
    </CommandItem>
  );
};

// Helper Component: Dialog list item
const DialogListItem = ({
  value,
  label,
  onSubmit,
  onDelete,
}: Option & {
  onSubmit: (updatedOption: Option) => void;
  onDelete: () => void;
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [accordionValue, setAccordionValue] = React.useState<string>("");
  const [inputValue, setInputValue] = React.useState<string>(label);
  const disabled = label === inputValue;

  React.useEffect(() => {
    if (accordionValue !== "" && inputRef.current) {
      inputRef.current.focus();
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
          <Badge variant="outline">{label}</Badge>
          <div className="flex items-center gap-4">
            <AccordionTrigger>Edit</AccordionTrigger>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="xs">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You are about to delete the label{" "}
                    <Badge variant="outline">{label}</Badge>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <AccordionContent>
          <div className="flex items-end gap-4">
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
            <Button
              type="button"
              onClick={() => {
                onSubmit({ label: inputValue, value });
                setAccordionValue("");
              }}
              disabled={disabled}
              size="xs"
            >
              Save
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
