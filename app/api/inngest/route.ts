import { inngest } from "@/app/lib/inngest";
import { serve } from "inngest/next";
import { processImage } from "./functions/process-images";

export const maxDuration = 60; // This function can run for a maximum of 60 seconds on Vercel

export const { GET, POST, PUT } = serve({ client: inngest, functions: [processImage] });
