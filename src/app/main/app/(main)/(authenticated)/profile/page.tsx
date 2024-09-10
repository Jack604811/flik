import React from 'react';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { getUser } from '@/server/actions/user.action';
import { getCurrentUser } from '@/server/auth';
import PersonalInfoForm from '@/components/forms/PersonalInfoForm';
import { User } from '@prisma/client';


async function Profile() {
  const currentUser = await getCurrentUser()
  const user = await getUser(currentUser!.id);
  return (
      <main className="flex-1 p-6">
        <section className="space-y-6">
          <PersonalInfoForm user={user as User} />
        </section>
        <Separator className="my-8" />
        <section className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Account Settings</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account preferences.</p>
          </div>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Old Password</Label>
              <Input id="password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input id="password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="language">Language</Label>
              <Select defaultValue="en" >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-fit" type="submit">
              Update Account
            </Button>
          </form>
        </section>
       
      </main>
  )
}

export default Profile;
