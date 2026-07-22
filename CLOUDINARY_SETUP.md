# Cloudinary Setup - Quick Start

## ✅ What's Been Done

1. ✅ Installed Cloudinary packages (`cloudinary`)
2. ✅ Created Cloudinary helper utilities (`lib/cloudinary.ts`)
3. ✅ Added environment variables to `.env.local`
4. ✅ Created upload script (`scripts/upload-to-cloudinary.js`)
5. ✅ Created comprehensive migration guide (`CLOUDINARY_MIGRATION.md`)

## 🚀 Next Steps (You Need To Do)

### 1. Create Cloudinary Account
- Go to: https://cloudinary.com/
- Sign up for free
- Get your credentials from dashboard

### 2. Configure Credentials
Edit `.env.local` and add your actual credentials:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 3. Upload Images
Run the upload script:
```bash
node scripts/upload-to-cloudinary.js
```

This will upload all ~150+ images to Cloudinary and show you the new URLs.

### 4. Update Code (Optional - Can Be Done Later)
The images are currently using local paths. After upload, you can:

**Quick Test**: Just replace a few image paths to test:
```typescript
// Before
<img src="/img/coding.jpg" />

// After (example URL from Cloudinary)
<img src="https://res.cloudinary.com/your-cloud/image/upload/rhema-expert-solutions/coding.jpg" />
```

**Or use the helper** (better for transformations):
```typescript
import { getCloudinaryUrl } from '@/lib/cloudinary';

<img src={getCloudinaryUrl('rhema-expert-solutions/coding', { width: 800 })} />
```

### 5. Add to Vercel
Add these environment variables in Vercel dashboard:
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## 📊 Expected Results

After migration:
- **Vercel Image Optimization**: Reduced to ~0 (images served from Cloudinary)
- **Bandwidth Savings**: Cloudinary handles all image delivery
- **Performance**: Faster image loading with Cloudinary's CDN
- **Cost**: Free tier should be more than enough (25GB storage + 25GB bandwidth/month)

## 🎯 Current Image Count

Based on the file structure, you have approximately:
- 150+ images in `/public/img/`
- Categories: coding, robotics, chemistry, physics, cctv, drone, lab, etc.

## 📁 Files Created

1. `lib/cloudinary.ts` - Helper functions for Cloudinary
2. `scripts/upload-to-cloudinary.js` - Upload script
3. `CLOUDINARY_MIGRATION.md` - Detailed migration guide
4. `CLOUDINARY_SETUP.md` - This file
5. `.env.local` - Updated with Cloudinary variables

## 🔧 Need Help?

- Full guide: `CLOUDINARY_MIGRATION.md`
- Cloudinary docs: https://cloudinary.com/docs
- Check upload progress: https://cloudinary.com/console

## ⚡ Quick Commands

```bash
# Upload images
node scripts/upload-to-cloudinary.js

# Test locally
npm run dev

# Deploy to Vercel
npx vercel --prod
```

---

**Note**: The actual code changes to use Cloudinary URLs are optional. You can upload the images first, then gradually update the code to use Cloudinary URLs instead of local paths.
