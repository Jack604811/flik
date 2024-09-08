import StripeServer from "stripe";
import { env } from "@/env";
const stripe = new StripeServer(env.STRIPE_SECRET_KEY);
import { handleStripeBookingPaymentEvent } from "@/server/actions/booking.action";
import _ from "lodash";
import { WOMPI_CENT_MULTIPLIER } from "@/app-settings";
import moment from "moment";

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
    case "charge.succeeded": {
      // ✅ a charge was successful
      // We will use for payments that does not require a subscription (one-time payments)
      return new Response("Charge succeeded", { status: 200 });
    }

    case "checkout.session.expired": {
      // ❔🛒 Can be used to track abandoned carts, but user needs to give consent for promotional content
      // You would also need to avoid spamming. That's why I won't implement this by default.
      // If you wish to implement this, this docs can help you: https://docs.stripe.com/payments/checkout/abandoned-carts#webhook
      return new Response("Checkout session expired", { status: 200 });
    }

    case "checkout.session.completed": {
      // Stripe Webhook when customer of user (stripe connected account make a payment for booking)
      if (event.account && event.data.object.client_reference_id) {
        const eventObject = event.data.object;
        try {
          await handleStripeBookingPaymentEvent(
            eventObject.client_reference_id!,
            {
              amount: _.round(
                eventObject.amount_total! / WOMPI_CENT_MULTIPLIER,
                2
              ),
              paymentDate: moment.unix(eventObject.created).toDate(),
            }
          );
          return new Response("Checkout payment successful", { status: 200 });
        } catch (e) {
          return new Response("Checkout payment failed", { status: 401 });
        }
      }
      // ❔🛒 Can be used to track abandoned carts, but user needs to give consent for promotional content
      // You would also need to avoid spamming. That's why I won't implement this by default.
      // If you wish to implement this, this docs can help you: https://docs.stripe.com/payments/checkout/abandoned-carts#webhook
      return new Response("Checkout session expired", { status: 200 });
    }

    default: {
      // Unexpected event type
      return new Response("Unexpected event type", { status: 400 });
    }
  }
}
