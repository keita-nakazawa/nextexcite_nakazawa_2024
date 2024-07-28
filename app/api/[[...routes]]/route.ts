import { Hono } from "hono";
import { handle } from "hono/vercel";
import type { PageConfig } from "next";

export const config: PageConfig = {
  runtime: "nodejs",
  api: {
    bodyParser: false,
  },
};

const app = new Hono().basePath("/api");

app.get("/hello", (c) => {
  return c.json({
    message: "Hello from Hono!"
  });
});

export const GET = handle(app);
export const POST = handle(app);
