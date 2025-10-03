import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, imageId } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { status: 'error', message: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Create payment intent for 4K download ($2.99)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 299, // $2.99 in cents
      currency: 'usd',
      metadata: {
        imageUrl: imageUrl,
        imageId: imageId || 'memory-photo',
        type: '4k-download'
      },
      description: '4K High-Resolution Download - AI Memory Photo',
    });

    return NextResponse.json({
      status: 'success',
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
