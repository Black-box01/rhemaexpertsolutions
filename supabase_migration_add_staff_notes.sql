-- Create table for staff e-notes
CREATE TABLE IF NOT EXISTS rhema_staff_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT,
  author TEXT NOT NULL,
  category TEXT DEFAULT 'general', -- general, student, admin, urgent, announcement
  priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
  status TEXT DEFAULT 'active', -- active, archived
  tags TEXT[] DEFAULT '{}',
  file_urls TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT FALSE
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_staff_notes_created_at ON rhema_staff_notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_staff_notes_status ON rhema_staff_notes(status);
CREATE INDEX IF NOT EXISTS idx_staff_notes_category ON rhema_staff_notes(category);
CREATE INDEX IF NOT EXISTS idx_staff_notes_priority ON rhema_staff_notes(priority);

ALTER TABLE rhema_staff_notes ENABLE ROW LEVEL SECURITY;

-- Policy: Service role (admin) can do all operations
CREATE POLICY "Allow service role all on staff_notes"
  ON rhema_staff_notes FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for e-note attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('staff-notes', 'staff-notes', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Allow uploads to staff-notes bucket
CREATE POLICY "Allow authenticated uploads to staff-notes"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'staff-notes');

CREATE POLICY "Allow public read from staff-notes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'staff-notes');
