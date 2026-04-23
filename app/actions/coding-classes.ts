'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { checkAuth } from '@/app/actions/auth';
import { sendCodingClassRegistrationEmail } from '@/lib/email';

export type CodingClassInput = {
  full_name: string;
  email?: string;
  phone: string;
  age?: string | number;
  gender?: string;
  courses: string[];
  payment_plan: string;
  experience_level?: string;
  preferred_start_date?: string;
  notes?: string;
};

export async function submitCodingClassRegistration(formData: CodingClassInput) {
  try {
    const {
      full_name,
      email,
      phone,
      age,
      gender,
      courses,
      payment_plan,
      experience_level,
      preferred_start_date,
      notes
    } = formData;

    // Validate required fields
    if (!full_name || !phone || !courses || courses.length === 0 || !payment_plan) {
      return { success: false, error: 'Please fill in all required fields and select at least one course.' };
    }

    const { data, error } = await supabaseAdmin
      .from('rhema_coding_class_registrations')
      .insert([
        {
          full_name,
          email: email || null,
          phone,
          age: age ? (typeof age === 'string' ? parseInt(age, 10) : age) : null,
          gender: gender || null,
          courses,
          payment_plan,
          experience_level: experience_level || 'beginner',
          preferred_start_date: preferred_start_date || null,
          notes: notes || null,
          status: 'pending'
        }
      ])
      .select();

    if (error) {
      console.error('Coding Class Registration Error:', error);
      return { success: false, error: error.message };
    }

    // Send email notification to admins
    const emailResult = await sendCodingClassRegistrationEmail(formData);
    if (!emailResult.success) {
      console.warn('Failed to send coding class registration email:', emailResult.error);
    }

    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    console.error('Unexpected Coding Class Registration Error:', error);
    return { success: false, error: message };
  }
}

export async function fetchCodingClassRegistrations() {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return { success: false, error: 'Unauthorized' };
    }

    const { data, error } = await supabaseAdmin
      .from('rhema_coding_class_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export async function updateCodingClassStatus(id: string, status: string) {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabaseAdmin
      .from('rhema_coding_class_registrations')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}
