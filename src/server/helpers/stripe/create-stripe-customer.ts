import Stripe from "stripe";
import { env } from "@/env";

const stripe: Stripe = require("stripe")(env.STRIPE_SECRET_KEY);

export async function createStripeCustomer(
    customerCandidate: Stripe.CustomerCreateParams
) {
    try {
        const customer = await stripe.customers.create(customerCandidate);

        return customer;
    } catch (error) {
        console.error(error);
    }
}