# Troubleshooting Sign Up Issues

## Common Issues and Solutions

### Issue 1: Account Not Being Created

**Symptoms:**
- No error message shown
- User data not appearing in Supabase
- No confirmation email received

**Solutions:**

1. **Check Browser Console**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for error messages when signing up
   - Check for messages like "Sign up successful" or "Sign up error"

2. **Check Supabase Dashboard**
   - Go to Authentication → Users
   - Check if user was created (even if email not confirmed)
   - Check Authentication → Logs for any errors

3. **Verify Email Confirmation Settings**
   - Go to Authentication → Settings
   - Check "Confirm email" setting
   - If set to "Enabled (required)", users must verify email before signing in
   - If set to "Disabled", users can sign in immediately

### Issue 2: Email Not Being Sent

**Symptoms:**
- Account created but no email received
- Email in spam folder

**Solutions:**

1. **Check Email Configuration**
   - Go to Authentication → Settings
   - Verify email provider is configured
   - Check if using Supabase default email or custom SMTP

2. **Check Email Templates**
   - Go to Authentication → Email Templates
   - Select "Confirm signup" template
   - Verify template is not empty
   - Make sure it includes `{{ .ConfirmationURL }}`

3. **Check Spam Folder**
   - Check your email spam/junk folder
   - Add Supabase emails to whitelist

4. **Verify Email Address**
   - Make sure you're using a valid email address
   - Try with a different email provider (Gmail, Outlook, etc.)

### Issue 3: User Data Not Stored in Supabase

**Symptoms:**
- User created in auth.users but no profile in user_profiles table

**Solutions:**

1. **Check Database Trigger**
   - Go to Database → Functions
   - Verify `handle_new_user()` function exists
   - Go to Database → Triggers
   - Verify `on_auth_user_created` trigger exists

2. **Run Migration Manually**
   - Go to SQL Editor in Supabase
   - Run the migration file: `20250922180000_auto_create_profile.sql`
   - This creates the trigger to auto-create profiles

3. **Check RLS Policies**
   - Go to Database → Tables → user_profiles
   - Check RLS policies are enabled
   - Verify policies allow authenticated users to insert

4. **Check Console Logs**
   - Open browser console
   - Look for "Profile created successfully" or "Profile creation error"
   - Check for any RLS policy errors

### Issue 4: Email Confirmation Required

**Symptoms:**
- User created but cannot sign in
- Error: "Email not confirmed"

**Solutions:**

1. **Temporarily Disable Email Confirmation (for testing)**
   - Go to Authentication → Settings
   - Set "Confirm email" to "Disabled"
   - Users can sign in immediately after sign up
   - **Note:** Re-enable for production!

2. **Or Verify Email**
   - Check email inbox for verification link
   - Click the link to verify account
   - Then try signing in

### Issue 5: RLS Policy Errors

**Symptoms:**
- Console shows "new row violates row-level security policy"
- Profile creation fails

**Solutions:**

1. **Verify Trigger Permissions**
   - The trigger uses `SECURITY DEFINER` which bypasses RLS
   - Make sure the trigger function is correct

2. **Check User Authentication Status**
   - Even if email not confirmed, user should exist in auth.users
   - The trigger should still work

3. **Manual Profile Creation**
   - If trigger fails, profile should be created by code
   - Check console for "Profile created successfully" message

## Step-by-Step Debugging

1. **Open Browser Console**
   ```
   F12 → Console tab
   ```

2. **Try Signing Up**
   - Enter email, password, and name
   - Click "Create Account"
   - Watch console for messages

3. **Check Console Messages**
   - Should see: "Starting sign up for: [email]"
   - Should see: "Sign up successful, user created: [user-id]"
   - Should see: "Profile created successfully" or "Profile already exists"

4. **Check Supabase Dashboard**
   - Authentication → Users → Should see new user
   - Database → Tables → user_profiles → Should see profile

5. **Check Email**
   - Inbox and spam folder
   - Should receive verification email

## Quick Fixes

### Fix 1: Disable Email Confirmation (Testing Only)
```
1. Go to Supabase Dashboard
2. Authentication → Settings
3. Set "Confirm email" to "Disabled"
4. Save
5. Try signing up again
```

### Fix 2: Re-run Database Trigger
```sql
-- Run this in Supabase SQL Editor
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Fix 3: Check Email Template
```
1. Go to Authentication → Email Templates
2. Select "Confirm signup"
3. Make sure template includes:
   {{ .ConfirmationURL }}
4. Save template
```

## Still Having Issues?

1. Check Supabase logs: Authentication → Logs
2. Check browser network tab for failed requests
3. Verify Supabase project URL and keys are correct
4. Check if email provider is configured correctly
5. Try with a different email address

