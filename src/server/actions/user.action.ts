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

export const updateStripeConnection = async (id: string, stripeAccountId: string) => {
  await db.user.update({
    where: { id },
    data: { stripeAccountId },
  });

  return true;
};

export const updateWompiConnection = async (id: string, wompiAccountId: Record<string, any>) => {
  await db.user.update({
    where: { id },
    data: { wompiAccountId },
  });

  return true;
};

export const getConnectedStripe = async (id: string) => {
  const user = await db.user.findFirst({
    where: { id },
    select: { stripeAccountId: true },
  });

  return user?.stripeAccountId;
};

export const getConnectWompi = async (id: string) => {
  const user = await db.user.findFirst({
    where: { id },
    select: { wompiAccountId: true },
  });

  return user?.wompiAccountId;
};

export const updateSiteSetting = async (id: string, formData: FormData) => {
  const siteName = formData.get("siteName") as string;
  const aboutUs = formData.get("aboutUs") as string;
  const defaultPaymentMethod = formData.get("defaultPaymentMethod") as string;
  const country = formData.get("country") as string;
  const currency = formData.get("currency") as string;
  const logo = formData.get("logo") as File | null | undefined;
  const favicon = formData.get("favicon") as File | null | undefined;

  const data: {
    siteName: string;
    aboutUs: string;
    logo?: string | null;
    favicon?: string | null;
    defaultPaymentMethod?: string
    country?: string
    currency?: string
  } = {
    siteName,
    aboutUs,
    defaultPaymentMethod,
    country,
    currency
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
      `favicon.webp`,
      favicon
    );
  }

  return await db.user.update({ where: { id }, data });
};