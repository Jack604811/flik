import supabase from "../helpers/supabase";
import { v4 as uuidv4 } from "uuid";

export const uploadSpotImage = async ({
  file,
  spotId,
  workspaceId,
}: {
  file: File;
  spotId: string;
  workspaceId: string;
}) => {
  const { data, error } = await supabase.storage
    .from("spots")
    .upload(`${workspaceId}/${spotId}/${uuidv4()}_${file.name}`, file);
  if (error) return null;
  return {
    url: supabase.storage.from("spots").getPublicUrl(data!.path).data.publicUrl,
  };
};

export const uploadImageToStorage = async ({
  file,
  objectId,
  workspaceId,
  path
}: {
  file: File;
  objectId: string;
  workspaceId: string;
  path: string
}) => {
  const { data, error } = await supabase.storage
    .from(path)
    .upload(`${workspaceId}/${objectId}/${uuidv4()}_${file.name}`, file);
  if (error) return null;
  return {
    url: supabase.storage.from(path).getPublicUrl(data!.path).data.publicUrl,
  };
};

export const getImagesFromStorage = async ({
  workspaceId,
  path,
  objectId,
}: {
  workspaceId: string;
  objectId: string;
  path: string
}) => {
  const { data, error } = await supabase.storage
    .from(path)
    .list(`${workspaceId}/${objectId}`);

  const images = data
    ?.filter((f) => f.metadata.mimetype !== "application/octet-stream")
    .map((f) => {
      const pUrl = supabase.storage
        .from(path)
        .getPublicUrl(`${workspaceId}/${objectId}/${f.name}`);
      return { url: pUrl.data.publicUrl, name: f.name };
    });
  return images;
};

export const deleteImagesFromStorage = async ({
  workspaceId,
  objectId,
  path
}: {
  workspaceId: string;
  objectId: string;
  path: string
}) => supabase.storage.from(path).remove([`${workspaceId}/${objectId}`]);

export const deleteImageFromStorageObject = async ({
  workspaceId,
  objectId,
  id,
  path
}: {
  workspaceId: string;
  objectId: string;
  id: string;
  path: string
}) => supabase.storage.from(path).remove([`${workspaceId}/${objectId}/${id}`]);


export const getSpotImages = async ({
  workspaceId,
  spotId,
}: {
  workspaceId: string;
  spotId: string;
}) => {
  const { data, error } = await supabase.storage
    .from("spots")
    .list(`${workspaceId}/${spotId}`);

  const images = data
    ?.filter((f) => f.metadata.mimetype !== "application/octet-stream")
    .map((f) => {
      const pUrl = supabase.storage
        .from("spots")
        .getPublicUrl(`${workspaceId}/${spotId}/${f.name}`);
      return { url: pUrl.data.publicUrl, name: f.name };
    });
  return images;
};

export const deleteSpotImages = async ({
  workspaceId,
  spotId,
}: {
  workspaceId: string;
  spotId: string;
}) => supabase.storage.from("spots").remove([`${workspaceId}/${spotId}`]);

export const deleteSpotImageSB = async ({
  workspaceId,
  spotId,
  id,
}: {
  workspaceId: string;
  spotId: string;
  id: string;
}) => supabase.storage.from("spots").remove([`${workspaceId}/${spotId}/${id}`]);

export const uploadSiteImage = async (
  workspaceId: string,
  fileName: string,
  file: File
) =>{
  const url = await supabase.storage
  .from("sites")
  .upload(`${workspaceId}/${fileName}`, file, { upsert: true })
  .then(({ data, error }) => {
    console.log(data, error)
    if (!data?.path) return null;
    return supabase.storage.from("sites").getPublicUrl(`${workspaceId}/${fileName}`)
      .data.publicUrl;
  });

  console.log(url)
  return url
}
