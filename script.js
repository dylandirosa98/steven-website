// ===========================
// Mobile Menu Toggle
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = mobileNav.contains(event.target) || hamburger.contains(event.target);
        if (!isClickInside && mobileNav.classList.contains('active')) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// ===========================
// Intersection Observer for Scroll Animations
// ===========================
const animationObserver = (function() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // If reduced motion is preferred, immediately show all animated elements
        const animatedElements = document.querySelectorAll('.nfd-wb-animate');
        animatedElements.forEach(element => {
            element.classList.add('nfd-wb-animated-in');
        });
        return;
    }

    // Create Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animated-in class when element is visible
                entry.target.classList.add('nfd-wb-animated-in');

                // Check if replay animation is enabled
                const replayAnimation = entry.target.dataset.replayAnimation;
                if (!replayAnimation) {
                    // Stop observing if no replay
                    observer.unobserve(entry.target);
                }
            } else {
                // If replay is enabled, remove the animation class when out of view
                const replayAnimation = entry.target.dataset.replayAnimation;
                if (replayAnimation) {
                    entry.target.classList.remove('nfd-wb-animated-in');
                }
            }
        });
    }, observerOptions);

    // Observe all elements with animation class
    const animatedElements = document.querySelectorAll('.nfd-wb-animate');
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    return observer;
})();

// ===========================
// Header Hide/Show on Scroll
// ===========================
(function() {
    let lastScrollTop = 0;
    const header = document.querySelector('.site-header');
    const scrollThreshold = 100;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (Math.abs(scrollTop - lastScrollTop) < scrollThreshold) {
            return;
        }

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
    });
})();

// ===========================
// Lazy Loading Images
// ===========================
(function() {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // If image has data-src, load it
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }

                    // Add loaded class
                    img.classList.remove('lazyload');
                    img.classList.add('lazyloaded');

                    // Stop observing
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });

        // Observe all lazy load images
        const lazyImages = document.querySelectorAll('.lazyload');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        const lazyImages = document.querySelectorAll('.lazyload');
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            img.classList.remove('lazyload');
            img.classList.add('lazyloaded');
        });
    }
})();

// ===========================
// Smooth Scroll for Anchor Links
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Skip if it's just "#"
        if (href === '#') {
            e.preventDefault();
            return;
        }

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();

            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// Portfolio Item Click Handler
// ===========================
document.querySelectorAll('.portfolio-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        // Get the image source
        const imgSrc = this.querySelector('.portfolio-image').src;

        // Create lightbox (basic example)
        createLightbox(imgSrc);
    });
});

// ===========================
// Simple Lightbox Function
// ===========================
function createLightbox(imageSrc) {
    // Create lightbox container
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
        animation: fadeIn 300ms ease;
    `;

    // Create image
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90vh;
        object-fit: contain;
        animation: zoomIn 300ms ease;
    `;

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 30px;
        color: white;
        font-size: 40px;
        background: none;
        border: none;
        cursor: pointer;
        z-index: 10001;
        transition: opacity 300ms ease;
    `;

    closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '0.7');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '1');

    // Close lightbox on click
    lightbox.addEventListener('click', function() {
        lightbox.style.animation = 'fadeOut 300ms ease';
        setTimeout(() => lightbox.remove(), 300);
    });

    // Prevent image click from closing lightbox
    img.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes zoomIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    lightbox.appendChild(img);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);
}

// ===========================
// Parallax Effect on Hero Image
// ===========================
(function() {
    const heroImage = document.querySelector('.hero-image');

    if (heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;

            if (scrolled < window.innerHeight) {
                heroImage.style.transform = `translateY(${scrolled * parallaxSpeed}px) scale(${1 + scrolled * 0.0001})`;
            }
        });
    }
})();

// ===========================
// Add Active State to Navigation
// ===========================
(function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a, .mobile-menu a');

    window.addEventListener('scroll', function() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
})();

// ===========================
// Performance: Debounce Scroll Events
// ===========================
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Log that scripts are loaded
console.log('Tiba Photography - Scripts Loaded Successfully');
