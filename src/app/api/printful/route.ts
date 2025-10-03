import { NextRequest, NextResponse } from 'next/server';

// Initialize Printful client with direct API calls
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const PRINTFUL_BASE_URL = 'https://api.printful.com';

export async function GET() {
  try {
    // Get products from Printful using direct API call
    const response = await fetch(`${PRINTFUL_BASE_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
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

    // Create order in Printful using direct API call
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
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
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
