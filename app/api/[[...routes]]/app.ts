import "reflect-metadata";

import { Hono } from "hono";
import { container } from "tsyringe";
import { AssistantsController } from "./main/assistants/controller";

/** 各route(controller)を登録する関数 */
export function setupMainRoutes(app = new Hono()) {
  const assistantsController = container.resolve(AssistantsController);
  return app.basePath("/api/main").route("/assistants", assistantsController.app);
}

/** Hono RPC用の型定義 */
export type AppType = ReturnType<typeof setupMainRoutes>;
