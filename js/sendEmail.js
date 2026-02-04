/**
 * Contact Form Email Handler using EmailJS
 * 
 * Setup Instructions:
 * 1. Go to https://www.emailjs.com/ and create a free account
 * 2. Add your Gmail account as an email service
 * 3. Create an email template
 * 4. Copy your Public Key, Service ID, and Template ID
 * 5. Replace the values below with your actual IDs
 */

// EmailJS Configuration - REPLACE THESE WITH YOUR ACTUAL VALUES
const EMAILJS_CONFIG = {
    publicKey: 'SJHwIcrcRELCp4g31',      // Get from EmailJS Dashboard > Account > General
    serviceId: 'service-4github-io',      // Get from EmailJS Dashboard > Email Services
    templateId: 'template-git-io'     // Get from EmailJS Dashboard > Email Templates
};

// Initialize EmailJS when the page loads
(function() {
    emailjs.init(EMAILJS_CONFIG.publicKey);
})();

/**
 * Send email via EmailJS
 * @param {Object} formData - Object containing name, email, and message
 * @returns {Promise}
 */
function sendEmail(formData) {
    const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_email: 'johnhenrygaspay@gmail.com'  // REPLACE with your actual Gmail address
    };

    return emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
    );
}

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate form data
 * @param {Object} formData
 * @returns {Object} { isValid: boolean, errors: array }
 */
function validateForm(formData) {
    const errors = [];

    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('Please enter a valid name (at least 2 characters)');
    }

    if (!formData.email || !isValidEmail(formData.email)) {
        errors.push('Please enter a valid email address');
    }

    if (!formData.message || formData.message.trim().length < 10) {
        errors.push('Please enter a message (at least 10 characters)');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Show notification message
 * @param {string} type - 'success' or 'error'
 * @param {string} message
 */
function showNotification(type, message) {
    // Using toastr (already loaded in your page)
    if (typeof toastr !== 'undefined') {
        toastr[type](message);
    } else {
        alert(message);
    }
}

/**
 * Reset form fields
 */
function resetForm() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('comments').value = '';
}

/**
 * Handle form submission
 * @param {Event} e
 */
function handleFormSubmit(e) {
    e.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('comments').value
    };

    // Validate form
    const validation = validateForm(formData);
    if (!validation.isValid) {
        validation.errors.forEach(error => {
            showNotification('error', error);
        });
        return;
    }

    // Get submit button
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';

    // Send email
    sendEmail(formData)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showNotification('success', 'Message sent successfully! I will get back to you within 24 hours.');
            resetForm();
        })
        .catch(function(error) {
            console.error('FAILED...', error);
            showNotification('error', 'Failed to send message. Please try again or contact me via WhatsApp.');
        })
        .finally(function() {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        });
}

// Initialize form handler when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.addEventListener('click', handleFormSubmit);
    }
});
