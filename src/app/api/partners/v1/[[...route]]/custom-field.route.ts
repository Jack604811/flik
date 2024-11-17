import { API_APP_TYPE } from "@/types/api";
import { createRoute, z } from '@hono/zod-openapi'
import { validateAPIKey } from "./api.key.validate";
import { OpenAPIHono } from "@hono/zod-openapi";
import { db } from "@/server/db";
import { CustomFieldType } from "@prisma/client";

const customFieldRoutes = new OpenAPIHono<API_APP_TYPE>()
customFieldRoutes.use("*", validateAPIKey);


const getCustomFieldsRoute = createRoute({
    method: "get",
    path: "/",
    responses: {
        200: {
            description: "Custom fields",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        data: z.array(z.object({
                            id: z.string(),
                            fieldName: z.string(),
                            fieldType: z.string(),
                            isRequired: z.boolean().optional(),
                            options: z.array(z.string()).optional()
                        }))
                    })
                }
            }
        }
    },
    security: [
        {
            "x-token": []
        }
    ]
});

customFieldRoutes.openapi(getCustomFieldsRoute, async (c) => {
    const customFields = await db.customField.findMany({ where: { workspaceId: c.get("workspace").id } });
    return c.json({ status: "success" as const, data: customFields.map(cf => ({...cf, options: cf.options ? JSON.parse(cf.options) : null })) }, 200);
});

const createCustomFieldSchema = z.object({
    fieldName: z.string(),
    fieldType: z.nativeEnum(CustomFieldType).openapi({ description: "The type of the custom field", enum: Object.values(CustomFieldType) }),
    placeholder: z.string().optional(),
    isRequired: z.boolean().optional(),
    options: z.array(z.string()).optional()
});

const createCustomFieldRoute = createRoute({
    method: "post",
    path: "/",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: createCustomFieldSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: "Custom field created",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        data: z.object({
                            id: z.string(),
                            fieldName: z.string(),
                            fieldType: z.string(),
                            placeholder: z.string().optional(),
                            isRequired: z.boolean().optional(),
                            options: z.array(z.string()).optional()
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
            "x-token": []
        }
    ]
})

customFieldRoutes.openapi(createCustomFieldRoute, async (c) => {
    const body = c.req.valid("json");

    try {
        const customField = await db.customField.create({ data: {
            workspaceId: c.get("workspace").id,
            ...body,
            createdById: c.get("workspace").ownerId,
            options: body.options ? JSON.stringify(body.options) : undefined
        } });
        return c.json({ status: "success" as const, data: {...customField, options: customField.options ? JSON.parse(customField.options) : null } }, 200);
    }catch(e){
        return c.json({ status: "error" as const, error: "Invalid request!" }, 400);
    }
});


const updateCustomFieldSchema = z.object({
    id: z.string().openapi({ description: "The ID of the custom field to update" }),
    fieldName: z.string().optional(),
    fieldType: z.nativeEnum(CustomFieldType).optional(),
    placeholder: z.string().optional(),
    isRequired: z.boolean().optional(),
    options: z.array(z.string()).optional()
});

const updateCustomFieldRoute = createRoute({
    method: "put",
    path: "/",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: updateCustomFieldSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: "Custom field updated",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        data: z.object({
                            id: z.string(),
                            fieldName: z.string(),
                            fieldType: z.string(),
                            isRequired: z.boolean().optional(),
                            options: z.array(z.string()).optional()
                        })
                    })
                },
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
            "x-token": []
        }
    ]
})

customFieldRoutes.openapi(updateCustomFieldRoute, async (c) => {
    const body = c.req.valid("json");

    try {
        const customField = await db.customField.update({
            where: { id: body.id },
            data: {
                ...body,
                options: body.options ? JSON.stringify(body.options) : undefined
            }
        });
        return c.json({ status: "success" as const, data: {...customField, options: customField.options ? JSON.parse(customField.options) : null } }, 200);
    }catch(e){
        return c.json({ status: "error" as const, error: "Invalid request!" }, 400);
    }
});


const deleteCustomFieldRoute = createRoute({
    method: "delete",
    path: "/{id}",
    request: {
        params: z.object({ id: z.string().openapi({ description: "The ID of the custom field to delete" }) })
    },
    responses: {
        200: {
            description: "Custom Field deleted",
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
            description: "Custom Field not found",
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
            "x-token": []
        }
    ]
});

customFieldRoutes.openapi(deleteCustomFieldRoute, async (c) => {
    const id = c.req.valid("param").id;
    try {
        await db.customField.delete({where: {id}});
        return c.json({ status: "success" as const, message: "Custom Field deleted" }, 200);
    } catch (e) {
        return c.json({ status: "error" as const, error: "Custom Field not found!" }, 404);
    }
});


export default customFieldRoutes;
