/* ==========================================================================
   SANSKAR ACHARYA PORTFOLIO - MAIN JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------------------------
    // 1. SCROLL PROGRESS BAR & BACK TO TOP BUTTON
    // ----------------------------------------------------------------------
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);

    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = window.scrollY;
        const scrollPercentage = (scrollPosition / totalHeight) * 100;
        progressBar.style.width = `${scrollPercentage}%`;

        if (scrollPosition > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ----------------------------------------------------------------------
    // 2. DARK / LIGHT THEME TOGGLE
    // ----------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme === 'dark');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon(true);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme === 'dark');
            
            showToast(newTheme === 'dark' ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
        });
    }

    function updateThemeIcon(isDark) {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector('i');
        if (icon) {
            icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    }

    // ----------------------------------------------------------------------
    // 3. MOBILE NAVIGATION MENU TOGGLE
    // ----------------------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = navLinks.classList.contains('open') 
                    ? 'fa-solid fa-xmark' 
                    : 'fa-solid fa-bars';
            }
        });

        // Close menu when clicking links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            });
        });
    }

    // ----------------------------------------------------------------------
    // 4. HERO SECTION DYNAMIC TYPING EFFECT
    // ----------------------------------------------------------------------
    const typingElement = document.getElementById('hero-typing-text');
    if (typingElement) {
        const phrases = [
            'BSc.CSIT Student 🎓',
            'Python Enthusiast 🐍',
            'Django Learner 💻',
            'Backend Developer in Progress 🚀'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeLoop() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500; // Pause before typing next
            }

            setTimeout(typeLoop, typeSpeed);
        }

        typeLoop();
    }

    // ----------------------------------------------------------------------
    // 5. SCROLL REVEAL & ACTIVE NAV HIGHLIGHT (INTERSECTION OBSERVER)
    // ----------------------------------------------------------------------
    document.body.classList.add('js-reveal');
    const revealElements = document.querySelectorAll('.reveal');
    
    // Immediately reveal elements already in viewport
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('active');
        }
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Active Link Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // ----------------------------------------------------------------------
    // 6. PROJECT CATEGORY FILTERING
    // ----------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ----------------------------------------------------------------------
    // 7. CONTACT FORM HANDLING & TOAST NOTIFICATION
    // ----------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = contactForm.querySelector('input[type="text"]');
            const emailInput = contactForm.querySelector('input[type="email"]');
            const messageInput = contactForm.querySelector('textarea');

            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                showToast('❌ Please fill in all fields before sending.', true);
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Simulate form submission delay
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                contactForm.reset();
                showToast('🚀 Thank you! Your message has been sent successfully.');
            }, 1200);
        });
    }

    // Helper: Toast Notifications
    function showToast(message, isError = false) {
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        if (isError) toast.style.borderColor = '#ef4444';
        
        toast.innerHTML = `
            <i class="${isError ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check'}"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 4000);
    }
});
