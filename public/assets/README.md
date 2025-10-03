# Assets Folder

This folder contains all static assets for the Memory Merge AI application.

## Folder Structure

- `images/` - For storing images, photos, and graphics
- `icons/` - For storing icons and small graphics

## Usage

To reference assets in your code, use the path starting from `/assets/`:

```jsx
// Example usage in React components
<Image src="/assets/images/logo.png" alt="Logo" width={100} height={100} />
<img src="/assets/icons/upload.svg" alt="Upload" />
```

## File Types Supported

- Images: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`
- Icons: `.svg`, `.png`
- Other: Any static file that needs to be served

## Organization Tips

- Use descriptive filenames
- Keep file sizes optimized for web
- Use appropriate formats (WebP for photos, SVG for icons)
- Organize by feature or type within subfolders
