/**
 * showcase.js - Optimized JavaScript for showcase page
 * Handles viewport info, carousel, tabs, and all interactive components
 * Performance optimized with throttling and error handling
 */

(function () {
    "use strict";

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    /**
     * Throttle function - limits function execution frequency
     */
    function throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }

    /**
     * Debounce function - delays function execution until after wait time
     */
    function debounce(func, wait) {
        let timeout;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    /**
     * Safe querySelector with error handling
     */
    function safeQuery(selector, context = document) {
        try {
            return context.querySelector(selector);
        } catch (e) {
            console.warn("Invalid selector:", selector, e);
            return null;
        }
    }

    /**
     * Safe querySelectorAll with error handling
     */
    function safeQueryAll(selector, context = document) {
        try {
            return Array.from(context.querySelectorAll(selector));
        } catch (e) {
            console.warn("Invalid selector:", selector, e);
            return [];
        }
    }

    // ============================================
    // VIEWPORT INFO (Optimized)
    // ============================================

    const ViewportInfo = {
        element: null,
        widthSpan: null,
        breakpointSpan: null,
        scrollTimeout: null,
        isHidden: false,

        init() {
            this.element = safeQuery("#viewport-info");
            if (!this.element) return;

            this.widthSpan = safeQuery("#viewport-width", this.element);
            this.breakpointSpan = safeQuery("#breakpoint", this.element);

            if (!this.widthSpan || !this.breakpointSpan) return;

            // Throttled update function (max once per 100ms)
            const updateThrottled = throttle(() => {
                this.update();
            }, 100);

            // Initial update
            this.update();

            // Throttled resize listener
            window.addEventListener("resize", updateThrottled, { passive: true });

            // Debounced scroll handler (500ms delay)
            const handleScrollDebounced = debounce(() => {
                this.hide();
                this.scrollTimeout = setTimeout(() => {
                    this.show();
                }, 500);
            }, 50);

            window.addEventListener("scroll", handleScrollDebounced, { passive: true });
        },

        update() {
            if (!this.widthSpan || !this.breakpointSpan) return;

            const width = window.innerWidth;
            this.widthSpan.textContent = width + "px";

            let breakpoint = "XS";
            if (width >= 2400) breakpoint = "XXXL";
            else if (width >= 1600) breakpoint = "XXL";
            else if (width >= 1280) breakpoint = "XL";
            else if (width >= 1024) breakpoint = "LG";
            else if (width >= 768) breakpoint = "MD";
            else if (width >= 600) breakpoint = "SM";

            this.breakpointSpan.textContent = breakpoint;
        },

        hide() {
            if (this.element && !this.isHidden) {
                this.element.classList.add("viewport-info--hidden");
                this.isHidden = true;
            }
        },

        show() {
            if (this.element && this.isHidden) {
                this.element.classList.remove("viewport-info--hidden");
                this.isHidden = false;
            }
        },
    };

    // ============================================
    // CAROUSEL (Optimized)
    // ============================================

    const Carousel = {
        instances: new Map(),

        init(carouselId) {
            const carousel = safeQuery(`#${carouselId}`);
            if (!carousel) {
                console.warn(`Carousel not found: ${carouselId}`);
                return;
            }

            // Prevent double initialization
            if (this.instances.has(carouselId)) {
                return;
            }

            try {
                const track = safeQuery(".carousel__track", carousel);
                const slides = safeQueryAll(".carousel__slide", carousel);
                const prevBtn = safeQuery("[data-carousel-prev]", carousel);
                const nextBtn = safeQuery("[data-carousel-next]", carousel);
                const indicators = safeQuery(".carousel__indicators", carousel);
                const isVertical = carousel.classList.contains("carousel--vertical");
                const isHorizontal = carousel.classList.contains("carousel--horizontal");

                if (!track || !slides.length) {
                    console.warn(`Carousel ${carouselId} missing track or slides`);
                    return;
                }

                let currentIndex = 0;

                const instance = {
                    carousel,
                    track,
                    slides,
                    prevBtn,
                    nextBtn,
                    indicators,
                    isVertical,
                    isHorizontal,
                    currentIndex,
                    totalSlides: slides.length,
                };

                this.instances.set(carouselId, instance);
                this.setupControls(instance);
                this.updateCarousel(instance);
                this.setupIndicators(instance);
                this.setupKeyboard(instance);
                this.setupIntersectionObserver(instance);
            } catch (e) {
                console.error(`Error initializing carousel ${carouselId}:`, e);
            }
        },

        setupControls(instance) {
            const { prevBtn, nextBtn, carouselId } = instance;

            if (prevBtn) {
                prevBtn.addEventListener("click", () => {
                    this.prevSlide(instance.carousel.id);
                });
                prevBtn.setAttribute("tabindex", "0");
            }

            if (nextBtn) {
                nextBtn.addEventListener("click", () => {
                    this.nextSlide(instance.carousel.id);
                });
                nextBtn.setAttribute("tabindex", "0");
            }
        },

        setupIndicators(instance) {
            const { indicators, totalSlides } = instance;
            if (!indicators) return;

            indicators.innerHTML = "";
            for (let i = 0; i < totalSlides; i++) {
                const indicator = document.createElement("button");
                indicator.className = "carousel__indicator";
                indicator.setAttribute("aria-label", `Go to slide ${i + 1}`);
                indicator.setAttribute("data-slide", i);
                indicator.addEventListener("click", () => {
                    this.goToSlide(instance.carousel.id, i);
                });
                indicators.appendChild(indicator);
            }
        },

        setupKeyboard(instance) {
            const { carousel, isVertical } = instance;
            carousel.setAttribute("tabindex", "0");
            carousel.setAttribute("role", "region");
            carousel.setAttribute("aria-label", "Carousel");

            carousel.addEventListener("keydown", (e) => {
                if (e.key === "ArrowLeft" && !isVertical) {
                    e.preventDefault();
                    this.prevSlide(carousel.id);
                } else if (e.key === "ArrowRight" && !isVertical) {
                    e.preventDefault();
                    this.nextSlide(carousel.id);
                } else if (e.key === "ArrowUp" && isVertical) {
                    e.preventDefault();
                    this.prevSlide(carousel.id);
                } else if (e.key === "ArrowDown" && isVertical) {
                    e.preventDefault();
                    this.nextSlide(carousel.id);
                }
            });
        },

        setupIntersectionObserver(instance) {
            const { carousel, isHorizontal } = instance;
            if (!isHorizontal || !("IntersectionObserver" in window)) return;

            try {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                carousel.classList.add("is-in-viewport");
                            } else {
                                carousel.classList.remove("is-in-viewport");
                            }
                        });
                    },
                    {
                        threshold: 0.1,
                        rootMargin: "0px",
                    }
                );

                observer.observe(carousel);
                instance.observer = observer; // Store for cleanup if needed
            } catch (e) {
                console.warn("IntersectionObserver not supported:", e);
            }
        },

        updateCarousel(instance) {
            const { track, slides, currentIndex, isVertical, indicators } = instance;
            const totalSlides = slides.length;

            if (currentIndex < 0) {
                instance.currentIndex = totalSlides - 1;
            } else if (currentIndex >= totalSlides) {
                instance.currentIndex = 0;
            }

            const offset = isVertical ? -instance.currentIndex * 100 : -instance.currentIndex * 100;

            track.style.transform = isVertical
                ? `translateY(${offset}%)`
                : `translateX(${offset}%)`;

            // Update indicators
            if (indicators) {
                const indicatorButtons = safeQueryAll(".carousel__indicator", indicators);
                indicatorButtons.forEach((btn, i) => {
                    if (i === instance.currentIndex) {
                        btn.classList.add("is-active");
                        btn.setAttribute("aria-current", "true");
                    } else {
                        btn.classList.remove("is-active");
                        btn.removeAttribute("aria-current");
                    }
                });
            }

            // Update button states
            if (instance.prevBtn) {
                instance.prevBtn.disabled = false;
            }
            if (instance.nextBtn) {
                instance.nextBtn.disabled = false;
            }
        },

        nextSlide(carouselId) {
            const instance = this.instances.get(carouselId);
            if (!instance) return;
            instance.currentIndex++;
            this.updateCarousel(instance);
        },

        prevSlide(carouselId) {
            const instance = this.instances.get(carouselId);
            if (!instance) return;
            instance.currentIndex--;
            this.updateCarousel(instance);
        },

        goToSlide(carouselId, index) {
            const instance = this.instances.get(carouselId);
            if (!instance) return;
            instance.currentIndex = index;
            this.updateCarousel(instance);
        },
    };

    // ============================================
    // TAB SWITCHING (Optimized)
    // ============================================

    const TabSwitcher = {
        init() {
            const tabs = safeQueryAll(".showcase-tabs .tab");
            tabs.forEach((tab) => {
                tab.addEventListener("click", (e) => {
                    e.preventDefault();
                    const tabName = tab.getAttribute("data-tab");
                    if (tabName) {
                        this.switchTab(tabName);
                    }
                });
            });
        },

        switchTab(tabName) {
            try {
                // Hide all panels
                safeQueryAll(".tab__panel").forEach((panel) => {
                    panel.hidden = true;
                    panel.classList.remove("is-active");
                });

                // Remove active from all tabs
                safeQueryAll(".showcase-tabs .tab").forEach((tab) => {
                    tab.classList.remove("is-active");
                    tab.setAttribute("aria-selected", "false");
                });

                // Show selected panel
                const panel = safeQuery(`#tab-${tabName}`);
                const tabBtn = safeQuery(`#tab-btn-${tabName}`);

                if (panel && tabBtn) {
                    panel.hidden = false;
                    panel.classList.add("is-active");
                    tabBtn.classList.add("is-active");
                    tabBtn.setAttribute("aria-selected", "true");

                    // Update photo counter display when photos tab is opened
                    if (tabName === "photos") {
                        // Small delay to ensure DOM is ready
                        setTimeout(() => {
                            if (PhotoCounter) {
                                // Only update display, don't re-initialize (prevents double-counting)
                                if (PhotoCounter.isInitialized) {
                                    PhotoCounter.updateCounters();
                                } else {
                                    // First time opening - initialize
                                    PhotoCounter.init();
                                }
                            }
                        }, 100);
                    }

                    // Smooth scroll to top of main content
                    const main = safeQuery("main");
                    if (main) {
                        main.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                }
            } catch (e) {
                console.error("Error switching tab:", e);
            }
        },
    };

    // Make switchTab available globally for onclick handlers
    window.switchTab = (tabName) => TabSwitcher.switchTab(tabName);

    // ============================================
    // SLIDER VALUE UPDATES
    // ============================================

    const SliderUpdates = {
        init() {
            const sliders = [
                { id: "slider-volume", valueId: "volume-value" },
                { id: "slider-brightness", valueId: "brightness-value" },
                { id: "slider-lg-1", valueId: "opacity-value" },
                { id: "slider-lg-2", valueId: "speed-value" },
            ];

            sliders.forEach(({ id, valueId }) => {
                const slider = safeQuery(`#${id}`);
                const valueDisplay = safeQuery(`#${valueId}`);
                if (slider && valueDisplay) {
                    slider.addEventListener("input", (e) => {
                        valueDisplay.textContent = e.target.value;
                    });
                }
            });
        },
    };

    // ============================================
    // PHOTO COUNTER (Inspired by Cursor Settings)
    // ============================================

    const PhotoCounter = {
        photosLoaded: 0,
        imagesProcessed: 0,
        storageUsed: 0, // in MB
        isInitialized: false, // Flag to prevent double initialization

        // Animate number from current to target
        animateValue(element, start, end, duration = 1000, suffix = "") {
            if (!element) return;

            const startTime = performance.now();
            const isNumber = typeof end === "number";

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function (ease-out)
                const easeOut = 1 - Math.pow(1 - progress, 3);

                if (isNumber) {
                    const current = Math.floor(start + (end - start) * easeOut);
                    element.textContent = current + suffix;
                } else {
                    element.textContent = end;
                }

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.textContent = end + suffix;
                }
            };

            requestAnimationFrame(animate);
        },

        updateCounters() {
            const photosEl = safeQuery("#photos-consumed");
            const imagesEl = safeQuery("#images-processed");
            const storageEl = safeQuery("#storage-used");

            if (photosEl) {
                const current = parseInt(photosEl.textContent) || 0;
                this.animateValue(photosEl, current, this.photosLoaded, 600);
            }

            if (imagesEl) {
                const current = parseInt(imagesEl.textContent) || 0;
                this.animateValue(imagesEl, current, this.imagesProcessed, 600);
            }

            if (storageEl) {
                const current = parseFloat(storageEl.textContent) || 0;
                this.animateValue(storageEl, current, this.storageUsed.toFixed(1), 600, " MB");
            }
        },

        init() {
            // Prevent double initialization - only initialize once
            if (this.isInitialized) {
                // If already initialized, just update the display
                this.updateCounters();
                return;
            }

            // Reset counters before counting
            this.photosLoaded = 0;
            this.imagesProcessed = 0;
            this.storageUsed = 0;

            // Count existing images in gallery
            const galleryImages = safeQueryAll(".photo-gallery img");
            let loadedCount = 0;

            galleryImages.forEach((img, index) => {
                if (img.complete && img.naturalHeight !== 0) {
                    loadedCount++;
                    this.photosLoaded++;
                    this.imagesProcessed++;
                    // Estimate ~0.5MB per image
                    this.storageUsed += 0.5;
                } else {
                    img.addEventListener(
                        "load",
                        () => {
                            this.photosLoaded++;
                            this.imagesProcessed++;
                            this.storageUsed += 0.5;
                            this.updateCounters();
                        },
                        { once: true }
                    );
                }
            });

            // Mark as initialized
            this.isInitialized = true;

            if (loadedCount > 0) {
                this.updateCounters();
            }
        },
    };

    // Note: updatePhotoCounter() global function removed
    // Image loading is now handled exclusively by the event listeners in PhotoCounter.init()
    // This prevents double-counting from HTML onload attributes

    // ============================================
    // INITIALIZATION
    // ============================================

    document.addEventListener("DOMContentLoaded", () => {
        try {
            // Initialize viewport info
            ViewportInfo.init();

            // Initialize tabs
            TabSwitcher.init();

            // Initialize carousels
            Carousel.init("carousel-horizontal");
            Carousel.init("carousel-vertical");

            // Initialize slider updates
            SliderUpdates.init();

            // Initialize photo counter
            PhotoCounter.init();
        } catch (e) {
            console.error("Error during showcase initialization:", e);
        }
    });
})();
