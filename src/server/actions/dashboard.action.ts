"use server";
import { BookingStatus, TransactionStatus, } from "@prisma/client";
import { db } from "../db";

export const getTotalCardsMetric = async (
  workspaceId: string | null, // Workspace ID is used instead of userId
  startDate: Date,
  endDate: Date
) => {
  try {
    // Sum up all approved transactions (this should include all payments, not refunds)
    const aggregateResult = await db.transaction.aggregate({
      _sum: { amount: true },
      where: {
        booking: { spot: { workspace: workspaceId ? { id: workspaceId } : undefined } },
        AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
        status: "Approved", // Make sure we only include approved payments
      },
    });

    const totalRevenue = aggregateResult?._sum?.amount || 0; // Guarding against undefined values

    // Count total bookings
    const totalBookings = await db.booking.count({
      where: {
        spot: { workspace: workspaceId ? { id: workspaceId } : undefined },
        AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
      },
    });

    // Calculate total extra sales from booking extras
    const records = await db.bookingExtras.findMany({
      where: {
        extra: { workspace: workspaceId ? { id: workspaceId } : undefined },
        AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
      },
      select: { quantity: true, price: true },
    });

    const totalExtraSales = records.reduce((sum, record) => {
      return sum + record.price * record.quantity;
    }, 0);

    // Sum up all booking subtotals (this should represent the total booking value)
    const totalBookingsAmount = await db.booking.aggregate({
      _sum: { subtotal: true },
      where: {
        spot: { workspace: workspaceId ? { id: workspaceId } : undefined },
        AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
      },
    });

    const totalBookingsAmountValue = totalBookingsAmount?._sum?.subtotal || 0;

    // Adjust the outstanding calculation: totalBookingAmount - totalRevenue
    const outstanding = totalBookingsAmountValue - totalRevenue;

    return {
      totalBookings,
      totalRevenue,
      totalExtraSales,
      outstanding,
    };
  } catch (error) {
    return {
      totalBookings: 0,
      totalRevenue: 0,
      totalExtraSales: 0,
      outstanding: 0,
    };
  }
};



export const getBookingsByDates = async (
  workspaceId: string | null,
  startDate: Date,
  endDate: Date,
  skip: number = 0,
  take: number = 5 // Default to 5 items per page
) => {
  if (!workspaceId) {
    throw new Error("Workspace ID is required to fetch bookings.");
  }

  const bookings = await db.booking.findMany({
    where: {
      spot: {
        workspace: { id: workspaceId },
      },
      AND: [
        { createdAt: { gte: startDate } },
        { createdAt: { lte: endDate } },
      ],
    },
    include: {
      customer: true,
      transactions: {
        select: { amount: true },
        where: { status: TransactionStatus.Approved },
      },
      bookingExtras: { select: { price: true, quantity: true } },
    },
    skip,
    take,
  });

  return bookings;
};


export const getBookingStatusGroupTotal = async (
  workspaceId: string | null,
  startDate: Date,
  endDate: Date
) => {
  if (!workspaceId) {
    return [];
  }
  const bookingGroups = await db.booking.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
    where: {
      spot: { workspace: { id: workspaceId } }, // No need for userId anymore
      AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
    },
  });
  return bookingGroups.map((data) => ({
    status: data.status ? data.status.toLocaleLowerCase() : 'unknown', // Ensure status is in lowercase
    count: data._count?.status || 0, 
  }));
};


export const getIncomeMetricData = async (
  workspaceId: string | null, 
  startDate: Date,
  endDate: Date
) => {
  // Aggregate income metrics based on `paymentDate`
  const incomeMetrics = await db.transaction.aggregate({
    _count: true,
    _avg: { amount: true },
    _sum: { amount: true },
    where: {
      booking: {
        spot: {
          workspace: workspaceId ? { id: workspaceId } : undefined,
        },
      },
      AND: [{ paymentDate: { gte: startDate } }, { paymentDate: { lte: endDate } }],
      status: TransactionStatus.Approved,
    },
  });

  const paymentMethodMetrics = await db.transaction.groupBy({
    by: ["paymentMethod"],
    _sum: { amount: true },
    _count: true,
    where: {
      booking: {
        spot: {
          workspace: workspaceId ? { id: workspaceId } : undefined,
        },
      },
      AND: [{ paymentDate: { gte: startDate } }, { paymentDate: { lte: endDate } }],
      status: TransactionStatus.Approved,
    },
  });
  // Group by payment method and paymentDate
  const chartsPaymentMetrics = await db.transaction.groupBy({
    by: ["paymentMethod", "paymentDate"], 
    _sum: { amount: true },
    _count: true,
    where: {
      booking: {
        spot: {
          workspace: workspaceId ? { id: workspaceId } : undefined,
        },
      },
      AND: [{ paymentDate: { gte: startDate } }, { paymentDate: { lte: endDate } }],
      status: TransactionStatus.Approved,
    },
  });

  // Return income metrics and payment method breakdown
  return { incomeMetrics, paymentMethodMetrics, chartsPaymentMetrics };
};



export const getTotalSalesByDateRange = async (
    userId: string,
  workspaceId: string | null,
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
      spot: { workspace: workspaceId ? { id: workspaceId } : { ownerId: userId }  },
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
  workspaceId: string | null,
  startDate: Date,
  endDate: Date
) => {
  const bookingGroups = await db.booking.groupBy({
    by: ["status", "createdAt"],
    _count: {
      _all: true,
    },
    where: {
      spot: { workspace: workspaceId ? { id: workspaceId } : { ownerId: userId }  },
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
  workspaceId: string | null,
  startDate: Date,
  endDate: Date
) => {
  const spots = await db.spot.findMany({
    where: { workspace: workspaceId ? { id: workspaceId } : { ownerId: userId }  },
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
      images: {
        take: 1, // Fetch only one image
        select: { url: true },
      },
    },
  });

  const extras = await db.extras.findMany({
    where: { workspace: workspaceId ? { id: workspaceId } : { ownerId: userId }  },
    include: {
      bookingExtras: {
        where: { createdAt: { gte: startDate, lte: endDate } },
        select: { quantity: true, price: true },
      },
      images: {
        take: 1, // Fetch only one image
        select: { url: true },
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
      image: spot.images[0]?.url || null, // Guarding against undefined
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
      image: extra.images[0]?.url || null, // Guarding against undefined
    };
  });

  const totalSpotsRevenue = spotsMetrics.reduce((sum, spot) => sum + parseFloat(spot.revenue), 0);
  const totalExtrasRevenue = extrasMetrics.reduce((sum, extra) => sum + parseFloat(extra.revenue), 0);

  return {
    spots: spotsMetrics,
    extras: extrasMetrics,
    total: {
      spots: totalSpotsRevenue,
      extras: totalExtrasRevenue,
    },
  };
};