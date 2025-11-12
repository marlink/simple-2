# Content Generation System

This system automatically generates blog articles and case studies from content folders, intelligently matching images and videos to relevant text sections based on filenames.

## Overview

The content generation system:
- **Automatically matches images to text** based on filename keywords
- **Optimizes assets** (resizes images, compresses videos)
- **Generates HTML pages** from Markdown content
- **Supports manual placement** of images/videos
- **Maintains consistent structure** across all articles

## Quick Start

1. **Create a content folder:**
   ```
   content/blog/my-article/
     ├── meta.json
     ├── content.md
     ├── images/
     │   ├── hero-classroom.jpg
     │   └── collaborative-learning.jpg
     └── videos/
         └── demo.mp4
   ```

2. **Generate the article:**
   ```bash
   npm run generate:article my-article
   ```

3. **Result:**
   - Optimized images in `assets/images/blog/my-article/`
   - Generated HTML at `blog/my-article.html`

## Content Structure

### meta.json

Required metadata file:

```json
{
  "title": "Article Title",
  "subtitle": "Article subtitle or short description",
  "description": "Full description for SEO and meta tags",
  "author": "Author Name",
  "date": "2025-01-15",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "category": "blog"
}
```

### content.md

Markdown content file. Supports:

- **Headings:** `# H1`, `## H2`, `### H3`
- **Paragraphs:** Regular text
- **Blockquotes:** `> Quote text`
- **Manual asset placement:** `[IMAGE: filename.jpg]` or `[VIDEO: demo.mp4]`
- **Bold/Italic:** `**bold**` and `*italic*`
- **Links:** `[text](url)`

Example:
```markdown
# Article Title

Introduction paragraph here.

## Section Heading

More content about collaborative learning environments.

[IMAGE: collaborative-learning.jpg]

> This is a quote about education.

More paragraphs...
```

## Image Matching System

### Automatic Matching

Images are automatically matched to text sections based on filename keywords:

**How it works:**
1. Filename is parsed: `collaborative-learning-classroom.jpg` → `["collaborative", "learning", "classroom"]`
2. Keywords are matched against text content
3. Image is placed at the most relevant section
4. Placement is after paragraphs or before headings

**Best Practices:**
- Name images descriptively: `technology-enhanced-learning.jpg`
- Use keywords that appear in your text
- Separate words with hyphens or underscores

**Examples:**
- `collaborative-learning.jpg` → matches text with "collaborative" or "learning"
- `students-hands-on.jpg` → matches text with "students", "hands", or "on"
- `technology-enhanced.jpg` → matches text with "technology" or "enhanced"

### Manual Placement

For exact control, use placement markers:

```markdown
This paragraph discusses the topic.

[IMAGE: specific-image.jpg]

The image above will appear exactly here.
```

## Asset Optimization

### Images

Images are automatically optimized:
- **Hero/Banner images:** Resized to max 1920px width
- **Regular images:** Resized to max 1200px width
- **Thumbnails:** Resized to max 600px width
- **Format:** JPEG with 85% quality (or original format preserved)

**Filename hints:**
- `hero-*.jpg` → 1920px max width
- `banner-*.jpg` → 1920px max width
- `full-*.jpg` → 1920px max width
- `thumb-*.jpg` → 600px max width
- `small-*.jpg` → 600px max width
- Others → 1200px max width

### Videos

Videos are copied as-is (compression can be added later with ffmpeg).

## Commands

### Generate Blog Article
```bash
npm run generate:article <article-slug>
```

### Generate Case Study
```bash
npm run generate:case-study <case-study-slug>
```

## File Structure

```
project/
├── content/
│   ├── blog/
│   │   └── article-slug/
│   │       ├── meta.json
│   │       ├── content.md
│   │       ├── images/
│   │       └── videos/
│   └── case-studies/
│       └── case-slug/
│           ├── meta.json
│           ├── content.md
│           ├── images/
│           └── videos/
├── blog/
│   └── article-slug.html (generated)
├── case-studies/
│   └── case-slug.html (generated)
└── assets/
    └── images/
        ├── blog/
        │   └── article-slug/ (optimized images)
        └── case-studies/
            └── case-slug/ (optimized images)
```

## Workflow Example

1. **Create content folder:**
   ```bash
   mkdir -p content/blog/my-new-article/images
   ```

2. **Add metadata:**
   ```bash
   # Create meta.json with article info
   ```

3. **Write content:**
   ```bash
   # Write content.md with your article text
   ```

4. **Add images:**
   ```bash
   # Copy images to content/blog/my-new-article/images/
   # Name them descriptively: collaborative-learning.jpg
   ```

5. **Generate:**
   ```bash
   npm run generate:article my-new-article
   ```

6. **Result:**
   - `blog/my-new-article.html` - Generated article page
   - `assets/images/blog/my-new-article/` - Optimized images

## Tips & Best Practices

### Image Naming
✅ **Good:**
- `collaborative-learning-classroom.jpg`
- `technology-enhanced-education.jpg`
- `students-hands-on-activities.jpg`

❌ **Bad:**
- `IMG_1234.jpg`
- `photo.jpg`
- `image1.jpg`

### Content Organization
- Use descriptive headings to create natural break points
- Place images logically in the narrative flow
- Use manual placement for critical images
- Let automatic matching handle supporting images

### SEO
- Fill out all meta.json fields
- Use descriptive titles and descriptions
- Add relevant tags
- Include alt text (generated from filenames)

## Troubleshooting

### Images not appearing
- Check that images are in the `images/` folder
- Verify filenames match exactly (case-sensitive)
- Ensure image format is supported (jpg, png, gif, webp)

### Images in wrong place
- Use manual placement: `[IMAGE: filename.jpg]`
- Rename image to match text keywords better
- Check filename has relevant keywords

### Optimization not working
- Install sharp: `npm install --save-dev sharp`
- Check image file permissions
- Verify image format is supported

## Advanced Usage

### Custom Image Captions

Currently, captions are auto-generated from filenames. To customize, edit the generated HTML or modify `generateImageHTML()` in `scripts/generate-article.js`.

### Video Support

Videos are supported but not compressed. To add compression:
1. Install ffmpeg
2. Modify `optimize-assets.js` to compress videos
3. Add video compression logic

### Multiple Images in Grid

The system supports image grids. To use:
1. Name images with similar prefixes: `grid-1.jpg`, `grid-2.jpg`
2. Modify `generateImageHTML()` to detect and group similar images
3. Generate grid HTML structure

## Scripts Reference

- `scripts/generate-article.js` - Main article generator
- `scripts/process-content.js` - Content parsing and processing
- `scripts/optimize-assets.js` - Image/video optimization

