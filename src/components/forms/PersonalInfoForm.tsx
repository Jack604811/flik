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
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your basic profile details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
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
              </div>
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
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-fit" type="submit">
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export default PersonalInfoForm;
