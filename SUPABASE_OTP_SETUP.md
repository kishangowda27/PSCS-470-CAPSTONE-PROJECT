# Supabase Email Configuration Guide

## Overview

This guide covers configuring Supabase to send:

1. **Email Verification** - Sent when users create a new account
2. **OTP Codes** - Sent for password reset (instead of magic links)

## Part 1: Email Verification for Sign Up

### Problem

When users create a new account, they should receive a verification email to confirm their email address.

### Solution: Enable Email Confirmation

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **Authentication** → **Settings**
3. Under **Email Auth**, ensure:
   - **Enable Email Signup** is enabled ✅
   - **Enable Email Confirmations** is enabled ✅
   - **Confirm email** is set to "Enabled" (required)

### Configure Email Template for Sign Up

1. Go to **Authentication** → **Email Templates**
2. Select **Confirm signup** template
3. Update the template to include a clear verification link:

```html
<h2>Welcome! Please confirm your email</h2>
<p>Click the link below to verify your email address:</p>
<p><a href="{{ .ConfirmationURL }}">Verify Email Address</a></p>
<p>Or copy and paste this URL into your browser:</p>
<p>{{ .ConfirmationURL }}</p>
<p>This link expires in 24 hours.</p>
<p>If you didn't create an account, please ignore this email.</p>
```

4. Save the template

### How It Works

- When a user signs up, Supabase automatically sends a verification email
- User clicks the link in the email to verify their account
- After verification, user can sign in normally

---

## Part 2: OTP Codes for Password Reset

### Problem

By default, Supabase sends magic links instead of OTP codes. To enable OTP codes for password reset, you need to configure the email templates in your Supabase dashboard.

## Solution: Configure Email Template in Supabase Dashboard

### Step 1: Access Email Templates

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **Authentication** → **Email Templates**
3. Find the **Magic Link** template (this is used for OTP)

### Step 2: Update the Email Template

Replace the email template content with the following to show OTP codes:

```html
<h2>Password Reset Code</h2>
<p>Use the following code to reset your password:</p>
<h1
  style="font-size: 32px; letter-spacing: 8px; text-align: center; margin: 20px 0;"
>
  {{ .Token }}
</h1>
<p>This code expires in 5 minutes.</p>
<p>If you didn't request this code, please ignore this email.</p>
```

### Step 3: Alternative - Use OTP Template

If your Supabase project has an OTP-specific template:

1. Go to **Authentication** → **Email Templates**
2. Select **OTP** template
3. Make sure it displays `{{ .Token }}` which is the 6-digit OTP code

### Step 4: Verify Configuration

1. Go to **Authentication** → **Settings**
2. Under **Email Auth**, ensure:
   - **Enable Email Signup** is enabled
   - **Enable Email OTP** is enabled (if available)
   - **Enable Magic Link** can be disabled if you only want OTP

### Step 5: Test

1. Try the forgot password flow in your application
2. Check your email - you should receive a 6-digit OTP code instead of a magic link
3. Enter the OTP code in the application
4. Reset your password

## Important Notes

- The `{{ .Token }}` variable in the email template contains the 6-digit OTP code
- OTP codes typically expire after 5-10 minutes (configurable in Supabase settings)
- Make sure your email provider is configured correctly in Supabase
- If you're using a custom SMTP, ensure it's properly configured

## Troubleshooting

If you're still receiving magic links:

1. Check that the email template uses `{{ .Token }}` instead of `{{ .ConfirmationURL }}`
2. Verify that OTP is enabled in Authentication settings
3. Clear browser cache and try again
4. Check Supabase logs for any errors

## Code Implementation

The code in `src/lib/supabase.js` uses `signInWithOtp` which will send OTP codes when the email template is configured correctly. The OTP code will be sent to the user's email, and they can enter it in the forgot password flow.
