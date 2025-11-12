# Simple-2 Project

A modern, responsive website built with a custom CSS framework and vanilla JavaScript.

## 📁 Project Structure

```
simple-2/
├── assets/
│   ├── css/
│   │   ├── framework-unified.css    # Main CSS framework (grid, components, tokens)
│   │   └── typography-system.css    # Typography utilities and display styles
│   ├── js/
│   │   ├── main.js                 # Core site functionality (theme, nav, forms)
│   │   ├── components.js           # Reusable UI components (tabs, modals, etc.)
│   │   └── showcase.js             # Showcase page specific functionality
│   ├── images/
│   │   └── heros/                  # Hero images for light/dark themes
│   ├── icons/                      # SVG icons
│   └── logo/                       # Logo files
├── blog/                           # Blog directory
├── docs/                           # All documentation files
│   ├── COMPONENT-LIBRARY.md        # Component documentation
│   ├── TYPOGRAPHY-SYSTEM.md       # Typography system docs
│   ├── TESTING-SETUP.md           # Testing documentation
│   └── [additional docs...]        # See docs/ for full list
├── demo/                           # Framework demo pages
├── index.html                      # Homepage
├── about.html                      # About page
├── solutions.html                  # Solutions page
├── contact.html                    # Contact page
├── blog.html                       # Blog listing page
├── blog-details.html               # Blog post detail page
├── typography-demo.html            # Typography demonstration
├── 404.html                        # Error page
├── sitemap.xml                     # XML sitemap
├── FRAMEWORK-README.md             # CSS framework documentation
├── PROJECT-STATUS.md               # Current project status
└── README.md                       # This file
```

## 📋 Comprehensive Review Schedule

**Automatic reviews are required every 5 versions** to ensure code quality and maintainability.

- Run `npm run review:check` to check if a review is needed
- Run `npm run review:complete` after completing a review
- Reviews are automatically checked when incrementing versions
- See `docs/REVIEW-SCHEDULE.md` for detailed checklist

## 🚀 Quick Start

1. **Open any HTML file** in a web browser
   - No build process required
   - No dependencies to install
   - Works with any local server or file:// protocol

2. **Recommended: Use a local server**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (with http-server)
   npx http-server
   
   # PHP
   php -S localhost:8000
   ```

3. **Access the site**
   - Open `http://localhost:8000` in your browser
   - Navigate to any page (index.html, showcase.html, etc.)

## 🎨 Features

### Core Functionality
- ✅ **Theme System**: Light/dark mode with smooth transitions
- ✅ **Responsive Navigation**: Auto-hide/show on scroll, mobile menu
- ✅ **Form Validation**: Real-time email validation
- ✅ **Active Navigation**: Automatic link highlighting based on current page

### UI Components
- ✅ **Tabs**: Multi-panel tab interface
- ✅ **Accordion**: Expandable/collapsible sections
- ✅ **Modal**: Overlay dialogs with focus trapping
- ✅ **Tooltip**: Hover tooltips
- ✅ **Code Copy**: One-click code copying

### Special Pages
- ✅ **Showcase**: Interactive framework demonstration
- ✅ **Typography Demo**: Typography system showcase

## 📚 Documentation

### JavaScript Files

#### `main.js`
Core site functionality including:
- Theme management (light/dark mode)
- Scroll-responsive navigation
- Mobile menu toggle
- Footer newsletter validation
- Active navigation link highlighting

**Performance optimizations:**
- Uses `requestAnimationFrame` for scroll handling
- Throttled/debounced event handlers
- Passive event listeners

#### `components.js`
Reusable UI components library:
- Tabs, Accordion, Modal, Tooltip, Code Copy Button
- Framework-free (plain DOM API)
- Uses data attributes for configuration
- Fully accessible (ARIA support)

#### `utils.js`
Shared utility functions:
- `throttle()` - Limit function execution frequency
- `debounce()` - Delay function execution
- `safeQuery()` / `safeQueryAll()` - Safe DOM queries with error handling
- `validateEmail()` - Email validation
- `copyToClipboard()` - Clipboard operations
- `formatDate()` - Date formatting

### CSS Framework

See `FRAMEWORK-README.md` for complete CSS framework documentation.

**Key features:**
- 12-column grid system
- 7 responsive breakpoints (300px - 3600px)
- Fluid typography with `clamp()`
- Baseline rhythm system (8px)
- Design tokens (CSS custom properties)
- Component library (buttons, cards, forms, etc.)

## 🛠️ Development

### File Organization

**JavaScript:**
- Each file has a specific purpose (no overlap)
- Well-documented with JSDoc comments
- Performance-optimized (throttling, debouncing, requestAnimationFrame)

**CSS:**
- Single unified framework file
- Typography system separate for modularity
- CSS custom properties for easy customization

**HTML:**
- Semantic HTML5
- Accessible (ARIA attributes, keyboard navigation)
- Mobile-first responsive design

### Performance Best Practices

1. **Event Handling**
   - Throttled scroll handlers
   - Debounced resize handlers
   - Passive event listeners where appropriate

2. **DOM Queries**
   - Cached element references
   - Safe query functions with error handling

3. **Rendering**
   - Only render visible content
   - Lazy loading where applicable

## 🎯 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

**Graceful fallbacks for:**
- Browsers without CSS Grid (uses Flexbox)
- Browsers without `clamp()` (uses fixed font sizes)
- Older browsers (basic functionality maintained)

## 📝 Code Style

### JavaScript
- ES6+ syntax
- JSDoc comments for functions
- Descriptive variable names
- Consistent formatting

### CSS
- Mobile-first approach
- BEM-like naming convention
- CSS custom properties for theming
- Organized sections with comments

### HTML
- Semantic elements
- Accessibility attributes
- Consistent indentation

## 🔧 Customization

### Changing Colors
Override CSS custom properties in your stylesheet:
```css
:root {
    --color-primary: #your-color;
    --color-bg: #your-bg-color;
}
```

### Changing Breakpoints
Modify breakpoint values in `framework-unified.css`:
```css
:root {
    --bp-md: 900px; /* Change from 768px */
}
```

### Adding Components
Follow the pattern in `components.js`:
- Use data attributes for configuration
- Include ARIA attributes for accessibility
- Add JSDoc comments

## 📊 Performance Metrics

**Target metrics:**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Smooth 60fps scrolling
- No layout shifts

## 🐛 Troubleshooting

### Theme not persisting
- Check browser localStorage support
- Verify `main.js` is loaded

### Navigation not working
- Verify `main.js` is included in HTML
- Check console for JavaScript errors

## 📄 License

This project is provided as-is for use in your projects.

## 👥 Contributing

When working on this project:
1. Follow existing code style
2. Add JSDoc comments for new functions
3. Test across all breakpoints
4. Verify accessibility
5. Update documentation as needed

## 📞 Support

For questions or issues, refer to:
- `FRAMEWORK-README.md` for CSS framework questions
- `docs/` directory for component-specific documentation
- Code comments in JavaScript files for implementation details

---

## 📊 Project Status

For detailed project status, see `PROJECT-STATUS.md`.

**Quick Status:**
- ✅ Production ready
- ✅ All critical issues resolved
- ✅ Code optimized and cleaned
- ✅ Documentation consolidated
- ✅ Health score: 9.0/10

---

**Last Updated:** January 2025  
**Version:** 0.0.4

