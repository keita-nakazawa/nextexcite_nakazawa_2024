import type { AppType } from "@/app/api/[[...routes]]/route";
import { hc } from "hono/client";

export const apiClient = hc<AppType>("");
