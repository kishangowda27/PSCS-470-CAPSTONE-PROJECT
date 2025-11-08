-- Add target_role column to user_profiles table
-- Run this SQL in your Supabase SQL Editor

-- Check if column exists, if not add it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'user_profiles' 
    AND column_name = 'target_role'
  ) THEN
    ALTER TABLE public.user_profiles 
    ADD COLUMN target_role text DEFAULT '';
    
    RAISE NOTICE 'target_role column added successfully';
  ELSE
    RAISE NOTICE 'target_role column already exists';
  END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_profiles'
AND column_name = 'target_role';

