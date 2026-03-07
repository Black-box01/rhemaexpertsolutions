import { createClient } from '@supabase/supabase-js';

// Admin client with Service Role Key for bypassing RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceRoleKey) {
  console.warn('Warning: SUPABASE_SERVICE_ROLE_KEY is missing. Admin write operations may fail if RLS is enabled.');
}

// Fallback to anon key if service role key is missing (will fail writes if RLS is on)
const supabaseKey = supabaseServiceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // No need to persist session for admin operations
  },
});
