"use server";
import { ExtrasStatus } from "@prisma/client";
import { db } from "../db";
import {
  deleteImageFromStorageObject,
  deleteImagesFromStorage,
  uploadImageToStorage,
} from "./supabase.action";

export const getExtrasByUser = async ({ userId }: { userId: string }) => {
  const spots = await db.extras.findMany({
    where: { userId },
    include: { images: true, _count: { select: { bookingExtras: true } } },
  });
  return spots;
};

type NEW_EXTRA_PARAMS = {
  userId: string;
  name: string;
  description: string;
  status: ExtrasStatus;
  price: number;
  categoryId?: string | null;
  subCategoryId?: string | null;
  files: FormData;
};

export const createNewExtra = async ({
  userId,
  name,
  description,
  status,
  price,
  files,
  categoryId,
  subCategoryId
}: NEW_EXTRA_PARAMS) => {
  const extra = await db.extras.create({
    data: {
      name,
      description,
      status,
      userId,
      price,
      categoryId,
      subCategoryId
    },
  });
  await updateExtra({
    id: extra.id,
    userId,
    name,
    description,
    status,
    files,
    price,
    categoryId,
    subCategoryId
  });

  return extra;
};

export const updateExtra = async ({
  userId,
  name,
  description,
  status,
  id,
  price,
  files,
  categoryId,
  subCategoryId
}: NEW_EXTRA_PARAMS & { id: string }) => {
  const imageFiles = files.getAll("files") as File[];
  let images = await Promise.all(
    imageFiles.map((file) =>
      uploadImageToStorage({ file, userId, objectId: id, path: "extras" })
    )
  );

  const extra = await db.extras.update({
    where: { id },
    data: {
      name,
      description,
      status,
      price,
      userId,
      images: {
        createMany: { data: images.map((img) => ({ url: img!.url })) },
      },
      categoryId,
      subCategoryId
    },
  });

  return extra;
};
export const getExtraById = async (id: string) => {
  const extra = await db.extras.findFirst({
    where: { id },
    include: { owner: true, images: true },
    orderBy: { createdAt: "desc" },
  });

  return extra;
};

export const deleteExtra = async (id: string) => {
  const extra = await db.extras.findFirst({
    where: { id },
  });
  await db.extras.delete({ where: { id } });
  await db.extrasImages.deleteMany({ where: { extraId: id } });
  await deleteImagesFromStorage({
    userId: extra!.userId,
    objectId: id,
    path: "extras",
  });

  return true;
};

export const deleteExtraImage = async (id: string) => {
  const exImage = await db.extrasImages.delete({
    where: { id },
    include: { Extras: true },
  });
  await deleteImageFromStorageObject({
    objectId: exImage.extraId,
    id,
    userId: exImage.Extras.userId,
    path: "extras",
  });

  return true;
};

export const createCategory = async ({
  userId,
  categoryName,
}: {
  userId: string;
  categoryName: string;
}) => {
  const category = await db.category.create({
    data: { userId, name: categoryName },
  });

  return category;
};

export const createSubCategory = async ({
  categoryId,
  subCategoryName,
}: {
  categoryId: string;
  subCategoryName: string;
}) => {
  const subCategory = await db.subCategory.create({
    data: { categoryId, name: subCategoryName },
  });

  return subCategory;
};

export const getCategories = async ({ userId }: { userId: string }) => {
  const categories = await db.category.findMany({
    where: { userId },
    include: { subCategories: true },
  });
  return categories;
};
