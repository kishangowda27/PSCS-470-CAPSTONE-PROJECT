/*
  # Create chat messages table

  1. New Tables
    - `chat_messages`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `message` (text)
      - `sender` (text) - 'user' or 'ai'
      - `timestamp` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `chat_messages` table
    - Add policy for users to read and insert their own messages
*/

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  sender text NOT NULL CHECK (sender IN ('user', 'ai')),
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS chat_messages_user_id_timestamp_idx ON chat_messages(user_id, timestamp);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);