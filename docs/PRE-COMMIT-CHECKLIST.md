# Pre-Commit Checklist

Use this checklist before committing changes to ensure code quality and consistency.

## Quick Check

Run the automated checker:
```bash
npm run check:consistency
```

## Manual Checklist

### HTML Structure ✅

- [ ] **Page Structure**
  - [ ] `<!DOCTYPE html>` present
  - [ ] `<html lang="en">` present
  - [ ] `<meta charset="UTF-8">` present
  - [ ] `<meta name="viewport">` present
  - [ ] Skip link present: `<a href="#main-content" class="skip-link">`
  - [ ] `<main id="main-content">` present

- [ ] **Navigation**
  - [ ] Navigation structure matches standard (see `.cursorrules`)
  - [ ] All 5 links present: Home, About, Solutions, Contact, Blog
  - [ ] Theme toggle present with proper ARIA labels
  - [ ] Mobile menu structure matches desktop
  - [ ] Active page link has `.is-active` class

- [ ] **Semantic HTML**
  - [ ] Using `<header>`, `<nav>`, `<main>`, `<footer>`
  - [ ] Using `<article>`, `<section>` where appropriate
  - [ ] Proper heading hierarchy (h1 → h2 → h3)

### CSS & Styling ✅

- [ ] **No Inline Styles**
  - [ ] No `style=""` attributes (use utility classes)
  - [ ] Check: `grep -r 'style="' *.html`

- [ ] **Design Tokens**
  - [ ] Using CSS custom properties (`--space-*`, `--color-*`)
  - [ ] No hardcoded pixel values (except in CSS custom properties)
  - [ ] No hardcoded colors (use `--color-*` variables)
  - [ ] Check: `grep -r '#[0-9a-fA-F]\{6\}' assets/css/`

- [ ] **Class Naming**
  - [ ] Following BEM convention (`.block__element--modifier`)
  - [ ] Using framework utility classes (`.mt-*`, `.mb-*`, `.py-*`)
  - [ ] Grid system uses `.container` > `.grid` > `.col-*`

### JavaScript ✅

- [ ] **Component Usage**
  - [ ] Using `safeQuery`/`safeQueryAll` from `utils.js` (not `querySelector` directly)
  - [ ] Components loaded in correct order: `utils.js` → `main.js` → `components.js`
  - [ ] No duplicate function definitions

- [ ] **Component Structure**
  - [ ] Tabs have required ARIA attributes
  - [ ] Accordion uses `hidden` attribute
  - [ ] Modal has `data-modal-target` and `data-modal-close`
  - [ ] Tooltips use `data-tooltip` attribute

### Accessibility ✅

- [ ] **ARIA Labels**
  - [ ] All interactive elements have `aria-label` or `aria-labelledby`
  - [ ] Navigation has `aria-label="Design System"` on logo
  - [ ] Theme toggle has `aria-label="Toggle color theme"`
  - [ ] Buttons have `type` attribute
  - [ ] Form inputs have associated labels

- [ ] **Images**
  - [ ] All images have `alt` attributes
  - [ ] Decorative images have `alt=""`
  - [ ] No empty `alt` attributes on informative images

- [ ] **Keyboard Navigation**
  - [ ] All interactive elements are keyboard accessible
  - [ ] Focus indicators visible (check with Tab key)
  - [ ] Skip link works

### Theme Support ✅

- [ ] **Light/Dark Themes**
  - [ ] Colors work in both themes (test with theme toggle)
  - [ ] Using theme-aware CSS variables
  - [ ] No hardcoded colors that break in dark theme
  - [ ] Contrast ratios meet WCAG AA minimum

### Responsive Design ✅

- [ ] **Breakpoints**
  - [ ] Using responsive grid classes (`.col-md-*`, `.col-lg-*`, etc.)
  - [ ] Mobile-first approach
  - [ ] Content readable at all breakpoints (300px - 2400px+)

### Code Quality ✅

- [ ] **Validation**
  - [ ] HTML validates: `npm run validate:html`
  - [ ] CSS validates: `npm run validate:css`
  - [ ] No console errors in browser

- [ ] **Consistency**
  - [ ] Navigation matches across all pages
  - [ ] Footer structure consistent
  - [ ] No duplicate IDs across pages
  - [ ] Class names follow project conventions

### Documentation ✅

- [ ] **Component Updates**
  - [ ] If `components.js` was modified, run: `npm run sync-components`
  - [ ] Component library updated
  - [ ] `.cursorrules` updated (if needed)

### Testing ✅

- [ ] **Browser Testing**
  - [ ] Tested in Chrome/Edge
  - [ ] Tested in Firefox
  - [ ] Tested in Safari (if available)
  - [ ] Mobile view tested (responsive)

- [ ] **Functionality**
  - [ ] Theme toggle works
  - [ ] Navigation menu works (desktop & mobile)
  - [ ] All interactive components work (tabs, accordion, modal, etc.)
  - [ ] Forms submit correctly
  - [ ] Links work

---

## Automated Checks

Run these commands before committing:

```bash
# Validate HTML and CSS
npm run validate:all

# Check consistency
npm run check:consistency

# Sync components (if components.js was modified)
npm run sync-components
```

---

## Common Issues to Avoid

### ❌ Don't Do This:

- Inline styles: `style="padding: 20px"` → Use `.py-4` instead
- Hardcoded colors: `color: #000000` → Use `var(--color-text)` instead
- Missing ARIA: `<button>` → Add `aria-label` or `type="button"`
- Duplicate IDs: Same ID on multiple pages
- Direct DOM: `document.querySelector` → Use `safeQuery` from utils.js
- Missing alt: `<img src="...">` → Add `alt="description"`

### ✅ Do This Instead:

- Utility classes: `.mt-4`, `.py-6`, `.col-md-6`
- CSS variables: `var(--color-primary)`, `var(--space-4)`
- ARIA attributes: `aria-label`, `aria-expanded`, `role`
- Unique IDs: Use page-specific IDs or classes
- Safe queries: `safeQuery('.selector')` from utils.js
- Descriptive alt: `alt="User profile photo"`

---

## Pre-Commit Hook (Optional)

To automatically run checks before each commit, create `.git/hooks/pre-commit`:

```bash
#!/bin/sh
npm run validate:all && npm run check:consistency
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

---

## Quick Reference

| Check | Command |
|-------|---------|
| Find inline styles | `grep -r 'style="' *.html` |
| Find hardcoded colors | `grep -r '#[0-9a-fA-F]\{6\}' assets/css/` |
| Validate HTML | `npm run validate:html` |
| Validate CSS | `npm run validate:css` |
| Check consistency | `npm run check:consistency` |
| Sync components | `npm run sync-components` |

---

**Remember:** It's better to catch issues before committing than to fix them later!

