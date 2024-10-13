"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

const emojis = [
  { emoji: "😢", label: "Very Sad" },
  { emoji: "😕", label: "Sad" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "🙂", label: "Happy" },
  { emoji: "😍", label: "In Love" },
]

export default function EmojiFeedbackWidget() {
  const [rating, setRating] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [comment, setComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Feedback:", { rating, comment })
    setIsSubmitted(true)
    setTimeout(() => {
      setIsOpen(false)
      setTimeout(() => {
        setIsSubmitted(false)
        setRating(null)
        setComment("")  
      }, 300)
    }, 2000)
  }

  const getEmojiStyle = (index: number) => {
    const baseStyle = {
      fontSize: '2rem',
      transition: 'all 0.2s ease-in-out',
      filter: 'grayscale(100%)',
      willChange: 'filter',
    }

    if (rating === index) {
      return {
        ...baseStyle,
        filter: 'grayscale(0%)',
      }
    }

    return baseStyle
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-10 px-4 py-2">
          Feedback
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="w-full">
          {isSubmitted ? (
            <div className="text-center py-4">
              <h2 className="text-xl font-bold">Thank you!</h2>
              <p className="text-sm text-muted-foreground">
                We appreciate you taking the time to help us improve our product
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">How are you feeling?</h3>
                <p className="text-sm text-muted-foreground">
                  Your input is valuable in helping us better understand your needs and tailor our service accordingly.
                </p>
              </div>
              <div className="flex justify-between items-center">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setRating(index)}
                    className={`
                      flex flex-col items-center px-2 rounded-full transition-all
                      ${rating === index ? "bg-green-100 scale-125" : "hover:bg-gray-100"}
                    `}
                  >
                    <span 
                      style={getEmojiStyle(index)}
                      onMouseEnter={(e) => e.currentTarget.style.filter = 'grayscale(0%)'}
                      onMouseLeave={(e) => e.currentTarget.style.filter = rating === index ? 'grayscale(0%)' : 'grayscale(100%)'}
                    >
                      {emoji.emoji}
                    </span>
                  </button>
                ))}
              </div>
              {rating !== null && (
                <div className="text-center">
                  <span className="inline-block px-3 py-1 bg-gray-900 text-white text-sm rounded-full">
                    {emojis[rating].label}
                  </span>
                </div>
              )}
              <Textarea
                placeholder="Please share your thoughts..."
                className="min-h-[100px]"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={rating === null || comment.trim() === ""}
              >
                Submit Now
              </Button>
            </form>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
