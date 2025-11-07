/* ===== Main site logic ===== */
document.addEventListener('DOMContentLoaded', () => {
    /* ---------- 1️⃣ Footer year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- 2️⃣ Theme toggle ---------- */
    const radios = document.querySelectorAll('input[name="theme"]');
    const labels = document.querySelectorAll('.theme-toggle__label');
    
    const applyTheme = (theme) => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
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

    /* ---------- 3️⃣ PHONE CTA – hide outside school hours ---------- */
    const phoneCta = document.getElementById('phone-cta');
    const phoneLink = phoneCta ? phoneCta.querySelector('a') : null;
    const SCHOOL_START = 9;   // 9 am
    const SCHOOL_END   = 17;  // 5 pm

    const isSchoolTime = () => {
        const now = new Date();
        const hour = now.getHours();
        return hour >= SCHOOL_START && hour < SCHOOL_END;
    };
    const togglePhoneVisibility = () => {
        if (!phoneCta) return;
        if (isSchoolTime()) {
            phoneCta.classList.remove('hidden');
            if (phoneLink) phoneLink.setAttribute('href', 'tel:+1234567890');
        } else {
            phoneCta.classList.add('hidden');
            if (phoneLink) phoneLink.setAttribute('href', 'index.html');
        }
    };
    togglePhoneVisibility();
    setInterval(togglePhoneVisibility, 60 * 1000);

    /* ---------- 4️⃣ Simple filter on the contact page ---------- */
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
});
