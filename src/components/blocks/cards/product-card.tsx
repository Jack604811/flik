import { RecurringCheckoutButton } from "@/components/store/checkout-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Check, CircleCheck, X } from "lucide-react";
import React from "react";

interface Props {
    title: string;
    price: string;
    description: string;
    features: string[];
    highlight?: boolean;
    notIncludedFeatures?: string[];
    period?: string;
    purchaseButton: React.ReactNode;

}

export function ProductCard({ title, description, features, highlight, price, purchaseButton, notIncludedFeatures }: Props) {
    return (
        <Card

            key={title}
            className={`py-6 px-4 space-y-4 w-full lg:px-8 lg:py-12 ${highlight ? "border-foreground border-2 shadow-md" : ""
                }`}
        >
            {highlight && <Badge className="">Popular</Badge>}
            <CardTitle>{title}</CardTitle>
            <CardContent className=" p-0 space-y-4">
                <p className="text-4xl font-bold">{price}</p>
                <p className="max-w-[300px] mx-auto lg:mx-0">
                    {description}
                </p>

                {
                    purchaseButton
                }

                <ul
                    className={`text-lg space-y-4 text-foreground/90
            }`}
                >
                    {features.map((feature, index) => (
                        <li className="flex gap-2 items-center" key={feature}>
                            <Check size={20} />
                            {feature}
                        </li>
                    ))}

                    {notIncludedFeatures && notIncludedFeatures?.length > 0 && notIncludedFeatures
                        .map((feature, index) => (
                            <li className="flex gap-2 items-center opacity-30" key={index}>
                                <X className="text-red-600" size={20} />
                                {feature}
                            </li>
                        ))}
                </ul>
            </CardContent>
        </Card>
    )
}