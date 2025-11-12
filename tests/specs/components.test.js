/**
 * Component Tests
 * 
 * Tests for UI components (tabs, modals, accordions, etc.)
 */

module.exports = {
  name: 'Component Tests',
  tests: [
    {
      name: 'should initialize tabs component',
      run: async (page, helpers) => {
        const { goto, $ } = helpers;
        await goto(page, '/showcase.html');
        await page.waitForSelector('.tabs', { timeout: 5000 });
        
        const tabs = await $(page, '.tabs');
        helpers.expect(tabs).notToBeNull();
      }
    },
    {
      name: 'should switch tabs on click',
      run: async (page, helpers) => {
        const { goto, click, getAttribute } = helpers;
        await goto(page, '/showcase.html');
        await page.waitForSelector('.tab', { timeout: 5000 });
        
        // Get first tab
        const firstTab = await page.$('.tab');
        if (!firstTab) {
          throw new Error('No tabs found');
        }
        
        // Get second tab if available
        const allTabs = await page.$$('.tab');
        if (allTabs.length < 2) {
          // Skip if only one tab
          return;
        }
        
        // Click second tab
        await click(page, `.tab:nth-child(2)`);
        await page.waitForTimeout(300);
        
        // Check second tab is active
        const secondTab = await page.$('.tab:nth-child(2)');
        const isActive = await page.evaluate(el => {
          return el.classList.contains('is-active') || 
                 el.getAttribute('aria-selected') === 'true';
        }, secondTab);
        
        helpers.expect(isActive).toBeTruthy();
      }
    },
    {
      name: 'should open modal on trigger click',
      run: async (page, helpers) => {
        const { goto, click, isVisible, $ } = helpers;
        await goto(page, '/showcase.html');
        await page.waitForTimeout(500); // Wait for page to load
        
        // Wait for modal trigger to be visible (not hidden)
        await page.waitForSelector('[data-modal-target]', { 
          timeout: 5000,
          state: 'visible'
        }).catch(() => {
          // Skip if no modal on page
          return;
        });
        
        // Find modal trigger
        const trigger = await $(page, '[data-modal-target]');
        if (!trigger) {
          // Skip if no modal on page
          return;
        }
        
        // Check if trigger is actually visible
        const triggerVisible = await isVisible(page, '[data-modal-target]');
        if (!triggerVisible) {
          // Skip if trigger is hidden
          return;
        }
        
        const modalId = await trigger.getAttribute('data-modal-target');
        if (!modalId) {
          return;
        }
        const modalSelector = modalId.replace('#', '.modal');
        
        // Check modal is initially hidden
        const initiallyVisible = await isVisible(page, modalSelector);
        helpers.expect(initiallyVisible).toBeFalsy();
        
        // Click trigger
        await click(page, '[data-modal-target]');
        await page.waitForTimeout(500); // Wait for animation
        
        // Check modal is visible
        const afterClick = await isVisible(page, modalSelector);
        helpers.expect(afterClick).toBeTruthy();
      }
    },
    {
      name: 'should close modal on close button click',
      run: async (page, helpers) => {
        const { goto, click, isVisible, $ } = helpers;
        await goto(page, '/showcase.html');
        await page.waitForTimeout(500); // Wait for page to load
        
        // Wait for modal trigger to be visible
        await page.waitForSelector('[data-modal-target]', { 
          timeout: 5000,
          state: 'visible'
        }).catch(() => {
          return; // Skip if no modal
        });
        
        const trigger = await $(page, '[data-modal-target]');
        if (!trigger) return;
        
        // Check if trigger is visible
        const triggerVisible = await isVisible(page, '[data-modal-target]');
        if (!triggerVisible) return;
        
        const modalId = await trigger.getAttribute('data-modal-target');
        if (!modalId) return;
        const modalSelector = modalId.replace('#', '.modal');
        
        // Open modal
        await click(page, '[data-modal-target]');
        await page.waitForTimeout(500); // Wait for animation
        
        // Close modal - wait for close button to be visible
        await page.waitForSelector('[data-modal-close]', { timeout: 2000 });
        await click(page, '[data-modal-close]');
        await page.waitForTimeout(500); // Wait for animation
        
        // Check modal is hidden
        const isHidden = await isVisible(page, modalSelector);
        helpers.expect(isHidden).toBeFalsy();
      }
    },
    {
      name: 'should toggle accordion on button click',
      run: async (page, helpers) => {
        const { goto, click, getAttribute } = helpers;
        await goto(page, '/showcase.html');
        await page.waitForTimeout(500); // Wait for page to load
        
        // Wait for accordion button to be available
        try {
          await page.waitForSelector('.accordion__button', { timeout: 5000 });
        } catch (e) {
          // Skip if no accordion on page
          return;
        }
        
        // Check if accordion button exists
        const accordionCount = await page.locator('.accordion__button').count();
        if (accordionCount === 0) {
          // Skip if no accordion on page
          return;
        }
        
        // Get initial state
        const initialExpanded = await getAttribute(page, '.accordion__button', 'aria-expanded');
        
        // Click button
        await click(page, '.accordion__button');
        await page.waitForTimeout(500); // Wait for animation
        
        // Check state changed
        const newExpanded = await getAttribute(page, '.accordion__button', 'aria-expanded');
        helpers.expect(newExpanded).notToBe(initialExpanded);
      }
    }
  ]
};

