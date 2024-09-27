"use client";
import { User } from "@prisma/client";
import React from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { updateUser } from "@/server/actions/user.action";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const formSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Enter valid email" }),
});

function PersonalInfoForm({user}: {user: User}) {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { email: user.email!, name: user.name! },
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const promise = updateUser(user.id, values);
    toast.promise(promise, {
      loading: "Loading...",
      success: "Personal Information Updated Successfully",
      error: "Error updating personal information",
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col xl:flex-row max-w-6xl py-2 gap-6 xl:gap-8">
          <div className="w-full xl:w-1/3">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <p className="text-sm text-muted-foreground">Update your basic profile details.</p>
          </div>
          
            <div className="w-full xl:w-2/3">
              <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Fullname" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Add a valid email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                  <div className="flex justify-end">
                    <Button type="submit">
                      Save Changes
                    </Button>
                  </div>
              </div>
            </div>
         
         
          
          
        </div>
      </form>
    </Form>
  );
}

export default PersonalInfoForm;
