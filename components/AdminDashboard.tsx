
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Activity, AlertCircle, 
  Settings, CheckCircle, XCircle, Plus, Droplet, 
  Building2, Search, Bell, Menu, X, Trash2, FileText, BarChart3,
  UserCheck, Eye, Shield, Save, Info, Phone, Mail, MapPin, LogOut,
  Megaphone, Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Mock Data
type Tab = 'dashboard' | 'donors' | 'requests' | 'stock' | 'hospitals' | 'campaigns';

const INITIAL_REQUESTS_MOCK = [
  { id: 1, patient: 'Neha Gupta', type: 'O+', hospital: 'St. Mary\'s Hospital', units: 2, urgency: 'Critical', time: '10 mins ago', status: 'pending' },
  { id: 2, patient: 'Rajesh Kumar', type: 'A-', hospital: 'General Hospital', units: 1, urgency: 'High', time: '45 mins ago', status: 'pending' },
];

const BLOOD_STOCK = [
  { group: 'A+', units: 120, status: 'Good' },
  { group: 'A-', units: 45, status: 'Low' },
  { group: 'B+', units: 150, status: 'Good' },
  { group: 'B-', units: 30, status: 'Critical' },
  { group: 'AB+', units: 80, status: 'Moderate' },
  { group: 'AB-', units: 25, status: 'Critical' },
  { group: 'O+', units: 200, status: 'High' },
  { group: 'O-', units: 40, status: 'Low' },
];

const INITIAL_HOSPITALS = [
  { id: 1, name: 'St. Mary\'s Hospital', location: 'Downtown, NY', contact: '+1 555-0123', type: 'General' },
  { id: 2, name: 'City General', location: 'Queens, NY', contact: '+1 555-0124', type: 'Public' },
  { id: 3, name: 'Westside Medical', location: 'Brooklyn, NY', contact: '+1 555-0125', type: 'Private' },
];

const INITIAL_DONORS_MOCK = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 98765 01234', group: 'O+', location: 'Delhi', lastDonation: '2 months ago', status: 'Active', verified: true },
  { id: 2, name: 'Priya Desai', email: 'priya@example.com', phone: '+91 98765 01235', group: 'A-', location: 'Mumbai', lastDonation: '5 months ago', status: 'Active', verified: true },
];

const INITIAL_CAMPAIGNS = [
  { id: 1, title: "Bangalore Red Cross Drive", organizer: "Red Cross Society", type: 'Blood Drive', date: "2023-10-25", time: "09:00 AM", location: "Kanteerava Stadium", city: "Bangalore", status: 'Upcoming' },
  { id: 2, title: "Cyber City Emergency Camp", organizer: "TechPark CSR", type: 'Emergency Camp', date: "2023-10-26", time: "10:00 AM", location: "Cyber Hub", city: "Gurugram", status: 'Ongoing' },
];

const AdminDashboard: React.FC = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Notification State
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null);

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
      isOpen: boolean;
      type: 'request_approve' | 'request_decline' | 'delete_hospital' | 'delete_donor' | 'delete_campaign';
      dataId: number | null;
      title: string;
      message: string;
  }>({
      isOpen: false,
      type: 'request_approve',
      dataId: null,
      title: '',
      message: ''
  });

  // View Donor Modal State
  const [viewDonor, setViewDonor] = useState<any | null>(null);

  // Data State
  const [stockData, setStockData] = useState(BLOOD_STOCK);
  const [requests, setRequests] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState(INITIAL_HOSPITALS);
  const [donors, setDonors] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  
  // Hospital Form State
  const [newHospital, setNewHospital] = useState({ name: '', location: '', contact: '', type: 'General' });
  const [editingId, setEditingId] = useState<number | null>(null);

  // Donor Form State
  const [isDonorFormOpen, setIsDonorFormOpen] = useState(false);
  const [newDonor, setNewDonor] = useState({
    name: '',
    email: '',
    phone: '',
    group: 'O+',
    location: '',
    lastDonation: 'Never',
    status: 'Active'
  });

  // Campaign Form State
  const [isCampaignFormOpen, setIsCampaignFormOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    organizer: '',
    type: 'Blood Drive',
    date: '',
    time: '',
    location: '',
    city: '',
    status: 'Upcoming'
  });

  // Load data from LocalStorage
  useEffect(() => {
     if (!isAuthenticated || user?.role !== 'admin') return;

     // Load Users
     const storedUsers = JSON.parse(localStorage.getItem('rakhtsetu_users') || '[]');
     const formattedStoredUsers = storedUsers.map((u: any) => ({
         id: u.id,
         name: u.name,
         email: u.email,
         phone: u.phone,
         group: u.bloodGroup,
         location: u.location,
         lastDonation: u.lastDonation || 'Never',
         status: 'Active',
         verified: true
     }));
     setDonors([...formattedStoredUsers, ...INITIAL_DONORS_MOCK]);

     // Load Requests
     const storedRequests = JSON.parse(localStorage.getItem('rakhtsetu_requests') || '[]');
     setRequests([...storedRequests, ...INITIAL_REQUESTS_MOCK]);

     // Load Campaigns
     const storedCampaigns = JSON.parse(localStorage.getItem('rakhtsetu_campaigns') || '[]');
     setCampaigns([...storedCampaigns, ...INITIAL_CAMPAIGNS]);

  }, [activeTab, isAuthenticated, user]); // Re-fetch when tab changes to keep fresh

  // --- Helper Functions ---
  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
        await login(loginEmail, loginPassword);
    } catch (err) {
        setLoginError('Invalid credentials. Access denied.');
    } finally {
        setIsLoggingIn(false);
    }
  };

  // Stats derived from state
  const STATS = [
    { id: 'donors', label: 'Total Donors', value: donors.length.toString(), change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'requests', label: 'Total Requests', value: requests.length.toString(), change: '+5%', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'stock', label: 'Blood Units', value: stockData.reduce((acc, curr) => acc + curr.units, 0).toString(), change: '+18%', icon: Droplet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'campaigns', label: 'Active Campaigns', value: campaigns.length.toString(), change: '+2', icon: Megaphone, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const handleStockUpdate = (group: string, increment: boolean) => {
    setStockData(prev => prev.map(item => {
      if (item.group === group) {
        return { ...item, units: Math.max(0, item.units + (increment ? 1 : -1)) };
      }
      return item;
    }));
  };

  // --- Handlers with Custom Confirmation ---

  const handleRequestAction = (id: number, action: 'approve' | 'decline') => {
      setConfirmDialog({
          isOpen: true,
          type: action === 'approve' ? 'request_approve' : 'request_decline',
          dataId: id,
          title: action === 'approve' ? 'Approve Request' : 'Decline Request',
          message: `Are you sure you want to ${action} this blood request? ${action === 'approve' ? 'This will notify donors.' : 'This cannot be undone.'}`
      });
  };

  const handleDeleteHospital = (id: number) => {
      setConfirmDialog({
          isOpen: true,
          type: 'delete_hospital',
          dataId: id,
          title: 'Delete Hospital',
          message: "Are you sure you want to delete this hospital? This action cannot be undone."
      });
  };

  const handleDeleteDonor = (id: number) => {
      setConfirmDialog({
          isOpen: true,
          type: 'delete_donor',
          dataId: id,
          title: 'Remove Donor',
          message: "Are you sure you want to remove this donor from the registry?"
      });
  };

  const handleDeleteCampaign = (id: number) => {
      setConfirmDialog({
          isOpen: true,
          type: 'delete_campaign',
          dataId: id,
          title: 'Delete Campaign',
          message: "Are you sure you want to delete this campaign? This action cannot be undone."
      });
  };

  const executeConfirmation = () => {
      const { type, dataId } = confirmDialog;
      if (!dataId) return;

      if (type === 'request_approve' || type === 'request_decline') {
          const status = type === 'request_approve' ? 'approved' : 'declined';
          const updatedRequests = requests.map(req => req.id === dataId ? { ...req, status } : req);
          setRequests(updatedRequests);
          
          // Update local storage
          const storedRequests = JSON.parse(localStorage.getItem('rakhtsetu_requests') || '[]');
          const updatedStored = storedRequests.map((req:any) => req.id === dataId ? { ...req, status } : req);
          localStorage.setItem('rakhtsetu_requests', JSON.stringify(updatedStored));
          
          showNotification(`Request ${status} successfully`, type === 'request_approve' ? 'success' : 'info');
      }
      else if (type === 'delete_hospital') {
          setHospitals(currentHospitals => currentHospitals.filter(h => h.id !== dataId));
          if (editingId === dataId) handleCancelEdit();
          showNotification("Hospital deleted successfully");
      }
      else if (type === 'delete_donor') {
          setDonors(prev => prev.filter(d => d.id !== dataId));
          // Update local storage
          const storedUsers = JSON.parse(localStorage.getItem('rakhtsetu_users') || '[]');
          const filteredUsers = storedUsers.filter((u:any) => u.id !== dataId);
          localStorage.setItem('rakhtsetu_users', JSON.stringify(filteredUsers));
          showNotification("Donor removed successfully");
      }
      else if (type === 'delete_campaign') {
          setCampaigns(prev => prev.filter(c => c.id !== dataId));
          const stored = JSON.parse(localStorage.getItem('rakhtsetu_campaigns') || '[]');
          const filtered = stored.filter((c:any) => c.id !== dataId);
          localStorage.setItem('rakhtsetu_campaigns', JSON.stringify(filtered));
          showNotification("Campaign deleted successfully");
      }

      setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  const handleExportRequests = () => {
      // Create CSV Headers
      const headers = ['Request ID,Patient,Blood Group,Hospital,Units,Urgency,Time,Status'];
      
      // Create Rows
      const rows = requests.map(req => {
          // Escape quotes in strings if necessary (simple CSV handling)
          const safePatient = req.patient ? req.patient.toString().replace(/"/g, '""') : '';
          const safeHospital = req.hospital ? req.hospital.toString().replace(/"/g, '""') : '';
          return `${req.id},"${safePatient}",${req.type},"${safeHospital}",${req.units},${req.urgency},"${req.time}",${req.status}`;
      });

      // Combine
      const csvContent = [headers, ...rows].join('\n');
      
      // Create Blob and Download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `blood-requests-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      showNotification("Data exported successfully", "success");
  };

  const handleEditHospital = (hospital: any) => {
    setNewHospital({
      name: hospital.name,
      location: hospital.location,
      contact: hospital.contact,
      type: hospital.type
    });
    setEditingId(hospital.id);
    
    const form = document.getElementById('hospital-form');
    if (form) form.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
      setEditingId(null);
      setNewHospital({ name: '', location: '', contact: '', type: 'General' });
  };

  const handleSaveDonor = (e: React.FormEvent) => {
    e.preventDefault();
    const donor = {
      id: Date.now(),
      ...newDonor,
      verified: true 
    };
    setDonors(prev => [donor, ...prev]);
    setIsDonorFormOpen(false);
    setNewDonor({ name: '', email: '', phone: '', group: 'O+', location: '', lastDonation: 'Never', status: 'Active' });
    showNotification("New donor added successfully");
  };

  const handleVerifyDonor = (id: number) => {
    setDonors(prev => prev.map(d => d.id === id ? { ...d, verified: true } : d));
    showNotification("Donor verified");
  };

  const handleViewDonor = (donor: any) => {
    setViewDonor(donor);
  };

  const handleSaveHospital = (e: React.FormEvent) => {
      e.preventDefault();
      if(!newHospital.name || !newHospital.location) return;
      
      if (editingId !== null) {
          setHospitals(prev => prev.map(h => 
              h.id === editingId ? { ...h, ...newHospital } : h
          ));
          showNotification("Hospital updated successfully!");
          handleCancelEdit();
      } else {
          const hospital = {
              id: Date.now(),
              ...newHospital
          };
          setHospitals(prev => [...prev, hospital]);
          setNewHospital({ name: '', location: '', contact: '', type: 'General' });
          showNotification("Hospital registered successfully!");
      }
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
      e.preventDefault();
      if(!newCampaign.title || !newCampaign.location) return;
      
      // Default image for Indian context
      const defaultImage = "https://images.unsplash.com/photo-1596367402913-9247e132f153?auto=format&fit=crop&w=800&q=80";

      const campaign = {
          id: Date.now(),
          ...newCampaign,
          image: defaultImage,
          bloodGroups: ['All Groups'],
          attendees: 0,
          distance: Math.floor(Math.random() * 10) + 1
      };
      
      const updatedCampaigns = [campaign, ...campaigns];
      setCampaigns(updatedCampaigns);
      
      // Update local storage
      const stored = JSON.parse(localStorage.getItem('rakhtsetu_campaigns') || '[]');
      localStorage.setItem('rakhtsetu_campaigns', JSON.stringify([campaign, ...stored]));
      
      setIsCampaignFormOpen(false);
      setNewCampaign({ title: '', organizer: '', type: 'Blood Drive', date: '', time: '', location: '', city: '', status: 'Upcoming' });
      showNotification("Campaign created successfully");
  };

  const renderSidebarItem = (id: Tab, label: string, icon: React.ElementType) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        activeTab === id 
          ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {React.createElement(icon, { size: 20 })}
      <span className="font-medium">{label}</span>
    </button>
  );

  // Authentication Checks
  if (!isAuthenticated) {
      return (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
                <div className="bg-slate-50 p-8 text-center border-b border-slate-100">
                   <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <Activity className="w-8 h-8 text-brand-600" />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-900">Admin Portal</h2>
                   <p className="text-slate-500 text-sm mt-1">Restricted System Access</p>
                </div>
                <form onSubmit={handleLoginSubmit} className="p-8 space-y-5">
                    {loginError && (
                        <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-center gap-3 border border-red-100 animate-shake">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" /> {loginError}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Email Credentials</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <input 
                                type="email" 
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all font-medium text-slate-700"
                                placeholder="admin@rakhtsetu.com"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Password</label>
                        <div className="relative">
                            <Shield className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <input 
                                type="password" 
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all font-medium text-slate-700"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoggingIn}
                        className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoggingIn ? <span className="animate-pulse">Verifying...</span> : <>Authenticate <CheckCircle className="w-4 h-4" /></>}
                    </button>
                </form>
                <div className="bg-slate-50 p-4 text-center text-xs text-slate-400 border-t border-slate-100">
                    <p className="mb-2">Unauthorized access is strictly prohibited.</p>
                    <p>Demo: <span className="font-mono font-medium text-slate-600">admin@rakhtsetu.com</span> / <span className="font-mono font-medium text-slate-600">admin</span></p>
                </div>
            </div>
          </div>
      );
  }

  if (user?.role !== 'admin') {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-red-100">
               <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <AlertCircle className="w-10 h-10 text-red-500" />
               </div>
               <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
               <p className="text-slate-600 mb-8 leading-relaxed">
                 You are logged in as <strong>{user?.name}</strong>, but you do not have administrative privileges to access this dashboard.
               </p>
               <button onClick={logout} className="w-full bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
                 Sign Out
               </button>
            </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex animate-fadeIn relative">
      
      {/* Notification Toast */}
      {notification && (
          <div className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-xl shadow-xl border flex items-center gap-3 animate-slideLeft ${
              notification.type === 'success' ? 'bg-white border-green-100 text-green-800' : 
              notification.type === 'error' ? 'bg-white border-red-100 text-red-800' :
              'bg-slate-800 text-white border-slate-700'
          }`}>
              {notification.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-500" /> : 
               notification.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-500" /> :
               <Info className="w-5 h-5 text-blue-400" />}
              <span className="font-medium">{notification.message}</span>
              <button onClick={() => setNotification(null)} className="ml-2 opacity-60 hover:opacity-100">
                  <X className="w-4 h-4" />
              </button>
          </div>
      )}

      {/* Confirmation Modal */}
      {confirmDialog.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 animate-scaleUp">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                      confirmDialog.type === 'request_approve' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                      {confirmDialog.type === 'request_approve' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{confirmDialog.title}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{confirmDialog.message}</p>
                  <div className="flex gap-3">
                      <button 
                          onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                          className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                      >
                          Cancel
                      </button>
                      <button 
                          onClick={executeConfirmation}
                          className={`flex-1 py-2.5 font-semibold rounded-xl text-white shadow-lg transition-all ${
                              confirmDialog.type === 'request_approve' 
                                  ? 'bg-green-600 hover:bg-green-700 shadow-green-500/30' 
                                  : 'bg-red-600 hover:bg-red-700 shadow-red-500/30'
                          }`}
                      >
                          Confirm
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* View Donor Modal */}
      {viewDonor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-slate-800">Donor Details</h3>
                      <button onClick={() => setViewDonor(null)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-2xl font-bold">
                              {viewDonor.name.charAt(0)}
                          </div>
                          <div>
                              <h4 className="text-xl font-bold text-slate-900">{viewDonor.name}</h4>
                              <span className="inline-block bg-brand-600 text-white text-xs px-2 py-0.5 rounded-md font-bold">
                                  {viewDonor.group}
                              </span>
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                              <p className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1"><Mail className="w-3 h-3" /> Email</p>
                              <p className="text-sm font-medium text-slate-800">{viewDonor.email}</p>
                          </div>
                          <div className="space-y-1">
                              <p className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</p>
                              <p className="text-sm font-medium text-slate-800">{viewDonor.phone}</p>
                          </div>
                          <div className="space-y-1">
                              <p className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</p>
                              <p className="text-sm font-medium text-slate-800">{viewDonor.location}</p>
                          </div>
                          <div className="space-y-1">
                              <p className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1"><Activity className="w-3 h-3" /> Status</p>
                              <p className={`text-sm font-medium ${viewDonor.status === 'Active' ? 'text-green-600' : 'text-slate-600'}`}>{viewDonor.status}</p>
                          </div>
                      </div>
                  </div>
                  <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                      <button onClick={() => setViewDonor(null)} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                          Close
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-20 flex items-center px-8 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900">
              <div className="bg-red-50 p-2 rounded-lg">
                <Activity className="h-6 w-6 text-brand-600" />
              </div>
              <span className="font-bold text-xl">RakhtSetu<span className="text-slate-400 text-sm ml-1 font-normal">Admin</span></span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {renderSidebarItem('dashboard', 'Dashboard', LayoutDashboard)}
            {renderSidebarItem('donors', 'Donors', Users)}
            {renderSidebarItem('requests', 'Requests', FileText)}
            {renderSidebarItem('stock', 'Blood Stock', Droplet)}
            {renderSidebarItem('hospitals', 'Hospitals', Building2)}
            {renderSidebarItem('campaigns', 'Campaigns', Megaphone)}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <img src={user?.avatar || "https://ui-avatars.com/api/?name=Admin"} alt="Admin" className="w-10 h-10 rounded-full" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <button onClick={logout} className="text-slate-400 hover:text-red-600 transition-colors" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab} Overview</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center px-4 py-2 bg-slate-100 rounded-lg text-slate-500">
              <Search size={18} />
              <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none ml-2 w-48 text-sm" />
            </div>
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat, index) => (
                  <div 
                    key={index} 
                    onClick={() => setActiveTab(stat.id as Tab)}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                        {React.createElement(stat.icon, { size: 24 })}
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.label}</h3>
                    <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Requests */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Recent Emergency Requests</h3>
                    <button onClick={() => setActiveTab('requests')} className="text-brand-600 text-sm font-semibold hover:text-brand-700">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    {requests.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">No pending requests</div>
                    ) : (
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                          <th className="px-6 py-4">Patient</th>
                          <th className="px-6 py-4">Blood Group</th>
                          <th className="px-6 py-4">Hospital</th>
                          <th className="px-6 py-4">Urgency</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {requests.filter(r => r.status === 'pending').slice(0, 5).map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">{req.patient}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                {req.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500">{req.hospital}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                req.urgency === 'Critical' ? 'bg-red-100 text-red-700' :
                                req.urgency === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {req.urgency}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button 
                                    onClick={() => handleRequestAction(req.id, 'approve')}
                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" 
                                    title="Approve"
                                >
                                  <CheckCircle size={18} />
                                </button>
                                <button 
                                    onClick={() => handleRequestAction(req.id, 'decline')}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" 
                                    title="Decline"
                                >
                                  <XCircle size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    )}
                  </div>
                </div>

                {/* Quick Stock View */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="font-bold text-slate-900 mb-6">Blood Stock Alert</h3>
                  <div className="space-y-4">
                    {stockData.filter(s => s.status === 'Low' || s.status === 'Critical').map((item) => (
                      <div key={item.group} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                            item.status === 'Critical' ? 'bg-red-500' : 'bg-amber-500'
                          }`}>
                            {item.group}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{item.units} Units</p>
                            <p className={`text-xs font-bold ${item.status === 'Critical' ? 'text-red-600' : 'text-amber-600'}`}>
                              {item.status} Stock
                            </p>
                          </div>
                        </div>
                        <button 
                            onClick={() => setActiveTab('stock')}
                            className="text-xs font-semibold text-brand-600 bg-white border border-brand-200 px-3 py-1.5 rounded-lg hover:bg-brand-50"
                        >
                          Restock
                        </button>
                      </div>
                    ))}
                    {stockData.filter(s => s.status === 'Low' || s.status === 'Critical').length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
                        <p>All blood groups are well stocked.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REQUESTS TAB */}
          {activeTab === 'requests' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
                <h3 className="font-bold text-xl text-slate-900">Manage Requests</h3>
                <div className="flex gap-3">
                   <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">History</button>
                   <button 
                      onClick={handleExportRequests}
                      className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm"
                   >
                      Export Data
                   </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                {requests.length === 0 ? (
                    <div className="p-12 text-center">
                        <CheckCircle className="w-16 h-16 text-green-100 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">All Caught Up!</h3>
                        <p className="text-slate-500">There are no pending blood requests at this moment.</p>
                    </div>
                ) : (
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                      <th className="px-6 py-4">Request ID</th>
                      <th className="px-6 py-4">Patient</th>
                      <th className="px-6 py-4">Group</th>
                      <th className="px-6 py-4">Hospital</th>
                      <th className="px-6 py-4">Units</th>
                      <th className="px-6 py-4">Requested</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {requests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-mono text-slate-500">#REQ-{req.id}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">{req.patient}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-brand-700 font-bold text-xs">
                            {req.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{req.hospital}</td>
                        <td className="px-6 py-4 font-medium">{req.units}</td>
                        <td className="px-6 py-4 text-slate-500">{req.time}</td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase ${
                               req.status === 'approved' ? 'bg-green-100 text-green-700' :
                               req.status === 'declined' ? 'bg-red-100 text-red-700' :
                               'bg-blue-100 text-blue-700'
                           }`}>
                             {req.status}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                          {req.status === 'pending' && (
                          <div className="flex gap-3">
                            <button 
                                onClick={() => handleRequestAction(req.id, 'approve')}
                                className="text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-md text-xs font-bold transition-colors shadow-sm"
                            >
                              Approve
                            </button>
                            <button 
                                onClick={() => handleRequestAction(req.id, 'decline')}
                                className="text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md text-xs font-bold transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                )}
              </div>
            </div>
          )}

          {/* DONORS TAB */}
          {activeTab === 'donors' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-xl text-slate-900">Registered Donors</h3>
                  <p className="text-sm text-slate-500">Manage donor accounts and verifications.</p>
                </div>
                <div className="flex gap-3">
                   <button 
                     onClick={() => setIsDonorFormOpen(!isDonorFormOpen)}
                     className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm">
                      <Plus className="w-4 h-4 inline mr-2" /> {isDonorFormOpen ? 'Cancel' : 'Add Donor'}
                   </button>
                </div>
              </div>

              {/* Add Donor Form */}
              {isDonorFormOpen && (
                <div className="p-6 bg-slate-50 border-b border-slate-100 animate-fadeIn">
                   <form onSubmit={handleSaveDonor} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Full Name</label>
                          <input 
                            type="text" required 
                            value={newDonor.name} 
                            onChange={e => setNewDonor({...newDonor, name: e.target.value})}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                          />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Email</label>
                          <input 
                            type="email" required 
                            value={newDonor.email} 
                            onChange={e => setNewDonor({...newDonor, email: e.target.value})}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                          />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Phone</label>
                          <input 
                            type="tel" required 
                            value={newDonor.phone} 
                            onChange={e => setNewDonor({...newDonor, phone: e.target.value})}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                          />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Blood Group</label>
                          <select 
                            value={newDonor.group}
                            onChange={e => setNewDonor({...newDonor, group: e.target.value})}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                          >
                              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                                  <option key={g} value={g}>{g}</option>
                              ))}
                          </select>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Location</label>
                          <input 
                            type="text" required 
                            value={newDonor.location} 
                            onChange={e => setNewDonor({...newDonor, location: e.target.value})}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                          />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Status</label>
                          <select 
                            value={newDonor.status}
                            onChange={e => setNewDonor({...newDonor, status: e.target.value})}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                          >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                          </select>
                      </div>
                      
                      <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3 mt-4 border-t border-slate-200 pt-4">
                          <button type="button" onClick={() => setIsDonorFormOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium">Cancel</button>
                          <button type="submit" className="px-6 py-2 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 shadow-md">Save Donor</button>
                      </div>
                   </form>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Blood Group</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Last Donation</th>
                      <th className="px-6 py-4">Verified</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {donors.map((donor) => (
                      <tr key={donor.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                              {donor.name.charAt(0)}
                            </div>
                            <span className="font-medium text-slate-900">{donor.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-brand-700 font-bold text-xs">
                            {donor.group}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{donor.location}</td>
                        <td className="px-6 py-4 text-slate-500">{donor.lastDonation}</td>
                        <td className="px-6 py-4">
                          {donor.verified ? (
                             <span className="text-green-600 flex items-center gap-1 text-xs font-bold"><Shield size={14} /> Verified</span>
                          ) : (
                             <button onClick={() => handleVerifyDonor(donor.id)} className="text-blue-600 hover:text-blue-800 text-xs font-medium underline">Verify Now</button>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            donor.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {donor.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <button 
                                onClick={() => handleViewDonor(donor)}
                                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-600 rounded-lg transition-colors"
                                title="View User Data"
                             >
                                <Eye size={16} />
                             </button>
                             <button 
                                onClick={() => handleDeleteDonor(donor.id)}
                                className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                title="Remove Donor"
                             >
                                <Trash2 size={16} />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {donors.length === 0 && (
                  <div className="p-12 text-center text-slate-500">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No donors found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BLOOD STOCK TAB */}
          {activeTab === 'stock' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                 <div>
                    <h3 className="text-2xl font-bold text-slate-900">Blood Stock Management</h3>
                    <p className="text-slate-500">Real-time inventory tracking across all centers.</p>
                 </div>
                 <button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
                    <BarChart3 size={18} /> Generate Report
                 </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stockData.map((item) => (
                  <div key={item.group} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full opacity-10 ${
                       item.status === 'Critical' ? 'bg-red-500' : item.status === 'Low' ? 'bg-amber-500' : 'bg-green-500'
                    }`}></div>
                    
                    <div className="flex justify-between items-start mb-6 relative z-10">
                       <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl font-black text-slate-800 border border-slate-100 shadow-inner">
                          {item.group}
                       </div>
                       <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${
                          item.status === 'Critical' ? 'bg-red-100 text-red-700' : 
                          item.status === 'Low' ? 'bg-amber-100 text-amber-700' : 
                          item.status === 'Good' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                       }`}>
                          {item.status}
                       </span>
                    </div>

                    <div className="mb-6 relative z-10">
                       <div className="text-4xl font-bold text-slate-900 mb-1">{item.units}</div>
                       <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Units</div>
                    </div>

                    <div className="flex gap-2 relative z-10">
                       <button 
                          onClick={() => handleStockUpdate(item.group, false)}
                          className="flex-1 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 py-2 rounded-lg font-bold text-lg transition-colors flex items-center justify-center"
                       >
                          -
                       </button>
                       <button 
                          onClick={() => handleStockUpdate(item.group, true)}
                          className="flex-1 bg-slate-100 hover:bg-green-50 hover:text-green-600 text-slate-600 py-2 rounded-lg font-bold text-lg transition-colors flex items-center justify-center"
                       >
                          +
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HOSPITALS TAB */}
          {activeTab === 'hospitals' && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Add/Edit Hospital Form */}
              <div className="lg:col-span-1">
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-6">
                    <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                       {editingId ? <Settings className="w-5 h-5 text-brand-600" /> : <Plus className="w-5 h-5 text-brand-600" />}
                       {editingId ? 'Update Hospital' : 'Register New Hospital'}
                    </h3>
                    <form id="hospital-form" onSubmit={handleSaveHospital} className="space-y-4">
                       <div>
                          <label className="text-sm font-semibold text-slate-700 block mb-1.5">Hospital Name</label>
                          <input 
                              type="text" 
                              required
                              value={newHospital.name}
                              onChange={(e) => setNewHospital({...newHospital, name: e.target.value})}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm" 
                              placeholder="e.g. City General" 
                           />
                       </div>
                       <div>
                          <label className="text-sm font-semibold text-slate-700 block mb-1.5">Location</label>
                          <input 
                              type="text" 
                              required
                              value={newHospital.location}
                              onChange={(e) => setNewHospital({...newHospital, location: e.target.value})}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm" 
                              placeholder="City, State" 
                          />
                       </div>
                       <div>
                          <label className="text-sm font-semibold text-slate-700 block mb-1.5">Contact Number</label>
                          <input 
                              type="text" 
                              required
                              value={newHospital.contact}
                              onChange={(e) => setNewHospital({...newHospital, contact: e.target.value})}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm" 
                              placeholder="+1 (555) 000-0000" 
                           />
                       </div>
                       <div>
                          <label className="text-sm font-semibold text-slate-700 block mb-1.5">Type</label>
                          <select 
                              value={newHospital.type}
                              onChange={(e) => setNewHospital({...newHospital, type: e.target.value})}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm text-slate-600"
                           >
                             <option>General</option>
                             <option>Private</option>
                             <option>Specialized</option>
                             <option>Clinic</option>
                          </select>
                       </div>
                       <div className="flex gap-2 mt-2">
                           <button type="submit" className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-brand-500/30 transition-all">
                              {editingId ? 'Update Hospital' : 'Register Hospital'}
                           </button>
                           {editingId && (
                               <button 
                                  type="button" 
                                  onClick={handleCancelEdit}
                                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition-all"
                               >
                                  Cancel
                               </button>
                           )}
                       </div>
                    </form>
                 </div>
              </div>

              {/* Hospital List */}
              <div className="lg:col-span-2 space-y-4">
                 {hospitals.map((hospital) => (
                    <div key={hospital.id} className={`bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all flex items-center justify-between group ${editingId === hospital.id ? 'border-brand-300 ring-2 ring-brand-50' : 'border-slate-100'}`}>
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${editingId === hospital.id ? 'bg-brand-50 text-brand-600' : 'bg-slate-100 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600'}`}>
                             <Building2 size={24} />
                          </div>
                          <div>
                             <h4 className="font-bold text-slate-900 text-lg">{hospital.name}</h4>
                             <p className="text-slate-500 text-sm flex items-center gap-2">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                {hospital.type} &bull; {hospital.location}
                             </p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <button 
                             onClick={() => handleEditHospital(hospital)}
                             className={`p-2 rounded-lg transition-colors ${editingId === hospital.id ? 'text-brand-600 bg-brand-50' : 'text-slate-400 hover:bg-slate-50'}`}
                             title="Edit Hospital Settings"
                             type="button"
                          >
                             <Settings size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteHospital(hospital.id)}
                            className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                            title="Remove Hospital"
                            type="button"
                          >
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                 ))}
                 
                 {hospitals.length === 0 && (
                     <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                         <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                         <p className="text-slate-500">No hospitals registered yet.</p>
                     </div>
                 )}
              </div>
            </div>
          )}

          {/* CAMPAIGNS TAB */}
          {activeTab === 'campaigns' && (
             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4 items-center">
                   <div>
                      <h3 className="font-bold text-xl text-slate-900">Campaign Management</h3>
                      <p className="text-sm text-slate-500">Organize and manage donation drives.</p>
                   </div>
                   <button 
                      onClick={() => setIsCampaignFormOpen(!isCampaignFormOpen)}
                      className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm flex items-center gap-2"
                   >
                      <Plus className="w-4 h-4" /> {isCampaignFormOpen ? 'Cancel' : 'Add Campaign'}
                   </button>
                </div>

                {/* Create Campaign Form */}
                {isCampaignFormOpen && (
                   <div className="p-6 bg-slate-50 border-b border-slate-100 animate-fadeIn">
                       <form onSubmit={handleSaveCampaign} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           <div>
                               <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Title</label>
                               <input 
                                 type="text" required 
                                 placeholder="Campaign Title"
                                 value={newCampaign.title}
                                 onChange={e => setNewCampaign({...newCampaign, title: e.target.value})}
                                 className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                               />
                           </div>
                           <div>
                               <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Organizer</label>
                               <input 
                                 type="text" required 
                                 placeholder="Organizer Name"
                                 value={newCampaign.organizer}
                                 onChange={e => setNewCampaign({...newCampaign, organizer: e.target.value})}
                                 className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                               />
                           </div>
                           <div>
                               <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Type</label>
                               <select 
                                 value={newCampaign.type}
                                 onChange={e => setNewCampaign({...newCampaign, type: e.target.value})}
                                 className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                               >
                                   <option>Blood Drive</option>
                                   <option>Awareness</option>
                                   <option>Emergency Camp</option>
                               </select>
                           </div>
                           <div>
                               <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Date</label>
                               <input 
                                 type="date" required 
                                 value={newCampaign.date}
                                 onChange={e => setNewCampaign({...newCampaign, date: e.target.value})}
                                 className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                               />
                           </div>
                           <div>
                               <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Time</label>
                               <input 
                                 type="text" required 
                                 placeholder="e.g. 10:00 AM - 05:00 PM"
                                 value={newCampaign.time}
                                 onChange={e => setNewCampaign({...newCampaign, time: e.target.value})}
                                 className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                               />
                           </div>
                           <div>
                               <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">City</label>
                               <input 
                                 type="text" required 
                                 placeholder="e.g. Bangalore"
                                 value={newCampaign.city}
                                 onChange={e => setNewCampaign({...newCampaign, city: e.target.value})}
                                 className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                               />
                           </div>
                           <div className="md:col-span-2 lg:col-span-2">
                               <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Location / Venue</label>
                               <input 
                                 type="text" required 
                                 placeholder="e.g. Community Hall, MG Road"
                                 value={newCampaign.location}
                                 onChange={e => setNewCampaign({...newCampaign, location: e.target.value})}
                                 className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                               />
                           </div>
                           <div>
                               <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Status</label>
                               <select 
                                 value={newCampaign.status}
                                 onChange={e => setNewCampaign({...newCampaign, status: e.target.value})}
                                 className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                               >
                                   <option>Upcoming</option>
                                   <option>Ongoing</option>
                                   <option>Completed</option>
                               </select>
                           </div>

                           <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3 pt-2">
                               <button 
                                  type="button" 
                                  onClick={() => setIsCampaignFormOpen(false)}
                                  className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg"
                               >
                                  Cancel
                               </button>
                               <button 
                                  type="submit" 
                                  className="px-6 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 shadow-md"
                               >
                                  Create Campaign
                               </button>
                           </div>
                       </form>
                   </div>
                )}

                <div className="overflow-x-auto">
                    {campaigns.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                           <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-20" />
                           <p>No campaigns scheduled.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left">
                           <thead className="bg-slate-50 text-slate-500 font-medium">
                              <tr>
                                 <th className="px-6 py-4">Title</th>
                                 <th className="px-6 py-4">Type</th>
                                 <th className="px-6 py-4">Organizer</th>
                                 <th className="px-6 py-4">Date</th>
                                 <th className="px-6 py-4">City</th>
                                 <th className="px-6 py-4">Status</th>
                                 <th className="px-6 py-4">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              {campaigns.map((camp) => (
                                 <tr key={camp.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{camp.title}</td>
                                    <td className="px-6 py-4">
                                       <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-xs border border-purple-100">
                                          {camp.type}
                                       </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{camp.organizer}</td>
                                    <td className="px-6 py-4 text-slate-600">{camp.date}</td>
                                    <td className="px-6 py-4 text-slate-600">{camp.city || camp.location}</td>
                                    <td className="px-6 py-4">
                                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                          camp.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 
                                          camp.status === 'Ongoing' ? 'bg-green-100 text-green-700 animate-pulse' : 
                                          'bg-slate-100 text-slate-600'
                                       }`}>
                                          {camp.status}
                                       </span>
                                    </td>
                                    <td className="px-6 py-4">
                                       <button 
                                          onClick={() => handleDeleteCampaign(camp.id)}
                                          className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                          title="Delete Campaign"
                                       >
                                          <Trash2 size={16} />
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                    )}
                </div>
             </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
