/*
  # Create user skills table

  1. New Tables
    - `user_skills`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `skill_name` (text)
      - `category` (text)
      - `progress` (integer, 0-100)
      - `is_completed` (boolean)
      - `priority` (text) - 'high', 'medium', 'low'
      - `estimated_time` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_skills` table
    - Add policies for users to manage their own skills
*/

CREATE TABLE IF NOT EXISTS user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  skill_name text NOT NULL,
  category text DEFAULT '',
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  is_completed boolean DEFAULT false,
  priority text DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  estimated_time text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unique index on user_id and skill_name
CREATE UNIQUE INDEX IF NOT EXISTS user_skills_user_id_skill_name_idx ON user_skills(user_id, skill_name);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS user_skills_user_id_idx ON user_skills(user_id);

-- Enable RLS
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own skills"
  ON user_skills
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills"
  ON user_skills
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills"
  ON user_skills
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills"
  ON user_skills
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_skills_updated_at
  BEFORE UPDATE ON user_skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();