import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId } = await request.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { status: 'error', message: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the payment intent to verify it was successful
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { status: 'error', message: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Generate a high-resolution download URL
    // For now, we'll return the same URL, but in production you'd generate a 4K version
    const imageUrl = paymentIntent.metadata.imageUrl;
    const downloadUrl = imageUrl; // In production, this would be a 4K version

    return NextResponse.json({
      status: 'success',
      downloadUrl: downloadUrl,
      paymentId: paymentIntent.id,
      amount: paymentIntent.amount
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
