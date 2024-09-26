"use server";
import { env } from "@/env";
import Stripe from "stripe";
import { db } from "../db";
import { getCurrentWorkspace } from "./user.action";
import axios from "axios";
import { updateWompiConnection } from "./workspace.action";

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
  const currentWorkspace = await getCurrentWorkspace();
  if (!currentWorkspace) return { success: false };
  const disconnect = await stripe.oauth.deauthorize({
    client_id: env.STRIPE_CLIENT_ID,
    stripe_user_id: id,
  });
  if (!disconnect) return { success: false };
  await db.workspace.update({
    where: { id: currentWorkspace.id },
    data: { stripeAccountId: null },
  });

  return { success: true };
};

export const connectWompiAccount = async (
  wompiData: Record<string, string>
) => {
  const currentUser = await getCurrentWorkspace();
  const validate = async (
    publicKey: string,
    type: "sandbox" | "production"
  ) => {
    const API_URI = `https://${type}.wompi.co/v1/merchants/${publicKey}`;
    try {
      const res = await axios.get(API_URI);
      if (res.data.data.error) throw new Error("Invalid key provided!");
      return { status: true };
    } catch (error: any) {
      return {
        status: false,
        message: `Key Validation Failed, Kindly check the ${type} key and try again!`,
      };
    }
  };

  const test = await validate(wompiData.testPublicKey, "sandbox");
  const live = await validate(wompiData.livePublicKey, "production");

  try {
    if (!test?.status || !live?.status) throw new Error("");
    await updateWompiConnection(currentUser?.id!, wompiData);
    return { status: true };
  } catch (error) {
    return { status: false, error: { live, test } };
  }
};
