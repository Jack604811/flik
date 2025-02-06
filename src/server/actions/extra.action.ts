"use server";
import { ExtrasStatus } from "@prisma/client";
import { db } from "../db";
import {
  deleteImageFromStorageObject,
  deleteImagesFromStorage,
  uploadImageToStorage,
} from "./supabase.action";

export const getExtrasByWorkspace = async ({ workspaceId }: { workspaceId: string }) => {
  const spots = await db.extras.findMany({
    where: { workspaceId },
    include: { images: true, _count: { select: { bookingExtras: true } } },
  });
  return spots;
};

type NEW_EXTRA_PARAMS = {
  workspaceId: string;
  name: string;
  description: string;
  status: ExtrasStatus;
  price: number;
  categoryId?: string | null;
  subCategoryId?: string | null;
  files: FormData;
};

export const createNewExtra = async ({
  workspaceId,
  name,
  description,
  status,
  price,
  files,
  categoryId,
  subCategoryId,
}: NEW_EXTRA_PARAMS) => {
  const extra = await db.extras.create({
    data: {
      name,
      description,
      status,
      workspaceId,
      price,
      categoryId,
      subCategoryId,
    },
  });
  await updateExtra({
    id: extra.id,
    workspaceId,
    name,
    description,
    status,
    files,
    price,
    categoryId,
    subCategoryId,
  });

  return extra;
};

export const updateExtra = async ({
  workspaceId,
  name,
  description,
  status,
  id,
  price,
  files,
  categoryId,
  subCategoryId,
}: NEW_EXTRA_PARAMS & { id: string }) => {
  const imageFiles = files.getAll("files") as File[];
  let images = await Promise.all(
    imageFiles.map((file) =>
      uploadImageToStorage({ file, workspaceId, objectId: id, path: "extras" })
    )
  );

  const extra = await db.extras.update({
    where: { id },
    data: {
      name,
      description,
      status,
      price,
      workspaceId,
      images: {
        createMany: { data: images.map((img) => ({ url: img!.url })) },
      },
      categoryId,
      subCategoryId,
    },
  });

  return extra;
};
export const getExtraById = async (id: string) => {
  const extra = await db.extras.findFirst({
    where: { id },
    include: { workspace: true, images: true },
    orderBy: { createdAt: "desc" },
  });

  return extra;
};

export const getExtrasBySpotId = async (spotId: string) => {
  const extra = await db.extras.findMany({
    where: { spots: { every: { id: spotId } } },
    include: {category: true, subCategory: true, images: true},
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
    workspaceId: extra!.workspaceId,
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
    workspaceId: exImage.Extras.workspaceId,
    path: "extras",
  });

  return true;
};

export const createCategory = async ({
  workspaceId,
  categoryName,
}: {
  workspaceId: string;
  categoryName: string;
}) => {
  const category = await db.category.create({
    data: { workspaceId, name: categoryName },
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

export const getCategories = async ({ workspaceId }: { workspaceId: string }) => {
  try {
    const categories = await db.category.findMany({
      where: { workspaceId },
      include: { subCategories: true },
    });

    if (!categories) {
      console.log(`No categories found for workspace: ${workspaceId}`);
      return [];
    }

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return []; // Return an empty array in case of any error
  }
};

export const getCategory = async({workspaceId, id}: {workspaceId: string, id: string}) => {
  const category = await db.category.findFirst({
    where: { workspaceId, id },
    include: { subCategories: true },
  });

  return category;
}


export const updateCategory = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
  const category = await db.category.update({ where: { id }, data: { name } });

  return category;
};
export const updateSubCategory = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
  const subCategory = await db.subCategory.update({
    where: { id },
    data: { name },
  });

  return subCategory;
};

export const deleteCategory = async (id: string) => {
  const category = await db.category.delete({ where: { id } });
  return category;
};

export const deleteSubCategory = async (id: string) => {
  const subCategory = await db.subCategory.delete({ where: { id } });
  return subCategory;
};