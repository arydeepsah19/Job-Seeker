/*
  # Add recruiter email to jobs table

  1. Changes
    - Add `recruiter_email` column to jobs table to store recruiter's email
    - This will help with notifications without additional joins

  2. Notes
    - This field will be populated when jobs are created
    - Used for sending notifications to recruiters
*/

-- Add recruiter_email column to jobs table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'recruiter_email'
  ) THEN
    ALTER TABLE jobs ADD COLUMN recruiter_email text;
  END IF;
END $$;