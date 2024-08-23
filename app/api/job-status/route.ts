import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60; // This function can run for a maximum of 60 seconds on Vercel

const getEventUrl = (jobId: string) => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:8288/v1/events/{jobId}/runs"
      : "https://api.inngest.com/v1/events/{jobId}/runs";
  return baseUrl.replace("{jobId}", jobId);
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
  }

  try {
    const response = await fetch(getEventUrl(jobId), {
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
      },
    });
    const event = await response.json();
    if (event) {
      return NextResponse.json({ status: event.data[0].status });
    } else {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch job status" }, { status: 500 });
  }
}
