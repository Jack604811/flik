import { tiers, features, featureAvailability } from "./plans";
import { Check, HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";



export function ComparePlans() {
  return (
    <section id="pricing">
      <div className="container px-4 md:px-6 py-12 md:py-24 lg:py-32">
        <div className="text-center space-y-4 py-6 mx-auto">
          <h4 className="text-[42px] font-medium mb-2 text-balance max-w-3xl mx-auto tracking-tighter">
            Choose the plan that&apos;s right for you
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-neutral-100 dark:bg-neutral-900 rounded-lg">
                <th className="p-4 text-left font-semibold">Features</th>
                {tiers.map((tier) => (
                  <th key={tier.name} className="p-4 text-center font-semibold">
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={feature} className="border-t border-gray-100">
                  <td className="py-4 px-4 flex items-center">
                    <span className="font-medium">{feature}</span>
                    <HelpCircle
                      className="ml-2 h-4 w-4 text-gray-400"
                      aria-label={`More info about ${feature}`}
                    />
                  </td>
                  {featureAvailability[index].map((available, tierIndex) => (
                    <td key={tierIndex} className="py-4 px-4 text-center">
                      {typeof available === "boolean" ? (
                        available ? (
                          <Check
                            className="mx-auto h-5 w-5 text-blue-500"
                            aria-label="Included"
                          />
                        ) : (
                          <X
                            className="mx-auto h-5 w-5 text-gray-300"
                            aria-label="Not included"
                          />
                        )
                      ) : (
                        <span className="text-sm text-gray-600">
                          {available}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td></td>
                {tiers.map((tier, index) => (
                  <td key={`button-${tier.name}`} className="p-4 text-center">
                    <Button
                      size="lg"
                      className={cn(
                        "mt-4 w-full rounded-lg shadow-none",
                        "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
                      )}
                    >
                      Start Free Trial
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-12 text-center text-sm text-gray-500">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
}
