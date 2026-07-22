#!/usr/bin/env node
/**
 * Script to upload images to Cloudinary
 * 
 * Usage:
 * 1. Set up your Cloudinary credentials in .env.local
 * 2. Run: node scripts/upload-to-cloudinary.js
 * 
 * This will upload all images from public/img to your Cloudinary account
 */

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to get all files recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// Function to upload a single image
async function uploadImage(filePath) {
  try {
    // Get relative path from public/img
    const relativePath = path.relative(path.join(__dirname, '..', 'public', 'img'), filePath);
    
    // Create folder structure in Cloudinary
    const folder = path.dirname(relativePath).replace(/\\/g, '/');
    const publicId = path.basename(relativePath, path.extname(relativePath));
    
    // Sanitize folder and file names for Cloudinary (remove special characters)
    const sanitizeName = (name) => {
      return name.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').toLowerCase();
    };
    
    const sanitizedFolder = folder && folder !== '.' ? `rhema-expert-solutions/${folder.split('/').map(sanitizeName).join('/')}` : 'rhema-expert-solutions';
    const sanitizedPublicId = sanitizeName(publicId);
    
    // Upload options
    const options = {
      folder: sanitizedFolder,
      public_id: sanitizedPublicId,
      resource_type: 'image',
      overwrite: false, // Don't overwrite existing images
    };

    // Upload image
    const result = await cloudinary.uploader.upload(filePath, options);
    
    console.log(`✅ Uploaded: ${relativePath}`);
    console.log(`   Public ID: ${result.public_id}`);
    console.log(`   URL: ${result.secure_url}\n`);
    
    return result;
  } catch (error) {
    console.error(`❌ Failed to upload ${filePath}:`, error.message);
    return null;
  }
}

// Main function
async function main() {
  console.log('🚀 Starting Cloudinary image upload...\n');
  
  // Check if Cloudinary is configured
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    console.error('❌ Error: Cloudinary is not configured!');
    console.error('Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in your .env.local file');
    process.exit(1);
  }

  const imgDir = path.join(__dirname, '..', 'public', 'img');
  
  if (!fs.existsSync(imgDir)) {
    console.error(`❌ Error: Image directory not found at ${imgDir}`);
    process.exit(1);
  }

  // Get all image files
  const imageFiles = getAllFiles(imgDir);
  console.log(`📁 Found ${imageFiles.length} images to upload\n`);

  // Upload images
  let successCount = 0;
  let failCount = 0;

  for (const file of imageFiles) {
    const result = await uploadImage(file);
    if (result) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n📊 Upload Summary:');
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📁 Total: ${imageFiles.length}`);
  
  if (successCount > 0) {
    console.log('\n✨ Upload complete! Your images are now on Cloudinary.');
    console.log('📝 Next steps:');
    console.log('   1. Update your code to use Cloudinary URLs');
    console.log('   2. Test the changes locally');
    console.log('   3. Deploy to Vercel');
  }
}

// Run the script
main().catch(console.error);
