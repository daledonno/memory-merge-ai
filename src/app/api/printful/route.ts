import { NextRequest, NextResponse } from 'next/server';

// Initialize Printful client with OAuth
const PRINTFUL_CLIENT_ID = process.env.PRINTFUL_CLIENT_ID;
const PRINTFUL_CLIENT_SECRET = process.env.PRINTFUL_CLIENT_SECRET;
const PRINTFUL_BASE_URL = 'https://api.printful.com';

// Get OAuth access token
async function getAccessToken() {
  try {
    const response = await fetch(`${PRINTFUL_BASE_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: PRINTFUL_CLIENT_ID!,
        client_secret: PRINTFUL_CLIENT_SECRET!,
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

export async function GET() {
  try {
    // Get OAuth access token
    const accessToken = await getAccessToken();
    
    // Get products from Printful using OAuth
    const response = await fetch(`${PRINTFUL_BASE_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      status: 'success',
      products: data.result
    });
  } catch (error) {
    console.error('Printful API error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId, imageUrl, variantId, quantity = 1 } = await request.json();

    if (!productId || !imageUrl || !variantId) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get OAuth access token
    const accessToken = await getAccessToken();

    // Create order in Printful using OAuth
    const orderData = {
      external_id: `memory-${Date.now()}`,
      shipping: 'STANDARD',
      recipient: {
        name: 'Customer Name',
        address1: '123 Main St',
        city: 'City',
        state_code: 'CA',
        country_code: 'US',
        zip: '12345'
      },
      items: [
        {
          variant_id: variantId,
          quantity: quantity,
          files: [
            {
              url: imageUrl,
              type: 'default'
            }
          ]
        }
      ]
    };

    const response = await fetch(`${PRINTFUL_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      status: 'success',
      order: data.result
    });
  } catch (error) {
    console.error('Printful order error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to create order' },
      { status: 500 }
    );
  }
}
