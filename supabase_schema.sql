-- Create a table for general site configuration and text content
CREATE TABLE rhema_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section, key)
);

-- Seed static content
INSERT INTO rhema_content (section, key, value, description) VALUES
('hero', 'title', 'Empowering Innovation Through Technology', 'Main hero title'),
('hero', 'subtitle', 'Providing cutting-edge solutions in Science, Technology, Engineering, and Mathematics to transform ideas into reality.', 'Main hero subtitle'),
('about', 'title', 'Transforming Ideas Into Reality', 'About section title'),
('about', 'intro', 'Rhema Expert Solutions is a premier technology company based in Nigeria, dedicated to providing innovative solutions across multiple technological domains.', 'First paragraph of about section'),
('contact', 'phone1', '+234 803 522 6642', 'Primary phone number'),
('contact', 'phone2', '+234 802 579 1886', 'Secondary phone number (WhatsApp)'),
('contact', 'email', 'rhemaexpertsolutions@gmail.com', 'Contact email address'),
('admin', 'password', 'admin123', 'Default admin password (change immediately)');

-- Create table for Services
CREATE TABLE rhema_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  folder_name TEXT, -- Used to map to local images if needed
  image_urls TEXT[], -- Array of image URLs (can be Supabase Storage URLs)
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Services
INSERT INTO rhema_services (title, description, folder_name, display_order) VALUES
('Science Lab Setup', 'Complete apparatus and reagents for educational and research institutions', 'lab', 1),
('Coding & STEM Robotics', 'Comprehensive training and development in programming and robotics', 'coding', 2),
('AI & IoT Solutions', 'Cutting-edge artificial intelligence and Internet of Things implementations', 'ai&iot', 3),
('Drone Technology', 'Advanced drone systems for various commercial applications', 'drone', 4),
('Digital Electronics', 'Circuitry design and embedded systems development', 'physics', 5),
('CCTV Systems', 'Installation and maintenance of security surveillance systems', 'cctv', 6),
('Software Development', 'Custom websites, mobile apps, and web applications', 'software development', 7),
('Cyber Security', 'Ethical hacking and security solutions for digital assets', 'cyber security', 8),
('Data Analysis: Excel, Power BI', 'Professional data analysis and visualization services', 'data analysis', 9),
('Digital Marketing: Affiliate Marketing', 'Strategic digital marketing and affiliate program management', 'digital marketing', 10);

-- Create table for Clients
CREATE TABLE rhema_clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Clients
INSERT INTO rhema_clients (name, display_order) VALUES
('DIVISON INTERNATIONAL SCHOOLS, Igbo-Etche, Rivers State', 1),
('MESHRIDGE INTERNATIONAL SCHOOL, Trans-Amadi, Rivers State', 2),
('GLORIOUS DESTINY ACADEMY, Eliozu, Port Harcourt, Rivers State', 3),
('CEREBRAL MODEL COLLEGE, Igwuruta, Rivers State', 4),
('BOLDLIVING CHRISTIAN ACADEMY, Trans-Worji, Port Harcourt, Rivers State', 5),
('ROHAN EXCELLENT SCHOOLS, Abuloma, Port Harcourt, Rivers State', 6),
('ROCKWORD CHRISTIAN SCHOOL, Elelenwo, Port Harcourt, Rivers State', 7),
('PROWESS-POINT MODEL SCHOOL, Owerri, Imo State', 8),
('STARLIGHT GALAXY INTERNATIONAL SCHOOL, Elelenwo, Port Harcourt, Rivers State', 9),
('GLORIOUS COVENANT SCHOOL, Rumuodara, Port Harcourt, Rivers State', 10),
('MORAL SEED MONTESSORI SCHOOL, Elelenwo, Port Harcourt, Rivers State', 11),
('DE EXCELLENT CHILD INTERNATIONAL SCHOOL, Elelenwo, Port Harcourt, Rivers State', 12),
('LIFE STANDARD EDUCATIONAL CENTER, Rumukwurushi, Port Harcourt, Rivers State', 13),
('TREASURE INTERNATIONAL SCHOOL, Rumukwurushi, Port Harcourt, Rivers State', 14),
('DIVINE FAVOUR INTERNATIONAL SCHOOL, Akpajo, Eleme, Rivers State', 15),
('JECK COMPREHENSIVE COLLEGE, Elimgbu, Port Harcourt, Rivers State', 16),
('GREATNESS MONTESSORI ACADEMY, Rumuokwurishi, Port Harcourt, Rivers State', 17),
('TRILLIUM SUCCESS ACADEMY, Eliozu, Port Harcourt, Rivers State', 18),
('JESHURUN MONTESSORI INTERNATIONAL SCHOOL, Atali, Port Harcourt, Rivers State', 19),
('CHIBSON INTERNATIONAL SCHOOL, Rumunduru, Port Harcourt, Rivers State', 20),
('JESHURUN HIGH SCHOOL, Atali, Port Harcourt, Rivers State', 21),
('EAGLE GREAT STARS INTERNATIONAL SCHOOL, Elelenwo, Port Harcourt, Rivers State', 22),
('3 STARS EDUCATIONAL CENTER, Borikiri, Port Harcourt, Rivers State', 23);

-- Create table for Team
CREATE TABLE rhema_team (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Team
INSERT INTO rhema_team (name, role, image_url, display_order) VALUES
('FRED C. ODII', 'Head of Operations (HOO)', '/img/staff/fred.jpeg', 1),
('NWACHUKWU ONYEKACHI', 'Chief Technology Officer (CTO)', '/img/staff/onyekachi.jpeg', 2);

-- Create table for R.E.S Coding Competition
CREATE TABLE rhema_competitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  registration_link TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  event_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Competition
INSERT INTO rhema_competitions (title, description, registration_link, is_active) VALUES
('R.E.S CODING COMPETITION', 'Annual national coding competition. Schools register online, compete, and win awards.', 'https://forms.google.com/your-form-link', true);

-- Create table for Newsletter/Updates
CREATE TABLE rhema_newsletter (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  category TEXT DEFAULT 'General', -- 'Training', 'Exam', 'General'
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Newsletter
INSERT INTO rhema_newsletter (title, content, category) VALUES
('Welcome to the New Term', 'We are excited to begin a new term filled with innovation and learning. Check out our updated training schedule.', 'General');

-- Create table for Projects (Online gallery)
CREATE TABLE rhema_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  image_url TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies (Row Level Security)
-- Enable RLS on all tables
ALTER TABLE rhema_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE rhema_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE rhema_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE rhema_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE rhema_competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rhema_newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE rhema_projects ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow read access to everyone, write access only via service role or specific logic if using Auth)
-- For this simple setup with custom admin, we might just use the public API key for read and require a "secret" for write in our API routes, 
-- or relying on Supabase Auth if we were implementing full auth. 
-- Since the user asked for a simple "default password" admin page, we will likely handle write operations server-side using the Service Role Key 
-- or a restricted client.
-- For now, let's allow public read access.

CREATE POLICY "Allow public read access" ON rhema_content FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON rhema_services FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON rhema_clients FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON rhema_team FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON rhema_competitions FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON rhema_newsletter FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON rhema_projects FOR SELECT USING (true);

-- Create storage bucket for images
-- INSERT INTO storage.buckets (id, name, public) VALUES ('rhema-assets', 'rhema-assets', true);
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'rhema-assets' ); 
