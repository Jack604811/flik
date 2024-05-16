"use server";
import { SpotStatus } from "@prisma/client";
import { db } from "../db";
import { getSpotImages } from "./superbase.action";

export const getSpotsByUser = async ({ userId }: { userId: string }) => {
  const spots = await db.spot.findMany({
    where: { userId },
  });
  const newSpots = spots.map(async (spot) => {
    const images = await getSpotImages({userId: spot!.userId, spotId: spot!.id});
    const nSpot = {...spot, images: images??[]}

    return nSpot
  } )
  return Promise.all(newSpots);
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
  allowAdditionalGuest: boolean;
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
  allowAdditionalGuest,
}: NEW_SPOT_PARAMS) => {
  const spot = await db.spot.create({
    data: {
      name,
      description,
      status,
      maxGuest,
      userId,
      units,
      workingHours,
      allowAdditionalGuest,
      additionalGuestPrice,
    },
  });

  return spot;
};

export const updateSpot = async ({
  userId,
  name,
  description,
  status,
  images,
  maxGuest,
  units,
  workingHours,
  additionalGuestPrice,
  allowAdditionalGuest,
  id
}: NEW_SPOT_PARAMS & { id: string }) => {
  const spot = await db.spot.update({
    where: {id},
    data: {
      name,
      description,
      status,
      maxGuest,
      userId,
      units,
      workingHours,
      allowAdditionalGuest,
      additionalGuestPrice,
    },
  });

  return spot;
};
export const getSpotById = async (id: string) => {
  const spot = await db.spot.findFirst({
    where: { id },
    include: { owner: true},
  });

  if(spot){
    const images = await getSpotImages({userId: spot!.userId, spotId: spot!.id});
    Object.assign(spot, {images})
  }

  return spot;
};
