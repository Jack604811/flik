"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CopyIcon, CheckIcon, ExternalLinkIcon } from "lucide-react"
import Link from "next/link"

export default function Component() {
  const [isTestMode, setIsTestMode] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const webhookUrl = "api/webhooks/connected/wompi"

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">API Keys Setup</h2>
      <p className="text-muted-foreground mb-6">Configure your test and live API keys</p>
      
      <div className="flex items-center space-x-2 mb-6">
        <Switch
          id="test-mode"
          checked={isTestMode}
          onCheckedChange={setIsTestMode}
        />
        <Label htmlFor="test-mode" className="text-sm font-medium">
          Test Mode {isTestMode ? "Enabled" : "Disabled"}
        </Label>
      </div>
      
      <div className="grid gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{isTestMode ? "Test" : "Live"} Environment</h3>
          <div>
            <Label htmlFor="public-key" className="text-sm font-medium mb-2 block">
              Public Key
            </Label>
            <Input 
              id="public-key" 
              placeholder={`Enter your ${isTestMode ? "test" : "live"} public key`} 
            />
          </div>
          <div>
            <Label htmlFor="private-key" className="text-sm font-medium mb-2 block">
              Private Key
            </Label>
            <Input 
              id="private-key" 
              placeholder={`Enter your ${isTestMode ? "test" : "live"} private key`} 
              type="password" 
            />
          </div>
        </div>
      </div>
      
      <div className="mt-8 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Webhook URL</h3>
          <div className="flex items-center space-x-2">
            <Input value={webhookUrl} readOnly disabled />
            <TooltipProvider>
              <Tooltip open={isCopied}>
                <TooltipTrigger asChild>
                  <Button onClick={copyToClipboard} variant="outline">
                    {isCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                    <span className="sr-only">{isCopied ? "Copied" : "Copy"}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copied!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Please paste this URL into your Wompi account{" "}
            <Link 
              href="https://comercios.wompi.co/developers" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center"
            >
              here
              <ExternalLinkIcon className="h-3 w-3 ml-1" />
            </Link>
          </p>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold mb-2">API Key Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Please add these API keys to your application's configuration to enable {isTestMode ? "test" : "live"} environment.
          Keep your API keys secure and never share them publicly. The private keys are sensitive information
          and should be handled with extra care.
        </p>
        <Link 
          href="https://docs.wompi.co/docs/colombia/ambientes-y-llaves/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline mt-2 inline-flex items-center"
        >
          Learn more about API key configuration
          <ExternalLinkIcon className="h-3 w-3 ml-1" />
        </Link>
      </div>
    </div>
  )
}