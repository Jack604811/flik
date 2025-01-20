"use server";
import { SpotStatus } from "@prisma/client";
import { db } from "../db";
import {
  deleteSpotImageSB,
  deleteSpotImages,
  uploadSpotImage,
} from "./supabase.action";
import { clearDomainCache } from "../helpers/domains";

export const getSpotsByWorkspace = async ({ workspaceId }: { workspaceId: string }) => {
  const spots = await db.spot.findMany({
    where: { workspaceId },
    include: { images: true },
  });
  return spots;
};

type NEW_SPOT_PARAMS = {
  workspaceId: string;
  name: string;
  description: string;
  status: SpotStatus;
  units: number;
  duration: number;
  durationType: string;
  workingHours: any;
  price: number;
  files: FormData;
  amenities?: string[],
  path?:string,
  extras: string[]
};

export const createNewSpot = async ({
  workspaceId,
  name,
  description,
  status,
  units,
  workingHours,
  price,
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
      workspaceId,
      units,
      workingHours,
      price,
      duration,
      durationType,
      amenities,
      path,
    },
  });
  await updateSpot({
    id: spot.id,
    workspaceId,
    name,
    description,
    status,
    units,
    workingHours,
    price,
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
  workspaceId,
  name,
  description,
  status,
  units,
  workingHours,
  price,
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
    imageFiles.map((file) => uploadSpotImage({ file, workspaceId, spotId: id }))
  );

  const spot = await db.spot.update({
    where: { id },
    data: {
      name,
      description,
      status,
      workspaceId,
      units,
      workingHours,
      price,
      duration,
      durationType,
      amenities,
      path,
      images: {
        createMany: { data: images.map((img) => ({ url: img!.url })) },
      },
      extras: {connect: extras.map(ex => ({id: ex}))}
    },
    include: { workspace: true }
  });

  clearDomainCache(spot!.workspace.subdomain, spot!.workspace.customDomain, spot?.id!)

  return spot;
};
export const getSpotById = async (id: string) => {
  const spot = await db.spot.findFirst({
    where: { id },
    include: { workspace: true, images: true, extras: { select: {id: true, name: true}} },
    orderBy: { createdAt: "desc"}
  });

  return spot;
};

export const deleteSpot = async (id: string) => {
  const spot = await db.spot.findFirst({
    where: { id },
    include: {workspace: true}
  });
  await db.spot.delete({ where: { id } });
  await db.spotImages.deleteMany({where: {spotId: id}})
  await deleteSpotImages({ workspaceId: spot!.workspaceId, spotId: id });

  clearDomainCache(spot!.workspace.subdomain, spot!.workspace.customDomain, spot?.id!)

  return true;
};

export const deleteSpotImage = async (id: string) => {
  const sImage = await db.spotImages.delete({where: {id}, include: {spot: true}});
  await deleteSpotImageSB({spotId: sImage.spotId, id, workspaceId: sImage.spot.workspaceId});
  
  return true
}