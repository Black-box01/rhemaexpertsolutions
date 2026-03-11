'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RhemaService, RhemaClient, RhemaTeam, RhemaCompetition, RhemaNewsletter, RhemaContent, RhemaRegistration } from '@/types/supabase';
import { checkAuth, logout } from '@/app/actions/auth';
import { saveService, saveClient, saveTeam, saveCompetition, saveNewsletter, saveSetting, deleteItem, toggleCompetition, fetchDashboardData } from '@/app/actions/admin';
import { fetchRegistrations } from '@/app/actions/registration';

type AdminTab = 'services' | 'clients' | 'team' | 'competitions' | 'newsletter' | 'settings' | 'registrations';

type FormState = {
  [key: string]: unknown;
  id?: string;
  title?: string;
  description?: string;
  name?: string;
  role?: string;
  registration_link?: string;
  content?: string;
  value?: string;
  section?: string;
  key?: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('services');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FormState | null>(null);
  const [formData, setFormData] = useState<FormState>({});

  // Data states
  const [services, setServices] = useState<RhemaService[]>([]);
  const [clients, setClients] = useState<RhemaClient[]>([]);
  const [team, setTeam] = useState<RhemaTeam[]>([]);
  const [competitions, setCompetitions] = useState<RhemaCompetition[]>([]);
  const [newsletters, setNewsletters] = useState<RhemaNewsletter[]>([]);
  const [settings, setSettings] = useState<RhemaContent[]>([]);
  const [registrations, setRegistrations] = useState<RhemaRegistration[]>([]);

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        router.push('/admin');
        return;
      }
      fetchData();
    };
    verifyAuth();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const result = await fetchDashboardData();
      
      if (result.success && result.data) {
        setServices(result.data.services as RhemaService[]);
        setClients(result.data.clients as RhemaClient[]);
        setTeam(result.data.team as RhemaTeam[]);
        setCompetitions(result.data.competitions as RhemaCompetition[]);
        setNewsletters(result.data.newsletters as RhemaNewsletter[]);
        setSettings(result.data.settings as RhemaContent[]);
      } else {
        setFetchError(result.error || 'Failed to fetch data');
        console.error('Error fetching data:', result.error);
      }

      // Fetch registrations
      const regResult = await fetchRegistrations();
      if (regResult.success) {
        setRegistrations(regResult.data as RhemaRegistration[]);
      }

    } catch (error) {
      console.error('Unexpected error fetching data:', error);
      setFetchError('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  // Modal Handlers
  const openModal = (item: unknown = null) => {
    const normalized = item && typeof item === 'object' ? (item as FormState) : null;
    setEditingItem(normalized);
    setFormData(normalized ? { ...normalized } : {});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    let result;
    
    if (activeTab === 'services') {
      const title = (formData.title || '') as string;
      const description = (formData.description || '') as string;
      if (!title || !description) return alert('Please fill in all fields');
      result = await saveService({ id: editingItem?.id, title, description });
      if (result.error) alert('Error saving service: ' + result.error);
      
    } else if (activeTab === 'clients') {
      const name = (formData.name || '') as string;
      if (!name) return alert('Please fill in all fields');
      result = await saveClient({ id: editingItem?.id, name });
      if (result.error) alert('Error saving client: ' + result.error);
      
    } else if (activeTab === 'team') {
      const name = (formData.name || '') as string;
      const role = (formData.role || '') as string;
      if (!name || !role) return alert('Please fill in all fields');
      result = await saveTeam({ id: editingItem?.id, name, role });
      if (result.error) alert('Error saving team member: ' + result.error);
      
    } else if (activeTab === 'competitions') {
      const title = (formData.title || '') as string;
      const description = (formData.description || '') as string;
      const registration_link = (formData.registration_link || '') as string;
      if (!title || !description) return alert('Please fill in all fields');
      result = await saveCompetition({ id: editingItem?.id, title, description, registration_link });
      if (result.error) alert('Error saving competition: ' + result.error);
      
    } else if (activeTab === 'newsletter') {
      const title = (formData.title || '') as string;
      const content = (formData.content || '') as string;
      if (!title || !content) return alert('Please fill in all fields');
      result = await saveNewsletter({ id: editingItem?.id, title, content });
      if (result.error) alert('Error saving newsletter: ' + result.error);
      
    } else if (activeTab === 'settings') {
      const value = (formData.value || '') as string;
      const id = editingItem?.id;
      if (!value) return alert('Please enter a value');
      if (!id) return alert('Missing setting id');
      result = await saveSetting({ id, value });
      if (result.error) alert('Error saving setting: ' + result.error);
    }

    if (result && !result.error) {
      closeModal();
      fetchData(); // Refresh data to see changes immediately
    }
  };

  // Generic delete function
  const handleDelete = async (table: string, id: string, refresh: () => void) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const result = await deleteItem(table, id);
      if (result.error) alert('Error deleting item: ' + result.error);
      else refresh(); // We can also call fetchData() here, but refresh usually does that in this context? 
      // Actually refresh param is usually fetchData passed down? No, it's used as callback.
      // Let's explicitly call fetchData() instead of relying on the callback which might be stale
      fetchData();
    }
  };

  // Handlers for Competitions Toggle
  const handleToggleCompetition = async (comp: RhemaCompetition) => {
    const result = await toggleCompetition(comp.id, !comp.is_active);
    if (result.error) alert('Error updating competition: ' + result.error);
    else fetchData();
  };

  if (loading) return <div className="p-8 text-center text-gray-800">Loading dashboard...</div>;

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Data</h2>
          <p className="text-gray-700 mb-6">{fetchError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            {(
              [
                { id: 'services', label: 'Services' },
                { id: 'clients', label: 'Clients' },
                { id: 'team', label: 'Team' },
                { id: 'competitions', label: 'Competitions' },
                { id: 'newsletter', label: 'Newsletter' },
                { id: 'registrations', label: 'Registrations' },
                { id: 'settings', label: 'General Settings' },
              ] as const
            ).map((tab) => (
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

          {activeTab === 'registrations' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Competition Registrations</h3>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">{registrations.length} Total</span>
              </div>
              
              <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">School</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Parent Contact</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(reg.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{reg.full_name}</div>
                          <div className="text-sm text-gray-500">{reg.gender}, {reg.age}yrs</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {reg.category}
                          <div className="text-xs text-gray-500">{reg.class_level}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="font-medium text-gray-900">{reg.school_name}</div>
                          <div className="text-xs">{reg.school_phone || 'No phone'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{reg.parent_name}</div>
                          <div className="text-sm text-gray-500">{reg.parent_phone}</div>
                        </td>
                      </tr>
                    ))}
                    {registrations.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">
                          No registrations found yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
