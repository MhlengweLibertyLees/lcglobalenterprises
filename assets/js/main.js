/**
 * LC Global Enterprises - Main JavaScript
 * Enhanced with modern ES6+ features, better performance, and accessibility
 */

class LCGlobalEnterprises {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupSmoothScrolling();
        this.setupFormHandling();
        this.setup3DAnimations();
        this.setupAccessibility();
        this.setupImageOptimization();
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Mobile navigation toggle
        this.setupMobileNavigation();
        
        // Header scroll effect
        this.setupHeaderScroll();
        
        // Window load event
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            this.animateOnLoad();
        });

        // Resize event with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.handleResize(), 250);
        });
    }

    // Mobile Navigation - FIXED
    setupMobileNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!navToggle || !navMenu) return;

        // Toggle menu
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu(navToggle, navMenu);
        });

        // Close menu when clicking links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu(navToggle, navMenu);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
                this.closeMobileMenu(navToggle, navMenu);
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                this.closeMobileMenu(navToggle, navMenu);
            }
        });
    }

    toggleMobileMenu(toggle, menu) {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        menu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileMenu(toggle, menu) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Header Scroll Effect
    setupHeaderScroll() {
        const header = document.querySelector('.site-header');
        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide header on scroll down, show on scroll up
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = window.scrollY;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (!target) return;
                
                e.preventDefault();
                
                // Close mobile menu if open
                const navToggle = document.getElementById('navToggle');
                const navMenu = document.getElementById('navMenu');
                if (navMenu.classList.contains('active')) {
                    this.closeMobileMenu(navToggle, navMenu);
                }
                
                const header = document.querySelector('.site-header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    // Active Navigation Links
    setupIntersectionObserver() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (sections.length === 0 || navLinks.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    // Update active nav link
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    // Form Handling - UPDATED FOR FORMSPREE
    setupFormHandling() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        // Real-time validation
        this.setupFormValidation(contactForm);
        
        // Form submission
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(contactForm);
        });
    }

    setupFormValidation(form) {
        const fields = form.querySelectorAll('[required]');
        
        fields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });
    }

    validateField(field) {
        const errorElement = field.parentElement.querySelector('.error-message');
        
        if (!field.validity.valid) {
            let message = '';
            
            if (field.validity.valueMissing) {
                message = 'This field is required';
            } else if (field.validity.typeMismatch) {
                if (field.type === 'email') {
                    message = 'Please enter a valid email address';
                }
            }
            
            this.showFieldError(field, message);
            return false;
        }
        
        this.clearFieldError(field);
        return true;
    }

    showFieldError(field, message) {
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.opacity = '1';
        }
        field.setAttribute('aria-invalid', 'true');
    }

    clearFieldError(field) {
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.opacity = '0';
        }
        field.setAttribute('aria-invalid', 'false');
    }

    async handleFormSubmission(form) {
        const submitBtn = form.querySelector('.btn-submit');
        const formStatus = document.getElementById('form-status');
        
        // Validate all fields
        const fields = form.querySelectorAll('[required]');
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showFormStatus(formStatus, 'Please fix the errors above', 'error');
            return;
        }

        // Show loading state
        this.setFormLoading(submitBtn, true);
        
        try {
            // Submit to Formspree
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                this.showFormStatus(formStatus, 'Thank you! Your message has been sent successfully. We will contact you shortly.', 'success');
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
            
        } catch (error) {
            this.showFormStatus(formStatus, 'Sorry, there was an error sending your message. Please try again or email us directly at libertyengetelo@gmail.com.', 'error');
        } finally {
            this.setFormLoading(submitBtn, false);
        }
    }

    setFormLoading(button, loading) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    showFormStatus(element, message, type) {
        if (!element) return;
        
        element.textContent = message;
        element.className = `form-status ${type}`;
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                element.className = 'form-status';
            }, 5000);
        }
    }

    // 3D Animations
    setup3DAnimations() {
        this.setupParallaxEffect();
        this.setupScrollAnimations();
    }

    setupParallaxEffect() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        let mouseX = 0;
        let mouseY = 0;
        let rafId = null;

        const updateParallax = () => {
            const orbs = document.querySelectorAll('.floating-orb');
            const cubes = document.querySelectorAll('.floating-cube');
            
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.5;
                orb.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
            });
            
            cubes.forEach((cube, index) => {
                const speed = (index + 1) * 2;
                cube.style.transform = `rotateX(${mouseY * speed}deg) rotateY(${mouseX * speed}deg)`;
            });
            
            rafId = requestAnimationFrame(updateParallax);
        };

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = hero.getBoundingClientRect();
            
            mouseX = ((clientX - left) / width - 0.5) * 2;
            mouseY = ((clientY - top) / height - 0.5) * 2;
        };

        hero.addEventListener('mousemove', handleMouseMove, { passive: true });
        hero.addEventListener('mouseenter', () => {
            if (!rafId) {
                rafId = requestAnimationFrame(updateParallax);
            }
        });
        
        hero.addEventListener('mouseleave', () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            
            // Reset positions
            const orbs = document.querySelectorAll('.floating-orb');
            const cubes = document.querySelectorAll('.floating-cube');
            
            orbs.forEach(orb => {
                orb.style.transform = '';
            });
            
            cubes.forEach(cube => {
                cube.style.transform = '';
            });
        });
    }

    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.card, .service-card, .package, .portfolio-item, .service-icon, .founder-image, .vision-item, .mission-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Set initial state
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }

    // Image Optimization
    setupImageOptimization() {
        // Lazy loading for images
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // Optimize founder image display
        this.optimizeFounderImage();
    }

    optimizeFounderImage() {
        const founderImage = document.querySelector('.founder-image img');
        if (founderImage) {
            // Ensure proper cropping for head and shoulders
            founderImage.style.objectPosition = 'top center';
        }
    }

    // Accessibility Features
    setupAccessibility() {
        this.setupFocusManagement();
        this.setupKeyboardNavigation();
        this.setupReducedMotion();
    }

    setupFocusManagement() {
        // Manage focus for mobile menu
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navToggle.click();
                }
            });
        }
    }

    setupKeyboardNavigation() {
        // Add keyboard navigation for interactive elements
        document.addEventListener('keydown', (e) => {
            // Close modals on Escape
            if (e.key === 'Escape') {
                const mobileMenu = document.getElementById('navMenu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    this.closeMobileMenu(
                        document.getElementById('navToggle'),
                        mobileMenu
                    );
                }
            }
        });
    }

    setupReducedMotion() {
        // Check if user prefers reduced motion
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (reducedMotion.matches) {
            document.documentElement.style.setProperty('--transition', '0.01s');
            document.documentElement.style.setProperty('--transition-fast', '0.01s');
            document.documentElement.style.setProperty('--transition-slow', '0.01s');
        }
    }

    // Utility Methods
    animateOnLoad() {
        // Add any on-load animations here
        document.body.classList.add('page-loaded');
    }

    handleResize() {
        // Handle responsive behavior on resize
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (window.innerWidth > 768 && navMenu) {
            this.closeMobileMenu(navToggle, navMenu);
        }
    }

    // Performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new LCGlobalEnterprises();
});

// Service Worker Registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}