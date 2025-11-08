# Database Setup Instructions

## Fix: Add target_role Column

You're getting an error because the `target_role` column doesn't exist in your `user_profiles` table. Follow these steps to fix it:

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run the Migration SQL

Copy and paste this SQL into the SQL Editor:

```sql
-- Add target_role column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS target_role text DEFAULT '';
```

### Step 3: Execute the SQL

1. Click **Run** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
2. You should see a success message: "Success. No rows returned"

### Step 4: Verify the Column

Run this query to verify the column was added:

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_profiles'
AND column_name = 'target_role';
```

You should see the `target_role` column in the results.

### Alternative: Run All Migrations

If you want to run all migrations at once, you can run the migration file:

1. Open the file: `supabase/migrations/20250922190000_add_target_role.sql`
2. Copy its contents
3. Paste into Supabase SQL Editor
4. Run it

## Quick Fix SQL

If you just want to add the column quickly, run this:

```sql
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS target_role text DEFAULT '';
```

## After Adding the Column

1. Refresh your application
2. Try saving your profile again
3. The error should be gone

## Troubleshooting

### Error: "permission denied"
- Make sure you're running the SQL as a database administrator
- Check that you have the correct permissions in Supabase

### Error: "column already exists"
- The column is already added, you can ignore this error
- Refresh your application and try again

### Still Getting Errors
1. Check the Supabase table structure:
   - Go to **Table Editor** → **user_profiles**
   - Verify `target_role` column exists
2. Clear browser cache and refresh
3. Check browser console for any other errors

