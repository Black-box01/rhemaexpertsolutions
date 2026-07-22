#!/usr/bin/env node
/**
 * Script to upload missing images to Cloudinary
 * This uploads: ai&iot, software development, staff folders and root images
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

// Sanitize names for Cloudinary
const sanitizeName = (name) => {
  return name.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').toLowerCase();
};

// Function to upload a single image
async function uploadImage(filePath) {
  try {
    const relativePath = path.relative(path.join(__dirname, '..', 'public', 'img'), filePath);
    const folder = path.dirname(relativePath).replace(/\\/g, '/');
    const publicId = path.basename(relativePath, path.extname(relativePath));
    
    const sanitizedFolder = folder && folder !== '.' ? `rhema-expert-solutions/${folder.split('/').map(sanitizeName).join('/')}` : 'rhema-expert-solutions';
    const sanitizedPublicId = sanitizeName(publicId);
    
    const options = {
      folder: sanitizedFolder,
      public_id: sanitizedPublicId,
      resource_type: 'image',
      overwrite: true, // Overwrite to ensure upload
    };

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
  console.log('🚀 Uploading missing images to Cloudinary...\n');
  
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    console.error('❌ Error: Cloudinary is not configured!');
    process.exit(1);
  }

  const imgDir = path.join(__dirname, '..', 'public', 'img');
  
  // Folders and files to upload
  const missingFolders = [
    'ai&iot',
    'software development',
    'staff'
  ];
  
  const missingRootFiles = [
    'coding.jpg',
    'cup.png',
    'preview.png'
  ];

  let successCount = 0;
  let failCount = 0;

  // Upload missing folders
  for (const folderName of missingFolders) {
    const folderPath = path.join(imgDir, folderName);
    
    if (!fs.existsSync(folderPath)) {
      console.log(`⚠️  Folder not found: ${folderName}`);
      continue;
    }

    console.log(`\n📁 Processing folder: ${folderName}`);
    
    const files = fs.readdirSync(folderPath);
    
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      
      if (fs.statSync(filePath).isFile()) {
        const result = await uploadImage(filePath);
        if (result) {
          successCount++;
        } else {
          failCount++;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  // Upload missing root files
  console.log('\n📁 Processing root images');
  
  for (const fileName of missingRootFiles) {
    const filePath = path.join(imgDir, fileName);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${fileName}`);
      continue;
    }

    const result = await uploadImage(filePath);
    if (result) {
      successCount++;
    } else {
      failCount++;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n📊 Upload Summary:');
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  
  if (successCount > 0) {
    console.log('\n✨ Missing images uploaded successfully!');
  }
}

main().catch(console.error);
