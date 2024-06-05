import React from 'react';
import { Credenza, CredenzaBody, CredenzaContent, CredenzaFooter, CredenzaHeader } from "@/components/ui/credenza";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { JSX, SVGProps } from "react";

const IntegrationModal: React.FC = () => {
  return (
    <Credenza>
      <CredenzaContent>
        <CredenzaHeader>
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Avatar>
                <img src="/placeholder.svg" alt="App icon" />
              </Avatar>
              <ArrowRightIcon className="h-6 w-6 text-muted-foreground" />
              <Avatar>
                <img src="/placeholder.svg" alt="Stripe icon" />
              </Avatar>
            </div>
          </div>
        </CredenzaHeader>
        <CredenzaBody>
          <div className="mt-4 mb-6">
            <h3 className="text-lg font-semibold">Connect Stripe Account</h3>
            <p className="text-sm text-muted-foreground">
              The world’s most successful platforms and marketplaces including Shopify and DoorDash, use Stripe Connect.
            </p>
          </div>
          <hr className="border-b border-muted-background mb-4" />
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold">Stripe would like to access</h4>
            <ul className="list-inside list-disc space-y-2 text-sm">
              <li>Payment and bank information</li>
              <li>Products and services you sell</li>
              <li>Business and tax information</li>
              <li>Create and update Products</li>
            </ul>
          </div>
        </CredenzaBody>
        <CredenzaFooter>
          <Button variant="secondary">Learn more</Button>
          <Button className="bg-[#635BFF] text-white">Connect to Stripe</Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}

const ArrowRightIcon: React.FC<JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
};

export default IntegrationModal;
