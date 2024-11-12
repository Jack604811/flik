"use server";

import { env } from "@/env";
import { db } from "../db";
import { uploadSiteImage } from "./supabase.action";
import { addDomainToVercel, clearDomainCache, removeDomainFromVercelProject, validDomainRegex } from "../helpers/domains";
import { getCurrentUser } from "../auth";
import { revalidatePath } from "next/cache";

// Fetch the user
export const getUser = (id: string) => {
  return db.user.findFirst({ where: { id } });
};

// Update the user profile
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

// Update the current workspace for the user
export const updateCurrentWorkspace = async (userId: string, workspaceId: string) => {
  return await db.user.update({
    where: { id: userId },
    data: { currentWorkspaceId: workspaceId },
  });
};

// Fetch the current workspace of the user
export const getCurrentWorkspace = async (workspaceId?: string) => {
  if (workspaceId) {
    return db.workspace.findFirst({ where: { id: workspaceId } });
  }

  // Logic to get the current user's workspace if no workspaceId is provided
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return null;
  }
  
  const user = await db.user.findFirst({
    where: { id: currentUser.id },
    select: { currentWorkspaceId: true },
  });

  if (!user?.currentWorkspaceId) {
    return null;
  }

  return db.workspace.findFirst({
    where: { id: user.currentWorkspaceId },
  });
};

