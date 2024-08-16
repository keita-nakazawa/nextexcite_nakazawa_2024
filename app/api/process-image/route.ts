import { inngest } from "@/app/lib/inngest";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60; // This function can run for a maximum of 60 seconds on Vercel

export async function POST(request: Request) {
  const { imageUrl } = await request.json();

  const { ids } = await inngest.send({
    name: "image.process",
    data: { imageUrl },
  });

  return NextResponse.json({ jobId: ids[0], message: "Image processing started" }, { status: 202 });
}
