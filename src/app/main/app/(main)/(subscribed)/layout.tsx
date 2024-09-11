import StripeServer from "stripe";
import { NON_AUTHENTICATED_REDIRECT_URL, NON_SUBSCRIBED_REDIRECT_URL } from "@/app-settings";
import { authOptions } from "@/server/auth/options"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";
import { env } from "@/env";

/** This layout makes sure all routes inside the authenticated are protected against non authenticated users   */

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return redirect(NON_AUTHENTICATED_REDIRECT_URL)
    }

    const subscriptionId = session?.user?.subscriptionId;

    if (!subscriptionId) {
        // user has no subscription, redirect to the non subscribed page
        return redirect(NON_SUBSCRIBED_REDIRECT_URL)
    }

    // user has a subscription, check if it's active

    const stripe = new StripeServer(env.STRIPE_SECRET_KEY);
    const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);

    if (subscription.status !== "active") {
        // subscription is not active, redirect to the non subscribed page
        return redirect(NON_SUBSCRIBED_REDIRECT_URL)
    }

    // subscription is active, render the children
    else {
        return children
    }

}