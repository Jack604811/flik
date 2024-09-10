'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Trash2, UserPlus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

type Permission = 'Owner' | 'Admin' | 'Manager' | 'Editor' | 'Read-Only'

type Member = {
  email: string
  permission: Permission
  status: 'Active' | 'Invited'
  dateJoined: string
}

export default function Component() {
  const [email, setEmail] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [permission, setPermission] = useState<Permission>('Read-Only')
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsValidEmail(emailRegex.test(email))
  }, [email])

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setMembers([
        { email: 'rocketstudio.dev@gmail.com', permission: 'Owner', status: 'Active', dateJoined: 'Aug 25, 2024' },
        { email: 'yorgio1024@gmail.com', permission: 'Editor', status: 'Invited', dateJoined: '' }
      ])
      setIsLoading(false)
    }, 2000)
  }, [])

  const handleInvite = () => {
    if (isValidEmail && !members.some(member => member.email === email)) {
      // Add new member to the list
      setMembers([...members, { email, permission, status: 'Invited', dateJoined: '' }])
      
      // Simulate sending an invitation email
      console.log(`Sending invitation email to ${email} with ${permission} permissions`)
      
      // Reset form
      setEmail('')
      setPermission('Read-Only')
    }
  }

  const handleRemove = (email: string) => {
    setMembers(members.filter(member => member.email !== email))
  }

  const handlePermissionChange = (email: string, newPermission: Permission) => {
    setMembers(members.map(member => 
      member.email === email ? { ...member, permission: newPermission } : member
    ))
  }

  return (
    <div className="py-6 min-h-screen">
      <div className="max-w-6xl space-y-12">
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
          <div className="w-full xl:w-1/3">
            <h2 className="text-xl font-semibold mb-2">Invite a new member</h2>
            <p className="text-sm text-muted-foreground">Invite new members by email address</p>
          </div>
          <div className="w-full xl:w-2/3">
            <h3 className="text-sm font-medium mb-2">Email address</h3>
            <div className="flex gap-4">
              <Input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className=""
              />
              <Select value={permission} onValueChange={(value: Permission) => setPermission(value)}>
                <SelectTrigger className="w-[200px] bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Select permission" />
                </SelectTrigger>
                <SelectContent className="">
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Read-Only">Read-Only</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleInvite} 
                variant="default"
                className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isValidEmail}
              >
                <UserPlus className="mr-0 md:mr-2 h-4 w-4" /> <span className="hidden md:block">Invite member</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
          <div className="w-full xl:w-1/3">
            <h2 className="text-xl font-semibold mb-2">Team members</h2>
            <p className="text-sm text-muted-foreground">The members in your organization</p>
          </div>
          <div className="w-full xl:w-2/3">
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
                          <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      members.map((member, index) => (
                        <TableRow key={member.email} className="whitespace-nowrap border-b border-gray-200 dark:border-gray-700">
                          <TableCell className="font-medium">{member.email}</TableCell>
                          <TableCell>
                            {index === 0 ? (
                              <span className="text-gray-600 dark:text-gray-400">Owner</span>
                            ) : (
                              <Select 
                                value={member.permission} 
                                onValueChange={(value: Permission) => handlePermissionChange(member.email, value)}
                                disabled={member.permission === 'Owner'}
                              >
                                <SelectTrigger className="w-[140px] bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                                  <SelectValue placeholder="Select permission" />
                                </SelectTrigger>
                                <SelectContent className="">
                                  <SelectItem value="Admin">Admin</SelectItem>
                                  <SelectItem value="Manager">Manager</SelectItem>
                                  <SelectItem value="Editor">Editor</SelectItem>
                                  <SelectItem value="Read-Only">Read-Only</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>
                          <TableCell>
                            {member.status === 'Active' ? (
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
                            {member.status === 'Invited' ? 'Pending' : member.dateJoined}
                          </TableCell>
                          <TableCell>
                            {member.status === 'Invited' && (
                              <Button
                                onClick={() => handleRemove(member.email)}
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