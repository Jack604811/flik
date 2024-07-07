"use server";

import { BookingStatus, TransactionStatus } from "@prisma/client";
import { db } from "../db";
import { revalidateTag } from "next/cache";
import StripeServer from "stripe";
import { env } from "@/env";
import { headers } from "next/headers";
import { WOMPI_CENT_MULTIPLIER } from "@/app_settings";

export const getBookings = async (ownerId: string) => {
  const bookings = await db.booking.findMany({
    where: { spot: { userId: ownerId } },
    include: { spot: true, guest: true },
<<<<<<< HEAD
    orderBy: { createdAt: "desc" },
=======
    orderBy: { createdAt: "desc"}
>>>>>>> 1af69b06c55da0f6c0a4f0e5b21ea304fb5f53e9
  });

  return bookings;
};

export const getTransactions = async (ownerId: string) => {
  const transactions = await db.transaction.findMany({
    where: { booking: { spot: { userId: ownerId } } },
    include: { booking: { include: { guest: true, spot: true } } },
<<<<<<< HEAD
    orderBy: { createdAt: "desc" },
=======
    orderBy: { createdAt: "desc"}
>>>>>>> 1af69b06c55da0f6c0a4f0e5b21ea304fb5f53e9
  });

  return transactions;
};

export const getTransactionsByBooking = async (bookingId: string) => {
  const transactions = await db.transaction.findMany({
    where: { booking: { id: bookingId } },
    orderBy: { createdAt: "desc"}
  });

  return transactions;
};
export const getBookingsBSpot = async (spotId: string) => {
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
  name: string;
  email: string;
  phone: string;
  dni: string;
  address: string;
  note?: string;
}) => {
  const booking = await db.booking.create({
    data: {
      status: "In_progress",
      totalPrice: data.totalPrice,
      subtotal: data.subtotal,
      startDate: data.startDate,
      endDate: data.endDate,
      spotId: data.spotId,
    },
    include: {
      spot: {
        select: { owner: { select: { subdomain: true, customDomain: true } } },
      },
    },
  });
  const guest = await addGuestToBooking({ ...data, bookingId: booking.id });

  revalidateTag(`${booking.spot.owner.subdomain}-${data.spotId}-metadata`);
  revalidateTag(`${booking.spot.owner.customDomain}-${data.spotId}-metadata`);

  return { ...booking, guest };
};

export const addOrUpdateTransaction = async (data: {
  amount: number;
  date: Date;
  description: string;
  status?: TransactionStatus;
  paymentType: string;
  bookingId: string;
  id?: string;
}) => {
  const transactionData = {
    amount: data.amount,
    paymentDate: data.date,
    status: data.status ?? TransactionStatus.Pending,
    description: data.description,
    paymentType: data.paymentType,
    booking: { connect: { id: data.bookingId } },
  };
  const transaction = await db.transaction.upsert({
    where: { id: data.id ?? "0" },
    update: transactionData,
    create: transactionData,
  });

  return transaction;
};

export const addGuestToBooking = async ({
  bookingId,
  name,
  email,
  phone,
  dni,
  address,
  note,
}: {
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  dni: string;
  address: string;
  note?: string;
}) => {
  const guest = await db.guest.create({
    data: {
      name,
      address,
      email,
      phone,
      note,
      dni,
      bookings: { connect: { id: bookingId } },
    },
  });

  return guest;
};

export const updateBooking = async (data: {
  id: string;
  status?: BookingStatus;
  subtotal?: number;
  startDate?: Date;
  endDate?: Date;
  guest?: {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    dni?: string;
    address?: string;
    note?: string;
  };
  spot?: string;
}) => {
  const booking = await db.booking.update({
    where: { id: data.id },
    data: {
      status: data.status,
      subtotal: data.subtotal,
      startDate: data.startDate,
      endDate: data.endDate,
      updatedAt: new Date(),
      ...(data.spot ? {spot: {connect: {id: data.spot}}}: {}),
      ...(data.guest ? { guest: { update: { ...data.guest } } } : {}),
    },
  });

  return booking;
};

export const handleWompiBookingPaymentEvent = async (
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
          paymentType: "Wompi",
          status: TransactionStatus.Approved,
          description: "Payment from Wompi integration!",
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
          paymentType: "Stripe",
          status: TransactionStatus.Approved,
          description: "Payment from Stripe integration!",
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
            currency: "USD",
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
