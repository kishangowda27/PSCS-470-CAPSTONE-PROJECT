/*
  # Create career goals table

  1. New Tables
    - `career_goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `goal_title` (text)
      - `goal_description` (text)
      - `target_role` (text)
      - `target_company` (text, optional)
      - `target_salary` (text, optional)
      - `timeline` (text)
      - `status` (text) - 'active', 'completed', 'paused'
      - `progress` (integer, 0-100)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `career_goals` table
    - Add policies for users to manage their own goals
*/

CREATE TABLE IF NOT EXISTS career_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  goal_title text NOT NULL,
  goal_description text DEFAULT '',
  target_role text DEFAULT '',
  target_company text DEFAULT '',
  target_salary text DEFAULT '',
  timeline text DEFAULT '',
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS career_goals_user_id_idx ON career_goals(user_id);

-- Enable RLS
ALTER TABLE career_goals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own goals"
  ON career_goals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON career_goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON career_goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON career_goals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_career_goals_updated_at
  BEFORE UPDATE ON career_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();