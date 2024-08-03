import { JSX, SVGProps } from "react";
import { ProductCard } from "@/components/blocks/cards/product-card";
import { OneTimeCheckoutButton, RecurringCheckoutButton } from "@/components/store/checkout-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"
import CustomCard from "@/components/blocks/cards/custom-card";


export default function Component() {
  return (
    <div className="w-full max-w-6xl mx-auto py-12 md:py-20 px-4 md:px-6">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl md:text-4xl font-bold">Pricing</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
          Choose the plan that&apos;s right for your business. Our flexible pricing options make it easy to get started and
          scale as you grow.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <ProductCard
          price="$35"
          features={["1 user", "5 spots", "Subdomain", "Email support"]}
          title="Starter"
          description="Perfect for individuals and small teams."
          purchaseButton={
            <RecurringCheckoutButton priceId="price_1PMaCZInpO8pfcCbVXFxsHyU">Start free trial</RecurringCheckoutButton>
          }
        />
        <ProductCard
          price="$59"
          features={["5 users", "15 spots", "Custom domain", "Priority email support"]}
          title="Pro"
          description="Perfect for growing teams."
          purchaseButton={
            <RecurringCheckoutButton priceId="price_1PMaARInpO8pfcCbwakO7TcZ">Start free trial</RecurringCheckoutButton>
          }
        />
        <ProductCard
          price="$99"
          features={["10 users", "50 spots", "Custom domain", "Dedicated account manager"]}
          title="Enterprise"
          description="Perfect for large organizations."
          purchaseButton={
            <RecurringCheckoutButton priceId="price_1PMaBXInpO8pfcCbqO1CX0pZ">Start free trial</RecurringCheckoutButton>
          }
        />
      </div>
      {/*<div className="flex my-6">
      <CustomCard
        title="Custom Plan"
        description="Get your roles filled faster with unlimited access to Dribbble's Job Board and Designer search."
        price="$1,228/year"
       
        features={[
          'Unlimited Access to All Features',
          'Unlimited discount on backorders',
          'Unlimited Domain name Appraisal',
          'Unlimited Social Profiles',
        ]}
        buttonText="Contact Sales"
      />
      </div>*/}
      <div className="mt-12 md:mt-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Compare our plans</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="px-4 py-3 font-medium">Features</th>
                <th className="px-4 py-3 font-medium">Starter</th>
                <th className="px-4 py-3 font-medium">Pro</th>
                <th className="px-4 py-3 font-medium">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <td className="px-4 py-3">Users</td>
                <td className="px-4 py-3">1</td>
                <td className="px-4 py-3">5</td>
                <td className="px-4 py-3">Unlimited</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <td className="px-4 py-3">Storage</td>
                <td className="px-4 py-3">5 GB</td>
                <td className="px-4 py-3">50 GB</td>
                <td className="px-4 py-3">Unlimited</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <td className="px-4 py-3">Analytics</td>
                <td className="px-4 py-3">Basic</td>
                <td className="px-4 py-3">Advanced</td>
                <td className="px-4 py-3">Custom</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <td className="px-4 py-3">Support</td>
                <td className="px-4 py-3">Email</td>
                <td className="px-4 py-3">Priority email</td>
                <td className="px-4 py-3">Dedicated account manager</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
