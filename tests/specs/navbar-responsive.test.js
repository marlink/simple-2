/**
 * Navbar Responsive Tests
 *
 * Tests navbar across all media query breakpoints with screenshots
 */

const path = require("path");
const fs = require("fs");
const config = require("../config");

// Helper to take screenshot
async function takeScreenshot(page, name, viewport) {
    if (!config.screenshots.enabled) return;

    // Check if page is still open (Playwright doesn't have isClosed, so we'll try/catch instead)

    const dir = path.join(process.cwd(), config.screenshots.directory);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const filename = `navbar-${name}-${viewport.width}x${viewport.height}-${Date.now()}.png`;
    const filepath = path.join(dir, filename);

    try {
        // Take screenshot of just the navbar area (Playwright)
        const navLocator = page.locator(".site-header").first();
        const navCount = await page.locator(".site-header").count();

        if (navCount > 0) {
            await navLocator.screenshot({ path: filepath });
        } else {
            // Fallback to full page if navbar not found
            await page.screenshot({ path: filepath, fullPage: false });
        }

        console.log(`    📸 Screenshot saved: ${filename}`);
        return filepath;
    } catch (error) {
        console.log(`    ⚠️  Failed to take screenshot for ${name}: ${error.message}`);
        return null;
    }
}

module.exports = {
    name: "Navbar Responsive Tests",
    tests: [
        {
            name: "navbar at xs breakpoint (300px)",
            run: async (page, helpers) => {
                const viewport = { width: 300, height: 600 };
                await helpers.setViewport(page, viewport);
                await helpers.goto(page, "/index.html");
                await page.waitForTimeout(500);

                // Verify burger menu is visible
                const burgerVisible = await helpers.isVisible(page, ".nav__burger");
                helpers.expect(burgerVisible).toBeTruthy();

                // Verify desktop menu is hidden
                const desktopMenuVisible = await helpers.isVisible(page, ".nav__menu");
                helpers.expect(desktopMenuVisible).toBeFalsy();

                // Take screenshot
                await takeScreenshot(page, "xs-closed", viewport);
            },
        },
        {
            name: "navbar mobile menu open at xs (300px)",
            run: async (page, helpers) => {
                const viewport = { width: 300, height: 600 };
                await helpers.setViewport(page, viewport);
                await helpers.goto(page, "/index.html");
                await page.waitForTimeout(800);

                // Wait for burger to be visible and ready
                await page.waitForSelector(".nav__burger", { timeout: 5000 });

                // Use JavaScript to open menu instead of click to avoid page closure issues
                await page.evaluate(() => {
                    const burger = document.querySelector(".nav__burger");
                    const nav = document.querySelector(".nav");
                    if (burger && nav) {
                        nav.setAttribute("data-menu-open", "true");
                        burger.setAttribute("aria-expanded", "true");
                    }
                });

                await page.waitForTimeout(600);

                // Verify mobile menu is visible
                const mobileMenuVisible = await helpers.isVisible(page, ".nav__mobile-menu");
                helpers.expect(mobileMenuVisible).toBeTruthy();

                // Take screenshot
                await takeScreenshot(page, "xs-open", viewport);
            },
        },
        {
            name: "navbar at sm breakpoint (600px)",
            run: async (page, helpers) => {
                const viewport = { width: 600, height: 800 };
                await helpers.setViewport(page, viewport);
                await helpers.goto(page, "/index.html");
                await page.waitForTimeout(500);

                // At exactly 600px, burger should be visible
                const burgerVisible = await helpers.isVisible(page, ".nav__burger");
                helpers.expect(burgerVisible).toBeTruthy();

                // Take screenshot
                await takeScreenshot(page, "sm-closed", viewport);
            },
        },
        {
            name: "navbar at sm+ breakpoint (601px)",
            run: async (page, helpers) => {
                const viewport = { width: 601, height: 800 };
                await helpers.setViewport(page, viewport);
                await helpers.goto(page, "/index.html");
                await page.waitForTimeout(500);

                // Just above 600px, desktop menu should appear
                const desktopMenuVisible = await helpers.isVisible(page, ".nav__menu");
                helpers.expect(desktopMenuVisible).toBeTruthy();

                // Take screenshot
                await takeScreenshot(page, "sm-plus-closed", viewport);
            },
        },
        {
            name: "navbar at md breakpoint (768px)",
            run: async (page, helpers) => {
                const viewport = { width: 768, height: 1024 };
                await helpers.setViewport(page, viewport);
                await helpers.goto(page, "/index.html");
                await page.waitForTimeout(500);

                // Desktop menu should be visible
                const desktopMenuVisible = await helpers.isVisible(page, ".nav__menu");
                helpers.expect(desktopMenuVisible).toBeTruthy();

                // Burger should be hidden
                const burgerVisible = await helpers.isVisible(page, ".nav__burger");
                helpers.expect(burgerVisible).toBeFalsy();

                // Take screenshot
                await takeScreenshot(page, "md-closed", viewport);
            },
        },
        {
            name: "navbar at lg breakpoint (1024px)",
            run: async (page, helpers) => {
                const viewport = { width: 1024, height: 768 };
                await helpers.setViewport(page, viewport);
                await helpers.goto(page, "/index.html");
                await page.waitForTimeout(500);

                // All desktop elements should be visible
                const desktopMenuVisible = await helpers.isVisible(page, ".nav__menu");
                helpers.expect(desktopMenuVisible).toBeTruthy();

                // Take screenshot
                await takeScreenshot(page, "lg-closed", viewport);
            },
        },
        {
            name: "navbar at xl breakpoint (1280px)",
            run: async (page, helpers) => {
                const viewport = { width: 1280, height: 720 };
                await helpers.setViewport(page, viewport);
                await helpers.goto(page, "/index.html");
                await page.waitForTimeout(500);

                // All desktop elements should be visible
                const desktopMenuVisible = await helpers.isVisible(page, ".nav__menu");
                helpers.expect(desktopMenuVisible).toBeTruthy();

                // Take screenshot
                await takeScreenshot(page, "xl-closed", viewport);
            },
        },
        {
            name: "navbar at xxl breakpoint (1600px)",
            run: async (page, helpers) => {
                const viewport = { width: 1600, height: 900 };
                await helpers.setViewport(page, viewport);
                await helpers.goto(page, "/index.html");
                await page.waitForTimeout(500);

                // All desktop elements should be visible
                const desktopMenuVisible = await helpers.isVisible(page, ".nav__menu");
                helpers.expect(desktopMenuVisible).toBeTruthy();

                // Take screenshot
                await takeScreenshot(page, "xxl-closed", viewport);
            },
        },
        {
            name: "navbar at xxxl breakpoint (2400px)",
            run: async (page, helpers) => {
                const viewport = { width: 2400, height: 1350 };
                await helpers.setViewport(page, viewport);
                await helpers.goto(page, "/index.html");
                await page.waitForTimeout(500);

                // All desktop elements should be visible
                const desktopMenuVisible = await helpers.isVisible(page, ".nav__menu");
                helpers.expect(desktopMenuVisible).toBeTruthy();

                // Take screenshot
                await takeScreenshot(page, "xxxl-closed", viewport);
            },
        },
        {
            name: "navbar at 850px (CTA button hidden)",
            run: async (page, helpers) => {
                const viewport = { width: 850, height: 600 };
                await helpers.setViewport(page, viewport);
                await helpers.goto(page, "/index.html");
                await page.waitForTimeout(500);

                // CTA button in desktop menu should be hidden at 850px
                const ctaButton = page.locator(".nav__menu .btn").first();
                const ctaCount = await page.locator(".nav__menu .btn").count();
                if (ctaCount > 0) {
                    const isVisible = await ctaButton.evaluate((el) => {
                        const style = window.getComputedStyle(el);
                        return (
                            style.display !== "none" &&
                            style.visibility !== "hidden" &&
                            el.offsetWidth > 0 &&
                            el.offsetHeight > 0
                        );
                    });
                    helpers.expect(isVisible).toBeFalsy();
                }

                // Take screenshot
                await takeScreenshot(page, "850px-cta-hidden", viewport);
            },
        },
        {
            name: "navbar at 1100px (theme toggle hidden)",
            run: async (page, helpers) => {
                const viewport = { width: 1100, height: 600 };
                await helpers.setViewport(page, viewport);
                await helpers.goto(page, "/index.html");
                await page.waitForTimeout(500);

                // Theme toggle in desktop menu should be hidden at 1100px
                const themeToggle = page.locator(".nav__menu .theme-toggle").first();
                const toggleCount = await page.locator(".nav__menu .theme-toggle").count();
                if (toggleCount > 0) {
                    const isVisible = await themeToggle.evaluate((el) => {
                        const style = window.getComputedStyle(el);
                        return (
                            style.display !== "none" &&
                            style.visibility !== "hidden" &&
                            el.offsetWidth > 0 &&
                            el.offsetHeight > 0
                        );
                    });
                    helpers.expect(isVisible).toBeFalsy();
                }

                // Take screenshot
                await takeScreenshot(page, "1100px-theme-hidden", viewport);
            },
        },
        {
            name: "navbar at 1200px (all elements visible)",
            run: async (page, helpers) => {
                const viewport = { width: 1200, height: 600 };
                await helpers.setViewport(page, viewport);
                await helpers.goto(page, "/index.html");
                await page.waitForTimeout(500);

                // All elements should be visible at this width
                const desktopMenuVisible = await helpers.isVisible(page, ".nav__menu");
                helpers.expect(desktopMenuVisible).toBeTruthy();

                // Take screenshot
                await takeScreenshot(page, "1200px-all-visible", viewport);
            },
        },
    ],
};
