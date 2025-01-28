"use server";

import { BookingStatus, TransactionStatus } from "@prisma/client";
import { db } from "../db";
import StripeServer from "stripe";
import { env } from "@/env";
import { headers } from "next/headers";
import { WOMPI_CENT_MULTIPLIER } from "@/app-settings";
import moment from "moment";
import { clearDomainCache } from "../helpers/domains";

export const getBookings = async (ownerId: string) => {
  const bookings = await db.booking.findMany({
    where: { spot: { workspaceId: ownerId } },
    include: {
      spot: true,
      customer: true,
      customFields: {
        select: {
          id: true,
          customFieldId: true,
          value: true,
          CustomField: { select: { fieldName: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return bookings;
};

export const getBookingById = async (bookingId: string) => {
  const booking = await db.booking.findFirst({
    where: { id: bookingId },
    include: {
      customer: true,
      spot: true,
      customFields: {
        select: {
          id: true,
          customFieldId: true,
          value: true,
          CustomField: { select: { fieldName: true } },
        },
      },
    },
  });
  return booking;
};

export const getTransactions = async (ownerId: string) => {
  const transactions = await db.transaction.findMany({
    where: { booking: { spot: { workspaceId: ownerId } } },
    include: { booking: { include: { customer: true, spot: true } } },
    orderBy: { createdAt: "desc" },
  });

  return transactions;
};

export const getTransactionById = async (transactionId: string) => {
  const transaction = await db.transaction.findFirst({
    where: { id: transactionId },
    include: { booking: { include: { customer: true, spot: true } } },
  });

  return transaction;
}

export const getTransactionsByBooking = async (bookingId: string) => {
  const transactions = await db.transaction.findMany({
    where: { booking: { id: bookingId } },
    orderBy: { createdAt: "desc" },
  });

  return transactions;
};

export const getExtrasByBooking = async (bookingId: string) => {
  const extras = await db.bookingExtras.findMany({
    where: { booking: { id: bookingId } },
    orderBy: { createdAt: "desc" },
    include: {
      extra: { select: { name: true, images: true, description: true } },
    },
  });

  return extras;
};

export const getBookingsBySpot = async (spotId: string) => {
  const bookings = await db.booking.findMany({
    where: { spotId },
  });

  return bookings;
};

export const deleteBooking = async (bookingId: string) => {
  const deletedBooking = await db.booking.delete({ where: { id: bookingId } });
  return deletedBooking;
};

export const deleteTransaction = async (transactionId: string) => {
  const deletedTransaction = await db.transaction.delete({
    where: { id: transactionId },
  });
  return deletedTransaction;
};

export const addBooking = async (data: {
  subtotal: number;
  totalPrice: number;
  spotId: string;
  startDate: Date | null;
  endDate: Date | null;
  createdAt?: Date | null
  name: string;
  email: string;
  phone: string;
  note?: string;
  customFields?: { customFieldId: string; value: string }[];
  extras?: { extraId: string; price: number; quantity: number }[];
}) => {
  const booking = await db.booking.create({
    data: {
      status: "In_progress",
      totalPrice: data.totalPrice,
      subtotal: data.subtotal,
      startDate: data.startDate,
      endDate: data.endDate,
      spotId: data.spotId,
      createdAt: data.createdAt ?? undefined,
      note: data.note,
      ...(data.customFields
        ? {
            customFields: {
              createMany: {
                data: data.customFields.map((field) => ({
                  customFieldId: field.customFieldId,
                  value: field.value,
                })),
              }
            },
          }
        : {}),
      ...(data.extras
        ? {
          bookingExtras: {
              createMany: {
                data: data.extras.map((field) => ({
                  extraId: field.extraId,
                  quantity: field.quantity,
                  price: field.price
                })),
              }
            },
          }
        : {}),
    },
    include: {
      customFields: {
        select: {
          customFieldId: true,
          value: true,
          CustomField: { select: { fieldName: true } },
        },
      },
      spot: {
        select: {
          workspace: { select: { subdomain: true, customDomain: true } },
          workspaceId: true,
        },
      },
      bookingExtras: {
        select: {
          id: true,
          extraId: true,
          quantity: true,
          price: true,
        },
      }
    },
  });
  const customer = await addCustomerToBooking({
    ...data,
    bookingId: booking.id,
  });

  clearDomainCache(
    booking.spot.workspace.subdomain,
    booking.spot.workspace.customDomain,
    data.spotId
  );

  return { ...booking, customer };
};
export const addExtrasToBooking = async (data: {
  extras: { extraId: string; price: number; quantity: number }[];
  bookingId: string;
}) => {
  const addedExtras = await db.bookingExtras.createMany({
    data: data.extras.map((extra) => ({
      bookingId: data.bookingId,
      extraId: extra.extraId,
      quantity: extra.quantity,
      price: extra.price,
    })),
  });

  return addedExtras;
};

export const removeExtraFromBooking = async (id: string) => {
  const deletedBookingExtra = await db.bookingExtras.delete({ where: { id } });
  return deletedBookingExtra;
};

export const updateBookingExtra = async (
  id: string,
  data: { quantity?: number; price?: number }
) => {
  const updatedBookingExtra = await db.bookingExtras.update({
    where: { id },
    data: { ...data, updatedAt: moment().toDate() },
  });

  return updatedBookingExtra;
};

export const addOrUpdateTransaction = async (data: {
  amount: number;
  date: Date;
  description: string;
  status?: TransactionStatus;
  paymentMethod: string;
  bookingId: string;
  id?: string;
}) => {
  const transactionData = {
    amount: data.amount,
    paymentDate: data.date,
    status: data.status ?? TransactionStatus.Pending,
    description: data.description,
    paymentMethod: data.paymentMethod,
    booking: { connect: { id: data.bookingId } },
  };
  const transaction = await db.transaction.upsert({
    where: { id: data.id ?? "" },
    update: transactionData,
    create: transactionData,
  });

  return transaction;
};

export const addCustomerToBooking = async ({
  bookingId,
  name,
  email,
  phone,
}: {
  bookingId: string;
  name: string;
  email: string;
  phone: string;
}) => {
  const customer = await db.customer.create({
    data: {
      name,
      email,
      phone,
      bookings: { connect: { id: bookingId } },
    },
  });

  return customer;
};

export const updateBooking = async (data: {
  id: string;
  status?: BookingStatus;
  subtotal?: number;
  startDate?: Date;
  endDate?: Date;
  customer?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  note?: string;
  customFields?: { id?: string | null; value: string; customFieldId: string }[];
  spotId?: string;
  extras?: { extraId: string; price: number; quantity: number }[];
  totalPrice?: number;
}) => {
  // 1) If the user is updating spotId, find the new Spot’s price
  if (data.spotId) {
    const newSpot = await db.spot.findUnique({
      where: { id: data.spotId },
      select: { price: true },
    });

    // 2) Default the new subtotal to the spot’s price
    const newSubtotal = newSpot?.price ?? 0;

    // 3) Sum existing extras from DB (we look them up by bookingId)
    const existingExtras = await db.bookingExtras.findMany({
      where: { bookingId: data.id },
    });

    let extrasTotal = 0;
    for (const ex of existingExtras) {
      // Each row might have a "price" and "quantity"
      extrasTotal += ex.price * (ex.quantity || 1);
    }

    // 4) Now set data.subtotal and data.totalPrice for your DB update
    data.subtotal = newSubtotal;
    data.totalPrice = newSubtotal + extrasTotal;
  }
  const booking = await db.booking.update({
    where: { id: data.id },
    data: {
      status: data.status,
      subtotal: data.subtotal,
      totalPrice: data.totalPrice,
      startDate: data.startDate,
      endDate: data.endDate,
      updatedAt: new Date(),
      note: data.note,
      ...(data.spotId ? { spot: { connect: { id: data.spotId } } } : {}),
      ...(data.customer ? { customer: { update: { ...data.customer } } } : {}),
      ...(data.customFields
        ? {
            customFields: {
              upsert: data.customFields.map((field) => ({
                where: { bookingId_customFieldId: { bookingId: data.id, customFieldId: field.customFieldId } },
                create: {
                  customFieldId: field.customFieldId,
                  value: field.value,
                },
                update: { value: field.value },
              })),
            },
          }
        : {}),
      ...(data.extras
        ? {
          bookingExtras: {
              createMany: {
                data: data.extras.map((field) => ({
                  extraId: field.extraId,
                  quantity: field.quantity,
                  price: field.price
                })),
              }
            },
          }
        : {}),
    },
    include: {
      customer: true,
      customFields: {
        select: {
          customFieldId: true,
          value: true,
          CustomField: { select: { fieldName: true } },
        },
      },
      bookingExtras: {
        select: {
          id: true,
          extraId: true,
          quantity: true,
          price: true,
        },
      }
    }
  });

  return booking;
};

const mapWompiStatusToTransactionStatus = (
  status: string
): TransactionStatus => {
  switch (status.toUpperCase()) {
    case "APPROVED":
      return TransactionStatus.Approved;
    case "DECLINED":
    case "CANCELLED":
    case "VOIDED":
    case "ERROR":
      return TransactionStatus.Declined;
    case "PENDING":
      return TransactionStatus.Pending;
    default:
      throw new Error(`Unknown status: ${status}`);
  }
};

export const handleWompiBookingPaymentEvent = async (
  bookingId: string,
  {
    amount,
    paymentDate,
    status,
    paymentMethod,
    reference,
  }: {
    amount: number;
    paymentDate: Date;
    status: string;
    paymentMethod: string;
    reference: string;
  }
) => {
  const transactionStatus = mapWompiStatusToTransactionStatus(status);
  const bookingStatus =
    transactionStatus === TransactionStatus.Approved
      ? BookingStatus.Confirmed
      : BookingStatus.Waiting_for_payment;

  await db.booking.update({
    where: { id: bookingId },
    data: {
      status: bookingStatus,
      transactions: {
        create: {
          id: reference,
          amount,
          paymentDate,
          paymentMethod,
          status: transactionStatus,
          description: "Payment from Wompi!",
        },
      },
    },
  });
};

export const handleStripeBookingPaymentEvent = async (
  bookingId: string,
  { amount, paymentDate }: { amount: number; paymentDate: Date }
) => {
  await db.booking.update({
    where: { id: bookingId },
    data: {
      status: BookingStatus.Confirmed,
      transactions: {
        create: {
          amount,
          paymentDate,
          paymentMethod: "Stripe",
          status: TransactionStatus.Approved,
          description: "Payment from Stripe!",
        },
      },
    },
  });
};

type CREATE_STRIPE_LINK_PARAMS = {
  account: string;
  amount: number;
  productName: string;
  reference: string;
  customerEmail: string;
  redirectURI: string;
  currency: string;
};

export const createStripePaymentLink = async (
  data: CREATE_STRIPE_LINK_PARAMS
) => {
  const to = new URL(
    `/booking/${data.reference}`,
    `${headers().get("x-forwarded-proto")}://${headers().get("host")}`
  );
  const stripe = new StripeServer(env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create(
    {
      line_items: [
        {
          price_data: {
            unit_amount: data.amount * WOMPI_CENT_MULTIPLIER,
            product_data: {
              name: data.productName,
            },
            currency: data.currency,
          },
          quantity: 1,
        },
      ],
      customer_email: data.customerEmail,
      client_reference_id: data.reference,
      mode: "payment",
      success_url: data.redirectURI ?? to.href,
      cancel_url: data.redirectURI ?? to.href,
    },
    { stripeAccount: data.account }
  );

  return { url: session.url };
};

export const createWompiPaymentLink = async (
  data: CREATE_STRIPE_LINK_PARAMS
) => {};