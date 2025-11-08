/*
  # Add target_role column to user_profiles

  1. Add target_role column to user_profiles table
  2. This allows users to set their target career role for personalized guidance
*/

-- Add target_role column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND column_name = 'target_role'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN target_role text DEFAULT '';
  END IF;
END $$;

