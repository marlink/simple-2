# Content Directory

This directory contains source content for blog articles and case studies.

## Structure

```
content/
├── blog/
│   └── article-slug/
│       ├── meta.json          # Article metadata
│       ├── content.md         # Article content (Markdown)
│       ├── images/            # Source images (will be optimized)
│       └── videos/           # Source videos
└── case-studies/
    └── case-slug/
        ├── meta.json
        ├── content.md
        ├── images/
        └── videos/
```

## Quick Start

1. Copy the `example-article` folder as a template
2. Rename it to your article slug (e.g., `my-article`)
3. Edit `meta.json` with your article information
4. Write your content in `content.md`
5. Add images to the `images/` folder (name them descriptively!)
6. Run: `npm run generate:article my-article`

## Image Naming Tips

Name images with descriptive keywords that match your text content:

✅ **Good names:**
- `collaborative-learning-classroom.jpg`
- `technology-enhanced-education.jpg`
- `students-hands-on-activities.jpg`

❌ **Bad names:**
- `IMG_1234.jpg`
- `photo.jpg`
- `image1.jpg`

The system automatically matches images to text sections based on filename keywords!

## Documentation

See `docs/CONTENT-GENERATION.md` for full documentation.

