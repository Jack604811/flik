"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckIcon, Copy, CopyIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface APIKeyCopyButtonProps {
    apiKey: string;
}

const APIKeyCopyButton: React.FC<APIKeyCopyButtonProps> = ({ apiKey }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <TooltipProvider>
            <div className='flex'>
            <Input value={apiKey} readOnly className="w-full focus:ring-0 focus:outline-none hover:outline-none outline-none shadow-none" />
        <Tooltip open={copied}>
          <TooltipTrigger asChild>
            <Button type="button" onClick={handleCopy} variant="outline" className="focus:outline-none">
              {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
              <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copied</p>
          </TooltipContent>
        </Tooltip>
            </div>
            
      </TooltipProvider>
    );
};

export default APIKeyCopyButton;