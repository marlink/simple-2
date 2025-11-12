#!/usr/bin/env node

/**
 * Asset Optimizer
 * Optimizes images and videos for web
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available (optional dependency)
let sharp = null;
try {
  sharp = require('sharp');
} catch (e) {
  console.warn('⚠️  sharp not installed. Install with: npm install --save-dev sharp');
  console.warn('   Images will be copied without optimization.');
}

/**
 * Optimize image
 */
async function optimizeImage(inputPath, outputPath, maxWidth = 1920, quality = 85) {
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  if (sharp) {
    try {
      const ext = path.extname(inputPath).toLowerCase();
      
      // Handle different image formats
      let sharpImage = sharp(inputPath).resize(maxWidth, null, { withoutEnlargement: true });
      
      if (ext === '.jpg' || ext === '.jpeg') {
        await sharpImage.jpeg({ quality }).toFile(outputPath);
      } else if (ext === '.png') {
        await sharpImage.png({ quality: Math.min(quality, 90) }).toFile(outputPath);
      } else if (ext === '.webp') {
        await sharpImage.webp({ quality }).toFile(outputPath);
      } else {
        // For other formats, just resize and convert to jpeg
        await sharpImage.jpeg({ quality }).toFile(outputPath.replace(ext, '.jpg'));
      }
      
      return true;
    } catch (error) {
      console.warn(`Failed to optimize ${inputPath}:`, error.message);
      // Fallback to copy
      fs.copyFileSync(inputPath, outputPath);
      return false;
    }
  } else {
    // Just copy if sharp not available
    fs.copyFileSync(inputPath, outputPath);
    return false;
  }
}

/**
 * Optimize all assets for an article
 */
async function optimizeAssets(images, videos, articleSlug, articleType) {
  const outputBase = path.join(__dirname, '../assets/images', articleType, articleSlug);
  
  // Ensure output directory exists
  if (!fs.existsSync(outputBase)) {
    fs.mkdirSync(outputBase, { recursive: true });
  }
  
  // Process images
  for (const imagePath of images) {
    const filename = path.basename(imagePath);
    const outputPath = path.join(outputBase, filename);
    
    console.log(`  Processing image: ${filename}`);
    
    // Determine max width based on filename
    // hero, banner, full-width -> 1920px
    // regular -> 1200px
    // thumbnail -> 600px
    let maxWidth = 1200;
    const name = filename.toLowerCase();
    if (name.includes('hero') || name.includes('banner') || name.includes('full')) {
      maxWidth = 1920;
    } else if (name.includes('thumb') || name.includes('small')) {
      maxWidth = 600;
    }
    
    await optimizeImage(imagePath, outputPath, maxWidth);
  }
  
  // Process videos (just copy for now - can add ffmpeg compression later)
  const videosDir = path.join(outputBase, 'videos');
  if (videos.length > 0 && !fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }
  
  for (const videoPath of videos) {
    const filename = path.basename(videoPath);
    const outputPath = path.join(videosDir, filename);
    
    console.log(`  Copying video: ${filename}`);
    fs.copyFileSync(videoPath, outputPath);
  }
  
  console.log(`✅ Assets optimized and copied to ${outputBase}`);
}

module.exports = { optimizeAssets, optimizeImage };

