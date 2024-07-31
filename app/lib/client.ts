import type { AppType } from "@/app/api/[[...routes]]/route";
import { hc } from "hono/client";

const client = hc<AppType>("");

/**
 * 使い方の例
 * const noCacheClient = createClient({
 *   credentials: "include",
 *   cache: "no-cache",
 * });
 */
export const createClient = (init?: RequestInit) => hc<AppType>("", { init });

export default client;
