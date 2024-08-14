import { Hono } from "hono";
import { handle } from "hono/vercel";
import { assistantsRoute } from "./routes/assistants";

export const runtime = "nodejs";

const app = new Hono().basePath("/api/hono");
// 各route(controller)を登録
const apiRoutes = app.route("/assistants", assistantsRoute);

export const GET = handle(app);
export const POST = handle(app);

// tRPC用の型定義
export type AppType = typeof apiRoutes;
