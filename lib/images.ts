import fs from 'fs';
import path from 'path';

export function getProjectImages() {
  const imagesDirectory = path.join(process.cwd(), 'public/img');
  const filenames = fs.readdirSync(imagesDirectory);
  
  // Filter for image files
  const images = filenames.filter(file => 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
  ).map(file => `/img/${file}`);
  
  return images;
}
