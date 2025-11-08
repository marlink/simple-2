/* ===== Main site logic ===== */
document.addEventListener('DOMContentLoaded', () => {
    /* ---------- 1️⃣ Footer year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- 2️⃣ Theme toggle ---------- */
    const radios = document.querySelectorAll('input[name="theme"]');
    const labels = document.querySelectorAll('.theme-toggle__label');
    
    const applyTheme = (theme) => {
        // Smooth hero image transition using opacity fade
        const hero = document.querySelector('.hero');
        if (hero) {
            // Fade out
            hero.style.setProperty('--transition-opacity', '0');
            // Change theme after fade starts
            setTimeout(() => {
                document.body.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
                // Force reflow to ensure theme change is applied
                void hero.offsetHeight;
                // Fade back in
                setTimeout(() => {
                    hero.style.setProperty('--transition-opacity', '1');
                }, 10);
            }, 100);
        } else {
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        }
        // Update radio button states
        radios.forEach(radio => {
            radio.checked = (radio.value === theme);
        });
    };
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    const savedRadio = document.querySelector(`input[name="theme"][value="${savedTheme}"]`);
    if (savedRadio) savedRadio.checked = true;
    
    /* ---------- 2️⃣.5 Preload theme images ---------- */
    // Preload the other theme's hero image after page loads for smooth transitions
    const preloadThemeImage = () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const otherTheme = currentTheme === 'light' ? 'dark' : 'light';
        const imagePath = otherTheme === 'light' 
            ? 'assets/images/heros/white-rider-lg.jpg'
            : 'assets/images/heros/black-rider-lg.jpg';
        
        const img = new Image();
        img.src = imagePath;
    };
    
    // Preload after page is fully loaded
    if (document.readyState === 'complete') {
        preloadThemeImage();
    } else {
        window.addEventListener('load', preloadThemeImage);
    }

    // Change on radio input change
    radios.forEach(r => {
        r.addEventListener('change', (e) => {
            if (e.target.checked) {
                applyTheme(e.target.value);
            }
        });
    });
    
    // Also handle label clicks directly (fallback)
    labels.forEach(label => {
        label.addEventListener('click', (e) => {
            const inputId = label.getAttribute('for');
            if (inputId) {
                const input = document.getElementById(inputId);
                if (input && input.type === 'radio') {
                    input.checked = true;
                    applyTheme(input.value);
                }
            }
        });
    });

    /* ---------- 2️⃣.7 Scroll-responsive navigation ---------- */
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
        let ticking = false;
        let lastScrollY = window.scrollY || window.pageYOffset;
        let scrollTimeout = null;
        let lastScrollDirection = 0; // 1 = down, -1 = up, 0 = none
        const scrollThreshold = 10; // Small threshold to avoid flickering at exact top
        const fixedThreshold = 275; // Navbar becomes fixed after this scroll distance (250-300px range)
        const scrollStopDelay = 150; // Delay before showing navbar after scroll stops (when stopped)
        const scrollDownDelay = 450; // Delay before showing navbar if still scrolling downward

        const handleScroll = () => {
            const scrollY = window.scrollY || window.pageYOffset;
            const scrollDelta = scrollY - lastScrollY;
            
            // Handle scrolled state (for styling changes) - only applies after fixed threshold
            // Before fixedThreshold, navbar stays as part of the page (position: relative)
            if (scrollY > fixedThreshold) {
                siteHeader.classList.add('site-header--scrolled');
            } else {
                siteHeader.classList.remove('site-header--scrolled');
                // Always show navbar at top of page
                siteHeader.classList.remove('site-header--hidden');
                // Clear timeout when at top
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                    scrollTimeout = null;
                }
            }
            
            // Handle auto-hide behavior (only when scrolled past fixed threshold)
            // Before fixedThreshold, navbar stays as part of the page (position: relative)
            if (scrollY > fixedThreshold) {
                // Clear any existing timeout
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                    scrollTimeout = null;
                }
                
                // Determine scroll direction
                if (scrollDelta > 0) {
                    lastScrollDirection = 1; // Scrolling down
                    siteHeader.classList.add('site-header--hidden');
                } else if (scrollDelta < 0) {
                    lastScrollDirection = -1; // Scrolling up
                    siteHeader.classList.remove('site-header--hidden');
                }
                
                // Set timeout to show navbar after scroll stops
                // Use longer delay if last scroll was downward
                const delay = lastScrollDirection === 1 ? scrollDownDelay : scrollStopDelay;
                scrollTimeout = setTimeout(() => {
                    siteHeader.classList.remove('site-header--hidden');
                    scrollTimeout = null;
                }, delay);
            } else {
                // Before fixedThreshold, ensure navbar is always visible
                siteHeader.classList.remove('site-header--hidden');
                // Clear timeout when above threshold
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                    scrollTimeout = null;
                }
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

    /* ---------- 3️⃣ Simple filter on the contact page ---------- */
    const filterInput = document.getElementById('filter-input');
    const filterList  = document.getElementById('filter-list');
    if (filterInput && filterList) {
        filterInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
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

    /* ---------- 3️⃣.5 Set active navigation link based on current page ---------- */
    const setActiveNavLink = () => {
        const navLinks = document.querySelectorAll('.nav__link');
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Remove is-active from all links first
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

    /* ---------- 4️⃣ Footer newsletter email validation ---------- */
    const emailInput = document.querySelector('.footer__email-input');
    const subscribeBtn = document.querySelector('.footer__subscribe-btn');
    
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    const updateSubscribeButton = () => {
        if (emailInput && subscribeBtn) {
            const email = emailInput.value.trim();
            const isValid = validateEmail(email);
            subscribeBtn.disabled = !isValid;
        }
    };
    
    if (emailInput && subscribeBtn) {
        // Initially disable the button
        subscribeBtn.disabled = true;
        
        // Validate on input
        emailInput.addEventListener('input', updateSubscribeButton);
        
        // Validate on blur (when user leaves the field)
        emailInput.addEventListener('blur', updateSubscribeButton);
    }
});
