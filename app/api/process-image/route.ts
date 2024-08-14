import { inngest } from "@/app/lib/inngest";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { imageUrl } = await request.json();

  const { ids } = await inngest.send({
    name: "image.process",
    data: { imageUrl },
  });

  return NextResponse.json({ jobId: ids[0], message: "Image processing started" }, { status: 202 });
}
