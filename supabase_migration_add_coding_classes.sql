-- Create a table for online coding class registrations
CREATE TABLE IF NOT EXISTS rhema_coding_class_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  age INT,
  gender TEXT,
  courses TEXT[] NOT NULL DEFAULT '{}',
  payment_plan TEXT NOT NULL, -- per_hour, weekly, monthly
  experience_level TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced
  preferred_start_date DATE,
  notes TEXT,
  status TEXT DEFAULT 'pending' -- pending, contacted, enrolled, cancelled
);

-- Enable Row Level Security (RLS)
ALTER TABLE rhema_coding_class_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public registration)
CREATE POLICY "Allow public insert on coding classes"
  ON rhema_coding_class_registrations FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read their own record by id (useful for confirmation pages if needed)
CREATE POLICY "Allow public select by id on coding classes"
  ON rhema_coding_class_registrations FOR SELECT
  USING (true);
