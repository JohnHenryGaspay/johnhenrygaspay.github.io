# Contact Form Email Setup Guide

## Overview
Your contact form has been converted from PHP to JavaScript using EmailJS. This allows your form to send emails directly to your Gmail without needing a PHP server, which is perfect for GitHub Pages hosting.

## Setup Steps

### 1. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### 2. Add Gmail Service
1. In EmailJS Dashboard, go to **Email Services**
2. Click **Add New Service**
3. Select **Gmail**
4. Click **Connect Account** and authenticate with your Gmail
5. Give it a Service name (e.g., "gmail_service")
6. Copy the **Service ID** (you'll need this later)
7. Click **Create Service**

### 3. Create Email Template
1. In EmailJS Dashboard, go to **Email Templates**
2. Click **Create New Template**
3. Use this template structure:

   **Template Name:** contact_form
   
   **Subject:** New Contact Form Submission from {{from_name}}
   
   **Content:**
   ```
   You have received a new message from your website contact form:

   Name: {{from_name}}
   Email: {{from_email}}
   
   Message:
   {{message}}
   
   ---
   This message was sent via your website contact form.
   ```

4. Set **To Email** to `{{to_email}}` (or your specific Gmail address)
5. Click **Save**
6. Copy the **Template ID** (you'll need this later)

### 4. Get Your Public Key
1. In EmailJS Dashboard, go to **Account** (in the sidebar)
2. Go to **General** tab
3. Find your **Public Key** (it looks like: "user_xxxxxxxxxxxxx")
4. Copy this key

### 5. Update sendEmail.js
Open `js/sendEmail.js` and update the configuration at the top:

```javascript
const EMAILJS_CONFIG = {
    publicKey: 'YOUR_PUBLIC_KEY',      // Replace with your actual Public Key
    serviceId: 'YOUR_SERVICE_ID',      // Replace with your Service ID (e.g., 'gmail_service')
    templateId: 'YOUR_TEMPLATE_ID'     // Replace with your Template ID
};

// Also update line 39 with your email:
to_email: 'your-email@gmail.com'  // Replace with your actual Gmail address
```

### 6. Test Your Form
1. Open `index.html` in a web browser
2. Scroll to the Contact section
3. Fill in the form with test data
4. Click "Send"
5. You should see a success message and receive an email at your Gmail

## What Was Changed

### Created Files:
- **js/sendEmail.js** - New JavaScript file that handles form submission and email sending

### Modified Files:
- **index.html** - Updated to:
  - Removed PHP include reference
  - Wrapped form fields in a proper `<form>` tag
  - Added EmailJS library script
  - Added sendEmail.js script

## Features

✅ **Client-side email sending** - Works on GitHub Pages (no server needed)
✅ **Form validation** - Checks for valid name, email, and message
✅ **User feedback** - Shows success/error notifications using toastr
✅ **Loading state** - Button shows "Sending..." during submission
✅ **Email format validation** - Ensures valid email addresses
✅ **Auto-reset** - Form clears after successful submission

## Free Tier Limits
EmailJS free plan includes:
- 200 emails per month
- 2 email services
- 2 email templates

This should be sufficient for a portfolio contact form. If you need more, you can upgrade to a paid plan.

## Troubleshooting

### Form not sending?
1. Check browser console (F12) for errors
2. Verify all IDs in `EMAILJS_CONFIG` are correct
3. Make sure you're connected to the internet
4. Check EmailJS dashboard for error logs

### Not receiving emails?
1. Check your Gmail spam folder
2. Verify the "To Email" is correct in your EmailJS template
3. Check EmailJS dashboard > Email Services > Make sure Gmail is connected

### Validation errors?
- Name must be at least 2 characters
- Email must be valid format
- Message must be at least 10 characters

## Alternative Solutions

If you prefer not to use EmailJS, here are alternatives:

1. **Formspree** - Similar service, easier setup but shows Formspree branding on free tier
2. **Netlify Forms** - Built-in form handling if you host on Netlify
3. **Google Forms** - Embed a Google Form (less customizable)
4. **Backend API** - Create your own API with Node.js/Express on Heroku/Vercel

## Support

If you need help:
- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: https://www.emailjs.com/contact/

---

**Note:** Remember to never commit your EmailJS credentials to public repositories. Consider using environment variables or keeping sensitive config in a separate, gitignored file for production.
