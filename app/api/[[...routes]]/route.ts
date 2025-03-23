import { Hono } from "hono";
import { handle } from "hono/vercel";
import { serve } from "inngest/hono";
import { inngest } from "../_lib/inngest";
import { setupMainRoutes } from "./app";
import { functions } from "./inngest/functions";

export const runtime = "nodejs";
export const maxDuration = 60; // This function can run for a maximum of 60 seconds on Vercel

const app = new Hono();
app.on(
  ["GET", "POST", "PUT"],
  "/api/inngest",
  serve({ client: inngest, functions, signingKey: process.env.INNGEST_SIGNING_KEY ?? "" }),
);
setupMainRoutes(app);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
