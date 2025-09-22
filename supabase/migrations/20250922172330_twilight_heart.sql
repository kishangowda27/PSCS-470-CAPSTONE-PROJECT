/*
  # Create user events table

  1. New Tables
    - `user_events`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `event_title` (text)
      - `event_description` (text)
      - `event_date` (date)
      - `event_time` (text)
      - `location` (text)
      - `event_type` (text)
      - `is_virtual` (boolean)
      - `registration_status` (text) - 'registered', 'attended', 'cancelled'
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `user_events` table
    - Add policies for users to manage their own event registrations
*/

CREATE TABLE IF NOT EXISTS user_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_title text NOT NULL,
  event_description text DEFAULT '',
  event_date date NOT NULL,
  event_time text DEFAULT '',
  location text DEFAULT '',
  event_type text DEFAULT '',
  is_virtual boolean DEFAULT false,
  registration_status text DEFAULT 'registered' CHECK (registration_status IN ('registered', 'attended', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS user_events_user_id_idx ON user_events(user_id);
CREATE INDEX IF NOT EXISTS user_events_event_date_idx ON user_events(event_date);

-- Enable RLS
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own events"
  ON user_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events"
  ON user_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events"
  ON user_events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own events"
  ON user_events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);