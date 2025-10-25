import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId, imageBuffer } = await request.json();
    
    if (!userId || !imageBuffer) {
      return NextResponse.json(
        { error: 'Missing userId or imageBuffer' },
        { status: 400 }
      );
    }

    // Convert base64 buffer to actual buffer
    const buffer = Buffer.from(imageBuffer, 'base64');
    
    // Upload to Vercel Blob
    const blob = await put(`permit_${userId}_screenshot.png`, buffer, {
      access: 'public',
      contentType: 'image/png',
    });

    return NextResponse.json({ 
      success: true, 
      url: blob.url,
      filename: `permit_${userId}_screenshot.png`
    });

  } catch (error) {
    console.error('Error uploading screenshot to Vercel Blob:', error);
    return NextResponse.json(
      { error: 'Failed to upload screenshot' },
      { status: 500 }
    );
  }
}
