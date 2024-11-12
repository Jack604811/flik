"use server";
import { db } from "../db";


export const getWebhooks = async (workspaceId: string) => {
    const webhooks = await db.webhook.findMany({ where: { workspaceId } });
    return webhooks;
};

export const createWebhook = async (data: { provider?: string, workspaceId: string, url: string, secret?:string }) => {
    const webhook = await db.webhook.create({ data });
    return webhook;
}

export const deleteWebhook = async (id: string) => {
    const webhook = await db.webhook.delete({where: {id}});

    return webhook;
}


export const handleWebhook = async (workspaceId: string, type: string, previous: any, current: any) => {
    const webhooks = await getWebhooks(workspaceId);

    for (const webhook of webhooks) {
        // Send webhook
        console.log(`Sending webhook to ${webhook.url}`);
        const response = await fetch(webhook.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-TOKEN": webhook.secret || ""
            },
            body: JSON.stringify({
                type,
                previous,
                current
            })
        });
        console.log(`Webhook response: ${response.status}`);
    }
}