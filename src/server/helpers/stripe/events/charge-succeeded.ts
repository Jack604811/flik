import Stripe from "stripe";
import { purchaseProduct } from "@/server/helpers/stripe/purchase-product";
import { Resend } from "resend";
import { env } from "@/env";
import { APP_NAME } from "@/app-settings";
import { ProductPurchaseTemplate } from "@/emails/stripe/product-purchase";
const resend = new Resend(env.RESEND_API_KEY);

export async function handleChargeSucceeded(event: Stripe.ChargeSucceededEvent) {
    if (event.data.object.metadata?.userId && event.data.object.metadata?.productId) {
        const userId = event.data.object.metadata.userId
        const productId = event.data.object.metadata.productId
        const userEmail = event.data.object.metadata.userEmail
        try {
            await purchaseProduct({ userId, productId })
            await resend.emails.send({
                from: env.EMAIL_FROM,
                to: userEmail,
                subject: `Thank you for buying on ${APP_NAME}`,
                react: ProductPurchaseTemplate({}),
                html: ""
            })
            return new Response(null, { status: 200 });


        }
        catch (error) {
            return new Response("Error updating user products", { status: 500 });
        }


    }
}   