"use server";

import { env } from "@/env";
import { db } from "../db";
import { uploadSiteImage } from "./supabase.action";
import { addDomainToVercel, clearDomainCache, removeDomainFromVercelProject, validDomainRegex } from "../helpers/domains";
import { getCurrentUser } from "../auth";
import { revalidatePath } from "next/cache";
import { updateCurrentWorkspace } from "./user.action"; 

export const createWorkspace = async (siteName: string) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  // Create the workspace
  const newWorkspace = await db.workspace.create({
    data: {
      siteName,
      ownerId: currentUser.id,
    },
  });

  // Set the newly created workspace as the user's current workspace
  await updateCurrentWorkspace(currentUser.id, newWorkspace.id);

  return newWorkspace;
};


export const getWorkspace = (id: string) => {
  const workspace = db.workspace.findFirst({ where: { id } });
  return workspace;
};

export const updateWorkspace = async (
  id: string,
  data: { siteName: string; aboutUs: string }
) => {
  const workspace = await db.workspace.update({
    where: { id },
    data: { ...data },
  });

  return workspace;
};

export const updateSubdomain = async (id: string, subdomain: string) => {
  await db.workspace.update({
    where: { id },
    data: { subdomain },
  });

  return true;
};

export const updateCustomDomain = async (id: string, customDomain: string) => {
  const currentUser = await getCurrentUser();
  const workspace = await db.workspace.findFirst({ where: { ownerId: currentUser?.id! } });
  let response;

  if(customDomain.includes(env.NEXT_PUBLIC_ROOT_DOMAIN!)){
    return {
      error: `Cannot use ${env.NEXT_PUBLIC_ROOT_DOMAIN} subdomain as your custom domain`,
    };
  } else if(validDomainRegex.test(customDomain)){
    await Promise.all([
      addDomainToVercel(customDomain),
    ]);
  }

  if(workspace?.customDomain && workspace.customDomain !== customDomain){
    response = await removeDomainFromVercelProject(workspace.customDomain);
  }

  response = await db.workspace.update({
    where: { id },
    data: { customDomain: customDomain ?? null },
  });

  clearDomainCache(response.subdomain, workspace?.customDomain!, "");
  revalidatePath("");

  return response;
};

export const getSubdomain = async (id: string) => {
  const workspace = await db.workspace.findFirst({
    where: { id },
    select: { subdomain: true },
  });

  return workspace?.subdomain;
};

export const updateStripeConnection = async (id: string, stripeAccountId: string) => {
  await db.workspace.update({
    where: { id },
    data: { stripeAccountId },
  });

  return true;
};

export const updateWompiConnection = async (id: string, wompiAccountId: Record<string, any>) => {
  await db.workspace.update({
    where: { id },
    data: { wompiAccountId },
  });

  return true;
};

export const getConnectedStripe = async (id: string) => {
  const workspace = await db.workspace.findFirst({
    where: { id },
    select: { stripeAccountId: true },
  });

  return workspace?.stripeAccountId;
};

export const getConnectWompi = async (id: string) => {
  const workspace = await db.workspace.findFirst({
    where: { id },
    select: { wompiAccountId: true },
  });

  return workspace?.wompiAccountId;
};

export const updateSiteSetting = async (id: string, formData: FormData) => {
  const siteName = formData.get("siteName") as string;
  const subdomain = formData.get("subdomain") as string;
  const aboutUs = formData.get("aboutUs") as string;
  const defaultPaymentMethod = formData.get("defaultPaymentMethod") as string;
  const country = formData.get("country") as string;
  const currency = formData.get("currency") as string;
  const logo = formData.get("logo") as File | null | undefined;
  const favicon = formData.get("favicon") as File | null | undefined;

  const data: {
    siteName?: string;
    aboutUs?: string;
    logo?: string | null;
    favicon?: string | null;
    defaultPaymentMethod?: string;
    country?: string;
    currency?: string;
    subdomain?: string;
  } = {};

  if(subdomain) data.subdomain = subdomain;
  if(siteName) data.siteName = siteName;
  if(aboutUs) data.aboutUs = aboutUs;
  if(country) data.country = country;
  if(currency) data.currency = currency;
  if(defaultPaymentMethod) data.defaultPaymentMethod = defaultPaymentMethod;

  if (logo) {
    data.logo = await uploadSiteImage(id, `logo.webp`, logo);
  }
  if (favicon) {
    data.favicon = await uploadSiteImage(id, `favicon.webp`, favicon);
  }

  const updatedSettings = await db.workspace.update({ where: { id }, data });

  clearDomainCache(updatedSettings.subdomain, updatedSettings.customDomain, "");

  return updatedSettings;
};
