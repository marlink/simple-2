# Browser Testing Framework

This directory contains browser-based tests for the static website. The tests use Playwright for browser automation and can also work with MCP browser tools.

## Test Structure

```
tests/
├── README.md                 # This file
├── runner.js                 # Main test runner
├── browser-runner.js         # Browser automation test runner
├── config.js                 # Test configuration
├── helpers/                  # Test helper functions
│   ├── browser-helpers.js    # Browser automation helpers
│   └── assertions.js         # Custom assertion functions
└── specs/                    # Test specifications
    ├── theme.test.js         # Theme switching tests
    ├── navigation.test.js    # Navigation tests
    ├── components.test.js    # Component tests (tabs, modals, etc.)
    └── accessibility.test.js # Accessibility tests
```

## Running Tests

### Start Local Server

Before running tests, you need to start a local server:

```bash
# Option 1: Use the helper script (recommended)
npm run server:start

# Option 2: Python 3 (macOS/Linux)
python3 -m http.server 8000

# Option 3: Node.js
npx http-server -p 8000

# Option 4: PHP
php -S localhost:8000
```

### Run All Tests

```bash
npm test
```

### Run Browser Tests Only

```bash
npm run test:browser
```

### Run Specific Test File

```bash
node tests/browser-runner.js --file theme
```

## Test Configuration

Edit `tests/config.js` to configure:

- Base URL (default: `http://localhost:8000`)
- Browser options
- Timeout settings
- Viewport sizes for responsive testing

## Writing Tests

### Basic Test Structure

```javascript
const { describe, test, expect, beforeAll, afterAll } = require("./helpers/browser-helpers");

describe("Feature Name", () => {
    beforeAll(async (page) => {
        await page.goto("/index.html");
    });

    test("should do something", async (page) => {
        const element = await page.$(".my-class");
        expect(element).not.toBeNull();
    });
});
```

### Available Helpers

- `page.goto(url)` - Navigate to a page
- `page.click(selector)` - Click an element
- `page.type(selector, text)` - Type text
- `page.waitForSelector(selector)` - Wait for element
- `page.evaluate(fn)` - Run JavaScript in page context
- `expect(value).toBe(expected)` - Assertion
- `expect(value).not.toBeNull()` - Assertion

## MCP Browser Integration

The test framework is designed to work with MCP browser tools. When MCP browser resources are available, tests can use:

- Browser navigation
- Element interaction
- Screenshot capture
- Accessibility snapshots
- Network monitoring

## Test Coverage

Current test coverage includes:

- ✅ Theme switching (light/dark mode)
- ✅ Navigation (mobile menu, scroll behavior)
- ✅ Components (tabs, modals, accordions)
- ✅ Accessibility (ARIA attributes, keyboard navigation)
- ✅ Responsive design (breakpoint testing)

## Continuous Integration

Tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm test
```

## Debugging Tests

Run tests with debug output:

```bash
DEBUG=* npm test
```

Or use `HEADLESS=false` environment variable or set `headless: false` in `tests/config.js` to see the browser:

```javascript
headless: false; // or use "new" for new headless mode (default)
```

**Note:** By default, tests use headless mode. Set `HEADLESS=false` to see the browser during tests. You can also change the browser using `BROWSER=firefox` or `BROWSER=webkit` environment variables.
