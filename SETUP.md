# AI Memory Photos - Setup Instructions

## Environment Configuration

1. Create a `.env.local` file in the root directory
2. Add your NanoBanana API key:

```
NANOBANANA_API_KEY=your_actual_api_key_here
```

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- Upload two photos (your photo + relative's photo)
- Enter a text prompt describing the scene
- Generate a photorealistic image using NanoBanana API
- Download the generated image

## API Integration

The app integrates with NanoBanana API for image generation. Make sure you have a valid API key before testing the application.
