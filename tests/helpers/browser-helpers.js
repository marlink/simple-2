/**
 * Browser Test Helpers
 *
 * Helper functions for browser automation testing
 * NOTE: This file is deprecated. The main test runner (browser-runner.js) now uses Playwright.
 * This file is kept for backward compatibility but should not be used for new tests.
 * Use the helpers from browser-runner.js instead.
 *
 * @deprecated Use Playwright helpers from browser-runner.js
 */

const { chromium } = require("@playwright/test");
const config = require("../config");
const path = require("path");
const fs = require("fs");

let browser = null;
let context = null;
let page = null;

/**
 * Initialize browser and page
 */
async function initBrowser() {
    if (!browser) {
        // Use Playwright instead of Puppeteer
        browser = await chromium.launch({
            headless: config.browser.headless,
            ...config.browser.launchOptions,
        });
        context = await browser.newContext({
            viewport: config.viewports.desktop,
        });
        context.setDefaultTimeout(config.timeouts.element);
        page = await context.newPage();
    }
    return { browser, page };
}

/**
 * Close browser
 */
async function closeBrowser() {
    if (context) {
        await context.close();
        context = null;
    }
    if (browser) {
        await browser.close();
        browser = null;
    }
    page = null;
}

/**
 * Navigate to a URL
 */
async function goto(url) {
    if (!page) await initBrowser();
    const fullUrl = url.startsWith("http") ? url : `${config.baseUrl}${url}`;
    await page.goto(fullUrl, { waitUntil: "networkidle", timeout: config.timeouts.navigation });
}

/**
 * Take screenshot
 */
async function screenshot(name) {
    if (!page) throw new Error("Page not initialized");

    if (config.screenshots.enabled) {
        const dir = path.join(process.cwd(), config.screenshots.directory);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const filename = `${name}-${Date.now()}.png`;
        const filepath = path.join(dir, filename);
        await page.screenshot({ path: filepath, fullPage: true });
        return filepath;
    }
}

/**
 * Wait for element
 */
async function waitForSelector(selector, options = {}) {
    if (!page) throw new Error("Page not initialized");
    await page
        .locator(selector)
        .first()
        .waitFor({
            timeout: options.timeout || config.timeouts.element,
            ...options,
        });
}

/**
 * Get element
 */
async function $(selector) {
    if (!page) throw new Error("Page not initialized");
    const locator = page.locator(selector).first();
    const count = await page.locator(selector).count();
    return count > 0 ? locator : null;
}

/**
 * Get all elements
 */
async function $$(selector) {
    if (!page) throw new Error("Page not initialized");
    return await page.locator(selector).all();
}

/**
 * Click element
 */
async function click(selector) {
    if (!page) throw new Error("Page not initialized");
    await waitForSelector(selector);
    await page.locator(selector).first().click();
}

/**
 * Type text
 */
async function type(selector, text) {
    if (!page) throw new Error("Page not initialized");
    await waitForSelector(selector);
    await page.locator(selector).first().fill(text);
}

/**
 * Get text content
 */
async function getText(selector) {
    if (!page) throw new Error("Page not initialized");
    const element = await $(selector);
    if (!element) return null;
    return await element.textContent();
}

/**
 * Get attribute value
 */
async function getAttribute(selector, attribute) {
    if (!page) throw new Error("Page not initialized");
    const element = await $(selector);
    if (!element) return null;
    return await element.getAttribute(attribute);
}

/**
 * Check if element is visible
 */
async function isVisible(selector) {
    if (!page) throw new Error("Page not initialized");
    try {
        const element = await $(selector);
        if (!element) return false;
        return await element.isVisible();
    } catch (e) {
        return false;
    }
}

/**
 * Evaluate JavaScript in page context
 */
async function evaluate(fn) {
    if (!page) throw new Error("Page not initialized");
    return await page.evaluate(fn);
}

/**
 * Set viewport size
 */
async function setViewport(size) {
    if (!page) throw new Error("Page not initialized");
    const viewport = config.viewports[size] || size;
    await page.setViewportSize(viewport);
}

/**
 * Wait for navigation
 */
async function waitForNavigation(options = {}) {
    if (!page) throw new Error("Page not initialized");
    // Playwright handles navigation automatically, but we can wait for load state
    await page.waitForLoadState(options.waitUntil === "networkidle0" ? "networkidle" : "load", {
        timeout: options.timeout || config.timeouts.navigation,
    });
}

/**
 * Get current URL
 */
async function getUrl() {
    if (!page) throw new Error("Page not initialized");
    return page.url();
}

/**
 * Test framework functions
 */
function describe(name, fn) {
    console.log(`\n📋 ${name}`);
    fn();
}

function test(name, fn) {
    return async function runTest() {
        try {
            process.stdout.write(`  ✓ ${name}... `);
            await fn(page);
            console.log("✅");
            return { name, passed: true };
        } catch (error) {
            console.log("❌");
            console.error(`    Error: ${error.message}`);
            if (config.screenshots.onFailure) {
                await screenshot(`failure-${name.replace(/\s+/g, "-")}`);
            }
            return { name, passed: false, error: error.message };
        }
    };
}

function beforeAll(fn) {
    return async function runBeforeAll() {
        await initBrowser();
        await fn(page);
    };
}

function afterAll(fn) {
    return async function runAfterAll() {
        if (fn) await fn(page);
        await closeBrowser();
    };
}

/**
 * Expect/Assertion functions
 */
function expect(value) {
    return {
        toBe(expected) {
            if (value !== expected) {
                throw new Error(`Expected ${expected}, but got ${value}`);
            }
        },
        notToBe(expected) {
            if (value === expected) {
                throw new Error(`Expected value not to be ${expected}`);
            }
        },
        toBeNull() {
            if (value !== null) {
                throw new Error(`Expected null, but got ${value}`);
            }
        },
        notToBeNull() {
            if (value === null) {
                throw new Error("Expected value not to be null");
            }
        },
        toBeTruthy() {
            if (!value) {
                throw new Error(`Expected truthy value, but got ${value}`);
            }
        },
        toBeFalsy() {
            if (value) {
                throw new Error(`Expected falsy value, but got ${value}`);
            }
        },
        toContain(substring) {
            if (typeof value === "string" && !value.includes(substring)) {
                throw new Error(`Expected "${value}" to contain "${substring}"`);
            }
        },
        toEqual(expected) {
            if (JSON.stringify(value) !== JSON.stringify(expected)) {
                throw new Error(
                    `Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(value)}`
                );
            }
        },
    };
}

module.exports = {
    // Browser functions
    initBrowser,
    closeBrowser,
    goto,
    screenshot,
    waitForSelector,
    $,
    $$,
    click,
    type,
    getText,
    getAttribute,
    isVisible,
    evaluate,
    setViewport,
    waitForNavigation,
    getUrl,

    // Test framework
    describe,
    test,
    beforeAll,
    afterAll,
    expect,

    // Direct access
    get page() {
        return page;
    },
    get browser() {
        return browser;
    },
};
