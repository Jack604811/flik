"use server";

import { CustomFieldType } from "@prisma/client";
import { db } from "../db";
import { getCurrentUser } from "../auth";

// create functions to create, update, delete, and get custom fields
export const createCustomField = async (data: {
  workspaceId: string;
  fieldName: string;
  fieldType: CustomFieldType;
  isRequired: boolean;
  options?: string[];
}) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("User not found");
  }
  const newCustomField = {...data, options: data.options ? JSON.stringify(data.options) : undefined};

  const customField = await db.customField.create({
    data: { ...newCustomField, createdById: currentUser.id },
  });

  return customField;
};

export const updateCustomField = async (data: {
  id: string;
  fieldName?: string;
  fieldType?: CustomFieldType;
  isRequired?: boolean;
  options?: string[];
}) => {
const updatedCustomField = {...data, options: data.options ? JSON.stringify(data.options) : undefined};
  const customField = await db.customField.update({
    where: { id: data.id },
    data: { ...updatedCustomField },
  });

  return customField;
};

export const duplicateCustomField = async (id: string) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  // Fetch the original custom field
  const originalField = await db.customField.findUnique({
    where: { id },
  });

  if (!originalField) {
    throw new Error("Custom field not found");
  }

  // Duplicate the original field data
  const duplicatedField = await db.customField.create({
    data: {
      workspaceId: originalField.workspaceId,
      fieldName: `${originalField.fieldName} (Copy)`,
      fieldType: originalField.fieldType as CustomFieldType,
      isRequired: originalField.isRequired,
      options: originalField.options, // Keep options as is
      createdById: currentUser.id,
    },
  });

  return duplicatedField;
};

export const deleteCustomField = async (id: string) => {
  const customField = await db.customField.delete({
    where: { id },
  });

  return customField;
};

export const getCustomFields = async (workspaceId: string) => {
  const customFields = await db.customField.findMany({
    where: { workspaceId },
    include: { createdBy: { select: { name: true, email: true } } },
  });

  return customFields;
};

export const getCustomFieldById = async (id: string) => {
  const customField = await db.customField.findFirst({
    where: { id },
  });

  return customField;
};
