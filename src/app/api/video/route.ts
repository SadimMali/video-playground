import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const video = decodeURIComponent(searchParams.get('video') || '');
  const videoPath = path.join(process.cwd(), 'videos', video || '');

  try {
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = request.headers.get('range');

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize.toString(), // Convert to string
        'Content-Type': 'video/mp4',
      };
      return new Response(file as any, { status: 206, headers: head });
    } else {
      const head = {
        'Content-Length': fileSize.toString(), // Convert to string
        'Content-Type': 'video/mp4',
      };
      const file = fs.createReadStream(videoPath);
      return new Response(file as any, { status: 200, headers: head });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Video not found' }, { status: 404 });
  }
}