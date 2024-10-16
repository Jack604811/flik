"use client";
import { BorderBeam } from "@/components/magicui/border-beam";
import { tiers } from "./plans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: "yearly" | "monthly") => void;
  className?: string;
  children: (activeTab: string) => React.ReactNode;
}

interface TabsListProps {
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  onClick: () => void;
  children: React.ReactNode;
  isActive: boolean;
}

const Tabs = ({ activeTab, setActiveTab, className, children }: TabsProps) => {
  return (
    <div
      className={cn(
        "mx-auto flex w-full items-center justify-center",
        className,
      )}
    >
      {children(activeTab)}
    </div>
  );
};

const TabsList = ({ children }: TabsListProps) => {
  return (
    <div className="relative flex w-fit items-center rounded-full border p-1.5">
      {children}
    </div>
  );
};

const TabsTrigger = ({
  value,
  onClick,
  children,
  isActive,
}: TabsTriggerProps) => {
  return (
    <button
      onClick={onClick}
      className={cn("relative z-[1] px-4 py-2", { "z-0": isActive })}
    >
      {isActive && (
        <motion.div
          layoutId="active-tab"
          className="absolute inset-0 rounded-full bg-neutral-900 dark:bg-white"
          transition={{
            duration: 0.2,
            type: "spring",
            stiffness: 300,
            damping: 25,
            velocity: 2,
          }}
        />
      )}
      <span
        className={cn(
          "relative block text-sm font-medium duration-200",
          isActive
            ? "text-white delay-100 dark:text-black"
            : "text-neutral-800 dark:text-white",
        )}
      >
        {children}
      </span>
    </button>
  );
};

function PricingTier({
  tier,
  billingCycle,
}: {
  tier: (typeof tiers)[0];
  billingCycle: "monthly" | "yearly";
}) {
  return (
    <div
      className={cn(
        "outline-focus transition-transform-background relative box-border grid h-full w-full grid-rows-[150px_1fr_auto] overflow-hidden rounded-xl bg-background/60 p-3 text-foreground outline-2 outline-offset-2 backdrop-saturate-150 motion-reduce:transition-none dark:border dark:border-neutral-400/15 dark:bg-background/50",
        "shadow-[0px_0px_5px_0px_rgba(0,0,0,0.03),0px_2px_30px_0px_rgba(0,0,0,0.08),0px_0px_1px_0px_rgba(0,0,0,0.3)] dark:shadow-[0px_0px_5px_0px_rgba(255,255,255,0.015),0px_2px_30px_0px_rgba(255,255,255,0.02),0px_0px_1px_0px_rgba(255,255,255,0.3)] bg-[radial-gradient(60%_128px_at_20%_0%,theme(backgroundColor.white/8%),transparent)]",
      )}
    >
       
      <CardHeader className="h-full border-b p-4">
        <CardTitle className="flex items-center justify-between">
          {tier.name}
          {tier.popular && (
            <Badge
              variant="secondary"
              className="bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900"
            >
              Most Popular
            </Badge>
          )}
        </CardTitle>
        <div className="pt-2 text-3xl font-bold">
          <motion.div
            key={tier.price[billingCycle]}
            initial={{
              opacity: 0,
              x: billingCycle === "yearly" ? -10 : 10,
              filter: "blur(5px)",
            }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.25,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {tier.price[billingCycle]}
            <span className="text-sm font-medium text-neutral-600 dark:font-normal dark:text-neutral-300">
              / {tier.frequency[billingCycle]}
            </span>
          </motion.div>
        </div>
        <p className="text-[15px] font-medium text-neutral-600 dark:font-normal dark:text-neutral-300">
          {tier.description}
        </p>
      </CardHeader>

      <CardContent className="flex h-full flex-col justify-start p-4 pt-5">
        <ul className="space-y-2">
          {tier.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-center">
              <Check className="mr-2 size-4 text-green-500" />
              <span className="font-medium dark:font-normal">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <Link href= {`/subscribe/${tier.priceId}?mode=subscription`}>
      <Button
        size="lg"
        className={cn(
          "my-4 w-full rounded-lg shadow-none border border-neutral-900 dark:border-neutral-700 bg-[radial-gradient(40%_128px_at_20%_0%,theme(backgroundColor.white/20%),transparent)]",
          tier.popular
            ? "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
            : "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800",
        )}
      >
        Start Free Trial
      </Button>
      </Link>
    </div>
  );
}

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "yearly" 
  );

  const handleTabChange = (tab: "yearly" | "monthly") => {
    setBillingCycle(tab);
  };

  return (
    <section id="pricing">
      <div className="mx-auto max-w-6xl p-6 py-20">
        <div className="text-center">
          <h2 className="text-4xl font-medium tracking-tight text-black dark:text-white sm:text-5xl">
            Simple pricing for everyone.
          </h2>

          <p className="text-lg tracking-tight text-gray-500 my-4">
            Choose an <strong>affordable plan</strong> that&apos;s packed with
            the best features for engaging your audience, creating customer
            loyalty, and driving sales.
          </p>
        </div>
        <div className="py-10">
          <Tabs
            activeTab={billingCycle}
            setActiveTab={handleTabChange}
            className="mx-auto mb-8 w-full max-w-md"
          >
            {(activeTab) => (
              <TabsList>
                {["monthly", "yearly"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    onClick={() => handleTabChange(tab as "yearly" | "monthly")}
                    isActive={activeTab === tab}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab === "yearly" && (
                      <span className="ml-2 text-xs font-semibold text-green-500">
                        Save 25%
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            )}
          </Tabs>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <PricingTier key={index} tier={tier} billingCycle={billingCycle} />
          ))}
        </div>
      </div>
    </section>
  );
}
