import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subtitle = decodeURIComponent(searchParams.get("subtitle") || '');

  if (!subtitle) {
    console.log("error")
    return NextResponse.json({ error: "Subtitle not provided" }, { status: 400 });
  }

  // Ensure the requested file has a .srt extension
  const subtitlePath = path.join(process.cwd(), "videos", subtitle.replace(".mp4", ".srt"));

  try {
    let srtContent = fs.readFileSync(subtitlePath, "utf8");

    // Convert SRT to WebVTT format
    let vttContent =
      "WEBVTT\n\n" +
      srtContent
        .replace(/\r\n/g, "\n") // Normalize line endings
        .replace(/(\d+)\n(\d{2}:\d{2}:\d{2}),(\d{3}) --> (\d{2}:\d{2}:\d{2}),(\d{3})/g,
          "$1\n$2.$3 --> $4.$5"); // Convert timestamp format

    return new Response(vttContent, {
      status: 200,
      headers: {
        "Content-Type": "text/vtt",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Subtitle not found" }, { status: 404 });
  }
}
