
import { createWebhook, deleteWebhook, getWebhooks } from "@/server/actions/webhook.action";
import { API_APP_TYPE } from "@/types/api";
import { createRoute, z } from '@hono/zod-openapi'
import { validateAPIKey } from "./api.key.validate";
import { OpenAPIHono } from "@hono/zod-openapi";

const hookRoutes = new OpenAPIHono<API_APP_TYPE>()
hookRoutes.use("*", validateAPIKey);


const getWebhooksRoute = createRoute({
    method: "get",
    path: "/",
    responses: {
        200: {
            description: "Webhooks",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        data: z.array(z.object({
                            id: z.string(),
                            url: z.string(),
                            secret: z.string().nullable(),
                            provider: z.string().nullable(),
                            events: z.array(z.string())
                        }))
                    })
                }
            }
        }
    },
    security: [
        {
            "X-TOKEN": []
        }
    ]
});

hookRoutes.openapi(getWebhooksRoute, async (c) => {
    const webhooks = await getWebhooks(c.get("workspace").id);
    return c.json({ status: "success" as const, data: webhooks }, 200);
});

const createWebhookSchema = z.object({
    url: z.string().url().openapi({ description: "The URL to send the webhook to"}),
    secret: z.string().optional().openapi({ description: "The secret to sign the webhook"}),
    provider: z.string().optional().openapi({ description: "The provider of the webhook"}),
    events: z.array(z.string()).openapi({ description: "The events to listen to"})
});

const createWebhookRoute = createRoute({
    method: "post",
    path: "/",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: createWebhookSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: "Webhook created",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        data: z.object({
                            id: z.string(),
                            url: z.string(),
                            secret: z.string().nullable(),
                            provider: z.string().nullable(),
                        })
                    })
                }
            }
        },
        400: {
            description: "Invalid request",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("error"),
                        error: z.string()
                    })
                }
            }
        }
    },
    security:[
        {
            "X-TOKEN": []
        }
    ],
})

hookRoutes.openapi(createWebhookRoute, async (c) => {
    const body = c.req.valid("json");
    try {
        const webhook = await createWebhook({ workspaceId: c.get("workspace").id, ...body });
        return c.json({ status: "success" as const, data: webhook }, 200);
    }catch(e){
        return c.json({ status: "error" as const, error: "Invalid request!" }, 400);
    }
});


const deleteWebhookRoute = createRoute({
    method: "delete",
    path: "/{id}",
    request: {
        params: z.object({ id: z.string().openapi({ description: "The ID of the webhook to delete" }) })
    },
    responses: {
        200: {
            description: "Webhook deleted",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        message: z.string()
                    })
                }
            }
        },
        404: {
            description: "Webhook not found",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("error"),
                        error: z.string()
                    })
                }
            }
        }
    },
    security: [
        {
            "X-TOKEN": []
        }
    ]
});

hookRoutes.openapi(deleteWebhookRoute, async (c) => {
    const id = c.req.valid("param").id;
    console.log(id)
    try {
        await deleteWebhook(id);
        return c.json({ status: "success" as const, message: "Webhook deleted" }, 200);
    } catch (e) {
        return c.json({ status: "error" as const, error: "Webhook not found!" }, 404);
    }
});


export default hookRoutes;
