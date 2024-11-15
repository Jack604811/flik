import { Hono } from "hono";
import { handle } from "hono/vercel";
import bookingRoutes from "./booking.route";
import hookRoutes from "./hooks.route";
import { API_APP_TYPE } from "@/types/api";
import spotRoutes from "./spot.route";
import { validateAPIKey } from "./api.key.validate";
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import transactionRoutes from "./transaction.route";
import customFieldRoutes from "./custom-field.route";


const app = new OpenAPIHono<API_APP_TYPE>().basePath("/v1")


app.get('/', swaggerUI({ url: '/v1/doc', syntaxHighlight: true, }))


app.post("/auth", validateAPIKey, (c) => {
    return c.json({ status: "success", workspace: c.get("workspace").name, workspaceId: c.get("workspace").id }, 200);
});


app.route("/bookings", bookingRoutes);
app.route("/custom-fields", customFieldRoutes);
app.route("/spots", spotRoutes);
app.route("/transactions", transactionRoutes);
app.route("/hooks", hookRoutes);

app.notFound((c) => {
  return c.json({
    status: "error",
    message: "Not Found!",
  }, 404);
});


app.openAPIRegistry.registerComponent("securitySchemes","X-TOKEN", {
  type: "apiKey",
  name: "X-TOKEN",
  in: "header",
  description: "API Key for the workspace",
})

app.doc31('/doc', {
  openapi: "3.1.0",
  info: {
    version: 'v1',
    title: 'Flik API',
    description: 'Flik API Documentation',
  },
  security: [
    {
      apiKey: []
    }
  ]
})

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
