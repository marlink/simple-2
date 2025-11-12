# Testing Setup Guide

This document describes the testing framework setup for the project, including ESLint configuration and browser automation testing.

## ESLint Setup

### Configuration

ESLint is configured in `.eslintrc.json` with the following settings:

- **Extends**: Standard JavaScript style guide
- **Environment**: Browser and Node.js (ES2021)
- **Globals**: Project-specific utility functions (safeQuery, safeQueryAll, etc.)
- **Rules**: Customized for the project's coding standards

### Running ESLint

```bash
# Check for linting errors
npm run lint:js

# Auto-fix linting errors
npm run lint:js:fix

# Run all linting (JS, CSS, HTML)
npm run lint:all
```

### ESLint Rules

Key rules configured:

- `no-console`: Warns on console.log (allows console.warn/error)
- `no-unused-vars`: Warns on unused variables (ignores vars starting with `_`)
- `prefer-const`: Warns when `let` could be `const`
- `no-var`: Error on `var` usage (use `let`/`const`)
- `object-shorthand`: Encourages ES6 object shorthand
- `prefer-arrow-callback`: Encourages arrow functions

## Browser Testing Framework

### Overview

The browser testing framework uses Playwright for browser automation and is designed to work with MCP browser tools when available.

### Mobile Menu Behavior

The mobile menu (burger menu) has specific behavior that tests should account for:

#### Display Rules
- **Default state**: Mobile menu is `display: none` by default
- **When open**: Mobile menu becomes `display: flex` when `data-menu-open="true"` is set on `.nav` element
- **Breakpoint**: Burger menu appears at `max-width: 600px` (mobile breakpoint)
- **Animation**: Menu slides in from the right using `transform: translateX()`

#### Toggle Behavior
- **Burger click**: Toggles menu open/closed state
- **Overlay click**: Closes menu (click on overlay area, not menu panel)
- **Link click**: Closes menu automatically
- **Escape key**: Closes menu
- **Resize**: Menu auto-closes when viewport exceeds 600px

#### Testing Considerations
- Wait for menu animations (300-500ms) after state changes
- Menu visibility is controlled by both CSS `display` and `data-menu-open` attribute
- Overlay clicks should target areas not covered by the menu panel (left side of screen)
- Use `force: true` option when clicking overlay to bypass pointer event interception

### Test Structure

```
tests/
├── README.md                 # Test documentation
├── runner.js                 # Main test runner
├── browser-runner.js         # Browser automation runner
├── config.js                 # Test configuration
├── helpers/                  # Helper functions
│   ├── browser-helpers.js    # Browser automation helpers
│   └── assertions.js         # Custom assertions
└── specs/                    # Test files
    ├── theme.test.js         # Theme switching tests
    ├── navigation.test.js    # Navigation tests
    ├── components.test.js    # Component tests
    └── accessibility.test.js # Accessibility tests
```

### Running Tests

```bash
# Run all tests
npm test

# Run browser tests only
npm run test:browser

# Run specific test file (future enhancement)
node tests/browser-runner.js --file theme
```

### Test Configuration

Edit `tests/config.js` to configure:

- **Base URL**: Default `http://localhost:8000` (set via `TEST_BASE_URL` env var)
- **Browser Options**: Headless mode, DevTools, etc.
- **Viewports**: Predefined sizes for responsive testing
- **Timeouts**: Navigation, element wait, test timeout
- **Screenshots**: Enable/disable, directory, on-failure capture

### Writing Tests

#### Basic Test Structure

```javascript
module.exports = {
    name: "Feature Tests",
    tests: [
        {
            name: "should do something",
            run: async (page, helpers) => {
                const { goto, $, expect } = helpers;
                await goto(page, "/index.html");
                const element = await $(page, ".my-class");
                expect(element).notToBeNull();
            },
        },
    ],
};
```

#### Available Helpers

- `goto(page, url)` - Navigate to a page
- `$(page, selector)` - Get single element
- `$$(page, selector)` - Get all elements
- `click(page, selector)` - Click element
- `type(page, selector, text)` - Type text
- `getText(page, selector)` - Get text content
- `getAttribute(page, selector, attr)` - Get attribute
- `isVisible(page, selector)` - Check visibility
- `evaluate(page, fn)` - Run JavaScript in page
- `setViewport(page, size)` - Set viewport size
- `expect(value)` - Assertions

#### Assertions

- `expect(value).toBe(expected)` - Strict equality
- `expect(value).notToBe(expected)` - Not equal
- `expect(value).toBeNull()` - Is null
- `expect(value).notToBeNull()` - Not null
- `expect(value).toBeTruthy()` - Truthy value
- `expect(value).toBeFalsy()` - Falsy value
- `expect(value).toContain(substring)` - String contains
- `expect(value).toBeGreaterThanOrEqual(expected)` - Number comparison

### Test Coverage

Current test suites cover:

1. **Theme Tests** (`theme.test.js`)
    - Theme toggle button presence
    - Theme switching functionality
    - localStorage persistence
    - Theme application on page load

2. **Navigation Tests** (`navigation.test.js`)
    - Navigation menu structure
    - Required navigation links
    - Mobile menu toggle
    - Active link highlighting

3. **Component Tests** (`components.test.js`)
    - Tabs component initialization
    - Tab switching
    - Modal open/close
    - Accordion toggle

4. **Accessibility Tests** (`accessibility.test.js`)
    - Skip link presence
    - Main content landmark
    - Image alt text
    - ARIA labels on buttons
    - Proper component roles

### MCP Browser Integration

The test framework is designed to work with MCP browser tools. When MCP browser resources are available, you can:

1. Use browser navigation tools
2. Capture accessibility snapshots
3. Take screenshots
4. Monitor network requests
5. Interact with elements

To integrate with MCP browser tools, modify `tests/helpers/browser-helpers.js` to use MCP functions when available.

### Debugging Tests

#### View Browser

Set `headless: false` in `tests/config.js`:

```javascript
browser: {
  headless: false, // Set to false to see browser, or "new" for new headless mode
  // ...
}
```

Or set environment variable:

```bash
HEADLESS=false npm test
```

**Note:** By default, tests use headless mode. Set `HEADLESS=false` to run in non-headless mode for debugging. You can also change the browser using `BROWSER=firefox` or `BROWSER=webkit` environment variables.

#### Screenshots

Screenshots are automatically taken on test failures (if enabled in config). They're saved to `tests/screenshots/`.

#### Debug Output

Run with debug logging:

```bash
DEBUG=* npm test
```

#### Slow Down Operations

Set `slowMo` in `tests/config.js` to slow down browser operations:

```javascript
browser: {
  slowMo: 250, // 250ms delay between operations
  // ...
}
```

### Continuous Integration

Tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Install dependencies
  run: npm ci

- name: Start local server
  run: python -m http.server 8000 &

- name: Run tests
  run: npm test
```

### Best Practices

1. **Wait for Elements**: Always wait for elements before interacting
2. **Use Helpers**: Use helper functions instead of direct Playwright API
3. **Clean State**: Reset state between tests when needed
4. **Descriptive Names**: Use clear test names that describe what's being tested
5. **Isolated Tests**: Tests should be independent and not rely on other tests
6. **Error Handling**: Tests should handle missing elements gracefully

### Troubleshooting

#### Tests Fail with "Navigation timeout"

- Check if local server is running on the configured port
- Increase `timeouts.navigation` in `tests/config.js`
- Check network connectivity

#### Tests Fail with "Element not found"

- Verify selector is correct
- Check if element is dynamically loaded (add wait)
- Increase `timeouts.element` in `tests/config.js`

#### Playwright Installation Issues

If Playwright fails to install browsers:

```bash
# Install Playwright browsers
npx playwright install chromium

# Or install all browsers (chromium, firefox, webkit)
npx playwright install
```

### Future Enhancements

- [ ] Visual regression testing
- [ ] Performance testing
- [ ] Cross-browser testing
- [ ] Test coverage reporting
- [ ] Parallel test execution
- [ ] MCP browser tool integration
- [ ] CI/CD pipeline integration
