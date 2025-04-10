import { hc } from "hono/client";
import type { AppType } from "../api/[[...routes]]/app";

const client = hc<AppType>("");

const baseUrl = "http://localhost:3000/";
export const createClient = (init?: RequestInit) =>
  init ? hc<AppType>(baseUrl, { init }) : hc<AppType>(baseUrl);

export const noStoreClient = createClient({
  cache: "no-store",
});
export default client;
