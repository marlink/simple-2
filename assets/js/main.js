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


    /* ---------- 3️⃣ Simple filter on the contact page ---------- */
    const filterInput = document.getElementById('filter-input');
    const filterList  = document.getElementById('filter-list');
    if (filterInput && filterList) {
        filterInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            [...filterList.children].forEach(li => {
                const txt = li.textContent.toLowerCase();
                li.style.display = txt.includes(term) ? '' : 'none';
            });
        });
    }

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
