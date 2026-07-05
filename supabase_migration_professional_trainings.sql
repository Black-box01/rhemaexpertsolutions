-- Create table for professional training registrations
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

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_professional_trainings_created_at ON rhema_professional_trainings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_professional_trainings_status ON rhema_professional_trainings(status);
CREATE INDEX IF NOT EXISTS idx_professional_trainings_program ON rhema_professional_trainings(training_program);
CREATE INDEX IF NOT EXISTS idx_professional_trainings_email ON rhema_professional_trainings(email);

ALTER TABLE rhema_professional_trainings ENABLE ROW LEVEL SECURITY;

-- Policy: Service role (admin) can do all operations
CREATE POLICY "Allow service role all on professional_trainings"
  ON rhema_professional_trainings FOR ALL
  USING (true)
  WITH CHECK (true);
