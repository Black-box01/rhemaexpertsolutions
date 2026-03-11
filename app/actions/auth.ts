'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function login(password: string) {
  // Try to get password from Supabase
  const { data: passwordData } = await supabaseAdmin
    .from('rhema_content')
    .select('value')
    .eq('section', 'admin')
    .eq('key', 'password')
    .single();

  let correctPassword = passwordData?.value;

  // If not found in DB, use env var or default, and save it to DB for future editing
  if (!correctPassword) {
    correctPassword = process.env.ADMIN_PASSWORD || 'rhema2026';
    
    // Create the record so it can be edited in dashboard
    await supabaseAdmin.from('rhema_content').insert({
      section: 'admin',
      key: 'password',
      value: correctPassword,
      description: 'Admin Dashboard Password'
    });
  }

  if (password === correctPassword) {
    // Set a cookie to maintain session
    (await cookies()).set('rhema_admin_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return { success: true };
  }

  return { success: false, error: 'Invalid password' };
}

export async function logout() {
  (await cookies()).delete('rhema_admin_auth');
  redirect('/admin');
}

export async function checkAuth() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('rhema_admin_auth');
  return authCookie?.value === 'true';
}
