import { createClient } from '@supabase/supabase-js';

// Define the type for our Supabase client
// For production, you should generate types using Supabase CLI
// npx supabase gen types typescript --project-id <your-project-id> > types/supabase.ts

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // throw new Error('Missing Supabase environment variables');
  console.warn('Missing Supabase environment variables. Dynamic content will not load.');
}

// Client for public access (read-only for most tables based on RLS)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey && supabaseUrl !== 'your-project-url';
};
