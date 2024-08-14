import { inngest } from "@/app/lib/inngest";
import { serve } from "inngest/next";
import { processImage } from "./functions/process-images";

export const { GET, POST, PUT } = serve({ client: inngest, functions: [processImage] });
