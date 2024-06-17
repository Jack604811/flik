import Image from 'next/image';
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { PlugIcon, Repeat } from 'lucide-react';

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
                    <div>
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
                    <Credenza>
                      <CredenzaTrigger asChild>
                        <Button variant="outline" className="flex items-center space-x-2">
                          <span>Connect</span>
                        </Button>
                      </CredenzaTrigger>
                      <CredenzaContent>
                        <CredenzaHeader>
                          <div className="flex items-center space-x-2 my-4 gap-0">
                            <div className="flex flex-row w-full justify-center items-center gap-2">
                          <img src="placeholder.svg" alt="App icon" className="w-16 h-16 rounded-md"/>
                          <Repeat className="h-4 w-4 text-muted-foreground" />
                          <img src="/stripe-logo.png" alt="Stripe icon" className="w-16 h-16 rounded-md" />
                          </div>
                          </div>
                          <CredenzaTitle>
                            <h3 className="text-lg font-semibold">Connect Stripe Account</h3>
                          </CredenzaTitle>
                          <CredenzaDescription>
                            <p className="text-sm text-muted-foreground">
                              The world’s most successful platforms and marketplaces including Shopify and DoorDash, use Stripe Connect.
                            </p>
                          </CredenzaDescription>
                        </CredenzaHeader>
                        <CredenzaBody className="my-2">
                          <h4 className="font-semibold py-2">Stripe would like to access</h4>
                          <ul className="list-inside list-disc space-y-2 text-sm">
                            <li>Payment and bank information</li>
                            <li>Products and services you sell</li>
                            <li>Business and tax information</li>
                            <li>Create and update Products</li>
                          </ul>
                        </CredenzaBody>
                        <CredenzaFooter>
                          <CredenzaClose asChild>
                            <Button variant="outline">Close</Button>
                          </CredenzaClose>
                          <Button>Connect</Button>
                        </CredenzaFooter>
                      </CredenzaContent>
                    </Credenza>
                  </div>
                  <CardDescription className="text-start">
                    Stripe is the fastest and easiest way to integrate payments and financial services into your software platform or marketplace.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      );
}
