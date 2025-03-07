"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title?: string
  description?: string
  imageUrl?: string
  buttonLabel?: string
  onButtonClick?: () => void
}

export function EmptyState({
  title = "No Data Found",
  description = "We couldnt find what youre looking for.",
  imageUrl = "/placeholder.svg",
  buttonLabel,
  onButtonClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col min-h-full items-center justify-center text-center p-4">
      <Image 
        src={imageUrl} 
        alt="Empty State" 
        width={200} 
        height={200} 
        className="object-contain"
        priority={true}
      />
      <h1 className="text-2xl font-bold mt-4">{title}</h1>
      <p className="text-md text-muted-foreground mb-4">{description}</p>
      {buttonLabel && onButtonClick && (
        <Button variant="add" onClick={onButtonClick}>{buttonLabel}</Button>
      )}
    </div>
  )
}
