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
import WorkspaceSwitcher from '@/components/main/workspace-switcher';
import ThemeToggle from '@/components/main/theme-toggle-profile';


async function Profile() {
  const currentUser = await getCurrentUser()
  const user = await getUser(currentUser!.id);
  return (
      <div className="flex-1 max-w-6xl pt-4 space-y-8 gap-8 p-6 md:p-8 md:pt-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
          
        </div>
        <section className="space-y-6">
          <PersonalInfoForm user={user as User} />
        </section>
        <Separator className="my-8 max-w-6xl" />
        <div className="flex flex-col xl:flex-row max-w-6xl py-6 gap-6 xl:gap-8">
          <div className="w-full xl:w-1/3">
            <h3 className="text-xl font-semibold">Account Settings</h3>
            <p className="text-sm text-muted-foreground">Manage your account preferences.</p>
          </div>
          <div className="w-full xl:w-2/3">
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="workspace">Workspace</Label>
                <WorkspaceSwitcher/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteName">Theme</Label>
                <ThemeToggle/>
              </div>
            </div>
          </div>
          {/* <form className="grid gap-4">
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
          </form> */}
        </div>
       
      </div>
  )
}

export default Profile;
