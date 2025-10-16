# EmailJS Setup Instructions for PennJets Contact Form

This guide will help you configure EmailJS to receive contact form submissions at info@pennjets.com.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add Email Service

### IMPORTANT: Gmail Users - Read This First!

If you're using Gmail (info@pennjets.com), you may encounter the error:
**"412 Gmail_API: Request had insufficient authentication scopes"**

This happens because Gmail requires special OAuth permissions. Here are your options:

### Option A: Use EmailJS Built-in Email Service (RECOMMENDED - Easiest)

1. In the EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. **Select "EmailJS" (NOT Gmail)** - This is EmailJS's own email service
4. Set these fields:
   - **Service Name:** PennJets Contact
   - **From Email:** Use the default EmailJS email or customize
   - **From Name:** PennJets
5. Note down your **Service ID** (e.g., `service_abc123`)

**Advantages:** No OAuth setup, works immediately, reliable delivery

### Option B: Use Gmail with App Password (If you must use Gmail)

1. In the EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Select **Gmail**
4. **STOP** - Before continuing, set up a Gmail App Password:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification if not already enabled
   - Go to "App passwords"
   - Generate a new app password for "Mail"
   - Copy the 16-character password
5. Back in EmailJS, connect Gmail using the app password
6. Note down your **Service ID**

### Option C: Reconnect Gmail Service (If you already tried Gmail)

If you've already added Gmail and got the error:

1. Go to **Email Services** in EmailJS dashboard
2. **Delete** the existing Gmail service
3. Click **Add New Service**
4. Choose **EmailJS built-in service** (Option A above)
5. Configure as shown above

## Step 3: Create Email Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Set the template name: `PennJets Contact Form`
4. Configure the template with these settings:

### Template Content:

**Subject Line:**
```
New Contact Form Submission from {{from_name}}
```

**Email Body:**
```
You have received a new inquiry from the PennJets website.

Contact Details:
-----------------
Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Company: {{company}}
Service Interest: {{service}}

Message:
-----------------
{{message}}

-----------------
This message was sent via the PennJets contact form.
Reply directly to this email to respond to {{from_name}}.
```

### Template Settings:
- **To Email:** info@pennjets.com
- **From Name:** {{from_name}}
- **Reply To:** {{from_email}}

5. Click **Save** and note down your **Template ID** (e.g., `template_xyz789`)

## Step 4: Get Your Public Key

1. Go to **Account** > **General** in the dashboard
2. Find your **Public Key** (e.g., `abcdefghij1234567`)
3. Copy this key

## Step 5: Configure Environment Variables

1. Create a `.env` file in the project root directory:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your EmailJS credentials:
   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id_here
   VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
   VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
   ```

3. Replace the placeholder values with your actual IDs from the previous steps

## Step 6: Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Contact page
3. Fill out and submit the contact form
4. Check info@pennjets.com for the test email

## Free Tier Limits

EmailJS free tier includes:
- 200 emails per month
- Basic features
- No credit card required

If you need more emails, consider upgrading to a paid plan.

## Troubleshooting

### Gmail Error: "412 Gmail_API: Request had insufficient authentication scopes"

**Quick Fix:**
1. Go to EmailJS dashboard → Email Services
2. Delete the Gmail service
3. Add **EmailJS built-in email service** instead (see Step 2, Option A)
4. Update the Service ID in your `.env` file
5. Restart dev server and test again

This is the most common error and is fixed by using EmailJS's own email service rather than connecting Gmail directly.

### Form submission fails
- Check that all three environment variables are set correctly
- Verify the service and template IDs in the EmailJS dashboard
- Check browser console for error messages
- Make sure you restarted the dev server after adding `.env` file

### Emails not arriving at info@pennjets.com
- Check spam/junk folder in info@pennjets.com inbox
- Verify template settings in EmailJS dashboard
- Ensure "To Email" is set to info@pennjets.com in the template
- Check EmailJS dashboard for delivery logs under "History"
- Test with EmailJS's "Test it" button in the template editor first

### Environment variables not loading
- Ensure `.env` file is in the project root (same level as package.json)
- Restart the development server after creating/modifying `.env`
- Verify variable names start with `VITE_` prefix (Vite requirement)
- Check for typos in variable names

## Security Notes

- Never commit the `.env` file to git (it's already in .gitignore)
- Keep your EmailJS credentials private
- For production deployment, set environment variables in your hosting platform
- Consider enabling reCAPTCHA in EmailJS to prevent spam

## Production Deployment

When deploying to production:

1. Set environment variables in your hosting platform (Netlify, Vercel, etc.)
2. Do NOT include the `.env` file in your deployment
3. Verify emails are being delivered to info@pennjets.com
4. Monitor EmailJS usage in the dashboard

## Support

For EmailJS support, visit: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
