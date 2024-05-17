"use server";

import { db } from "../db";

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
