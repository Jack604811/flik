"use client";

import { AFTER_PURCHASE_REDIRECT_URL, AFTER_SUBSCRIPTION_REDIRECT_URL } from "@/app-settings";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function StatusContent() {
    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState(null);
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode");

    useEffect(() => {
        const sessionId = searchParams.get("session_id");

        fetch(`/api/stripe/checkout-session?session_id=${sessionId}`)
            .then((res) => res.json())
            .then((data) => {
                setStatus(data.status);
                setCustomerEmail(data.customer_email);
            });
    }, [searchParams]);

    if (status === "failed") {
        return (
            <div className="py-6 px-4 text-center text-white text-xl lg:text-2xl/relaxed flex flex-col justify-center items-center w-full min-h-screen">
                <p className="max-w-lg mx-auto">
                    There was an error processing your payment. Please contact our support.
                </p>
            </div>
        );
    }

    if (status === "complete") {
        if (mode === "payment") {
            return redirect(AFTER_PURCHASE_REDIRECT_URL);
        }
        return redirect(AFTER_SUBSCRIPTION_REDIRECT_URL);
    }

    return (
        <div className="py-6 px-4 text-center text-xl lg:text-2xl/relaxed flex flex-col justify-center items-center w-full min-h-screen">
            <p className="max-w-lg mx-auto">
                Processing your payment...
            </p>
        </div>
    );
}

export default function StatusPage() {
    return (
        <Suspense fallback={<Loading />}>
            <StatusContent />
        </Suspense>
    );
}

function Loading() {
    return (
        <div className="py-6 px-4 text-center text-xl lg:text-2xl/relaxed flex flex-col justify-center items-center w-full min-h-screen">
            <p className="max-w-lg mx-auto">Loading...</p>
        </div>
    );
}
