"use server";
import { WebNotification } from "@prisma/client";
import { db } from "../db";
import webpush, { PushSubscription } from 'web-push'
 
webpush.setVapidDetails(
  'mailto:info@flik.so',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function getWebNotificationSubscription(userId: string, workspaceId: string, authKey?: string) {
  const subscription = await db.webNotification.findFirst({
    where: {
      userId,
      workspaceId,
      authKey
    }
  });
  return subscription;
}

export async function handleWebNotificationUnsubscribe(userId: string, workspaceId: string, authKey: string) {
  // Remove subscription for this workspace
  await db.webNotification.delete({
    where: {
      userId_workspaceId_authKey: {
        userId,
        workspaceId,
        authKey
      }
    }
  });

  // Check if user has any remaining subscriptions
  const remainingSubscriptions = await db.webNotification.findFirst({
    where: {
      userId,
      authKey
    }
  });

  // If no remaining subscriptions, return true to indicate browser should unsubscribe
  return !remainingSubscriptions;
}

export async function handleWebNotificationSubscribe(
  userId: string, 
  workspaceId: string, 
  authKey: string, 
  subscription: PushSubscription
) {
  await db.webNotification.create({
    data: {
      userId,
      workspaceId,
      authKey,
      subscription: subscription as any
    }
  });
}

export const sendWebNotification = async ({ message, workspaceId, userId}: {
    message: string,
    workspaceId: string,
    userId: string
}) => {
    const webNotification = await db.webNotification.findMany({
      where: {
        workspaceId,
        userId
      }
    })
    if (!webNotification.length) {
      return;
    }
    for (const notification of webNotification) {
        const subscription = JSON.parse(notification.subscription?.toString()!) as PushSubscription;

        const payload = JSON.stringify({
          title: "Flik - New Notification",
          message,
        })
        const options: webpush.RequestOptions = {
          TTL: 60,
        }
      
        webpush.sendNotification(subscription, payload, options)
    }
    return true;
}