/**
 * Main JavaScript file for portfolio website interactivity.
 * Handles loader, header scrolling, sidebar navigation, active link highlighting,
 * back-to-top button, scroll indicator, project video previews,
 * intersection observer animations, current year update, smooth scrolling,
 * and custom cursor effects.
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selections ---
    const loader = document.getElementById('loader');
    const mainHeader = document.getElementById('main-header');
    const sidebarMenuToggle = document.getElementById('sidebar-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarCloseButton = document.getElementById('sidebar-close-button');
    const overlay = document.getElementById('overlay');
    const desktopNavLinks = document.querySelectorAll('#main-nav-desktop a[href^="#"]'); // More specific selector
    const sidebarNavLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]'); // More specific selector
    const allNavLinks = [...desktopNavLinks, ...sidebarNavLinks];
    const backToTopButton = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('main section[id]'); // Sections for scroll spying
    const currentYearSpan = document.getElementById('current-year');
    const scrollDownIndicator = document.querySelector('.scroll-down-indicator');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorCircle = document.querySelector('.custom-cursor-circle');
    const projectCards = document.querySelectorAll('.project-card');
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right'); // For Intersection Observer

    // --- State Variables ---
    let scrolledPastHero = false; // For scroll down indicator logic
    const SCROLL_OFFSET_FOR_HEADER = 50; // Pixels to scroll before header changes
    const SCROLL_OFFSET_FOR_BACK_TO_TOP = 300; // Pixels to scroll before back-to-top appears
    const INTERSECTION_OBSERVER_THRESHOLD = 0.15; // Percentage of element visible to trigger animation

    // --- Initial Setup ---
    if (document.body) { // Ensure body exists
        document.body.classList.add('loading');
    }

    // --- Loader ---
    window.addEventListener('load', () => {
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
                if (document.body) {
                    document.body.classList.remove('loading');
                }
            }, 300); // Small delay for smoother transition
        }
    });

    // --- Header Scroll Behavior ---
    const handleHeaderScroll = () => {
        if (mainHeader) {
            if (window.scrollY > SCROLL_OFFSET_FOR_HEADER) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        }
    };

    // --- Sidebar Functionality ---
    const openSidebar = () => {
        if (sidebar) sidebar.classList.add('open');
        if (overlay) overlay.classList.add('active');
        if (document.body) document.body.classList.add('sidebar-open'); // Prevent body scroll
    };

    const closeSidebar = () => {
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        if (document.body) document.body.classList.remove('sidebar-open');
    };

    if (sidebarMenuToggle) {
        sidebarMenuToggle.addEventListener('click', openSidebar);
    }
    if (sidebarCloseButton) {
        sidebarCloseButton.addEventListener('click', closeSidebar);
    }
    if (overlay) {
        overlay.addEventListener('click', closeSidebar); // Close sidebar if overlay is clicked
    }

    // Close sidebar when a nav link is clicked
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (sidebar && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        });
    });

    // --- Active Navigation Link Highlighting (Scrollspy) ---
    const updateActiveNavLink = () => {
        if (!mainHeader || sections.length === 0) return; // Guard clause

        let currentSectionId = '';
        const headerHeight = mainHeader.offsetHeight;
        // Adjust offset: consider header height and a small buffer
        const offset = headerHeight + 40;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - offset) {
                currentSectionId = section.getAttribute('id');
            }
        });

        allNavLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            // Ensure href is not null and matches the pattern #sectionId
            if (href && href === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    // --- Back to Top Button Visibility ---
    const handleBackToTopButton = () => {
        if (backToTopButton) {
            if (window.scrollY > SCROLL_OFFSET_FOR_BACK_TO_TOP) {
                backToTopButton.classList.add('visible');
                backToTopButton.classList.remove('hidden'); // Explicitly remove hidden if using both
            } else {
                backToTopButton.classList.remove('visible');
                backToTopButton.classList.add('hidden'); // Explicitly add hidden
            }
        }
    };

    // --- Scroll Down Indicator Visibility (Hero Section) ---
    const handleScrollIndicator = () => {
        if (scrollDownIndicator) {
            const heroSection = document.getElementById('hero');
            if (!heroSection) return;

            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
            // Hide when scrolled past half of the hero section
            if (window.scrollY > heroBottom / 2) {
                if (!scrolledPastHero) {
                    scrollDownIndicator.classList.add('hidden-by-scroll');
                    scrolledPastHero = true;
                }
            } else {
                // Show if scrolled back up and it was previously hidden by scroll
                if (scrolledPastHero) {
                    scrollDownIndicator.classList.remove('hidden-by-scroll');
                    scrolledPastHero = false;
                }
            }
            // Ensure it's visible at the very top if not already hidden
            if (window.scrollY === 0 && !scrollDownIndicator.classList.contains('hidden-by-scroll')) {
                scrollDownIndicator.classList.remove('hidden-by-scroll'); // Should already be the case
                scrolledPastHero = false;
            }
        }
    };

    // --- Project Card Video Preview on Hover ---
    projectCards.forEach(card => {
        const video = card.querySelector('.project-video');
        const mediaContainer = card.querySelector('.project-media');

        if (video && mediaContainer) {
            mediaContainer.addEventListener('mouseenter', () => {
                video.play().catch(error => {
                    // Silently fail or log a less intrusive warning.
                    // Users might have autoplay blocked or other issues.
                    console.info("Video play attempt on hover:", error.message);
                });
                mediaContainer.classList.add('video-playing');
            });
            mediaContainer.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0; // Optional: Reset video to start
                mediaContainer.classList.remove('video-playing');
            });
        }
    });

    // --- Intersection Observer for Animations ---
    if (window.IntersectionObserver && animatedElements.length > 0) {
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: INTERSECTION_OBSERVER_THRESHOLD
        };

        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => animationObserver.observe(el));

        // Optional: Add fade-in to all sections that don't have specific animations
        sections.forEach((section) => {
            if (!section.classList.contains('fade-in') &&
                !section.classList.contains('slide-in-left') &&
                !section.classList.contains('slide-in-right') &&
                !section.classList.contains('visible') // Check if already made visible by other means
            ) {
                section.classList.add('fade-in'); // Add class for observer to pick up
                animationObserver.observe(section);
            }
        });

    } else {
        // Fallback for older browsers or if no elements to animate
        animatedElements.forEach(el => el.classList.add('visible'));
        sections.forEach(section => {
            if (!section.classList.contains('visible')) {
                section.classList.add('visible');
            }
        });
        console.info("IntersectionObserver not supported or no elements to animate with it. Elements made visible by default.");
    }


    // --- Update Current Year in Footer ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear().toString();
    }

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            // Check if it's a valid internal link (not just "#")
            if (hrefAttribute && hrefAttribute.startsWith("#") && hrefAttribute.length > 1) {
                try {
                    const targetElement = document.querySelector(hrefAttribute);
                    if (targetElement) {
                        e.preventDefault(); // Prevent default anchor jump

                        const headerOffset = mainHeader ? mainHeader.offsetHeight : 70; // Fallback offset
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                } catch (error) {
                    // Catch potential errors if querySelector fails with a bad href
                    console.warn('Smooth scroll target not found or selector is invalid:', hrefAttribute, error);
                }
            }
        });
    });

    // --- Custom Cursor Logic ---
    const customCursorDot = document.querySelector('.custom-cursor-dot');
    const customCursorCircle = document.querySelector('.custom-cursor-circle');

    if (customCursorDot && customCursorCircle) {
        let mouseX = 0, mouseY = 0;
        let dotX = 0, dotY = 0;
        let circleX = 0, circleY = 0;
        const dotDelay = 5;
        const circleDelay = 8;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            dotX += (mouseX - dotX) / dotDelay;
            dotY += (mouseY - dotY) / dotDelay;
            customCursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%) ${customCursorDot.classList.contains('text-mode') ? 'translateY(-2px)' : ''} ${customCursorDot.classList.contains('clicking') ? 'scale(0.5)' : ''}`;

            circleX += (mouseX - circleX) / circleDelay;
            circleY += (mouseY - circleY) / circleDelay;
            customCursorCircle.style.transform = `translate(${circleX}px, ${circleY}px) translate(-50%, -50%) ${customCursorCircle.classList.contains('text-mode') ? 'scale(0)' : ''} ${customCursorCircle.classList.contains('clicking') ? 'scale(0.7)' : ''}`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Mouse click effects
        document.addEventListener('mousedown', () => {
            customCursorDot.classList.add('clicking');
            customCursorCircle.classList.add('clicking');
        });

        document.addEventListener('mouseup', () => {
            customCursorDot.classList.remove('clicking');
            customCursorCircle.classList.remove('clicking');
        });

        // Hover effects for interactive elements
        const interactiveElements = document.querySelectorAll(
            'a, button, .clickable, input[type="submit"], input[type="button"], [role="button"], .submit-button, .form-input, .form-textarea'
        );

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (el.classList.contains('form-input') || el.classList.contains('form-textarea')) {
                    customCursorDot.classList.add('text-mode');
                    customCursorCircle.classList.add('text-mode');
                } else {
                    customCursorDot.classList.add('link-hover');
                    customCursorCircle.classList.add('link-hover');
                }
            });

            el.addEventListener('mouseleave', () => {
                customCursorDot.classList.remove('text-mode', 'link-hover');
                customCursorCircle.classList.remove('text-mode', 'link-hover');
            });
        });

    } else {
        console.warn('Custom cursor elements (.custom-cursor-dot or .custom-cursor-circle) not found. Cursor effects disabled.');
    }

// --- Initial Calls & Event Listeners for Scroll-Dependent Functions ---
const onScroll = () => {
    handleHeaderScroll();
    updateActiveNavLink();
    handleBackToTopButton();
    handleScrollIndicator();
};

// Call once on load
handleHeaderScroll();
updateActiveNavLink();
handleBackToTopButton();
handleScrollIndicator();

// Add scroll event listener
window.addEventListener('scroll', onScroll, { passive: true }); // Use passive listener for scroll performance

}); // End of DOMContentLoaded
