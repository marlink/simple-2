/**
 * ============================================================================
 * COMPONENTS.JS - Reusable UI Components
 * ============================================================================
 * 
 * Lightweight, framework-free component library using plain DOM API
 * All components use data attributes for configuration (no JavaScript config needed)
 * 
 * Components included:
 * - Tabs: Multi-panel tab interface with ARIA support
 * - Accordion: Expandable/collapsible content sections
 * - Modal: Overlay dialogs with focus trapping and keyboard navigation
 * - Tooltip: Hover tooltips with automatic positioning
 * - Code Copy Button: One-click code copying with visual feedback
 * 
 * Performance:
 * - No external dependencies
 * - Minimal DOM queries (cached where possible)
 * - Event delegation where appropriate
 * - Accessible (ARIA attributes, keyboard navigation)
 * 
 * @author Your School
 * @version 1.0.0
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================================
     * TABS COMPONENT
     * ========================================================================
     * Multi-panel tab interface
     * 
     * HTML Structure:
     * <div class="tabs">
     *   <button class="tab" aria-controls="panel-1" aria-selected="true">Tab 1</button>
     *   <button class="tab" aria-controls="panel-2" aria-selected="false">Tab 2</button>
     *   <div id="panel-1" class="tab__panel is-active">Content 1</div>
     *   <div id="panel-2" class="tab__panel">Content 2</div>
     * </div>
     * 
     * Features:
     * - ARIA attributes for accessibility
     * - Keyboard navigation support
     * - Smooth transitions (handled by CSS)
     */
    const tabContainers = document.querySelectorAll('.tabs');
    tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('.tab');
        const panels = container.querySelectorAll('.tab__panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // deactivate all
                tabs.forEach(t => {
                    t.classList.remove('is-active');
                    t.setAttribute('aria-selected', 'false');
                });
                panels.forEach(p => p.classList.remove('is-active'));

                // activate clicked
                tab.classList.add('is-active');
                tab.setAttribute('aria-selected', 'true');
                const panelId = tab.getAttribute('aria-controls');
                const panel = container.querySelector('#' + panelId);
                if (panel) panel.classList.add('is-active');
            });
        });
    });

    /* ========================================================================
     * ACCORDION COMPONENT
     * ========================================================================
     * Expandable/collapsible content sections (FAQ-style)
     * 
     * HTML Structure:
     * <div class="accordion">
     *   <div class="accordion__item">
     *     <button class="accordion__button" aria-expanded="false">Question</button>
     *     <div class="accordion__panel" hidden>Answer</div>
     *   </div>
     * </div>
     * 
     * Features:
     * - ARIA expanded state management
     * - Uses native `hidden` attribute for accessibility
     * - Independent item expansion (multiple can be open)
     */
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(accordion => {
        const items = accordion.querySelectorAll('.accordion__item');
        items.forEach(item => {
            const button = item.querySelector('.accordion__button');
            const panel = item.querySelector('.accordion__panel');

            button.addEventListener('click', () => {
                const expanded = button.getAttribute('aria-expanded') === 'true';
                button.setAttribute('aria-expanded', String(!expanded));
                panel.hidden = expanded;
            });
        });
    });

    /* ========================================================================
     * MODAL COMPONENT
     * ========================================================================
     * Overlay dialog with focus trapping and keyboard navigation
     * 
     * HTML Structure:
     * <div class="modal" id="my-modal" hidden>
     *   <div class="modal__overlay"></div>
     *   <div class="modal__dialog">
     *     <button data-modal-close>Close</button>
     *     <h2>Modal Title</h2>
     *     <p>Modal content</p>
     *   </div>
     * </div>
     * 
     * Trigger:
     * <button data-modal-target="#my-modal">Open Modal</button>
     * 
     * Features:
     * - Focus trapping (Tab key cycles within modal)
     * - Escape key closes modal
     * - Overlay click closes modal
     * - Restores focus to trigger element on close
     * - Prevents body scroll when open
     */
    const openTriggers = document.querySelectorAll('[data-modal-target]');
    const modals = document.querySelectorAll('.modal');
    
    // Initialize modals
    modals.forEach(modal => {
        const overlay = modal.querySelector('.modal__overlay');
        const dialog = modal.querySelector('.modal__dialog');
        const closeButtons = modal.querySelectorAll('[data-modal-close]');
        let lastFocused = null;

        const openModal = () => {
            lastFocused = document.activeElement;
            modal.removeAttribute('hidden');
            // focus first focusable element inside dialog
            const focusable = dialog.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusable) focusable.focus();

            const onKeydown = (e) => {
                if (e.key === 'Escape') closeModal();
                if (e.key === 'Tab') {
                    // focus trap
                    const focusable = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    if (focusable.length === 0) return;
                    const first = focusable[0];
                    const last = focusable[focusable.length - 1];
                    if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault(); last.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault(); first.focus();
                    }
                }
            };

            document.addEventListener('keydown', onKeydown);
            modal._keydownHandler = onKeydown;
        };

        const closeModal = () => {
            modal.setAttribute('hidden', '');
            if (modal._keydownHandler) {
                document.removeEventListener('keydown', modal._keydownHandler);
                delete modal._keydownHandler;
            }
            if (lastFocused) lastFocused.focus();
        };

        // Set up close handlers (only once)
        if (overlay) overlay.addEventListener('click', closeModal);
        closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
        
        // Store open function on modal
        modal._openModal = openModal;
    });
    
    // Set up open triggers
    openTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSel = btn.getAttribute('data-modal-target');
            const modal = document.querySelector(targetSel);
            if (modal && modal._openModal) {
                modal._openModal();
            }
        });
    });

    /* ========================================================================
     * TOOLTIP COMPONENT
     * ========================================================================
     * Simple hover tooltips
     * 
     * HTML Structure:
     * <button data-tooltip="Tooltip text">Hover me</button>
     * 
     * Features:
     * - Automatically positioned above element
     * - Created dynamically on page load
     * - Simple CSS-based positioning
     */
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    tooltipTriggers.forEach(trigger => {
        const tip = document.createElement('span');
        tip.className = 'tooltip';
        tip.textContent = trigger.getAttribute('data-tooltip');
        trigger.appendChild(tip);
        // Position tooltip above the element (simple)
        tip.style.left = '50%';
        tip.style.bottom = '100%';
        tip.style.transform = 'translate(-50%, -6px)';
    });

    /* ========================================================================
     * CODE COPY BUTTON COMPONENT
     * ========================================================================
     * Adds copy-to-clipboard functionality to code blocks
     * 
     * HTML Structure:
     * <pre class="code-block">
     *   <code>code content</code>
     * </pre>
     * OR
     * <div class="code-example">code content</div>
     * 
     * Features:
     * - One-click code copying
     * - Visual feedback ("Copied!" message)
     * - Handles HTML entities and formatting
     * - Works with both <pre><code> and <div class="code-example">
     * - Touch-friendly (prevents text selection on tap)
     */
    
    /**
     * Decode HTML entities in a string
     * @param {string} html - HTML string with entities
     * @returns {string} - Decoded string
     */
    const decodeHtmlEntities = (html) => {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = html;
        return textarea.value;
    };

    /**
     * Extract text content from a code block
     * @param {HTMLElement} codeBlock - The code block element
     * @returns {string} - The code text to copy
     */
    const extractCodeText = (codeBlock) => {
        // For .code-example, decode HTML entities and handle HTML structure
        if (codeBlock.classList.contains('code-example')) {
            // Clone the element to avoid modifying the original
            const clone = codeBlock.cloneNode(true);
            
            // Replace <br> tags with newlines
            clone.querySelectorAll('br').forEach(br => {
                br.replaceWith(document.createTextNode('\n'));
            });
            
            // Remove <strong> tags but keep their content, add newline after if followed by content
            const strongTags = Array.from(clone.querySelectorAll('strong'));
            strongTags.forEach(strong => {
                const parent = strong.parentNode;
                const nextSibling = strong.nextSibling;
                
                // Move strong content before the strong element
                while (strong.firstChild) {
                    parent.insertBefore(strong.firstChild, strong);
                }
                
                // Add newline after strong content if there's following content
                if (nextSibling && (nextSibling.nodeType === Node.TEXT_NODE || nextSibling.nodeType === Node.ELEMENT_NODE)) {
                    const nextText = nextSibling.textContent ? nextSibling.textContent.trim() : '';
                    if (nextText) {
                        parent.insertBefore(document.createTextNode('\n'), strong);
                    }
                }
                
                parent.removeChild(strong);
            });
            
            // Get text content and decode HTML entities
            let text = clone.textContent || clone.innerText;
            // Clean up multiple consecutive newlines (max 2)
            text = text.replace(/\n{3,}/g, '\n\n');
            return decodeHtmlEntities(text).trim();
        }
        
        // For pre.code-block, get code element text
        if (codeBlock.classList.contains('code-block')) {
            const codeElement = codeBlock.querySelector('code');
            if (codeElement) {
                return codeElement.textContent || codeElement.innerText;
            }
            return codeBlock.textContent || codeBlock.innerText;
        }
        
        // Fallback: get all text content
        return codeBlock.textContent || codeBlock.innerText;
    };

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} - Success status
     */
    const copyToClipboard = async (text) => {
        try {
            // Use modern Clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                return true;
            }
            
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textarea);
                return successful;
            } catch (err) {
                document.body.removeChild(textarea);
                return false;
            }
        } catch (err) {
            console.error('Failed to copy text:', err);
            return false;
        }
    };

    /**
     * Create and setup copy button for a code block
     * @param {HTMLElement} codeBlock - The code block element
     */
    const setupCopyButton = (codeBlock) => {
        // Skip if button already exists
        if (codeBlock.querySelector('.code-copy-btn')) {
            return;
        }

        const copyBtn = document.createElement('button');
        copyBtn.className = 'code-copy-btn';
        copyBtn.setAttribute('aria-label', 'Copy code');
        copyBtn.setAttribute('type', 'button');
        copyBtn.textContent = 'Copy';
        
        // Prevent text selection when tapping
        copyBtn.addEventListener('mousedown', (e) => e.preventDefault());
        copyBtn.addEventListener('touchstart', (e) => e.preventDefault());
        
        // Handle copy on click/touch
        const handleCopy = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const codeText = extractCodeText(codeBlock);
            const success = await copyToClipboard(codeText);
            
            if (success) {
                // Show success feedback
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                copyBtn.classList.add('copied');
                
                // Reset after 2 seconds
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.classList.remove('copied');
                }, 2000);
            } else {
                // Show error feedback (optional)
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Error';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            }
        };
        
        // Support both click and touch events
        copyBtn.addEventListener('click', handleCopy);
        copyBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            handleCopy(e);
        });
        
        codeBlock.appendChild(copyBtn);
    };

    // Find all code blocks and add copy buttons
    const codeBlocks = document.querySelectorAll('.code-example, pre.code-block');
    codeBlocks.forEach(setupCopyButton);
});

/* ========================================================================
 * GLOBAL TAB SWITCHING FUNCTION
 * ========================================================================
 * Programmatically switch to a tab by name
 * Available globally as window.switchTab()
 * 
 * Usage:
 * window.switchTab('photos'); // Switches to tab with data-tab="photos"
 * 
 * Works with:
 * - Standard tabs (aria-controls pattern)
 * - Showcase tabs (tab-{name} panel, tab-btn-{name} button pattern)
 * 
 * @param {string} tabName - The name of the tab to switch to
 * @global
 */
window.switchTab = function(tabName) {
    // Try showcase pattern first (tab-{name} panel, tab-btn-{name} button)
    const showcasePanel = document.getElementById(`tab-${tabName}`);
    const showcaseBtn = document.getElementById(`tab-btn-${tabName}`);
    
    if (showcasePanel && showcaseBtn) {
        // Hide all showcase panels
        document.querySelectorAll('.tab__panel').forEach(panel => {
            panel.hidden = true;
            panel.classList.remove('is-active');
        });
        
        // Remove active from all showcase tabs
        const showcaseTabs = document.querySelector('.showcase-tabs');
        if (showcaseTabs) {
            showcaseTabs.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('is-active');
                tab.setAttribute('aria-selected', 'false');
            });
        }
        
        // Show selected panel
        showcasePanel.hidden = false;
        showcasePanel.classList.add('is-active');
        showcaseBtn.classList.add('is-active');
        showcaseBtn.setAttribute('aria-selected', 'true');
        
        // Scroll to top of main content
        const main = document.querySelector('main');
        if (main) {
            main.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
    }
    
    // Fallback to standard tab system
    const tabContainers = document.querySelectorAll('.tabs');
    tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('.tab');
        const panels = container.querySelectorAll('.tab__panel');
        
        tabs.forEach(tab => {
            const panelId = tab.getAttribute('aria-controls');
            const dataTab = tab.getAttribute('data-tab');
            
            if (panelId && panelId.includes(tabName) || dataTab === tabName) {
                // Deactivate all
                tabs.forEach(t => {
                    t.classList.remove('is-active');
                    t.setAttribute('aria-selected', 'false');
                });
                panels.forEach(p => p.classList.remove('is-active'));
                
                // Activate matching tab
                tab.classList.add('is-active');
                tab.setAttribute('aria-selected', 'true');
                const panel = container.querySelector('#' + panelId);
                if (panel) panel.classList.add('is-active');
            }
        });
    });
};
