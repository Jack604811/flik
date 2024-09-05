"use server";
import { TransactionStatus, } from "@prisma/client";
import { db } from "../db";

export const getTotalCardsMetric = async (
  userId: string,
  startDate: Date,
  endDate: Date
) => {
  const { _sum: { amount: totalRevenue } } = await db.transaction.aggregate({
    _sum: {amount: true},
    where: {
      booking: { spot: { userId } },
      AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
      // status: TransactionStatus.Approved
    },
  })

  const totalBookings = await db.booking.count({
    where: { spot: {userId }, AND: [{ createdAt: {gte: startDate}}, { createdAt: {lte: endDate}}] },
  })

  const records = await db.bookingExtras.findMany({
    where: {extra: { userId }, AND: [{ createdAt: {gte: startDate}}, { createdAt: {lte: endDate}}]},
    select: {quantity: true, price: true}
  })
  const totalExtraSales = records.reduce((sum, record) => {
    return sum + (record.price * record.quantity);
  }, 0);


return {
  totalBookings, 
  totalRevenue,
  totalExtraSales
}

}

export const getBookingsByDates = async (
  userId: string,
  startDate: Date,
  endDate: Date
) => {
  const bookings = await db.booking.findMany({
    where: { spot: {userId }, AND: [{ createdAt: {gte: startDate}}, { createdAt: {lte: endDate}}] },
    include: {
      guest: true,
      transactions: {
        select: { amount: true },
        where: { status: TransactionStatus.Approved },
      },
      bookingExtras: { select: { price: true, quantity: true } },
    },
    take: 5,
  });

  return bookings;
};

export const getBookingStatusGroupTotal = async (
  userId: string,
  startDate: Date,
  endDate: Date
) => {
  const bookingGroups = await db.booking.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
    where: { spot: {userId }, AND: [{ createdAt: {gte: startDate}}, { createdAt: {lte: endDate}}] },
  });

  return bookingGroups.map((data, i) => ({
    status: data.status.toLocaleLowerCase(),
    count: data._count.status,
  }));
};

export const getIncomeMetricData = async (
  userId: string,
  startDate: Date,
  endDate: Date
) => {
  const incomeMetrics = await db.transaction.aggregate({
    _count: true,
    _avg: { amount: true },
    _sum: { amount: true },
    where: {
      booking: { spot: { userId } },
      AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
      status: TransactionStatus.Approved
    },
  });
  const paymentMethodMetrics = await db.transaction.groupBy({
    by: ["paymentType"],
    _sum: { amount: true },
    _count: true,
    where: {
        booking: { spot: { userId } },
        AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
        status: TransactionStatus.Approved
      },
  });


  return { incomeMetrics, paymentMethodMetrics }
};