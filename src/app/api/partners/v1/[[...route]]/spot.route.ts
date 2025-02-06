import { createNewSpot, deleteSpot, getSpotById, getSpotsByWorkspace } from "@/server/actions/spot.action";
import { API_APP_TYPE } from "@/types/api";
import { createRoute, z } from '@hono/zod-openapi';
import { validateAPIKey } from "./api.key.validate";
import { OpenAPIHono } from "@hono/zod-openapi";

const spotRoutes = new OpenAPIHono<API_APP_TYPE>();
spotRoutes.use("*", validateAPIKey);

const addSpotSchema = z.object({
    name: z.string(),
    description: z.string(),
    status: z.enum(["Private", "Public", "Disabled"]),
    path: z.string().optional(),
    units: z.number().optional(),
    maxGuest: z.number().optional(),
    duration: z.number().optional(),
    durationType: z.string().optional(),
    amenities: z.array(z.string()).optional(),
    allowAdditionalGuest: z.boolean().optional(),
    additionalGuestPrice: z.number().optional(),
    workingHours: z.array(z.any()).optional(),
    files: z.array(z.instanceof(File)).openapi({ type: "array", items: { type: "string", format: "binary" }})
});

const addSpotRoute = createRoute({
    method: "post",
    path: "/",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: addSpotSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: "Spot added",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("spot.create"),
                        data: z.object({})
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
    security: [
        {
            "x-token": []
        }
    ]
});


const getSpotsRoute = createRoute({
    method: "get",
    path: "/",
    responses: {
        200: {
            description: "Get spots by workspace",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("spots"),
                        data: z.array(z.object({
                            // Define your spot schema here
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

spotRoutes.openapi(getSpotsRoute, async (c) => {
    const data = await getSpotsByWorkspace({ workspaceId: c.get("workspace").id });
    return c.json({ status: "success" as const, type: "spots" as const, data }, 200);
});

const getSpotByIdRoute = createRoute({
    method: "get",
    path: "/{id}",
    request: {
        params: z.object({ id: z.string().openapi({ description: "The ID of the booking" }) })
    },
    responses: {
        200: {
            description: "Get booking by ID",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("booking"),
                        data: z.object({
                            // Define your booking schema here
                        })
                    })
                }
            }
        },
        404: {
            description: "Booking not found",
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

spotRoutes.openapi(getSpotByIdRoute, async (c) => {
    const id = c.req.valid("param").id;
    try {
        const data = await getSpotById(id);
        if (!data) {
            return c.json({ status: "error" as const, error: "Booking not found!" }, 404);
        }
        return c.json({ status: "success" as const, type: "booking" as const, data }, 200);
    } catch (e) {
        return c.json({ status: "error" as const, error: "Booking not found!" }, 404);
    }
});

const deleteSpotRoute = createRoute({
    method: "delete",
    path: "/{id}",
    request: {
        params: z.object({ id: z.string().openapi({ description: "The ID of the spot to delete" }) })
    },
    responses: {
        200: {
            description: "Spot deleted",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("spot.delete")
                    })
                }
            }
        },
        404: {
            description: "Spot not found",
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

spotRoutes.openapi(deleteSpotRoute, async (c) => {
    const id = c.req.valid("param").id;
    try {
        await deleteSpot(id);
        return c.json({ status: "success" as const, type: "spot.delete" as const }, 200);
    }catch(e){
        return c.json({ status: "error" as const, error: "Spot not found!" }, 404);
    }
});

export default spotRoutes;