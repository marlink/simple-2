# Fluid Typography System

A complete, reusable typography system with fluid scaling, vertical rhythm, and comprehensive utilities that automatically adapt to any screen size.

## Features

- ✅ **Display Styles** - 4 levels larger than h1 (`.display-1` through `.display-4`)
- ✅ **Complete Heading Hierarchy** - h1 through h6 with fluid scaling
- ✅ **Enhanced Headings** - Optional enhanced versions with improved fluid scaling
- ✅ **Utility Classes** - Lead paragraphs, muted text, strong text, text alignment
- ✅ **Content Components** - Blockquotes, code blocks, pre-formatted text
- ✅ **List Styles** - Enhanced unordered, ordered, and definition lists
- ✅ **Interactive Elements** - Tooltips, image captions
- ✅ **Accessibility** - Screen reader support, focus indicators, high contrast mode
- ✅ **Responsive** - Fluid scaling across 7 breakpoints (300px - 2400px)
- ✅ **Theme Support** - Works with light and dark themes

## Quick Start

### 1. Include the Typography System

Add the typography system CSS file after the framework CSS:

```html
<!-- Unified Responsive Framework -->
<link rel="stylesheet" href="assets/css/framework-unified.css">
<!-- Typography System -->
<link rel="stylesheet" href="assets/css/typography-system.css">
```

### 2. Use Typography Classes

```html
<!-- Display styles -->
<h1 class="display-1">Hero Title</h1>

<!-- Standard headings -->
<h1>Main Heading</h1>
<h2>Section Heading</h2>

<!-- Enhanced headings -->
<h1 class="enhanced">Enhanced Heading</h1>

<!-- Utility classes -->
<p class="lead">Lead paragraph text</p>
<p>Regular text with <span class="muted">muted text</span></p>
<p class="text-center">Center-aligned text</p>

<!-- Blockquote -->
<blockquote>
    <p>Quote text here</p>
    <cite>Author Name</cite>
</blockquote>

<!-- Code -->
<code>inline code</code>
<pre><code>code block</code></pre>

<!-- Lists -->
<ul>
    <li>List item</li>
</ul>
```

## Typography Scale

### Display Styles

Display styles are larger than h1 and perfect for hero sections:

| Class | Size Range | Use Case |
|-------|------------|----------|
| `.display-1` | 56-96px | Hero banners, landing pages |
| `.display-2` | 48-80px | Large section headers |
| `.display-3` | 40-64px | Prominent headings |
| `.display-4` | 32-56px | Section headers |

**Example:**
```html
<h1 class="display-1">Welcome to Our Site</h1>
```

### Heading Hierarchy

Standard headings (h1-h6) use the framework's existing font size variables:

| Element | Size Variable | Typical Range |
|---------|---------------|---------------|
| h1 | `--font-size-3xl` | 40-64px |
| h2 | `--font-size-2xl` | 32-48px |
| h3 | `--font-size-xl` | 24-32px |
| h4 | `--font-size-lg` | 18-24px |
| h5 | `--font-size-base` | 16-18px |
| h6 | `--font-size-sm` | 14-16px |

**Enhanced Headings:**

Add the `.enhanced` class for improved fluid scaling:

```html
<h1 class="enhanced">Enhanced Heading 1</h1>
<h2 class="enhanced">Enhanced Heading 2</h2>
```

Enhanced headings use optimized clamp() values for smoother scaling across breakpoints.

## Utility Classes

### Text Styles

- **`.lead`** - Larger, more prominent paragraph text
- **`.muted`** - Muted text color for less emphasis
- **`.strong`** - Bold text with proper color
- **`.text-left`** - Left-aligned text
- **`.text-center`** - Center-aligned text
- **`.text-right`** - Right-aligned text
- **`.text-justify`** - Justified text

**Examples:**
```html
<p class="lead">This is a lead paragraph for introductions.</p>
<p>Regular text with <span class="muted">muted text</span>.</p>
<p class="text-center">Center-aligned paragraph</p>
```

## Content Components

### Blockquote

Blockquotes include a left border and italic styling:

```html
<blockquote>
    <p>The best way to predict the future is to invent it.</p>
    <cite>Steve Jobs</cite>
</blockquote>
```

**Customization:**
```css
:root {
    --blockquote-border-width: 4px;
    --blockquote-border-color: var(--color-primary);
    --blockquote-padding-left: var(--space-6);
}
```

### Code Blocks

**Inline Code:**
```html
Use <code>const variable = 'value'</code> for inline code.
```

**Code Blocks:**
```html
<pre><code>function example() {
    return 'code';
}</code></pre>
```

**Code Block with Wrapper:**
```html
<div class="code-block">
    <pre><code>// Your code here</code></pre>
</div>
```

The `.code-block` wrapper adds enhanced styling and scrollbar customization.

### Lists

**Unordered Lists:**
```html
<ul>
    <li>First item</li>
    <li>Second item
        <ul>
            <li>Nested item</li>
        </ul>
    </li>
</ul>
```

**Ordered Lists:**
```html
<ol>
    <li>First step</li>
    <li>Second step</li>
</ol>
```

**Definition Lists:**
```html
<dl>
    <dt>Term</dt>
    <dd>Definition of the term</dd>
</dl>
```

**List Utilities:**
- **`.list-unstyled`** - Remove bullets/numbers
- **`.list-inline`** - Display items inline

```html
<ul class="list-unstyled">
    <li>No bullets</li>
</ul>

<ul class="list-inline">
    <li>Item 1</li>
    <li>Item 2</li>
</ul>
```

## Interactive Elements

### Tooltip

Add tooltips to any element:

```html
<span class="tooltip" data-tooltip="Helpful tooltip text">Hover me</span>
```

Tooltips appear on hover with a smooth fade-in animation.

### Image Caption

Use either `<figcaption>` or `.caption` class:

```html
<figure>
    <img src="image.jpg" alt="Description">
    <figcaption>Image caption text</figcaption>
</figure>

<!-- Or -->
<img src="image.jpg" alt="Description">
<p class="caption">Caption text</p>
```

## Accessibility Features

### Screen Reader Only

Hide content visually but keep it available for screen readers:

```html
<p class="sr-only">Screen reader only text</p>
```

### Focus Indicators

Enhanced focus indicators are automatically applied to focusable elements:

```css
:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
}
```

### High Contrast Mode

The system automatically adapts when users enable high contrast mode:

```css
@media (prefers-contrast: high) {
    /* Enhanced contrast colors */
}
```

### Reduced Motion

Animations and transitions are disabled for users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
    /* Disable animations */
}
```

## Customization

### Override CSS Variables

All typography values are controlled by CSS variables. Override them in your stylesheet:

```css
:root {
    /* Display sizes */
    --font-size-display-1: clamp(4rem, 3.5rem + 3vw, 7rem);
    --font-size-display-2: clamp(3.5rem, 3rem + 2.5vw, 6rem);
    
    /* Enhanced heading sizes */
    --font-size-h1-enhanced: clamp(3rem, 2.5rem + 2.5vw, 5rem);
    
    /* Lead paragraph */
    --font-size-lead: clamp(1.25rem, 1.1rem + 0.5vw, 1.625rem);
    
    /* Line heights */
    --line-height-base: 1.6;
    --line-height-heading: 1.25;
    --line-height-display: 1.1;
    
    /* Blockquote */
    --blockquote-border-width: 6px;
    --blockquote-padding-left: var(--space-8);
    
    /* Tooltip */
    --tooltip-bg: var(--color-primary);
    --tooltip-color: var(--color-primary-contrast);
}
```

### Scale Factors

Adjust scale factors for different breakpoints:

```css
:root {
    --scale-factor-xs: 0.8;   /* 300px */
    --scale-factor-sm: 0.9;   /* 600px */
    --scale-factor-md: 1.0;   /* 768px */
    --scale-factor-lg: 1.1;   /* 1024px */
    --scale-factor-xl: 1.2;   /* 1280px */
    --scale-factor-xxl: 1.3;  /* 1600px */
    --scale-factor-xxxl: 1.4; /* 2400px */
}
```

### Font Families

The system uses Space Grotesk for headings and Inter for body text, with system font fallbacks:

```css
:root {
    --font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
    --font-family-heading: 'Space Grotesk', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
    --font-family-code: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
}
```

## System Font Fallbacks

The typography system includes comprehensive system font fallbacks for optimal performance and native feel:

### Body Text (Inter)
```css
'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif
```

- **Inter** - Primary web font
- **system-ui** - Generic system font (modern browsers)
- **-apple-system** - macOS/iOS system font (San Francisco)
- **BlinkMacSystemFont** - macOS/iOS fallback
- **Segoe UI** - Windows system font
- **Roboto** - Android/Chrome OS
- **Arial** - Universal fallback
- **sans-serif** - Generic fallback

### Headings (Space Grotesk)
```css
'Space Grotesk', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif
```

Same fallback stack as body text for consistency.

### Code (Monospace)
```css
'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace
```

- **Monaco** - macOS monospace font
- **Menlo** - macOS monospace
- **Ubuntu Mono** - Linux monospace
- **Consolas** - Windows monospace
- **source-code-pro** - Adobe monospace
- **monospace** - Generic fallback

## Vertical Rhythm

The typography system maintains consistent vertical rhythm using the baseline system:

- **Baseline:** `--baseline: 8px`
- **Spacing:** All margins and padding use multiples of baseline
- **Line Height:** Calculated from font-size and rhythm multiplier

**Example:**
```css
h1 {
    margin-bottom: var(--space-5); /* 40px = 5 × 8px */
    line-height: var(--line-height-heading); /* 1.2 */
}
```

## Breakpoints

The typography system scales fluidly across all framework breakpoints:

| Breakpoint | Width | Scale Factor |
|------------|-------|--------------|
| XS | 300px | 0.8 |
| SM | 600px | 0.9 |
| MD | 768px | 1.0 |
| LG | 1024px | 1.1 |
| XL | 1280px | 1.2 |
| XXL | 1600px | 1.3 |
| XXXL | 2400px | 1.4 |

Typography automatically scales between these breakpoints using `clamp()` functions.

## Integration with Framework

The typography system integrates seamlessly with the existing framework:

- Uses existing `--baseline`, `--font-family`, `--font-family-heading` variables
- Respects existing `--color-text`, `--color-text-muted` variables
- Works with existing spacing utilities (`--space-*`)
- Compatible with existing grid system
- Supports light/dark theme switching

## Best Practices

### 1. Use Semantic HTML

Always use semantic HTML elements:

```html
<!-- Good -->
<h1>Main Title</h1>
<p class="lead">Introduction</p>

<!-- Avoid -->
<div class="display-1">Main Title</div>
<div class="lead">Introduction</div>
```

### 2. Maintain Hierarchy

Follow a logical heading hierarchy:

```html
<h1>Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection</h3>
```

### 3. Use Display Styles Sparingly

Display styles are for hero sections and banners, not regular content:

```html
<!-- Good - Hero section -->
<section class="hero">
    <h1 class="display-1">Welcome</h1>
</section>

<!-- Avoid - Regular content -->
<article>
    <h1 class="display-1">Article Title</h1>
</article>
```

### 4. Leverage Utility Classes

Use utility classes for text styling:

```html
<p class="lead">Important introduction</p>
<p>Regular text with <span class="muted">less important info</span></p>
```

### 5. Ensure Accessibility

- Use proper heading hierarchy
- Include alt text for images
- Use semantic HTML elements
- Test with screen readers
- Ensure sufficient color contrast

## Examples

See `typography-demo.html` for a complete demonstration of all typography components.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS `clamp()` support required for fluid scaling
- Graceful degradation for older browsers

## Related Documentation

- [Framework README](../FRAMEWORK-README.md) - Grid system and base framework
- [Framework Unified CSS](../assets/css/framework-unified.css) - Base framework styles

## License

Part of the Unified Responsive CSS Framework.

