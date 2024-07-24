import supabase from "../helpers/supabase";
import { v4 as uuidv4 } from "uuid";

export const uploadSpotImage = async ({
  file,
  spotId,
  userId,
}: {
  file: File;
  spotId: string;
  userId: string;
}) => {
  const { data, error } = await supabase.storage
    .from("spots")
    .upload(`${userId}/${spotId}/${uuidv4()}_${file.name}`, file);
  if (error) return null;
  return {
    url: supabase.storage.from("spots").getPublicUrl(data!.path).data.publicUrl,
  };
};

export const uploadImageToStorage = async ({
  file,
  objectId,
  userId,
  path
}: {
  file: File;
  objectId: string;
  userId: string;
  path: string
}) => {
  const { data, error } = await supabase.storage
    .from(path)
    .upload(`${userId}/${objectId}/${uuidv4()}_${file.name}`, file);
  if (error) return null;
  return {
    url: supabase.storage.from(path).getPublicUrl(data!.path).data.publicUrl,
  };
};

export const getImagesFromStorage = async ({
  userId,
  path,
  objectId,
}: {
  userId: string;
  objectId: string;
  path: string
}) => {
  const { data, error } = await supabase.storage
    .from(path)
    .list(`${userId}/${objectId}`);

  const images = data
    ?.filter((f) => f.metadata.mimetype !== "application/octet-stream")
    .map((f) => {
      const pUrl = supabase.storage
        .from(path)
        .getPublicUrl(`${userId}/${objectId}/${f.name}`);
      return { url: pUrl.data.publicUrl, name: f.name };
    });
  return images;
};

export const deleteImagesFromStorage = async ({
  userId,
  objectId,
  path
}: {
  userId: string;
  objectId: string;
  path: string
}) => supabase.storage.from(path).remove([`${userId}/${objectId}`]);

export const deleteImageFromStorageObject = async ({
  userId,
  objectId,
  id,
  path
}: {
  userId: string;
  objectId: string;
  id: string;
  path: string
}) => supabase.storage.from(path).remove([`${userId}/${objectId}/${id}`]);


export const getSpotImages = async ({
  userId,
  spotId,
}: {
  userId: string;
  spotId: string;
}) => {
  const { data, error } = await supabase.storage
    .from("spots")
    .list(`${userId}/${spotId}`);

  const images = data
    ?.filter((f) => f.metadata.mimetype !== "application/octet-stream")
    .map((f) => {
      const pUrl = supabase.storage
        .from("spots")
        .getPublicUrl(`${userId}/${spotId}/${f.name}`);
      return { url: pUrl.data.publicUrl, name: f.name };
    });
  return images;
};

export const deleteSpotImages = async ({
  userId,
  spotId,
}: {
  userId: string;
  spotId: string;
}) => supabase.storage.from("spots").remove([`${userId}/${spotId}`]);

export const deleteSpotImageSB = async ({
  userId,
  spotId,
  id,
}: {
  userId: string;
  spotId: string;
  id: string;
}) => supabase.storage.from("spots").remove([`${userId}/${spotId}/${id}`]);

export const uploadSiteImage = async (
  userId: string,
  fileName: string,
  file: File
) =>{
  const url = await supabase.storage
  .from("sites")
  .upload(`${userId}/${fileName}`, file, { upsert: true })
  .then(({ data, error }) => {
    console.log(data, error)
    if (!data?.path) return null;
    return supabase.storage.from("sites").getPublicUrl(`${userId}/${fileName}`)
      .data.publicUrl;
  });

  console.log(url)
  return url
}
