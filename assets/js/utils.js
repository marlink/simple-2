/**
 * ============================================================================
 * UTILS.JS - Shared Utility Functions
 * ============================================================================
 *
 * Common utility functions used across multiple JavaScript files
 * These functions can be imported/used by any script in the project
 *
 * Functions included:
 * - throttle: Limit function execution frequency
 * - debounce: Delay function execution until after wait time
 * - safeQuery: Safe querySelector with error handling
 * - safeQueryAll: Safe querySelectorAll with error handling
 * - formatDate: Format date as YYYY-MM-DD
 * - validateEmail: Validate email format
 *
* @author Design System
 * @version 1.0.0
 * ============================================================================
 */

/**
 * ========================================================================
 * PERFORMANCE UTILITIES
 * ========================================================================
 */

/**
 * Throttle function - limits function execution frequency
 * Useful for scroll/resize handlers to prevent excessive calls
 *
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 *
 * @example
 * const handleScroll = throttle(() => {
 *   console.log('Scrolled');
 * }, 100);
 * window.addEventListener('scroll', handleScroll);
 */
function throttle (func, limit) {
    let inThrottle
    return function () {
        const args = arguments
        const context = this
        if (!inThrottle) {
            func.apply(context, args)
            inThrottle = true
            setTimeout(() => inThrottle = false, limit)
        }
    }
}

/**
 * Debounce function - delays function execution until after wait time
 * Useful for search inputs, resize handlers
 *
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 *
 * @example
 * const handleResize = debounce(() => {
 *   console.log('Window resized');
 * }, 250);
 * window.addEventListener('resize', handleResize);
 */
function debounce (func, wait) {
    let timeout
    return function () {
        const context = this
        const args = arguments
        clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(context, args), wait)
    }
}

/**
 * ========================================================================
 * DOM UTILITIES
 * ========================================================================
 */

/**
 * Safe querySelector with error handling
 * Returns null instead of throwing errors for invalid selectors
 *
 * @param {string} selector - CSS selector string
 * @param {Element|Document} context - Context to search in (default: document)
 * @returns {Element|null} - Found element or null
 *
 * @example
 * const element = safeQuery('.my-class');
 * if (element) {
 *   element.textContent = 'Hello';
 * }
 */
function safeQuery (selector, context = document) {
    try {
        return context.querySelector(selector)
    } catch (e) {
        console.warn('Invalid selector:', selector, e)
        return null
    }
}

/**
 * Safe querySelectorAll with error handling
 * Returns empty array instead of throwing errors for invalid selectors
 *
 * @param {string} selector - CSS selector string
 * @param {Element|Document} context - Context to search in (default: document)
 * @returns {Array<Element>} - Array of found elements
 *
 * @example
 * const elements = safeQueryAll('.my-class');
 * elements.forEach(el => el.classList.add('active'));
 */
function safeQueryAll (selector, context = document) {
    try {
        return Array.from(context.querySelectorAll(selector))
    } catch (e) {
        console.warn('Invalid selector:', selector, e)
        return []
    }
}

/**
 * ========================================================================
 * DATE UTILITIES
 * ========================================================================
 */

/**
 * Format date as YYYY-MM-DD
 *
 * @param {Date} date - Date object to format
 * @returns {string} - Formatted date string (YYYY-MM-DD)
 *
 * @example
 * const today = formatDate(new Date());
 * console.log(today); // "2025-01-15"
 */
function formatDate (date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

/**
 * ========================================================================
 * VALIDATION UTILITIES
 * ========================================================================
 */

/**
 * Validate email format
 * Uses standard email regex pattern
 *
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 *
 * @example
 * if (validateEmail('user@example.com')) {
 *   console.log('Valid email');
 * }
 */
function validateEmail (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * ========================================================================
 * CLIPBOARD UTILITIES
 * ========================================================================
 */

/**
 * Copy text to clipboard
 * Uses modern Clipboard API with fallback to execCommand
 *
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 *
 * @example
 * copyToClipboard('Hello World').then(success => {
 *   if (success) {
 *     console.log('Copied!');
 *   }
 * });
 */
async function copyToClipboard (text) {
    try {
        // Use modern Clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text)
            return true
        }

        // Fallback for older browsers
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        textarea.style.left = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()

        try {
            const successful = document.execCommand('copy')
            document.body.removeChild(textarea)
            return successful
        } catch (err) {
            document.body.removeChild(textarea)
            return false
        }
    } catch (err) {
        console.error('Failed to copy text:', err)
        return false
    }
}

/**
 * ========================================================================
 * STORAGE UTILITIES
 * ========================================================================
 */

/**
 * Safe localStorage get with error handling
 * Returns default value if localStorage fails or key doesn't exist
 *
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} - Stored value or default value
 *
 * @example
 * const theme = safeStorageGet('theme', 'light');
 */
function safeStorageGet (key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : defaultValue
    } catch (e) {
        console.warn('Error reading from localStorage:', e)
        return defaultValue
    }
}

/**
 * Safe localStorage set with error handling
 *
 * @param {string} key - Storage key
 * @param {*} value - Value to store (will be JSON stringified)
 * @returns {boolean} - Success status
 *
 * @example
 * if (safeStorageSet('theme', 'dark')) {
 *   console.log('Theme saved');
 * }
 */
function safeStorageSet (key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value))
        return true
    } catch (e) {
        console.error('Error writing to localStorage:', e)
        return false
    }
}

// Export functions to global scope for use in other scripts
// Note: In a module system, you would use export instead
if (typeof window !== 'undefined') {
    window.throttle = throttle
    window.debounce = debounce
    window.safeQuery = safeQuery
    window.safeQueryAll = safeQueryAll
    window.formatDate = formatDate
    window.validateEmail = validateEmail
    window.copyToClipboard = copyToClipboard
    window.safeStorageGet = safeStorageGet
    window.safeStorageSet = safeStorageSet
}
