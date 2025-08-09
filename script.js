
// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Course Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-category');

            courseCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Newsletter Form Handling
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                this.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }

    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateContactForm()) {
                showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
                this.reset();
            }
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                clearError(this);
            });
        });
    }

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

    // Animated counter for stats (if on homepage)
    const statItems = document.querySelectorAll('.stat-item h3');
    if (statItems.length > 0) {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        statItems.forEach(item => {
            observer.observe(item);
        });
    }

    // Course enrollment buttons
    document.querySelectorAll('.course-card .btn-primary').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const courseName = this.closest('.course-card').querySelector('h3').textContent;
            showNotification(`Enrollment for "${courseName}" coming soon!`, 'info');
        });
    });

    // Dark mode toggle (bonus feature)
    createDarkModeToggle();
});

// Email validation function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Contact form validation
function validateContactForm() {
    let isValid = true;
    
    // Name validation
    const name = document.getElementById('name');
    if (!name.value.trim()) {
        showError(name, 'Name is required');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showError(name, 'Name must be at least 2 characters');
        isValid = false;
    }

    // Email validation
    const email = document.getElementById('email');
    if (!email.value.trim()) {
        showError(email, 'Email is required');
        isValid = false;
    } else if (!validateEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }

    // Phone validation (optional but if provided, should be valid)
    const phone = document.getElementById('phone');
    if (phone.value.trim() && !validatePhone(phone.value)) {
        showError(phone, 'Please enter a valid phone number');
        isValid = false;
    }

    // Subject validation
    const subject = document.getElementById('subject');
    if (!subject.value) {
        showError(subject, 'Please select a subject');
        isValid = false;
    }

    // Message validation
    const message = document.getElementById('message');
    if (!message.value.trim()) {
        showError(message, 'Message is required');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showError(message, 'Message must be at least 10 characters');
        isValid = false;
    }

    // Terms validation
    const terms = document.getElementById('terms');
    if (!terms.checked) {
        showError(terms, 'You must agree to the terms and conditions');
        isValid = false;
    }

    return isValid;
}

// Individual field validation
function validateField(field) {
    clearError(field);
    
    switch(field.id) {
        case 'name':
            if (!field.value.trim()) {
                showError(field, 'Name is required');
            } else if (field.value.trim().length < 2) {
                showError(field, 'Name must be at least 2 characters');
            }
            break;
        case 'email':
            if (!field.value.trim()) {
                showError(field, 'Email is required');
            } else if (!validateEmail(field.value)) {
                showError(field, 'Please enter a valid email address');
            }
            break;
        case 'phone':
            if (field.value.trim() && !validatePhone(field.value)) {
                showError(field, 'Please enter a valid phone number');
            }
            break;
        case 'subject':
            if (!field.value) {
                showError(field, 'Please select a subject');
            }
            break;
        case 'message':
            if (!field.value.trim()) {
                showError(field, 'Message is required');
            } else if (field.value.trim().length < 10) {
                showError(field, 'Message must be at least 10 characters');
            }
            break;
    }
}

// Phone validation function
function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Show error message
function showError(field, message) {
    const errorElement = document.getElementById(field.id + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    field.style.borderColor = '#dc3545';
}

// Clear error message
function clearError(field) {
    const errorElement = document.getElementById(field.id + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    field.style.borderColor = '#ddd';
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease-out;
        max-width: 350px;
    `;

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);

    // Close button functionality
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });

    // Add CSS animations if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Animate counter function
function animateCounter(element) {
    const finalValue = element.textContent;
    const numericValue = parseInt(finalValue.replace(/\D/g, ''));
    const suffix = finalValue.replace(/[\d,]/g, '');
    
    let currentValue = 0;
    const increment = numericValue / 50;
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= numericValue) {
            element.textContent = finalValue;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentValue).toLocaleString() + suffix;
        }
    }, 50);
}

// Dark mode toggle (bonus feature)
function createDarkModeToggle() {
    const toggle = document.createElement('button');
    toggle.innerHTML = '<i class="fas fa-moon"></i>';
    toggle.className = 'dark-mode-toggle';
    toggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(toggle);

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            toggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('darkMode', 'disabled');
            toggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });

    // Add dark mode styles
    if (!document.querySelector('#dark-mode-styles')) {
        const darkStyles = document.createElement('style');
        darkStyles.id = 'dark-mode-styles';
        darkStyles.textContent = `
            .dark-mode {
                background-color: #121212 !important;
                color: #ffffff !important;
            }
            .dark-mode .navbar,
            .dark-mode .feature-card,
            .dark-mode .course-card,
            .dark-mode .team-member,
            .dark-mode .category-item,
            .dark-mode .faq-item,
            .dark-mode .contact-form-container,
            .dark-mode .values-table {
                background-color: #1e1e1e !important;
                color: #ffffff !important;
            }
            .dark-mode .values-table th {
                background-color: #007bff !important;
            }
            .dark-mode .page-header,
            .dark-mode .hero {
                background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%) !important;
            }
            .dark-mode input,
            .dark-mode select,
            .dark-mode textarea {
                background-color: #2a2a2a !important;
                color: #ffffff !important;
                border-color: #444 !important;
            }
        `;
        document.head.appendChild(darkStyles);
    }
}

// Image lazy loading
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
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
}

// Initialize lazy loading if images with data-src exist
if (document.querySelectorAll('img[data-src]').length > 0) {
    lazyLoadImages();
}

// Form auto-save (bonus feature for contact form)
function initAutoSave() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        
        // Load saved data
        inputs.forEach(input => {
            const savedValue = localStorage.getItem(`form_${input.id}`);
            if (savedValue && input.type !== 'checkbox') {
                input.value = savedValue;
            } else if (savedValue && input.type === 'checkbox') {
                input.checked = savedValue === 'true';
            }
        });

        // Save data on input
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.type === 'checkbox') {
                    localStorage.setItem(`form_${input.id}`, input.checked);
                } else {
                    localStorage.setItem(`form_${input.id}`, input.value);
                }
            });
        });

        // Clear saved data on successful submission
        contactForm.addEventListener('submit', () => {
            inputs.forEach(input => {
                localStorage.removeItem(`form_${input.id}`);
            });
        });
    }
}

// Initialize auto-save
initAutoSave();

// Add loading states to buttons
document.querySelectorAll('button[type="submit"], .btn-primary').forEach(button => {
    button.addEventListener('click', function() {
        if (this.type === 'submit') {
            const originalText = this.textContent;
            this.textContent = 'Sending...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 2000);
        }
    });
});
