"use server";
import { BookingStatus, TransactionStatus, } from "@prisma/client";
import { db } from "../db";

export const getTotalCardsMetric = async (
  workspaceId: string | null, 
  startDate: Date,
  endDate: Date
) => {
  try {
    // Fetch all bookings in the date range, including related transactions and extras
    const bookingsWithPayments = await db.booking.findMany({
      where: {
        spot: {
          workspace: workspaceId ? { id: workspaceId } : undefined,
        },
        AND: [
          { startDate: { gte: startDate } },
          { endDate: { lte: endDate } },
        ],
      },
      include: {
        transactions: {
          select: { amount: true },  // Select only the payment amounts
          where: { status: "Approved" },  // Include only approved payments
        },
        bookingExtras: {  // Include extras to calculate the total amount
          select: { price: true, quantity: true },
        },
      },
    });

    let totalBookings = 0;
    let totalRevenue = 0;
    let totalOutstanding = 0;

    // Loop through each booking to calculate totals
    bookingsWithPayments.forEach((booking) => {
      // Calculate the total for extras
      const extrasTotal = booking.bookingExtras.reduce(
        (total, extra) => total + extra.price * extra.quantity,
        0
      );

      // Calculate the full total for the booking (subtotal + extras)
      const totalForBooking = booking.subtotal + extrasTotal;

      // Calculate the total payments made for this booking
      const paymentsMade = booking.transactions.reduce(
        (total, transaction) => total + transaction.amount,
        0
      );

      // Calculate outstanding amount (total - payments made)
      const outstandingForBooking = totalForBooking - paymentsMade;

      // Add the totals to the global totals
      totalBookings += 1;
      totalRevenue += totalForBooking;  // Use the total, not just the subtotal

      // Handle negative outstanding (overpayments)
      if (outstandingForBooking < 0) {
        // Add overpayment to revenue
        totalRevenue += Math.abs(outstandingForBooking);
      } else {
        // Only add positive outstanding amounts to the total outstanding
        totalOutstanding += outstandingForBooking;
      }
    });

    // Now calculate total extra sales from booking extras (this remains the same)
    const records = await db.bookingExtras.findMany({
      where: {
        extra: { workspace: workspaceId ? { id: workspaceId } : undefined },
        AND: [
          { createdAt: { gte: startDate } },
          { createdAt: { lte: endDate } },
        ],
      },
      select: { quantity: true, price: true },
    });

    const totalExtraSales = records.reduce((sum, record) => {
      return sum + record.price * record.quantity;
    }, 0);

    return {
      totalBookings,
      totalRevenue,  // Now this represents the total bookings (including extras and overpayments)
      totalExtraSales,
      outstanding: totalOutstanding,  // Only positive outstanding amounts
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
        { startDate: { gte: startDate } },
        { startDate: { lte: endDate } },
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
  const bookingGroups = await db.booking.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
    where: {
      spot: {
        workspace: workspaceId ? { id: workspaceId } : undefined,
      },
      AND: [
        { startDate: { gte: startDate } }, 
        { startDate: { lte: endDate } },
      ],
    },
  });

  return bookingGroups.map((data) => ({
    status: data.status ? data.status.toLocaleLowerCase() : 'unknown',
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
    date: data.createdAt.toISOString().split('T')[0], 
    sales: data._count._all,
    income: data._sum.subtotal || 0, 
  }));
};

export const getBookingsGroupedByMonth = async (
  workspaceId: string | null,
  startDate: Date,
  endDate: Date
) => {
  const bookingGroups = await db.booking.groupBy({
    by: ["status", "startDate"],
    _count: {
      _all: true, 
    },
    where: {
      spot: {
        workspace: workspaceId ? { id: workspaceId } : undefined,
      },
      AND: [
        { startDate: { gte: startDate } },
        { startDate: { lte: endDate } },
      ],
    },
    orderBy: {
      startDate: 'asc',
    },
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const chartData = monthNames.map((month) => ({
    month,
    confirmed: 0,
    cancelled: 0,
    waiting_for_payment: 0,
    in_progress: 0,
  }));

  bookingGroups.forEach(group => {
    if (group.startDate) {
      const monthIndex = new Date(group.startDate).getMonth();
      switch (group.status.toLowerCase()) {
        case 'confirmed':
          chartData[monthIndex].confirmed += group._count._all;
          break;
        case 'cancelled':
          chartData[monthIndex].cancelled += group._count._all;
          break;
        case 'waiting_for_payment':
          chartData[monthIndex].waiting_for_payment += group._count._all;
          break;
        case 'in_progress':
          chartData[monthIndex].in_progress += group._count._all;
          break;
      }
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