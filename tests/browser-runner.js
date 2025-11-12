#!/usr/bin/env node

/**
 * Browser Test Runner
 *
 * Runs browser-based tests using Playwright
 * Can be extended to work with MCP browser tools
 */

const { chromium, firefox, webkit } = require("@playwright/test");
const config = require("./config");
const path = require("path");
const fs = require("fs");
const http = require("http");

// Import test files
const themeTests = require("./specs/theme.test");
const navigationTests = require("./specs/navigation.test");
const componentsTests = require("./specs/components.test");
const accessibilityTests = require("./specs/accessibility.test");

// Get browser launcher based on config
function getBrowserLauncher() {
    const browserName = config.browser.browserName.toLowerCase();
    switch (browserName) {
        case "firefox":
            return firefox;
        case "webkit":
            return webkit;
        case "chromium":
        default:
            return chromium;
    }
}

// Helper function to check if server is running
async function checkServer(url) {
    return new Promise((resolve) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (urlObj.protocol === "https:" ? 443 : 80),
            path: "/",
            method: "HEAD",
            timeout: 5000,
        };

        const req = http.request(options, (_res) => {
            resolve(true);
        });

        req.on("error", () => {
            resolve(false);
        });

        req.on("timeout", () => {
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

// Helper functions (Playwright API)
const helpers = {
    async goto(page, url) {
        const fullUrl = url.startsWith("http") ? url : `${config.baseUrl}${url}`;
        await page.goto(fullUrl, {
            waitUntil: "networkidle",
            timeout: config.timeouts.navigation,
        });
    },

    async $(page, selector) {
        try {
            const locator = page.locator(selector).first();
            const count = await page.locator(selector).count();
            if (count === 0) return null;
            // Return a locator wrapper that can be used with evaluate
            return {
                locator,
                async evaluate(fn) {
                    return await this.locator.evaluate(fn);
                },
                async getAttribute(attr) {
                    return await this.locator.getAttribute(attr);
                },
            };
        } catch (e) {
            return null;
        }
    },

    async $$(page, selector) {
        try {
            const locators = await page.locator(selector).all();
            return locators.map((locator) => ({
                locator,
                async evaluate(fn) {
                    return await locator.evaluate(fn);
                },
                async getAttribute(attr) {
                    return await locator.getAttribute(attr);
                },
            }));
        } catch (e) {
            return [];
        }
    },

    async click(page, selector) {
        await page.locator(selector).first().waitFor({ timeout: config.timeouts.element });
        await page.locator(selector).first().click();
    },

    async type(page, selector, text) {
        await page.locator(selector).first().waitFor({ timeout: config.timeouts.element });
        await page.locator(selector).first().fill(text);
    },

    async getText(page, selector) {
        const element = await this.$(page, selector);
        if (!element) return null;
        return await element.locator.textContent();
    },

    async getAttribute(page, selector, attribute) {
        const element = await this.$(page, selector);
        if (!element) return null;
        return await element.locator.getAttribute(attribute);
    },

    // Helper to add page methods that tests might use directly
    async waitForSelector(page, selector, options = {}) {
        await page
            .locator(selector)
            .first()
            .waitFor({
                timeout: options.timeout || config.timeouts.element,
                ...options,
            });
    },

    async waitForTimeout(page, ms) {
        // Direct call to Playwright's waitForTimeout
        await page.waitForTimeout(ms);
    },

    async reload(page, options = {}) {
        await page.reload({
            waitUntil:
                options.waitUntil === "networkidle0"
                    ? "networkidle"
                    : options.waitUntil || "networkidle",
            timeout: options.timeout || config.timeouts.navigation,
        });
    },

    async isVisible(page, selector) {
        try {
            const element = await page.locator(selector).first();
            return await element.isVisible();
        } catch (e) {
            return false;
        }
    },

    async evaluate(page, fn) {
        return await page.evaluate(fn);
    },

    async setViewport(page, size) {
        const viewport = typeof size === "string" ? config.viewports[size] : size;
        await page.setViewportSize(viewport);
    },

    expect(value) {
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
            toBeGreaterThanOrEqual(expected) {
                if (value < expected) {
                    throw new Error(`Expected ${value} to be >= ${expected}`);
                }
            },
        };
    },
};

// Test suites
const testSuites = [themeTests, navigationTests, componentsTests, accessibilityTests];

// Results tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

// Run a single test
async function runTest(test, page, suiteName) {
    try {
        process.stdout.write(`  ✓ ${test.name}... `);

        await test.run(page, helpers);
        // eslint-disable-next-line no-console
        console.log("✅");
        passedTests++;
        return { name: test.name, passed: true };
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log("❌");
        const errorMessage = error.message || String(error);
        // eslint-disable-next-line no-console
        console.error(`    Error: ${errorMessage}`);
        failedTests++;
        failures.push({ suite: suiteName, test: test.name, error: errorMessage });

        // Take screenshot on failure
        if (config.screenshots.onFailure) {
            try {
                const dir = path.join(process.cwd(), config.screenshots.directory);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                const filename = `${suiteName}-${test.name.replace(/\s+/g, "-")}-${Date.now()}.png`;
                await page.screenshot({
                    path: path.join(dir, filename),
                    fullPage: true,
                });
            } catch (screenshotError) {
                // Ignore screenshot errors
            }
        }

        return { name: test.name, passed: false, error: errorMessage };
    }
}

// Run a test suite
async function runSuite(suite, page) {
    // eslint-disable-next-line no-console
    console.log(`\n📋 ${suite.name}`);
    // eslint-disable-next-line no-console
    console.log("─".repeat(60));

    const results = [];
    for (const test of suite.tests) {
        totalTests++;
        const result = await runTest(test, page, suite.name);
        results.push(result);
    }

    return results;
}

// Main test runner
async function runTests() {
    // eslint-disable-next-line no-console
    console.log("🚀 Starting Browser Tests");
    // eslint-disable-next-line no-console
    console.log("═".repeat(60));
    // eslint-disable-next-line no-console
    console.log(`Base URL: ${config.baseUrl}`);
    // eslint-disable-next-line no-console
    console.log(`Browser: ${config.browser.browserName}`);
    // eslint-disable-next-line no-console
    console.log(`Headless: ${config.browser.headless}`);
    // eslint-disable-next-line no-console
    console.log("═".repeat(60));

    // Check if server is running
    // eslint-disable-next-line no-console
    console.log("\n🔍 Checking if server is running...");
    const serverRunning = await checkServer(config.baseUrl);
    if (!serverRunning) {
        // eslint-disable-next-line no-console
        console.error("\n❌ Server is not running!");
        // eslint-disable-next-line no-console
        console.error(`   Please start the server on ${config.baseUrl}`);
        // eslint-disable-next-line no-console
        console.error("   Run: npm run server:start");
        // eslint-disable-next-line no-console
        console.error("   Or: python3 -m http.server 8000");
        process.exit(1);
    }
    // eslint-disable-next-line no-console
    console.log("✅ Server is running\n");

    const browserLauncher = getBrowserLauncher();
    let browser;
    let context;
    let page;

    try {
        // Launch browser with better error handling
        try {
            browser = await browserLauncher.launch({
                headless: config.browser.headless,
                slowMo: config.browser.slowMo,
                ...config.browser.launchOptions,
            });
        } catch (launchError) {
            // eslint-disable-next-line no-console
            console.error("\n❌ Failed to launch browser:", launchError.message);
            // eslint-disable-next-line no-console
            console.error("   Make sure browsers are installed: npx playwright install");
            process.exit(1);
        }

        try {
            // Create browser context
            context = await browser.newContext({
                viewport: config.viewports.desktop,
            });

            // Set default timeout
            context.setDefaultTimeout(config.timeouts.element);

            // Create page
            page = await context.newPage();

            // Store original Playwright methods before overriding
            const originalWaitForTimeout = page.waitForTimeout.bind(page);
            const originalReload = page.reload.bind(page);

            // Add helper methods to page for compatibility with test files
            page.waitForSelector = (selector, options = {}) =>
                helpers.waitForSelector(page, selector, options);
            page.waitForTimeout = (ms) => originalWaitForTimeout(ms);
            page.reload = (options = {}) => {
                const reloadOptions = {
                    waitUntil:
                        options.waitUntil === "networkidle0"
                            ? "networkidle"
                            : options.waitUntil || "networkidle",
                    timeout: options.timeout || config.timeouts.navigation,
                };
                return originalReload(reloadOptions);
            };

            // Override evaluate to handle element handles from $ and $$
            const originalEvaluate = page.evaluate.bind(page);
            page.evaluate = async (fn, element) => {
                if (element && element.locator) {
                    // If element is a locator wrapper, use it directly
                    return await element.locator.evaluate(fn);
                } else if (element) {
                    // If element is a locator, use it
                    return await element.evaluate(fn);
                } else {
                    // No element, use page evaluate
                    return await originalEvaluate(fn);
                }
            };

            // Add $ and $$ helpers for compatibility
            page.$ = async (selector) => {
                const element = await helpers.$(page, selector);
                return element || null;
            };
            page.$$ = async (selector) => {
                const elements = await helpers.$$(page, selector);
                return elements;
            };
        } catch (pageError) {
            // eslint-disable-next-line no-console
            console.error("\n❌ Failed to create page:", pageError.message);
            throw pageError;
        }

        // Run all test suites
        for (const suite of testSuites) {
            await runSuite(suite, page);
        }

        // Print summary
        // eslint-disable-next-line no-console
        console.log("\n" + "═".repeat(60));
        // eslint-disable-next-line no-console
        console.log("📊 Test Summary");
        // eslint-disable-next-line no-console
        console.log("═".repeat(60));
        // eslint-disable-next-line no-console
        console.log(`Total: ${totalTests}`);
        // eslint-disable-next-line no-console
        console.log(`✅ Passed: ${passedTests}`);
        // eslint-disable-next-line no-console
        console.log(`❌ Failed: ${failedTests}`);

        if (failures.length > 0) {
            // eslint-disable-next-line no-console
            console.log("\n❌ Failures:");
            failures.forEach((f) => {
                // eslint-disable-next-line no-console
                console.log(`  - ${f.suite}: ${f.test}`);
                // eslint-disable-next-line no-console
                console.log(`    ${f.error}`);
            });
        }

        // eslint-disable-next-line no-console
        console.log("═".repeat(60));

        // Exit with appropriate code
        const exitCode = failedTests > 0 ? 1 : 0;

        // Close browser before exiting
        if (context) {
            await context.close();
        }
        if (browser) {
            await browser.close();
        }

        process.exit(exitCode);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("\n❌ Fatal error:", error);

        // Try to close browser even on error
        if (context) {
            try {
                await context.close();
            } catch (closeError) {
                // Ignore close errors
            }
        }
        if (browser) {
            try {
                await browser.close();
            } catch (closeError) {
                // Ignore close errors
            }
        }

        process.exit(1);
    }
}

// Check if specific file requested
const args = process.argv.slice(2);
if (args.includes("--file")) {
    const fileIndex = args.indexOf("--file");
    // eslint-disable-next-line no-unused-vars
    const _fileName = args[fileIndex + 1];
    // Filter test suites by file name
    // This is a simple implementation - can be enhanced
}

// Run tests with proper error handling
runTests().catch((error) => {
    // eslint-disable-next-line no-console
    console.error("\n❌ Unhandled error:", error.message || error);
    if (error.stack) {
        // eslint-disable-next-line no-console
        console.error(error.stack);
    }
    process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    // eslint-disable-next-line no-console
    console.error("\n❌ Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    // eslint-disable-next-line no-console
    console.error("\n❌ Uncaught Exception:", error.message);
    if (error.stack) {
        // eslint-disable-next-line no-console
        console.error(error.stack);
    }
    process.exit(1);
});
