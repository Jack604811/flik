import { CustomerPortalLink } from "@/components/marketing-blocks/pricing/customer-portal-link";
import { Button } from "@/components/ui/button";
import { Check, CreditCard } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing",
  description: "Select your plan and start to get your bookings",
}

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <section>
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Billing
            </h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Manage your billing information and subscription.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
              <h3 className="text-lg font-medium">Current Plan</h3>
              <p className="mt-4 flex items-baseline justify-center">
                <span className="text-4xl font-bold">$29</span>
                <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  /month
                </span>
              </p>
              <ul className="mt-8 space-y-3 text-sm text-gray-500 dark:text-gray-400">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  Up to 25 users
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  10 GB storage
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  Priority email support
                </li>
              </ul>
              <CustomerPortalLink className="mt-8 w-full">
                <Button className="w-full" variant="outline">
                  Change Plan
                </Button>
              </CustomerPortalLink>
              <div className="text-xs text-muted-foreground text-center mt-3">Next billing: 09/20/2024</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
              <h3 className="text-lg font-medium">Payment Method</h3>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="font-medium">Visa ending in 4567</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Expires 12/24
                    </p>
                  </div>
                </div>
                <CustomerPortalLink>
                <Button size="sm" variant="outline">
                  Update
                </Button>
              </CustomerPortalLink>

                
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
              <h3 className="text-lg font-medium">Billing History</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Pro Plan</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      April 1, 2023
                    </p>
                  </div>
                  <p className="font-medium">$29</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Pro Plan</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      March 1, 2023
                    </p>
                  </div>
                  <p className="font-medium">$29</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Starter Plan</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      February 1, 2023
                    </p>
                  </div>
                  <p className="font-medium">$9</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
