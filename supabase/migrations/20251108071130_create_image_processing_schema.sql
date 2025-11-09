/*
  # Image Processing Application Schema

  1. New Tables
    - `user_images`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `original_name` (text)
      - `file_size` (bigint)
      - `width` (integer)
      - `height` (integer)
      - `format` (text)
      - `image_data` (text) - base64 encoded image
      - `created_at` (timestamptz)
    
    - `operation_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `image_id` (uuid, references user_images)
      - `operation_type` (text) - contrast, threshold, blur, etc.
      - `parameters` (jsonb) - operation parameters
      - `timestamp` (timestamptz)
      - `execution_time_ms` (integer)
    
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `created_at` (timestamptz)
      - `last_login` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create user_images table
CREATE TABLE IF NOT EXISTS user_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  original_name text NOT NULL,
  file_size bigint NOT NULL,
  width integer NOT NULL,
  height integer NOT NULL,
  format text NOT NULL,
  image_data text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own images"
  ON user_images FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own images"
  ON user_images FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own images"
  ON user_images FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create operation_logs table
CREATE TABLE IF NOT EXISTS operation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_id uuid REFERENCES user_images(id) ON DELETE CASCADE,
  operation_type text NOT NULL,
  parameters jsonb DEFAULT '{}'::jsonb,
  timestamp timestamptz DEFAULT now(),
  execution_time_ms integer DEFAULT 0
);

ALTER TABLE operation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own operation logs"
  ON operation_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own operation logs"
  ON operation_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_images_user_id ON user_images(user_id);
CREATE INDEX IF NOT EXISTS idx_operation_logs_user_id ON operation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_operation_logs_image_id ON operation_logs(image_id);
CREATE INDEX IF NOT EXISTS idx_operation_logs_timestamp ON operation_logs(timestamp DESC);
