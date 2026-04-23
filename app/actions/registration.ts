'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendCompetitionRegistrationEmail } from '@/lib/email';

type RegistrationInput = {
  full_name: string;
  gender: string;
  date_of_birth?: string;
  age: string | number;
  school_name: string;
  school_address?: string;
  school_phone?: string;
  class_level: string;
  category: string;
  parent_name: string;
  parent_phone: string;
  parent_email?: string;
  competition_name?: string;
};

export async function submitRegistration(formData: RegistrationInput) {
  try {
    const { 
      full_name, 
      gender, 
      date_of_birth, 
      age, 
      school_name, 
      school_address, 
      school_phone,
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
          age: typeof age === 'string' ? parseInt(age, 10) : age,
          school_name,
          school_address,
          school_phone,
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

    // Send email notification to admins
    const emailResult = await sendCompetitionRegistrationEmail(formData);
    if (!emailResult.success) {
      console.warn('Failed to send registration email:', emailResult.error);
    }

    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    console.error('Unexpected Registration Error:', error);
    return { success: false, error: message };
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}
