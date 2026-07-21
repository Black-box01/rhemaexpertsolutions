-- ============================================
-- RHEMA EXPERT SOLUTIONS - COMPLETE DATABASE SCHEMA
-- ============================================
-- This file contains all table definitions for the Supabase backend
-- Run this in the Supabase SQL Editor to create/update all tables

-- ============================================
-- 1. SERVICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS rhema_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_created_at ON rhema_services(created_at DESC);

ALTER TABLE rhema_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role all on services"
  ON rhema_services FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 2. CLIENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS rhema_clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_created_at ON rhema_clients(created_at DESC);

ALTER TABLE rhema_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role all on clients"
  ON rhema_clients FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 3. TEAM TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS rhema_team (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_created_at ON rhema_team(created_at DESC);

ALTER TABLE rhema_team ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role all on team"
  ON rhema_team FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 4. COMPETITIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS rhema_competitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  registration_link TEXT,
  start_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_competitions_created_at ON rhema_competitions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_competitions_is_active ON rhema_competitions(is_active);

ALTER TABLE rhema_competitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role all on competitions"
  ON rhema_competitions FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 5. COMPETITION REGISTRATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS rhema_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  gender TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  school_name TEXT NOT NULL,
  class_level TEXT NOT NULL,
  category TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  payment_proof_url TEXT,
  status TEXT DEFAULT 'pending' -- pending, verified, rejected
);

CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON rhema_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON rhema_registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_category ON rhema_registrations(category);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON rhema_registrations(email);

ALTER TABLE rhema_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role all on registrations"
  ON rhema_registrations FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 6. CODING CLASS REGISTRATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS rhema_coding_class_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  gender TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  courses TEXT[] NOT NULL, -- Array of course names
  experience_level TEXT NOT NULL,
  preferred_schedule TEXT NOT NULL,
  payment_plan TEXT NOT NULL,
  additional_info TEXT,
  payment_proof_url TEXT,
  status TEXT DEFAULT 'pending' -- pending, contacted, enrolled, cancelled
);

CREATE INDEX IF NOT EXISTS idx_coding_class_reg_created_at ON rhema_coding_class_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coding_class_reg_status ON rhema_coding_class_registrations(status);
CREATE INDEX IF NOT EXISTS idx_coding_class_reg_email ON rhema_coding_class_registrations(email);

ALTER TABLE rhema_coding_class_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role all on coding_class_registrations"
  ON rhema_coding_class_registrations FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 7. PROFESSIONAL TRAININGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS rhema_professional_trainings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  gender TEXT NOT NULL,
  date_of_birth DATE,
  organization TEXT,
  job_title TEXT,
  training_program TEXT NOT NULL,
  preferred_schedule TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  payment_preference TEXT NOT NULL,
  additional_info TEXT,
  status TEXT DEFAULT 'pending' -- pending, contacted, enrolled, cancelled
);

CREATE INDEX IF NOT EXISTS idx_professional_trainings_created_at ON rhema_professional_trainings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_professional_trainings_status ON rhema_professional_trainings(status);
CREATE INDEX IF NOT EXISTS idx_professional_trainings_program ON rhema_professional_trainings(training_program);
CREATE INDEX IF NOT EXISTS idx_professional_trainings_email ON rhema_professional_trainings(email);

ALTER TABLE rhema_professional_trainings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role all on professional_trainings"
  ON rhema_professional_trainings FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 8. NEWSLETTER TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS rhema_newsletter (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_created_at ON rhema_newsletter(created_at DESC);

ALTER TABLE rhema_newsletter ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role all on newsletter"
  ON rhema_newsletter FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 9. GENERAL SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS rhema_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL UNIQUE,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_section ON rhema_content(section);

ALTER TABLE rhema_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role all on content"
  ON rhema_content FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 10. STAFF E-NOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS rhema_staff_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT, -- Content is now OPTIONAL
  author TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  priority TEXT DEFAULT 'normal',
  status TEXT DEFAULT 'active',
  is_pinned BOOLEAN DEFAULT false,
  file_urls JSONB DEFAULT '[]'::jsonb, -- Array of file objects: [{name: string, url: string}]
  author_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_staff_notes_created_at ON rhema_staff_notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_staff_notes_status ON rhema_staff_notes(status);
CREATE INDEX IF NOT EXISTS idx_staff_notes_category ON rhema_staff_notes(category);
CREATE INDEX IF NOT EXISTS idx_staff_notes_priority ON rhema_staff_notes(priority);
CREATE INDEX IF NOT EXISTS idx_staff_notes_is_pinned ON rhema_staff_notes(is_pinned);
CREATE INDEX IF NOT EXISTS idx_staff_notes_author ON rhema_staff_notes(author);

ALTER TABLE rhema_staff_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role all on staff_notes"
  ON rhema_staff_notes FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- END OF SCHEMA
-- ============================================
-- To apply this schema:
-- 1. Go to Supabase Dashboard > SQL Editor
-- 2. Copy and paste this entire file
-- 3. Click "Run"
-- 
-- This will create all tables if they don't exist
-- Existing tables will not be affected
-- ============================================
