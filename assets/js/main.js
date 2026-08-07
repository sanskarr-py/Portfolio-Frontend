/* ==========================================================================
   SANSKAR ACHARYA PORTFOLIO - MAIN JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 0. UTILITIES
    // ----------------------------------------------------------------------
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ----------------------------------------------------------------------
    // 1. SCROLL PROGRESS BAR, BACK TO TOP & NAVBAR STATE
    // ----------------------------------------------------------------------
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);

    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    let scrollTicking = false;

    function updateActiveNavLink(scrollPosition) {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
        });
    }

    function onScroll() {
        if (scrollTicking) return;
        scrollTicking = true;

        requestAnimationFrame(() => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPosition = window.scrollY;

            progressBar.style.width = `${(scrollPosition / totalHeight) * 100}%`;
            scrollTopBtn.classList.toggle('visible', scrollPosition > 400);
            if (navbar) navbar.classList.toggle('scrolled', scrollPosition > 10);

            updateActiveNavLink(scrollPosition);
            scrollTicking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });

    // ----------------------------------------------------------------------
    // 2. MOBILE NAVIGATION MENU TOGGLE
    // ----------------------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');

    function closeMobileMenu() {
        if (!navLinks || !navLinks.classList.contains('open')) return;
        navLinks.classList.remove('open');
        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-bars';
        }
    }

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close menu on outside click or Escape
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && e.target !== mobileMenuBtn) {
                closeMobileMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMobileMenu();
        });
    }

    // ----------------------------------------------------------------------
    // 3. SCROLL REVEAL (INTERSECTION OBSERVER)
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

    if (prefersReducedMotion) {
        revealElements.forEach(el => el.classList.add('active'));
    } else {
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
    }

    // ----------------------------------------------------------------------
    // 5. CONTACT FORM HANDLING & TOAST NOTIFICATION
    // ----------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        const nameInput = contactForm.querySelector('input[type="text"]');
        const emailInput = contactForm.querySelector('input[type="email"]');
        const messageInput = contactForm.querySelector('textarea');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        // Clear error state as the user types
        [nameInput, emailInput, messageInput].forEach(input => {
            if (!input) return;
            input.addEventListener('input', () => {
                input.closest('.form-group').classList.remove('invalid');
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let hasError = false;

            function markInvalid(input) {
                const group = input && input.closest('.form-group');
                if (group) {
                    group.classList.add('invalid');
                    hasError = true;
                }
            }

            if (!nameInput.value.trim()) markInvalid(nameInput);
            if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) markInvalid(emailInput);
            if (!messageInput.value.trim()) markInvalid(messageInput);

            if (hasError) {
                showToast('❌ Please fill in all fields correctly before sending.', true);
                return;
            }

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

    // ----------------------------------------------------------------------
    // 7. TOAST NOTIFICATIONS
    // ----------------------------------------------------------------------
    function showToast(message, isError = false) {
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = `toast${isError ? ' error' : ''}`;

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
