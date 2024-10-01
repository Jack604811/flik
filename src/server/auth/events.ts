
import { createStripeCustomer } from "@/server/helpers/stripe/create-stripe-customer";
import { db } from "@/server/db";
import { NextAuthConfig } from "next-auth";
export const events: NextAuthConfig["events"] = {
  //add customer id to the new user
  createUser: async ({ user }) => {
    if(user.customerId) return;
    // create the stripe customer
    const customer = await createStripeCustomer({
      email: user.email!,
      name: user.name??"",
    })


    // add the stripe customer id to the user

    await db.workspace.update({
      where: {
        id: user.id,
      },
      data: {
        customerId: customer?.id,
      },
    });

  },
};
