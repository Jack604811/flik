import { db } from "@/server/db";
import { Permission } from "@prisma/client";
import { Context, Next } from "hono";

export const validateAPIKey = async (c: Context, next: Next) => {
    const token = c.req.header("X-TOKEN");
    if (!token) {
      return c.json({
        status: "error",
        error: "Invalid or missing API Key",
      }, 401);
    } 
    const apiKey = await db.apiKey.findFirst({where: {key: token}, include: {workspace: true}}); // Replace with your actual token
  
    if (!apiKey) {
      return c.json({
        status: "error",
        error: "Invalid or missing API Key",
      }, 401);
    }
    
    if(apiKey.permission === Permission.READ_ONLY && c.req.method !== "GET"){
        return c.json({
            status: "error",
            error: "API Key doesn't have the required permission for the request",
          }, 401);
    }else if(apiKey.permission === Permission.SEND_ONLY && !["POST", "PUT", "PATCH"].includes(c.req.method)){
        return c.json({
            status: "error",
            error: "API Key doesn't have the required permission for the request",
          }, 401);
    }
  
    const workspace = apiKey.workspace;
    // Pass workspace.id to the context state
    c.set("workspace", {
      id: workspace.id,
      name: workspace.siteName
    });
  
    await next();
  };