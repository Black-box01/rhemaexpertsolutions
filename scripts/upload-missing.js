#!/usr/bin/env node
/**
 * Script to upload missing images to Cloudinary
 * Handles folders with special characters (ai&iot, software development, staff)
 * and root-level images (coding.jpg, cup.png, preview.png)
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

// Sanitize name for Cloudinary
const sanitizeName = (name) => {
  return name.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').toLowerCase();
};

// Upload a single image
async function uploadImage(filePath, folder, publicId) {
  try {
    const sanitizedFolder = `rhema-expert-solutions/${folder}`;
    const sanitizedPublicId = sanitizeName(publicId);

    const options = {
      folder: sanitizedFolder,
      public_id: sanitizedPublicId,
      resource_type: 'image',
      overwrite: true,
    };

    const result = await cloudinary.uploader.upload(filePath, options);
    console.log(`✅ Uploaded: ${path.basename(filePath)}`);
    console.log(`   Public ID: ${result.public_id}`);
    console.log(`   URL: ${result.secure_url}\n`);
    return result;
  } catch (error) {
    console.error(`❌ Failed: ${path.basename(filePath)} - ${error.message}`);
    return null;
  }
}

// Main function
async function main() {
  console.log('🚀 Uploading missing images to Cloudinary...\n');

  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    console.error('❌ Cloudinary not configured! Check .env.local');
    process.exit(1);
  }

  const imgDir = path.join(__dirname, '..', 'public', 'img');
  let successCount = 0;
  let failCount = 0;

  // 1. Upload root-level images
  console.log('📷 Uploading root-level images...\n');
  const rootImages = ['coding.jpg', 'cup.png', 'preview.png'];
  for (const img of rootImages) {
    const filePath = path.join(imgDir, img);
    if (fs.existsSync(filePath)) {
      const publicId = path.basename(img, path.extname(img));
      const result = await uploadImage(filePath, '', publicId);
      if (result) successCount++; else failCount++;
      await new Promise(resolve => setTimeout(resolve, 500));
    } else {
      console.log(`⚠️  Not found: ${img}`);
    }
  }

  // 2. Upload ai&iot folder
  console.log('\n📁 Uploading ai&iot folder...\n');
  const aiIotDir = path.join(imgDir, 'ai&iot');
  if (fs.existsSync(aiIotDir)) {
    const files = fs.readdirSync(aiIotDir).filter(f => {
      return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f);
    });
    for (const file of files) {
      const filePath = path.join(aiIotDir, file);
      const publicId = path.basename(file, path.extname(file));
      const result = await uploadImage(filePath, 'ai-iot', publicId);
      if (result) successCount++; else failCount++;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  } else {
    console.log('⚠️  ai&iot folder not found');
  }

  // 3. Upload software development folder
  console.log('\n📁 Uploading software development folder...\n');
  const swDevDir = path.join(imgDir, 'software development');
  if (fs.existsSync(swDevDir)) {
    const files = fs.readdirSync(swDevDir).filter(f => {
      return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f);
    });
    for (const file of files) {
      const filePath = path.join(swDevDir, file);
      const publicId = path.basename(file, path.extname(file));
      const result = await uploadImage(filePath, 'software-development', publicId);
      if (result) successCount++; else failCount++;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  } else {
    console.log('⚠️  software development folder not found');
  }

  // 4. Upload staff folder
  console.log('\n📁 Uploading staff folder...\n');
  const staffDir = path.join(imgDir, 'staff');
  if (fs.existsSync(staffDir)) {
    const files = fs.readdirSync(staffDir).filter(f => {
      return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f);
    });
    for (const file of files) {
      const filePath = path.join(staffDir, file);
      const publicId = path.basename(file, path.extname(file));
      const result = await uploadImage(filePath, 'staff', publicId);
      if (result) successCount++; else failCount++;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  } else {
    console.log('⚠️  staff folder not found');
  }

  console.log('\n📊 Upload Summary:');
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📁 Total attempted: ${successCount + failCount}`);
}

main().catch(console.error);
