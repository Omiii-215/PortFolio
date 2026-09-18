document.addEventListener('DOMContentLoaded', () => {
    // ═══════════════════════════════════════════
    // Hash-Based Router
    // ═══════════════════════════════════════════
    const pages = {
        '/': 'page-home',
        '/about': 'page-about',
        '/projects': 'page-projects',
        '/experience': 'page-experience',
        '/blog': 'page-blog',
        '/gsoc': 'page-gsoc',
        '/contact': 'page-contact'
    };

    const navMap = {
        '/': 'home',
        '/about': 'about',
        '/projects': 'projects',
        '/experience': 'experience',
        '/blog': 'blog',
        '/gsoc': 'gsoc',
        '/contact': 'contact'
    };

    function getRoute() {
        const hash = window.location.hash.replace('#', '') || '/';
        return hash;
    }

    function navigate(route) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

        // Show target page
        const pageId = pages[route] || pages['/'];
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update nav active states
        const navKey = navMap[route] || 'home';
        
        // Desktop nav
        document.querySelectorAll('.desktop-nav a').forEach(a => {
            a.classList.toggle('active', a.dataset.nav === navKey);
        });

        // Mobile nav
        document.querySelectorAll('.mobile-nav a').forEach(a => {
            a.classList.toggle('active', a.dataset.nav === navKey);
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // Listen for hash changes
    window.addEventListener('hashchange', () => {
        navigate(getRoute());
    });

    // Initial route
    navigate(getRoute());

    // Logo click goes home
    document.querySelector('.header-logo').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#/';
    });

    // ═══════════════════════════════════════════
    // Theme Toggle
    // ═══════════════════════════════════════════
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = document.getElementById('themeIconSun');
    const moonIcon = document.getElementById('themeIconMoon');

    function applyTheme(isDark) {
        document.body.classList.toggle('dark-theme', isDark);
        if (sunIcon && moonIcon) {
            sunIcon.style.display = isDark ? 'block' : 'none';
            moonIcon.style.display = isDark ? 'none' : 'block';
        }
    }

    // Check saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        applyTheme(true);
    } else {
        applyTheme(false);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = !document.body.classList.contains('dark-theme');
            applyTheme(isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // ═══════════════════════════════════════════
    // Dynamic Year
    // ═══════════════════════════════════════════
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // ═══════════════════════════════════════════
    // Typewriter Effect
    // ═══════════════════════════════════════════
    const typewriterEl = document.getElementById('typewriter');
    if (typewriterEl) {
        const phrases = [
            'Software Developer',
            'Open Source Contributor',
            'GSoC \'26 @ OpenAstronomy',
            'Scientific Computing Enthusiast',
            'Full Stack Developer'
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;

        function typeWriter() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause before deleting
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 400; // Pause before next phrase
            }

            setTimeout(typeWriter, typeSpeed);
        }

        // Start after a short delay
        setTimeout(typeWriter, 500);
    }

    // ═══════════════════════════════════════════
    // Mobile Hamburger (for small screens where
    // bottom nav might not be enough)
    // ═══════════════════════════════════════════
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            // Toggle mobile nav visibility on very small screens
            // For now the bottom nav handles mobile, hamburger is a fallback
            const mobileNav = document.getElementById('mobileNav');
            if (mobileNav) {
                const isVisible = mobileNav.style.display !== 'none';
                // The bottom nav is always visible on mobile, so hamburger
                // can scroll to it or do nothing special
            }
        });
    }
});
