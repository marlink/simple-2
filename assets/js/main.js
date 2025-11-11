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
 * - Contact page filtering
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

document.addEventListener('DOMContentLoaded', () => {
    /* ========================================================================
     * 1️⃣ FOOTER YEAR UPDATE
     * ========================================================================
     * Automatically updates the current year in the footer
     * Element must have id="year" to be updated
     */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ========================================================================
     * 2️⃣ THEME MANAGEMENT SYSTEM
     * ========================================================================
     * Handles light/dark theme switching with smooth transitions
     * - Persists theme preference in localStorage
     * - Smooth hero image fade transitions
     * - Preloads opposite theme image for instant switching
     */
    const themeToggles = document.querySelectorAll('.theme-toggle');
    
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
        const hero = document.querySelector('.hero');
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
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', toggleTheme);
    });

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
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
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
    const nav = document.querySelector('.nav');
    const burgerButton = document.querySelector('.nav__burger');
    const overlay = document.querySelector('.nav__overlay');
    const mobileMenu = document.querySelector('.nav__mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.nav__mobile-menu .nav__link');
    
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
            const firstFocusable = mobileMenu.querySelector('a, button, input, [tabindex]:not([tabindex="-1"])');
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
     * 3️⃣ CONTACT PAGE FILTER
     * ========================================================================
     * Simple client-side filtering for contact list
     * Filters list items in real-time as user types
     * Case-insensitive search
     */
    const filterInput = document.getElementById('filter-input');
    const filterList  = document.getElementById('filter-list');
    if (filterInput && filterList) {
        filterInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            // Show/hide list items based on search term
            [...filterList.children].forEach(li => {
                const txt = li.textContent.toLowerCase();
                if (txt.includes(term)) {
                    li.classList.remove('hidden');
                } else {
                    li.classList.add('hidden');
                }
            });
        });
    }

    /* ========================================================================
     * 3️⃣.5 ACTIVE NAVIGATION LINK HIGHLIGHTING
     * ========================================================================
     * Automatically highlights the current page's navigation link
     * Handles edge cases:
     * - Root path ("/") matches "index.html"
     * - Trailing slashes
     * - Different path formats
     */
    const setActiveNavLink = () => {
        const navLinks = document.querySelectorAll('.nav__link');
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
    const emailInput = document.querySelector('.footer__email-input');
    const subscribeBtn = document.querySelector('.footer__subscribe-btn');
    
    /**
     * Validate email format
     * @param {string} email - Email address to validate
     * @returns {boolean} - True if valid email format
     */
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    /**
     * Update subscribe button state based on email validity
     */
    const updateSubscribeButton = () => {
        if (emailInput && subscribeBtn) {
            const email = emailInput.value.trim();
            const isValid = validateEmail(email);
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
});
