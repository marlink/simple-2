# Glassmorphism Navigation Bar Component

A premium, modern glassmorphism effect for navigation bars and other UI components. Features automatic light/dark theme support, browser fallbacks, and smooth backdrop blur effects.

## Overview

The glassmorphism navigation bar uses CSS `backdrop-filter` to create a frosted glass effect that blurs content behind it while maintaining readability. It automatically adapts to light and dark themes and includes fallback styles for browsers that don't support `backdrop-filter`.

## CSS Variables

All glassmorphism properties are controlled via CSS custom properties, making it easy to customize:

### Light Theme Variables
- `--glass-bg-light`: Light theme glass background (default: `rgba(248, 250, 252, 0.8)`)
- `--glass-border-light`: Light theme border color (default: `rgba(226, 232, 240, 0.4)`)
- `--glass-shadow-light`: Light theme shadow (default: `0 8px 32px rgba(0, 0, 0, 0.1)`)

### Dark Theme Variables
- `--glass-bg-dark`: Dark theme glass background (default: `rgba(18, 26, 43, 0.8)`)
- `--glass-border-dark`: Dark theme border color (default: `rgba(234, 244, 244, 0.15)`)
- `--glass-shadow-dark`: Dark theme shadow (default: `0 8px 32px rgba(0, 0, 0, 0.3)`)

### Shared Variables
- `--glass-blur`: Blur amount for backdrop-filter (default: `16px`)
- `--glass-saturation`: Saturation percentage (default: `180%`)

## Usage

### Navigation Bar

The navigation bar automatically uses glassmorphism when using the `.site-header` class:

```html
<header class="site-header">
    <nav class="nav">
        <!-- Navigation content -->
    </nav>
</header>
```

### Reusable Glass Component

Apply the `.glass` utility class to any element:

```html
<div class="glass">
    <p>This element has a glassmorphism effect</p>
</div>
```

### Custom Styling

Override CSS variables to customize the effect:

```css
:root {
    --glass-blur: 20px;
    --glass-saturation: 200%;
    --glass-bg-light: rgba(255, 255, 255, 0.9);
}
```

## Theme Toggle

The component automatically responds to theme changes via the `data-theme` attribute:

```javascript
// Toggle to dark theme
document.body.setAttribute('data-theme', 'dark');

// Toggle to light theme
document.body.setAttribute('data-theme', 'light');
```

Or use the built-in theme toggle component:

```html
<div class="theme-toggle" role="group" aria-label="Color theme">
    <input type="radio" name="theme" id="theme-light" value="light" checked>
    <label for="theme-light">Light</label>
    
    <input type="radio" name="theme" id="theme-dark" value="dark">
    <label for="theme-dark">Dark</label>
</div>
```

## Browser Support

### Modern Browsers
- **Chrome/Edge**: Full support (backdrop-filter)
- **Safari**: Full support (with `-webkit-backdrop-filter` prefix)
- **Firefox**: Full support (Firefox 103+)

### Fallback Support
Browsers without `backdrop-filter` support automatically fall back to:
- Solid background using `--color-surface`
- Standard borders using `--color-border`
- Standard shadows

The fallback is handled automatically via `@supports` queries - no additional code required.

## Performance Considerations

1. **Backdrop Filter Performance**: `backdrop-filter` can be GPU-intensive. The component uses `will-change: backdrop-filter` to optimize rendering.

2. **Scroll Performance**: The navigation bar uses `transform` for hide/show animations (GPU-accelerated) rather than changing position properties.

3. **Reduced Motion**: Respects `prefers-reduced-motion` media query for accessibility.

## Accessibility

- **Contrast**: Glassmorphism backgrounds maintain WCAG AA contrast ratios in both themes
- **Focus Indicators**: Navigation links maintain visible focus states
- **Screen Readers**: Semantic HTML structure ensures proper navigation

## Examples

### Basic Navigation

```html
<header class="site-header">
    <nav class="nav">
        <a href="/" class="nav__logo">Logo</a>
        <ul class="nav__links">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
        </ul>
    </nav>
</header>
```

### Glass Container

```html
<div class="glass" style="padding: 2rem; border-radius: 1rem;">
    <h2>Glass Container</h2>
    <p>Content with glassmorphism effect</p>
</div>
```

## Customization

To adjust the glassmorphism intensity, modify the CSS variables:

```css
:root {
    /* More blur */
    --glass-blur: 24px;
    
    /* More saturation */
    --glass-saturation: 200%;
    
    /* More opaque background */
    --glass-bg-light: rgba(248, 250, 252, 0.95);
    --glass-bg-dark: rgba(18, 26, 43, 0.95);
}
```

## Related Components

- `.card--glass-solid`: Glassmorphism card variant
- `.card--glass-outline`: Outlined glassmorphism card
- Theme toggle component for switching between light/dark modes

