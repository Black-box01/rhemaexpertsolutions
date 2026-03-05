import fs from 'fs';
import path from 'path';

// Helper to recursively get all images from a directory
function getImagesRecursively(dir: string, baseDir: string = ''): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(getImagesRecursively(filePath, path.join(baseDir, file)));
    } else {
      if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
        // Return web-accessible path (e.g., /img/coding/file.jpg)
        // Ensure forward slashes for URLs
        const relativePath = path.join(baseDir, file).split(path.sep).join('/');
        results.push(`/img/${relativePath}`);
      }
    }
  });
  
  return results;
}

export function getProjectImages() {
  const imagesDirectory = path.join(process.cwd(), 'public/img');
  // Only get images from coding and robotics folders as requested for the main project view
  const codingImages = getImagesRecursively(path.join(imagesDirectory, 'coding'), 'coding');
  const roboticsImages = getImagesRecursively(path.join(imagesDirectory, 'robotics'), 'robotics');
  
  return [...codingImages, ...roboticsImages];
}

export function getServiceImages(folderName: string) {
  const imagesDirectory = path.join(process.cwd(), 'public/img');
  const folderPath = path.join(imagesDirectory, folderName);
  
  if (fs.existsSync(folderPath)) {
    return getImagesRecursively(folderPath, folderName);
  }
  return [];
}

export function getRandomImages(images: string[], count: number) {
  const shuffled = [...images].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

