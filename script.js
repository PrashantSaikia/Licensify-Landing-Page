// Enhanced email form handling and animations for Licensify landing page
// Animation Functions
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

function addHoverEffects() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.cta-button, .cta-button-large');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

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

function initializeHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return; // Skip if no header (thank you page)
    
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
    });
}

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

document.addEventListener('DOMContentLoaded', function() {
    // Initialize modal element
    const modal = document.querySelector('.modal');
    
    // Check if we're on the main page or thank you page
    const isMainPage = !window.location.pathname.includes('thank-you');
    
    // Initialize Supabase client
    let supabase = null;
    if (window.LICENSIFY_CONFIG && window.LICENSIFY_CONFIG.supabase) {
        const { url, anonKey } = window.LICENSIFY_CONFIG.supabase;
        if (url && anonKey) {
            supabase = window.supabase.createClient(url, anonKey);
            console.log('✅ Supabase initialized successfully');
        } else {
            console.error('❌ Missing Supabase configuration');
        }
    } else {
        console.error('❌ Missing LICENSIFY_CONFIG or supabase configuration');
    }
    
    // Initialize analytics tracking
    initializeAnalytics();
    
    // Only initialize main page features if we're on the main page
    if (isMainPage) {
        const emailForm = document.getElementById('emailForm');
        const finalEmailForm = document.querySelector('.final-email-form');
        
        // Initialize main page features
        initializeAnimations();
        initializeScrollEffects();
        initializeHeaderScroll();
        
        // Handle both email forms
        if (emailForm) {
            emailForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                await handleEmailSubmission(this);
            });
        }
        
        if (finalEmailForm) {
            finalEmailForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                await handleEmailSubmission(this);
            });
        }
    }
    
    // Analytics Functions
    function generateSessionId() {
        // Check if session ID already exists in sessionStorage
        let sessionId = sessionStorage.getItem('licensify_session_id');
        if (!sessionId) {
            // Generate a unique session ID
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('licensify_session_id', sessionId);
        }
        return sessionId;
    }
    
    async function trackPageVisit() {
        if (!supabase) {
            console.log('Supabase not initialized - skipping page visit tracking');
            return;
        }
        
        const sessionId = generateSessionId();
        console.log('Tracking page visit for session:', sessionId);
        
        try {
            // Get user's location from IP geolocation
            const location = await getUserLocation();
            
            const visitData = {
                session_id: sessionId,
                user_agent: navigator.userAgent,
                referrer: document.referrer || 'direct',
                page_url: 'landing_page',
                country: location.country,
                city: location.city
            };
            
            const { data, error } = await supabase
                .from('page_visits')
                .insert([visitData]);
            
            if (error) {
                console.error('Error tracking page visit:', error);
            } else {
                const locationStr = [location.city, location.country].filter(Boolean).join(', ');
                console.log('Page visit tracked successfully', locationStr ? `from ${locationStr}` : '');
                // Get updated conversion rate
                await updateConversionRate();
            }
        } catch (error) {
            console.error('Error with page visit tracking:', error);
        }
    }
    
    async function getUserLocation() {
        try {
            // Use ipapi.co for free IP geolocation (no API key required)
            const response = await fetch('https://ipapi.co/json/', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                return {
                    country: data.country_name || null,
                    city: data.city || null
                };
            }
        } catch (error) {
            console.log('Could not determine location:', error.message);
        }
        
        return { country: null, city: null }; // Return null values if location detection fails
    }
    
    async function updateConversionRate() {
        if (!supabase) {
            console.log('Skipping conversion rate update - Supabase not initialized');
            return;
        }
        
        try {
            const { data, error } = await supabase.rpc('get_analytics_dashboard');
            
            if (error) {
                console.error('Error getting analytics:', error);
                return;
            }
            
            // Only log analytics if we have data
            if (data && data.overall) {
                console.log('📊 REAL-TIME ANALYTICS:', data);
                console.log(`🎯 Overall Conversion Rate: ${data.overall.conversion_rate}% (${data.overall.total_signups}/${data.overall.total_visitors})`);
                console.log(`📅 Today's Conversion Rate: ${data.today.conversion_rate}% (${data.today.signups}/${data.today.visitors})`);
                
                // Store in window for easy access
                window.licensifyAnalytics = data;
            }
        } catch (error) {
            console.log('Skipping analytics update:', error.message);
        }
    }
    
    function initializeAnalytics() {
        console.log('🚀 Initializing Licensify Analytics...');
        
        // Make analytics functions globally available first
        window.getLicensifyAnalytics = updateConversionRate;
        window.getConversionRate = async () => {
            if (!supabase) return null;
            try {
                const { data, error } = await supabase.rpc('get_conversion_rate');
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('Error getting conversion rate:', error);
                return null;
            }
        };
        
        // Track page visit only if Supabase is initialized
        if (supabase) {
            trackPageVisit().catch(error => {
                console.log('Error tracking page visit:', error.message);
            });
        } else {
            console.log('Supabase not initialized - skipping page visit tracking');
        }
        
        console.log('✅ Analytics initialized. Use window.getLicensifyAnalytics() to check stats');
    }
    
    // Enhanced email submission handling
    async function handleEmailSubmission(form) {
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        // Validate email
        if (!isValidEmail(email)) {
            showError(emailInput, 'Please enter a valid email address');
            return;
        }
        
        try {
            // Check if email is already registered
            if (await isEmailAlreadyRegistered(email)) {
                showError(emailInput, 'This email is already registered');
                return;
            }
            
            // Store email and track analytics
            await storeEmailWithTracking(email);
            
            // Show success message
            showSuccessMessage(emailInput);
            
            // Redirect to thank you page after a short delay
            setTimeout(() => {
                window.location.href = 'thank-you.html';  // Removed leading slash
            }, 1500);
            
        } catch (error) {
            if (error.message === 'DUPLICATE_EMAIL') {
                showError(emailInput, 'This email is already registered');
            } else {
                showError(emailInput, 'Something went wrong. Please try again.');
                console.error('Error submitting email:', error);
            }
        }
    }
    
    // Enhanced email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length >= 5 && email.length <= 100;
    }
    
    // Check if email is already registered (Supabase only)
    async function isEmailAlreadyRegistered(email) {
        console.log('Checking if email is already registered:', email);
        
        // Check Supabase database only (single source of truth)
        if (!supabase) {
            console.error('Supabase not initialized - cannot check for duplicates');
            throw new Error('Database connection not available');
        }
        
        try {
            const { data, error } = await supabase
                .from('early_access_emails')
                .select('email')
                .eq('email', email.toLowerCase())
                .limit(1);
            
            if (error) {
                console.error('Error checking email in Supabase:', error);
                
                // If error is due to RLS policy, we can't check duplicates
                // So we'll rely on the unique constraint in the insert operation
                console.log('Cannot check duplicates due to RLS - will rely on unique constraint');
                return false; // Allow the insert to proceed and handle constraint violation
            }
            
            if (data && data.length > 0) {
                console.log('Email found in Supabase - already registered');
                return true; // Email exists in Supabase
            } else {
                console.log('Email not found in Supabase - can register');
                return false;
            }
        } catch (error) {
            console.error('Error with Supabase operation:', error);
            
            // If we can't check due to permissions, rely on unique constraint
            console.log('Cannot check duplicates - will rely on unique constraint');
            return false; // Allow the insert to proceed and handle constraint violation
        }
    }
    
    // Show error message with animation
    function showError(input, message) {
        // Find the CTA content container (parent of the form)
        const ctaContent = input.closest('.cta-content');
        if (!ctaContent) return;
        
        // Remove existing error
        const existingError = ctaContent.querySelector('.error-message');
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
            font-size: 0.9rem;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            text-align: center;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            font-weight: 500;
        `;
        
        // Insert error message before the privacy note
        const privacyNote = ctaContent.querySelector('.privacy-note');
        if (privacyNote) {
            ctaContent.insertBefore(errorDiv, privacyNote);
        } else {
            ctaContent.appendChild(errorDiv);
        }
        
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
        // Find the CTA content container (parent of the form)
        const ctaContent = input.closest('.cta-content');
        if (!ctaContent) return;
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = '✓ Success! Check your email for confirmation.';
        successDiv.style.cssText = `
            color: #4ade80;
            font-size: 0.9rem;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            text-align: center;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            font-weight: 500;
        `;
        
        // Insert success message before the privacy note
        const privacyNote = ctaContent.querySelector('.privacy-note');
        if (privacyNote) {
            ctaContent.insertBefore(successDiv, privacyNote);
        } else {
            ctaContent.appendChild(successDiv);
        }
        
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
    
    // Note: localStorage-based email storage removed - now using Supabase only
    
    // Analytics tracking (external services only)
    function trackEmailSignup(email) {
        console.log('Tracking email signup:', email);
        
        // Google Analytics 4 and Ads Conversion
        if (typeof gtag !== 'undefined' && window.LICENSIFY_CONFIG && window.LICENSIFY_CONFIG.analytics) {
            const analytics = window.LICENSIFY_CONFIG.analytics;
            
            // Track signup event in GA4
            if (analytics.ga4Id) {
            gtag('event', 'email_signup', {
                'email': email,
                'source': 'landing_page',
                'value': 1,
                'currency': 'GBP'
            });
        }
        
            // Track Google Ads conversion
            if (analytics.googleAdsConversionId && analytics.googleAdsConversionLabel) {
                gtag('event', 'conversion', {
                    'send_to': `${analytics.googleAdsConversionId}/${analytics.googleAdsConversionLabel}`,
                    'value': 1.0,
                    'currency': 'GBP',
                    'transaction_id': Date.now().toString()
                });
            }
            
            console.log('Google Analytics and Ads conversion tracked');
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                'email': email,
                'content_name': 'Licensify Early Access',
                'content_category': 'Lead Generation'
            });
            console.log('Facebook Pixel event tracked');
        }
        
        console.log('Email signup tracking completed');
    }
    
    // Process email signup (Supabase storage + analytics tracking)
    async function storeEmailWithTracking(email) {
        try {
            // Track analytics events
            trackEmailSignup(email);
            
            // Save to Supabase database (primary storage)
            await saveEmailToSupabase(email);
            
            // Update conversion rate analytics
            await updateConversionRate();
            
            console.log('Email signup processing completed for:', email);
            return true;
        } catch (error) {
            // Check if it's a duplicate email error
            if (error.message === 'DUPLICATE_EMAIL') {
                console.log('Duplicate email detected - showing error message to user');
                throw new Error('DUPLICATE_EMAIL'); // Re-throw the specific error
            }
            
            console.error('Error processing email signup:', error);
            throw error; // Re-throw other errors to be handled by caller
        }
    }
    
    // Save email to Supabase database
    async function saveEmailToSupabase(email) {
        if (!supabase) {
            console.log('Supabase not configured, skipping database save');
            return;
        }
        
        // Double-check if email exists before inserting
        try {
            console.log('Double-checking email before save:', email.toLowerCase());
            const { data: existingEmail, error: checkError } = await supabase
                .from('early_access_emails')
                .select('email')
                .eq('email', email.toLowerCase())
                .limit(1);
            
            if (checkError) {
                console.error('Error checking email before save:', checkError);
            } else if (existingEmail && existingEmail.length > 0) {
                console.log('Email already exists in Supabase, skipping insert');
                return;
            }
        } catch (error) {
            console.error('Error checking email before save:', error);
        }
        
        try {
            const emailData = {
                email: email.toLowerCase(),
                created_at: new Date().toISOString(),
                source: 'landing_page',
                user_agent: navigator.userAgent,
                referrer: document.referrer || 'direct',
                ip_address: null // Will be filled by Supabase if needed
            };
            
            console.log('Inserting email into Supabase:', emailData);
            const { data, error } = await supabase
                .from('early_access_emails')
                .insert([emailData]);
            
            if (error) {
                // Check if it's a unique constraint error (email already exists)
                if (error.code === '23505' || error.message.includes('duplicate') || error.message.includes('unique')) {
                    console.log('Email already exists in database - showing duplicate message to user');
                    throw new Error('DUPLICATE_EMAIL'); // Special error code for duplicates
                } else {
                    console.error('Unexpected database error:', error);
                    throw new Error('Failed to save email: ' + error.message);
                }
            } else {
                console.log('Email successfully saved to Supabase:', data);
            }
        } catch (error) {
            console.error('Error with Supabase operation:', error);
            throw error; // Re-throw the error so it can be handled by the calling function
        }
    }
    
    // Enhanced success modal
    function showSuccessModal() {
        if (!modal) return; // Exit if modal doesn't exist
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Add celebration animation
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.animation = 'modalCelebration 0.6s ease';
        }
        
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
        if (!modal) return; // Exit if modal doesn't exist
        
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    };
    
    // Privacy policy functions
    window.showPrivacyPolicy = function() {
        const privacySection = document.getElementById('privacy-policy');
        privacySection.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Load privacy policy content
        loadPrivacyPolicyContent();
    };
    
    function loadPrivacyPolicyContent() {
        const privacyContent = document.querySelector('.uc-privacy-policy');
        const privacyHeader = document.querySelector('.privacy-policy-content h2');
        
        if (privacyContent) {
            // Insert the privacy policy HTML content
            privacyContent.innerHTML = getPrivacyPolicyHtml();
            
            // Add subtitle after loading content
            if (privacyHeader) {
                // Create subtitle element
                const subtitle = document.createElement('div');
                subtitle.className = 'privacy-policy-subtitle';
                subtitle.textContent = 'Effective Date: 5 July 2025';
                
                // Insert subtitle after the main heading
                privacyHeader.parentNode.insertBefore(subtitle, privacyHeader.nextSibling);
            }
        }
    }
    
    function getPrivacyPolicyHtml() {
        return `
            <h2>Introduction & Organizational Info:</h2>
            <p>We, at Context Window Labs LTD, are dedicated to serving our customers and contacts to the best of our abilities. Part of our commitment involves the responsible management of personal information collected through our website ContextWindowLabs.com, and any related interactions. Our primary goals in processing this information include:</p>
            
            <ul>
                <li>Enhancing the user experience on our platform by understanding customer needs and preferences.</li>
                <li>Providing timely support and responding to inquiries or service requests.</li>
                <li>Improving our products and services to meet the evolving demands of our users.</li>
                <li>Conducting necessary business operations, such as billing and account management.</li>
            </ul>
            
            <p>It is our policy to process personal information with the utmost respect for privacy and security. We adhere to all relevant regulations and guidelines to ensure that the data we handle is protected against unauthorized access, disclosure, alteration, and destruction. Our practices are designed to safeguard the confidentiality and integrity of your personal information, while enabling us to deliver the services you trust us with.</p>
            
            <ul>
                <li>We do not have a designated Data Protection Officer (DPO) but remain fully committed to addressing your privacy concerns. Should you have any questions or require further information about how we manage personal information, please feel free to contact us at <a href="mailto:hello@contextwindowlabs.com">hello@contextwindowlabs.com</a>.</li>
            </ul>
            
            <p>Your privacy is our priority. We are committed to processing your personal information transparently and with your safety in mind. This commitment extends to our collaboration with third-party services that may process personal information on our behalf, such as in the case of sending invoices. Rest assured, all activities are conducted in strict compliance with applicable privacy laws.</p>
            
            <h2>Scope and Application:</h2>
            <p>Our privacy policy is designed to protect the personal information of all our stakeholders, including website visitors, registered users, and customers. Whether you are just browsing our website ContextWindowLabs.com, using our services as a registered user, or engaging with us as a valued customer, we ensure that your personal data is processed with the highest standards of privacy and security. This policy outlines our practices and your rights related to personal information.</p>
            
            <h2>Data Collection and Processing:</h2>
            <p>Our commitment to transparency and data protection extends to how we collect and use your personal information. We gather personal data through various interactions, including but not limited to, when you utilize our services or products such as Software, or directly provide information to us.</p>
            
            <p>The following list details the types of personal information we may process:</p>
            <ul>
                <li><strong>First and Last Name</strong></li>
            </ul>
            
            <p>Please note, that we only process information that is essential for delivering our services, complying with legal obligations, or enhancing your user experience. Your privacy is paramount, and we are dedicated to handling your personal information responsibly and in accordance with all applicable laws.</p>
            
            <p>At Context Window Labs LTD, we believe in using personal information responsibly and ethically. The data we collect serves multiple purposes, all aimed at enhancing the services we offer and ensuring the highest level of satisfaction among our users, customers, and employees. Here are the key ways in which we use the personal information collected:</p>
            
            <ul>
                <li><strong>Authentication and Security</strong></li>
            </ul>
            
            <p>Your privacy is our priority. We process your personal information transparently and in accordance with your preferences and applicable privacy laws. We are committed to ensuring that your data is used solely for the purposes for which it was collected and in ways that you have authorized.</p>
            
            <h2>Data Storage and Protection:</h2>
            <h3>Data Storage:</h3>
            <ul>
                <li>Personal information is stored in secure servers located in the following locations: undefined. For services that require international data transfer, we ensure that such transfers comply with all applicable laws and maintain data protection standards equivalent to those in our primary location.</li>
                <li>Data Hosting Partners: We partner with reputable data hosting providers committed to using state-of-the-art security measures. These partners are selected based on their adherence to stringent data protection standards.</li>
            </ul>
            
            <h3>Data Protection Measures:</h3>
            <p><strong>Encryption:</strong> To protect data during transfer and at rest, we employ robust encryption technologies. <strong>Access Control:</strong> Access to personal information is strictly limited to authorized personnel who have a legitimate business need to access the data. We enforce strict access controls and regularly review permissions.</p>
            
            <h3>Data Processing Agreements:</h3>
            <p>When we share your data with third-party service providers, we do so under the protection of Data Processing Agreements (DPAs) that ensure your information is managed in accordance with GDPR and other relevant data protection laws. These agreements mandate that third parties implement adequate technical and organizational measures to ensure the security of your data.</p>
            
            <h3>Transparency and Control:</h3>
            <p>We believe in transparency and providing you with control over your personal information. You will always be informed about any significant changes to our sharing practices, and where applicable, you will have the option to consent to such changes.</p>
            
            <p>Your trust is important to us, and we strive to ensure that your personal information is disclosed only in accordance with this policy and when there is a justified reason to do so. For any queries or concerns about how we share and disclose personal information, please reach out to us at <a href="mailto:hello@contextwindowlabs.com">hello@contextwindowlabs.com</a>.</p>
            
            <h2>User Rights and Choices:</h2>
            <p>At Context Window Labs LTD, we recognize and respect your rights regarding your personal information, in accordance with the General Data Protection Regulation (GDPR) and other applicable data protection laws. We are committed to ensuring you can exercise your rights effectively. Below is an overview of your rights and how you can exercise them:</p>
            
            <p><strong>Your Rights:</strong></p>
            <ul>
                <li>Right of Access (Article 15 GDPR): You have the right to request access to the personal information we hold about you and to obtain information about how we process it.</li>
                <li>Right to Rectification (Article 16 GDPR): If you believe that any personal information we hold about you is incorrect or incomplete, you have the right to request its correction or completion.</li>
                <li>Right to Erasure ('Right to be Forgotten') (Article 17 GDPR): You have the right to request the deletion of your personal information when it is no longer necessary for the purposes for which it was collected, among other circumstances.</li>
                <li>Right to Restriction of Processing (Article 18 GDPR): You have the right to request that we restrict the processing of your personal information under certain conditions.</li>
                <li>Right to Data Portability (Article 20 GDPR): You have the right to receive your personal information in a structured, commonly used, and machine-readable format and to transmit those data to another controller.</li>
                <li>Right to Object (Article 21 GDPR): You have the right to object to the processing of your personal information, under certain conditions, including processing for direct marketing.</li>
                <li>Right to Withdraw Consent (Article 7(3) GDPR): Where the processing of your personal information is based on your consent, you have the right to withdraw that consent at any time without affecting the lawfulness of processing based on consent before its withdrawal.</li>
                <li>Right to Lodge a Complaint (Article 77 GDPR): You have the right to lodge a complaint with a supervisory authority if you believe our processing of your personal information violates applicable data protection laws.</li>
            </ul>
            
            <h3>Exercising Your Rights:</h3>
            <p>To exercise any of these rights, please contact us at <a href="mailto:hello@contextwindowlabs.com">hello@contextwindowlabs.com</a>. We will respond to your request in accordance with applicable data protection laws and within the timeframes stipulated by those laws. Please note, in some cases, we may need to verify your identity as part of the process to ensure the security of your personal information.</p>
            
            <p>We are committed to facilitating the exercise of your rights and to ensuring you have full control over your personal information. If you have any questions or concerns about how your personal information is handled, please do not hesitate to get in touch with us.</p>
            
            <h2>Cookies and Tracking Technologies:</h2>
            <p>At Context Window Labs LTD, we value your privacy and are committed to being transparent about our use of cookies and other tracking technologies on our website ContextWindowLabs.com. These technologies play a crucial role in ensuring the smooth operation of our digital platforms, enhancing your user experience, and providing insights that help us improve.</p>
            
            <h3>Understanding Cookies and Tracking Technologies:</h3>
            <p>Cookies are small data files placed on your device that enable us to remember your preferences and collect information about your website usage. Tracking technologies, such as web beacons and pixel tags, help us understand how you interact with our site and which pages you visit.</p>
            
            <h3>How We Use These Technologies:</h3>
            <ul>
                <li>Essential Cookies: Necessary for the website's functionality, such as authentication and security. They do not require consent.</li>
                <li>Performance and Analytics Cookies: These collect information about how visitors use our website, which pages are visited most frequently, and if error messages are received from web pages. These cookies help us improve our website.</li>
                <li>Functional Cookies: Enable the website to provide enhanced functionality and personalization, like remembering your preferences.</li>
                <li>Advertising and Targeting Cookies: Used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement and help measure the effectiveness of the advertising campaign.</li>
            </ul>
            
            <h3>Your Choices and Consent:</h3>
            <p>Upon your first visit, our website will present you with a cookie consent banner, where you can:</p>
            <ul>
                <li>Accept All Cookies: Consent to the use of all cookies and tracking technologies.</li>
                <li>Reject Non-Essential Cookies: Only essential cookies will be used to provide you with necessary website functions.</li>
                <li>Customize Your Preferences: Choose which categories of cookies you wish to allow.</li>
            </ul>
            
            <h3>Changes to Our Cookie Use:</h3>
            <p>We may update our use of cookies and tracking technologies to improve our services or comply with legal requirements. We will notify you of any significant changes and seek your consent where necessary.</p>
            
            <p>For more detailed information about the cookies we use, their purposes, and how you can manage your preferences, please visit our detailed Cookie Policy <a href="http://contextwindowlabs.com/" target="_blank">http://contextwindowlabs.com/</a>.</p>
            
            <p>Should you have any questions or concerns about our use of cookies and tracking technologies, please do not hesitate to contact us at <a href="mailto:hello@contextwindowlabs.com">hello@contextwindowlabs.com</a>. Your privacy and the integrity of your personal data are of utmost importance to us.</p>
            
            <h2>Data Breach Notification Procedures:</h2>
            <p>At Context Window Labs LTD, we understand the importance of protecting your personal information and take proactive measures to safeguard it. In the event of a data breach that poses a risk to your privacy rights and freedoms, we have established clear procedures for promptly identifying, assessing, and mitigating the impact of the breach. Our data breach notification procedures are designed to comply with applicable data protection laws and regulations, including the General Data Protection Regulation (GDPR).</p>
            
            <h3>Detection and Assessment:</h3>
            <ul>
                <li>Internal Monitoring: We employ robust security measures and monitoring systems to detect and respond to potential data breaches promptly.</li>
                <li>Assessment of Breach Impact: Upon discovery of a data breach, we will conduct a thorough assessment to determine the nature and scope of the breach, including the types of personal information involved and the potential impact on affected individuals.</li>
            </ul>
            
            <h3>Notification Obligations:</h3>
            <ul>
                <li>Regulatory Authorities: If required by law, we will notify the relevant data protection authorities of the data breach within 60, following the procedures specified by applicable regulations.</li>
                <li>Affected Individuals: If a data breach poses a significant risk to your privacy rights and freedoms, we will notify you within 60, providing clear and concise information about the breach, the types of personal information affected, and the steps you can take to protect yourself.</li>
            </ul>
            
            <h3>Communication Channels:</h3>
            <ul>
                <li><strong>Email Notification:</strong> We may notify affected individuals via email, using the contact information provided to us, if feasible and appropriate.</li>
                <li><strong>Website Notification:</strong> We may also post a notification on our website or through other communication channels accessible to affected individuals.</li>
            </ul>
            
            <h3>Support and Assistance:</h3>
            <p>In the event of a data breach, we are committed to providing affected individuals with the support and assistance they need, including guidance on steps they can take to mitigate the potential risks associated with the breach.</p>
            
            <p>Point of Contact: If you have any questions or concerns about a data breach or believe you may have been affected, please contact us immediately at <a href="mailto:hello@contextwindowlabs.com">hello@contextwindowlabs.com</a>.</p>
            
            <h2>Policy Updates and Changes:</h2>
            <p>At Context Window Labs LTD, we are committed to keeping you informed about how we handle your personal information and any changes to our privacy practices. We may update this privacy policy from time to time to reflect changes in legal requirements, industry standards, or our business operations. We want to assure you that any updates will be communicated transparently and in accordance with applicable data protection laws.</p>
            
            <h3>Notification of Changes:</h3>
            <ul>
                <li>Notification Process: In the event of significant changes to our privacy policy that may affect your rights or the way we handle your personal information, we will provide notice through prominent means, such as email, website notifications, or other appropriate channels. We will also indicate the effective date of the updated policy at the top of the document.</li>
                <li>Reviewing Changes: We encourage you to review our privacy policy periodically to stay informed about how we collect, use, and protect your personal information. Your continued use of our services after any changes to the policy signifies your acceptance of the updated terms.</li>
            </ul>
            
            <h2>Contact Us:</h2>
            <p>If you have any questions or concerns about our privacy policy or any updates to it, please don't hesitate to contact us at <a href="mailto:hello@contextwindowlabs.com">hello@contextwindowlabs.com</a>. We are here to address any inquiries you may have and to ensure that you have the information you need to feel confident about how your personal information is handled.</p>
        `;
    }
    
    window.hidePrivacyPolicy = function() {
        const privacySection = document.getElementById('privacy-policy');
        privacySection.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
    
    // Enhanced modal and privacy policy interactions
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
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
            if (modal && modal.classList.contains('show')) {
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