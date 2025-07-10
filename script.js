// Enhanced email form handling and animations for Licensify landing page
document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.getElementById('emailForm');
    const finalEmailForm = document.querySelector('.final-email-form');
    const modal = document.getElementById('successModal');
    
    // Initialize animations and interactions
    initializeAnimations();
    initializeScrollEffects();
    initializeHeaderScroll();
    
    // Handle both email forms
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleEmailSubmission(this);
        });
    }
    
    if (finalEmailForm) {
        finalEmailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleEmailSubmission(this);
        });
    }
    
    // Initialize animations
    function initializeAnimations() {
        // Animate social proof numbers
        animateNumbers();
        
        // Add staggered animation to feature cards
        animateFeatureCards();
        
        // Add animation to testimonials
        animateTestimonials();
        
        // Add hover effects to interactive elements
        addHoverEffects();
    }
    
    // Animate numbers in social proof
    function animateNumbers() {
        const numbers = document.querySelectorAll('.proof-number');
        
        numbers.forEach(number => {
            const target = number.textContent;
            if (target.includes('15,000+')) {
                animateCounter(number, 0, 15000, 2000, '+');
            } else if (target.includes('98%')) {
                animateCounter(number, 0, 98, 1500, '%');
            }
        });
    }
    
    // Counter animation function
    function animateCounter(element, start, end, duration, suffix = '') {
        let current = start;
        const increment = end / (duration / 16); // 60fps
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            
            if (suffix === '+') {
                element.textContent = Math.floor(current).toLocaleString() + '+';
            } else if (suffix === '%') {
                element.textContent = Math.floor(current) + '%';
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }
    
    // Animate feature cards with staggered effect
    function animateFeatureCards() {
        const cards = document.querySelectorAll('.feature-item');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Animate testimonials
    function animateTestimonials() {
        const testimonials = document.querySelectorAll('.testimonial-card');
        
        testimonials.forEach((testimonial, index) => {
            testimonial.style.opacity = '0';
            testimonial.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                testimonial.style.transition = 'all 0.6s ease';
                testimonial.style.opacity = '1';
                testimonial.style.transform = 'translateY(0)';
            }, (index * 200) + 1000);
        });
    }
    
    // Add hover effects to interactive elements
    function addHoverEffects() {
        // Add ripple effect to buttons
        const buttons = document.querySelectorAll('.cta-button, .cta-button-large');
        buttons.forEach(button => {
            button.addEventListener('click', createRipple);
        });
        
        // Removed parallax effect to ensure header stability
    }
    
    // Create ripple effect
    function createRipple(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Initialize header scroll effects
    function initializeHeaderScroll() {
        const header = document.querySelector('.header');
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add scrolled class when scrolling down
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Ensure header is always visible (no hide on scroll)
            header.style.transform = 'translateY(0)';
            
            lastScrollTop = scrollTop;
        });
    }
    
    // Initialize scroll effects
    function initializeScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe sections for scroll animations
        document.querySelectorAll('.features-section, .testimonials-section, .final-cta').forEach(section => {
            observer.observe(section);
        });
    }
    
    // Enhanced email submission handling
    function handleEmailSubmission(form) {
        const emailInput = form.querySelector('input[type="email"]');
        const submitButton = form.querySelector('button[type="submit"]');
        const email = emailInput.value.trim();
        
        // Enhanced email validation
        if (!isValidEmail(email)) {
            showError(emailInput, 'Please enter a valid email address');
            return;
        }
        
        // Check if email already exists
        if (isEmailAlreadyRegistered(email)) {
            showError(emailInput, 'This email is already registered for early access!');
            return;
        }
        
        // Show loading state with animation
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<span class="loading-spinner"></span><span>Submitting...</span>';
        submitButton.disabled = true;
        submitButton.style.opacity = '0.7';
        
        // Simulate API call with more realistic timing
        setTimeout(() => {
            // Store email and track signup
            storeEmailWithTracking(email);
            
            // Reset form with animation
            emailInput.value = '';
            emailInput.style.transform = 'scale(0.95)';
            setTimeout(() => {
                emailInput.style.transform = 'scale(1)';
            }, 150);
            
            // Reset button
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
            
            // Show success feedback
            showSuccessMessage(emailInput);
            
            // Show success modal with delay
            setTimeout(() => {
                showSuccessModal();
            }, 500);
            
        }, 1200);
    }
    
    // Enhanced email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length >= 5 && email.length <= 100;
    }
    
    // Check if email is already registered
    function isEmailAlreadyRegistered(email) {
        const emails = JSON.parse(localStorage.getItem('licensifyEmails') || '[]');
        return emails.includes(email.toLowerCase());
    }
    
    // Show error message with animation
    function showError(input, message) {
        // Remove existing error
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error styling with animation
        input.style.borderColor = '#ff6b6b';
        input.style.background = '#fff5f5';
        input.style.transform = 'shake 0.3s ease';
        
        // Create animated error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ff6b6b;
            font-size: 0.85rem;
            margin-top: 0.5rem;
            text-align: center;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        `;
        
        input.parentNode.appendChild(errorDiv);
        
        // Animate in
        setTimeout(() => {
            errorDiv.style.opacity = '1';
            errorDiv.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            input.style.borderColor = '';
            input.style.background = '';
            if (errorDiv.parentNode) {
                errorDiv.style.opacity = '0';
                errorDiv.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    errorDiv.remove();
                }, 300);
            }
        }, 5000);
    }
    
    // Show success message
    function showSuccessMessage(input) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = '✓ Success! Check your email for confirmation.';
        successDiv.style.cssText = `
            color: #4ade80;
            font-size: 0.85rem;
            margin-top: 0.5rem;
            text-align: center;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        `;
        
        input.parentNode.appendChild(successDiv);
        
        // Animate in
        setTimeout(() => {
            successDiv.style.opacity = '1';
            successDiv.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successDiv.style.opacity = '0';
            successDiv.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                successDiv.remove();
            }, 300);
        }, 3000);
    }
    
    // Enhanced email storage with additional data
    function storeEmail(email) {
        const emails = JSON.parse(localStorage.getItem('licensifyEmails') || '[]');
        const emailData = {
            email: email.toLowerCase(),
            timestamp: new Date().toISOString(),
            source: 'landing_page',
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'direct'
        };
        
        // Add email data if it doesn't exist
        if (!emails.find(e => e.email === emailData.email)) {
            emails.push(emailData);
            localStorage.setItem('licensifyEmails', JSON.stringify(emails));
        }
        
        // Store additional analytics data
        localStorage.setItem('licensifyStats', JSON.stringify({
            totalSignups: emails.length,
            lastSignup: emailData.timestamp,
            conversionRate: calculateConversionRate()
        }));
        
        console.log('Email stored:', emailData);
        console.log('Total signups:', emails.length);
    }
    
    // Calculate conversion rate
    function calculateConversionRate() {
        const pageViews = parseInt(localStorage.getItem('licensifyPageViews') || '0') + 1;
        const signups = JSON.parse(localStorage.getItem('licensifyEmails') || '[]').length;
        localStorage.setItem('licensifyPageViews', pageViews.toString());
        return ((signups / pageViews) * 100).toFixed(2);
    }
    
    // Enhanced analytics tracking
    function trackEmailSignup(email) {
        const eventData = {
            event: 'email_signup',
            email: email,
            source: 'landing_page',
            timestamp: new Date().toISOString(),
            page_url: window.location.href,
            user_agent: navigator.userAgent
        };
        
        // Google Analytics 4 example
        if (typeof gtag !== 'undefined') {
            gtag('event', 'email_signup', {
                'email': email,
                'source': 'landing_page',
                'value': 1,
                'currency': 'GBP'
            });
        }
        
        // Facebook Pixel example
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                'email': email,
                'content_name': 'Licensify Early Access',
                'content_category': 'Lead Generation'
            });
        }
        
        // Custom analytics endpoint (replace with your actual endpoint)
        if (window.fetch) {
            fetch('/api/analytics/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData)
            }).catch(err => console.log('Analytics tracking failed:', err));
        }
        
        console.log('Email signup tracked:', eventData);
    }
    
    // Store email with enhanced tracking
    function storeEmailWithTracking(email) {
        storeEmail(email);
        trackEmailSignup(email);
    }
    
    // Enhanced success modal
    function showSuccessModal() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Add celebration animation
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.animation = 'modalCelebration 0.6s ease';
        
        // Add confetti effect
        createConfetti();
    }
    
    // Create confetti effect
    function createConfetti() {
        const colors = ['#4299e1', '#3182ce', '#68d391', '#ffffff', '#90cdf4'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    top: -10px;
                    left: ${Math.random() * 100}vw;
                    z-index: 10001;
                    border-radius: 50%;
                    animation: confettiFall 3s ease-out forwards;
                `;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }, i * 20);
        }
    }
    
    // Close modal function (global scope for onclick handler)
    window.closeModal = function() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    };
    
    // Privacy policy functions
    window.showPrivacyPolicy = function() {
        const privacySection = document.getElementById('privacy-policy');
        privacySection.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };
    
    window.hidePrivacyPolicy = function() {
        const privacySection = document.getElementById('privacy-policy');
        privacySection.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
    
    // Enhanced modal and privacy policy interactions
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    const privacySection = document.getElementById('privacy-policy');
    if (privacySection) {
        privacySection.addEventListener('click', function(e) {
            if (e.target === privacySection) {
                hidePrivacyPolicy();
            }
        });
    }
    
    // Enhanced keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (modal.classList.contains('show')) {
                closeModal();
            }
            if (privacySection && privacySection.style.display === 'flex') {
                hidePrivacyPolicy();
            }
        }
    });
    
    // Enhanced smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Enhanced header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        // Add background opacity based on scroll
        const opacity = Math.min(scrollTop / 100, 1);
        header.style.background = `rgba(255, 255, 255, ${0.95 * opacity})`;
        
        lastScrollTop = scrollTop;
    });
    
    // Performance monitoring
    if (window.performance && window.performance.mark) {
        window.performance.mark('licensify-interactive');
        
        window.addEventListener('load', () => {
            window.performance.mark('licensify-loaded');
            
            // Log performance metrics
            const navigation = window.performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', navigation.loadEventEnd - navigation.loadEventStart, 'ms');
            
            // Track page load time
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_load_time', {
                    'value': Math.round(navigation.loadEventEnd - navigation.loadEventStart),
                    'custom_parameter': 'landing_page'
                });
            }
        });
    }
});

// Add CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes modalCelebration {
        0% { transform: scale(0.8); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s linear infinite;
        margin-right: 8px;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease-out;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style); 