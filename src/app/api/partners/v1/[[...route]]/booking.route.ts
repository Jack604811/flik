import { calculateSubtotal, WORKING_HOUR_TYPE } from "@/lib/utils";
import { addBooking, deleteBooking, getBookingById, getBookings } from "@/server/actions/booking.action";
import { getSpotById } from "@/server/actions/spot.action";
import { API_APP_TYPE } from "@/types/api";
import { createRoute, z } from '@hono/zod-openapi';
import { validateAPIKey } from "./api.key.validate";
import { OpenAPIHono } from "@hono/zod-openapi";

const bookingRoutes = new OpenAPIHono<API_APP_TYPE>();
bookingRoutes.use("*", validateAPIKey);

const addBookingSchema = z.object({
    spotId: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    customer: z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        address: z.string(),
        dni: z.string(),
    }),
    note: z.string().optional(),
});

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
                        data: z.object({
                            id: z.string(),
                            spotId: z.string(),
                            startDate: z.date(),
                            endDate: z.date(),
                            name: z.string(),
                            email: z.string().email(),
                            phone: z.string(),
                            address: z.string(),
                            dni: z.string(),
                            note: z.string().optional(),
                            subtotal: z.number(),
                            totalPrice: z.number(),
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
            "X-TOKEN": []
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
            address: body.customer.address,
            dni: body.customer.dni,
            note: body.note,
            subtotal,
            totalPrice,
        });

        return c.json({ status: "success", type: "booking.create", data: booking }, 200);
    } catch (e) {
        return c.json({ status: "error", error: "Invalid request!" }, 400);
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
                        data: z.array(z.object({
                            customer: z.object({
                                name: z.string(),
                                email: z.string().email(),
                                phone: z.string(),
                                address: z.string().nullable(),
                                dni: z.string().nullable(),
                            }).nullable(),
                            startDate: z.string().nullable(),
                            endDate: z.string().nullable(),
                            totalPrice: z.number(),
                            spot: z.object({
                                id: z.string(),
                                name: z.string(),
                                description: z.string(),
                                status: z.string(),
                                units: z.number(),
                                duration: z.number(),
                                durationType: z.string(),
                                workingHours: z.array(z.any()),
                            }),
                            customFields: z.array(z.object({
                                id: z.string(),
                                value: z.string(),
                                customFieldId: z.string()
                            })),

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

bookingRoutes.openapi(getBookingsRoute, async (c) => {
    const data = await getBookings(c.get("workspace").id);
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
                        data: z.object({
                            id: z.string(),
                            spotId: z.string(),
                            startDate: z.date(),
                            endDate: z.date(),
                            name: z.string(),
                            email: z.string().email(),
                            phone: z.string(),
                            address: z.string(),
                            dni: z.string(),
                            note: z.string().optional(),
                            subtotal: z.number(),
                            totalPrice: z.number(),
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
            "X-TOKEN": []
        }
    ]
});

bookingRoutes.openapi(getBookingByIdRoute, async (c) => {
    const id = c.req.valid("param").id;
    try {
        const data = await getBookingById(id);
        return c.json({ status: "success", type: "booking", data }, 200);
    } catch (e) {
        return c.json({ status: "error", error: "Booking not found!" }, 404);
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
            "X-TOKEN": []
        }
    ]
});

bookingRoutes.openapi(deleteBookingRoute, async (c) => {
    const id = c.req.valid("param").id;
    try {
        await deleteBooking(id);
        return c.json({ status: "success", type: "booking.delete" }, 200);
    } catch (e) {
        return c.json({ status: "error", error: "Booking not found!" }, 404);
    }
});

export default bookingRoutes;