import Stripe from "stripe";
import { env } from "@/env";
import { AFTER_CUSTOMER_PORTAL_REDIRECT_URL, APP_DOMAIN } from "@/app-settings";
import { auth } from "@/server/auth";
const stripe: Stripe = require("stripe")(env.STRIPE_SECRET_KEY);

export async function POST() {
    const userSession = await auth();
    if (!userSession || !userSession.user || !userSession.user.customerId) {
        return new Response(null, { status: 401 });
    }

    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: userSession.user.customerId,
            return_url: `${APP_DOMAIN}${AFTER_CUSTOMER_PORTAL_REDIRECT_URL}`,
        });

        return Response.json({
            url: session.url,
        });


    } catch (error) {
        console.log(error)
        return new Response("An error occurred while creating the customer portal session", { status: 500 });
    }
}