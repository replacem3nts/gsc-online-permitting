import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { ImageResponse } from '@vercel/og';
import React from 'react';

export async function POST(request: NextRequest) {
  try {
    const { userId, userData } = await request.json();
    
    if (!userId || !userData) {
      return NextResponse.json(
        { error: 'Missing userId or userData' },
        { status: 400 }
      );
    }

    // Format dates for the ShellfishPermit component
    const formattedPaymentDate = userData?.paymentDate ? new Date(userData.paymentDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }) : new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
    
    const formattedExpirationDate = userData?.tempPermitExpirationDate ? new Date(userData.tempPermitExpirationDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }) : (() => {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 14);
      return expirationDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
    })();

    const formatDateOfBirth = () => {
      if (!userData?.dateOfBirthMonth || !userData?.dateOfBirthDay || !userData?.dateOfBirthYear) return 'N/A';
      return `${userData.dateOfBirthMonth.toString().padStart(2, '0')}/${userData.dateOfBirthDay.toString().padStart(2, '0')}/${userData.dateOfBirthYear}`;
    };

    // Generate permit image using background image with absolute positioned text
    const imageResponse = new ImageResponse(
      React.createElement('div', {
        style: {
          width: '816px',
          height: '535px',
          backgroundImage: 'url(/blank_permit.png)',
          backgroundSize: '100% 100%',
          backgroundPosition: 'top left',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          display: 'flex',
          fontFamily: 'Arial, sans-serif',
        }
      }, [
        // Season
        React.createElement('div', {
          key: 'season',
          style: {
            position: 'absolute',
            top: '185px',
            left: '45px',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
          }
        }, "'25 - '26"),
        // Permit Number
        React.createElement('div', {
          key: 'permit-number',
          style: {
            position: 'absolute',
            top: '185px',
            left: '235px',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
          }
        }, userData?.permitNumber || '001'),
        // Issued Date
        React.createElement('div', {
          key: 'issued-date',
          style: {
            position: 'absolute',
            top: '260px',
            left: '45px',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
          }
        }, formattedPaymentDate),
        // Expires Date
        React.createElement('div', {
          key: 'expires-date',
          style: {
            position: 'absolute',
            top: '260px',
            left: '235px',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
          }
        }, formattedExpirationDate),
        // Name
        React.createElement('div', {
          key: 'name',
          style: {
            position: 'absolute',
            top: '105px',
            left: '450px',
            fontSize: '16px',
            fontWeight: 'bold',
          }
        }, `${userData?.firstName} ${userData?.lastName}`),
        // Height
        React.createElement('div', {
          key: 'height',
          style: {
            position: 'absolute',
            top: '175px',
            left: '450px',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
          }
        }, userData?.height),
        // D.O.B.
        React.createElement('div', {
          key: 'dob',
          style: {
            position: 'absolute',
            top: '175px',
            left: '570px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
          }
        }, formatDateOfBirth()),
        // Eye Color
        React.createElement('div', {
          key: 'eye-color',
          style: {
            position: 'absolute',
            top: '175px',
            left: '695px',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
          }
        }, userData?.eyeColor)
      ]),
      {
        width: 816,
        height: 535,
      }
    );

    // Convert the image response to buffer
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Check if Vercel Blob token is available
    if (process.env.BLOB_READ_WRITE_TOKEN) {
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
    } else {
      // Fallback: Save to local filesystem for development
      const fs = await import('fs');
      const path = await import('path');
      
      const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots');
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }
      
      const screenshotPath = path.join(screenshotsDir, `permit_${userId}_screenshot.png`);
      fs.writeFileSync(screenshotPath, buffer);
      
      console.log(`Screenshot saved locally: ${screenshotPath}`);
      
      return NextResponse.json({ 
        success: true, 
        screenshotPath: `permit_${userId}_screenshot.png`,
        blobUrl: `/screenshots/permit_${userId}_screenshot.png`
      });
    }

  } catch (error) {
    console.error('Error generating permit image:', error);
    return NextResponse.json(
      { error: 'Failed to generate permit image' },
      { status: 500 }
    );
  }
}