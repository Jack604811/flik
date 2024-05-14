"use server";
import { SpotStatus } from "@prisma/client";
import { db } from "../db";

export const getSpotsByUser = async ({ userId }: { userId: string }) => {
  const spots = db.spot.findMany({
    where: { userId },
  });
  return spots;
};

type NEW_SPOT_PARAMS = {
  userId: string;
  name: string;
  description: string;
  status: SpotStatus;
  images: String[];
  maxGuest: number;
  units: number;
  workingHours: any;
  additionalGuestPrice: number;
  allowAdditionalGuest: boolean
};

export const createNewSpot = async ({
  userId,
  name,
  description,
  status,
  images,
  maxGuest,
  units,
  workingHours,
  additionalGuestPrice,
  allowAdditionalGuest
}: NEW_SPOT_PARAMS) => {
  const spot = await db.spot.create({
    data: { name, description, status, maxGuest, userId, units, workingHours, allowAdditionalGuest, additionalGuestPrice },
  });

  return spot;
};

export const getSpotById = async (id: string) => {
  const spot = await db.spot.findFirst({
    where: { id },
    include: { owner: true, images: true },
  });

  return spot
};
