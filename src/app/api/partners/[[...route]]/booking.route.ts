import { getBookingById, getBookings } from "@/server/actions/booking.action";
import { Hono } from "hono";

type Variables = {
    workspaceId: string
  }
  
const bookingRoutes = new Hono<{ Variables: Variables }>()


bookingRoutes.post("/", (c) => {
    return c.json({ message: "Success" }, 200);
});

bookingRoutes.get("/", async (c) => {
    const data = await getBookings(c.get("workspaceId"));
    return c.json({ data, type: "bookings" }, 200);
});

bookingRoutes.get("/:id", async (c) => {
    const id = c.req.param("id");
    const data = await getBookingById(id);
    return c.json({data,  type: "booking" }, 200);
});


export default bookingRoutes;