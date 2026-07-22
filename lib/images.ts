import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const CLOUDINARY_FOLDER = 'rhema-expert-solutions';

// Sanitize folder name to match Cloudinary upload pattern
function sanitizeFolder(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').toLowerCase();
}

// Fetch all image URLs from a Cloudinary folder prefix
async function fetchImagesByPrefix(prefix: string): Promise<string[]> {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix,
      max_results: 500,
      resource_type: 'image',
    });

    return result.resources.map((img: any) => img.secure_url);
  } catch (error) {
    console.error(`Error fetching Cloudinary images for prefix "${prefix}":`, error);
    return [];
  }
}

// Get project images (coding + robotics) for hero, about, projects sections
export async function getProjectImages(): Promise<string[]> {
  const [codingImages, roboticsImages] = await Promise.all([
    getServiceImages('coding'),
    getServiceImages('robotics'),
  ]);
  return [...codingImages, ...roboticsImages];
}

// Get images for a specific service folder
// Checks both original and sanitized folder names to handle duplicates
export async function getServiceImages(folderName: string): Promise<string[]> {
  const sanitizedFolder = sanitizeFolder(folderName);
  const originalPrefix = `${CLOUDINARY_FOLDER}/${folderName}`;
  const sanitizedPrefix = `${CLOUDINARY_FOLDER}/${sanitizedFolder}`;

  // If folder name is already sanitized (no special chars), just query once
  if (folderName === sanitizedFolder) {
    return fetchImagesByPrefix(originalPrefix);
  }

  // Query both variants and merge (deduplicate)
  const [originalImages, sanitizedImages] = await Promise.all([
    fetchImagesByPrefix(originalPrefix),
    fetchImagesByPrefix(sanitizedPrefix),
  ]);

  // Merge and deduplicate
  const allUrls = new Set([...originalImages, ...sanitizedImages]);
  return Array.from(allUrls);
}

// Get N random images from an array
export function getRandomImages(images: string[], count: number): string[] {
  const shuffled = [...images].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Get a specific Cloudinary image URL by folder and filename
export function getCloudinaryImage(folder: string, filename: string): string {
  const sanitizedFilename = filename.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').toLowerCase();
  const ext = filename.match(/\.[^.]+$/)?.[0] || '';
  const folderPath = folder ? `${CLOUDINARY_FOLDER}/${sanitizeFolder(folder)}` : CLOUDINARY_FOLDER;
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${folderPath}/${sanitizedFilename}${ext}`;
}

// Convert any image path (including old /img/... paths from DB) to Cloudinary URL
export function resolveImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return '';
  
  // Already a full URL (Cloudinary or other)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Old local path like /img/staff/fred.jpeg or /img/coding/file.jpg
  if (imagePath.startsWith('/img/')) {
    const relativePath = imagePath.replace(/^\/img\//, '');
    const decoded = decodeURIComponent(relativePath);
    const parts = decoded.split('/');
    const fileName = parts.pop() || '';
    const folder = parts.join('/');
    return getCloudinaryImage(folder, fileName);
  }
  
  // Other path - return as-is
  return imagePath;
}
