"use server";
import { SpotStatus } from "@prisma/client";
import { db } from "../db";
import {
  deleteSpotImageSB,
  deleteSpotImages,
  uploadSpotImage,
} from "./supabase.action";
import { clearDomainCache } from "../helpers/domains";

export const getSpotsByUser = async ({ userId }: { userId: string }) => {
  const spots = await db.spot.findMany({
    where: { userId },
    include: { images: true },
  });
  return spots;
};

type NEW_SPOT_PARAMS = {
  userId: string;
  name: string;
  description: string;
  status: SpotStatus;
  maxGuest: number;
  units: number;
  duration: number;
  durationType: string;
  workingHours: any;
  additionalGuestPrice: number;
  allowAdditionalGuest: boolean;
  files: FormData;
  amenities: string[],
  path?:string,
  extras: string[]
};

export const createNewSpot = async ({
  userId,
  name,
  description,
  status,
  maxGuest,
  units,
  workingHours,
  additionalGuestPrice,
  allowAdditionalGuest,
  duration,
  durationType,
  files,
  amenities,
  path,
  extras
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
      duration,
      durationType,
      amenities,
      path,
    },
  });
  await updateSpot({
    id: spot.id,
    userId,
    name,
    description,
    status,
    maxGuest,
    units,
    workingHours,
    additionalGuestPrice,
    allowAdditionalGuest,
    duration,
    durationType,
    files,
    amenities,
    path,
    extras
  });

  return spot;
};

export const updateSpot = async ({
  userId,
  name,
  description,
  status,
  maxGuest,
  units,
  workingHours,
  additionalGuestPrice,
  allowAdditionalGuest,
  id,
  files,
  duration,
  durationType,
  amenities,
  path,
  extras
}: NEW_SPOT_PARAMS & { id: string }) => {
  const imageFiles = files.getAll("files") as File[];
  let images = await Promise.all(
    imageFiles.map((file) => uploadSpotImage({ file, userId, spotId: id }))
  );

  const spot = await db.spot.update({
    where: { id },
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
      duration,
      durationType,
      amenities,
      path,
      images: {
        createMany: { data: images.map((img) => ({ url: img!.url })) },
      },
      extras: {connect: extras.map(ex => ({id: ex}))}
    },
    include: { owner: true }
  });

  clearDomainCache(spot!.owner.subdomain, spot!.owner.customDomain, spot?.id!)

  return spot;
};
export const getSpotById = async (id: string) => {
  const spot = await db.spot.findFirst({
    where: { id },
    include: { owner: true, images: true, extras: { select: {id: true, name: true}} },
    orderBy: { createdAt: "desc"}
  });

  return spot;
};

export const deleteSpot = async (id: string) => {
  const spot = await db.spot.findFirst({
    where: { id },
    include: {owner: true}
  });
  await db.spot.delete({ where: { id } });
  await db.spotImages.deleteMany({where: {spotId: id}})
  await deleteSpotImages({ userId: spot!.userId, spotId: id });

  clearDomainCache(spot!.owner.subdomain, spot!.owner.customDomain, spot?.id!)

  return true;
};

export const deleteSpotImage = async (id: string) => {
  const sImage = await db.spotImages.delete({where: {id}, include: {spot: true}});
  await deleteSpotImageSB({spotId: sImage.spotId, id, userId: sImage.spot.userId});
  
  return true
}