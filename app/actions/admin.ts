'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { checkAuth } from '@/app/actions/auth';
import { revalidatePath } from 'next/cache';

type ServiceInput = { id?: string; title: string; description: string };
type ClientInput = { id?: string; name: string };
type TeamInput = { id?: string; name: string; role: string };
type CompetitionInput = { id?: string; title: string; description: string; registration_link?: string | null };
type NewsletterInput = { id?: string; title: string; content: string };
type SettingInput = { id: string; value: string };

async function ensureAuthenticated() {
  const isAuth = await checkAuth();
  if (!isAuth) {
    throw new Error('Unauthorized');
  }
}

export async function saveService(data: ServiceInput) {
  await ensureAuthenticated();
  
  const { id, title, description } = data;
  let result;
  
  if (id) {
    result = await supabaseAdmin.from('rhema_services').update({ title, description }).eq('id', id);
  } else {
    result = await supabaseAdmin.from('rhema_services').insert([{ title, description }]);
  }
  
  if (result.error) return { error: result.error.message };
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function fetchDashboardData() {
  await ensureAuthenticated();
  
  try {
    const [
      { data: services, error: servicesError },
      { data: clients, error: clientsError },
      { data: team, error: teamError },
      { data: competitions, error: compError },
      { data: newsletters, error: newsError },
      { data: settings, error: settingsError }
    ] = await Promise.all([
      supabaseAdmin.from('rhema_services').select('*').order('display_order'),
      supabaseAdmin.from('rhema_clients').select('*').order('display_order'),
      supabaseAdmin.from('rhema_team').select('*').order('display_order'),
      supabaseAdmin.from('rhema_competitions').select('*'),
      supabaseAdmin.from('rhema_newsletter').select('*').order('created_at', { ascending: false }),
      supabaseAdmin.from('rhema_content').select('*').order('section')
    ]);

    if (servicesError) throw new Error(`Services: ${servicesError.message}`);
    if (clientsError) throw new Error(`Clients: ${clientsError.message}`);
    if (teamError) throw new Error(`Team: ${teamError.message}`);
    if (compError) throw new Error(`Competitions: ${compError.message}`);
    if (newsError) throw new Error(`Newsletter: ${newsError.message}`);
    if (settingsError) throw new Error(`Settings: ${settingsError.message}`);

    // Ensure Admin Password exists in settings
    let allSettings = settings || [];
    const passwordSetting = allSettings.find(s => s.section === 'admin' && s.key === 'password');
    
    if (!passwordSetting) {
      const defaultPassword = process.env.ADMIN_PASSWORD || 'rhema2026';
      const { data: newSetting } = await supabaseAdmin.from('rhema_content').insert({
        section: 'admin',
        key: 'password',
        value: defaultPassword,
        description: 'Admin Dashboard Password (CHANGE THIS)'
      }).select().single();
      
      if (newSetting) {
        allSettings = [...allSettings, newSetting];
      }
    }

    return {
      success: true,
      data: {
        services: services || [],
        clients: clients || [],
        team: team || [],
        competitions: competitions || [],
        newsletters: newsletters || [],
        settings: allSettings
      }
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export async function saveClient(data: ClientInput) {
  await ensureAuthenticated();
  
  const { id, name } = data;
  let result;
  
  if (id) {
    result = await supabaseAdmin.from('rhema_clients').update({ name }).eq('id', id);
  } else {
    result = await supabaseAdmin.from('rhema_clients').insert([{ name }]);
  }
  
  if (result.error) return { error: result.error.message };
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function saveTeam(data: TeamInput) {
  await ensureAuthenticated();
  
  const { id, name, role } = data;
  let result;
  
  if (id) {
    result = await supabaseAdmin.from('rhema_team').update({ name, role }).eq('id', id);
  } else {
    result = await supabaseAdmin.from('rhema_team').insert([{ name, role }]);
  }
  
  if (result.error) return { error: result.error.message };
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function saveCompetition(data: CompetitionInput) {
  await ensureAuthenticated();
  
  const { id, title, description, registration_link } = data;
  let result;
  
  if (id) {
    result = await supabaseAdmin.from('rhema_competitions').update({ title, description, registration_link }).eq('id', id);
  } else {
    result = await supabaseAdmin.from('rhema_competitions').insert([{ title, description, registration_link, is_active: true }]);
  }
  
  if (result.error) return { error: result.error.message };
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function saveNewsletter(data: NewsletterInput) {
  await ensureAuthenticated();
  
  const { id, title, content } = data;
  let result;
  
  if (id) {
    result = await supabaseAdmin.from('rhema_newsletter').update({ title, content }).eq('id', id);
  } else {
    result = await supabaseAdmin.from('rhema_newsletter').insert([{ title, content, is_published: true }]);
  }
  
  if (result.error) return { error: result.error.message };
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function saveSetting(data: SettingInput) {
  await ensureAuthenticated();
  
  const { id, value } = data;
  const result = await supabaseAdmin.from('rhema_content').update({ value }).eq('id', id);
  
  if (result.error) return { error: result.error.message };
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function deleteItem(table: string, id: string) {
  await ensureAuthenticated();
  
  const result = await supabaseAdmin.from(table).delete().eq('id', id);
  
  if (result.error) return { error: result.error.message };
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function toggleCompetition(id: string, isActive: boolean) {
  await ensureAuthenticated();
  
  const result = await supabaseAdmin.from('rhema_competitions').update({ is_active: isActive }).eq('id', id);
  
  if (result.error) return { error: result.error.message };
  revalidatePath('/admin/dashboard');
  return { success: true };
}
