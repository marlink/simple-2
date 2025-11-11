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
│   │   ├── calendar.js             # Tech calendar management system
│   │   └── showcase.js             # Showcase page specific functionality
│   ├── images/
│   │   └── heros/                  # Hero images for light/dark themes
│   ├── icons/                      # SVG icons
│   └── logo/                       # Logo files
├── blog/                           # Blog directory (empty)
├── docs/                           # Documentation files
│   ├── SHOWCASE-DEBUG-REPORT.md
│   ├── SHOWCASE-TEST-NOTES.md
│   ├── SHOWCASE-WIREFRAME.md
│   ├── TYPOGRAPHY-SYSTEM.md
│   └── glassmorphism-nav.md
├── index.html                      # Homepage
├── about.html                      # About page
├── solutions.html                  # Solutions page
├── contact.html                    # Contact page
├── blog.html                       # Blog listing page
├── blog-details.html               # Blog post detail page
├── calendar.html                   # Tech calendar page
├── showcase.html                   # Framework showcase page
├── typography-demo.html            # Typography demonstration
├── sitemap.xml                     # XML sitemap
├── FRAMEWORK-README.md              # CSS framework documentation
├── AUDIT-REPORT.md                 # Project audit report
└── README.md                       # This file
```

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
- ✅ **Tech Calendar**: Full-featured calendar with event management
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
- Contact page filtering

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

#### `calendar.js`
Tech calendar management system:
- Monthly calendar view
- Create, edit, delete events
- LocalStorage persistence
- Export to JSON and ICS formats
- Share calendar functionality

#### `showcase.js`
Showcase page specific functionality:
- Viewport info display
- Carousel components (horizontal/vertical)
- Tab switching
- Photo counter
- Slider value updates

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
   - Efficient calendar rendering
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

### Calendar events not saving
- Check browser localStorage quota
- Verify `calendar.js` is loaded on calendar.html

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

**Last Updated:** 2025-01-XX
**Version:** 1.0.0

