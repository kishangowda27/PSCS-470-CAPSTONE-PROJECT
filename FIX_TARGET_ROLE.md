# Quick Fix: Add target_role Column

## The Problem
You're seeing this error: **"Could not find the 'target_role' column of 'user_profiles' in the schema cache"**

This means the database column doesn't exist yet. You need to add it.

## Quick Solution (2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left menu
4. Click **New Query**

### Step 2: Copy and Paste This SQL
```sql
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS target_role text DEFAULT '';
```

### Step 3: Run It
- Click the **Run** button (or press `Ctrl+Enter`)
- You should see: "Success. No rows returned"

### Step 4: Refresh Your App
- Go back to your application
- Refresh the page
- Try saving your profile again

## That's It! ✅

The error should now be fixed. You can now save your target role in the onboarding/profile page.

## Verify It Worked

To verify the column was added, run this in SQL Editor:

```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name = 'target_role';
```

You should see `target_role` in the results.

## Need More Help?

See `DATABASE_SETUP.md` for more detailed instructions.

