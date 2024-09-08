import Stripe from "stripe";
import { createRecurringSubscription } from "@/server/helpers/stripe/subscriptions";
import { APP_NAME } from "@/app-settings";
import { Resend } from "resend";
import { env } from "@/env";
import { NewSubscriptionTemplate } from "@/emails/stripe/new-subscription";

const resend = new Resend(env.RESEND_API_KEY);

export async function handleCustomerSubscriptionCreated(event: Stripe.CustomerSubscriptionCreatedEvent, stripe: Stripe) {

    const session = event.data.object
    const subscriptionId = session.id as string;

    const { metadata } = event.data.object


    const userId = metadata.userId
    const userEmail = metadata.userEmail

    await createRecurringSubscription({ userId, subscriptionId })


    const { error } = await resend.emails.send({
        from: env.EMAIL_FROM,
        to: userEmail,
        subject: `Thank you for suscribing to ${APP_NAME}!`,
        react: NewSubscriptionTemplate({}),
        html: ""
    })

    if (error) {
        console.error(error)

    }

    return new Response("Checkout session completed", { status: 200 });


}