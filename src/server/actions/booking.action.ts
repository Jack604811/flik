"use server";

import { db } from "../db";

export const getBookings = async (ownerId: string) => {
  const bookings = await db.booking.findMany({
    where: { spot: { userId: ownerId } },
    include: { spot: true, guest: true },
  });

  return bookings;
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
      status: "Pending",
      totalPrice: data.totalPrice,
      subtotal: data.subtotal,
      startDate: data.startDate,
      endDate: data.endDate,
      spotId: data.spotId,
    },
  });
  const guest = await addGuestToBooking({ ...data, bookingId: booking.id });

  return { ...booking, guest };
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
