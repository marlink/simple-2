# Responsive CSS Framework

A fully responsive, mobile-first CSS framework supporting viewports from 300px to 3600px with a 12-column grid system, fluid typography, and baseline rhythm.

## Features

- ✅ **12-Column Grid System** with base classes (`.col-12`, `.col-6`, `.col-3`, `.col-2`, `.col-1`)
- ✅ **7 Breakpoints**: xs (300px), sm (600px), md (768px), lg (1024px), xl (1280px), xxl (1600px), xxxl (2400px)
- ✅ **Fluid Typography** using `clamp()` for responsive text scaling
- ✅ **Baseline Rhythm System** for consistent vertical & horizontal spacing
- ✅ **Retina Support** including Apple Triple-Retina (3dppx)
- ✅ **High-Resolution Images** with `image-set()` support
- ✅ **CSS Custom Properties** for all configurable values
- ✅ **Graceful Fallbacks** for older browsers (Flexbox fallback for Grid, fixed values for clamp)

## Quick Start

1. Include the unified framework CSS (includes grid, components, accessibility):
```html
<link rel="stylesheet" href="assets/css/framework-unified.css">
```

2. Use the grid system:
```html
<div class="container">
    <div class="grid">
        <div class="col-12 col-md-6 col-lg-3">Column 1</div>
        <div class="col-12 col-md-6 col-lg-3">Column 2</div>
        <div class="col-12 col-md-6 col-lg-3">Column 3</div>
        <div class="col-12 col-md-6 col-lg-3">Column 4</div>
    </div>
</div>
```

## Grid System

### Base Classes

Base column classes activate at the `md` breakpoint (768px). Before that, all columns stack:

- `.col-12` - Full width (12/12 columns)
- `.col-6` - Half width (6/12 columns)
- `.col-3` - Quarter width (3/12 columns)
- `.col-2` - Sixth width (2/12 columns)
- `.col-1` - Twelfth width (1/12 columns)

### Responsive Breakpoint Classes

For fine-grained control, use breakpoint-specific classes:

```html
<!-- 1 column → 2 columns → 4 columns → 6 columns -->
<div class="col-12 col-sm-6 col-md-3 col-lg-2">Content</div>
```

Available breakpoint prefixes:
- `.col-xs-*` - 300px+
- `.col-sm-*` - 600px+
- `.col-md-*` - 768px+
- `.col-lg-*` - 1024px+
- `.col-xl-*` - 1280px+
- `.col-xxl-*` - 1600px+
- `.col-xxxl-*` - 2400px+

## Typography

All typography uses fluid `clamp()` values that scale smoothly across viewports:

```css
/* Example: Heading 1 */
h1 {
    font-size: var(--font-size-3xl);
    /* clamp(2.5rem, 2rem + 2.5vw, 4rem) */
}
```

Available font size variables:
- `--font-size-xs` - Extra small
- `--font-size-sm` - Small
- `--font-size-base` - Base (default)
- `--font-size-lg` - Large
- `--font-size-xl` - Extra large
- `--font-size-2xl` - 2X Large
- `--font-size-3xl` - 3X Large
- `--font-size-4xl` - 4X Large

## Baseline Rhythm System

All spacing is based on `--baseline` (8px) for consistent rhythm:

```css
:root {
    --baseline: 8px;
    --space-1: var(--baseline);        /* 8px */
    --space-2: calc(var(--baseline) * 2);  /* 16px */
    --space-3: calc(var(--baseline) * 3);  /* 24px */
    --space-4: calc(var(--baseline) * 4);  /* 32px */
    /* ... and so on */
}
```

### Spacing Utilities

- Margin: `.mt-1`, `.mt-2`, `.mt-3`, `.mt-4`, `.mt-5`, `.mt-6`, `.mt-8`
- Margin bottom: `.mb-1`, `.mb-2`, `.mb-3`, `.mb-4`, `.mb-5`, `.mb-6`, `.mb-8`
- Padding top: `.pt-1`, `.pt-2`, `.pt-3`, `.pt-4`, `.pt-5`, `.pt-6`, `.pt-8`
- Padding bottom: `.pb-1`, `.pb-2`, `.pb-3`, `.pb-4`, `.pb-5`, `.pb-6`, `.pb-8`

## Container System

Containers automatically adjust max-width and padding based on viewport:

```html
<div class="container">
    <!-- Content automatically centers and adjusts -->
</div>
```

Container max-widths:
- xs: 100%
- sm: 540px
- md: 720px
- lg: 960px
- xl: 1140px
- xxl: 1320px
- xxxl: 1800px

## Gutter System

Gutters (spacing between grid columns) respect the baseline rhythm and scale with breakpoints:

- `--gutter-xs`: 16px (2 baseline)
- `--gutter-sm`: 20px (2.5 baseline)
- `--gutter-md`: 24px (3 baseline)
- `--gutter-lg`: 32px (4 baseline)
- `--gutter-xl`: 40px (5 baseline)
- `--gutter-xxl`: 48px (6 baseline)
- `--gutter-xxxl`: 64px (8 baseline)

## High-Resolution Displays

### Retina Support

The framework includes media queries for:
- Standard Retina (2x): `@media (min-resolution: 2dppx)`
- Apple Triple-Retina (3x): `@media (min-resolution: 3dppx)`

### Responsive Images

Use `image-set()` for high-resolution images:

```css
.element {
    background-image: image-set(
        url('image-1x.jpg') 1x,
        url('image-2x.jpg') 2x,
        url('image-3x.jpg') 3x
    );
}
```

Or use the `.img-responsive` class for automatic scaling:

```html
<img src="image.jpg" class="img-responsive" alt="Description">
```

## Customization

All values are exposed as CSS custom properties. Override them in your own stylesheet:

```css
:root {
    /* Breakpoints */
    --bp-xs: 300px;
    --bp-sm: 600px;
    --bp-md: 768px;
    --bp-lg: 1024px;
    --bp-xl: 1280px;
    --bp-xxl: 1600px;
    --bp-xxxl: 2400px;

    /* Container max-widths */
    --container-sm: 540px;
    --container-md: 720px;
    /* ... etc */

    /* Baseline rhythm */
    --baseline: 8px;

    /* Gutters */
    --gutter-xs: calc(var(--baseline) * 2);
    --gutter-sm: calc(var(--baseline) * 2.5);
    /* ... etc */

    /* Typography */
    --font-size-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
    /* ... etc */

    /* Colors */
    --color-primary: #2563eb;
    --color-text: #0f172a;
    /* ... etc */
}
```

### Changing the Baseline

To change the baseline rhythm (affects all spacing):

```css
:root {
    --baseline: 10px; /* Change from 8px to 10px */
}
```

All spacing utilities and gutters will automatically recalculate.

### Adjusting Breakpoints

Modify breakpoint widths:

```css
:root {
    --bp-md: 900px; /* Change medium breakpoint from 768px to 900px */
}
```

**Note:** You'll also need to update the corresponding `@media` queries in the CSS file.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful fallbacks for:
  - Browsers without CSS Grid (uses Flexbox)
  - Browsers without `clamp()` (uses fixed font sizes)
  - Older browsers (basic functionality maintained)

## File Structure

```
assets/css/
  └── framework-unified.css  # Main unified framework (includes grid, components, accessibility)

showcase.html                # Complete demo page showing all framework features, design tokens, and components
FRAMEWORK-README.md           # This file
```

## Examples

See `showcase.html` for complete demonstrations of:
- All column variations
- Fluid typography at different sizes
- Responsive breakpoints
- Spacing utilities
- Container behavior
- High-resolution image handling
- UI components (buttons, cards, modals, tabs, accordions, tooltips)

## License

This framework is provided as-is for use in your projects.

## Tips

1. **Mobile-First**: Always start with mobile styles, then enhance for larger screens
2. **Use Breakpoint Classes**: For complex layouts, use breakpoint-specific classes (`.col-sm-*`, `.col-md-*`, etc.)
3. **Consistent Spacing**: Use spacing utilities (`.mt-*`, `.mb-*`, etc.) for consistent rhythm
4. **Fluid Typography**: Let the framework handle text scaling - avoid fixed font sizes
5. **Test Across Breakpoints**: Use browser dev tools to test at all breakpoints (300px to 3600px)

