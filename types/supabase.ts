// types/supabase.ts
// Define the shape of your Supabase tables
// You can also use supabase-js generated types

export interface RhemaContent {
  id: string;
  section: string;
  key: string;
  value: string;
  description?: string;
}

export interface RhemaService {
  id: string;
  title: string;
  description: string;
  folder_name?: string;
  image_urls?: string[];
  display_order?: number;
}

export interface RhemaClient {
  id: string;
  name: string;
  display_order?: number;
}

export interface RhemaTeam {
  id: string;
  name: string;
  role: string;
  image_url?: string;
  display_order?: number;
}

export interface RhemaCompetition {
  id: string;
  title: string;
  description: string;
  registration_link?: string;
  image_url?: string;
  is_active?: boolean;
  event_date?: string;
}

export interface RhemaNewsletter {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  category?: string;
  is_published?: boolean;
  created_at?: string;
}

export interface RhemaRegistration {
  id: string;
  created_at: string;
  full_name: string;
  gender: string;
  date_of_birth: string;
  age: number;
  school_name: string;
  school_address?: string;
  school_phone?: string;
  class_level: string;
  category: string;
  parent_name: string;
  parent_phone: string;
  parent_email?: string;
  competition_name: string;
  status: string;
}

export interface RhemaProject {
  id: string;
  title?: string;
  image_url: string;
  description?: string;
  display_order?: number;
}
