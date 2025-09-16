document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL ELEMENTS ---
    const body = document.body;
    const mainHeader = document.getElementById('main-header');
    const backToTopButton = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('main section[id]');
    const allNavLinks = document.querySelectorAll('#main-nav-desktop a, .sidebar-nav a');

    // --- DYNAMIC FAVICON FROM DISCORD ---
    const setDynamicFavicon = async () => {
        const favicon = document.getElementById('dynamic-favicon');
        if (!favicon) return;

        // Your Discord User ID.
        // This is used to fetch your profile avatar.
        const DISCORD_USER_ID = '804361392344793119';
        const fallbackIcon = 'assets/images/profile.jpg'; // Default icon if API fails

        try {
            // Using Lanyard API to fetch Discord user data
            const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
            if (!response.ok) throw new Error('Lanyard API request failed');

            const { data } = await response.json();

            if (data && data.discord_user && data.discord_user.avatar) {
                const avatarHash = data.discord_user.avatar;
                const avatarUrl = `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${avatarHash}.png?size=128`;
                favicon.href = avatarUrl;
            } else {
                favicon.href = fallbackIcon;
            }
        } catch (error) {
            console.error("Failed to fetch Discord avatar, using fallback icon.", error);
            favicon.href = fallbackIcon;
        }
    };

    setDynamicFavicon(); // Call the function to set the favicon on page load


    // --- LOADER ---
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
                body.classList.remove('loading');
            }, 300);
        }
    });

    // --- HEADER, SCROLLSPY, & BACK-TO-TOP ---
    const handleScroll = () => {
        const scrollPosition = window.scrollY;

        if (mainHeader) {
            if (scrollPosition > 50) mainHeader.classList.add('scrolled');
            else mainHeader.classList.remove('scrolled');
        }

        if (backToTopButton) {
            if (scrollPosition > 300) backToTopButton.classList.add('visible');
            else backToTopButton.classList.remove('visible');
        }

        let currentSectionId = '';
        const offset = mainHeader ? mainHeader.offsetHeight + 40 : 110;
        sections.forEach(section => {
            if (scrollPosition >= section.offsetTop - offset) {
                currentSectionId = section.getAttribute('id');
            }
        });

        allNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}` && !link.classList.contains('contact-trigger')) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // --- SIDEBAR ---
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const openSidebarBtn = document.getElementById('sidebar-menu-toggle');
    const closeSidebarBtn = document.getElementById('sidebar-close-button');

    const toggleSidebar = () => {
        if (sidebar) sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('active');
        body.classList.toggle('sidebar-open');
    };

    if (openSidebarBtn) openSidebarBtn.addEventListener('click', toggleSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (sidebar && sidebar.classList.contains('open')) {
                toggleSidebar();
            }
        });
    });

    // --- SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.length > 1 && !this.classList.contains('contact-trigger')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const headerOffset = mainHeader ? mainHeader.offsetHeight : 70;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        });
    });

    // --- CUSTOM CURSOR ---
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorCircle = document.querySelector('.custom-cursor-circle');
    if (window.matchMedia("(pointer: fine)").matches) {
        let mouseX = 0, mouseY = 0, dotX = 0, dotY = 0, circleX = 0, circleY = 0;
        window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

        const animateCursor = () => {
            dotX += (mouseX - dotX) / 4;
            dotY += (mouseY - dotY) / 4;
            circleX += (mouseX - circleX) / 8;
            circleY += (mouseY - circleY) / 8;
            if (cursorDot) cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
            if (cursorCircle) cursorCircle.style.transform = `translate(${circleX}px, ${circleY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        document.addEventListener('mousedown', () => cursorCircle?.classList.add('clicking'));
        document.addEventListener('mouseup', () => cursorCircle?.classList.remove('clicking'));

        document.querySelectorAll('a, button, input, textarea, [role="button"]').forEach(el => {
            el.addEventListener('mouseenter', () => cursorCircle?.classList.add('link-hover'));
            el.addEventListener('mouseleave', () => cursorCircle?.classList.remove('link-hover'));
        });
    }



    // --- CONTACT MODAL ---
    const contactModal = document.getElementById('contact-modal');
    const openModalTriggers = document.querySelectorAll('.contact-trigger');
    const closeModalButton = document.getElementById('modal-close-button');

    const openModal = (e) => {
        e.preventDefault();
        if (contactModal) {
            contactModal.classList.add('visible');
            body.classList.add('modal-open');
        }
    };
    const closeModal = () => {
        if (contactModal) {
            contactModal.classList.remove('visible');
            body.classList.remove('modal-open');
        }
    };

    openModalTriggers.forEach(trigger => trigger.addEventListener('click', openModal));
    if (closeModalButton) closeModalButton.addEventListener('click', closeModal);
    if (contactModal) contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) closeModal();
    });

    // --- FORM SUBMISSION ---
    const contactForm = document.getElementById('contactForm');
    const submitButton = document.getElementById('submitButton');
    const messageModal = document.getElementById('message-modal');

    function showMessage(title, text, type = 'info') {
        const messageModalTitle = document.getElementById('message-modal-title');
        const messageModalText = document.getElementById('message-modal-text');
        if (!messageModal || !messageModalTitle || !messageModalText) return;
        messageModalTitle.textContent = title;
        messageModalText.textContent = text;
        messageModal.className = '';
        if (type) messageModal.classList.add(type);
        messageModal.style.display = 'flex';
    }
    const messageModalClose = document.getElementById('message-modal-close');
    if (messageModalClose) messageModalClose.addEventListener('click', () => messageModal.style.display = 'none');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const originalButtonHTML = submitButton.innerHTML;
            submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
            submitButton.disabled = true;

            try {
                const response = await fetch("https://formspree.io/f/xyzjgpdl", {
                    method: 'POST', body: formData, headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    closeModal();
                    showMessage('Success!', 'Your message has been sent. Thank you!', 'success');
                    contactForm.reset();
                } else {
                    throw new Error(`Server responded with status: ${response.status}`);
                }
            } catch (error) {
                showMessage('Error', 'Could not send message. Please try again later.', 'error');
                console.error("Form submission error:", error);
            } finally {
                submitButton.innerHTML = originalButtonHTML;
                submitButton.disabled = false;
            }
        });
    }

    // --- Intersection Observer for Animations ---
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .about-text, #discord-widget-container');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // --- FOOTER YEAR ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // --- DISCORD WIDGET RESIZING ---
    window.addEventListener('message', (event) => {
        // Ensure the message is from the correct origin and contains the expected data
        if (event.origin !== 'https://cubezockii.github.io' || !event.data || event.data.type !== 'resize-widget') {
            return;
        }

        const { height, width } = event.data;
        const iframe = document.getElementById('discord-widget-iframe');
        if (iframe) {
            iframe.style.height = `${height}px`;
            iframe.style.width = `${width}px`;
        }
    });

});