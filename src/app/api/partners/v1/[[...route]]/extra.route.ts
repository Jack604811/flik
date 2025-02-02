import { createNewExtra, deleteExtra, getExtraById, getExtrasByWorkspace, getCategories, getCategory } from "@/server/actions/extra.action";
import { API_APP_TYPE } from "@/types/api";
import { createRoute, z } from '@hono/zod-openapi';
import { validateAPIKey } from "./api.key.validate";
import { OpenAPIHono } from "@hono/zod-openapi";
import { ExtrasStatus } from "@prisma/client";

const extraRoutes = new OpenAPIHono<API_APP_TYPE>();
extraRoutes.use("*", validateAPIKey);

const addExtraSchema = z.object({
    name: z.string(),
    description: z.string(),
    status: z.nativeEnum(ExtrasStatus).default(ExtrasStatus.Private),
    price: z.string().transform(str => parseFloat(str)).openapi({type: "number"}),
    files: z.array(z.instanceof(File)).openapi({type: "array", items: { type: "string", format: "binary" }}),
    categoryId: z.string().transform(str => str.length ? str:null).openapi({ type: "string"}).optional(),
    subCategoryId: z.string().transform(str => str.length ? str:null).openapi({ type: "string"}).optional(),
});

const addExtraRoute = createRoute({
    method: "post",
    path: "/",
    request: {
        body: {
            content: {
                "multipart/form-data": {
                    schema: addExtraSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: "Extra added successfully",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("extra.create"),
                        data: z.object({
                            id: z.string(),
                            name: z.string(),
                            description: z.string(),
                            status: z.nativeEnum(ExtrasStatus),
                            price: z.number(),
                            categoryId: z.string().nullable(),
                            subCategoryId: z.string().nullable(),
                            workspaceId: z.string(),
                            createdAt: z.string(),
                            updatedAt: z.string().nullable()
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
    security: [
        {
            "x-token": []
        }
    ]
});

extraRoutes.openapi(addExtraRoute, async (c) => {
    const body = c.req.valid("form");
    const fileFormData = new FormData();

    if (body.files) {
        body.files.forEach((file: File) => {
            fileFormData.append("files", file);
        });
    }
    try{
        const extra = await createNewExtra({
            name: body.name,
            description: body.description,
            status: body.status,
            price: body.price,
            files: fileFormData,
            categoryId: body.categoryId,
            subCategoryId: body.subCategoryId,
            workspaceId: c.get("workspace").id
        })
        return c.json({status: "success" as const, type: "extra.create" as const, data: extra}, 200)
    }catch(e){
        console.log(e)
        return c.json({status: "error" as const, error: "Something went wrong"}, 400)
    }
})


const getExtrasRoute = createRoute({
    method: "get",
    path: "/",
    responses: {
        200: {
            description: "Get extras by workspace",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("extras"),
                        data: z.array(z.object({}))
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

extraRoutes.openapi(getExtrasRoute, async (c) => {
    const data = await getExtrasByWorkspace({ workspaceId: c.get("workspace").id });
    return c.json({ status: "success" as const, type: "extras" as const, data }, 200);
});

const getExtraByIdRoute = createRoute({
    method: "get",
    path: "/{id}",
    request: {
        params: z.object({ id: z.string().openapi({ description: "The ID of the extra" }) })
    },
    responses: {
        200: {
            description: "Get extra by ID",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("extra"),
                        data: z.object({})
                    })
                }
            }
        },
        404: {
            description: "Extra not found",
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

extraRoutes.openapi(getExtraByIdRoute, async (c) => {
    const id = c.req.valid("param").id;
    try {
        const data = await getExtraById(id);
        if (!data) {
            return c.json({ status: "error" as const, error: "Extra not found!" }, 404);
        }
        return c.json({ status: "success" as const, type: "extra" as const, data }, 200);
    } catch (e) {
        return c.json({ status: "error" as const, error: "Extra not found!" }, 404);
    }
});

const deleteExtraRoute = createRoute({
    method: "delete",
    path: "/{id}",
    request: {
        params: z.object({ id: z.string().openapi({ description: "The ID of the extra to delete" }) })
    },
    responses: {
        200: {
            description: "Extra deleted",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("extra.delete")
                    })
                }
            }
        },
        404: {
            description: "Extra not found",
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

extraRoutes.openapi(deleteExtraRoute, async (c) => {
    const id = c.req.valid("param").id;
    try {
        await deleteExtra(id);
        return c.json({ status: "success" as const, type: "extra.delete" as const }, 200);
    }catch(e){
        return c.json({ status: "error" as const, error: "Extra not found!" }, 404);
    }
});

const getCategoryRoute = createRoute({
    method: "get",
    path: "/categories/get",
    description: "Get Category by ID",
    request: {
        query: z.object({ id: z.string().openapi({ description: "The ID of the category" }) })
    },
    responses: {
        200: {
            description: "Category fetched successfully",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("category"),
                        data: z.object({
                            id: z.string(),
                            name: z.string(),
                            subCategories: z.array(z.object({
                                id: z.string(),
                                name: z.string()
                            }))
                        })
                    })
                }
            }
        },
        404: {
            description: "Category not found",
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

extraRoutes.openapi(getCategoryRoute, async (c) => {
    const { id } = c.req.valid("query");
    try {
        const category = await getCategory({ id, workspaceId: c.get("workspace").id });
        if (!category) {
            return c.json({ status: "error" as const, error: "Category not found" }, 404);
        }
        return c.json({ 
            status: "success" as const, 
            type: "category" as const, 
            data: {
                id: category.id,
                name: category.name,
                subCategories: category.subCategories.map(sub => ({
                    id: sub.id,
                    name: sub.name
                }))
            }
        }, 200);
    } catch(e) {
        return c.json({ status: "error" as const, error: "Category not found" }, 404);
    }
});

const getCategoriesRoute = createRoute({
    method: "get",
    path: "/categories/all",
    description: "Get Categories",
    request: {},
    responses: {
        200: {
            description: "Category fetched successfully",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("category.list"),
                        data: z.array(z.object({
                            id: z.string(),
                            name: z.string(),
                            subCategories: z.array(z.object({
                                id: z.string(),
                                name: z.string()
                            }))
                        }))
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
                        data: z.array(z.null())
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

extraRoutes.openapi(getCategoriesRoute, async (c) => {
    try {
        const categories = await getCategories({workspaceId: c.get("workspace").id});
        return c.json({ status: "success" as const, type: "category.list" as const, data: categories.map(cate => ({
            id: cate.id,
            name: cate.name,
            subCategories: cate.subCategories.map(sub => ({
                id: sub.id,
                name: sub.name
            }))
        })) }, 200);
    }catch(e){
        return c.json({ status: "error" as const, data: [] }, 400);
    }
});

export default extraRoutes;
