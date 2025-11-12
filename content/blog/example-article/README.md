# Example Article Structure

This is an example article folder structure. Copy this folder and modify the content to create new articles.

## Required Files

- `meta.json` - Article metadata (title, description, tags, etc.)
- `content.md` - Article content in Markdown format

## Optional Folders

- `images/` - Place images here. Name them descriptively (e.g., `collaborative-learning.jpg`) and they will be automatically matched to relevant text sections.
- `videos/` - Place videos here. Use `[VIDEO: filename.mp4]` in content.md for manual placement.

## How Images Are Matched

Images are automatically matched to text sections based on filename keywords. For example:
- `collaborative-learning.jpg` will be placed near text mentioning "collaborative" or "learning"
- `technology-enhanced.jpg` will be placed near text mentioning "technology" or "enhanced"

## Manual Placement

You can also manually place images/videos using markers in your content:

```
[IMAGE: filename.jpg]
[VIDEO: demo.mp4]
```

## Generating the Article

After creating your content, run:

```bash
npm run generate:article example-article
```

The script will:
1. Optimize and copy images to `assets/images/blog/example-article/`
2. Generate HTML page at `blog/example-article.html`
3. Match images to relevant text sections automatically

