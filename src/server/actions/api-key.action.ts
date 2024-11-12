"use server";
import { Permission } from "@prisma/client";
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";
import { createHmac } from "crypto";
import { env } from "@/env";

export const getApiKey = async (id: string) => {
  const apiKey = await db.apiKey.findFirst({
    where: { id },
  });
  return apiKey;
};

export const getApiKeys = async (workspaceId: string) => {
  const apiKeys = await db.apiKey.findMany({ where: { workspaceId } });
  return apiKeys;
};

export const createApiKey = async ({
  workspaceId,
  name,
  permission,
}: {
  workspaceId: string;
  name: string;
  permission: Permission;
}) => {
  const key = "fl_" + createHmac('sha256', env.NEXTAUTH_SECRET)
  .update(uuidv4())
  .digest('hex');
  
  const apiKey = await db.apiKey.create({
    data: {
      workspaceId,
      name,
      permission,
      key,
    },
  });
  return apiKey;
};

export const updateApiKey = async ({
  id,
  name,
  permission,
}: {
  id: string;
  name: string;
  permission: Permission;
}) => {
  const apiKey = await db.apiKey.update({
    where: { id },
    data: {
      name,
      permission,
    },
  });
  return apiKey;
};

export const deleteApiKey = async (id: string) => {
  const apiKey = await db.apiKey.delete({
    where: { id },
  });
  return apiKey;
};
