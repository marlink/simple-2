#!/usr/bin/env node

/**
 * Content Processor
 * Handles Markdown to HTML conversion and content parsing
 */

const fs = require('fs');
const path = require('path');

/**
 * Simple Markdown to HTML converter
 * (Can be replaced with marked or markdown-it for full Markdown support)
 */
function markdownToHTML(markdown) {
  let html = markdown;
  
  // Headings
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Paragraphs (lines not starting with #, >, or [)
  html = html.split('\n').map(line => {
    const trimmed = line.trim();
    if (!trimmed || 
        trimmed.startsWith('#') || 
        trimmed.startsWith('>') || 
        trimmed.startsWith('[') ||
        trimmed.startsWith('<')) {
      return line;
    }
    return `<p>${trimmed}</p>`;
  }).join('\n');
  
  return html;
}

/**
 * Process content file
 */
function processContent(contentPath) {
  if (!fs.existsSync(contentPath)) {
    throw new Error(`Content file not found: ${contentPath}`);
  }
  
  const content = fs.readFileSync(contentPath, 'utf8');
  return content;
}

module.exports = { processContent, markdownToHTML };

