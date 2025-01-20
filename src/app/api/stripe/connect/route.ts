import { env } from "@/env";
import { getCurrentWorkspace } from "@/server/actions/user.action";
import { updateStripeConnection } from "@/server/actions/workspace.action";
import { getCurrentUser } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(
  env.STRIPE_SECRET_KEY,
  {
    apiVersion: "2024-04-10",
  }
);
export const GET = async (req: NextRequest) => {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id)
    return NextResponse.json({ message: "Invalid Request" }, { status: 400 });
  const code = req.nextUrl.searchParams.get("code") as string;

  try {
    const response = await stripe.oauth.token({
      grant_type: "authorization_code",
      code,
    });
    const currentWorkspace = await getCurrentWorkspace();
    await updateStripeConnection(currentWorkspace!.id, response.stripe_user_id!);
  } catch (error: any) { }

  
  return NextResponse.redirect(new URL("/settings", `${req.headers.get('x-forwarded-proto')}://${req.headers.get('host')}`));
};
