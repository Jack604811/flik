import React from 'react';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { ChevronLeftIcon, CirclePlusIcon, Copy, UploadIcon } from 'lucide-react';
import * as LR from "@uploadcare/blocks";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ImageUpload from '@/components/image-upload';
import Link from 'next/link';

LR.registerBlocks(LR);

function SpotDetail() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-16 mb-24">
      <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
        <Link href="/spots">
          <Button className="h-7 w-7" size="icon" variant="outline">
            <ChevronLeftIcon className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          </Link>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            New Spot
          </h1>
          <Badge className="ml-auto sm:ml-0" variant="outline">
            Draft
          </Badge>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button size="sm" variant="outline">
              Discard
            </Button>
            <Button size="sm">Save changes</Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <CardTitle>Details</CardTitle>
                <CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input className="w-full" id="name" defaultValue="" placeholder="Add a name" type="text" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      className="min-h-32"
                      defaultValue=""
                      id="description"
                      placeholder="Add a description"
                    />
                  </div>
                  
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Advanced Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <div className="grid gap-3">
                    <Label htmlFor="duration">Modules</Label>
                    <Input className="w-full" defaultValue="1" id="duration" type="number" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="min-people">Minimum People</Label>
                    <Input className="w-full" defaultValue="1" id="min-people" type="number" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="allow-additional">Allow Additional People</Label>
                    <Toggle aria-label="Allow Additional People" id="allow-additional" />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="price-additional">Price Per Additional Person</Label>
                    <Input
                      className="w-full"
                      defaultValue="20"
                      id="price-additional"
                      prefix="$"
                      step="0.01"
                      type="number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-07-chunk-1">
              <CardHeader>
                <CardTitle>Working Hours</CardTitle>
                <CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Day</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold">Monday</TableCell>
                      <TableCell>
                        <Label className="sr-only" htmlFor="open-monday">
                          Check In
                        </Label>
                        <Input defaultValue="09:00" id="open-monday" type="time" />
                      </TableCell>
                      <TableCell>
                        <Label className="sr-only" htmlFor="close-monday">
                          Check Out
                        </Label>
                        <Input defaultValue="17:00" id="close-monday" type="time" />
                      </TableCell>
                      <TableCell>
                        <Label className="sr-only" htmlFor="price-monday">
                          Price
                        </Label>
                        <Input defaultValue="100" id="price-monday" prefix="$" step="0.01" type="number" />
                      </TableCell>
                    </TableRow>
                    {/* Other days */}
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Button className="gap-1 w-full" size="sm" variant="ghost">
                          <CirclePlusIcon className="h-3.5 w-3.5" />
                          Add Working Hours
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-3">
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="status">Status</Label>
                    <Select>
                      <SelectTrigger aria-label="Select status" id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-07-chunk-3">
              <CardHeader>
                <CardTitle>Path Url</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="status">Assign a path to share</Label>
                    <Input className="w-full" id="name" defaultValue="" placeholder="/my-spot" type="text" />
                    <div className="flex flex-row items-center gap-2">
                       <Link href="#" className="underline">website.com/my-spot</Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <img
                    alt="Image"
                    className="aspect-square w-full rounded-md object-cover"
                    height="300"
                    src="/placeholder.svg"
                    width="300"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <button>
                      <img
                        alt="Image"
                        className="aspect-square w-full rounded-md object-cover"
                        height="84"
                        src="/placeholder.svg"
                        width="84"
                      />
                    </button>
                    <button>
                      <img
                        alt="Image"
                        className="aspect-square w-full rounded-md object-cover"
                        height="84"
                        src="/placeholder.svg"
                        width="84"
                      />
                    </button>
                    <Dialog>
                      <DialogTrigger asChild>
                      <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                                  <UploadIcon className="h-4 w-4 text-muted-foreground" />
                                  <span className="sr-only">Upload</span>
                                </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle className="text-center">
                            Upload your files
                          </DialogTitle>
                          <DialogDescription className="text-center">
                            The only file upload you will ever need
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <ImageUpload />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-07-chunk-5">
              <CardHeader>
                <CardTitle>Delete</CardTitle>
                <CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex"/>
                <Button className="w-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600" size="sm" variant="secondary">
                  Delete
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SpotDetail;
