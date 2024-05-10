import Stripe from "stripe";
import { deleteRecurringSubscription } from "@/server/helpers/stripe/subscriptions";
import { SubscriptionDeletedTemplate } from "@/emails/stripe/subscription-deleted";
import { Resend } from "resend";
import { env } from "@/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function handleCustomerSubscriptionDeleted(event: Stripe.Event, stripe: Stripe) {

    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    const customerEmail = customer.email as string;

    await deleteRecurringSubscription({ customerId })


    const { error } = await resend.emails.send({
        from: env.EMAIL_FROM,
        to: customerEmail,
        subject: "Your subscription was canceled",
        react: SubscriptionDeletedTemplate({}),
        html: ""
    })

    if (error) {
        console.error(error);
    }

    return new Response("Subscription canceled", { status: 200 });


}