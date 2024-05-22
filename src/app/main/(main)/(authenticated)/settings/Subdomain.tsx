"use client";
import React, { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateSubdomain } from "@/server/actions/user.action";

function Subdomain({ subdomain, userId }: { subdomain: string, userId: string }) {
  const onSave = async (formData: FormData) => {
    const subdomain = formData.get("subdomain") as string;
    if(!subdomain.length) return toast.error("Enter valid subdomain");
    const promise =  updateSubdomain(userId, subdomain);
    toast.promise(promise, {
        loading: "Saving...",
        success: "Subdomain Updated Successfully!",
        error: "There was an error updating subdomain!"
    })
  };
  return (
    <Card className="w-full px-5">
      <form action={onSave}>
        <CardHeader>
          <h2 className="text-2xl">Subdomain</h2>
          <CardDescription>The subdomain for your spots site</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex columns-2 items-center justify-center">
            <Input
              placeholder="subdomain"
              name="subdomain"
              className="rounded-e-none"
              maxLength={32}
              defaultValue={subdomain!}
            />
            <Input
              placeholder="localhost:3000"
              disabled
              readOnly
              value={process.env.NEXT_PUBLIC_ROOT_DOMAIN}
              className="rounded-s-none w-4/6"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-xs text-muted-foreground font-bold">
            Please use 32 characters maximum.
          </p>
          <Button>Save Changes</Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default Subdomain;
