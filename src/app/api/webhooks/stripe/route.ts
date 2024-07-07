import StripeServer from "stripe";
import { env } from "@/env";
const stripe = new StripeServer(env.STRIPE_SECRET_KEY);
import {
  handleCustomerSubscriptionCreated,
  handleChargeSucceeded,
  handleInvoicePaymentFailed,
  handleCustomerSubscriptionDeleted,
} from "@/server/helpers/stripe/events";
import _ from "lodash";

export async function POST(request: Request) {
  const signature = request.headers.get("Stripe-Signature")!;
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response("Invalid signature", { status: 400 });
  }


  // Handle the event
  switch (event.type) {
    case "customer.subscription.created": {
      // ✅ a recurring subscription was created successfully, provide access to the user
      await handleCustomerSubscriptionCreated(event, stripe);
    }

    case "charge.succeeded": {
      if (
        event.data.object.metadata?.userId &&
        event.data.object.metadata?.productId
      ) {
        // ✅ a charge was successful
        // We will use for payments that does not require a subscription (one-time payments)
        await handleChargeSucceeded(event as StripeServer.ChargeSucceededEvent);
      }
    }

    case "checkout.session.expired": {
      // ❔🛒 Can be used to track abandoned carts, but user needs to give consent for promotional content
      // You would also need to avoid spamming. That's why I won't implement this by default.
      // If you wish to implement this, this docs can help you: https://docs.stripe.com/payments/checkout/abandoned-carts#webhook
      return new Response("Checkout session expired", { status: 200 });
    }


    case "invoice.paid": {
      // 💰 For recurring payments, this will be triggered in each payment cycle (monthly, yearly, etc.)
      return new Response("Invoice paid", { status: 200 });
    }

    case "invoice.payment_failed": {
      // ❌ Payment failed, usually for recurring payments
      /**
       * Usually, we don't want to block access to the user if the first payment fails
       * But we can send an email to the user to let them know that the payment failed
       * After some retries, the "customer.subscription.deleted" event will be triggered
       * and we can block access to the user
       */

      await handleInvoicePaymentFailed(event);
    }

    case "customer.subscription.deleted": {
      // ❌ Subscription was canceled, block access to the user
      await handleCustomerSubscriptionDeleted(event, stripe);
    }

    default: {
      // Unexpected event type
      return new Response("Unexpected event type", { status: 400 });
    }
  }
}