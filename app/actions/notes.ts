'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { checkAuth } from '@/app/actions/auth';
import { revalidatePath } from 'next/cache';
import { sendENoteNotificationEmail } from '@/lib/email';

export interface NoteInput {
  id?: string;
  title: string;
  content?: string;
  author: string;
  category?: string;
  priority?: string;
  status?: string;
  tags?: string[];
  is_pinned?: boolean;
}

export async function fetchStaffNotes({
  page = 1,
  limit = 50,
  search = '',
  status = '',
  category = '',
  priority = ''
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  priority?: string;
} = {}) {
  const isAuth = await checkAuth();
  if (!isAuth) return { success: false, error: 'Unauthorized', data: [], count: 0 };

  let query = supabaseAdmin
    .from('rhema_staff_notes')
    .select('*', { count: 'exact' })
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }
  if (status) query = query.eq('status', status);
  if (category) query = query.eq('category', category);
  if (priority) query = query.eq('priority', priority);

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) return { success: false, error: error.message, data: [], count: 0 };

  return { success: true, data, count };
}

export async function saveStaffNote(data: NoteInput) {
  const isAuth = await checkAuth();
  if (!isAuth) return { success: false, error: 'Unauthorized' };

  const isNewNote = !data.id;

  if (data.id) {
    const { error } = await supabaseAdmin
      .from('rhema_staff_notes')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', data.id);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabaseAdmin
      .from('rhema_staff_notes')
      .insert(data);
    if (error) return { success: false, error: error.message };
    
    // Send email notification for new notes
    try {
      await sendENoteNotificationEmail({
        title: data.title,
        content: data.content,
        author: data.author,
        category: data.category,
        priority: data.priority,
        tags: data.tags,
        file_urls: (data as any).file_urls,
      });
    } catch (emailError) {
      console.error('Failed to send e-note notification email:', emailError);
      // Don't fail the save if email fails
    }
  }

  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function deleteStaffNote(id: string) {
  const isAuth = await checkAuth();
  if (!isAuth) return { success: false, error: 'Unauthorized' };

  const { error } = await supabaseAdmin
    .from('rhema_staff_notes')
    .delete()
    .eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function uploadNoteFile(file: File) {
  const isAuth = await checkAuth();
  if (!isAuth) return { success: false, error: 'Unauthorized' };

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `attachments/${fileName}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from('staff-notes')
    .upload(filePath, file);

  if (uploadError) return { success: false, error: uploadError.message };

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('staff-notes')
    .getPublicUrl(filePath);

  return { success: true, url: publicUrl };
}

export async function deleteNoteFile(filePath: string) {
  const isAuth = await checkAuth();
  if (!isAuth) return { success: false, error: 'Unauthorized' };

  const { error } = await supabaseAdmin.storage
    .from('staff-notes')
    .remove([filePath]);

  if (error) return { success: false, error: error.message };

  return { success: true };
}
