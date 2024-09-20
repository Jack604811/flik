import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, RotateCw, Lock } from "lucide-react"
import TypingAnimation from './typing-animation'

export default function SleekBrowserFrame() {
  const [url, setUrl] = useState('yourcustomdomain.com')

  return (
    <div className="w-full max-w-xl mx-auto overflow-hidden rounded-lg border">
      {/* Browser Chrome */}
      <div className="p-2 flex items-center space-x-2 border-b">
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Forward">
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Reload">
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-grow flex h-8 items-center bg-gray-100 dark:bg-neutral-900 rounded-lg px-3 py-1">
          <Lock className="h-4 w-4 text-green-500 mr-2" />
          <TypingAnimation
            className="text-sm font-medium text-black dark:text-white"
            duration={200}
            loop={true}
            text={url}
            />
        </div>
      </div>

      {/* Browser Content */}
      <div className="p-6 h-[200px] overflow-auto">
       
        
      </div>
    </div>
  )
}