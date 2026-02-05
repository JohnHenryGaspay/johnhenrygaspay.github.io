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
    serviceId: 'service_hc4iyvc',      // Get from EmailJS Dashboard > Email Services
    templateId: 'template-git-io'     // Get from EmailJS Dashboard > Email Templates
};

// Don't initialize EmailJS here - wait for DOM to be ready

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
    // More strict email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email.trim());
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
        errors.push('Please enter a valid email address (e.g., name@example.com)');
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
    console.log('showNotification called:', type, message);
    
    // Using toastr (already loaded in your page)
    if (typeof toastr !== 'undefined') {
        console.log('Toastr is available');
        toastr.options = {
            "closeButton": true,
            "progressBar": true,
            "timeOut": type === 'success' ? "5000" : "3000",
            "positionClass": "toast-top-right",
            "enableHtml": true
        };
        toastr[type](message);
        console.log('Toastr notification shown');
    } else {
        console.log('Toastr not available, using alert');
        alert(message);
    }
}

/**
 * Show thank you modal/message
 * @param {string} name - User's name
 */
function showThankYouMessage(name) {
    console.log('showThankYouMessage called with name:', name);
    
    try {
        // Set the name in the modal
        const firstName = name.split(' ')[0]; // Get first name only
        const nameElement = document.getElementById('thankYouName');
        
        if (!nameElement) {
            console.error('thankYouName element not found!');
            alert('Thank you, ' + firstName + '! Your message has been sent successfully. I will get back to you within 24 hours.');
            return;
        }
        
        nameElement.textContent = 'Thank You, ' + firstName + '!';
        console.log('Name set in modal');
        
        // Check if jQuery is available
        if (typeof $ !== 'undefined' && $.fn.modal) {
            console.log('jQuery modal available, showing modal...');
            $('#thankYouModal').modal('show');
        } else {
            console.error('jQuery or Bootstrap modal not available!');
            // Fallback to alert
            alert('Thank you, ' + firstName + '! Your message has been sent successfully. I will get back to you within 24 hours.');
        }
        
        console.log('Modal should be visible now');
    } catch (error) {
        console.error('Error in showThankYouMessage:', error);
        alert('Thank you! Your message has been sent successfully.');
    }
}

/**
 * Send WhatsApp notification (opens WhatsApp with pre-filled message)
 * @param {Object} formData
 */
function sendWhatsAppNotification(formData) {
    const whatsappNumber = '+639706556707';
    const message = `New contact form submission:\n\nName: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    
    // Open in new tab (optional - you can comment this out if you don't want auto-open)
    // window.open(whatsappUrl, '_blank');
    
    console.log('WhatsApp notification URL:', whatsappUrl);
}

/**
 * Reset form fields
 */
function resetForm() {
    console.log('resetForm called');
    
    try {
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const commentsField = document.getElementById('comments');
        
        if (nameField) {
            nameField.value = '';
            console.log('Name field cleared');
        }
        if (emailField) {
            emailField.value = '';
            console.log('Email field cleared');
        }
        if (commentsField) {
            commentsField.value = '';
            console.log('Comments field cleared');
        }
        
        console.log('All form fields cleared');
    } catch (error) {
        console.error('Error clearing form:', error);
    }
}

/**
 * Handle form submission
 * @param {Event} e
 */
function handleFormSubmit(e) {
    e.preventDefault();
    console.log('Form submitted!');

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('comments').value
    };

    console.log('Form data:', formData);

    // Validate form
    const validation = validateForm(formData);
    if (!validation.isValid) {
        console.log('Validation failed:', validation.errors);
        validation.errors.forEach(error => {
            showNotification('error', error);
        });
        return;
    }

    // Get submit button
    const submitBtn = e.target.querySelector('button[type="submit"]') || document.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="glyphicon glyphicon-refresh glyphicon-spin"></span> Sending...';

    console.log('Sending email via EmailJS...');

    // Send email
    sendEmail(formData)
        .then(function(response) {
            console.log('✓ SUCCESS! Email sent!', response);
            
            // Store name in sessionStorage for thank you page
            sessionStorage.setItem('senderName', formData.name);
            
            // Redirect to thank you page
            console.log('Redirecting to thank you page...');
            window.location.href = 'thank-you.html';
        })
        .catch(function(error) {
            console.error('✗ Email failed - Full error object:', error);
            console.error('Error status:', error.status);
            console.error('Error text:', error.text);
            console.error('Error message:', error.message);
            
            let errorMessage = 'Failed to send message. ';
            
            // Provide more specific error messages
            if (error.text) {
                errorMessage += error.text + ' ';
            } else if (error.message) {
                errorMessage += error.message + ' ';
            }
            
            errorMessage += 'Please try again or contact me via WhatsApp.';
            
            showNotification('error', errorMessage);
        })
        .finally(function() {
            console.log('Finally block - re-enabling button');
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        });
}

// Initialize form handler when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing contact form...');
    
    // Initialize EmailJS AFTER DOM is ready
    if (typeof emailjs !== 'undefined') {
        console.log('EmailJS library found, initializing...');
        try {
            emailjs.init(EMAILJS_CONFIG.publicKey);
            console.log('EmailJS initialized successfully');
        } catch (error) {
            console.error('Error initializing EmailJS:', error);
        }
    } else {
        console.error('EmailJS library not loaded!');
        return;
    }
    
    // Check if jQuery is available
    if (typeof $ === 'undefined') {
        console.warn('jQuery not loaded yet');
    } else {
        console.log('jQuery is available');
    }
    
    // Get the form
    const form = document.getElementById('contact-form');
    if (form) {
        console.log('Contact form found, attaching event listener');
        form.addEventListener('submit', handleFormSubmit);
    } else {
        console.error('Contact form not found!');
    }
});
