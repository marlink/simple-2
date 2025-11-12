#!/usr/bin/env node

/**
 * Article Generator Script
 * 
 * Generates blog articles and case studies from content folders.
 * Intelligently matches images/videos to text sections based on filenames.
 * 
 * Usage:
 *   npm run generate:article <article-slug>
 *   npm run generate:case-study <case-study-slug>
 */

const fs = require('fs');
const path = require('path');
const { processContent } = require('./process-content');
const { optimizeAssets } = require('./optimize-assets');

const CONTENT_DIR = path.join(__dirname, '../content');
const BLOG_DIR = path.join(__dirname, '../blog');
const CASE_STUDIES_DIR = path.join(__dirname, '../case-studies');
const ASSETS_DIR = path.join(__dirname, '../assets/images');

// Article types
const ARTICLE_TYPES = {
  blog: {
    sourceDir: path.join(CONTENT_DIR, 'blog'),
    outputDir: BLOG_DIR,
    template: 'blog-details.html',
    listingFile: 'blog.html'
  },
  'case-study': {
    sourceDir: path.join(CONTENT_DIR, 'case-studies'),
    outputDir: CASE_STUDIES_DIR,
    template: 'blog-details.html', // Can create separate template later
    listingFile: 'blog.html' // Or separate case-studies.html
  }
};

/**
 * Extract keywords from filename
 * e.g., "collaborative-learning-classroom.jpg" -> ["collaborative", "learning", "classroom"]
 */
function extractKeywords(filename) {
  const name = path.basename(filename, path.extname(filename));
  return name
    .toLowerCase()
    .split(/[-_\s]+/)
    .filter(word => word.length > 2); // Filter out short words
}

/**
 * Calculate relevance score between image keywords and text content
 */
function calculateRelevance(keywords, text) {
  const textLower = text.toLowerCase();
  let score = 0;
  
  keywords.forEach(keyword => {
    // Exact match gets higher score
    if (textLower.includes(keyword)) {
      score += 10;
    }
    // Partial match (word boundary)
    const regex = new RegExp(`\\b${keyword}`, 'gi');
    const matches = textLower.match(regex);
    if (matches) {
      score += matches.length * 5;
    }
  });
  
  return score;
}

/**
 * Find best placement for image in content sections
 */
function findBestPlacement(imageFile, contentSections) {
  const keywords = extractKeywords(imageFile);
  let bestSection = null;
  let bestScore = 0;
  let bestPosition = 'after'; // 'after' paragraph or 'before' heading
  
  contentSections.forEach((section, index) => {
    const score = calculateRelevance(keywords, section.text);
    
    if (score > bestScore) {
      bestScore = score;
      bestSection = index;
      
      // Prefer placing after paragraph if it's a paragraph
      // Prefer placing before heading if next section is a heading
      if (section.type === 'paragraph') {
        bestPosition = 'after';
      } else if (index < contentSections.length - 1 && 
                 contentSections[index + 1].type === 'heading') {
        bestPosition = 'before';
      } else {
        bestPosition = 'after';
      }
    }
  });
  
  return { sectionIndex: bestSection, position: bestPosition, score: bestScore };
}

/**
 * Parse content into sections (paragraphs, headings, etc.)
 */
function parseContentSections(content) {
  const sections = [];
  const lines = content.split('\n');
  
  let currentParagraph = '';
  
  lines.forEach(line => {
    const trimmed = line.trim();
    
    // Check for headings
    if (trimmed.match(/^#{1,6}\s+/)) {
      if (currentParagraph) {
        sections.push({
          type: 'paragraph',
          text: currentParagraph.trim(),
          raw: currentParagraph.trim()
        });
        currentParagraph = '';
      }
      
      const level = trimmed.match(/^(#{1,6})/)[1].length;
      const text = trimmed.replace(/^#{1,6}\s+/, '');
      sections.push({
        type: 'heading',
        level,
        text,
        raw: trimmed
      });
    }
    // Check for manual placement markers
    else if (trimmed.match(/^\[(IMAGE|VIDEO):\s*(.+?)\]$/i)) {
      if (currentParagraph) {
        sections.push({
          type: 'paragraph',
          text: currentParagraph.trim(),
          raw: currentParagraph.trim()
        });
        currentParagraph = '';
      }
      
      const match = trimmed.match(/^\[(IMAGE|VIDEO):\s*(.+?)\]$/i);
      sections.push({
        type: 'manual-asset',
        assetType: match[1].toLowerCase(),
        filename: match[2].trim(),
        raw: trimmed
      });
    }
    // Check for blockquotes
    else if (trimmed.startsWith('>')) {
      if (currentParagraph) {
        sections.push({
          type: 'paragraph',
          text: currentParagraph.trim(),
          raw: currentParagraph.trim()
        });
        currentParagraph = '';
      }
      
      const quoteText = trimmed.replace(/^>\s*/, '');
      sections.push({
        type: 'quote',
        text: quoteText,
        raw: trimmed
      });
    }
    // Regular paragraph content
    else if (trimmed) {
      currentParagraph += (currentParagraph ? ' ' : '') + trimmed;
    } else {
      // Empty line - end current paragraph
      if (currentParagraph) {
        sections.push({
          type: 'paragraph',
          text: currentParagraph.trim(),
          raw: currentParagraph.trim()
        });
        currentParagraph = '';
      }
    }
  });
  
  // Add final paragraph if exists
  if (currentParagraph) {
    sections.push({
      type: 'paragraph',
      text: currentParagraph.trim(),
      raw: currentParagraph.trim()
    });
  }
  
  return sections;
}

/**
 * Generate HTML from content sections with auto-placed images
 */
function generateContentHTML(sections, images, videos, articleSlug, type) {
  const htmlSections = [];
  const usedImages = new Set();
  const usedVideos = new Set();
  
  // Auto-place images that aren't manually placed
  const unplacedImages = images.filter(img => {
    return !sections.some(s => 
      s.type === 'manual-asset' && 
      s.filename === path.basename(img)
    );
  });
  
  // Find placements for unplaced images
  const imagePlacements = unplacedImages.map(img => {
    const placement = findBestPlacement(img, sections);
    return { image: img, ...placement };
  }).filter(p => p.score > 0) // Only place if relevance > 0
    .sort((a, b) => b.score - a.score); // Sort by relevance
  
  // Create placement map
  const placementMap = new Map();
  imagePlacements.forEach(({ image, sectionIndex, position }) => {
    if (!placementMap.has(sectionIndex)) {
      placementMap.set(sectionIndex, []);
    }
    placementMap.get(sectionIndex).push({ image, position });
  });
  
  // Generate HTML sections
  sections.forEach((section, index) => {
    // Handle manual asset placement
    if (section.type === 'manual-asset') {
      const assetPath = path.join(
        section.assetType === 'image' ? 
          path.join(CONTENT_DIR, type, articleSlug, 'images') :
          path.join(CONTENT_DIR, type, articleSlug, 'videos'),
        section.filename
      );
      
      if (fs.existsSync(assetPath)) {
        if (section.assetType === 'image') {
          htmlSections.push(generateImageHTML(assetPath, articleSlug, type));
          usedImages.add(section.filename);
        } else {
          htmlSections.push(generateVideoHTML(assetPath, articleSlug, type));
          usedVideos.add(section.filename);
        }
      }
      return;
    }
    
    // Add section content
    if (section.type === 'heading') {
      const tag = `h${section.level}`;
      htmlSections.push(`<${tag}>${escapeHTML(section.text)}</${tag}>`);
    } else if (section.type === 'quote') {
      htmlSections.push(`<blockquote class="blog-quote">${escapeHTML(section.text)}</blockquote>`);
    } else if (section.type === 'paragraph') {
      htmlSections.push(`<p>${escapeHTML(section.text)}</p>`);
    }
    
    // Check for auto-placed images after this section
    if (placementMap.has(index)) {
      const placements = placementMap.get(index);
      placements.forEach(({ image, position }) => {
        if (position === 'after' && !usedImages.has(path.basename(image))) {
          htmlSections.push(generateImageHTML(image, articleSlug, type));
          usedImages.add(path.basename(image));
        }
      });
    }
    
    // Check for auto-placed images before next section
    if (placementMap.has(index + 1)) {
      const placements = placementMap.get(index + 1);
      placements.forEach(({ image, position }) => {
        if (position === 'before' && !usedImages.has(path.basename(image))) {
          htmlSections.push(generateImageHTML(image, articleSlug, type));
          usedImages.add(path.basename(image));
        }
      });
    }
  });
  
  return htmlSections.join('\n\n');
}

/**
 * Generate image HTML
 */
function generateImageHTML(imagePath, articleSlug, type) {
  const filename = path.basename(imagePath);
  const altText = generateAltText(filename);
  const imageUrl = `assets/images/${type}/${articleSlug}/${filename}`;
  
  // Check if it should be a grid (multiple images with similar names)
  // For now, single image
  return `<img loading="lazy" src="${imageUrl}" alt="${altText}">
<p class="blog-image-caption">${altText}</p>`;
}

/**
 * Generate video HTML
 */
function generateVideoHTML(videoPath, articleSlug, type) {
  const filename = path.basename(videoPath);
  const videoUrl = `assets/images/${type}/${articleSlug}/videos/${filename}`;
  
  return `<video controls class="blog-video" style="width: 100%; max-width: 100%; border-radius: var(--border-radius);">
    <source src="${videoUrl}" type="video/${path.extname(filename).slice(1)}">
    Your browser does not support the video tag.
</video>`;
}

/**
 * Generate alt text from filename
 */
function generateAltText(filename) {
  const name = path.basename(filename, path.extname(filename));
  return name
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Escape HTML
 */
function escapeHTML(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Main generation function
 */
async function generateArticle(articleSlug, articleType = 'blog') {
  const config = ARTICLE_TYPES[articleType];
  if (!config) {
    console.error(`Unknown article type: ${articleType}`);
    process.exit(1);
  }
  
  const sourcePath = path.join(config.sourceDir, articleSlug);
  
  if (!fs.existsSync(sourcePath)) {
    console.error(`Article not found: ${sourcePath}`);
    process.exit(1);
  }
  
  // Read metadata
  const metaPath = path.join(sourcePath, 'meta.json');
  if (!fs.existsSync(metaPath)) {
    console.error(`Metadata file not found: ${metaPath}`);
    process.exit(1);
  }
  
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  
  // Read content
  const contentPath = path.join(sourcePath, 'content.md');
  if (!fs.existsSync(contentPath)) {
    console.error(`Content file not found: ${contentPath}`);
    process.exit(1);
  }
  
  const content = fs.readFileSync(contentPath, 'utf8');
  
  // Get images and videos
  const imagesDir = path.join(sourcePath, 'images');
  const videosDir = path.join(sourcePath, 'videos');
  
  const images = fs.existsSync(imagesDir) 
    ? fs.readdirSync(imagesDir)
        .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
        .map(f => path.join(imagesDir, f))
    : [];
  
  const videos = fs.existsSync(videosDir)
    ? fs.readdirSync(videosDir)
        .filter(f => /\.(mp4|webm|ogg)$/i.test(f))
        .map(f => path.join(videosDir, f))
    : [];
  
  // Optimize assets
  console.log('Optimizing assets...');
  await optimizeAssets(images, videos, articleSlug, articleType);
  
  // Process content
  console.log('Processing content...');
  const sections = parseContentSections(content);
  const contentHTML = generateContentHTML(sections, images, videos, articleSlug, articleType);
  
  // Read template
  const templatePath = path.join(__dirname, '..', config.template);
  let template = fs.readFileSync(templatePath, 'utf8');
  
  // Replace template variables
  template = template.replace(/<title>.*?<\/title>/, `<title>${meta.title} – Your School</title>`);
  
  // Find and replace blog title
  const titleMatch = template.match(/<h1 class="blog-title">.*?<\/h1>/);
  if (titleMatch) {
    template = template.replace(titleMatch[0], `<h1 class="blog-title">${escapeHTML(meta.title)}</h1>`);
  }
  
  // Find and replace subtitle
  const subtitleMatch = template.match(/<p class="blog-subtitle">.*?<\/p>/);
  if (subtitleMatch) {
    template = template.replace(subtitleMatch[0], `<p class="blog-subtitle">${escapeHTML(meta.subtitle || meta.description)}</p>`);
  }
  
  // Find and replace meta tags
  const metaMatch = template.match(/<div class="blog-meta">.*?<\/div>/);
  if (metaMatch) {
    template = template.replace(metaMatch[0], `<div class="blog-meta">${meta.tags ? meta.tags.join(' • ') : ''}</div>`);
  }
  
  // Replace content - find the blog-content div and replace everything inside it
  const contentStart = template.indexOf('<div class="blog-content">');
  if (contentStart !== -1) {
    // Find the matching closing div by counting nested divs
    let depth = 0;
    let pos = contentStart + '<div class="blog-content">'.length;
    let contentEnd = -1;
    
    while (pos < template.length) {
      const nextOpen = template.indexOf('<div', pos);
      const nextClose = template.indexOf('</div>', pos);
      
      if (nextClose === -1) break;
      
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        pos = nextOpen + 4;
      } else {
        if (depth === 0) {
          contentEnd = nextClose;
          break;
        }
        depth--;
        pos = nextClose + 6;
      }
    }
    
    if (contentEnd !== -1) {
      const beforeContent = template.substring(0, contentStart + '<div class="blog-content">'.length);
      const afterContent = template.substring(contentEnd);
      
      // Indent the content HTML
      const indentedContent = contentHTML.split('\n').map((line, i) => {
        if (i === 0) return line;
        return '                    ' + line;
      }).join('\n');
      
      template = beforeContent + '\n                    ' + indentedContent + '\n                ' + afterContent;
    }
  }
  
  // Update SEO meta tags
  template = template.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${escapeHTML(meta.description)}"`);
  template = template.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${escapeHTML(meta.title)}"`);
  template = template.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${escapeHTML(meta.description)}"`);
  
  // Update URL in meta tags
  const slugUrl = `${articleSlug}.html`;
  template = template.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="https://yourschool.org/${articleType === 'blog' ? 'blog/' : 'case-studies/'}${slugUrl}"`);
  template = template.replace(/<meta name="twitter:url" content="[^"]*"/, `<meta name="twitter:url" content="https://yourschool.org/${articleType === 'blog' ? 'blog/' : 'case-studies/'}${slugUrl}"`);
  
  // Ensure output directory exists
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }
  
  // Write output file
  const outputPath = path.join(config.outputDir, `${articleSlug}.html`);
  fs.writeFileSync(outputPath, template, 'utf8');
  
  console.log(`✅ Article generated: ${outputPath}`);
  console.log('✅ Article generation complete!');
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const articleType = args[0] === 'case-study' ? 'case-study' : 'blog';
  const articleSlug = args[args[0] === 'case-study' ? 1 : 0];
  
  if (!articleSlug) {
    console.error('Usage: node generate-article.js [case-study] <article-slug>');
    process.exit(1);
  }
  
  generateArticle(articleSlug, articleType).catch(console.error);
}

module.exports = { generateArticle };

