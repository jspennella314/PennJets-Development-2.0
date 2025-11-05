# PennJets Blog Image Gallery

This directory contains all images used in PennJets blog articles.

## Directory Structure

```
blog/
├── featured/           # Featured images for blog post cards and headers
├── content/           # Images used within blog article content
├── authors/           # Author profile photos
└── README.md          # This file
```

## How to Add Blog Images

### Option 1: Direct Upload (Current Method)

1. Place your images in the appropriate subdirectory:
   - **Featured images**: `public/images/blog/featured/`
   - **Content images**: `public/images/blog/content/`
   - **Author photos**: `public/images/blog/authors/`

2. Use descriptive filenames with hyphens (e.g., `premier-1a-cabin-luxury.jpg`)

3. Reference images in your blog post using:
   ```
   /images/blog/featured/your-image-name.jpg
   /images/blog/content/your-image-name.jpg
   /images/blog/authors/your-name.jpg
   ```

### Option 2: Future Instagram Integration

In the future, you'll be able to:
- Link Instagram posts directly
- Auto-import images from Instagram URLs
- Use Instagram captions and metadata

## Image Guidelines

### Featured Images (Blog Post Headers)
- **Dimensions**: 1200x630px (16:9 aspect ratio)
- **File size**: < 500KB
- **Format**: JPG or WebP
- **Purpose**: Displayed on blog listing cards and article headers

### Content Images (In-Article)
- **Dimensions**: Max width 1200px
- **File size**: < 300KB per image
- **Format**: JPG, PNG, or WebP
- **Purpose**: Visual content within blog articles

### Author Photos
- **Dimensions**: 300x300px (square)
- **File size**: < 100KB
- **Format**: JPG or PNG
- **Purpose**: Author bio sections and bylines

## Image Optimization Tips

1. **Compress images** before uploading (use TinyPNG or similar)
2. **Use descriptive names** for SEO: `aircraft-depreciation-tax-savings.jpg`
3. **Include alt text** when adding to blog posts for accessibility
4. **Test on mobile** to ensure images look good on all devices

## Accessing Images in Blog Posts

When writing your blog post in the CRM, use the full path:

**Example for featured image:**
```
/images/blog/featured/premier-1a-sunset.jpg
```

**Example for content image in HTML:**
```html
<img src="/images/blog/content/cockpit-view.jpg" alt="Premier 1A Cockpit View" />
```

## Current Images

This directory will be populated as blog posts are created. Images will be automatically served from:
- **Development**: `http://localhost:3000/images/blog/`
- **Production**: `https://www.pennjets.com/images/blog/`

## Git Considerations

- ✅ Small images (< 1MB) can be committed to git
- ❌ Large images or videos should use alternative hosting
- 💡 Consider using a CDN for production images in the future

## Need Help?

Contact the development team if you need:
- Batch image uploads
- Image optimization tools
- CDN integration
- Instagram API setup
