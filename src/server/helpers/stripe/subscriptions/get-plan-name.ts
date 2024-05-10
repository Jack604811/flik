import { env } from "@/env";
import StripeServer from "stripe";

export async function getPlanName({ subscriptionId }: { subscriptionId: string }) {
    // Get the plan name from the subscription

    const stripe = new StripeServer(env.STRIPE_SECRET_KEY);
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, { expand: ['items.data.plan.product'] });
    const plan = subscription.items.data[0]?.plan
    const product = plan.product as StripeServer.Product;
    const planName = product.name;
    return planName;





}