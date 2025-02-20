/*
  # Fix welcome messages table constraints

  1. Changes
    - Add unique constraint on organization_id to prevent duplicates
    - Drop existing data to ensure clean state
    - Re-create default welcome messages

  2. Security
    - Maintain existing RLS policies
*/

-- First, drop existing data to ensure clean state
TRUNCATE TABLE welcome_messages;

-- Add unique constraint on organization_id
ALTER TABLE welcome_messages 
DROP CONSTRAINT IF EXISTS welcome_messages_organization_id_key,
ADD CONSTRAINT welcome_messages_organization_id_key UNIQUE (organization_id);

-- Insert default welcome message for each organization
INSERT INTO welcome_messages (organization_id, content)
SELECT 
  id as organization_id,
  'Welcome to PerformancePro! This platform helps you track and improve your performance through goal setting and evaluations. Contact your administrator to learn more about using the system effectively.'
FROM organizations
ON CONFLICT (organization_id) 
DO UPDATE SET 
  content = EXCLUDED.content,
  updated_at = now()
WHERE welcome_messages.content IS NULL;
