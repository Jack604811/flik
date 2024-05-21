"use server";

import { db } from "../db";

export const getBookings = async (ownerId: string) => {
    const bookings = await db.booking.findMany({
        where: { guest: { ownerId } }
    })

    return bookings;
}