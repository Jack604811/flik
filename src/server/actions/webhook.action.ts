"use server";
import { db } from "../db";


export const getWebhooks = async (workspaceId: string) => {
    const webhooks = await db.webhook.findMany({ where: { workspaceId } });
    return webhooks;
};

export const createWebhook = async (data: { provider?: string, workspaceId: string, url: string, secret?:string, events: string[] }) => {
    const webhook = await db.webhook.create({ data });
    return webhook;
}

export const deleteWebhook = async (id: string) => {
    const webhook = await db.webhook.delete({where: {id}});

    return webhook;
}


export const handleWebhook = async (type: string, workspaceId: string, previous: any, current: any) => {
    const webhooks = await db.webhook.findMany({ where: { workspaceId, events: {has: type} } });
    console.log(`Found ${webhooks.length} webhooks for workspace ${workspaceId} and event ${type}`);

    for (const webhook of webhooks) {
        // Send webhook
        const response = await fetch(webhook.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type,
                previous,
                current
            })
        });
        // TODO: Handle response and update webhook status so that we can retry if it fails 
        // and also disable the webhook if it fails too many times
        console.log(`Webhook response: ${response.status} - ${webhook.url}`, JSON.stringify({
            type,
            previous,
            current
        }));
    }
}