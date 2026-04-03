document.addEventListener('DOMContentLoaded', () => {

    const loader = document.getElementById('loader');
    const progressBarFill = document.getElementById('loader-progress-fill');
    const body = document.body;

    const isTouchDevice = () => {
        return ('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0);
    };

    if (isTouchDevice()) {
        body.classList.add('touch-device');
    }

    if (loader && progressBarFill) {
        let currentProgress = 0;
        const totalTime = 15000;
        const intervalTime = 100;
        const steps = totalTime / intervalTime;
        const progressPerStep = 95 / steps;

        const progressInterval = setInterval(() => {
            currentProgress += progressPerStep;
            if (currentProgress >= 95) {
                currentProgress = 95;
                clearInterval(progressInterval);
            }
            progressBarFill.style.width = `${currentProgress}%`;
        }, intervalTime);

        window.addEventListener('load', () => {
            clearInterval(progressInterval);
            progressBarFill.style.width = '100%';

            setTimeout(() => {
                loader.classList.add('loader-hidden');

                body.classList.remove('loading-active');

                const typedOutputElement = document.getElementById('typed-output');
                if (typedOutputElement) {
                    new Typed(typedOutputElement, {
                        strings: ["a Creative Developer", "a Self-Taught Developer", "a Front-End Engineer", "From Germany", "a Frontend Specialist", "an Enthusiastic Learner", "a Problem Solver"],
                        typeSpeed: 70,
                        backSpeed: 40,
                        backDelay: 1500,
                        loop: true,
                        smartBackspace: true
                    });
                }
            }, 500);
        });
    }

    const backendURL = `http://n1.pulledtheirlife.support:2030/send-email`;

    const header = document.getElementById('header');
    if (header) {
        function scrollHeader() {
            if (window.scrollY >= 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        window.addEventListener('scroll', scrollHeader);
    }

    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('section-content')) {
                    entry.target.classList.add('show');
                }
                if (entry.target.classList.contains('skill-bar-fill')) {
                    entry.target.classList.add('filled');
                }
            }
        });
    }, {
        threshold: 0.15
    });

    const hiddenElements = document.querySelectorAll('.hidden.section-content');
    hiddenElements.forEach((el) => observer.observe(el));
    const skillBars = document.querySelectorAll('.skill-bar-fill.hidden');
    skillBars.forEach((el) => observer.observe(el));


    const sections = document.querySelectorAll('section[id]');
    function scrollActive() {
        const scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - (window.innerHeight * 0.4);
            const sectionId = current.getAttribute('id');
            const link = document.querySelector('.nav-link[href*=' + sectionId + ']');

            if (link) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    link.classList.add('active-link');
                } else {
                    link.classList.remove('active-link');
                }
            }
        });
    }
    window.addEventListener('scroll', scrollActive);

    const contactModal = document.getElementById('contact-modal');
    const openContactBtn = document.getElementById('open-contact-btn');
    const closeContactBtn = document.getElementById('close-contact-btn');

    const messageModal = document.getElementById('message-modal');
    const messageModalText = document.getElementById('message-modal-text');
    const messageModalIcon = document.getElementById('message-modal-icon');
    const closeMessageBtn = document.getElementById('close-message-btn');
    const closeMessageBtnAlt = document.getElementById('close-message-btn-alt');

    const contactForm = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-button');

    const openModal = (modal) => {
        if (!modal) return;
        modal.classList.add('show');
        document.body.classList.add('modal-open');
    };
    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
    };

    if (openContactBtn) {
        openContactBtn.addEventListener('click', () => openModal(contactModal));
    }
    if (closeContactBtn) {
        closeContactBtn.addEventListener('click', () => closeModal(contactModal));
    }
    if (closeMessageBtn) {
        closeMessageBtn.addEventListener('click', () => closeModal(messageModal));
    }
    if (closeMessageBtnAlt) {
        closeMessageBtnAlt.addEventListener('click', () => closeModal(messageModal));
    }

    // Modal Background Click close
    [contactModal, messageModal, document.getElementById('project-modal'), document.getElementById('skill-modal')].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        }
    });

    const showMessage = (success, message) => {
        messageModalText.textContent = message;
        messageModalIcon.className = success ? 'bx bx-check-circle success' : 'bx bx-error-circle error';
        openModal(messageModal);
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Save original button text and show loading state
            const originalButtonText = submitButton.innerText;
            submitButton.innerText = 'Sending...';
            submitButton.disabled = true;

            const formData = new FormData(contactForm);

            // Fetch using your new Python backend URL
            fetch(backendURL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(response => {
                    closeModal(contactModal);
                    if (response.ok) {
                        // Success case
                        showMessage(true, "Thank you! Your message has been sent successfully.");
                        contactForm.reset();
                    } else {
                        // Handle server errors (e.g., 500 Internal Server Error)
                        response.json().then(data => {
                            // Looks for "error" (Flask) or "detail" (FastAPI) in your Python JSON response
                            const errorMsg = data.error || data.detail || "Something went wrong on the server.";
                            showMessage(false, `Oops! ${errorMsg}`);
                        }).catch(() => {
                            // Fallback if the server doesn't return JSON
                            showMessage(false, "Oops! Something went wrong.");
                        });
                    }
                })
                .catch(error => {
                    // Handle network errors (e.g., your Python server isn't running)
                    closeModal(contactModal);
                    showMessage(false, "Network error. Please make sure the server is running.");
                    console.error("Fetch Error:", error);
                })
                .finally(() => {
                    // Reset button state
                    submitButton.innerText = originalButtonText;
                    submitButton.disabled = false;
                });
        });
    }

    // ==========================================
    // SKILL MODAL LOGIC
    // ==========================================
    const skillDescriptions = {
        "Python": "Python is a versatile, high-level programming language known for its readability. I use it primarily for backend development, API creation, and building powerful Discord bots.",
        "JavaScript": "JavaScript is the core language of the web. I use it to create highly dynamic and interactive front-end experiences like custom cursors, animations, and API integrations.",
        "Flask": "Flask is a lightweight WSGI web framework for Python. It allows me to spin up secure and scalable backend architectures quickly and easily.",
        "FastAPI": "FastAPI is a modern, ultra-fast web framework for Python. I use it when I need to build highly concurrent applications with automatic interactive API documentation.",
        "MongoDB": "MongoDB is a powerful NoSQL database that stores data in flexible, JSON-like documents. I use it for applications that require rapid iteration and scalable storage.",
        "MariaDB": "MariaDB is a fast and robust relational database. I implement it for structured data storage, ensuring high data integrity and complex querying capabilities.",
        "GitHub": "GitHub is my go-to developer platform. I use it for version control, managing my open-source projects, and collaborating securely.",
        "Nginx": "Nginx is a high-performance web server. I use it to serve my web applications, handle load balancing, and set up reverse proxies on my Linux servers.",
        "Linux": "Linux is the foundation of my infrastructure. I rely on it heavily for securely deploying, managing, and maintaining my web applications and services."
    };

    const skillModal = document.getElementById('skill-modal');
    const closeSkillBtn = document.getElementById('close-skill-btn');
    const arsenalItems = document.querySelectorAll('.arsenal-item');

    arsenalItems.forEach(item => {
        item.addEventListener('click', () => {
            const skillName = item.textContent.trim();
            const desc = skillDescriptions[skillName] || "More details about this skill are coming soon!";
            document.getElementById('skill-modal-title').textContent = skillName;
            document.getElementById('skill-modal-description').textContent = desc;
            openModal(skillModal);
        });
    });

    if (closeSkillBtn) {
        closeSkillBtn.addEventListener('click', () => closeModal(skillModal));
    }


    // ==========================================
    // DISCORD WIDGET LOGIC
    // ==========================================
    const userId = "804361392344793119";

    const colorThief = new ColorThief();
    const widgetContainer = document.getElementById('discord-widget-container');
    const widgetContent = document.getElementById('widget-content');
    const loaderOverlay = document.getElementById('loader-overlay');
    const bannerEl = document.getElementById('widget-banner');
    const avatarEl = document.getElementById('widget-avatar');
    const usernameEl = document.getElementById('widget-username');
    const discriminatorEl = document.getElementById('widget-discriminator');
    const statusEl = document.getElementById('widget-status');
    const aboutMeSection = document.getElementById('about-me-section');
    const aboutMeEl = document.getElementById('widget-about-me');
    const activitiesSection = document.getElementById('activities-section');
    const activitiesContainerEl = document.getElementById('activities-container');
    const statusIconEl = document.getElementById('status-icon');

    let timerInterval = null;
    let lastProfileUpdate = 0; // Tracks the last time we updated non-activity data
    let fetchTimeout = null; // Tracks the dynamic fetch loop

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const updateSpotifyTimers = (startTime, endTime, progressBar, elapsedText, remainingText) => {
        const now = new Date().getTime();
        const totalDuration = endTime - startTime;
        const elapsed = now - startTime;
        const remaining = endTime - now;

        if (elapsed >= totalDuration) {
            progressBar.style.width = '100%';
            elapsedText.textContent = formatTime(totalDuration);
            remainingText.textContent = formatTime(0);
            return;
        }

        const progressPercentage = (elapsed / totalDuration) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        elapsedText.textContent = formatTime(elapsed);
        remainingText.textContent = `-${formatTime(remaining > 0 ? remaining : 0)}`;
    };

    const updateBannerColor = () => {
        if (avatarEl.complete && avatarEl.naturalWidth > 0) {
            try {
                const palette = colorThief.getPalette(avatarEl, 2);
                if (palette && palette.length >= 2) {
                    const color1 = `rgb(${palette[0].join(',')})`;
                    const color2 = `rgb(${palette[1].join(',')})`;
                    bannerEl.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
                }
            } catch (e) {
                console.error("Error getting colors from avatar:", e);
                bannerEl.style.background = 'linear-gradient(135deg, var(--accent-light-blue), var(--accent-blue)';
            }
        } else {
            bannerEl.style.background = 'linear-gradient(135deg, var(--accent-light-blue), var(--accent-blue)';
        }
    };

    if (avatarEl) {
        avatarEl.addEventListener('load', updateBannerColor);
        avatarEl.addEventListener('error', () => {
            console.error("Failed to load avatar image.");
            updateBannerColor();
        });
    }

    const fetchDiscordData = async () => {
        let nextFetchDelay = 12000; // Default dynamic fetch set to 10 seconds

        try {
            const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
            if (!response.ok) {
                throw new Error(`Lanyard API responded with status ${response.status}`);
            }
            const data = await response.json();

            if (data.success && data.data) {
                const user = data.data.discord_user;
                const activities = data.data.activities;
                const status = data.data.discord_status;
                const aboutMe = data.data.kv?.about_me || data.data.about_me || (data.data.activities.find(act => act.type === 4) || {}).state || '';

                if (!usernameEl) return;

                const now = Date.now();
                
                // Only update heavy DOM elements (Profile Data) every 15 seconds to save resources
                if (now - lastProfileUpdate >= 15000) {
                    usernameEl.textContent = user.global_name || user.username;
                    discriminatorEl.textContent = `@${user.username}`;

                    const newAvatarSrc = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
                    if (avatarEl.src !== newAvatarSrc) {
                        avatarEl.src = newAvatarSrc;
                    } else if (!bannerEl.style.background) {
                        updateBannerColor();
                    }

                    statusEl.classList.remove('status-online', 'status-idle', 'status-dnd', 'status-offline');
                    statusIconEl.className = 'fas';
                    if (status === 'online') {
                        statusEl.classList.add('status-online');
                        statusIconEl.classList.add('fa-circle');
                    } else if (status === 'idle') {
                        statusEl.classList.add('status-idle');
                        statusIconEl.classList.add('fa-moon');
                    } else if (status === 'dnd') {
                        statusEl.classList.add('status-dnd');
                        statusIconEl.classList.add('fa-minus');
                    } else {
                        statusEl.classList.add('status-offline');
                        statusIconEl.classList.add('fa-circle');
                    }

                    if (aboutMe && aboutMe.trim().length > 0) {
                        aboutMeEl.textContent = aboutMe;
                        aboutMeSection.style.display = 'block';
                    } else {
                        aboutMeEl.textContent = "";
                        aboutMeSection.style.display = 'none';
                    }
                    
                    lastProfileUpdate = now;
                }

                // --- DYNAMIC FETCH LOGIC CALCULATION ---
                const spotifyActivity = activities.find(act => act.name === 'Spotify');
                if (spotifyActivity && spotifyActivity.timestamps) {
                    const remaining = spotifyActivity.timestamps.end - Date.now();
                    
                    // If the song ends before our next standard 10s interval...
                    if (remaining > 0 && remaining < 10000) {
                        // Wait for the song to finish, THEN wait exactly 3 more seconds
                        nextFetchDelay = remaining + 3000; 
                    }
                }

                // ALWAYS update activities on every tick
                activitiesContainerEl.innerHTML = '';
                activitiesSection.style.display = 'block';

                if (timerInterval) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                }

                if (activities.length > 0) {
                    activities.forEach(activity => {
                        if (activity.type === 4) return; // Skip Custom Status as it's handled in "About me"
                        
                        const activityCard = document.createElement('div');
                        activityCard.className = 'activity-card';
                        
                        let iconUrl = '';
                        // Pre-generate the fallback so we can use it in the onerror attribute
                        const encodedName = encodeURIComponent(activity.name || "App");
                        const fallbackIconUrl = `https://ui-avatars.com/api/?name=${encodedName}&background=141b25&color=30C5FF&size=128&bold=true`;

                        if (activity.assets && activity.assets.large_image) {
                            if (activity.assets.large_image.startsWith('spotify:')) {
                                iconUrl = `https://i.scdn.co/image/${activity.assets.large_image.substring(8)}`;
                            } else if (activity.assets.large_image.startsWith('mp:external/')) {
                                // External Discord Proxied image
                                iconUrl = `https://media.discordapp.net/external/${activity.assets.large_image.replace('mp:external/', '')}`;
                            } else {
                                // Standard Discord asset
                                iconUrl = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`;
                            }
                        } else if (activity.application_id) {
                            // If no rich presence image exists, fetch the official Application/Game icon via DCDN
                            iconUrl = `https://dcdn.dstn.to/app-icons/${activity.application_id}?size=128`;
                        } else {
                            // If there is no application ID at all, use the fallback
                            iconUrl = fallbackIconUrl;
                        }

                        const detailsLine = activity.details && activity.state ? activity.details : '';
                        const stateLine = activity.state || '';

                        // Notice the onerror handler added to the img tag!
                        activityCard.innerHTML = `
                            <div class="activity-icon-container">
                                <img class="activity-icon" src="${iconUrl}" onerror="this.onerror=null; this.src='${fallbackIconUrl}';" alt="Activity Icon">
                            </div>
                            <div class="activity-details">
                                <div class="activity-name">${activity.name || 'N/A'}</div>
                                <div class="small">${detailsLine || 'N/A'}</div>
                                <div class="activity-state">${stateLine || ''}</div>
                            </div>
                        `;

                        if (activity.name === 'Spotify' && activity.timestamps) {
                            const startTime = activity.timestamps.start;
                            const endTime = activity.timestamps.end;
                            const progressBarContainer = document.createElement('div');
                            progressBarContainer.className = 'spotify-progress-bar-container';
                            const progressBar = document.createElement('div');
                            progressBar.className = 'spotify-progress-bar';
                            progressBarContainer.appendChild(progressBar);

                            const timestampsEl = document.createElement('div');
                            timestampsEl.className = 'spotify-timestamps';
                            const elapsedText = document.createElement('span');
                            const remainingText = document.createElement('span');
                            timestampsEl.appendChild(elapsedText);
                            timestampsEl.appendChild(remainingText);

                            activityCard.querySelector('.activity-details').appendChild(progressBarContainer);
                            activityCard.querySelector('.activity-details').appendChild(timestampsEl);

                            updateSpotifyTimers(startTime, endTime, progressBar, elapsedText, remainingText);
                            timerInterval = setInterval(() => {
                                updateSpotifyTimers(startTime, endTime, progressBar, elapsedText, remainingText);
                            }, 1000);
                        }
                        activitiesContainerEl.appendChild(activityCard);
                    });
                } else {
                    const noActivities = document.createElement('div');
                    noActivities.className = 'about-me-content';
                    noActivities.textContent = "Not currently doing any public activities.";
                    activitiesContainerEl.appendChild(noActivities);
                }
            }
        } catch (error) {
            console.error("Failed to fetch Discord data:", error);
            if (activitiesSection) activitiesSection.style.display = 'none';
            if (aboutMeSection) aboutMeSection.style.display = 'none';
        } finally {
            if (loaderOverlay) loaderOverlay.style.display = 'none';
            if (widgetContent) widgetContent.style.display = 'block';
            if (widgetContainer) widgetContainer.classList.add('visible');

            // --- RECURSIVE TIMEOUT TRIGGER ---
            clearTimeout(fetchTimeout);
            fetchTimeout = setTimeout(fetchDiscordData, nextFetchDelay);
        }
    };

    if (widgetContainer) {
        fetchDiscordData();

        const widgetObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    widgetObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        widgetObserver.observe(widgetContainer);
    }

    // ==========================================
    // CURSOR LOGIC
    // ==========================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');
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

        document.querySelectorAll('a, button, input, textarea, [role="button"], .arsenal-item').forEach(el => {
            el.addEventListener('mouseenter', () => cursorCircle?.classList.add('link-hover'));
            el.addEventListener('mouseleave', () => cursorCircle?.classList.remove('link-hover'));
        });
    }

    // ==========================================
    // PROJECTS MODAL LOGIC
    // ==========================================
    const projectsData = [
        {
            title: "Zyron HomePage",
            description: "A sleek and modern homepage designed for my custom browser project called 'Zyron'. This project showcases a clean interface with smooth animations and intuitive navigation. Although the browser project has been discontinued, this homepage demonstrates my frontend design capabilities and attention to user experience. Built with vanilla HTML, CSS, and JavaScript, it features responsive design and modern web standards.",
            image: "https://cube.is-a.dev/assets/images/zyron.webp",
            tags: ["HTML", "CSS", "JavaScript"],
            links: [
                { text: "Website", icon: "bx-link-external", url: "https://zyron.pages.dev" },
                { text: "GitHub", icon: "bxl-github", url: "https://github.com/CubeZockii/Zyron" }
            ]
        },
        {
            title: "TaskWeb",
            description: "A feature-rich task management application that allows users to organize their work efficiently. Users can add tasks, set priority levels (Low, Medium, High), and track progress through different status categories (To-Do, Ongoing, Done). The application includes a save/load system for persistent storage and supports collaborative boards where multiple users can work together on shared task lists. Perfect for personal productivity or team coordination.",
            image: "https://cube.is-a.dev/assets/images/taskweb.webp",
            tags: ["JavaScript", "HTML", "CSS", "Firebase", "Task Management"],
            links: [
                { text: "Website", icon: "bx-link-external", url: "https://taskweb.pages.dev" },
                { text: "GitHub", icon: "bxl-github", url: "https://github.com/CubeZockii/TaskWeb" }
            ]
        },
        {
            title: "Kynex",
            description: "A comprehensive Discord management bot built with Python and Discord.py. Kynex provides powerful moderation tools, utility commands, and server management features to keep communities organized, secure, and engaging. The bot includes custom command handlers, and an intuitive user experience. Features include automated moderation, custom roles, logging systems, and entertainment commands.",
            image: "https://cube.is-a.dev/assets/images/kynex.webp",
            tags: ["Python", "Discord.py"],
            links: [
                { text: "Website", icon: "bx-link-external", url: "https://kynex.pages.dev" },
                { text: "GitHub", icon: "bxl-github", url: "https://github.com/CubeZockii/Kynex" }
            ]
        },
        {
            title: "MovieMaze",
            description: "An Innovative web application that allows users to search for films, view details, and watch trailers. Built with modern web technologies, this project aims to provides seamless user experience for movie enthusiasts.",
            image: "https://cube.is-a.dev/assets/images/MovieMaze.webp",
            tags: ["JavaScript", "HTML", "CSS", "API Integration", "Film Database", "Backend"],
            links: [
                { text: "Website", icon: "bx-link-external", url: "https://moviemaze.pages.dev" },
                { text: "GitHub", icon: "bxl-github", url: "https://GitHub.com/CubeZockii/MovieMaze" }
            ]
        },
        {
            title: "SnapVector",
            description: "SnapVector is engineered for speed and reliability, ensuring instant, high-quality media delivery worldwide. Present your work elegantly in customizable, branded galleries, backed by advanced security controls like password protection and time-limited access.",
            image: "https://cube.is-a.dev/assets/images/snapvector.webp",
            tags: ["API", "Backend", "HTML", "CSS", "JavaScript", "Database"],
            links: [
                { text: "Website", icon: "bx-code-alt", url: "https://snapvector.pages.dev" }
            ]
        },
        {
            title: "Portfolio Website",
            description: "The very website you're viewing right now! This portfolio was built entirely from scratch using vanilla HTML, CSS, and JavaScript. It features a modern glassmorphism design, smooth scroll animations, a custom cursor, Discord integration via the Lanyard API, and a fully responsive layout. The site showcases my frontend development skills and attention to detail in creating engaging user experiences. Everything from the animated gradients to the contact form has been carefully crafted to provide a premium browsing experience.",
            image: "https://cube.is-a.dev/assets/images/portfolio.webp",
            tags: ["HTML", "CSS", "JavaScript"],
            links: [
                { text: "You're here!", icon: "bx-show", url: "#home" },
                { text: "GitHub", icon: "bxl-github", url: "#" }
            ]
        }
    ];

    const projectModal = document.getElementById('project-modal');
    const closeProjectBtn = document.getElementById('close-project-btn');
    const projectCards = document.querySelectorAll('.project-card.clickable-card');

    const openProjectModal = (projectIndex) => {
        const project = projectsData[projectIndex];
        if (!project) return;

        document.getElementById('project-modal-image').src = project.image;
        document.getElementById('project-modal-title').textContent = project.title;
        document.getElementById('project-modal-description').textContent = project.description;

        const tagsContainer = document.getElementById('project-modal-tags');
        tagsContainer.innerHTML = '';
        project.tags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'project-tag';
            tagEl.textContent = tag;
            tagsContainer.appendChild(tagEl);
        });

        const linksContainer = document.getElementById('project-modal-links');
        linksContainer.innerHTML = '';
        project.links.forEach(link => {
            const linkEl = document.createElement('a');
            linkEl.className = 'project-link';
            linkEl.href = link.url;
            if (link.url !== '#' && !link.url.startsWith('#')) {
                linkEl.target = '_blank';
            }
            linkEl.innerHTML = `<i class='bx ${link.icon}'></i> ${link.text}`;
            linksContainer.appendChild(linkEl);
        });

        openModal(projectModal);
    };

    projectCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const projectIndex = card.getAttribute('data-project');
            openProjectModal(projectIndex);
        });
    });

    if (closeProjectBtn) {
        closeProjectBtn.addEventListener('click', () => closeModal(projectModal));
    }
});