'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { RhemaService, RhemaClient, RhemaTeam, RhemaCompetition, RhemaNewsletter, RhemaContent } from '@/types/supabase';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('services');
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null); // Using any for simplicity in this multi-type form
  const [formData, setFormData] = useState<any>({});

  // Data states
  const [services, setServices] = useState<RhemaService[]>([]);
  const [clients, setClients] = useState<RhemaClient[]>([]);
  const [team, setTeam] = useState<RhemaTeam[]>([]);
  const [competitions, setCompetitions] = useState<RhemaCompetition[]>([]);
  const [newsletters, setNewsletters] = useState<RhemaNewsletter[]>([]);
  const [settings, setSettings] = useState<RhemaContent[]>([]);

  useEffect(() => {
    const isAuth = localStorage.getItem('rhema_admin_auth');
    if (!isAuth) {
      router.push('/admin');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Services
      const { data: servicesData } = await supabase.from('rhema_services').select('*').order('display_order');
      if (servicesData) setServices(servicesData);

      // Fetch Clients
      const { data: clientsData } = await supabase.from('rhema_clients').select('*').order('display_order');
      if (clientsData) setClients(clientsData);

      // Fetch Team
      const { data: teamData } = await supabase.from('rhema_team').select('*').order('display_order');
      if (teamData) setTeam(teamData);
      
      // Fetch Competitions
      const { data: compData } = await supabase.from('rhema_competitions').select('*');
      if (compData) setCompetitions(compData);
      
      // Fetch Newsletter
      const { data: newsData } = await supabase.from('rhema_newsletter').select('*').order('created_at', { ascending: false });
      if (newsData) setNewsletters(newsData);

      // Fetch Settings (Content)
      const { data: settingsData } = await supabase.from('rhema_content').select('*').order('section');
      if (settingsData) setSettings(settingsData);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('rhema_admin_auth');
    router.push('/admin');
  };

  // Modal Handlers
  const openModal = (item: any = null) => {
    setEditingItem(item);
    if (item) {
      setFormData({ ...item });
    } else {
      setFormData({});
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (activeTab === 'services') {
      const { title, description } = formData;
      if (!title || !description) return alert('Please fill in all fields');
      
      let error;
      if (editingItem) {
        ({ error } = await supabase.from('rhema_services').update({ title, description }).eq('id', editingItem.id));
      } else {
        ({ error } = await supabase.from('rhema_services').insert([{ title, description }]));
      }
      if (error) alert('Error saving service');
    } else if (activeTab === 'clients') {
      const { name } = formData;
      if (!name) return alert('Please fill in all fields');
      
      let error;
      if (editingItem) {
        ({ error } = await supabase.from('rhema_clients').update({ name }).eq('id', editingItem.id));
      } else {
        ({ error } = await supabase.from('rhema_clients').insert([{ name }]));
      }
      if (error) alert('Error saving client');
    } else if (activeTab === 'team') {
      const { name, role } = formData;
      if (!name || !role) return alert('Please fill in all fields');
      
      let error;
      if (editingItem) {
        ({ error } = await supabase.from('rhema_team').update({ name, role }).eq('id', editingItem.id));
      } else {
        ({ error } = await supabase.from('rhema_team').insert([{ name, role }]));
      }
      if (error) alert('Error saving team member');
    } else if (activeTab === 'competitions') {
      const { title, description, registration_link } = formData;
      if (!title || !description) return alert('Please fill in all fields');
      
      let error;
      if (editingItem) {
        ({ error } = await supabase.from('rhema_competitions').update({ title, description, registration_link }).eq('id', editingItem.id));
      } else {
        ({ error } = await supabase.from('rhema_competitions').insert([{ title, description, registration_link, is_active: true }]));
      }
      if (error) alert('Error saving competition');
    } else if (activeTab === 'newsletter') {
      const { title, content } = formData;
      if (!title || !content) return alert('Please fill in all fields');
      
      let error;
      if (editingItem) {
        ({ error } = await supabase.from('rhema_newsletter').update({ title, content }).eq('id', editingItem.id));
      } else {
        ({ error } = await supabase.from('rhema_newsletter').insert([{ title, content, is_published: true }]));
      }
      if (error) alert('Error saving newsletter');
    } else if (activeTab === 'settings') {
      const { value } = formData;
      // We only allow editing the value, not the key or section
      if (!value) return alert('Please enter a value');
      
      const { error } = await supabase.from('rhema_content').update({ value }).eq('id', editingItem.id);
      if (error) alert('Error saving setting');
    }

    closeModal();
    fetchData();
  };

  // Generic delete function
  const handleDelete = async (table: string, id: string, refresh: () => void) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) alert('Error deleting item');
      else refresh();
    }
  };

  // Handlers for Competitions Toggle
  const handleToggleCompetition = async (comp: RhemaCompetition) => {
    const { error } = await supabase.from('rhema_competitions').update({ is_active: !comp.is_active }).eq('id', comp.id);
    if (error) alert('Error updating competition');
    else fetchData();
  };

  if (loading) return <div className="p-8 text-center text-gray-800">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-900 capitalize">
              {editingItem ? 'Edit' : 'Add'} {activeTab === 'settings' ? 'Setting' : activeTab.slice(0, -1)}
            </h3>
            
            <div className="space-y-4">
              {activeTab === 'services' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title || ''}
                      onChange={handleInputChange}
                      placeholder="Service Title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      placeholder="Service Description"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {activeTab === 'clients' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    placeholder="Client Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {activeTab === 'team' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role || ''}
                      onChange={handleInputChange}
                      placeholder="Job Role (e.g., CEO)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {activeTab === 'competitions' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title || ''}
                      onChange={handleInputChange}
                      placeholder="Competition Title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      placeholder="Competition Details"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Link</label>
                    <input
                      type="text"
                      name="registration_link"
                      value={formData.registration_link || ''}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {activeTab === 'newsletter' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title || ''}
                      onChange={handleInputChange}
                      placeholder="Post Title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      name="content"
                      value={formData.content || ''}
                      onChange={handleInputChange}
                      placeholder="Post Content"
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {activeTab === 'settings' && (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 font-medium bg-gray-100 p-2 rounded">
                      {formData.description}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Value for <span className="font-bold text-blue-900">{formData.key}</span>
                    </label>
                    <textarea
                      name="value"
                      value={formData.value || ''}
                      onChange={handleInputChange}
                      placeholder="Enter value"
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-900">Rhema Admin Dashboard</h1>
        <button onClick={handleLogout} className="text-red-600 hover:text-red-800 font-medium">Logout</button>
      </nav>

      <div className="container mx-auto p-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm p-4 h-fit">
          <ul className="space-y-2">
            {[
              { id: 'services', label: 'Services' },
              { id: 'clients', label: 'Clients' },
              { id: 'team', label: 'Team' },
              { id: 'competitions', label: 'Competitions' },
              { id: 'newsletter', label: 'Newsletter' },
              { id: 'settings', label: 'General Settings' },
            ].map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${
                    activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6 capitalize text-gray-900">{activeTab === 'settings' ? 'General Settings' : `${activeTab} Management`}</h2>
          
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors">Add New Service</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {services.map((service) => (
                      <tr key={service.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{service.title}</td>
                        <td className="px-6 py-4 text-gray-600">{service.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => openModal(service)} className="text-indigo-600 hover:text-indigo-900 mr-4 font-semibold">Edit</button>
                          <button onClick={() => handleDelete('rhema_services', service.id, fetchData)} className="text-red-600 hover:text-red-900 font-semibold">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors">Add New Client</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clients.map((client) => (
                  <div key={client.id} className="border border-gray-200 p-4 rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <span className="text-gray-800 font-medium">{client.name}</span>
                    <div>
                      <button onClick={() => openModal(client)} className="text-indigo-600 hover:text-indigo-900 mr-3 text-sm font-semibold">Edit</button>
                      <button onClick={() => handleDelete('rhema_clients', client.id, fetchData)} className="text-red-600 hover:text-red-900 text-sm font-semibold">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors">Add Team Member</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team.map((member) => (
                  <div key={member.id} className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <h3 className="font-bold text-gray-900">{member.name}</h3>
                    <p className="text-gray-600 text-sm">{member.role}</p>
                    <div className="mt-3 flex justify-end space-x-3">
                      <button onClick={() => openModal(member)} className="text-indigo-600 hover:text-indigo-900 text-sm font-semibold">Edit</button>
                      <button onClick={() => handleDelete('rhema_team', member.id, fetchData)} className="text-red-600 hover:text-red-900 text-sm font-semibold">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'competitions' && (
             <div className="space-y-4">
               <div className="flex justify-end">
                <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors">Add Competition</button>
              </div>
               <p className="text-gray-600 mb-4">Manage R.E.S Coding Competition details here.</p>
               {competitions.map((comp) => (
                 <div key={comp.id} className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                   <h3 className="font-bold text-gray-900 text-lg">{comp.title}</h3>
                   <p className="text-gray-700 mt-1">{comp.description}</p>
                   <p className="text-sm text-gray-500 mt-2"><span className="font-semibold">Registration Link:</span> {comp.registration_link || 'None'}</p>
                   <div className="mt-4 flex items-center justify-between">
                     <div className="space-x-2">
                        <button onClick={() => openModal(comp)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm font-medium transition-colors">Edit</button>
                        <button onClick={() => handleToggleCompetition(comp)} className={`px-3 py-1 rounded text-sm font-medium transition-colors ${comp.is_active ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}>
                          {comp.is_active ? 'Active' : 'Inactive'}
                        </button>
                     </div>
                     <button onClick={() => handleDelete('rhema_competitions', comp.id, fetchData)} className="text-red-600 hover:text-red-900 text-sm font-semibold">Delete</button>
                   </div>
                 </div>
               ))}
               {competitions.length === 0 && <p className="text-gray-500 italic">No competitions found. Add one via Supabase.</p>}
             </div>
          )}

          {activeTab === 'newsletter' && (
             <div className="space-y-4">
               <div className="flex justify-end">
                <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors">Create Post</button>
              </div>
               {newsletters.map((news) => (
                 <div key={news.id} className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                   <div className="flex justify-between items-start">
                     <h3 className="font-bold text-gray-900 text-lg">{news.title}</h3>
                     <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{new Date(news.created_at || '').toLocaleDateString()}</span>
                   </div>
                   <p className="text-gray-700 mt-2">{news.content}</p>
                   <div className="mt-4 flex justify-end space-x-4">
                      <button onClick={() => openModal(news)} className="text-blue-600 hover:text-blue-800 font-semibold text-sm">Edit</button>
                      <button onClick={() => handleDelete('rhema_newsletter', news.id, fetchData)} className="text-red-600 hover:text-red-800 font-semibold text-sm">Delete</button>
                   </div>
                 </div>
               ))}
               {newsletters.length === 0 && <p className="text-gray-500 italic">No newsletter posts yet.</p>}
             </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">Manage general website content (Hero title, About text, Contact info).</p>
              <div className="grid grid-cols-1 gap-4">
                {settings.map((setting) => (
                  <div key={setting.id} className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded uppercase mr-2">{setting.section}</span>
                        <span className="font-bold text-gray-900">{setting.key}</span>
                      </div>
                      <button onClick={() => openModal(setting)} className="text-indigo-600 hover:text-indigo-900 font-semibold text-sm">Edit</button>
                    </div>
                    <p className="text-gray-500 text-sm mb-2 italic">{setting.description}</p>
                    <div className="bg-gray-100 p-3 rounded text-gray-800 text-sm font-mono whitespace-pre-wrap border border-gray-200">
                      {setting.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}