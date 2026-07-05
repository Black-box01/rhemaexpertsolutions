'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendCompetitionRegistrationEmail, sendProfessionalTrainingRegistrationEmail } from '@/lib/email';

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

export async function updateCompetitionRegistration(id: string, data: Partial<RegistrationInput> & { status?: string }) {
  try {
    const { error } = await supabaseAdmin
      .from('rhema_registrations')
      .update(data)
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export async function deleteCompetitionRegistration(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from('rhema_registrations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

type ProfessionalTrainingInput = {
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth?: string;
  organization?: string;
  job_title?: string;
  training_program: string;
  preferred_schedule: string;
  experience_level: string;
  payment_preference: string;
  additional_info?: string;
};

export async function submitProfessionalTrainingRegistration(formData: ProfessionalTrainingInput) {
  try {
    const { 
      full_name, 
      email, 
      phone, 
      gender, 
      date_of_birth, 
      organization, 
      job_title, 
      training_program, 
      preferred_schedule, 
      experience_level, 
      payment_preference, 
      additional_info 
    } = formData;

    // Validate required fields
    if (!full_name || !email || !phone || !gender || !training_program || !preferred_schedule || !experience_level || !payment_preference) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    const { data, error } = await supabaseAdmin
      .from('rhema_professional_trainings')
      .insert([
        {
          full_name,
          email,
          phone,
          gender,
          date_of_birth: date_of_birth || null,
          organization,
          job_title,
          training_program,
          preferred_schedule,
          experience_level,
          payment_preference,
          additional_info,
          status: 'pending'
        }
      ])
      .select();

    if (error) {
      console.error('Professional Training Registration Error:', error);
      return { success: false, error: error.message };
    }

    // Send email notification to admins
    const emailResult = await sendProfessionalTrainingRegistrationEmail(formData);
    if (!emailResult.success) {
      console.warn('Failed to send professional training registration email:', emailResult.error);
    }

    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    console.error('Unexpected Professional Training Registration Error:', error);
    return { success: false, error: message };
  }
}

export async function fetchProfessionalTrainings() {
  try {
    const { data, error } = await supabaseAdmin
      .from('rhema_professional_trainings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export async function updateProfessionalTraining(id: string, data: Partial<ProfessionalTrainingInput> & { status?: string }) {
  try {
    const { error } = await supabaseAdmin
      .from('rhema_professional_trainings')
      .update(data)
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export async function deleteProfessionalTraining(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from('rhema_professional_trainings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}
