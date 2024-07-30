import type { AppType } from "@/app/api/[[...routes]]/route";
import { hc } from "hono/client";

export const client = hc<AppType>("");
