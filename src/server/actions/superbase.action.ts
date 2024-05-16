import supabase from "../helpers/supabase";
import {v4 as uuidv4} from "uuid";
export const uploadSpotImage = async ({
  file,
  spotId,
  userId,
}: {
  file: File;
  spotId: string;
  userId: string;
}) =>
  supabase.storage
    .from("spots")
    .upload(`${userId}/${spotId}/${uuidv4()}_${file.name}`, file);

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
