// Cloudinary configuration and helper functions
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Get Cloudinary URL for an image
 * @param publicId - The public ID of the image in Cloudinary (e.g., 'folder/image-name')
 * @param options - Transformation options
 * @returns Cloudinary URL
 */
export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number | string;
    format?: string;
    crop?: string;
  } = {}
): string {
  const { width, height, quality = 'auto', format = 'auto', crop = 'fill' } = options;

  return cloudinary.url(publicId, {
    transformation: [
      {
        quality,
        format,
        ...(width && { width }),
        ...(height && { height }),
        ...(width && height && { crop }),
      },
    ],
  });
}

/**
 * Get Cloudinary URL with responsive sizes
 * @param publicId - The public ID of the image
 * @returns Object with src, srcSet, and sizes
 */
export function getResponsiveCloudinaryUrl(publicId: string) {
  const sizes = [
    { width: 320, quality: 'auto' },
    { width: 640, quality: 'auto' },
    { width: 960, quality: 'auto' },
    { width: 1280, quality: 'auto' },
    { width: 1920, quality: 'auto' },
  ];

  const src = getCloudinaryUrl(publicId, { width: 1280 });
  const srcSet = sizes
    .map(({ width, quality }) => `${getCloudinaryUrl(publicId, { width, quality })} ${width}w`)
    .join(', ');

  return {
    src,
    srcSet,
    sizes: '(max-width: 1280px) 100vw, 1280px',
  };
}

export default cloudinary;
