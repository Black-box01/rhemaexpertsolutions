-- Add school_phone column to rhema_registrations table
alter table rhema_registrations 
add column if not exists school_phone text;
