import { handle } from "hono/vercel";
// import { rateLimiter } from "hono-rate-limiter";
// import { RedisStore } from "@hono-rate-limiter/redis";
// import { kv } from "@vercel/kv";
import bookingRoutes from "./booking.route";
import hookRoutes from "./hooks.route";
import { API_APP_TYPE } from "@/types/api";
import spotRoutes from "./spot.route";
import { validateAPIKey } from "./api.key.validate";
import { swaggerUI } from "@hono/swagger-ui";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import transactionRoutes from "./transaction.route";
import customFieldRoutes from "./custom-field.route";
import { getWorkspace } from "@/server/actions/workspace.action";
import extraRoutes from "./extra.route";

const app = new OpenAPIHono<API_APP_TYPE>().basePath("/v1");
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
//     standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
//     keyGenerator: (c) => c.req.header("cf-connecting-ip") ?? c.req.header("x-token")!.toString(), // Method to generate custom identifiers for clients.
//     store: new RedisStore({client: kv})
//   })
// );

app.get("/", swaggerUI({ url: "/v1/doc", syntaxHighlight: true }));

app.post("/auth", validateAPIKey, (c) => {
  return c.json(
    {
      status: "success",
      workspace: c.get("workspace").name,
      workspaceId: c.get("workspace").id,
    },
    200
  );
});

const getWorkspaceRoute = createRoute({
  method: "get",
  path: "/whoami",
  description: "Get workspace info",
  responses: {
    200: {
      description: "Workspace",
      content: {
        "application/json": {
          schema: z.object({
            status: z.literal("success"),
            data: z.object({
              id: z.string(),
              ownerId: z.string(),
              customDomain: z.string().nullable().optional(),
              siteName: z.string().nullable().optional(),
              aboutUs: z.string().nullable().optional(),
              country: z.string().nullable().optional(),
              currency: z.string().nullable().optional(),
              defaultPaymentMethod: z.string().nullable().optional(),
              subdomain: z.string().nullable().optional(),
              createdAt: z.date(),
            }),
          }),
        },
      },
    },
    400: {
      description: "Invalid request",
      content: {
        "application/json": {
          schema: z.object({
            status: z.literal("error"),
            error: z.string(),
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
app.openapi(getWorkspaceRoute, async (c) => {
  try {
    const workspace = await getWorkspace(c.get("workspace").id);
    if (!workspace) {
      return c.json(
        { status: "error" as const, error: "Invalid request" },
        400
      );
    }
    return c.json({ status: "success" as const, data: workspace }, 200);
  } catch (e) {
    return c.json({ status: "error" as const, error: "Invalid request" }, 400);
  }
});
app.route("/spots", spotRoutes);
app.route("/extras", extraRoutes)
app.route("/bookings", bookingRoutes);
app.route("/custom-fields", customFieldRoutes);
app.route("/transactions", transactionRoutes);
app.route("/hooks", hookRoutes);



app.notFound((c) => {
  return c.json(
    {
      status: "error",
      error: "Not Found!",
    },
    404
  );
});

app.openAPIRegistry.registerComponent("securitySchemes", "x-token", {
  type: "apiKey",
  name: "x-token",
  in: "header",
  description: "API Key for the workspace",
});

app.doc31("/doc", {
  openapi: "3.1.0",
  info: {
    version: "v1",
    title: "Flik API",
    description: "Flik API Documentation",
  },
  security: [
    {
      "x-token": [],
    },
  ],
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
