// Email form handling
document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.getElementById('emailForm');
    const modal = document.getElementById('successModal');
    
    // Handle email form submission
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleEmailSubmission(this);
        });
    }
    
    // iPhone mockup animation
    const question1 = document.getElementById('question1');
    const question2 = document.getElementById('question2');
    
    if (question1 && question2) {
        // Start the animation cycle
        function startQuestionCycle() {
            // Both animations are handled by CSS keyframes
            // This ensures they start at the same time
        }
        
        // Start the cycle immediately
        startQuestionCycle();
    }
    
    // Handle email submission
    function handleEmailSubmission(form) {
        const emailInput = form.querySelector('input[type="email"]');
        const submitButton = form.querySelector('button[type="submit"]');
        const email = emailInput.value.trim();
        
        // Basic email validation
        if (!isValidEmail(email)) {
            showError(emailInput, 'Please enter a valid email address');
            return;
        }
        
        // Show loading state
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<span>Submitting...</span>';
        submitButton.disabled = true;
        
        // Simulate API call (replace with actual API endpoint)
        setTimeout(() => {
            // Store email in localStorage for now (replace with actual backend)
            storeEmail(email);
            
            // Reset form
            emailInput.value = '';
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            
            // Show success modal
            showSuccessModal();
        }, 1000);
    }
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show error message
    function showError(input, message) {
        // Remove existing error
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error class
        input.style.borderColor = '#ff6b6b';
        input.style.background = '#fff5f5';
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ff6b6b';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '0.5rem';
        errorDiv.style.textAlign = 'center';
        
        input.parentNode.appendChild(errorDiv);
        
        // Remove error after 3 seconds
        setTimeout(() => {
            input.style.borderColor = '';
            input.style.background = '';
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 3000);
    }
    
    // Store email (replace with actual API call)
    function storeEmail(email) {
        // Get existing emails from localStorage
        let emails = JSON.parse(localStorage.getItem('licensifyEmails') || '[]');
        
        // Add new email if it doesn't exist
        if (!emails.includes(email)) {
            emails.push(email);
            localStorage.setItem('licensifyEmails', JSON.stringify(emails));
        }
        
        // Log for development (remove in production)
        console.log('Email stored:', email);
        console.log('Total emails:', emails.length);
    }
    
    // Show success modal
    function showSuccessModal() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    // Close modal
    window.closeModal = function() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    };
    
    // Close modal on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    // Smooth scrolling for anchor links
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
    
    // Add scroll effect to header
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('.header');
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Analytics tracking (replace with your preferred analytics)
function trackEmailSignup(email) {
    // Google Analytics 4 example
    if (typeof gtag !== 'undefined') {
        gtag('event', 'email_signup', {
            'email': email,
            'source': 'landing_page'
        });
    }
    
    // Facebook Pixel example
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            'email': email
        });
    }
    
    // Custom analytics
    console.log('Email signup tracked:', email);
}

// Add to email storage function
function storeEmailWithTracking(email) {
    storeEmail(email);
    trackEmailSignup(email);
} 