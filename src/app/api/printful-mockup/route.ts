import { NextRequest, NextResponse } from 'next/server';

// Get OAuth access token
async function getAccessToken() {
  try {
    const response = await fetch('https://api.printful.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.PRINTFUL_CLIENT_ID!,
        client_secret: process.env.PRINTFUL_CLIENT_SECRET!,
      }),
    });

    if (!response.ok) {
      throw new Error(`OAuth token request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { variantId, imageUrl } = await request.json();

    if (!variantId || !imageUrl) {
      return NextResponse.json(
        { status: 'error', message: 'Missing variantId or imageUrl' },
        { status: 400 }
      );
    }

    // Get OAuth access token
    const accessToken = await getAccessToken();

    // Create mockup task
    const mockupData = {
      variant_ids: [variantId],
      format: 'jpg',
      width: 400,
      files: [
        {
          placement: 'front',
          image_url: imageUrl,
          position: {
            area_width: 1800,
            area_height: 2400,
            area_x: 150,
            area_y: 180
          }
        }
      ]
    };

    const response = await fetch('https://api.printful.com/mockup-generator/create-task', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mockupData)
    });

    if (!response.ok) {
      throw new Error(`Printful mockup API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      status: 'success',
      taskKey: data.result.task_key,
      mockupUrl: data.result.mockup_url
    });

  } catch (error) {
    console.error('Printful mockup error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to create mockup' },
      { status: 500 }
    );
  }
}
