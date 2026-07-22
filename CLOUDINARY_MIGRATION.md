# Cloudinary Image Migration Guide

This guide will help you migrate all images from your local `/public/img` directory to Cloudinary to reduce Vercel's image optimization resources.

## Benefits of Using Cloudinary

- ✅ **Reduced Vercel Usage**: No more image optimization costs on Vercel
- ✅ **Better Performance**: Cloudinary's global CDN delivers images faster
- ✅ **Automatic Optimization**: Images are automatically compressed and converted to WebP/AVIF
- ✅ **Responsive Images**: Automatic resizing for different screen sizes
- ✅ **Free Tier**: 25 GB storage + 25 GB bandwidth per month (more than enough for this site)

## Step 1: Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Click "Sign Up for Free"
3. Complete the registration
4. You'll be taken to your dashboard

## Step 2: Get Your Cloudinary Credentials

From your Cloudinary dashboard:

1. **Cloud Name**: Found at the top of the dashboard
2. **API Key**: Go to Settings → API Keys → Generate API Key
3. **API Secret**: Same location as API Key

## Step 3: Configure Environment Variables

Open `.env.local` and replace the placeholder values:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

## Step 4: Upload Images to Cloudinary

Run the upload script:

```bash
node scripts/upload-to-cloudinary.js
```

This will:
- Upload all images from `/public/img` to Cloudinary
- Maintain the folder structure
- Display upload progress
- Show the Cloudinary URLs

**Note**: The script will create a folder structure like:
- `rhema-expert-solutions/coding/`
- `rhema-expert-solutions/robotics/`
- `rhema-expert-solutions/chemistry/`
- etc.

## Step 5: Update Code to Use Cloudinary

### Option A: Use the Helper Function (Recommended)

Import the helper in your components:

```typescript
import { getCloudinaryUrl } from '@/lib/cloudinary';

// Instead of:
<img src="/img/coding/main/image1.jpg" />

// Use:
<img src={getCloudinaryUrl('rhema-expert-solutions/coding/main/image1', { width: 800 })} />
```

### Option B: Direct Cloudinary URLs

After uploading, you'll get URLs like:
```
https://res.cloudinary.com/your-cloud-name/image/upload/rhema-expert-solutions/coding/main/image1.jpg
```

You can use these directly in your code.

### Option C: Use Cloudinary React Component

```typescript
import { Image } from '@cloudinary/react';
import { AdvancedImage } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';

const myImage = new AdvancedImage()
  .publicId('rhema-expert-solutions/coding/main/image1')
  .resize(fill().width(800));

<Image cldImg={myImage} alt="Coding class" />
```

## Step 6: Test Locally

1. Make sure your `.env.local` has the Cloudinary credentials
2. Restart your dev server: `npm run dev`
3. Check that all images load correctly
4. Verify images are loading from Cloudinary (check Network tab in DevTools)

## Step 7: Deploy to Vercel

1. Add Cloudinary environment variables to Vercel:
   - Go to your Vercel project settings
   - Navigate to Environment Variables
   - Add:
     - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`

2. Deploy your changes:
   ```bash
   git add .
   git commit -m "feat: migrate images to Cloudinary"
   git push origin main
   ```

## Step 8: Remove Images from Repository (Optional)

After confirming everything works:

1. You can delete the `/public/img` directory
2. Update `.gitignore` to exclude large image files
3. This will reduce your repository size

**Warning**: Keep a backup of your images before deleting!

## Image Transformation Examples

### Basic Resize
```typescript
getCloudinaryUrl('rhema-expert-solutions/coding/image1', { width: 400 })
```

### Resize with Height
```typescript
getCloudinaryUrl('rhema-expert-solutions/coding/image1', { 
  width: 400, 
  height: 300,
  crop: 'fill' 
})
```

### Quality Optimization
```typescript
getCloudinaryUrl('rhema-expert-solutions/coding/image1', { 
  quality: 'auto',
  format: 'auto'
})
```

### Responsive Images
```typescript
const { src, srcSet, sizes } = getResponsiveCloudinaryUrl('rhema-expert-solutions/coding/image1');

<img src={src} srcSet={srcSet} sizes={sizes} alt="Responsive image" />
```

## Troubleshooting

### Images Not Loading
- Check that Cloudinary credentials are correct in `.env.local`
- Verify images were uploaded successfully (check Cloudinary dashboard)
- Check browser console for errors

### Upload Script Fails
- Ensure you have internet connection
- Check Cloudinary API credentials
- Verify the `public/img` directory exists

### Build Errors
- Make sure all image paths are updated
- Check for any hardcoded `/img/` paths
- Verify Cloudinary package is installed: `npm list cloudinary`

## Monitoring Usage

Track your Cloudinary usage:
1. Go to Cloudinary Dashboard
2. Check "Usage" section
3. Monitor bandwidth and storage
4. Set up alerts if needed

## Cost Optimization

Cloudinary's free tier includes:
- 25 GB storage
- 25 GB bandwidth/month
- 25 credits for transformations

To optimize usage:
- Use responsive images to avoid serving oversized images
- Enable automatic quality optimization
- Cache images properly (Cloudinary handles this automatically)

## Support

- [Cloudinary Documentation](https://cloudinary.com/docs)
- [Cloudinary React SDK](https://cloudinary.com/documentation/react2)
- [Cloudinary Transformations](https://cloudinary.com/documentation/image_transformation_reference)

## Next Steps

After migration:
1. Monitor Vercel usage to confirm reduction
2. Test all pages to ensure images load correctly
3. Consider implementing lazy loading for additional optimization
4. Set up Cloudinary auto-upload for future images
