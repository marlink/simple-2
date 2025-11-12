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
const safeQuery = window.safeQuery;
const safeQueryAll = window.safeQueryAll;

document.addEventListener('DOMContentLoaded', () => {
    try {
        /* ========================================================================
         * 1️⃣ FOOTER YEAR UPDATE
         * ========================================================================
         * Automatically updates the current year in the footer
         * Element must have id="year" to be updated
         */
        const yearEl = document.getElementById('year');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        } else {
            console.warn('Footer year element not found (id="year")');
        }
    } catch (error) {
        console.error('Error updating footer year:', error);
    }

    /* ========================================================================
     * 2️⃣ THEME MANAGEMENT SYSTEM
     * ========================================================================
     * Handles light/dark theme switching with smooth transitions
     * - Persists theme preference in localStorage
     * - Smooth hero image fade transitions
     * - Preloads opposite theme image for instant switching
     */
    const themeToggles = safeQueryAll('.theme-toggle');
    
    /**
     * Apply theme to the document
     * @param {string} theme - 'light' or 'dark'
     * 
     * For pages with hero images, uses opacity fade for smooth transition:
     * 1. Fade out current hero image
     * 2. Change theme (triggers CSS background-image change)
     * 3. Fade in new hero image
     * 
     * For pages without hero, applies theme immediately
     */
    const applyTheme = (theme) => {
        const hero = safeQuery('.hero');
        if (hero) {
            // Smooth transition: fade out → change theme → fade in
            hero.style.setProperty('--transition-opacity', '0');
            setTimeout(() => {
                document.body.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
                // Force reflow to ensure theme change is applied before fade-in
                void hero.offsetHeight;
                setTimeout(() => {
                    hero.style.setProperty('--transition-opacity', '1');
                }, 10);
            }, 100);
        } else {
            // No hero image: apply theme immediately
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        }
    };
    
    /**
     * Toggle between light and dark themes
     */
    const toggleTheme = () => {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    };
    
    // Load saved theme preference on page load
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    
    /**
     * Preload the opposite theme's hero image
     * This ensures instant image switching when theme changes
     * Runs after page load to avoid blocking initial render
     */
    const preloadThemeImage = () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const otherTheme = currentTheme === 'light' ? 'dark' : 'light';
        const imagePath = otherTheme === 'light' 
            ? 'assets/images/heros/white-rider-lg.jpg'
            : 'assets/images/heros/black-rider-lg.jpg';
        
        // Preload image in browser cache
        const img = new Image();
        img.src = imagePath;
    };
    
    // Preload after page is fully loaded (non-blocking)
    if (document.readyState === 'complete') {
        preloadThemeImage();
    } else {
        window.addEventListener('load', preloadThemeImage);
    }

    // Attach click handlers to all theme toggle buttons
    if (themeToggles && themeToggles.length > 0) {
        themeToggles.forEach(toggle => {
            if (toggle) {
                try {
                    toggle.addEventListener('click', toggleTheme);
                } catch (error) {
                    console.error('Error attaching theme toggle handler:', error);
                }
            }
        });
    }

    /* ========================================================================
     * 2️⃣.7 SCROLL-RESPONSIVE NAVIGATION
     * ========================================================================
     * Auto-hide/show navigation bar based on scroll direction
     * - Hides navbar when scrolling down (more screen space)
     * - Shows navbar when scrolling up (easy access to navigation)
     * - Always visible at top of page
     * - Uses requestAnimationFrame for smooth 60fps performance
     * 
     * Behavior:
     * - At top (scrollY === 0): Always visible
     * - Scrolling down: Hide instantly
     * - Scrolling up: Show after 450ms delay (prevents flicker)
     * - After 275px scroll: Navbar becomes "scrolled" state (styling change)
     */
    try {
        const siteHeader = safeQuery('.site-header');
        if (!siteHeader) {
            console.warn('Site header not found');
        } else {
        // Performance optimization: throttle scroll handler
        let ticking = false;
        
        // Track scroll state
        let lastScrollY = window.scrollY || window.pageYOffset;
        let showTimeout = null;        // Timeout for showing navbar when scrolling up
        let isScrolling = false;       // Track if user is actively scrolling
        let scrollStopTimeout = null;  // Timeout for detecting scroll stop
        
        // Configuration constants
        const fixedThreshold = 275;    // Navbar becomes fixed after this scroll distance (px)
        const showDelay = 450;         // Delay before showing navbar when scrolling up (ms)

        const handleScroll = () => {
            const scrollY = window.scrollY || window.pageYOffset;
            const scrollDelta = scrollY - lastScrollY;
            
            // Handle scrolled state (for styling changes) - only applies after fixed threshold
            if (scrollY > fixedThreshold) {
                siteHeader.classList.add('site-header--scrolled');
            } else {
                siteHeader.classList.remove('site-header--scrolled');
            }
            
            // At top of page (scrollY === 0): always show navbar, but allow it to hide when scrolling down starts
            if (scrollY === 0 && scrollDelta === 0) {
                // Only show when at top AND not scrolling
                siteHeader.classList.remove('site-header--hidden');
                if (showTimeout) {
                    clearTimeout(showTimeout);
                    showTimeout = null;
                }
                if (scrollStopTimeout) {
                    clearTimeout(scrollStopTimeout);
                    scrollStopTimeout = null;
                }
                isScrolling = false;
            } else {
                // Handle auto-hide/show behavior when not at exact top or when scrolling
                // Clear scroll stop timeout
                if (scrollStopTimeout) {
                    clearTimeout(scrollStopTimeout);
                    scrollStopTimeout = null;
                }
                
                // Determine scroll direction
                if (scrollDelta > 0) {
                    // Scrolling down: hide instantly (even at top)
                    if (showTimeout) {
                        clearTimeout(showTimeout);
                        showTimeout = null;
                    }
                    siteHeader.classList.add('site-header--hidden');
                    isScrolling = true;
                } else if (scrollDelta < 0) {
                    // Scrolling up: clear any existing show timeout and set new one with delay
                    if (showTimeout) {
                        clearTimeout(showTimeout);
                    }
                    showTimeout = setTimeout(() => {
                        siteHeader.classList.remove('site-header--hidden');
                        showTimeout = null;
                    }, showDelay);
                    isScrolling = true;
                }
                
                // Track when scrolling stops (do nothing when it stops, just keep current state)
                scrollStopTimeout = setTimeout(() => {
                    isScrolling = false;
                    scrollStopTimeout = null;
                    // Don't change navbar state when scroll stops - keep it as is
                }, 150);
            }
            
            lastScrollY = scrollY;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(handleScroll);
                ticking = true;
            }
        };

        // Handle initial state
        handleScroll();

            // Listen to scroll events (works for both desktop and touch devices)
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('touchmove', onScroll, { passive: true });
        }
    } catch (error) {
        console.error('Error initializing scroll-responsive navigation:', error);
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
    const nav = safeQuery('.nav');
    const burgerButton = safeQuery('.nav__burger');
    const overlay = safeQuery('.nav__overlay');
    const mobileMenu = safeQuery('.nav__mobile-menu');
    const mobileMenuLinks = safeQueryAll('.nav__mobile-menu .nav__link');
    
    /**
     * Sync mobile menu theme toggle with current theme
     * Ensures mobile theme toggle displays correct icon state
     * Currently handled by CSS, but function exists for future enhancements
     */
    const syncMobileTheme = () => {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const mobileThemeToggle = mobileMenu?.querySelector('.theme-toggle');
        
        if (mobileThemeToggle) {
            // Theme toggle icons are controlled by CSS based on data-theme attribute
            // No additional action needed as body data-theme already controls visibility
            // This function exists for potential future enhancements
        }
    };
    
    if (nav && burgerButton && overlay && mobileMenu) {
        let isMenuOpen = false;
        let previousFocus = null;
        
        const openMenu = () => {
            if (isMenuOpen) return;
            
            isMenuOpen = true;
            nav.setAttribute('data-menu-open', 'true');
            burgerButton.setAttribute('aria-expanded', 'true');
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Store previous focus
            previousFocus = document.activeElement;
            
            // Focus first focusable element in menu
            const firstFocusable = safeQuery('a, button, input, [tabindex]:not([tabindex="-1"])', mobileMenu);
            if (firstFocusable) {
                setTimeout(() => firstFocusable.focus(), 100);
            }
            
            // Sync theme on open
            syncMobileTheme();
        };
        
        const closeMenu = () => {
            if (!isMenuOpen) return;
            
            isMenuOpen = false;
            nav.setAttribute('data-menu-open', 'false');
            burgerButton.setAttribute('aria-expanded', 'false');
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            // Restore focus
            if (previousFocus) {
                previousFocus.focus();
                previousFocus = null;
            }
        };
        
        // Toggle menu on burger click
        burgerButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isMenuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Close menu on overlay click
        overlay.addEventListener('click', () => {
            closeMenu();
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenu();
            }
        });
        
        // Close menu when clicking on a link
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });
        
        // Close menu on resize if switching to desktop view
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 600 && isMenuOpen) {
                    closeMenu();
                }
            }, 100);
        });
        
        // Initial sync
        syncMobileTheme();
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
        const navLinks = safeQueryAll('.nav__link');
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Remove active state from all links first
            link.classList.remove('is-active');
            
            // Check if this link matches the current page
            // Handle both root "/" and "index.html" for home
            if ((currentPage === '' || currentPage === 'index.html' || currentPath === '/' || currentPath.endsWith('/')) && href === 'index.html') {
                link.classList.add('is-active');
            } else if (href === currentPage) {
                link.classList.add('is-active');
            }
        });
    };
    
    setActiveNavLink();

    /* ========================================================================
     * 4️⃣ FOOTER NEWSLETTER EMAIL VALIDATION
     * ========================================================================
     * Real-time email validation for newsletter subscription
     * - Validates email format as user types
     * - Enables/disables subscribe button based on validity
     * - Uses standard email regex pattern
     */
    const emailInput = safeQuery('.footer__email-input');
    const subscribeBtn = safeQuery('.footer__subscribe-btn');
    
    /**
     * Update subscribe button state based on email validity
     * Uses validateEmail from utils.js (must be loaded before main.js)
     */
    const updateSubscribeButton = () => {
        if (emailInput && subscribeBtn) {
            const email = emailInput.value.trim();
            // Use validateEmail from utils.js (global function)
            const isValid = window.validateEmail ? window.validateEmail(email) : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            subscribeBtn.disabled = !isValid;
        }
    };
    
    if (emailInput && subscribeBtn) {
        // Initially disable the button (no email entered)
        subscribeBtn.disabled = true;
        
        // Validate on input (real-time feedback)
        emailInput.addEventListener('input', updateSubscribeButton);
        
        // Validate on blur (when user leaves the field)
        emailInput.addEventListener('blur', updateSubscribeButton);
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
        const contactForm = document.getElementById('contact-form');
        const formMessages = document.getElementById('form-messages');
        const submitBtn = document.getElementById('submit-btn');
        
        // Formspree endpoint - replace with your actual endpoint
        // Get your endpoint from https://formspree.io/
        const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
        
        if (!contactForm || !formMessages || !submitBtn) {
            // Contact form not available on this page
        } else {
        const btnText = safeQuery('.btn__text', submitBtn);
        const btnSpinner = safeQuery('.btn__spinner', submitBtn);
        
        /**
         * Show message to user
         * @param {string} message - Message text
         * @param {string} type - 'success' or 'error'
         */
        const showMessage = (message, type) => {
            formMessages.textContent = message;
            formMessages.className = `form__messages form__messages--${type}`;
            formMessages.style.display = 'block';
            
            // Scroll to message
            formMessages.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Hide message after 5 seconds for errors, keep success visible
            if (type === 'error') {
                setTimeout(() => {
                    formMessages.style.display = 'none';
                }, 5000);
            }
        };
        
        /**
         * Show loading state
         */
        const showLoading = () => {
            submitBtn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnSpinner) btnSpinner.style.display = 'inline';
        };
        
        /**
         * Hide loading state
         */
        const hideLoading = () => {
            submitBtn.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (btnSpinner) btnSpinner.style.display = 'none';
        };
        
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Hide previous messages
            formMessages.style.display = 'none';
            
            // Validate form
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            showLoading();
            
            try {
                // Submit to Formspree or your backend
                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    // Success
                    showMessage('Thank you! Your message has been sent successfully.', 'success');
                    contactForm.reset();
                } else {
                    // Error from server
                    const errorData = await response.json().catch(() => ({}));
                    const errorMessage = errorData.error || 'There was an error sending your message. Please try again.';
                    showMessage(errorMessage, 'error');
                }
            } catch (error) {
                // Network or other error
                console.error('Form submission error:', error);
                showMessage('Unable to send message. Please check your connection and try again.', 'error');
            } finally {
                hideLoading();
            }
        });
        }
    } catch (error) {
        console.error('Error initializing contact form:', error);
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
        const newsletterForm = safeQuery('.footer__newsletter');
        const newsletterInput = safeQuery('.footer__email-input');
        const newsletterBtn = safeQuery('.footer__subscribe-btn');
        
        // Formspree endpoint for newsletter - replace with your actual endpoint
        const NEWSLETTER_ENDPOINT = 'https://formspree.io/f/YOUR_NEWSLETTER_FORM_ID';
        
        if (!newsletterForm || !newsletterInput || !newsletterBtn) {
            // Newsletter form not available on this page
        } else {
        // Create message container if it doesn't exist
        let newsletterMessage = safeQuery('.newsletter__message', newsletterForm);
        if (!newsletterMessage) {
            newsletterMessage = document.createElement('div');
            newsletterMessage.className = 'newsletter__message';
            newsletterMessage.setAttribute('role', 'alert');
            newsletterMessage.setAttribute('aria-live', 'polite');
            newsletterMessage.style.display = 'none';
            newsletterForm.insertBefore(newsletterMessage, newsletterInput);
        }
        
        /**
         * Show newsletter message
         * @param {string} message - Message text
         * @param {string} type - 'success' or 'error'
         */
        const showNewsletterMessage = (message, type) => {
            newsletterMessage.textContent = message;
            newsletterMessage.className = `newsletter__message newsletter__message--${type}`;
            newsletterMessage.style.display = 'block';
            
            // Hide message after 5 seconds for errors, keep success visible longer
            if (type === 'error') {
                setTimeout(() => {
                    newsletterMessage.style.display = 'none';
                }, 5000);
            } else {
                setTimeout(() => {
                    newsletterMessage.style.display = 'none';
                }, 10000);
            }
        };
        
        /**
         * Handle newsletter form submission
         */
        const handleNewsletterSubmit = async (e) => {
            e.preventDefault();
            
            const email = newsletterInput.value.trim();
            
            // Validate email
            const isValidEmail = window.validateEmail ? window.validateEmail(email) : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (email && isValidEmail) {
                // Show loading state
                newsletterBtn.disabled = true;
                const originalText = newsletterBtn.textContent;
                newsletterBtn.textContent = 'Subscribing...';
                
                try {
                    // Submit to Formspree or your backend
                    const response = await fetch(NEWSLETTER_ENDPOINT, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({ email: email })
                    });
                    
                    if (response.ok) {
                        // Success
                        showNewsletterMessage('Thank you! You have been subscribed successfully.', 'success');
                        newsletterInput.value = '';
                        newsletterBtn.disabled = true; // Keep disabled until new email entered
                    } else {
                        // Error from server
                        const errorData = await response.json().catch(() => ({}));
                        const errorMessage = errorData.error || 'There was an error subscribing. Please try again.';
                        showNewsletterMessage(errorMessage, 'error');
                        newsletterBtn.disabled = false;
                        newsletterBtn.textContent = originalText;
                    }
                } catch (error) {
                    // Network or other error
                    console.error('Newsletter subscription error:', error);
                    showNewsletterMessage('Unable to subscribe. Please check your connection and try again.', 'error');
                    newsletterBtn.disabled = false;
                    newsletterBtn.textContent = originalText;
                }
            } else {
                showNewsletterMessage('Please enter a valid email address.', 'error');
            }
        };
        
        // Handle form submission (when Enter is pressed in input)
        newsletterInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !newsletterBtn.disabled) {
                e.preventDefault();
                handleNewsletterSubmit(e);
            }
        });
        
            // Handle button click
            newsletterBtn.addEventListener('click', handleNewsletterSubmit);
        }
    } catch (error) {
        console.error('Error initializing newsletter subscription:', error);
    }
});
