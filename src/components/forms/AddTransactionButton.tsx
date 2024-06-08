import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  amount: z.number(),
  date: z.date(),
  description: z.string(),
});
function AddTransactionButton({
  children,
  placeholder,
}: {
  children: React.ReactNode;
  placeholder?: string;
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const [open, setOpen] = useState(false);

  const onSubmit = () => {};

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add {placeholder ?? "Manual Payment"}</DrawerTitle>
          <DrawerDescription>
            Enter the details of the {placeholder ?? "manual payment"} you want
            to add.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-4 py-4 p-4">
          <div className="grid grid-cols-1 items-center gap-4">
            <Label className="text-left" htmlFor="amount">
              Amount
            </Label>
            <Input className="col-span-1" id="amount" type="number" />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <Label className="text-left" htmlFor="date">
              Date
            </Label>
            <Input className="col-span-1" type="date" />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <Label className="text-left" htmlFor="description">
              Description
            </Label>
            <Textarea className="col-span-1" id="description" />
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={() => form.handleSubmit(onSubmit)} type="submit">
            Create Payment
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default AddTransactionButton;
