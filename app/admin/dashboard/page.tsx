'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { RhemaService, RhemaClient, RhemaTeam, RhemaCompetition, RhemaNewsletter, RhemaContent, RhemaRegistration, RhemaCodingClassRegistration, RhemaStaffNote, RhemaProfessionalTraining } from '@/types/supabase';
import { checkAuth, logout } from '@/app/actions/auth';
import { saveService, saveClient, saveTeam, saveCompetition, saveNewsletter, saveSetting, deleteItem, toggleCompetition, fetchDashboardData } from '@/app/actions/admin';
import { fetchRegistrations, updateCompetitionRegistration, deleteCompetitionRegistration } from '@/app/actions/registration';
import { fetchCodingClassRegistrations, updateCodingClassStatus, updateCodingClassRegistration, deleteCodingClassRegistration } from '@/app/actions/coding-classes';
import { fetchStaffNotes, saveStaffNote, deleteStaffNote, uploadNoteFile, NoteInput } from '@/app/actions/notes';
import { fetchProfessionalTrainings, updateProfessionalTraining, deleteProfessionalTraining } from '@/app/actions/registration';

type AdminTab = 'services' | 'clients' | 'team' | 'competitions' | 'newsletter' | 'settings' | 'registrations' | 'coding-classes' | 'staff-notes' | 'professional-trainings';

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
  
  // Registration detail modal state
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<RhemaRegistration | RhemaCodingClassRegistration | RhemaProfessionalTraining | null>(null);
  const [isEditingReg, setIsEditingReg] = useState(false);
  const [regFormData, setRegFormData] = useState<Partial<RhemaRegistration & RhemaCodingClassRegistration & RhemaProfessionalTraining>>({});

  // Data states
  const [services, setServices] = useState<RhemaService[]>([]);
  const [clients, setClients] = useState<RhemaClient[]>([]);
  const [team, setTeam] = useState<RhemaTeam[]>([]);
  const [competitions, setCompetitions] = useState<RhemaCompetition[]>([]);
  const [newsletters, setNewsletters] = useState<RhemaNewsletter[]>([]);
  const [settings, setSettings] = useState<RhemaContent[]>([]);
  const [registrations, setRegistrations] = useState<RhemaRegistration[]>([]);
  const [codingClassRegistrations, setCodingClassRegistrations] = useState<RhemaCodingClassRegistration[]>([]);
  const [staffNotes, setStaffNotes] = useState<RhemaStaffNote[]>([]);
  const [professionalTrainings, setProfessionalTrainings] = useState<RhemaProfessionalTraining[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesPage, setNotesPage] = useState(1);
  const [notesTotal, setNotesTotal] = useState(0);
  const [notesSearch, setNotesSearch] = useState('');
  const [notesFilterStatus, setNotesFilterStatus] = useState('');
  const [notesFilterCategory, setNotesFilterCategory] = useState('');
  const [notesFilterPriority, setNotesFilterPriority] = useState('');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<RhemaStaffNote | null>(null);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteFormData, setNoteFormData] = useState<Partial<RhemaStaffNote>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void } | null>(null);
  
  // Search and filter states
  const [servicesSearch, setServicesSearch] = useState('');
  const [clientsSearch, setClientsSearch] = useState('');
  const [teamSearch, setTeamSearch] = useState('');
  const [competitionsSearch, setCompetitionsSearch] = useState('');
  const [registrationsSearch, setRegistrationsSearch] = useState('');
  const [registrationsFilterStatus, setRegistrationsFilterStatus] = useState('');
  const [codingClassesSearch, setCodingClassesSearch] = useState('');
  const [codingClassesFilterStatus, setCodingClassesFilterStatus] = useState('');
  const [professionalTrainingsSearch, setProfessionalTrainingsSearch] = useState('');
  const [professionalTrainingsFilterStatus, setProfessionalTrainingsFilterStatus] = useState('');
  const [professionalTrainingsFilterProgram, setProfessionalTrainingsFilterProgram] = useState('');

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

  useEffect(() => {
    if (activeTab === 'staff-notes') {
      fetchNotes();
    }
    if (activeTab === 'professional-trainings') {
      fetchProfessionalTrainingsData();
    }
  }, [activeTab, notesPage, notesSearch, notesFilterStatus, notesFilterCategory, notesFilterPriority]);

  const fetchProfessionalTrainingsData = async () => {
    const result = await fetchProfessionalTrainings();
    if (result.success) {
      setProfessionalTrainings(result.data as RhemaProfessionalTraining[]);
    }
  };

  // Filtered data arrays
  const filteredServices = useMemo(() => 
    services.filter(service => 
      service.title.toLowerCase().includes(servicesSearch.toLowerCase()) ||
      service.description.toLowerCase().includes(servicesSearch.toLowerCase())
    ), [services, servicesSearch]);

  const filteredClients = useMemo(() => 
    clients.filter(client => 
      client.name.toLowerCase().includes(clientsSearch.toLowerCase())
    ), [clients, clientsSearch]);

  const filteredTeam = useMemo(() => 
    team.filter(member => 
      member.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
      (member.role && member.role.toLowerCase().includes(teamSearch.toLowerCase()))
    ), [team, teamSearch]);

  const filteredCompetitions = useMemo(() => 
    competitions.filter(comp => 
      comp.title.toLowerCase().includes(competitionsSearch.toLowerCase())
    ), [competitions, competitionsSearch]);

  const filteredRegistrations = useMemo(() => 
    registrations.filter(reg => 
      reg.full_name.toLowerCase().includes(registrationsSearch.toLowerCase()) ||
      (reg.parent_email && reg.parent_email.toLowerCase().includes(registrationsSearch.toLowerCase())) ||
      reg.parent_phone.includes(registrationsSearch)
    ).filter(reg => !registrationsFilterStatus || reg.status === registrationsFilterStatus)
    , [registrations, registrationsSearch, registrationsFilterStatus]);

  const filteredCodingClasses = useMemo(() => 
    codingClassRegistrations.filter(reg => 
      reg.full_name.toLowerCase().includes(codingClassesSearch.toLowerCase()) ||
      (reg.email && reg.email.toLowerCase().includes(codingClassesSearch.toLowerCase())) ||
      reg.phone.includes(codingClassesSearch)
    ).filter(reg => !codingClassesFilterStatus || reg.status === codingClassesFilterStatus)
    , [codingClassRegistrations, codingClassesSearch, codingClassesFilterStatus]);

  const filteredProfessionalTrainings = useMemo(() => 
    professionalTrainings.filter(training => 
      training.full_name.toLowerCase().includes(professionalTrainingsSearch.toLowerCase()) ||
      training.email.toLowerCase().includes(professionalTrainingsSearch.toLowerCase()) ||
      training.phone.includes(professionalTrainingsSearch) ||
      training.training_program.toLowerCase().includes(professionalTrainingsSearch.toLowerCase())
    ).filter(training => !professionalTrainingsFilterStatus || training.status === professionalTrainingsFilterStatus)
     .filter(training => !professionalTrainingsFilterProgram || training.training_program === professionalTrainingsFilterProgram)
    , [professionalTrainings, professionalTrainingsSearch, professionalTrainingsFilterStatus, professionalTrainingsFilterProgram]);

  // Notification helper
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000); // Auto-hide after 5 seconds
  };

  // Confirmation dialog helper
  const showConfirmDialog = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(null);
  };

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

      // Fetch coding class registrations
      const codingResult = await fetchCodingClassRegistrations();
      if (codingResult.success) {
        setCodingClassRegistrations(codingResult.data as RhemaCodingClassRegistration[]);
      }

      // Fetch staff notes
      if (activeTab === 'staff-notes') {
        await fetchNotes();
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
      if (!title || !description) return showNotification('error', 'Please fill in all fields');
      result = await saveService({ id: editingItem?.id, title, description });
      if (result.error) showNotification('error', 'Error saving service: ' + result.error);
      
    } else if (activeTab === 'clients') {
      const name = (formData.name || '') as string;
      if (!name) return showNotification('error', 'Please fill in all fields');
      result = await saveClient({ id: editingItem?.id, name });
      if (result.error) showNotification('error', 'Error saving client: ' + result.error);
      
    } else if (activeTab === 'team') {
      const name = (formData.name || '') as string;
      const role = (formData.role || '') as string;
      if (!name || !role) return showNotification('error', 'Please fill in all fields');
      result = await saveTeam({ id: editingItem?.id, name, role });
      if (result.error) showNotification('error', 'Error saving team member: ' + result.error);
      
    } else if (activeTab === 'competitions') {
      const title = (formData.title || '') as string;
      const description = (formData.description || '') as string;
      const registration_link = (formData.registration_link || '') as string;
      if (!title || !description) return showNotification('error', 'Please fill in all fields');
      result = await saveCompetition({ id: editingItem?.id, title, description, registration_link });
      if (result.error) showNotification('error', 'Error saving competition: ' + result.error);
      
    } else if (activeTab === 'newsletter') {
      const title = (formData.title || '') as string;
      const content = (formData.content || '') as string;
      if (!title || !content) return showNotification('error', 'Please fill in all fields');
      result = await saveNewsletter({ id: editingItem?.id, title, content });
      if (result.error) showNotification('error', 'Error saving newsletter: ' + result.error);
      
    } else if (activeTab === 'settings') {
      const value = (formData.value || '') as string;
      const id = editingItem?.id;
      if (!value) return showNotification('error', 'Please enter a value');
      if (!id) return showNotification('error', 'Missing setting id');
      result = await saveSetting({ id, value });
      if (result.error) showNotification('error', 'Error saving setting: ' + result.error);
    }

    if (result && !result.error) {
      showNotification('success', `${editingItem ? 'Updated' : 'Added'} ${activeTab === 'settings' ? 'setting' : activeTab.slice(0, -1)} successfully!`);
      closeModal();
      fetchData(); // Refresh data to see changes immediately
    }
  };

  // Generic delete function
  const handleDelete = async (table: string, id: string, refresh: () => void) => {
    showConfirmDialog(
      'Delete Item',
      'Are you sure you want to delete this item? This action cannot be undone.',
      async () => {
        const result = await deleteItem(table, id);
        if (result.error) {
          showNotification('error', 'Error deleting item: ' + result.error);
        } else {
          showNotification('success', 'Deleted successfully!');
          refresh();
          fetchData();
        }
        closeConfirmDialog();
      }
    );
  };

  // Handlers for Competitions Toggle
  const handleToggleCompetition = async (comp: RhemaCompetition) => {
    const result = await toggleCompetition(comp.id, !comp.is_active);
    if (result.error) showNotification('error', 'Error updating competition: ' + result.error);
    else {
      showNotification('success', 'Competition status updated!');
      fetchData();
    }
  };

  // Registration modal handlers
  const openRegModal = (reg: RhemaRegistration | RhemaCodingClassRegistration, edit = false) => {
    setSelectedRegistration(reg);
    setIsEditingReg(edit);
    setRegFormData({ ...reg } as Record<string, unknown>);
    setIsRegModalOpen(true);
  };

  const closeRegModal = () => {
    setIsRegModalOpen(false);
    setSelectedRegistration(null);
    setIsEditingReg(false);
    setRegFormData({});
  };

  const handleRegInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRegFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveRegistration = async () => {
    if (!selectedRegistration) return;

    let result;
    const isCodingClass = 'courses' in selectedRegistration;

    if (isCodingClass) {
      result = await updateCodingClassRegistration(selectedRegistration.id, regFormData);
    } else {
      result = await updateCompetitionRegistration(selectedRegistration.id, regFormData);
    }

    if (result.error) {
      showNotification('error', 'Error updating registration: ' + result.error);
    } else {
      showNotification('success', 'Registration updated successfully!');
      closeRegModal();
      fetchData();
    }
  };

  const handleDeleteRegistration = async (id: string, isCodingClass: boolean) => {
    showConfirmDialog(
      'Delete Registration',
      'Are you sure you want to delete this registration? This action cannot be undone.',
      async () => {
        let result;
        if (isCodingClass) {
          result = await deleteCodingClassRegistration(id);
        } else {
          result = await deleteCompetitionRegistration(id);
        }

        if (result.error) {
          showNotification('error', 'Error deleting registration: ' + result.error);
        } else {
          showNotification('success', 'Registration deleted successfully!');
          fetchData();
        }
        closeConfirmDialog();
      }
    );
  };

  // E-Note handlers
  const fetchNotes = async () => {
    setNotesLoading(true);
    const result = await fetchStaffNotes({
      page: notesPage,
      search: notesSearch,
      status: notesFilterStatus,
      category: notesFilterCategory,
      priority: notesFilterPriority
    });
    if (result.success) {
      setStaffNotes(result.data || []);
      setNotesTotal(result.count || 0);
    }
    setNotesLoading(false);
  };

  const openNoteModal = (note?: RhemaStaffNote, edit = false) => {
    if (note) {
      setSelectedNote(note);
      setIsEditingNote(edit);
      setNoteFormData({ ...note });
    } else {
      setSelectedNote(null);
      setIsEditingNote(true);
      setNoteFormData({ category: 'general', priority: 'normal', status: 'active', is_pinned: false, tags: [], file_urls: [] });
    }
    setIsNoteModalOpen(true);
  };

  const closeNoteModal = () => {
    setIsNoteModalOpen(false);
    setSelectedNote(null);
    setIsEditingNote(false);
    setNoteFormData({});
  };

  const handleNoteInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNoteFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setNoteFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNoteFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const fileUrls: (string | { name: string; url: string })[] = [...(noteFormData.file_urls || [])];
    
    for (const file of Array.from(files)) {
      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        showNotification('error', `File "${file.name}" is too large. Maximum size is 10MB.`);
        continue;
      }
      
      // Add to uploading files
      setUploadingFiles(prev => [...prev, file.name]);
      
      try {
        const result = await uploadNoteFile(file);
        if (result.success && result.url) {
          // Store object with name and url
          fileUrls.push({ name: file.name, url: result.url });
        } else {
          showNotification('error', `Failed to upload "${file.name}": ${result.error}`);
        }
      } catch (error) {
        showNotification('error', `Failed to upload "${file.name}": Unexpected error`);
      } finally {
        // Remove from uploading files
        setUploadingFiles(prev => prev.filter(f => f !== file.name));
      }
    }
    
    setNoteFormData(prev => ({ ...prev, file_urls: fileUrls }));
    
    // Reset the input value so the same file can be uploaded again if needed
    e.target.value = '';
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    const fileUrls: (string | { name: string; url: string })[] = [...(noteFormData.file_urls || [])];
    
    for (const file of Array.from(files)) {
      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        showNotification('error', `File "${file.name}" is too large. Maximum size is 10MB.`);
        continue;
      }
      
      // Add to uploading files
      setUploadingFiles(prev => [...prev, file.name]);
      
      try {
        const result = await uploadNoteFile(file);
        if (result.success && result.url) {
          // Store object with name and url
          fileUrls.push({ name: file.name, url: result.url });
        } else {
          showNotification('error', `Failed to upload "${file.name}": ${result.error}`);
        }
      } catch (error) {
        showNotification('error', `Failed to upload "${file.name}": Unexpected error`);
      } finally {
        // Remove from uploading files
        setUploadingFiles(prev => prev.filter(f => f !== file.name));
      }
    }
    
    setNoteFormData(prev => ({ ...prev, file_urls: fileUrls }));
  };

  const handleRemoveNoteFile = (fileData: { name: string; url: string } | string) => {
    const urlToRemove = typeof fileData === 'string' ? fileData : fileData.url;
    setNoteFormData(prev => ({
      ...prev,
      file_urls: (prev.file_urls || []).filter(f => {
        const fileUrl = typeof f === 'string' ? f : f.url;
        return fileUrl !== urlToRemove;
      })
    }));
  };

  const handleSaveNote = async () => {
    if (!noteFormData.title || !noteFormData.author) {
      showNotification('error', 'Please fill in Title and Author');
      return;
    }

    const result = await saveStaffNote(noteFormData as NoteInput);
    if (result.error) {
      showNotification('error', 'Error saving note: ' + result.error);
    } else {
      showNotification('success', `Note ${isEditingNote ? 'updated' : 'created'} successfully!`);
      closeNoteModal();
      fetchNotes();
    }
  };

  const handleDeleteNote = async (id: string) => {
    showConfirmDialog(
      'Delete Note',
      'Are you sure you want to delete this note? This action cannot be undone.',
      async () => {
        const result = await deleteStaffNote(id);
        if (result.error) {
          showNotification('error', 'Error deleting note: ' + result.error);
        } else {
          showNotification('success', 'Note deleted successfully!');
          fetchNotes();
        }
        closeConfirmDialog();
      }
    );
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
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[100] max-w-sm w-full shadow-lg rounded-lg p-4 transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {notification.type === 'success' && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              )}
              {notification.type === 'error' && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              )}
              {notification.type === 'info' && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">
                {notification.type === 'success' ? 'Success' : notification.type === 'error' ? 'Error' : 'Info'}
              </p>
              <p className="text-sm mt-1">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4" onClick={closeConfirmDialog}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{confirmDialog.title}</h3>
                <p className="text-sm text-gray-600">{confirmDialog.message}</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={closeConfirmDialog}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
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

      {/* Registration Detail/Edit Modal */}
      {isRegModalOpen && selectedRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-2xl shadow-2xl mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {isEditingReg ? 'Edit' : 'View'} Registration - {'courses' in selectedRegistration ? 'Coding Class' : 'training_program' in selectedRegistration ? 'Professional Training' : 'Competition'}
              </h3>
              <button onClick={closeRegModal} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {'courses' in selectedRegistration ? (
                // Coding Class Registration
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      {isEditingReg ? (
                        <input type="text" name="full_name" value={regFormData.full_name || ''} onChange={handleRegInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900" />
                      ) : (
                        <p className="text-gray-900 font-medium">{selectedRegistration.full_name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      {isEditingReg ? (
                        <input type="email" name="email" value={regFormData.email || ''} onChange={handleRegInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900" />
                      ) : (
                        <p className="text-gray-700">{selectedRegistration.email || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      {isEditingReg ? (
                        <input type="tel" name="phone" value={regFormData.phone || ''} onChange={handleRegInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900" />
                      ) : (
                        <p className="text-gray-700">{selectedRegistration.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      {isEditingReg ? (
                        <input type="number" name="age" value={regFormData.age || ''} onChange={handleRegInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900" />
                      ) : (
                        <p className="text-gray-700">{selectedRegistration.age || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Courses</label>
                    {isEditingReg ? (
                      <input type="text" name="courses" value={(regFormData.courses || []).join(', ')} onChange={(e) => setRegFormData({ ...regFormData, courses: e.target.value.split(',').map(c => c.trim()).filter(c => c) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900" placeholder="Comma-separated courses" />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {(selectedRegistration as RhemaCodingClassRegistration).courses.map((course, i) => (
                          <span key={i} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">{course}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Plan</label>
                      {isEditingReg ? (
                        <select name="payment_plan" value={regFormData.payment_plan || ''} onChange={handleRegInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
                          <option value="per_hour">Per Hour</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      ) : (
                        <p className="text-gray-700 capitalize">{selectedRegistration.payment_plan?.replace('_', ' ')}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                      {isEditingReg ? (
                        <select name="experience_level" value={regFormData.experience_level || ''} onChange={handleRegInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      ) : (
                        <p className="text-gray-700 capitalize">{selectedRegistration.experience_level || 'beginner'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Start Date</label>
                      {isEditingReg ? (
                        <input type="date" name="preferred_start_date" value={regFormData.preferred_start_date || ''} onChange={handleRegInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900" />
                      ) : (
                        <p className="text-gray-700">{selectedRegistration.preferred_start_date ? new Date(selectedRegistration.preferred_start_date).toLocaleDateString() : 'Not specified'}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    {isEditingReg ? (
                      <textarea name="notes" value={regFormData.notes || ''} onChange={handleRegInputChange} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900" />
                    ) : (
                      <p className="text-gray-700">{selectedRegistration.notes || 'No notes'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" value={regFormData.status || selectedRegistration.status} onChange={handleRegInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="enrolled">Enrolled</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </>
              ) : 'training_program' in selectedRegistration ? (
                // Professional Training Registration
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <p className="text-gray-900 font-medium">{selectedRegistration.full_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-700">{selectedRegistration.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-gray-700">{selectedRegistration.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <p className="text-gray-700">{selectedRegistration.gender}</p>
                    </div>
                  </div>
                  {selectedRegistration.date_of_birth && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <p className="text-gray-700">{new Date(selectedRegistration.date_of_birth).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedRegistration.organization && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                      <p className="text-gray-700">{selectedRegistration.organization}</p>
                    </div>
                  )}
                  {selectedRegistration.job_title && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                      <p className="text-gray-700">{selectedRegistration.job_title}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Training Program</label>
                      <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">{selectedRegistration.training_program}</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Schedule</label>
                      <p className="text-gray-700">{selectedRegistration.preferred_schedule}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        selectedRegistration.experience_level === 'Beginner' ? 'bg-green-100 text-green-800' :
                        selectedRegistration.experience_level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>{selectedRegistration.experience_level}</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Preference</label>
                      <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">{selectedRegistration.payment_preference}</span>
                    </div>
                  </div>
                  {selectedRegistration.additional_info && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedRegistration.additional_info}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" value={regFormData.status || selectedRegistration.status} onChange={handleRegInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="enrolled">Enrolled</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </>
              ) : (
                // Competition Registration
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      {isEditingReg ? (
                        <input type="text" name="full_name" value={regFormData.full_name || ''} onChange={handleRegInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900" />
                      ) : (
                        <p className="text-gray-900 font-medium">{(selectedRegistration as RhemaRegistration).full_name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      {isEditingReg ? (
                        <select name="gender" value={regFormData.gender || ''} onChange={handleRegInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      ) : (
                        <p className="text-gray-700">{(selectedRegistration as RhemaRegistration).gender}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      {isEditingReg ? (
                        <input type="number" name="age" value={regFormData.age || ''} onChange={handleRegInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900" />
                      ) : (
                        <p className="text-gray-700">{(selectedRegistration as RhemaRegistration).age}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      {isEditingReg ? (
                        <input type="date" name="date_of_birth" value={regFormData.date_of_birth || ''} onChange={handleRegInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900" />
                      ) : (
                        <p className="text-gray-700">{(selectedRegistration as RhemaRegistration).date_of_birth || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                    {isEditingReg ? (
                      <input type="text" name="school_name" value={regFormData.school_name || ''} onChange={handleRegInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900" />
                    ) : (
                      <p className="text-gray-900 font-medium">{(selectedRegistration as RhemaRegistration).school_name}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class Level</label>
                      {isEditingReg ? (
                        <input type="text" name="class_level" value={regFormData.class_level || ''} onChange={handleRegInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900" />
                      ) : (
                        <p className="text-gray-700">{(selectedRegistration as RhemaRegistration).class_level}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      {isEditingReg ? (
                        <select name="category" value={regFormData.category || ''} onChange={handleRegInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
                          <option value="LOWER PRIMARY">Lower Primary</option>
                          <option value="UPPER PRIMARY">Upper Primary</option>
                        </select>
                      ) : (
                        <p className="text-gray-700">{(selectedRegistration as RhemaRegistration).category}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
                      {isEditingReg ? (
                        <input type="text" name="parent_name" value={regFormData.parent_name || ''} onChange={handleRegInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900" />
                      ) : (
                        <p className="text-gray-700">{(selectedRegistration as RhemaRegistration).parent_name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
                      {isEditingReg ? (
                        <input type="tel" name="parent_phone" value={regFormData.parent_phone || ''} onChange={handleRegInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900" />
                      ) : (
                        <p className="text-gray-700">{(selectedRegistration as RhemaRegistration).parent_phone}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
                    {isEditingReg ? (
                      <input type="email" name="parent_email" value={regFormData.parent_email || ''} onChange={handleRegInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900" />
                    ) : (
                      <p className="text-gray-700">{(selectedRegistration as RhemaRegistration).parent_email || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" value={regFormData.status || (selectedRegistration as RhemaRegistration).status} onChange={handleRegInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3 pt-4 border-t">
              <button onClick={closeRegModal} className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors">
                Close
              </button>
              {isEditingReg && (
                <button onClick={handleSaveRegistration} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors">
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeNoteModal}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white px-4 md:px-6 py-4 border-b flex justify-between items-center z-10">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                {isEditingNote ? (selectedNote ? 'Edit Note' : 'Create New Note') : 'View Note'}
              </h2>
              <button onClick={closeNoteModal} className="text-gray-500 hover:text-red-600 text-2xl">&times;</button>
            </div>

            <div className="p-4 md:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                {isEditingNote ? (
                  <input
                    type="text"
                    name="title"
                    value={noteFormData.title || ''}
                    onChange={handleNoteInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    placeholder="Enter note title"
                  />
                ) : (
                  <p className="text-gray-900 font-semibold">{selectedNote?.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content <span className="text-gray-400 font-normal">(Optional)</span></label>
                {isEditingNote ? (
                  <textarea
                    name="content"
                    value={noteFormData.content || ''}
                    onChange={handleNoteInputChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    placeholder="Enter note content (optional)"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedNote?.content || '(No content)'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                {isEditingNote ? (
                  <input
                    type="text"
                    name="author"
                    value={noteFormData.author || ''}
                    onChange={handleNoteInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    placeholder="Author name"
                  />
                ) : (
                  <p className="text-gray-700">{selectedNote?.author}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  {isEditingNote ? (
                    <select name="category" value={noteFormData.category || 'general'} onChange={handleNoteInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
                      <option value="general">General</option>
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                      <option value="urgent">Urgent</option>
                      <option value="announcement">Announcement</option>
                    </select>
                  ) : (
                    <p className="text-gray-700 capitalize">{selectedNote?.category || 'general'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  {isEditingNote ? (
                    <select name="priority" value={noteFormData.priority || 'normal'} onChange={handleNoteInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  ) : (
                    <p className="text-gray-700 capitalize">{selectedNote?.priority || 'normal'}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  {isEditingNote ? (
                    <select name="status" value={noteFormData.status || 'active'} onChange={handleNoteInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  ) : (
                    <p className="text-gray-700 capitalize">{selectedNote?.status || 'active'}</p>
                  )}
                </div>

                <div className="flex items-end">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_pinned"
                      checked={noteFormData.is_pinned || false}
                      onChange={handleNoteInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Pin this note</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                {isEditingNote ? (
                  <input
                    type="text"
                    name="tags"
                    value={Array.isArray(noteFormData.tags) ? noteFormData.tags.join(', ') : ''}
                    onChange={(e) => {
                      const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                      setNoteFormData(prev => ({ ...prev, tags }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    placeholder="e.g., important, meeting, deadline"
                  />
                ) : (
                  <p className="text-gray-700">{(selectedNote?.tags || []).join(', ') || 'No tags'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                {isEditingNote && (
                  <div
                    className="relative"
                    onDragEnter={handleDragIn}
                    onDragLeave={handleDragOut}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                      isDragging 
                        ? 'border-blue-500 bg-blue-50 scale-105' 
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3"></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-600 font-semibold">
                          <span className="text-blue-600 hover:text-blue-700">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX, PNG, JPG, GIF (MAX. 10MB)</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        onChange={handleNoteFileUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.txt,.xls,.xlsx,.ppt,.pptx"
                      />
                    </label>
                  </div>
                )}
                
                {/* Uploading files with loading indicators */}
                {uploadingFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Uploading...</p>
                    {uploadingFiles.map((fileName, idx) => (
                      <div key={`uploading-${idx}`} className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-2 rounded">
                        <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm text-blue-700 truncate flex-1">{fileName}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Uploaded files */}
                {noteFormData.file_urls && noteFormData.file_urls.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Uploaded Files:</p>
                    {noteFormData.file_urls.map((fileData, idx) => {
                      // Parse fileData if it's a JSON string
                      let fileObj: { name: string; url: string };
                      if (typeof fileData === 'string') {
                        try {
                          fileObj = JSON.parse(fileData);
                        } catch {
                          fileObj = { name: fileData.split('/').pop() || `File ${idx + 1}`, url: fileData };
                        }
                      } else {
                        fileObj = fileData;
                      }
                      
                      const fileName = fileObj.name || `File ${idx + 1}`;
                      const url = fileObj.url || '';
                      
                      return (
                        <div key={idx} className="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2 rounded">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-green-700 hover:text-green-900 font-medium truncate">
                              {fileName}
                            </a>
                          </div>
                          {isEditingNote && (
                            <button 
                              onClick={() => handleRemoveNoteFile(fileData)} 
                              className="text-red-600 hover:text-red-800 text-sm font-medium ml-2 flex-shrink-0"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {!isEditingNote && selectedNote?.file_urls && selectedNote.file_urls.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Attached Files:</p>
                    {selectedNote.file_urls.map((fileData, idx) => {
                      // Parse fileData if it's a JSON string
                      let fileObj: { name: string; url: string };
                      if (typeof fileData === 'string') {
                        try {
                          fileObj = JSON.parse(fileData);
                        } catch {
                          fileObj = { name: fileData.split('/').pop() || `File ${idx + 1}`, url: fileData };
                        }
                      } else {
                        fileObj = fileData;
                      }
                      
                      const fileName = fileObj.name || `File ${idx + 1}`;
                      const url = fileObj.url || '';
                      
                      return (
                        <a 
                          key={idx} 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                          </svg>
                          <span className="text-sm text-gray-700 font-medium truncate">{fileName}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                <p className="text-gray-700">{selectedNote?.created_at ? new Date(selectedNote.created_at).toLocaleString() : 'N/A'}</p>
              </div>

              {selectedNote?.updated_at && selectedNote.updated_at !== selectedNote.created_at && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                  <p className="text-gray-700">{new Date(selectedNote.updated_at).toLocaleString()}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3 pt-4 border-t">
              <button onClick={closeNoteModal} className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors">
                Close
              </button>
              {isEditingNote && (
                <button onClick={handleSaveNote} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors">
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <nav className="bg-white shadow-sm px-4 md:px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-blue-600"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg md:text-xl font-bold text-blue-900">Rhema Admin Dashboard</h1>
        </div>
        <button onClick={handleLogout} className="text-red-600 hover:text-red-800 font-medium text-sm md:text-base">Logout</button>
      </nav>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="container mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
        {/* Mobile Sidebar */}
        <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64 md:rounded-xl md:shadow-sm ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center p-4 border-b md:hidden">
            <h2 className="text-lg font-bold text-blue-900">Menu</h2>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-500 hover:text-red-600"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              {(
                [
                  { id: 'services', label: 'Services' },
                  { id: 'clients', label: 'Clients' },
                  { id: 'team', label: 'Team' },
                  { id: 'competitions', label: 'Competitions' },
                  { id: 'newsletter', label: 'Newsletter' },
                  { id: 'registrations', label: 'Competition Registrations' },
                  { id: 'coding-classes', label: 'Coding Class Registrations' },
                  { id: 'professional-trainings', label: 'Professional Trainings' },
                  { id: 'staff-notes', label: 'Staff E-Notes' },
                  { id: 'settings', label: 'General Settings' },
                ] as const
              ).map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${
                      activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 capitalize text-gray-900">{activeTab === 'settings' ? 'General Settings' : `${activeTab} Management`}</h2>
          
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                <div className="flex-1 w-full md:max-w-md">
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={servicesSearch}
                    onChange={(e) => setServicesSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
                  />
                </div>
                <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm md:text-base">Add New Service</button>
              </div>
              
              {/* Mobile-first card layout */}
              <div className="grid grid-cols-1 gap-4">
                {filteredServices.map((service) => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                    <div className="flex flex-col gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-3">{service.description}</p>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <button 
                          onClick={() => openModal(service)} 
                          className="flex-1 text-center text-indigo-600 hover:text-indigo-900 text-sm font-semibold py-2 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete('rhema_services', service.id, fetchData)} 
                          className="flex-1 text-center text-red-600 hover:text-red-900 text-sm font-semibold py-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredServices.length === 0 && (
                <div className="text-center py-8 text-gray-500 italic">
                  {services.length === 0 ? 'No services found. Add your first service!' : 'No services match your search.'}
                </div>
              )}
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                <div className="flex-1 w-full md:max-w-md">
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={clientsSearch}
                    onChange={(e) => setClientsSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
                  />
                </div>
                <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors">Add New Client</button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {filteredClients.map((client) => (
                  <div key={client.id} className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-colors bg-white">
                    <div className="flex flex-col gap-3">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">{client.name}</h3>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <button 
                          onClick={() => openModal(client)} 
                          className="flex-1 text-center text-indigo-600 hover:text-indigo-900 text-sm font-semibold py-2 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete('rhema_clients', client.id, fetchData)} 
                          className="flex-1 text-center text-red-600 hover:text-red-900 text-sm font-semibold py-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                <div className="flex-1 w-full md:max-w-md">
                  <input
                    type="text"
                    placeholder="Search team members..."
                    value={teamSearch}
                    onChange={(e) => setTeamSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
                  />
                </div>
                <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors">Add Team Member</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTeam.map((member) => (
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
               <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                <div className="flex-1 w-full md:max-w-md">
                  <input
                    type="text"
                    placeholder="Search competitions..."
                    value={competitionsSearch}
                    onChange={(e) => setCompetitionsSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
                  />
                </div>
                <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors">Add Competition</button>
              </div>
               <p className="text-gray-600 mb-4">Manage R.E.S Coding Competition details here.</p>
               {filteredCompetitions.map((comp) => (
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
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-800">Competition Registrations</h3>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs md:text-sm font-bold self-start">{filteredRegistrations.length} / {registrations.length} Total</span>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={registrationsSearch}
                    onChange={(e) => setRegistrationsSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
                  />
                </div>
                <select
                  value={registrationsFilterStatus}
                  onChange={(e) => setRegistrationsFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-900 bg-white"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Mobile-first card layout */}
              <div className="grid grid-cols-1 gap-4">
                {filteredRegistrations.map((reg) => (
                  <div key={reg.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      {/* Header: Date & Status */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 pb-3 border-b border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Registered</p>
                          <p className="text-sm font-semibold text-gray-900">{new Date(reg.created_at).toLocaleDateString()}</p>
                        </div>
                        <select
                          value={reg.status}
                          onChange={async (e) => {
                            const result = await updateCompetitionRegistration(reg.id, { status: e.target.value });
                            if (result.success) {
                              showNotification('success', 'Status updated successfully!');
                              fetchData();
                            } else {
                              showNotification('error', 'Error updating status: ' + result.error);
                            }
                          }}
                          className={`text-xs font-bold px-3 py-2 rounded-lg border-0 outline-none cursor-pointer self-start ${
                            reg.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : reg.status === 'contacted'
                              ? 'bg-blue-100 text-blue-800'
                              : reg.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>

                      {/* Student Info */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Student Information</p>
                        <h4 className="text-base font-bold text-gray-900">{reg.full_name}</h4>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            <span>{reg.gender}, {reg.age} years old</span>
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            <span className="truncate">{reg.parent_email || 'No email'}</span>
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                            <span>{reg.parent_phone}</span>
                          </p>
                        </div>
                      </div>

                      {/* Category & Class */}
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Competition Details</p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold inline-block mb-2">
                            {reg.category}
                          </span>
                          <p className="text-sm text-gray-700"><span className="font-semibold">Class Level:</span> {reg.class_level}</p>
                        </div>
                      </div>

                      {/* School Info */}
                      <div>
                        <p className="text-xs text-gray-500 mb-2">School Information</p>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-900">{reg.school_name}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                            <span>{reg.school_phone || 'No phone'}</span>
                          </p>
                        </div>
                      </div>

                      {/* Parent Info */}
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Parent/Guardian Contact</p>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-900">{reg.parent_name}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                            <span>{reg.parent_phone}</span>
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <button 
                          onClick={() => openRegModal(reg, false)} 
                          className="flex-1 text-center text-blue-600 hover:text-blue-900 text-sm font-semibold py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => openRegModal(reg, true)} 
                          className="flex-1 text-center text-indigo-600 hover:text-indigo-900 text-sm font-semibold py-2 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteRegistration(reg.id, false)} 
                          className="flex-1 text-center text-red-600 hover:text-red-900 text-sm font-semibold py-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredRegistrations.length === 0 && (
                  <div className="text-center py-8 text-gray-500 italic bg-white rounded-lg border border-gray-200">
                    {registrations.length === 0 ? 'No registrations found yet.' : 'No registrations match your filters.'}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'coding-classes' && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-800">Coding Class Registrations</h3>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs md:text-sm font-bold self-start">{filteredCodingClasses.length} / {codingClassRegistrations.length} Total</span>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={codingClassesSearch}
                    onChange={(e) => setCodingClassesSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-gray-900"
                  />
                </div>
                <select
                  value={codingClassesFilterStatus}
                  onChange={(e) => setCodingClassesFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-gray-900 bg-white"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Mobile-first card layout */}
              <div className="grid grid-cols-1 gap-4">
                {filteredCodingClasses.map((reg) => (
                  <div key={reg.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      {/* Header: Date & Status */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 pb-3 border-b border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Registered</p>
                          <p className="text-sm font-semibold text-gray-900">{new Date(reg.created_at).toLocaleDateString()}</p>
                        </div>
                        <select
                          value={reg.status}
                          onChange={async (e) => {
                            const result = await updateCodingClassStatus(reg.id, e.target.value);
                            if (result.success) {
                              showNotification('success', 'Status updated successfully!');
                              fetchData();
                            } else {
                              showNotification('error', 'Error updating status: ' + result.error);
                            }
                          }}
                          className={`text-xs font-bold px-3 py-2 rounded-lg border-0 outline-none cursor-pointer ${
                            reg.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : reg.status === 'contacted'
                              ? 'bg-blue-100 text-blue-800'
                              : reg.status === 'enrolled'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="enrolled">Enrolled</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      {/* Student Info */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Student Information</p>
                        <h4 className="text-base font-bold text-gray-900">{reg.full_name}</h4>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            <span className="truncate">{reg.email || 'No email'}</span>
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                            <span>{reg.phone}</span>
                          </p>
                          <p className="text-xs text-gray-500">{reg.gender}{reg.age ? `, ${reg.age} years old` : ''}</p>
                        </div>
                      </div>

                      {/* Courses */}
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Enrolled Courses</p>
                        <div className="flex flex-wrap gap-2">
                          {reg.courses.map((course, i) => (
                            <span key={i} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold">
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Payment Plan</p>
                          <p className="text-sm font-semibold text-gray-900 capitalize">{reg.payment_plan.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Experience</p>
                          <p className="text-sm font-semibold text-gray-900 capitalize">{reg.experience_level}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500 mb-1">Preferred Start Date</p>
                          {reg.preferred_start_date ? (
                            <p className="text-sm font-semibold text-gray-900">{new Date(reg.preferred_start_date).toLocaleDateString()}</p>
                          ) : (
                            <p className="text-sm text-gray-400 italic">Not specified</p>
                          )}
                        </div>
                      </div>

                      {/* Notes */}
                      {reg.notes && (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500 mb-1">Notes</p>
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{reg.notes}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <button 
                          onClick={() => openRegModal(reg, false)} 
                          className="flex-1 text-center text-blue-600 hover:text-blue-900 text-sm font-semibold py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => openRegModal(reg, true)} 
                          className="flex-1 text-center text-indigo-600 hover:text-indigo-900 text-sm font-semibold py-2 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteRegistration(reg.id, true)} 
                          className="flex-1 text-center text-red-600 hover:text-red-900 text-sm font-semibold py-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {codingClassRegistrations.length === 0 && (
                  <div className="text-center py-8 text-gray-500 italic bg-white rounded-lg border border-gray-200">
                    No coding class registrations found yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'staff-notes' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Staff E-Notes</h2>
                <button
                  onClick={() => openNoteModal()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add New Note
                </button>
              </div>

              {/* Search and Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={notesSearch}
                  onChange={(e) => { setNotesSearch(e.target.value); setNotesPage(1); }}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                />
                <select
                  value={notesFilterStatus}
                  onChange={(e) => { setNotesFilterStatus(e.target.value); setNotesPage(1); }}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="" className="text-gray-500">All Status</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
                <select
                  value={notesFilterCategory}
                  onChange={(e) => { setNotesFilterCategory(e.target.value); setNotesPage(1); }}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="" className="text-gray-500">All Categories</option>
                  <option value="general">General</option>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                  <option value="urgent">Urgent</option>
                  <option value="announcement">Announcement</option>
                </select>
                <select
                  value={notesFilterPriority}
                  onChange={(e) => { setNotesFilterPriority(e.target.value); setNotesPage(1); }}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="" className="text-gray-500">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Notes List */}
              {notesLoading ? (
                <div className="text-center py-8 text-gray-600">Loading notes...</div>
              ) : (
                <>
                  <div className="grid gap-4">
                    {staffNotes.map((note) => (
                      <div key={note.id} className={`border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow ${note.is_pinned ? 'bg-yellow-50 border-yellow-300' : ''}`}>
                        <div className="flex flex-col md:flex-row md:justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              {note.is_pinned && <span className="text-yellow-600">📌</span>}
                              <h3 className="text-base md:text-lg font-bold text-gray-800 break-words">{note.title}</h3>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600 mb-2 flex-wrap">
                              <span>By: {note.author}</span>
                              <span>•</span>
                              <span>{new Date(note.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-2 mb-2 flex-wrap">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                note.category === 'urgent' ? 'bg-red-100 text-red-800' :
                                note.category === 'announcement' ? 'bg-purple-100 text-purple-800' :
                                note.category === 'student' ? 'bg-blue-100 text-blue-800' :
                                note.category === 'admin' ? 'bg-gray-100 text-gray-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {note.category || 'general'}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                note.priority === 'urgent' ? 'bg-red-200 text-red-900' :
                                note.priority === 'high' ? 'bg-orange-200 text-orange-900' :
                                note.priority === 'low' ? 'bg-gray-200 text-gray-700' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {note.priority || 'normal'}
                              </span>
                            </div>
                            {note.content ? (
                              <p className="text-gray-700 text-xs md:text-sm line-clamp-2 break-words">{note.content}</p>
                            ) : note.file_urls && note.file_urls.length > 0 ? (
                              <p className="text-gray-500 text-xs md:text-sm italic">📎 Attachment-only note</p>
                            ) : (
                              <p className="text-gray-400 text-xs md:text-sm italic">No content</p>
                            )}
                            {note.file_urls && note.file_urls.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-600 font-semibold mb-1">Attachments:</p>
                                <div className="flex flex-wrap gap-2">
                                  {note.file_urls.map((fileData, idx) => {
                                    // Parse fileData if it's a JSON string
                                    let fileObj: { name: string; url: string };
                                    if (typeof fileData === 'string') {
                                      try {
                                        fileObj = JSON.parse(fileData);
                                      } catch {
                                        // If it's a plain URL string
                                        fileObj = { name: fileData.split('/').pop() || `File ${idx + 1}`, url: fileData };
                                      }
                                    } else {
                                      fileObj = fileData;
                                    }
                                    
                                    const fileName = fileObj.name || `File ${idx + 1}`;
                                    const url = fileObj.url || '';
                                    
                                    return (
                                      <a 
                                        key={idx} 
                                        href={url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded break-all"
                                      >
                                        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                        </svg>
                                        <span className="truncate max-w-[150px]">{fileName}</span>
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 md:flex-col md:gap-2 flex-shrink-0">
                            <button onClick={() => openNoteModal(note, false)} className="text-blue-600 hover:text-blue-900 text-xs md:text-sm font-medium px-3 py-1 bg-blue-50 rounded hover:bg-blue-100 transition-colors">View</button>
                            <button onClick={() => openNoteModal(note, true)} className="text-indigo-600 hover:text-indigo-900 text-xs md:text-sm font-medium px-3 py-1 bg-indigo-50 rounded hover:bg-indigo-100 transition-colors">Edit</button>
                            <button onClick={() => handleDeleteNote(note.id)} className="text-red-600 hover:text-red-900 text-xs md:text-sm font-medium px-3 py-1 bg-red-50 rounded hover:bg-red-100 transition-colors">Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {staffNotes.length === 0 && (
                      <div className="text-center py-8 text-gray-500 italic">
                        No staff notes found. Create your first note!
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {notesTotal > 50 && (
                    <div className="flex justify-center items-center gap-4 mt-6 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setNotesPage(p => Math.max(1, p - 1))}
                        disabled={notesPage === 1}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-gray-700 font-medium">
                        Page {notesPage} of {Math.ceil(notesTotal / 50)}
                      </span>
                      <button
                        onClick={() => setNotesPage(p => p + 1)}
                        disabled={notesPage >= Math.ceil(notesTotal / 50)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'professional-trainings' && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
                <h2 className="text-lg md:text-2xl font-bold text-gray-800">Professional Training Registrations</h2>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs md:text-sm font-semibold self-start">
                  {filteredProfessionalTrainings.length} / {professionalTrainings.length} Total
                </span>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by name, email, phone, or program..."
                    value={professionalTrainingsSearch}
                    onChange={(e) => setProfessionalTrainingsSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 text-gray-900"
                  />
                </div>
                <select
                  value={professionalTrainingsFilterStatus}
                  onChange={(e) => setProfessionalTrainingsFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 text-gray-900 bg-white"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={professionalTrainingsFilterProgram}
                  onChange={(e) => setProfessionalTrainingsFilterProgram(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 text-gray-900 bg-white"
                >
                  <option value="">All Programs</option>
                  <option value="AI: Deep Learning">AI: Deep Learning</option>
                  <option value="AI: Machine Learning">AI: Machine Learning</option>
                  <option value="Power BI">Power BI</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="IoT">IoT</option>
                </select>
              </div>

              {filteredProfessionalTrainings.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
                  <p className="text-lg">{professionalTrainings.length === 0 ? 'No professional training registrations yet.' : 'No registrations match your filters.'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Name</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Email</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Phone</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Training Program</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Schedule</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Level</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProfessionalTrainings.map((training) => (
                        <tr key={training.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-gray-800 text-sm">{training.full_name}</div>
                            {training.organization && (
                              <div className="text-xs text-gray-500">{training.organization}</div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{training.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{training.phone}</td>
                          <td className="px-4 py-3">
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">
                              {training.training_program}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{training.preferred_schedule}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              training.experience_level === 'Beginner' ? 'bg-green-100 text-green-800' :
                              training.experience_level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {training.experience_level}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={training.status || 'pending'}
                              onChange={async (e) => {
                                const result = await updateProfessionalTraining(training.id, { status: e.target.value });
                                if (result.success) {
                                  fetchProfessionalTrainingsData();
                                } else {
                                  showNotification('error', 'Failed to update status');
                                }
                              }}
                              className={`px-2 py-1 rounded text-xs font-semibold border-0 ${
                                training.status === 'enrolled' ? 'bg-green-100 text-green-800' :
                                training.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                                training.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="contacted">Contacted</option>
                              <option value="enrolled">Enrolled</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedRegistration(training);
                                  setIsRegModalOpen(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 text-xs font-semibold"
                              >
                                View
                              </button>
                              <button
                                onClick={() => {
                                  showConfirmDialog(
                                    'Delete Registration',
                                    'Are you sure you want to delete this registration? This action cannot be undone.',
                                    async () => {
                                      const result = await deleteProfessionalTraining(training.id);
                                      if (result.success) {
                                        showNotification('success', 'Registration deleted successfully!');
                                        fetchProfessionalTrainingsData();
                                      } else {
                                        showNotification('error', 'Failed to delete');
                                      }
                                      closeConfirmDialog();
                                    }
                                  );
                                }}
                                className="text-red-600 hover:text-red-800 text-xs font-semibold"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
