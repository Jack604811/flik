import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";
import Stripe from "stripe";
import { NextRequest } from "next/server";
import { env } from "@/env";
import { APP_DOMAIN } from "@/app_settings";
const stripe: Stripe = require("stripe")(env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
    const userSession = await getServerSession(authOptions);
    if (!userSession || !userSession.user || !userSession.user.customerId) {
        return new Response(null, { status: 401 });
    }

    //get price id from  request body

    const data = await req.json();


    if (!data.priceId || !data.mode) {
        return new Response(null, { status: 400 });
    }

    const priceId = data.priceId;
    const mode = data.mode;

    //get query params from request


    if (mode !== "payment" && mode !== "subscription") {
        return new Response("Mode must be payment or subscription", { status: 400 });
    }

    if (mode === "payment" && !data.productId) {
        return new Response("ProductId is required for one-time payments", { status: 400 });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            ui_mode: "embedded",
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            customer: userSession.user.customerId,
            mode,
            ...(mode === "subscription" ? {
                subscription_data: {
                    metadata: {
                        userId: userSession.user.id,
                        userEmail: userSession.user.email as string,
                    }
                },
                return_url: `${APP_DOMAIN}/checkout/status?session_id={CHECKOUT_SESSION_ID}&mode=subscription`,
            } : {
                payment_intent_data: {
                    metadata: {
                        userId: userSession.user.id,
                        userEmail: userSession.user.email as string,
                        productId: data.productId

                    }
                },
                return_url: `${APP_DOMAIN}/checkout/status?session_id={CHECKOUT_SESSION_ID}&mode=payment`,
            })

        });
        return Response.json({ clientSecret: session.client_secret });
    } catch (error) {
        console.error(error);

        return new Response(null, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return new Response(null, { status: 401 });
    }

    try {
        const url = new URL(request.url);
        if (!url.searchParams.has("session_id")) {
            return new Response(null, { status: 400 });
        }
        const session = await stripe.checkout.sessions.retrieve(
            url.searchParams.get("session_id")!
        );
        return Response.json({
            status: session.status,
            customer_email: session.customer_details?.email,
        });
    } catch (error) {
        return Response.json({ status: "failed" }, { status: 500 });
    }
}