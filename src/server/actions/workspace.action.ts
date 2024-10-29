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
import { WorkspaceRemovalNotificationTemplate } from "@/emails/workspace/delete-user";
import { Resend } from "resend";
import { TeamMember, TeamMemberStatus } from "@prisma/client";
import { getUserById } from "./auth.action";
import { FORBIDDEN_SUBDOMAINS } from "@/app-settings";

const resend = new Resend(env.RESEND_API_KEY);

export const createWorkspace = async (siteName: string) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  const apiKey = uuidv4();
  // Create the workspace
  const newWorkspace = await db.workspace.create({
    data: {
      siteName,
      ownerId: currentUser.id,
      apiKey,
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
    where: { OR: [{ teamMembers: { some: { userId: currentUser.id } } }, {ownerId: currentUser.id}] },
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
  if (FORBIDDEN_SUBDOMAINS.includes(subdomain.toLowerCase())) {
    throw new Error("The chosen subdomain is not allowed. Please choose a different subdomain.");
  }

  await db.workspace.update({
    where: { id },
    data: { subdomain },
  });

  return true;
};

export const updateCustomDomain = async (id: string, customDomain: string) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("User not authenticated");
  }
  const workspace = await db.workspace.findFirst({ where: { id } });
  let response;

  if (customDomain && customDomain.includes(env.NEXT_PUBLIC_ROOT_DOMAIN!)) {
    return {
      error: `Cannot use ${env.NEXT_PUBLIC_ROOT_DOMAIN} subdomain as your custom domain`,
    };
  } else if (customDomain && validDomainRegex.test(customDomain)) {
    await addDomainToVercel(customDomain);
  }

  if (workspace?.customDomain && workspace.customDomain !== customDomain) {
    await removeDomainFromVercelProject(workspace.customDomain);
  }

  response = await db.workspace.update({
    where: { id },
    data: { customDomain: customDomain || null },
  });

  clearDomainCache(workspace?.subdomain!, workspace?.customDomain!, "");
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

export const getWorkspaceAPIKey = async (id: string) => {
  const workspace = await db.workspace.findFirst({
    where: { id },
    select: { apiKey: true },
  });

  return workspace?.apiKey;
}

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

  if(subdomain) {
    if (FORBIDDEN_SUBDOMAINS.includes(subdomain.toLowerCase())) {
      throw new Error("The chosen subdomain is not allowed. Please choose a different subdomain.");
    }
    data.subdomain = subdomain;
  }
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
      token,
      teamMember: {
        create: {
          workspaceId,
          role: permission,
          status: TeamMemberStatus.Pending,
        }
      }
    },
  });

  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: email,
    subject: 'You have been invited to join a workspace',
    react: WorkspaceInviteMagicLinkTemplate({ link: `${env.NEXTAUTH_URL}/invite?token=${token}`, invitedBy: currentUser.name ?? "Someone", workspaceName: workspace.siteName! }),
    html: "",
  });

  return true;
}

export const deleteTeamMember = async (id: string) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("User not authenticated");
  }
  await db.teamMember.delete({ where: { id } });
}

export const updateTeamMember = async (id: string, data: Partial<TeamMember>) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("User not authenticated");
  }
  const updatedTeamMember = await db.teamMember.update({
    where: { id },
    data,
  });
  return updatedTeamMember;
}

export const checkIfInvitationExists = async (token: string) => {
  const invitation = await db.invitation.findFirst({ where: { token } });
  return invitation;
}

export const acceptWorkspaceInvite = async (token: string, userId: string) => {
  const invitation = await db.invitation.findFirst({ where: { token }});
  const user = await getUserById(userId);
  if (!invitation) {
    throw new Error("Invalid invitation token");
  }
  if (!user) {
    throw new Error("User not found");
  }

  if(invitation.email !== user.email){
    throw new Error("Email does not match the invitation");
  }

  // Add the user to the workspace
  await db.teamMember.update({
    where:  { id: invitation.teamMemberId },
    data: {
      userId: user.id,
      status: TeamMemberStatus.Active,
      joinedAt: new Date(),
    },
    
  });

  // Delete the user
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



export const removeUserFromWorkspace = async (workspaceId: string, email: string) => {
  const currentUser = await getCurrentUser();
  const workspace = await db.workspace.findFirst({ where: { id: workspaceId } });

  if (!currentUser || !workspace) {
    throw new Error("User not authenticated or workspace not found");
  }

  // Fetch the team member to ensure they exist and to get their userId
  const teamMember = await db.teamMember.findFirst({
    where: {
      workspaceId,
      user: { email },
    },
    include: { user: true },
  });

  if (!teamMember) {
    throw new Error("Team member not found");
  }

  // Authorization: Only Owners or Admins can remove members
  if (teamMember.role === "OWNER" && currentUser.id !== teamMember.userId) {
    throw new Error("Cannot remove the owner of the workspace");
  }

  // Remove the user from the workspace
  const deletionResult = await db.teamMember.delete({
    where: {
      id: teamMember.id,
    },
  });

  // Send removal email only if deletion was successful
  if (deletionResult) {
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: email,
      subject: 'You have been removed from the workspace',
      react: WorkspaceRemovalNotificationTemplate({
        removedBy: currentUser.name ?? "Admin",
        workspaceName: workspace.siteName!,
      }),
      html: "",
    });
  }

  return true;
};

