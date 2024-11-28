import { calculateSubtotal, WORKING_HOUR_TYPE } from "@/lib/utils";
import { addBooking, deleteBooking, getBookingById, getBookings, updateBooking } from "@/server/actions/booking.action";
import { getSpotById } from "@/server/actions/spot.action";
import { API_APP_TYPE } from "@/types/api";
import { createRoute, z } from '@hono/zod-openapi';
import { validateAPIKey } from "./api.key.validate";
import { OpenAPIHono } from "@hono/zod-openapi";
import { bookingSchema } from "@/schemas/booking.schema";
import { BookingStatus } from "@prisma/client";

const bookingRoutes = new OpenAPIHono<API_APP_TYPE>();
bookingRoutes.use("*", validateAPIKey);

const addBookingSchema = z.object({
    spotId: z.string(),
    startDate: z.string().transform(z.date().parse).openapi({description: "The start date of the booking", example: "2022-01-01 10:00:00"}),
    endDate: z.string().transform(z.date().parse).openapi({description: "The end date of the booking", example: "2022-01-01 12:00:00"}),
    customer: z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string()
    }),
    customFields: z.array(z.object({
        customFieldId: z.string().openapi({description: "The ID of the Custom Field that you want to add value to."}),
        value: z.string()
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
    path: "/",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: addBookingSchema
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
    const body = c.req.valid("json");
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
            customFields: body.customFields
        });


        return c.json({ status: "success" as const, type: "booking.create" as const, data: booking as z.infer<typeof addBookingResponseSchema>}, 200);
    } catch (e) {
        return c.json({ status: "error" as const, error: "Invalid request!" }, 400);
    }
});

const updateBookingSchema = z.object({
    id: z.string(),
    spotId: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
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
    }))
});


const updateBookingRoute = createRoute({
    method: "put",
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
        const booking = await updateBooking(body);
        return c.json({ status: "success" as const, type: "booking.update" as const, data: booking as z.infer<typeof addBookingResponseSchema>}, 200);
    } catch (e) {
        return c.json({ status: "error" as const, error: "Invalid request!" }, 400);
    }
});


const getBookingsRoute = createRoute({
    method: "get",
    path: "/",
    responses: {
        200: {
            description: "List of bookings",
            content: {
                "application/json": {
                    schema: z.object({
                        status: z.literal("success"),
                        type: z.literal("bookings"),
                        data: z.array(bookingSchema)
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

bookingRoutes.openapi(getBookingsRoute, async (c) => {
    const data = await getBookings(c.get("workspace").id) as z.infer<typeof bookingSchema>[];
    return c.json({ status: "success" as const, type: "bookings" as const, data }, 200);
});

const getBookingByIdRoute = createRoute({
    method: "get",
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

export default bookingRoutes;