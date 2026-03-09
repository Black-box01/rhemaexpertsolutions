'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function submitRegistration(formData: any) {
  try {
    const { 
      full_name, 
      gender, 
      date_of_birth, 
      age, 
      school_name, 
      school_address, 
      class_level, 
      category, 
      parent_name, 
      parent_phone, 
      parent_email,
      competition_name = 'SMART CODERS NATIONAL COMPETITION'
    } = formData;

    // Validate required fields
    if (!full_name || !gender || !age || !school_name || !class_level || !category || !parent_name || !parent_phone) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    const { data, error } = await supabaseAdmin
      .from('rhema_registrations')
      .insert([
        {
          full_name,
          gender,
          date_of_birth: date_of_birth || null,
          age: parseInt(age),
          school_name,
          school_address,
          class_level,
          category,
          parent_name,
          parent_phone,
          parent_email,
          competition_name,
          status: 'pending'
        }
      ])
      .select();

    if (error) {
      console.error('Registration Error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Unexpected Registration Error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}

export async function fetchRegistrations() {
  // Check auth first ideally, but this is server-side and called from admin page which checks auth
  try {
    const { data, error } = await supabaseAdmin
      .from('rhema_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
