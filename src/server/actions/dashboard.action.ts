"use server";
import { BookingStatus, TransactionStatus, } from "@prisma/client";
import { db } from "../db";

export const getTotalCardsMetric = async (
  userId: string,
  startDate: Date,
  endDate: Date
) => {
  try {
    const aggregateResult = await db.transaction.aggregate({
      _sum: { amount: true },
      where: {
        booking: { spot: { userId } },
        AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
      },
    });

    const totalRevenue = aggregateResult?._sum?.amount || 0; // Guarding against undefined

    const totalBookings = await db.booking.count({
      where: { spot: { userId }, AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }] },
    });

    const records = await db.bookingExtras.findMany({
      where: { extra: { userId }, AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }] },
      select: { quantity: true, price: true },
    });

    const totalExtraSales = records.reduce((sum, record) => {
      return sum + (record.price * record.quantity);
    }, 0);

    const totalBookingsAmount = await db.booking.aggregate({
      _sum: { subtotal: true },
      where: { spot: { userId }, AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }] },
    });

    const totalBookingsAmountValue = totalBookingsAmount?._sum?.subtotal || 0; // Guarding against undefined

    const outstanding = totalBookingsAmountValue - totalRevenue;

    return {
      totalBookings, 
      totalRevenue,
      totalExtraSales,
      outstanding
    };
  } catch (error) {
    return {
      totalBookings: 0,
      totalRevenue: 0,
      totalExtraSales: 0,
      outstanding: 0
    };
  }
};

export const getBookingsByDates = async (
  userId: string,
  startDate: Date,
  endDate: Date
) => {
  const bookings = await db.booking.findMany({
    where: { spot: {userId }, AND: [{ createdAt: {gte: startDate}}, { createdAt: {lte: endDate}}] },
    include: {
      customer: true,
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
    where: { spot: { userId }, AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }] },
  });

  // Ensure that the data is valid before accessing _count
  return bookingGroups.map((data, i) => ({
    status: data.status ? data.status.toLocaleLowerCase() : 'unknown',
    count: data._count?.status || 0, // Guarding against undefined
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
    by: ["paymentMethod"],
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

export const getTotalSalesByDateRange = async (
  userId: string,
  startDate: Date,
  endDate: Date
) => {
  const salesData = await db.booking.groupBy({
    by: ["createdAt"],
    _count: {
      _all: true,
    },
    _sum: {
      subtotal: true,
    },
    where: {
      spot: { userId },
      AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return salesData.map(data => ({
    date: data.createdAt.toISOString().split('T')[0], // Format date as YYYY-MM-DD
    sales: data._count._all,
    income: data._sum.subtotal || 0, // Guarding against undefined
  }));
};

export const getBookingsGroupedByMonth = async (
  userId: string,
  startDate: Date,
  endDate: Date
) => {
  const bookingGroups = await db.booking.groupBy({
    by: ["status", "createdAt"],
    _count: {
      _all: true,
    },
    where: {
      spot: { userId },
      AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
      status: { in: [BookingStatus.Cancelled, BookingStatus.Confirmed] },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const chartData = monthNames.map((month, index) => ({
    month,
    bookings: 0,
    cancellations: 0,
  }));

  bookingGroups.forEach(group => {
    const monthIndex = new Date(group.createdAt).getMonth();
    if (group.status === BookingStatus.Confirmed) {
      chartData[monthIndex].bookings += group._count._all;
    } else if (group.status === BookingStatus.Cancelled) {
      chartData[monthIndex].cancellations += group._count._all;
    }
  });

  return chartData;
};

export const getSpotsAndExtrasMetrics = async (
  userId: string,
  startDate: Date,
  endDate: Date
) => {
  const spots = await db.spot.findMany({
    where: { userId },
    include: {
      bookings: {
        where: { createdAt: { gte: startDate, lte: endDate } },
        select: {
          id: true,
          transactions: {
            select: { amount: true },
            where: { status: TransactionStatus.Approved },
          },
        },
      },
    },
  });

  const extras = await db.extras.findMany({
    where: { userId },
    include: {
      bookingExtras: {
        where: { createdAt: { gte: startDate, lte: endDate } },
        select: { quantity: true, price: true },
      },
    },
  });

  const spotsMetrics = spots.map(spot => {
    const bookingsCount = spot.bookings.length;
    const revenue = spot.bookings.reduce((sum, booking) => {
      return sum + booking.transactions.reduce((tSum, transaction) => tSum + transaction.amount, 0);
    }, 0);

    // Placeholder values for visits, occupancyRate, and clickThroughRate
    const visits = 0;
    const occupancyRate = "0%";
    const clickThroughRate = "0%";

    return {
      product: spot.name,
      bookings: bookingsCount.toString(),
      revenue: revenue.toFixed(2),
      visits: visits.toString(),
      occupancyRate,
      clickThroughRate,
    };
  });

  const extrasMetrics = extras.map(extra => {
    const totalSales = extra.bookingExtras.reduce((sum, bookingExtra) => sum + bookingExtra.quantity, 0);
    const revenue = extra.bookingExtras.reduce((sum, bookingExtra) => sum + (bookingExtra.price * bookingExtra.quantity), 0);

    // Placeholder value for clickThroughRate
    const clickThroughRate = "0%";

    return {
      product: extra.name,
      totalSales: totalSales.toString(),
      revenue: revenue.toFixed(2),
      clickThroughRate,
    };
  });

  return {
    spots: spotsMetrics,
    extras: extrasMetrics,
    total: {
      spots: spotsMetrics.length,
      extras: extrasMetrics.length,
    },
  };
};