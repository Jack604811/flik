"use server";

import { unstable_cache } from "next/cache";
import { db } from "../db";
import { SpotStatus } from "@prisma/client";

export const getSiteData = async (domain: string) => {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  const fetcher = unstable_cache(
    async () =>
      db.user.findUnique({
        where: subdomain ? { subdomain } : { customDomain: domain },
        include: {
          spots: {
            where: { status: SpotStatus.Public },
            include: { images: true },
          },
        },
      }),
    [`${domain}-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-metadata`],
    }
  );

  return await fetcher();
};
export const getSiteSpotData = async (domain: string, spotId: string) => {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  const fetcher = unstable_cache(
    async () =>
      db.spot.findFirst({
        where: {
          OR: [{ id: spotId }, { path: spotId }],
          owner: subdomain ? { subdomain } : { customDomain: domain },
          status: SpotStatus.Public,
        },
        include: {
          images: true,
          owner: true,
          bookings: {
            where: { startDate: { gte: new Date() } },
            select: { id: true, startDate: true, endDate: true },
          },
        },
      }),
    [`${domain}-${spotId}-metadata`],
    {
      revalidate: 1,
      tags: [`${domain}-${spotId}-metadata`],
    }
  );

  return await fetcher();
};

export const getSpotBooking = async (domain: string, bookingId: string) => {
  domain = decodeURIComponent(domain);
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  const booking = await db.booking.findFirst({
    where: {
      id: bookingId,
      spot: { owner: subdomain ? { subdomain } : { customDomain: domain } },
    },
    include: {
      guest: true,
      spot: { select: { name: true, description: true } },
    },
  });

  return booking;
};