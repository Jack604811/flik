import Image from 'next/image';
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlugIcon } from 'lucide-react';


interface IntegrationCardProps {
  imageSrc: string;
  title: string;
  description: string;
  connection: string;
}

export default function Page() {
    return (
        <div className="flex h-screen w-full items-start justify-start p-10">
          <div className="group justify-center gap-4 group group-row">
          <div className="w-[360px]">
        <Card>
          <CardContent className="flex flex-col p-5 gap-2">
            <div className="flex w-full justify-between items-start gap-x-20">
              <div className="">
                <div className="w-10 h-10 relative rounded-md overflow-hidden">
                  <Image
                    sizes="100vw"
                    src="/stripe-logo.png"
                    alt="Logo"
                    fill
                  />
                </div>
                <h2 className="font-bold capitalize text-xl">Stripe</h2>
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <PlugIcon className="w-5 h-5" />
                <span>Connect</span>
              </Button>
            </div>
            <CardDescription className="text-start">Stripe is the fastest and easiest way to integrate payments and financial services into your software platform or marketplace.</CardDescription>
          </CardContent>
        </Card>
        
           </div>
          </div>
        </div>
      );
}
