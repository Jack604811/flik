'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Trash2, UserPlus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import useSWR from 'swr'
import { useMutation } from '@tanstack/react-query'
import { deleteTeamMember, getTeamMembers, sendInviteToWorkspace, updateTeamMember } from '@/server/actions/workspace.action'
import { TeamMemberStatus } from '@prisma/client'
import moment from 'moment'
import useConfirm from '@/hooks/use-confirm'
import { toast } from 'sonner'

type Permission = 'Owner' | 'Admin' | 'Editor' | 'Read-Only'

type Member = {
  email: string
  permission: Permission
  status: 'Active' | 'Invited'
  dateJoined: string
}

type Params = {
  workspaceId: string
  isOnboarding?: boolean
}

export default function TeamManagement({ workspaceId, isOnboarding = false }: Params) {
  const [DeleteConfirmDialog, deleteConfirm] = useConfirm('Are you sure?', 'This action is irrevesible.');
  const [UpdateConfirmDialog, updateConfirm] = useConfirm('Are you sure?', 'Are you sure you want to update the status of the team member?');

  const { data: teamMembers, isLoading, mutate } = useSWR(
    `workspace/${workspaceId}/team-members`, 
    () => getTeamMembers(workspaceId), 
    { fallbackData: [] }
  );

  const inviteMutation = useMutation({
    mutationKey: ['workspace/team-member', workspaceId],
    mutationFn: ({ email, permission }: { email: string, permission: Permission }) => sendInviteToWorkspace(workspaceId, email, permission),
    onMutate: () => {
      toast.loading("Sending invitation...");
    },
    onSuccess: () => {
      toast.dismiss(); 
      toast.success("Invitation sent successfully");
      mutate();
    },
    onError: (error) => {
      toast.dismiss(); 
      toast.error("Failed to send the invitation. Please try again.");
    },
  });
  
  const [email, setEmail] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [permission, setPermission] = useState<Permission>('Admin')
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsValidEmail(emailRegex.test(email))
  }, [email])

  const handleInvite = () => {
    // Check if email is valid and does not already exist among team members
    if (
      isValidEmail && 
      !teamMembers.some(member => member.user?.email === email || member.invitation?.email === email)
    ) {
      inviteMutation.mutate({ email, permission })
      // Reset form
      setEmail('')
      setPermission('Editor')
    }
  }

  const handleRemove = async (id: string) => {
    const confirm = await deleteConfirm()
    if (confirm) {
      const toastId = toast.loading("Removing team member...")
      try {
        await deleteTeamMember(id)
        mutate()
        toast.success("Team member removed successfully")
      } catch (error) {
        toast.error("Failed to remove team member. Please try again.")
      } finally {
        toast.dismiss(toastId)
      }
    }
  }

  const handlePermissionChange = async (id: string, role: Permission) => {
    const confirm = await updateConfirm()
    if (confirm) {
      const toastId = toast.loading("Updating team member role...")
      try {
        await updateTeamMember(id, { role })
        mutate()
        toast.success("Team member updated successfully")
      } catch (error) {
        toast.error("Failed to update team member role. Please try again.")
      } finally {
        toast.dismiss(toastId)
      }
    }
  }
  
  return (
    <div className="py-6">
      <DeleteConfirmDialog />
      <UpdateConfirmDialog />

      <div className="max-w-6xl space-y-12">
        {/* =========== FIRST SECTION: Invite a new member =========== */}
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
          {/* Hide the text if isOnboarding is true */}
          <div className={`w-full xl:w-1/3 ${isOnboarding ? 'hidden' : ''}`}>
            <h2 className="text-xl font-semibold mb-2">Invite a new member</h2>
            <p className="text-sm text-muted-foreground">Invite new members by email address</p>
          </div>

          {/* Remove xl:w-2/3 if isOnboarding is true */}
          <div className={`w-full ${isOnboarding ? '' : 'xl:w-2/3'}`}>
            {/* Hide "Email address" label if isOnboarding is true */}
            {!isOnboarding && (
              <h3 className="text-sm font-medium mb-2">Email address</h3>
            )}
            <div className="flex gap-4">
              <Input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Select 
                value={permission} 
                onValueChange={(value: Permission) => setPermission(value)}
              >
                <SelectTrigger className="w-[200px] bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Select permission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Editor</SelectItem>
                  <SelectItem value="Read-Only">Read-Only</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleInvite}
                variant="default"
                className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isValidEmail}
              >
                <UserPlus className="mr-0 md:mr-2 h-4 w-4" /> 
                <span className="hidden md:block">Invite member</span>
              </Button>
            </div>
          </div>
        </div>

        {/* =========== SECOND SECTION: Team members =========== */}
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
          {/* Hide the text if isOnboarding is true */}
          <div className={`w-full xl:w-1/3 ${isOnboarding ? 'hidden' : ''}`}>
            <h2 className="text-xl font-semibold mb-2">Team members</h2>
            <p className="text-sm text-muted-foreground">The members in your organization</p>
          </div>

          {/* Remove xl:w-2/3 if isOnboarding is true */}
          <div className={`w-full ${isOnboarding ? '' : 'xl:w-2/3'}`}>
            <div className="bg-transparent rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="whitespace-nowrap border-b border-gray-200 dark:border-gray-700">
                      <TableHead className="text-gray-900 dark:text-white">Member</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Permission</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Date joined</TableHead>
                      <TableHead className="text-gray-900 dark:text-white sr-only">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <TableRow key={index} className="border-b border-gray-200 dark:border-gray-700">
                          <TableCell>
                            <Skeleton className="h-4 w-[200px]" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-[100px]" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-[60px]" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-[80px]" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-8 w-8 rounded-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      teamMembers.map((member, index) => (
                        <TableRow 
                          key={member.id} 
                          className="whitespace-nowrap border-b border-gray-200 dark:border-gray-700"
                        >
                          <TableCell className="font-medium">
                            {member.user?.name ? (
                              <div className="flex flex-col">
                                <span className="font-medium">{member.user.name}</span>
                                <span className="text-muted-foreground">{member.user.email}</span>
                              </div>
                            ) : (
                              member.invitation?.email
                            )}
                          </TableCell>
                          <TableCell>
                            {member.role === "OWNER" ? (
                              <span className="text-gray-600 dark:text-gray-400">Owner</span>
                            ) : (
                              <Select
                                value={member.role}
                                onValueChange={(value: Permission) => handlePermissionChange(member.id, value)}
                                disabled={member.role === 'Owner'}
                              >
                                <SelectTrigger className="w-[140px] bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                                  <SelectValue placeholder="Select permission" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Admin">Admin</SelectItem>
                                  <SelectItem value="Manager">Editor</SelectItem>
                                  <SelectItem value="Read-Only">Read-Only</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>
                          <TableCell>
                            {member.status === TeamMemberStatus.Active ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                                ● Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                                <Mail className="mr-1 h-3 w-3" /> Invited
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {member.status === TeamMemberStatus.Pending
                              ? 'Pending'
                              : moment(member.createdAt).format("MMM D, YYYY")}
                          </TableCell>
                          <TableCell>
                            {member.role !== "OWNER" && (
                              <Button
                                onClick={() => handleRemove(member.id)}
                                variant="ghost"
                                size="icon"
                                className="hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
