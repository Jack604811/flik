import type Stripe from "stripe";
import { Resend } from "resend";
import { env } from "@/env";
import { PaymentFailedTemplate } from "@/emails/stripe/payment-failed";

const resend = new Resend(env.RESEND_API_KEY);

export async function handleInvoicePaymentFailed(event: Stripe.InvoicePaymentFailedEvent) {

    const customerEmail = event.data.object.customer_email as string;

    const { error } = await resend.emails.send({
        from: env.EMAIL_FROM,
        to: customerEmail,
        subject: "Payment failed",
        react: PaymentFailedTemplate({}),
        html: ""
    })

    if (error) {
        console.error(error);
    }

    return new Response("Payment failed", { status: 400 });

}