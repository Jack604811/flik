"use server";

import { db } from "../db";
import { uploadSiteImage } from "./superbase.action";

export const getUser = (id: string) => {
  const user = db.user.findFirst({ where: { id } });
  return user;
};

export const updateUser = async (
  id: string,
  data: { name: string; email: string }
) => {
  const user = await db.user.update({
    where: { id },
    data: { ...data },
  });

  return user;
};

export const updateSubdomain = async (id: string, subdomain: string) => {
  await db.user.update({
    where: { id },
    data: { subdomain },
  });

  return true;
};

export const getSubdomain = async (id: string) => {
  const user = await db.user.findFirst({
    where: { id },
    select: { subdomain: true },
  });

  return user?.subdomain;
};

export const updateSiteSetting = async (id: string, formData: FormData) => {
  const siteName = formData.get("siteName") as string;
  const logo = formData.get("logo") as File | null | undefined;
  const favicon = formData.get("favicon") as File | null | undefined;

  const data: {
    siteName: string;
    logo?: string | null;
    favicon?: string | null;
  } = {
    siteName,
  };

  if (logo) {
    data.logo = await uploadSiteImage(
      id,
      `logo.webp`,
      logo
    );
  }
  if (favicon) {
    data.favicon = await uploadSiteImage(
      id,
      `logo.webp`,
      favicon
    );
  }

  return await db.user.update({ where: { id }, data });
};
