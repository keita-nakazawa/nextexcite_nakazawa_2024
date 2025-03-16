import { handle } from "hono/vercel"; // Next.js appをセルフホストするからvercel使わない、という場合でも利用可
import { app, honoMainApp } from "./app";

export const runtime = "nodejs";
export const maxDuration = 60; // This function can run for a maximum of 60 seconds on Vercel

app();
export const GET = handle(honoMainApp);
export const POST = handle(honoMainApp);
