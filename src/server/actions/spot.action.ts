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
  price: number;
  minGuest: number;
};

export const createNewSpot = async ({
  userId,
  name,
  description,
  status,
  images,
  price,
  minGuest,
}: NEW_SPOT_PARAMS) => {
  const spot = await db.spot.create({
    data: { name, description, status, price, minGuest, userId },
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
