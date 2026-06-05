// app/api/optimize-video/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get('url');
  const quality = searchParams.get('quality') || 'medium';
  
  if (!videoUrl) {
    return NextResponse.json({ error: 'No video URL provided' }, { status: 400 });
  }
  
  // Quality settings
  const qualities = {
    low: { width: 640, bitrate: '400k', crf: 32 },
    medium: { width: 1280, bitrate: '800k', crf: 28 },
    high: { width: 1920, bitrate: '2000k', crf: 23 }
  };
  
  const settings = qualities[quality];
  
  // Fetch the original video
  const response = await fetch(videoUrl);
  const videoBuffer = await response.arrayBuffer();
  
  // Here you would use ffmpeg to compress
  // This is complex for an API route - see alternative below
  
  return new NextResponse(videoBuffer, {
    headers: {
      'Content-Type': 'video/mp4',
      'Cache-Control': 'public, max-age=31536000',
    },
  });
}