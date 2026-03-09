-- Create a table for registrations
create table if not exists rhema_registrations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  full_name text not null,
  gender text not null,
  date_of_birth date,
  age int not null,
  school_name text not null,
  school_address text,
  class_level text not null, -- Primary 1, Primary 2, etc.
  category text not null, -- LOWER PRIMARY, UPPER PRIMARY
  parent_name text not null,
  parent_phone text not null,
  parent_email text,
  competition_name text default 'SMART CODERS NATIONAL COMPETITION',
  status text default 'pending' -- pending, approved, rejected
);

-- Enable Row Level Security (RLS)
alter table rhema_registrations enable row level security;

-- Create policies
-- Allow anyone to insert (public registration)
create policy "Allow public insert"
  on rhema_registrations for insert
  with check (true);

-- Allow admins (service role) to select/update/delete
-- Since we use supabaseAdmin client with service role key in our server actions, RLS is bypassed there.
-- But for good measure if we ever use client side:
-- create policy "Allow service role all" on rhema_registrations using (auth.role() = 'service_role');
