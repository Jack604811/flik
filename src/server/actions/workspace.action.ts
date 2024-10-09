"use server";

import { env } from "@/env";
import { db } from "../db";
import { uploadSiteImage } from "./supabase.action";
import { addDomainToVercel, clearDomainCache, removeDomainFromVercelProject, validDomainRegex } from "../helpers/domains";
import { getCurrentUser } from "../auth";
import { revalidatePath } from "next/cache";
import { updateCurrentWorkspace } from "./user.action"; 
import { v4 as uuidv4 } from 'uuid';
import { createHmac } from 'crypto';
import { WorkspaceInviteMagicLinkTemplate } from "@/emails/workspace/new-invitation";
import { Resend } from "resend";
import { TeamMemberStatus } from "@prisma/client";

const resend = new Resend(env.RESEND_API_KEY);

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
      teamMembers: { create: { userId: currentUser.id, role: "OWNER", status: TeamMemberStatus.Active } },
    },
  });

  // Set the newly created workspace as the user's current workspace
  await updateCurrentWorkspace(currentUser.id, newWorkspace.id);

  return newWorkspace;
};

export const getWorkspaces = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  // Fetch the workspaces owned by the current user
  const workspaces = await db.workspace.findMany({
    where: { ownerId: currentUser.id },
    select: { id: true, siteName: true },
  });

  // Fetch the user's currentWorkspaceId
  const user = await db.user.findFirst({
    where: { id: currentUser.id },
    select: { currentWorkspaceId: true },
  });

  return {
    workspaces,
    currentWorkspaceId: user?.currentWorkspaceId || null,
  }
}

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


export const sendInviteToWorkspace = async (workspaceId: string, email: string, permission: string) => {
  const currentUser = await getCurrentUser();
  const workspace = await db.workspace.findFirst({ where: { id: workspaceId } });

  if (!currentUser || !workspace) {
    throw new Error("User not authenticated");
  }

  // Send invitation email to the user and add them to the invited list
  const token = createHmac('sha256', env.NEXTAUTH_SECRET)
    .update(`${uuidv4()}${email}`)
    .digest('hex');

  await db.invitation.create({
    data: {
      email,
      permission,
      token,
      workspaceId,
      TeamMember: {
        create: {
          workspaceId,
          role: permission,
        }
      }
    },
  });

  // You can add code here to send the invitation email with the token

  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: email,
    subject: 'You have been invited to join a workspace',
    react: WorkspaceInviteMagicLinkTemplate({ link: `${env.NEXTAUTH_URL}/invite/${token}`, invitedBy: currentUser.name ?? "Someone", workspaceName: workspace.siteName! }),
    html: "",
  });

  return true;
}

export const checkIfInvitationExists = async (token: string) => {
  const invitation = await db.invitation.findFirst({ where: { token } });
  return invitation;
}

export const acceptWorkspaceInvite = async (token: string) => {
  const invitation = await db.invitation.findFirst({ where: { token } });

  if (!invitation) {
    throw new Error("Invalid invitation token");
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  // Add the user to the workspace
  await db.teamMember.create({
    data: {
      workspaceId: invitation.workspaceId,
      userId: currentUser.id,
      role: invitation.permission,
    },
  });

  // Delete the invitation
  await db.invitation.delete({ where: { token } });

  return true;
}

export const getTeamMembers = async (workspaceId: string) => {
  const currentUser = await getCurrentUser();
  const workspace = await db.workspace.findFirst({ where: { id: workspaceId } });

  if (!currentUser || !workspace) {
    throw new Error("User not authenticated");
  }
  const teamMembers = await db.teamMember.findMany({
    where: { workspaceId },
    include: { user: true, invitation: true },
  });

  return teamMembers;
}