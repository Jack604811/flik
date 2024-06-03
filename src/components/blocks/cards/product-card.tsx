import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
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
            className={`bg-white dark:bg-gray-950 rounded-lg shadow-lg overflow-hidden space-y-2 w-full transform transition-transform duration-300 hover:scale-105 ${highlight ? "border-foreground border-2 shadow-md" : ""}`}
        >
            {highlight && <Badge className="">Popular</Badge>}
            <div className="bg-gray-100 dark:bg-gray-800 px-6 py-10 text-center">
                <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                <p className="text-gray-500 dark:text-gray-400 mt-0">{description}</p>
            </div>
            <CardContent className="px-8 py-4 text-center">
                <div className="text-4xl font-bold">
                {price}
                    <span className="text-gray-500 dark:text-gray-400 text-base font-normal">/month</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Billed annually 2 months free</p>
            </CardContent>
            <CardContent className="px-6 py-8 border-t border-gray-200 dark:border-gray-800">
                <ul className="space-y-4 text-lg text-foreground/90">
                    {features.map((feature, index) => (
                        <li className="flex items-center gap-2" key={feature}>
                            <Check size={20} />
                            {feature}
                        </li>
                    ))}
                    {notIncludedFeatures && notIncludedFeatures.length > 0 && notIncludedFeatures.map((feature, index) => (
                        <li className="flex gap-2 items-center opacity-30" key={index}>
                            <X className="text-red-600" size={20} />
                            {feature}
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardContent className="px-6 py-8 border-t border-gray-200 dark:border-gray-800">
                {purchaseButton}
            </CardContent>
        </Card>
    );
}
