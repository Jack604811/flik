"use client";
import { loadStripe } from "@stripe/stripe-js";
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useCallback } from "react";
import { useSearchParams } from 'next/navigation'

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
export default function Page({ params }: { params: { priceId: string } }) {
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode");
    // ProductId is only needed for one-time payments
    const productId = searchParams.get("productId");

    const fetchClientSecret = useCallback(() => {
        // Create a Checkout Session

        return fetch("/api/stripe/checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                priceId: params.priceId,
                mode,
                productId: productId,
            }),
        })
            .then((res) => res.json())
            .then((data) => data.clientSecret);
    }, [params.priceId, mode, productId]);

    const options = { fetchClientSecret };
    return (
        <div className="py-8  min-h-screen bg-white">
            <div id="checkout max-w-lg">
                <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                    <EmbeddedCheckout className="max-w-lg mx-auto p-6" />
                </EmbeddedCheckoutProvider>
            </div>
        </div>
    )
}