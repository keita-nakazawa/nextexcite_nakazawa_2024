import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60; // This function can run for a maximum of 60 seconds on Vercel

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");

  const fastapiBaseUrl =
    process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : process.env.MODAL_API_URL;

  let endpoint = "";
  if (type === "large") {
    endpoint = "/download_large_wav";
  } else if (type === "small") {
    endpoint = "/download_small_file";
  } else {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  try {
    const response = await fetch(`${fastapiBaseUrl}${endpoint}`);
    const blob = await response.blob();

    return new NextResponse(blob, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
        "Content-Disposition": response.headers.get("Content-Disposition") || "attachment",
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
