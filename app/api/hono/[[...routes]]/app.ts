import "reflect-metadata";

import { Hono } from "hono";
import { container } from "tsyringe";
import { AssistantsController } from "./main/routes/assistants";

const honoApp = new Hono().basePath("/api");

honoApp.on(["GET", "POST", "PUT"], "/inngest"); // TODO `, serve({ client, functions })` をあとで足す

export const honoMainApp = honoApp.basePath("/main");

/** 各route(controller)を登録する関数 */
export function app() {
  const assistantsController = container.resolve(AssistantsController);
  return honoMainApp.route("/assistants", assistantsController.app);
}

/** Hono RPC用の型定義 */
export type AppType = ReturnType<typeof app>;
