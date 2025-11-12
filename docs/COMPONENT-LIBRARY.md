# Component Library Reference

**Last Updated:** Auto-synced from `assets/js/components.js`  
**Version:** 1.0.0

This document provides a complete reference for all UI components available in the Simple-2 project. All components are defined in `assets/js/components.js` and use vanilla JavaScript with no framework dependencies.

---

## Table of Contents

1. [Tabs Component](#tabs-component)
2. [Accordion Component](#accordion-component)
3. [Modal Component](#modal-component)
4. [Tooltip Component](#tooltip-component)
5. [Code Copy Button](#code-copy-button)
6. [CSS Components](#css-components)
   - [Buttons](#buttons)
   - [Cards](#cards)
   - [Forms](#forms)
   - [Alerts](#alerts)
   - [Badges](#badges)
   - [Navigation](#navigation)
   - [Hero Section](#hero-section)

---

## JavaScript Components

**Last Updated:** 2025-11-12

### Tabs Component

**File:** `assets/js/components.js`  
**Dependencies:** utils.js (safeQuery, safeQueryAll)

Multi-panel tab interface with full ARIA support and keyboard navigation.

#### HTML Structure

```html
<div class="tabs">
    <div class="tablist" role="tablist" aria-label="Tab navigation">
        <button class="tab is-active" role="tab" aria-selected="true" aria-controls="tab-panel-1" id="tab-btn-1">Tab 1</button>
        <button class="tab" role="tab" aria-selected="false" aria-controls="tab-panel-2" id="tab-btn-2">Tab 2</button>
    </div>
    <div id="tab-panel-1" class="tab__panel is-active" role="tabpanel" aria-labelledby="tab-btn-1">Content 1</div>
    <div id="tab-panel-2" class="tab__panel" role="tabpanel" aria-labelledby="tab-btn-2">Content 2</div>
</div>
```

#### Features

- ✅ ARIA attributes for accessibility
- ✅ Keyboard navigation support
- ✅ Smooth transitions (handled by CSS)
- ✅ Active state management via .is-active class

#### Required Attributes

- role="tab" on buttons
- role="tabpanel" on panels
- aria-controls on tab buttons (must match panel id)
- aria-labelledby on panels (must match tab button id)
- aria-selected on tab buttons (true/false)
- .is-active class on active tab and panel

---

### Accordion Component

**File:** `assets/js/components.js`  
**Dependencies:** utils.js (safeQuery, safeQueryAll)

Expandable/collapsible content sections (FAQ-style). Multiple items can be open simultaneously.

#### HTML Structure

```html
<div class="accordion">
    <div class="accordion__item">
        <button class="accordion__button" aria-expanded="false">Question</button>
        <div class="accordion__panel" hidden>Answer</div>
    </div>
</div>
```

#### Features

- ✅ ARIA expanded state management
- ✅ Uses native hidden attribute for accessibility
- ✅ Independent item expansion (multiple can be open)
- ✅ Smooth expand/collapse animations (CSS)

#### Required Attributes

- aria-expanded on buttons (true/false)
- hidden attribute on panels when closed

---

### Modal Component

**File:** `assets/js/components.js`  
**Dependencies:** utils.js (safeQuery, safeQueryAll)

Overlay dialog with focus trapping, keyboard navigation, and accessibility features.

#### HTML Structure

```html
<!-- Trigger Button -->
<button data-modal-target="#my-modal">Open Modal</button>

<!-- Modal -->
<div class="modal" id="my-modal" hidden>
    <div class="modal__overlay"></div>
    <div class="modal__dialog">
        <button data-modal-close aria-label="Close modal">Close</button>
        <h2>Modal Title</h2>
        <p>Modal content goes here</p>
    </div>
</div>
```

#### Features

- ✅ Focus trapping (Tab key cycles within modal)
- ✅ Escape key closes modal
- ✅ Overlay click closes modal
- ✅ Restores focus to trigger element on close
- ✅ Prevents body scroll when open
- ✅ Keyboard navigation support

#### Data Attributes

- `data-modal-target="#modal-id" - Trigger button attribute`
- `data-modal-close - Close button attribute (can be multiple)`

#### Required Structure

- .modal container with id and hidden attribute
- .modal__overlay for backdrop
- .modal__dialog for content container

---

### Tooltip Component

**File:** `assets/js/components.js`  
**Dependencies:** None (standalone)

Simple hover tooltips with automatic positioning.

#### HTML Structure

```html
<button data-tooltip="Tooltip text here">Hover me</button>
```

#### Features

- ✅ Automatically positioned above element
- ✅ Created dynamically on page load
- ✅ Simple CSS-based positioning
- ✅ Works with any element

---

### Code Copy Button

**File:** `assets/js/components.js`  
**Dependencies:** utils.js (copyToClipboard function)

Adds copy-to-clipboard functionality to code blocks with visual feedback.

#### HTML Structure

```html
<!-- Option 1: Pre/Code Block -->
<pre class="code-block">
    <code>const example = 'code here';</code>
</pre>

<!-- Option 2: Div with Code Example -->
<div class="code-example">
    const example = 'code here';
</div>
```

#### Features

- ✅ One-click code copying
- ✅ Visual feedback ("Copied!" message)
- ✅ Handles HTML entities and formatting
- ✅ Works with both <pre><code> and <div class="code-example">
- ✅ Touch-friendly (prevents text selection on tap)

#### Supported Classes

- `.code-block - Standard pre/code block`
- `.code-example - Div-based code example`

---

## CSS Components

### Buttons

**File:** `assets/css/framework-unified.css`

#### Base Class

```html
<button class="btn">Button</button>
<a href="#" class="btn">Link Button</a>
```

#### Variants

```html
<!-- Primary (default) -->
<button class="btn btn--primary">Primary</button>

<!-- Secondary -->
<button class="btn btn--secondary">Secondary</button>

<!-- Outline -->
<button class="btn btn--outline">Outline</button>

<!-- Ghost -->
<button class="btn btn--ghost">Ghost</button>

<!-- Text -->
<button class="btn btn--text">Text</button>
```

#### Sizes

```html
<button class="btn btn--primary btn--sm">Small</button>
<button class="btn btn--primary">Normal</button>
<button class="btn btn--primary btn--big">Big</button>
<button class="btn btn--primary btn--lg">Large</button>
```

#### With Icons

```html
<!-- Icon Left -->
<button class="btn btn--primary btn--icon-left">
    <svg>...</svg>
    Text
</button>

<!-- Icon Right -->
<button class="btn btn--primary btn--icon-right">
    Text
    <svg>...</svg>
</button>
```

---

### Cards

**File:** `assets/css/framework-unified.css`

#### Basic Card

```html
<article class="card">
    <div class="card__body">
        <h3>Card Title</h3>
        <p>Card content</p>
    </div>
</article>
```

#### Variants

```html
<!-- Glass Outline -->
<article class="card card--glass-outline">
    <div class="card__body">Content</div>
</article>

<!-- Solid -->
<article class="card card--solid">
    <div class="card__body">Content</div>
</article>

<!-- Image Top -->
<article class="card card--image-top">
    <img src="image.jpg" alt="Description">
    <div class="card__body">Content</div>
</article>
```

---

### Forms

**File:** `assets/css/framework-unified.css`

#### Form Structure

```html
<form class="form">
    <div class="form__row">
        <label for="name" class="form__label">Name</label>
        <input type="text" id="name" class="form__input" required>
    </div>
    <div class="form__row">
        <label for="email" class="form__label">Email</label>
        <input type="email" id="email" class="form__input" required>
    </div>
    <div class="form__row">
        <button type="submit" class="btn btn--primary">Submit</button>
    </div>
</form>
```

---

### Alerts

**File:** `assets/css/framework-unified.css`

#### Alert Structure

```html
<!-- Success -->
<div class="alert alert--success">
    <strong>Success!</strong> Your data has been saved.
    <button class="alert__close" aria-label="Close alert">&times;</button>
</div>

<!-- Error -->
<div class="alert alert--error">
    <strong>Error!</strong> Something went wrong.
    <button class="alert__close" aria-label="Close alert">&times;</button>
</div>

<!-- Info -->
<div class="alert alert--info">
    <strong>Info:</strong> New features are available.
</div>

<!-- Warning -->
<div class="alert alert--warning">
    <strong>Warning:</strong> Check your settings.
</div>
```

#### Variants

- `.alert--success` - Green border, success message
- `.alert--error` - Red border, error message
- `.alert--info` - Blue border, informational message
- `.alert--warning` - Amber border, warning message

---

### Badges

**File:** `assets/css/framework-unified.css`

```html
<!-- Default -->
<span class="badge">Default</span>

<!-- Pill Shape -->
<span class="badge badge--pill">Pill</span>

<!-- Outline -->
<span class="badge badge--outline">Outline</span>

<!-- Combined -->
<span class="badge badge--pill badge--outline">Pill Outline</span>
```

---

### Navigation

**File:** `assets/css/framework-unified.css`  
**JavaScript:** `assets/js/main.js`

#### Required Structure

See `.cursorrules` file for complete navigation structure. Key elements:

- `.nav` - Main navigation container
- `.nav__logo` - Logo link
- `.nav__burger` - Mobile menu toggle
- `.nav__menu` - Desktop menu container
- `.nav__links` - Navigation links list
- `.nav__mobile-menu` - Mobile menu container
- `.nav__overlay` - Mobile menu overlay

#### Navigation Links

```html
<ul class="nav__links">
    <li><a href="index.html" class="nav__link nav__link--underline">Home</a></li>
    <li><a href="about.html" class="nav__link nav__link--underline">About</a></li>
    <li><a href="solutions.html" class="nav__link nav__link--underline">Solutions</a></li>
    <li><a href="contact.html" class="nav__link nav__link--underline">Contact</a></li>
    <li><a href="blog.html" class="nav__link nav__link--underline">Blog</a></li>
</ul>
```

#### Active State

Add `.is-active` class to the current page link:

```html
<li><a href="index.html" class="nav__link nav__link--underline is-active">Home</a></li>
```

---

### Hero Section

**File:** `assets/css/framework-unified.css`

#### Basic Hero

```html
<section class="hero">
    <div class="hero__overlay"></div>
    <div class="hero__content">
        <h1 class="hero__title">Title</h1>
        <p class="hero__subtitle">Subtitle</p>
    </div>
</section>
```

#### Hero with Logo

```html
<section class="hero">
    <div class="hero__overlay"></div>
    <div class="hero__content">
        <img src="assets/logo/mc-logo.svg" alt="Logo" class="hero__logo">
        <div class="hero__text">
            <h1 class="hero__title">Title</h1>
            <p class="hero__subtitle">Subtitle</p>
        </div>
    </div>
</section>
```

---

## Grid System

**File:** `assets/css/framework-unified.css`

### Basic Grid

```html
<div class="container">
    <div class="grid">
        <div class="col-12 col-md-6 col-lg-4">Column 1</div>
        <div class="col-12 col-md-6 col-lg-4">Column 2</div>
        <div class="col-12 col-md-6 col-lg-4">Column 3</div>
    </div>
</div>
```

### Responsive Breakpoints

- `.col-xs-*` - 300px+
- `.col-sm-*` - 600px+
- `.col-md-*` - 768px+
- `.col-lg-*` - 1024px+
- `.col-xl-*` - 1280px+
- `.col-xxl-*` - 1600px+
- `.col-xxxl-*` - 2400px+

---

## Spacing Utilities

**File:** `assets/css/framework-unified.css`

### Margin Utilities

```html
<div class="mt-1">Margin Top 1 (8px)</div>
<div class="mt-2">Margin Top 2 (16px)</div>
<div class="mt-4">Margin Top 4 (32px)</div>
<!-- Available: mt-1 through mt-8, mb-*, ml-*, mr-* -->
```

### Padding Utilities

```html
<div class="pt-4">Padding Top 4 (32px)</div>
<div class="py-4">Padding Vertical 4 (32px)</div>
<div class="px-4">Padding Horizontal 4 (32px)</div>
<!-- Available: pt-*, pb-*, pl-*, pr-*, py-*, px-* -->
```

---

## Design Tokens

All design tokens are defined in `assets/css/framework-unified.css` as CSS custom properties.

### Spacing Scale

- `--space-1` = 8px
- `--space-2` = 16px
- `--space-3` = 24px
- `--space-4` = 32px
- `--space-5` = 40px
- `--space-6` = 48px
- `--space-7` = 56px
- `--space-8` = 64px
- `--space-10` = 80px
- `--space-12` = 96px
- `--space-16` = 128px

### Colors

- `--color-primary`
- `--color-secondary`
- `--color-accent`
- `--color-success`
- `--color-danger`
- `--color-warning`
- `--color-text`
- `--color-text-muted`
- `--color-bg`
- `--color-surface`
- `--color-border`

### Typography

- `--font-size-xs` through `--font-size-4xl`
- `--font-family` (body)
- `--font-family-heading`

---

## Best Practices

1. **Always use semantic HTML5 elements** (`<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`, `<section>`)
2. **Include ARIA attributes** for interactive components
3. **Test in both light and dark themes** (use theme toggle)
4. **Use utility classes** instead of inline styles
5. **Follow BEM naming convention** for custom CSS
6. **Load JavaScript in correct order**: `utils.js` → `main.js` → `components.js`

---

## Component Sync

This document is automatically synced from `assets/js/components.js`. To update:

```bash
npm run sync-components
```

For manual updates, edit `assets/js/components.js` and run the sync script.

---

**Last Synced:** 11/12/2025, 9:00:53 AM

