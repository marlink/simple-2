/**
 * ============================================================================
 * MAIN.JS - Core Site Functionality
 * ============================================================================
 *
 * This file handles all core site-wide functionality including:
 * - Theme management (light/dark mode with smooth transitions)
 * - Navigation behavior (scroll-responsive header, mobile menu)
 * - Form validation (newsletter email validation)
 * - Active navigation link highlighting
 *
 * Dependencies:
 * - utils.js (must be loaded before this file for utility functions)
 *
 * Performance optimizations:
 * - Uses requestAnimationFrame for scroll handling
 * - Throttled/debounced event handlers where appropriate
 * - Passive event listeners for better scroll performance
 *
 * @author Your School
 * @version 1.0.0
 * ============================================================================
 */

// Import utility functions from utils.js (loaded globally)
// Note: utils.js must be loaded before this file
// Use functions directly from window (exported by utils.js)
(function () {
    'use strict'
    // Use utility functions from utils.js (loaded before this file)
    const safeQuery = window.safeQuery
    const safeQueryAll = window.safeQueryAll

    const updateTokenValueDisplays = () => {
        try {
            if (!document.body) return
            const tokenValueEls = safeQueryAll('[data-token-value]')
            if (!tokenValueEls.length) return
            const styles = window.getComputedStyle(document.body)
            tokenValueEls.forEach((el) => {
                const tokenName = el.getAttribute('data-token-value')
                if (!tokenName) return
                const rawValue = styles.getPropertyValue(tokenName)
                if (rawValue) {
                    el.textContent = rawValue.trim()
                }
            })
        } catch (error) {
            console.error('Error updating token values:', error)
        }
    }

    /* ========================================================================
     * 0️⃣ PAGE LOAD SPINNER
     * ========================================================================
     * Remove spinner when DOM is fully loaded
     * Spinner must exist in HTML before this script runs
     */
    const removeSpinner = () => {
        const spinner = safeQuery('.page-spinner')
        if (spinner) {
            spinner.classList.add('hidden')
            // Remove from DOM after transition completes
            setTimeout(() => {
                spinner.remove()
            }, 400) // Match CSS transition duration
        }
    }

    // Remove spinner on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeSpinner)
    } else {
        // DOM already loaded
        removeSpinner()
    }

    document.addEventListener('DOMContentLoaded', () => {
        updateTokenValueDisplays()
        try {
        /* ========================================================================
         * 1️⃣ FOOTER YEAR UPDATE
         * ========================================================================
         * Automatically updates the current year in the footer
         * Element must have id="year" to be updated
         */
            const yearEl = document.getElementById('year')
            if (yearEl) {
                yearEl.textContent = new Date().getFullYear()
            } else {
                console.warn('Footer year element not found (id="year")')
            }
        } catch (error) {
            console.error('Error updating footer year:', error)
        }

        /* ========================================================================
     * 2️⃣ THEME MANAGEMENT SYSTEM - REBUILT
     * ========================================================================
     * Simple, reliable theme switching
     * - Persists theme preference in localStorage
     * - Smooth hero image fade transitions
     * - Preloads opposite theme image for instant switching
     */

        /**
     * Apply theme to the document
     * @param {string} theme - 'light' or 'dark'
     */
        const applyTheme = (theme) => {
            console.log('Applying theme:', theme)

            if (!document.body) {
                console.error('Body element not found!')
                return
            }

            // Set theme attribute immediately
            document.body.setAttribute('data-theme', theme)
            document.documentElement.setAttribute('data-theme', theme) // Also set on html for extra specificity

            // Save to localStorage
            try {
                localStorage.setItem('theme', theme)
            } catch (e) {
                console.warn('Could not save theme to localStorage:', e)
            }

            // Verify it was set
            const verifyTheme = document.body.getAttribute('data-theme')
            console.log('Theme verified on body:', verifyTheme)

            // Force reflow to ensure CSS updates
            void document.body.offsetHeight
            void document.documentElement.offsetHeight

            // Handle hero image transition if present
            const hero = safeQuery('.hero')
            if (hero) {
                hero.style.setProperty('--transition-opacity', '0')
                setTimeout(() => {
                    void hero.offsetHeight // Force reflow
                    setTimeout(() => {
                        hero.style.setProperty('--transition-opacity', '1')
                    }, 10)
                }, 100)
            }

            updateTokenValueDisplays()
        }

        /**
     * Toggle between light and dark themes
     */
        const toggleTheme = (e) => {
            console.log('Theme toggle clicked!', e)

            // Don't prevent default - let button work normally
            if (e) {
                e.stopPropagation()
            }

            const currentTheme = document.body?.getAttribute('data-theme') || 'dark'
            console.log('Current theme:', currentTheme)
            const newTheme = currentTheme === 'light' ? 'dark' : 'light'
            console.log('Switching to theme:', newTheme)
            applyTheme(newTheme)

            return false
        }

        // Load saved theme preference on page load (before DOM is ready)
        const savedTheme = localStorage.getItem('theme') || 'dark'
        if (document.body) {
            document.body.setAttribute('data-theme', savedTheme)
            document.documentElement.setAttribute('data-theme', savedTheme)
            updateTokenValueDisplays()
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.setAttribute('data-theme', savedTheme)
                document.documentElement.setAttribute('data-theme', savedTheme)
                updateTokenValueDisplays()
            })
        }

        /**
     * Preload the opposite theme's hero image
     */
        const preloadThemeImage = () => {
            const currentTheme = document.body.getAttribute('data-theme') || 'dark'
            const otherTheme = currentTheme === 'light' ? 'dark' : 'light'
            const imagePath = otherTheme === 'light'
                ? 'assets/images/heros/white-rider-lg.jpg'
                : 'assets/images/heros/black-rider-lg.jpg'

            const img = new Image()
            img.src = imagePath
        }

        // Preload after page is fully loaded
        if (document.readyState === 'complete') {
            preloadThemeImage()
        } else {
            window.addEventListener('load', preloadThemeImage)
        }

        // Attach click handlers using event delegation (most reliable)
        document.addEventListener('click', (e) => {
            const toggle = e.target.closest('.theme-toggle')
            if (toggle) {
                console.log('Theme toggle clicked via delegation')
                toggleTheme(e)
            }
        })

        // Also attach directly to existing toggles as backup
        const initThemeToggles = () => {
            const themeToggles = safeQueryAll('.theme-toggle')
            console.log('Initializing theme toggles, found:', themeToggles.length)

            themeToggles.forEach((toggle, index) => {
                if (toggle && !toggle.dataset.themeListenerAttached) {
                    toggle.addEventListener('click', toggleTheme)
                    toggle.dataset.themeListenerAttached = 'true'
                    console.log(`Theme toggle ${index} attached directly`)
                }
            })
        }

        // Initialize on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initThemeToggles)
        } else {
            initThemeToggles()
        }

        // Also re-initialize after a short delay to catch dynamically added toggles
        setTimeout(initThemeToggles, 100)

        /* ========================================================================
     * 2️⃣.7 SCROLL-RESPONSIVE NAVIGATION
     * ========================================================================
     * Navigation bar that becomes fixed after scrolling past hero section
     * - Navbar is static initially, becomes fixed after scrolling past hero section
     * - Always visible after scroll (no auto-hide behavior)
     * - Uses requestAnimationFrame for smooth 60fps performance
     *
     * Behavior:
     * - Navbar position: static until past hero section, then fixed
     * - Always visible: Navbar remains visible at all times for easy navigation access
     * - After 275px scroll: Navbar becomes "scrolled" state (glassmorphism styling)
     */
        try {
            const siteHeader = safeQuery('.site-header')
            if (!siteHeader) {
                console.warn('Site header not found')
            } else {
                // Performance optimization: throttle scroll handler
                let ticking = false

                // Get hero section to calculate when to make navbar fixed
                const hero = safeQuery('.hero')
                let heroHeight = 0
                let heroOffsetTop = 0

                // Calculate hero dimensions (recalculate on resize)
                const calculateHeroDimensions = () => {
                    if (hero) {
                        const rect = hero.getBoundingClientRect()
                        heroHeight = rect.height
                        heroOffsetTop = rect.top + window.scrollY
                    }
                }

                // Initial calculation - wait for page to be fully loaded for accurate hero dimensions
                if (document.readyState === 'complete') {
                    calculateHeroDimensions()
                } else {
                    window.addEventListener('load', () => {
                        calculateHeroDimensions()
                        // Initial scroll check after hero dimensions are calculated
                        handleScroll()
                    })
                }

                // Recalculate on resize (hero height may change with viewport)
                window.addEventListener('resize', () => {
                    calculateHeroDimensions()
                    // Re-check scroll position after resize
                    if (!ticking) {
                        window.requestAnimationFrame(handleScroll)
                        ticking = true
                    }
                }, { passive: true })

                // Configuration constants
                const fixedThreshold = 275 // Navbar becomes "scrolled" state after this scroll distance (px)

                const handleScroll = () => {
                    const scrollY = window.scrollY || window.pageYOffset

                    // Make navbar fixed only after scrolling past hero section
                    if (hero) {
                        const heroBottom = heroOffsetTop + heroHeight
                        if (scrollY >= heroBottom) {
                            siteHeader.classList.add('site-header--fixed')
                            document.body.classList.add('navbar-fixed')
                        } else {
                            siteHeader.classList.remove('site-header--fixed')
                            document.body.classList.remove('navbar-fixed')
                        }
                    } else {
                        // No hero section: make fixed immediately (for pages without hero)
                        siteHeader.classList.add('site-header--fixed')
                        document.body.classList.add('navbar-fixed')
                    }

                    // Handle scrolled state (for styling changes) - only applies after fixed threshold
                    if (scrollY > fixedThreshold) {
                        siteHeader.classList.add('site-header--scrolled')
                        document.body.classList.add('navbar-scrolled')
                    } else {
                        siteHeader.classList.remove('site-header--scrolled')
                        document.body.classList.remove('navbar-scrolled')
                    }

                    // Ensure navbar is always visible (remove any hidden state)
                    siteHeader.classList.remove('site-header--hidden')

                    ticking = false
                }

                const onScroll = () => {
                    if (!ticking) {
                        window.requestAnimationFrame(handleScroll)
                        ticking = true
                    }
                }

                // Handle initial state - check after a brief delay to ensure hero dimensions are calculated
                setTimeout(() => {
                    calculateHeroDimensions()
                    handleScroll()
                }, 100)

                // Listen to scroll events (works for both desktop and touch devices)
                window.addEventListener('scroll', onScroll, { passive: true })
                window.addEventListener('touchmove', onScroll, { passive: true })
            }
        } catch (error) {
            console.error('Error initializing scroll-responsive navigation:', error)
        }

        /* ========================================================================
     * 2️⃣.8 MOBILE MENU TOGGLE
     * ========================================================================
     * Handles mobile navigation menu (hamburger menu)
     * Features:
     * - Opens/closes on burger button click
     * - Closes on overlay click, escape key, or link click
     * - Prevents body scroll when open
     * - Manages focus for accessibility
     * - Auto-closes on window resize to desktop width
     * - Syncs theme toggle state
     */
        const nav = safeQuery('.nav')
        const burgerButton = safeQuery('.nav__burger')
        const overlay = safeQuery('.nav__overlay')
        const mobileMenu = safeQuery('.nav__mobile-menu')
        const mobileMenuLinks = safeQueryAll('.nav__mobile-menu .nav__link')

        /**
     * Sync mobile menu theme toggle with current theme
     * Ensures mobile theme toggle displays correct icon state
     * Currently handled by CSS, but function exists for future enhancements
     */
        const syncMobileTheme = () => {
            const currentTheme = document.body.getAttribute('data-theme') || 'dark'
            const mobileThemeToggle = mobileMenu?.querySelector('.theme-toggle')

            if (mobileThemeToggle) {
            // Theme toggle icons are controlled by CSS based on data-theme attribute
            // No additional action needed as body data-theme already controls visibility
            // This function exists for potential future enhancements
            }
        }

        if (nav && burgerButton && overlay && mobileMenu) {
            let isMenuOpen = false
            let previousFocus = null

            const openMenu = () => {
                if (isMenuOpen) return

                isMenuOpen = true
                nav.setAttribute('data-menu-open', 'true')
                burgerButton.setAttribute('aria-expanded', 'true')

                // Prevent body scroll
                document.body.style.overflow = 'hidden'

                // Store previous focus
                previousFocus = document.activeElement

                // Focus first focusable element in menu
                const firstFocusable = safeQuery('a, button, input, [tabindex]:not([tabindex="-1"])', mobileMenu)
                if (firstFocusable) {
                    setTimeout(() => firstFocusable.focus(), 100)
                }

                // Sync theme on open
                syncMobileTheme()
            }

            const closeMenu = () => {
                if (!isMenuOpen) return

                isMenuOpen = false
                nav.setAttribute('data-menu-open', 'false')
                burgerButton.setAttribute('aria-expanded', 'false')

                // Restore body scroll
                document.body.style.overflow = ''

                // Restore focus
                if (previousFocus) {
                    previousFocus.focus()
                    previousFocus = null
                }
            }

            // Toggle menu on burger click
            burgerButton.addEventListener('click', (e) => {
                e.stopPropagation()
                if (isMenuOpen) {
                    closeMenu()
                } else {
                    openMenu()
                }
            })

            // Close menu on overlay click
            overlay.addEventListener('click', () => {
                closeMenu()
            })

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && isMenuOpen) {
                    closeMenu()
                }
            })

            // Close menu when clicking on a link
            mobileMenuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    closeMenu()
                })
            })

            // Close menu on resize if switching to desktop view
            let resizeTimeout
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout)
                resizeTimeout = setTimeout(() => {
                    if (window.innerWidth > 600 && isMenuOpen) {
                        closeMenu()
                    }
                }, 100)
            })

            // Initial sync
            syncMobileTheme()
        }

        /* ========================================================================
     * 3️⃣ ACTIVE NAVIGATION LINK HIGHLIGHTING
     * ========================================================================
     * Automatically highlights the current page's navigation link
     * Handles edge cases:
     * - Root path ("/") matches "index.html"
     * - Trailing slashes
     * - Different path formats
     */
        const setActiveNavLink = () => {
            const navLinks = safeQueryAll('.nav__link')
            const currentPath = window.location.pathname
            const currentPage = currentPath.split('/').pop() || 'index.html'

            navLinks.forEach(link => {
                const href = link.getAttribute('href')
                // Remove active state from all links first
                link.classList.remove('is-active')

                // Check if this link matches the current page
                // Handle both root "/" and "index.html" for home
                if ((currentPage === '' || currentPage === 'index.html' || currentPath === '/' || currentPath.endsWith('/')) && href === 'index.html') {
                    link.classList.add('is-active')
                } else if (href === currentPage) {
                    link.classList.add('is-active')
                }
            })
        }

        setActiveNavLink()

        /* ========================================================================
     * 4️⃣ FOOTER NEWSLETTER EMAIL VALIDATION
     * ========================================================================
     * Real-time email validation for newsletter subscription
     * - Validates email format as user types
     * - Enables/disables subscribe button based on validity
     * - Uses standard email regex pattern
     */
        const emailInput = safeQuery('.footer__email-input')
        const subscribeBtn = safeQuery('.footer__subscribe-btn')

        /**
     * Update subscribe button state based on email validity
     * Uses validateEmail from utils.js (must be loaded before main.js)
     */
        const updateSubscribeButton = () => {
            if (emailInput && subscribeBtn) {
                const email = emailInput.value.trim()
                // Use validateEmail from utils.js (global function)
                const isValid = window.validateEmail ? window.validateEmail(email) : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                subscribeBtn.disabled = !isValid
            }
        }

        if (emailInput && subscribeBtn) {
        // Initially disable the button (no email entered)
            subscribeBtn.disabled = true

            // Validate on input (real-time feedback)
            emailInput.addEventListener('input', updateSubscribeButton)

            // Validate on blur (when user leaves the field)
            emailInput.addEventListener('blur', updateSubscribeButton)
        }

        /* ========================================================================
     * 5️⃣ CONTACT FORM SUBMISSION
     * ========================================================================
     * Handles contact form submission with fetch API
     * - Prevents default form submission
     * - Shows loading state during submission
     * - Displays success/error messages
     * - Resets form on success
     *
     * Note: Update FORMSPREE_ENDPOINT with your Formspree endpoint URL
     * or replace with your own backend endpoint
     */
        try {
            const contactForm = document.getElementById('contact-form')
            const formMessages = document.getElementById('form-messages')
            const submitBtn = document.getElementById('submit-btn')

            // Formspree endpoint - replace with your actual endpoint
            // Get your endpoint from https://formspree.io/
            const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'

            if (!contactForm || !formMessages || !submitBtn) {
            // Contact form not available on this page
            } else {
                const btnText = safeQuery('.btn__text', submitBtn)
                const btnSpinner = safeQuery('.btn__spinner', submitBtn)

                /**
         * Show message to user
         * @param {string} message - Message text
         * @param {string} type - 'success' or 'error'
         */
                const showMessage = (message, type) => {
                    formMessages.textContent = message
                    formMessages.className = `form__messages form__messages--${type}`
                    formMessages.style.display = 'block'

                    // Scroll to message
                    formMessages.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

                    // Hide message after 5 seconds for errors, keep success visible
                    if (type === 'error') {
                        setTimeout(() => {
                            formMessages.style.display = 'none'
                        }, 5000)
                    }
                }

                /**
         * Show loading state
         */
                const showLoading = () => {
                    submitBtn.disabled = true
                    if (btnText) btnText.style.display = 'none'
                    if (btnSpinner) btnSpinner.style.display = 'inline'
                }

                /**
         * Hide loading state
         */
                const hideLoading = () => {
                    submitBtn.disabled = false
                    if (btnText) btnText.style.display = 'inline'
                    if (btnSpinner) btnSpinner.style.display = 'none'
                }

                contactForm.addEventListener('submit', async (e) => {
                    e.preventDefault()

                    // Hide previous messages
                    formMessages.style.display = 'none'

                    // Validate form
                    if (!contactForm.checkValidity()) {
                        contactForm.reportValidity()
                        return
                    }

                    // Get form data
                    const formData = new FormData(contactForm)
                    const data = Object.fromEntries(formData)

                    // Show loading state
                    showLoading()

                    try {
                        // Submit to Formspree or your backend
                        const response = await fetch(FORMSPREE_ENDPOINT, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json'
                            },
                            body: JSON.stringify(data)
                        })

                        if (response.ok) {
                            // Success
                            showMessage('Thank you! Your message has been sent successfully.', 'success')
                            contactForm.reset()
                        } else {
                            // Error from server
                            const errorData = await response.json().catch(() => ({}))
                            const errorMessage = errorData.error || 'There was an error sending your message. Please try again.'
                            showMessage(errorMessage, 'error')
                        }
                    } catch (error) {
                        // Network or other error
                        console.error('Form submission error:', error)
                        showMessage('Unable to send message. Please check your connection and try again.', 'error')
                    } finally {
                        hideLoading()
                    }
                })
            }
        } catch (error) {
            console.error('Error initializing contact form:', error)
        }

        /* ========================================================================
     * 6️⃣ NEWSLETTER SUBSCRIPTION
     * ========================================================================
     * Handles newsletter subscription form submission
     * - Uses same backend approach as contact form (Formspree recommended)
     * - Shows success/error messages
     * - Clears input on success
     * - Updates button state during submission
     *
     * Note: Update NEWSLETTER_ENDPOINT with your Formspree endpoint URL
     * or replace with your own backend endpoint
     */
        try {
            const newsletterForm = safeQuery('.footer__newsletter')
            const newsletterInput = safeQuery('.footer__email-input')
            const newsletterBtn = safeQuery('.footer__subscribe-btn')

            // Formspree endpoint for newsletter - replace with your actual endpoint
            const NEWSLETTER_ENDPOINT = 'https://formspree.io/f/YOUR_NEWSLETTER_FORM_ID'

            if (!newsletterForm || !newsletterInput || !newsletterBtn) {
            // Newsletter form not available on this page
            } else {
                // Create message container if it doesn't exist
                let newsletterMessage = safeQuery('.newsletter__message', newsletterForm)
                if (!newsletterMessage) {
                    newsletterMessage = document.createElement('div')
                    newsletterMessage.className = 'newsletter__message'
                    newsletterMessage.setAttribute('role', 'alert')
                    newsletterMessage.setAttribute('aria-live', 'polite')
                    newsletterMessage.style.display = 'none'
                    newsletterForm.insertBefore(newsletterMessage, newsletterInput)
                }

                /**
         * Show newsletter message
         * @param {string} message - Message text
         * @param {string} type - 'success' or 'error'
         */
                const showNewsletterMessage = (message, type) => {
                    newsletterMessage.textContent = message
                    newsletterMessage.className = `newsletter__message newsletter__message--${type}`
                    newsletterMessage.style.display = 'block'

                    // Hide message after 5 seconds for errors, keep success visible longer
                    if (type === 'error') {
                        setTimeout(() => {
                            newsletterMessage.style.display = 'none'
                        }, 5000)
                    } else {
                        setTimeout(() => {
                            newsletterMessage.style.display = 'none'
                        }, 10000)
                    }
                }

                /**
         * Handle newsletter form submission
         */
                const handleNewsletterSubmit = async (e) => {
                    e.preventDefault()

                    const email = newsletterInput.value.trim()

                    // Validate email
                    const isValidEmail = window.validateEmail ? window.validateEmail(email) : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                    if (email && isValidEmail) {
                        // Show loading state
                        newsletterBtn.disabled = true
                        const originalText = newsletterBtn.textContent
                        newsletterBtn.textContent = 'Subscribing...'

                        try {
                            // Submit to Formspree or your backend
                            const response = await fetch(NEWSLETTER_ENDPOINT, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Accept: 'application/json'
                                },
                                body: JSON.stringify({ email })
                            })

                            if (response.ok) {
                                // Success
                                showNewsletterMessage('Thank you! You have been subscribed successfully.', 'success')
                                newsletterInput.value = ''
                                newsletterBtn.disabled = true // Keep disabled until new email entered
                            } else {
                                // Error from server
                                const errorData = await response.json().catch(() => ({}))
                                const errorMessage = errorData.error || 'There was an error subscribing. Please try again.'
                                showNewsletterMessage(errorMessage, 'error')
                                newsletterBtn.disabled = false
                                newsletterBtn.textContent = originalText
                            }
                        } catch (error) {
                            // Network or other error
                            console.error('Newsletter subscription error:', error)
                            showNewsletterMessage('Unable to subscribe. Please check your connection and try again.', 'error')
                            newsletterBtn.disabled = false
                            newsletterBtn.textContent = originalText
                        }
                    } else {
                        showNewsletterMessage('Please enter a valid email address.', 'error')
                    }
                }

                // Handle form submission (when Enter is pressed in input)
                newsletterInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !newsletterBtn.disabled) {
                        e.preventDefault()
                        handleNewsletterSubmit(e)
                    }
                })

                // Handle button click
                newsletterBtn.addEventListener('click', handleNewsletterSubmit)
            }
        } catch (error) {
            console.error('Error initializing newsletter subscription:', error)
        }
    })
})() // Close IIFE to scope safeQuery and safeQueryAll
