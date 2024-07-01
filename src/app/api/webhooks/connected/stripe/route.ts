import StripeServer from "stripe";
import { env } from "@/env";
const stripe = new StripeServer(env.STRIPE_SECRET_KEY);


export async function POST(request: Request) {
    const signature = request.headers.get("Stripe-Signature")!;
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            await request.text(),
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        return new Response("Invalid signature", { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case "charge.succeeded": {
            console.log(event.account, JSON.stringify(event.data))
            // if (event.data.object.metadata?.userId && event.data.object.metadata?.productId) {
            //     // ✅ a charge was successful
            //     // We will use for payments that does not require a subscription (one-time payments)
            //     await handleChargeSucceeded(event as StripeServer.ChargeSucceededEvent);
            // }
        }
        default: {
            // Unexpected event type
            return new Response("Unexpected event type", { status: 400 });
        }

    }
}