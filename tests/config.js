/**
 * Test Configuration
 *
 * Configuration for browser testing framework
 */

module.exports = {
    // Base URL for the website (change if using different port)
    baseUrl: process.env.TEST_BASE_URL || "http://localhost:8000",

    // Browser options (Playwright)
    browser: {
        // Browser to use: 'chromium', 'firefox', or 'webkit'
        browserName: process.env.BROWSER || "chromium",
        // Set HEADLESS=false to see browser (non-headless mode)
        headless: process.env.HEADLESS !== "false",
        // Slow down operations by X ms (useful for debugging)
        slowMo: parseInt(process.env.SLOW_MO || "0", 10),
        // Playwright launch options
        launchOptions: {
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
            timeout: 60000, // 60 second timeout for browser launch
        },
    },

    // Viewport sizes for responsive testing
    viewports: {
        mobile: { width: 375, height: 667 },
        tablet: { width: 768, height: 1024 },
        desktop: { width: 1280, height: 720 },
        large: { width: 1920, height: 1080 },
    },

    // Timeouts (in milliseconds)
    timeouts: {
        navigation: 30000,
        element: 5000,
        test: 10000,
    },

    // Test files to run
    testFiles: [
        "theme.test.js",
        "navigation.test.js",
        "components.test.js",
        "accessibility.test.js",
    ],

    // Screenshot settings
    screenshots: {
        enabled: process.env.SCREENSHOTS !== "false",
        directory: "tests/screenshots",
        onFailure: true,
    },
};
