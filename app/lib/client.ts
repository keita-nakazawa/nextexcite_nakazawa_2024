import { hc } from "hono/client";
import type { AppType } from "../api/[[...routes]]/app";

const client = hc<AppType>("");

/**
 * 使い方の例
 * const noCacheClient = createClient({
 *   credentials: "include",
 *   cache: "no-cache",
 * });
 */
export const createClient = (init?: RequestInit) =>
  init ? hc<AppType>("", { init }) : hc<AppType>("");

export default client;
