"use server";
import { env } from "@/env";
import Stripe from "stripe";
import { db } from "../db";
import { getCurrentUser } from "../auth";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2024-04-10" });
export const connectStripeAccount = async () => {
  const url = stripe.oauth.authorizeUrl({
    client_id: env.STRIPE_CLIENT_ID,
    response_type: "code",
    redirect_uri: env.STRIPE_REDIRECT_URI,
  });

  return { url };
};

export const disconnectStripeAccount = async (id: string) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return { success: false };
  const disconnect = await stripe.oauth.deauthorize({
    client_id: env.STRIPE_CLIENT_ID,
    stripe_user_id: id,
  });
  if (!disconnect) return { success: false };
  await db.user.update({
    where: { id: currentUser.id },
    data: { stripeAccountId: null },
  });

  return { success: true };
};