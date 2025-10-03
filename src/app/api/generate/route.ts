import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

// Configure FAL with API key
fal.config({
  credentials: process.env.FAL_KEY
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const photo1 = formData.get('photo1') as File;
    const photo2 = formData.get('photo2') as File;
    const prompt = formData.get('prompt') as string;

    if (!photo1 || !photo2 || !prompt) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    const apiKey = process.env.FAL_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { status: 'error', message: 'FAL API key not configured' },
        { status: 500 }
      );
    }

    // Upload files to FAL storage
    const photo1Url = await fal.storage.upload(photo1);
    const photo2Url = await fal.storage.upload(photo2);

    // Create a combined prompt for image editing
    const combinedPrompt = `Create a family memory photo combining these two people: ${prompt}. Merge the faces and features from both uploaded images into a single family photo.`;

    // Call FAL nano-banana edit API
    const result = await fal.subscribe("fal-ai/nano-banana/edit", {
      input: {
        prompt: combinedPrompt,
        image_urls: [photo1Url, photo2Url],
        num_images: 1,
        output_format: "jpeg"
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Generation in progress...");
          update.logs?.map((log) => log.message).forEach(console.log);
        }
      },
    });

    // Extract the image URL from the result
    const imageUrl = result.data?.images?.[0]?.url;
    
    if (!imageUrl) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'No image generated' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'success',
      generatedImageUrl: imageUrl,
      description: result.data?.description || 'Generated family memory photo'
    });

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to generate image. Please try again.' 
      },
      { status: 500 }
    );
  }
}
