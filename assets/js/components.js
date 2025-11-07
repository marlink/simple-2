/**
 * components.js – tiny JS for tabs, accordion, modal, tooltips.
 * No framework – plain DOM API, uses data attributes.
 */
document.addEventListener('DOMContentLoaded', () => {

    /* ====================== TABS ====================== */
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

    /* ====================== ACCORDION ====================== */
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

    /* ====================== MODAL ====================== */
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

    /* ====================== TOOLTIP ====================== */
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
});
