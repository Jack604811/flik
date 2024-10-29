import { Hono } from "hono";
import { handle } from "hono/vercel";
import { Context, Next } from "hono";
import bookingRoutes from "./booking.route";
import { db } from "@/server/db";


type Variables = {
  workspaceId: string
}

const app = new Hono<{ Variables: Variables }>()

const validateApiKey = async (c: Context, next: Next) => {
  const apiKey = c.req.header("X-TOKEN");
  if (!apiKey) {
    return c.json({
      error: "Invalid or missing API Key",
    }, 401);
  } 
  const workspace = await db.workspace.findFirst({where: {apiKey}}); // Replace with your actual token
  const validApiKey = workspace?.apiKey;

  if (!validApiKey || apiKey !== validApiKey) {
    return c.json({
      error: "Invalid or missing API Key",
    }, 401);
  }

  // Pass workspace.id to the context state
  c.set("workspaceId", workspace.id);

  await next();
};

app.use("*", validateApiKey);

app.post("/auth", (c) => {
    return c.json({ message: "Success", id: c.get("workspaceId") }, 200);
});

app.route("/bookings", bookingRoutes);

app.notFound((c) => {
  return c.json({
    message: "Not Found!",
  });
});

export const GET = handle(app);
export const POST = handle(app);
