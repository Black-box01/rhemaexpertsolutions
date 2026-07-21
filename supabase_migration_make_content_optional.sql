-- ============================================
-- MIGRATION: Make content field OPTIONAL in staff notes
-- ============================================
-- This migration makes the content field nullable to allow notes with just attachments

-- Alter the content column to allow NULL values
ALTER TABLE rhema_staff_notes 
ALTER COLUMN content DROP NOT NULL;

-- Add a comment to document the change
COMMENT ON COLUMN rhema_staff_notes.content IS 'Optional note content - can be null when note has only attachments';

-- ============================================
-- To apply this migration:
-- 1. Go to Supabase Dashboard > SQL Editor
-- 2. Copy and paste this file
-- 3. Click "Run"
-- ============================================
