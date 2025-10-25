import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { generatePermitImage } from '@/components/PermitImage';

export async function POST(request: NextRequest) {
  try {
    const { userId, userData } = await request.json();
    
    if (!userId || !userData) {
      return NextResponse.json(
        { error: 'Missing userId or userData' },
        { status: 400 }
      );
    }

    // Generate the permit image using the component
    const imageResponse = generatePermitImage(userData);

    // Convert the image response to buffer
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Vercel Blob
    const blob = await put(`permit_${userId}_screenshot.png`, buffer, {
      access: 'public',
      contentType: 'image/png',
    });

    console.log(`Screenshot uploaded to Vercel Blob: ${blob.url}`);
    
    return NextResponse.json({ 
      success: true, 
      screenshotPath: `permit_${userId}_screenshot.png`,
      blobUrl: blob.url
    });

  } catch (error) {
    console.error('Error generating permit image:', error);
    return NextResponse.json(
      { error: 'Failed to generate permit image' },
      { status: 500 }
    );
  }
}