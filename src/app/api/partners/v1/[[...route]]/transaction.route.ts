import { calculateSubtotal, WORKING_HOUR_TYPE } from "@/lib/utils";
import { addBooking, addOrUpdateTransaction, deleteBooking, deleteTransaction, getBookingById, getBookings, getTransactionById, getTransactionsByBooking } from "@/server/actions/booking.action";
import { getSpotById } from "@/server/actions/spot.action";
import { API_APP_TYPE } from "@/types/api";
import { createRoute, z } from '@hono/zod-openapi';
import { validateAPIKey } from "./api.key.validate";
import { OpenAPIHono } from "@hono/zod-openapi";
import { bookingSchema } from "@/schemas/booking.schema";
import { BookingStatus, TransactionStatus } from "@prisma/client";

const transactionRoutes = new OpenAPIHono<API_APP_TYPE>();
transactionRoutes.use("*", validateAPIKey);

const addTransactionSchema = z.object({
    bookingId: z.string(),
    amount: z.number(),
    paymentMethod: z.string().openapi({ description: "The payment method used for the transaction", enum: ["card", "wompi", "stripe"] }),
    paymentDate: z.string().transform((arg) => arg ? new Date(arg) : new Date()).openapi({ description: "The date of the payment"}),
    description: z.string(),
    status: z.nativeEnum(TransactionStatus),
});


const addTransactionResponseSchema = z.object({
    id: z.string(),
    bookingId: z.string(),
    amount: z.number(),
    paymentMethod: z.string(),
    paymentDate: z.date(),
    description: z.string(),
    status: z.nativeEnum(TransactionStatus),
});

const addTransactionRoute = createRoute({
    method: "post",
    path: "/",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: addTransactionSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: "Booking created",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("transaction.created"),
                        data: addTransactionResponseSchema
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
            "X-TOKEN": []
        }
    ]
});

transactionRoutes.openapi(addTransactionRoute, async (c) => {
    const body = c.req.valid("json");
    try {
        const transaction = await addOrUpdateTransaction({...body, date: body.paymentDate})

        return c.json({ status: "success" as const, type: "transaction.created" as const, data: transaction}, 200);
    } catch (e) {
        return c.json({ status: "error" as const, error: "Invalid request!" }, 400);
    }
});

// create route to update transaction
const updateTransactionRoute = createRoute({
    method: "put",
    path: "/{id}",
    request: {
        params: z.object({ id: z.string().openapi({ description: "The ID of the transaction to update" }) }),
        body: {
            content: {
                "application/json": {
                    schema: addTransactionSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: "Transaction updated",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("transaction.updated"),
                        data: addTransactionResponseSchema
                    })
                }
            }
        },
        404: {
            description: "Transaction not found",
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

transactionRoutes.openapi(updateTransactionRoute, async (c) => {
    const id = c.req.valid("param").id;
    const body = c.req.valid("json");
    try {
        const transaction = await addOrUpdateTransaction({...body, id, date: body.paymentDate})
        return c.json({ status: "success" as const, type: "transaction.updated" as const, data: transaction}, 200);
    } catch (e) {
        return c.json({ status: "error" as const, error: "Transaction not found!" }, 404);
    }
});

const getTransactionsRoute = createRoute({
    method: "get",
    path: "/",
    request: {
        query: z.object({
            bookingId: z.string().openapi({ description: "The ID of the booking" })
        })
    },
    responses: {
        200: {
            description: "List of transactions for a booking",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("transactions"),
                        data: z.array(addTransactionResponseSchema)
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

transactionRoutes.openapi(getTransactionsRoute, async (c) => {
    const data = await getTransactionsByBooking(c.req.valid("query").bookingId) as z.infer<typeof addTransactionResponseSchema>[];
    return c.json({ status: "success" as const, type: "transactions" as const, data }, 200);
});

const getTransactionByIdRoute = createRoute({
    method: "get",
    path: "/{id}",
    request: {
        params: z.object({ id: z.string().openapi({ description: "The ID of the transaction" }) })
    },
    responses: {
        200: {
            description: "Transaction details",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("transaction"),
                        data: addTransactionResponseSchema
                    })
                }
            }
        },
        404: {
            description: "Transaction not found",
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

transactionRoutes.openapi(getTransactionByIdRoute, async (c) => {
    const id = c.req.valid("param").id;
    try {
        const data = await getTransactionById(id) as z.infer<typeof addTransactionResponseSchema>;
        return c.json({ status: "success" as const, type: "transaction" as const, data }, 200);
    } catch (e) {
        return c.json({ status: "error" as const, error: "Transaction not found!" }, 404);
    }
});

const deleteTransactionRoute = createRoute({
    method: "delete",
    path: "/{id}",
    request: {
        params: z.object({ id: z.string().openapi({ description: "The ID of the transaction to delete" }) })
    },
    responses: {
        200: {
            description: "Transaction deleted",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("transaction.deleted"),
                    })
                }
            }
        },
        404: {
            description: "Transaction not found",
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

transactionRoutes.openapi(deleteTransactionRoute, async (c) => {
    const id = c.req.valid("param").id;
    try {
        await deleteTransaction(id);
        return c.json({ status: "success" as const, type: "transaction.deleted" as const }, 200);
    } catch (e) {
        return c.json({ status: "error" as const, error: "Transaction not found!" }, 404);
    }
});

export default transactionRoutes;