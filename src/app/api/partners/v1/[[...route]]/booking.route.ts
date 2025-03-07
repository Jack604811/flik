import { calculateSubtotal, WORKING_HOUR_TYPE } from "@/lib/utils";
import { addBooking, deleteBooking, getBookingById, getBookings, updateBooking } from "@/server/actions/booking.action";
import { getSpotById } from "@/server/actions/spot.action";
import { API_APP_TYPE } from "@/types/api";
import { createRoute, z } from '@hono/zod-openapi';
import { validateAPIKey } from "./api.key.validate";
import { OpenAPIHono } from "@hono/zod-openapi";
import { bookingSchema } from "@/schemas/booking.schema";
import { BookingStatus } from "@prisma/client";
import { db } from "@/server/db"; 
import { addExtrasToBooking, updateBookingExtra, removeExtraFromBooking } from "@/server/actions/booking.action";

const bookingRoutes = new OpenAPIHono<API_APP_TYPE>();
bookingRoutes.use("*", validateAPIKey);

const addBookingSchema = z.object({
    spotId: z.string(),
    startDate: z.string().transform(str => new Date(str)).openapi({description: "The start date of the booking", example: "2022-01-01 10:00:00"}),
    endDate: z.string().transform(str => new Date(str)).openapi({description: "The end date of the booking", example: "2022-01-01 12:00:00"}),
    customer: z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string()
    }),
    customFields: z.array(z.object({
        customFieldId: z.string().openapi({description: "The ID of the Custom Field that you want to add value to."}),
        value: z.string()
    })).optional(),
    extras: z.array(z.object({
        extraId: z.string().openapi({description: "The ID of the Extra that you want to add to the booking."}),
        quantity: z.number().openapi({description: "The quantity of the Extra that you want to add to the booking."}),
    })).optional(),
    note: z.string().optional(),
});

const addBookingResponseSchema = z.object({
    id: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    totalPrice: z.number(),
    spotId: z.string(),
    status: z.nativeEnum(BookingStatus),
    customer: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        note: z.string().optional()
    }),
    customFields: z.array(z.object({
        value: z.string(),
        customFieldId: z.string(),
        CustomField: z.object({
            fieldName: z.string(),
        })
    })),
})

const addBookingRoute = createRoute({
    method: "post",
    description: "Create a new booking",
    path: "/",
    request: {
        body: {
            content: {
                "multipart/form-data": {
                    schema: addBookingSchema,
                },
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
                        type: z.literal("booking.create"),
                        data: addBookingResponseSchema
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

bookingRoutes.openapi(addBookingRoute, async (c) => {
    const body = c.req.valid("form");
    try {
        const spot = await getSpotById(body.spotId);
        const dateRange = { from: body.startDate, to: body.endDate };
        const workingHours = spot?.workingHours as WORKING_HOUR_TYPE[];
        const subtotal = calculateSubtotal(dateRange, workingHours);
        const totalPrice = subtotal;

        const booking = await addBooking({
            spotId: body.spotId,
            startDate: body.startDate,
            endDate: body.endDate,
            name: body.customer.name,
            email: body.customer.email,
            phone: body.customer.phone,
            note: body.note,
            subtotal,
            totalPrice,
            customFields: body.customFields?.filter(cf => cf.value !== "" && cf.value !== "null"),
            extras: body.extras,
        });

        return c.json({ status: "success" as const, type: "booking.create" as const, data: booking as unknown as z.infer<typeof addBookingResponseSchema>}, 200);
    } catch (e) {
        return c.json({ status: "error" as const, error: "Invalid request!" }, 400);
    }
});

const updateBookingSchema = z.object({
    id: z.string(),
    spotId: z.string().optional(),
    startDate: z.string().transform(str => new Date(str)).openapi({description: "The start date of the booking", example: "2022-01-01 10:00:00"}),
    endDate: z.string().transform(str => new Date(str)).openapi({description: "The end date of the booking", example: "2022-01-01 12:00:00"}),
    customer: z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
    }).optional(),
    note: z.string().optional(),
    status: z.nativeEnum(BookingStatus).optional(),
    customFields: z.array(z.object({
        customFieldId: z.string().openapi({description: "The ID of the Custom Field that you want to add value to."}),
        value: z.string()
    })),
    extras: z.array(z.object({
        extraId: z.string().openapi({description: "The ID of the Extra that you want to add to the booking."}),
        quantity: z.number().openapi({description: "The quantity of the Extra that you want to add to the booking."}),
    })).optional(),
});

const updateBookingRoute = createRoute({
    method: "put",
    description: "Update an existing booking",
    path: "/",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: updateBookingSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: "Booking updated",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("booking.update"),
                        data: addBookingResponseSchema
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

bookingRoutes.openapi(updateBookingRoute, async (c) => {
    const body = c.req.valid("json");
    try {
        const booking = await updateBooking({
            id: body.id,
            spotId: body.spotId,
            startDate: body.startDate,
            endDate: body.endDate,
            customer: body.customer ? {
                name: body.customer.name,
                email: body.customer.email,
                phone: body.customer.phone
            } : undefined,
            note: body.note,
            status: body.status,
            customFields: body.customFields?.filter(cf => cf.value !== "" && cf.value !== "null"),
            extras: body.extras
        });
        return c.json({ status: "success" as const, type: "booking.update" as const, data: booking as unknown as z.infer<typeof addBookingResponseSchema>}, 200);
    } catch (e) {
        return c.json({ status: "error" as const, error: "Invalid request!" }, 400);
    }
});

const getBookingsRoute = createRoute({
    method: "get",
    description: "Get all bookings",
    path: "/",
    request: {
        query: z.object({
            startDate: z.string().optional(), 
            endDate: z.string().optional(),    
            status: z.string().optional(),     
            customerId: z.string().optional(), 
            spotId: z.string().optional(),     
        }),
    },
    responses: {
        200: {
            description: "List of bookings",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("bookings"),
                        data: z.array(bookingSchema),
                    }),
                },
            },
        },
    },
    security: [
        {
            "x-token": [],
        },
    ],
});

bookingRoutes.openapi(getBookingsRoute, async (c) => {
    const { startDate, endDate, status, customerId, spotId } = c.req.valid("query");
    const workspaceId = c.get("workspace").id;

    let bookings = await getBookings(workspaceId) as z.infer<typeof bookingSchema>[];

    
    bookings = bookings.filter((booking) => {
        if (startDate) {
            const startOfDay = new Date(startDate);
            startOfDay.setUTCHours(0, 0, 0, 0);
            const endOfDay = new Date(startDate);
            endOfDay.setUTCHours(23, 59, 59, 999);
            if (!(new Date(booking.startDate) >= startOfDay && new Date(booking.startDate) <= endOfDay)) {
                return false;
            }
        }

        if (endDate) {
            if (new Date(booking.endDate) > new Date(endDate)) return false;
        }

        if (status && booking.status !== status) return false;
        if (customerId && booking.customer?.id !== customerId) return false;
        if (spotId && booking.spotId !== spotId) return false;

        return true;
    });

    return c.json({ status: "success" as const, type: "bookings" as const, data: bookings }, 200);
});


const getBookingByIdRoute = createRoute({
    method: "get",
    description: "Get a booking by ID",
    path: "/{id}",
    request: {
        params: z.object({ id: z.string().openapi({ description: "The ID of the booking" }) })
    },
    responses: {
        200: {
            description: "Booking details",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("booking"),
                        data: bookingSchema
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

bookingRoutes.openapi(getBookingByIdRoute, async (c) => {
    const id = c.req.valid("param").id;
    try {
        const data = await getBookingById(id) as z.infer<typeof bookingSchema>;
        return c.json({ status: "success" as const, type: "booking" as const, data }, 200);
    } catch (e) {
        return c.json({ status: "error" as const, error: "Booking not found!" }, 404);
    }
});

const deleteBookingRoute = createRoute({
    method: "delete",
    description: "Delete a booking",
    path: "/{id}",
    request: {
        params: z.object({ id: z.string().openapi({ description: "The ID of the booking to delete" }) })
    },
    responses: {
        200: {
            description: "Booking deleted",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("booking.delete"),
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

bookingRoutes.openapi(deleteBookingRoute, async (c) => {
    const id = c.req.valid("param").id;
    try {
        await deleteBooking(id);
        return c.json({ status: "success" as const, type: "booking.delete" as const }, 200);
    } catch (e) {
        return c.json({ status: "error" as const, error: "Booking not found!" }, 404);
    }
});

const addBookingExtraSchema = z.object({
    bookingId: z.string(),
    extras: z.array(z.object({
        extraId: z.string(),
        quantity: z.number().min(1),
      
    }))
});

const addBookingExtraRoute = createRoute({
    method: "post",
    description: "Add an extra to a booking",
    path: "/{bookingId}/extras",
    request: {
        params: z.object({ bookingId: z.string() }),
        body: {
            content: {
                "application/json": {
                    schema: addBookingExtraSchema,
                },
            }
        }
    },
    responses: {
        200: {
            description: "Extra added to booking",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("booking.extra.add"),
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
    security: [{ "x-token": [] }]
});

bookingRoutes.openapi(addBookingExtraRoute, async (c) => {
    const { bookingId } = c.req.valid("param");
    const body = c.req.valid("json");
    try {
        await addExtrasToBooking({
            bookingId,
            extras: body.extras,
        });
        return c.json({ 
            status: "success" as const, 
            type: "booking.extra.add" as const, 
        }, 200);
    } catch (e) {
        return c.json({ status: "error" as const, error: "Failed to add extra to booking" }, 400);
    }
});


const updateBookingExtraRoute = createRoute({
    method: "put",
    description: "Update an extra in a booking",
    path: "/{bookingId}/extras/{extraId}",
    request: {
        params: z.object({ 
            bookingId: z.string(),
            extraId: z.string()
        }),
        body: {
            content: {
                "application/json": {
                    schema: z.object({
                        quantity: z.number().min(1),
                        price: z.number().min(0).optional()
                    })
                }
            }
        }
    },
    responses: {
        200: {
            description: "Extra updated in booking",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("booking.extra.update"),
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
    security: [{ "x-token": [] }]
});

bookingRoutes.openapi(updateBookingExtraRoute, async (c) => {
    const { bookingId, extraId } = c.req.valid("param");
    const body = c.req.valid("json");

    try {
        const updateData: Record<string, any> = { quantity: body.quantity };

        if (body.price !== undefined) {
            updateData.price = body.price; 
        }

        await updateBookingExtra(extraId, updateData);

        return c.json({ 
            status: "success" as const, 
            type: "booking.extra.update" as const, 
        }, 200);

    } catch (e) {
        return c.json({ status: "error" as const, error: "Failed to update extra" }, 400);
    }
});

const deleteBookingExtraRoute = createRoute({
    method: "delete",
    description: "Delete an extra from a booking",
    path: "/{bookingId}/extras/{extraId}",
    request: {
        params: z.object({ 
            bookingId: z.string(),
            extraId: z.string()
        })
    },
    responses: {
        200: {
            description: "Extra removed from booking",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("booking.extra.delete")
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
    security: [{ "x-token": [] }]
});

bookingRoutes.openapi(deleteBookingExtraRoute, async (c) => {
    const { bookingId, extraId } = c.req.valid("param");
    try {
        await removeExtraFromBooking(extraId);
        return c.json({ 
            status: "success" as const,
            type: "booking.extra.delete"  as const
        }, 200);
    } catch (e) {
        return c.json({ status: "error" as const, error: "Failed to delete extra" }, 400);
    }
});


export default bookingRoutes;
