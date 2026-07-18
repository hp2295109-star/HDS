import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Calendar, Globe, Mail, BarChart3, Search, 
  Trash2, CheckCircle2, AlertCircle, Loader2, Download, 
  Filter, Phone, Shield, Lock, FileSpreadsheet, PlusCircle, 
  RefreshCw, Menu, X, ChevronRight, User, Key, Bell, 
  Settings, ExternalLink, Printer, Info, HelpCircle, Eye,
  ArrowRight, Check, MessageSquare
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { supabaseService } from '../services/supabaseService';
import PageTransition from '../components/PageTransition';
import { Lead, WebsiteAudit, ContactMessage, Newsletter, BookedCall } from '../types/supabase';

export default function AdminDashboard() {
  // Session & Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'forgot_password'>('login');
  
  // Auth Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Profile Change Password Fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Responsive Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'audits' | 'messages' | 'calls' | 'newsletters' | 'profile' | 'modules'>('overview');

  // CRM Data States
  const [leads, setLeads] = useState<Lead[]>([]);
  const [audits, setAudits] = useState<WebsiteAudit[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [calls, setCalls] = useState<BookedCall[]>([]);
  const [crmLoading, setCrmLoading] = useState(false);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');

  // Pagination States
  const [leadCurrentPage, setLeadCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected Lead for Detail Modal
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeadNotes, setSelectedLeadNotes] = useState('');
  const [notesSaving, setNotesSaving] = useState(false);
  const [notesFeedback, setNotesFeedback] = useState('');

  // Custom Glassy Confirm Delete Modals
  const [deleteModalConfig, setDeleteModalConfig] = useState<{
    isOpen: boolean;
    type: 'lead' | 'audit' | 'message' | 'call' | 'newsletter';
    id: string;
    title: string;
  }>({ isOpen: false, type: 'lead', id: '', title: '' });

  // Notifications State
  const [notifications, setNotifications] = useState<{ id: string; title: string; desc: string; time: string; read: boolean }[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Initialize Auth & Session
  useEffect(() => {
    const checkSession = async () => {
      try {
        if (!isSupabaseConfigured) {
          // Check local sandbox session
          const savedSession = localStorage.getItem('hds_sandbox_auth');
          if (savedSession === 'active') {
            setIsAuthenticated(true);
            setUser({ email: localStorage.getItem('hds_sandbox_email') || 'admin@hds.com', user_metadata: { name: 'Harsh Patel (Sandbox Admin)' } });
          }
          setLoading(false);
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
          setUser(session.user);
          // Prefill email
          setEmail(session.user.email || '');
        } else {
          // Check remember me prefill
          const savedEmail = localStorage.getItem('hds_remembered_email');
          if (savedEmail) {
            setEmail(savedEmail);
          }
        }
      } catch (err) {
        console.error('Session verification error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen to Auth changes if configured
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
          setIsAuthenticated(true);
          setUser(session.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // Set up Real-time listener for new leads when Supabase is configured
  useEffect(() => {
    if (!isSupabaseConfigured || !isAuthenticated) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads' },
        (payload) => {
          const newLead = payload.new as Lead;
          // Trigger Audio alert or visual notification
          setNotifications(prev => [
            {
              id: Date.now().toString(),
              title: 'New Lead Submission!',
              desc: `${newLead.name} from ${newLead.business_name || ' Chhattisgarh Business'} requested ${newLead.service}.`,
              time: 'Just Now',
              read: false
            },
            ...prev
          ]);
          // Re-fetch state
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  // Load CRM data on authentication
  const fetchData = async () => {
    if (!isAuthenticated) return;
    setCrmLoading(true);
    try {
      const [leadsData, auditsData, msgsData, newsData, callsData] = await Promise.all([
        supabaseService.getAllLeads(),
        supabaseService.getAllAudits(),
        supabaseService.getAllMessages(),
        supabaseService.getAllNewsletterSubscribers(),
        supabaseService.getAllBookedCalls()
      ]);

      setLeads(leadsData as Lead[]);
      setAudits(auditsData as WebsiteAudit[]);
      setMessages(msgsData as ContactMessage[]);
      setNewsletters(newsData as any[]);
      setCalls(callsData as BookedCall[]);
    } catch (err) {
      console.error('Error fetching dashboard records:', err);
    } finally {
      setCrmLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Submit secure Login
  const handleAuthLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');
    setAuthLoading(true);

    if (!email || !password) {
      setAuthError('Please fill in both email and password.');
      setAuthLoading(false);
      return;
    }

    try {
      if (!isSupabaseConfigured) {
        // Sandbox environment mock authentication
        if (email.toLowerCase() === 'admin@hds.com' && password === 'admin123') {
          setIsAuthenticated(true);
          setUser({ email: 'admin@hds.com', user_metadata: { name: 'Harsh Patel' } });
          localStorage.setItem('hds_sandbox_auth', 'active');
          localStorage.setItem('hds_sandbox_email', email);
          if (rememberMe) {
            localStorage.setItem('hds_remembered_email', email);
          } else {
            localStorage.removeItem('hds_remembered_email');
          }
        } else {
          setAuthError('Invalid email or password. Hint: Use admin@hds.com and admin123 for sandbox testing.');
        }
        setAuthLoading(false);
        return;
      }

      // Real Supabase Authentication
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(error.message);
      } else if (data.session) {
        setIsAuthenticated(true);
        setUser(data.user);
        if (rememberMe) {
          localStorage.setItem('hds_remembered_email', email);
        } else {
          localStorage.removeItem('hds_remembered_email');
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Forgot password handler
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');
    setAuthLoading(true);

    if (!email) {
      setAuthError('Please enter your email to receive recovery instructions.');
      setAuthLoading(false);
      return;
    }

    try {
      if (!isSupabaseConfigured) {
        setAuthSuccessMsg(`[Local Sandbox Sandbox] A password reset mock link has been triggered for: ${email}`);
        setAuthLoading(false);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin`
      });

      if (error) {
        setAuthError(error.message);
      } else {
        setAuthSuccessMsg('Recovery instructions have been sent to your email address.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Error processing forgot password request.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Change administrative password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    if (!newPassword || !confirmNewPassword) {
      setProfileErrorMsg('Both password fields are mandatory.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setProfileErrorMsg('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setProfileErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setProfileLoading(true);
    try {
      if (!isSupabaseConfigured) {
        setProfileSuccessMsg('Password updated successfully in Local Sandbox!');
        setNewPassword('');
        setConfirmNewPassword('');
        setProfileLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setProfileErrorMsg(error.message);
      } else {
        setProfileSuccessMsg('Administrative password has been successfully updated.');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err: any) {
      setProfileErrorMsg(err.message || 'Error during security update.');
    } finally {
      setProfileLoading(false);
    }
  };

  // Admin Logout Handler
  const handleLogout = async () => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem('hds_sandbox_auth');
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Trigger Mock Lead for local test
  const injectSampleLead = async () => {
    const randomNames = ['Deepak Keshri', 'Nisha Baghel', 'Rajesh Sahu', 'Karan Agrawal', 'Ramesh Dewangan'];
    const randomBusinesses = ['Keshri Sweets & Caterers', 'Baghel Medical Clinic', 'Sahu General Store', 'Agrawal Showroom Raigarh', 'Dewangan Tiles Tamnar'];
    const randomServices = ['Business Website Design', 'Local SEO', 'Google Business Profile Optimization', 'Meta Ads', 'Website Redesign'];
    const randomCities = ['Raigarh', 'Tamnar', 'Kharsia'];
    const randomBudgets = ['Under ₹10k', '₹10k - ₹25k', '₹25k - ₹50k', 'Above ₹50k'];
    const randomSources = ['/contact', '/services', '/pricing', '/business-growth-calculator'];

    const pick = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
    const city = pick(randomCities);
    const busName = pick(randomBusinesses);
    const name = pick(randomNames);

    const sampleLead = {
      name: name,
      email: `${name.toLowerCase().replace(' ', '.')}@gmail.com`,
      phone: '+91 ' + Math.floor(7000010000 + Math.random() * 2999989999),
      business_name: busName,
      service: pick(randomServices),
      budget: pick(randomBudgets),
      message: `Need a custom high-performance SEO landing page for my ${busName} based in ${city}. Focus on local Raigarh traffic and WhatsApp lead capture.`,
      status: 'New' as const,
      source: pick(randomSources),
      city: city,
      notes: ''
    };

    const response = await supabaseService.submitLead(sampleLead);
    if (response.success) {
      // Create local notification
      setNotifications(prev => [
        {
          id: Date.now().toString(),
          title: 'Simulated Lead Added',
          desc: `${name} has been securely synced to CRM database.`,
          time: 'Just Now',
          read: false
        },
        ...prev
      ]);
      await fetchData();
    }
  };

  // Lead Status Updates (saves instantly to Supabase)
  const handleUpdateLeadStatus = async (id: string, newStatus: any) => {
    const success = await supabaseService.updateLeadStatus(id, newStatus);
    if (success) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
      }
      setNotifications(prev => [
        {
          id: Date.now().toString(),
          title: 'Lead Status Updated',
          desc: `Status updated to "${newStatus}" for lead.`,
          time: 'Just Now',
          read: true
        },
        ...prev
      ]);
    }
  };

  // Save admin notes to lead
  const handleSaveLeadNotes = async () => {
    if (!selectedLead || !selectedLead.id) return;
    setNotesSaving(true);
    setNotesFeedback('');

    const success = await supabaseService.updateLeadNotes(selectedLead.id, selectedLeadNotes);
    if (success) {
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, notes: selectedLeadNotes } : l));
      setSelectedLead(prev => prev ? { ...prev, notes: selectedLeadNotes } : null);
      setNotesFeedback('Notes successfully stored in Supabase.');
      setTimeout(() => setNotesFeedback(''), 3000);
    } else {
      setNotesFeedback('Error connecting to backend database.');
    }
    setNotesSaving(false);
  };

  // Trigger record deletion confirmation
  const triggerDeleteConfirm = (type: 'lead' | 'audit' | 'message' | 'call' | 'newsletter', id: string, name: string) => {
    setDeleteModalConfig({
      isOpen: true,
      type,
      id,
      title: name
    });
  };

  // Execute secure deletion
  const executeRecordDelete = async () => {
    const { id, type } = deleteModalConfig;
    let success = false;

    try {
      if (type === 'lead') {
        success = await supabaseService.deleteLead(id);
        if (success) setLeads(prev => prev.filter(l => l.id !== id));
      } else if (type === 'audit') {
        success = await supabaseService.deleteAudit(id);
        if (success) setAudits(prev => prev.filter(a => a.id !== id));
      } else if (type === 'message') {
        success = await supabaseService.deleteMessage(id);
        if (success) setMessages(prev => prev.filter(m => m.id !== id));
      } else if (type === 'call') {
        success = await supabaseService.deleteBookedCall(id);
        if (success) setCalls(prev => prev.filter(c => c.id !== id));
      } else if (type === 'newsletter') {
        success = await supabaseService.deleteNewsletterSubscriber(id);
        if (success) setNewsletters(prev => prev.filter(n => n.id !== id));
      }

      if (success) {
        setNotifications(prev => [
          {
            id: Date.now().toString(),
            title: 'Record Permanently Deleted',
            desc: `Securely deleted ${type} item: ${deleteModalConfig.title}`,
            time: 'Just Now',
            read: true
          },
          ...prev
        ]);
      }
    } catch (err) {
      console.error('Deletion error:', err);
    } finally {
      setDeleteModalConfig({ isOpen: false, type: 'lead', id: '', title: '' });
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(null);
      }
    }
  };

  // Filter & Search Logic for Leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm) ||
      lead.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.service?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesCity = cityFilter === 'all' || lead.city === cityFilter;
    const matchesBudget = budgetFilter === 'all' || lead.budget === budgetFilter;

    return matchesSearch && matchesStatus && matchesCity && matchesBudget;
  }).sort((a, b) => {
    const dateA = new Date(a.created_at || 0).getTime();
    const dateB = new Date(b.created_at || 0).getTime();
    return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
  });

  // Pagination slicing
  const totalLeadPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (leadCurrentPage - 1) * itemsPerPage,
    leadCurrentPage * itemsPerPage
  );

  // Compute metric numbers
  const totalLeadsCount = leads.length;
  const newLeadsCount = leads.filter(l => l.status === 'New' || !l.status).length;
  const contactedLeadsCount = leads.filter(l => l.status === 'Contacted').length;
  const convertedLeadsCount = leads.filter(l => l.status === 'Converted').length;
  
  // Calculate unread leads badge (status === New)
  const unreadCount = newLeadsCount;

  // CSV/Excel Export Handlers with proper UTF-8 BOM Prefix (crucial for Excel Hindi characters!)
  const exportCRMData = (format: 'csv' | 'excel', onlyFiltered = false) => {
    const dataToExport = onlyFiltered ? filteredLeads : leads;
    
    // Headers matching requirements
    const headers = [
      'Submission Date & Time', 'Name', 'Business Name', 'Phone', 
      'Email', 'Service Required', 'Budget', 'Source Page', 'Message', 'Status', 'Notes'
    ];

    const rows = dataToExport.map(l => [
      l.created_at ? new Date(l.created_at).toLocaleString() : 'N/A',
      l.name || '',
      l.business_name || '',
      l.phone || '',
      l.email || '',
      l.service || '',
      l.budget || '',
      l.source || 'Direct Enquiry',
      (l.message || '').replace(/\n/g, ' '),
      l.status || 'New',
      (l.notes || '').replace(/\n/g, ' ')
    ]);

    // CSV format or Excel formatted file
    const delimiter = ",";
    const csvContent = "\uFEFF" + [
      headers.join(delimiter),
      ...rows.map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(delimiter))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().split('T')[0];
    
    link.setAttribute("href", url);
    link.setAttribute("download", `HDS_CRM_Leads_Export_${timestamp}.${format === 'excel' ? 'csv' : 'csv'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Native Beautiful Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Area Chart Data Generation (Last 7 Days)
  const generateChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return {
        dateStr: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        fullDate: d.toDateString(),
        leads: 0,
        audits: 0
      };
    }).reverse();

    leads.forEach(l => {
      if (!l.created_at) return;
      const lDate = new Date(l.created_at).toDateString();
      const chartDay = last7Days.find(day => day.fullDate === lDate);
      if (chartDay) chartDay.leads += 1;
    });

    audits.forEach(a => {
      if (!a.created_at) return;
      const aDate = new Date(a.created_at).toDateString();
      const chartDay = last7Days.find(day => day.fullDate === aDate);
      if (chartDay) chartDay.audits += 1;
    });

    return last7Days;
  };

  const chartData = generateChartData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-accent animate-spin mx-auto mb-4" />
          <p className="text-text-secondary text-sm">Verifying secure admin workspace access...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER SECURITY GATE: AUTH LOGIN FORM
  // ==========================================
  if (!isAuthenticated) {
    return (
      <PageTransition>
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-bg-base relative overflow-hidden">
          {/* Cosmic Ambient Background Lights */}
          <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-secondary/5 rounded-full blur-[140px] pointer-events-none" />

          <div className="w-full max-w-lg z-10">
            {/* Local Sandbox Environment Notification Panel */}
            {!isSupabaseConfigured && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start text-amber-300 text-xs shadow-md backdrop-blur-md"
              >
                <Info className="w-5 h-5 mr-3 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <h4 className="font-bold uppercase tracking-wider mb-1">Sandbox Demo Mode Active</h4>
                  <p className="leading-relaxed mb-2">
                    Supabase connection parameters are currently running on client-side simulation. You can log in securely using the prefilled admin keys below.
                  </p>
                  <div className="font-mono bg-black/40 p-2 rounded text-amber-400 select-all border border-amber-500/10">
                    Email: admin@hds.com <br />
                    Password: admin123
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-card-bg border border-card-border rounded-[40px] p-8 md:p-10 shadow-[0_0_80px_rgba(0,240,255,0.03)] backdrop-blur-md relative overflow-hidden"
            >
              {/* Vercel Accent Glow bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent via-[#0080FF] to-secondary" />

              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-[22px] flex items-center justify-center mb-4 text-accent shadow-inner">
                  <Shield className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold font-heading text-text-primary tracking-tight">HDS Lead Command</h1>
                <p className="text-text-tertiary text-xs md:text-sm mt-1 max-w-xs">
                  Unlock secure CRM administrative controls and customer pipelines.
                </p>
              </div>

              {/* Login mode */}
              {authMode === 'login' ? (
                <form onSubmit={handleAuthLogin} className="space-y-5">
                  {authError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start text-red-400 text-xs">
                      <AlertCircle className="w-4.5 h-4.5 mr-2 shrink-0 mt-0.5" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {authSuccessMsg && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start text-emerald-400 text-xs">
                      <CheckCircle2 className="w-4.5 h-4.5 mr-2 shrink-0 mt-0.5" />
                      <span>{authSuccessMsg}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">Admin Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-4.5 h-4.5 text-text-tertiary" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@yourdomain.com"
                        className="w-full pl-11 pr-4 py-3 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-text-tertiary"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">Password</label>
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot_password')}
                        className="text-[10px] text-accent font-semibold hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-4.5 h-4.5 text-text-tertiary" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter account password"
                        className="w-full pl-11 pr-4 py-3 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-text-tertiary"
                        required
                      />
                    </div>
                  </div>

                  {/* Remember Me and persist settings */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center space-x-2 text-xs text-text-secondary cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-btn-border bg-btn-bg text-accent focus:ring-accent/40 w-4 h-4"
                      />
                      <span>Remember Me</span>
                    </label>
                    <span className="text-[10px] text-text-tertiary font-mono flex items-center">
                      <Shield className="w-3 h-3 text-accent mr-1" /> Persistent Session
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full mt-6 premium-button bg-gradient-to-r from-accent to-secondary text-black font-extrabold text-xs uppercase tracking-widest py-4 rounded-xl cursor-pointer flex items-center justify-center gap-2"
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="w-4.5 h-4.5 animate-spin" />
                        <span>Verifying Security Access...</span>
                      </>
                    ) : (
                      <>
                        <span>Secure Unlock</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Forgot password mode */
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl text-xs text-text-secondary leading-relaxed mb-4">
                    Provide your register admin email below. A secure password restoration payload link will be sent to recover access.
                  </div>

                  {authError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start text-red-400 text-xs">
                      <AlertCircle className="w-4.5 h-4.5 mr-2 shrink-0 mt-0.5" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {authSuccessMsg && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start text-emerald-400 text-xs">
                      <CheckCircle2 className="w-4.5 h-4.5 mr-2 shrink-0 mt-0.5" />
                      <span>{authSuccessMsg}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">Registered Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-4.5 h-4.5 text-text-tertiary" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@yourdomain.com"
                        className="w-full pl-11 pr-4 py-3 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-text-tertiary"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setAuthError('');
                        setAuthSuccessMsg('');
                      }}
                      className="text-xs text-text-tertiary hover:text-text-primary font-semibold transition-colors"
                    >
                      ← Back to Login
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full mt-4 premium-button bg-gradient-to-r from-accent to-secondary text-black font-extrabold text-xs uppercase tracking-widest py-4 rounded-xl cursor-pointer flex items-center justify-center gap-2"
                  >
                    {authLoading ? (
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    ) : (
                      <span>Send Recovery Link</span>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </PageTransition>
    );
  }

  // ==========================================
  // RENDER ADMIN DASHBOARD WORKSPACE (AUTHENTICATED)
  // ==========================================
  return (
    <PageTransition>
      <div className="min-h-screen bg-bg-base text-text-primary relative flex flex-col lg:flex-row print:bg-white print:text-black">
        
        {/* RESPONSIVE FLOATING SIDEBAR FOR MOBILE/DESKTOP */}
        <AnimatePresence>
          {(isSidebarOpen || window.innerWidth >= 1024) && (
            <motion.aside 
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`fixed inset-y-0 left-0 z-50 w-72 bg-card-bg border-r border-card-border p-6 flex flex-col justify-between lg:static lg:h-screen lg:shrink-0 print:hidden ${
                isSidebarOpen ? 'shadow-[10px_0_40px_rgba(0,0,0,0.5)]' : ''
              }`}
            >
              <div>
                {/* Branding Block */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-card-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-accent shadow-sm">
                      <Shield className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold font-heading text-text-primary tracking-tight">HDS Lead CRM</h2>
                      <span className="text-[10px] text-accent font-mono font-bold tracking-widest">ADMIN SECURE v1.2</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden p-1.5 hover:bg-btn-bg rounded-lg border border-btn-border text-text-secondary"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Sidebar Navigation items */}
                <nav className="space-y-1.5">
                  {[
                    { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
                    { id: 'leads', label: `Leads Pipeline (${leads.length})`, icon: Users, badge: unreadCount },
                    { id: 'audits', label: `Website Audits (${audits.length})`, icon: Globe },
                    { id: 'messages', label: `Contact Forms (${messages.length})`, icon: Mail },
                    { id: 'calls', label: `Call Bookings (${calls.length})`, icon: Calendar },
                    { id: 'newsletters', label: `Newsletter (${newsletters.length})`, icon: MessageSquare },
                    { id: 'profile', label: 'Admin Security', icon: User },
                    { id: 'modules', label: 'Future Modules', icon: Settings }
                  ].map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as any);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-accent/15 border border-accent/20 text-accent font-extrabold shadow-sm shadow-accent/5' 
                            : 'text-text-tertiary hover:text-text-primary border border-transparent hover:bg-btn-bg'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-accent' : 'text-text-tertiary group-hover:text-text-primary'}`} />
                          <span>{item.label.split(' (')[0]}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="bg-red-500 text-white font-mono font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                            {item.badge}
                          </span>
                        )}
                        {item.id === 'leads' && item.badge === 0 && leads.length > 0 && (
                          <span className="text-[10px] text-text-tertiary font-mono">{leads.length}</span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Sidebar Footer */}
              <div className="border-t border-card-border pt-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-9 h-9 bg-btn-bg border border-btn-border rounded-full flex items-center justify-center text-accent">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-text-primary truncate">{user?.email}</p>
                    <p className="text-[10px] text-text-tertiary truncate">HDS Portfolio Administrator</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                >
                  Terminate Session
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 min-w-0 overflow-y-auto lg:h-screen flex flex-col justify-between">
          
          {/* TOP GLOBAL HEADER (NOT PRINTED) */}
          <header className="bg-card-bg/60 border-b border-card-border px-6 py-4 sticky top-0 backdrop-blur-md z-40 flex items-center justify-between print:hidden">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-btn-bg border border-btn-border rounded-xl text-text-secondary"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-text-primary tracking-tight capitalize font-heading">
                  {activeTab === 'overview' ? 'SaaS CRM Insights' : 
                   activeTab === 'leads' ? 'Leads Management Hub' : 
                   activeTab === 'audits' ? 'Website SEO Audits' : 
                   activeTab === 'messages' ? 'Contact Submissions' : 
                   activeTab === 'calls' ? 'Consultation Booking Engine' : 
                   activeTab === 'newsletters' ? 'Subscribers Log' : 
                   activeTab === 'profile' ? 'Security & Profile Access' : 'Modular Extension Core'}
                </h1>
                <p className="text-[10px] md:text-xs text-text-tertiary hidden sm:block">
                  Logged in as <span className="text-text-secondary font-mono">{user?.email}</span>
                </p>
              </div>
            </div>

            {/* Header Right Utility Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={injectSampleLead}
                className="hidden sm:flex px-3 py-2 bg-accent/15 hover:bg-accent/25 border border-accent/20 text-accent text-xs font-bold rounded-xl items-center gap-1.5 transition-all"
                title="Add simulated lead instantly to verify CRM UI flow"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Simulate Lead</span>
              </button>

              {/* Notification Center Trigger */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2.5 bg-btn-bg border border-btn-border text-text-secondary hover:text-text-primary rounded-xl transition-all relative"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  )}
                </button>

                {/* Floating Glass Notifications Panel */}
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className="absolute right-0 mt-3 w-80 bg-card-bg border border-card-border rounded-2xl p-4 shadow-2xl z-50 text-xs"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-card-border mb-3">
                          <span className="font-bold uppercase text-[10px] tracking-wider text-text-secondary">Recent Live Signals</span>
                          {notifications.length > 0 && (
                            <button 
                              onClick={() => setNotifications([])}
                              className="text-[10px] text-accent hover:underline"
                            >
                              Clear All
                            </button>
                          )}
                        </div>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                          {notifications.length === 0 ? (
                            <div className="text-center py-6 text-text-tertiary">
                              No incoming lead alerts. Real-time PostgreSQL trigger is ready.
                            </div>
                          ) : (
                            notifications.map(n => (
                              <div key={n.id} className="p-2.5 bg-btn-bg/50 border border-btn-border/50 rounded-xl">
                                <div className="flex items-center justify-between font-bold text-text-primary">
                                  <span>{n.title}</span>
                                  <span className="text-[9px] text-text-tertiary font-mono">{n.time}</span>
                                </div>
                                <p className="text-text-secondary mt-1 leading-relaxed text-[11px]">{n.desc}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Data Refresh Icon */}
              <button
                onClick={fetchData}
                disabled={crmLoading}
                className="p-2.5 bg-btn-bg border border-btn-border text-text-secondary hover:text-text-primary rounded-xl transition-all"
                title="Synchronize Database Records"
              >
                <RefreshCw className={`w-4.5 h-4.5 ${crmLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </header>

          {/* TAB VIEW PORT CONTAINER */}
          <div className="flex-1 p-6 max-w-7xl w-full mx-auto">
            
            {/* TAB CONTENT: 1. OVERVIEW INSIGHTS */}
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                
                {/* Metric Summary Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {[
                    { title: 'Total Leads', value: totalLeadsCount, label: 'Pipeline Leads', color: 'text-accent', bg: 'bg-accent/5' },
                    { title: 'New Leads', value: newLeadsCount, label: 'Needs Follow-up', color: 'text-yellow-400', bg: 'bg-yellow-400/5' },
                    { title: 'Contacted', value: contactedLeadsCount, label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-400/5' },
                    { title: 'Converted', value: convertedLeadsCount, label: 'Wins Secured', color: 'text-emerald-400', bg: 'bg-emerald-400/5' },
                    { title: 'Demo / Calls', value: calls.length, label: 'Booked consults', color: 'text-pink-400', bg: 'bg-pink-400/5' },
                    { title: 'SEO Audits', value: audits.length, label: 'Free Website audits', color: 'text-purple-400', bg: 'bg-purple-400/5' },
                    { title: 'Contact Forms', value: messages.length, label: 'Direct Messages', color: 'text-indigo-400', bg: 'bg-indigo-400/5' }
                  ].map((stat, sIdx) => (
                    <div key={sIdx} className="bg-card-bg border border-card-border rounded-2xl p-4 shadow-sm relative overflow-hidden">
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-card-border" />
                      <div className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary block mb-2">{stat.title}</div>
                      <p className={`text-2xl md:text-3xl font-heading font-extrabold ${stat.color}`}>{stat.value}</p>
                      <span className="text-[9px] text-text-tertiary font-mono block mt-1">{stat.label}</span>
                    </div>
                  ))}
                </div>

                {/* Dashboard Analytics & Trend Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Glassmorphism Area Chart */}
                  <div className="lg:col-span-2 bg-card-bg border border-card-border rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary">Demand Generation Performance</h3>
                        <span className="text-[11px] text-text-tertiary">Real-time incoming submissions over the last 7 calendar days</span>
                      </div>
                      <div className="flex items-center space-x-3 text-[10px]">
                        <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-accent mr-1.5" /> Leads</span>
                        <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-purple-400 mr-1.5" /> SEO Audits</span>
                      </div>
                    </div>
                    
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="auditsGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#c084fc" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                          <XAxis dataKey="dateStr" stroke="rgba(255,255,255,0.3)" style={{ fontSize: 10, fontFamily: 'monospace' }} />
                          <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: 10, fontFamily: 'monospace' }} allowDecimals={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 11 }}
                          />
                          <Area type="monotone" dataKey="leads" stroke="#00F0FF" strokeWidth={2} fillOpacity={1} fill="url(#leadsGrad)" />
                          <Area type="monotone" dataKey="audits" stroke="#c084fc" strokeWidth={2} fillOpacity={1} fill="url(#auditsGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Quick Action Bento Panel */}
                  <div className="bg-card-bg border border-card-border rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-4">Core Administrative Controls</h3>
                      <p className="text-xs text-text-tertiary leading-relaxed mb-6">
                        Seamlessly simulate pipeline inputs, export customer databases for local storage, or audit security and password layers.
                      </p>

                      <div className="space-y-3">
                        <button
                          onClick={injectSampleLead}
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-btn-bg hover:bg-accent/10 hover:text-accent border border-btn-border text-text-primary transition-all text-xs font-bold"
                        >
                          <span className="flex items-center"><PlusCircle className="w-4 h-4 mr-2" /> Simulate Random CRM Lead</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => exportCRMData('csv')}
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-btn-bg hover:bg-emerald-500/10 hover:text-emerald-400 border border-btn-border text-text-primary transition-all text-xs font-bold"
                        >
                          <span className="flex items-center"><Download className="w-4 h-4 mr-2" /> Download All Leads (CSV)</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('leads');
                            setSortOrder('latest');
                          }}
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-btn-bg hover:bg-white/10 text-text-primary border border-btn-border transition-all text-xs font-bold"
                        >
                          <span className="flex items-center"><Search className="w-4 h-4 mr-2" /> Go to Leads Directory</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-card-border text-[10px] text-text-tertiary flex items-center">
                      <Shield className="w-3.5 h-3.5 text-accent mr-1.5" /> Authorized Session Persistence Enabled
                    </div>
                  </div>
                </div>

                {/* Recent Leads Activity List */}
                <div className="bg-card-bg border border-card-border rounded-3xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-4">Latest Inbound Leads Pipeline</h3>
                  
                  {leads.length === 0 ? (
                    <p className="text-xs text-text-tertiary py-6 text-center">No inbound pipeline logs captured yet.</p>
                  ) : (
                    <div className="divide-y divide-card-border">
                      {leads.slice(0, 4).map((l, lIdx) => (
                        <div key={l.id || lIdx} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="font-bold text-text-primary block text-sm">{l.name}</span>
                            <span className="text-[11px] text-accent font-semibold">{l.service}</span>
                          </div>
                          <div className="text-right sm:text-right">
                            <span className="text-text-tertiary block font-mono text-[10px]">
                              {l.created_at ? new Date(l.created_at).toLocaleDateString() : 'Direct Submission'}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase mt-0.5 inline-block ${
                              l.status === 'Converted' ? 'bg-emerald-500/10 text-emerald-400' :
                              l.status === 'Contacted' ? 'bg-blue-500/10 text-blue-400' :
                              'bg-yellow-400/10 text-yellow-400'
                            }`}>{l.status || 'New'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </motion.div>
            )}

            {/* TAB CONTENT: 2. LEADS MANAGEMENT DIRECTORY */}
            {activeTab === 'leads' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                
                {/* Search, Filter & Multi-sorting Panel */}
                <div className="bg-card-bg border border-card-border rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex flex-col lg:flex-row items-center gap-4">
                    <div className="relative w-full lg:flex-1">
                      <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-text-tertiary" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search lead directory by name, business, email, phone, location..."
                        className="w-full pl-11 pr-4 py-3 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent transition-all placeholder:text-text-tertiary"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
                      {/* Status select dropdown */}
                      <div className="relative flex-1 sm:flex-none">
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full sm:w-40 px-3 py-3 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-secondary focus:outline-none focus:border-accent"
                        >
                          <option value="all">All Statuses</option>
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Discussion">In Discussion</option>
                          <option value="Proposal Sent">Proposal Sent</option>
                          <option value="Converted">Converted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>

                      {/* Location Filter */}
                      <div className="relative flex-1 sm:flex-none">
                        <select
                          value={cityFilter}
                          onChange={(e) => setCityFilter(e.target.value)}
                          className="w-full sm:w-40 px-3 py-3 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-secondary focus:outline-none focus:border-accent"
                        >
                          <option value="all">All Markets</option>
                          <option value="Raigarh">Raigarh</option>
                          <option value="Tamnar">Tamnar</option>
                          <option value="Kharsia">Kharsia</option>
                        </select>
                      </div>

                      {/* Budget Filter */}
                      <div className="relative flex-1 sm:flex-none">
                        <select
                          value={budgetFilter}
                          onChange={(e) => setBudgetFilter(e.target.value)}
                          className="w-full sm:w-40 px-3 py-3 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-secondary focus:outline-none focus:border-accent"
                        >
                          <option value="all">All Budgets</option>
                          <option value="Under ₹10k">Under ₹10k</option>
                          <option value="₹10k - ₹25k">₹10k - ₹25k</option>
                          <option value="₹25k - ₹50k">₹25k - ₹50k</option>
                          <option value="Above ₹50k">Above ₹50k</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-card-border">
                    {/* Sort Order Toggler */}
                    <div className="flex items-center space-x-3 text-xs text-text-secondary">
                      <span className="text-text-tertiary">Sort Chronology:</span>
                      <button 
                        onClick={() => setSortOrder('latest')} 
                        className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold ${
                          sortOrder === 'latest' ? 'bg-accent/15 border-accent/30 text-accent' : 'border-btn-border bg-btn-bg text-text-tertiary'
                        }`}
                      >
                        Latest Inbound First
                      </button>
                      <button 
                        onClick={() => setSortOrder('oldest')} 
                        className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold ${
                          sortOrder === 'oldest' ? 'bg-accent/15 border-accent/30 text-accent' : 'border-btn-border bg-btn-bg text-text-tertiary'
                        }`}
                      >
                        Oldest First
                      </button>
                    </div>

                    {/* Export and Print Utilities */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => exportCRMData('csv', true)}
                        className="px-3 py-1.5 bg-btn-bg hover:bg-btn-hover-bg text-text-secondary border border-btn-border text-xs font-bold rounded-lg flex items-center gap-1"
                        title="Download Filtered results as CSV"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                        <span>CSV Export</span>
                      </button>

                      <button
                        onClick={() => exportCRMData('excel', true)}
                        className="px-3 py-1.5 bg-btn-bg hover:bg-btn-hover-bg text-text-secondary border border-btn-border text-xs font-bold rounded-lg flex items-center gap-1"
                        title="Download Filtered results prefixed with UTF-8 BOM for Microsoft Excel compatibility"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                        <span>Excel Export</span>
                      </button>

                      <button
                        onClick={handlePrint}
                        className="p-2 bg-btn-bg hover:bg-btn-hover-bg text-text-secondary border border-btn-border rounded-lg"
                        title="Print Current Leads List"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Primary Leads Database Table */}
                <div className="bg-card-bg border border-card-border rounded-3xl shadow-sm overflow-hidden">
                  {paginatedLeads.length === 0 ? (
                    <div className="text-center py-20 text-text-secondary">
                      <Users className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                      <p className="font-bold">No Leads Match Your Filters</p>
                      <p className="text-xs text-text-tertiary mt-1">Try refining search parameters or click below to simulate an inbound lead.</p>
                      <button
                        onClick={injectSampleLead}
                        className="mt-4 px-4 py-2.5 bg-btn-bg hover:bg-white/10 border border-btn-border text-xs font-bold rounded-xl"
                      >
                        Create Simulation Record
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-card-border text-[10px] uppercase font-bold text-text-tertiary tracking-wider bg-btn-bg/30">
                            <th className="py-4 px-5">Inbound Prospect</th>
                            <th className="py-4 px-5">Target Market & Budget</th>
                            <th className="py-4 px-5">Required Solution</th>
                            <th className="py-4 px-5">Status Pill</th>
                            <th className="py-4 px-5">Message & Private Notes</th>
                            <th className="py-4 px-5 text-right">Delete</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-card-border">
                          {paginatedLeads.map(lead => (
                            <tr key={lead.id} className="text-xs hover:bg-btn-bg/20 transition-colors group">
                              {/* Contact Information */}
                              <td className="py-4 px-5">
                                <button
                                  onClick={() => {
                                    setSelectedLead(lead);
                                    setSelectedLeadNotes(lead.notes || '');
                                  }}
                                  className="font-bold text-text-primary text-sm hover:text-accent transition-colors block text-left"
                                >
                                  {lead.name}
                                </button>
                                <span className="text-[11px] text-text-tertiary font-mono block mt-0.5">{lead.email}</span>
                                <span className="text-[10px] text-text-tertiary font-mono block mt-0.5">{lead.phone}</span>
                              </td>
                              
                              {/* Market & Budget */}
                              <td className="py-4 px-5">
                                <div className="font-bold text-text-secondary">📍 {lead.city || 'Chhattisgarh'}</div>
                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold block w-fit mt-1">
                                  {lead.budget || 'Custom Budget'}
                                </span>
                              </td>

                              {/* Service Required */}
                              <td className="py-4 px-5">
                                <div className="text-accent font-semibold text-[11px]">{lead.service}</div>
                                <span className="text-[10px] text-text-tertiary font-mono mt-1 block">
                                  Page: {lead.source || '/direct'}
                                </span>
                              </td>

                              {/* Status Update instant */}
                              <td className="py-4 px-5">
                                <div className="relative">
                                  <select
                                    value={lead.status || 'New'}
                                    onChange={(e) => handleUpdateLeadStatus(lead.id!, e.target.value)}
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border cursor-pointer focus:outline-none transition-colors ${
                                      lead.status === 'Converted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                      lead.status === 'Contacted' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                      lead.status === 'In Discussion' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                      lead.status === 'Proposal Sent' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' :
                                      lead.status === 'Closed' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' :
                                      'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'
                                    }`}
                                  >
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="In Discussion">In Discussion</option>
                                    <option value="Proposal Sent">Proposal Sent</option>
                                    <option value="Converted">Converted</option>
                                    <option value="Closed">Closed</option>
                                  </select>
                                </div>
                              </td>

                              {/* Message snippet & note preview */}
                              <td className="py-4 px-5 max-w-xs">
                                <div className="text-text-secondary truncate font-medium text-[11px]" title={lead.message}>
                                  {lead.message || 'No submission message provided.'}
                                </div>
                                <div 
                                  onClick={() => {
                                    setSelectedLead(lead);
                                    setSelectedLeadNotes(lead.notes || '');
                                  }}
                                  className="text-[10px] text-text-tertiary italic mt-1 truncate max-w-[200px] hover:text-accent cursor-pointer flex items-center"
                                >
                                  📝 <span className="underline ml-1 truncate">{lead.notes || 'Add internal administrative notes...'}</span>
                                </div>
                              </td>

                              {/* Delete Action Trigger */}
                              <td className="py-4 px-5 text-right">
                                <button
                                  onClick={() => triggerDeleteConfirm('lead', lead.id!, lead.name)}
                                  className="p-2 text-text-tertiary hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors"
                                  title="Permanently Delete Lead Record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Table Pagination Toggles */}
                  {totalLeadPages > 1 && (
                    <div className="p-4 bg-btn-bg/10 border-t border-card-border flex items-center justify-between">
                      <span className="text-[11px] text-text-tertiary">
                        Showing page {leadCurrentPage} of {totalLeadPages} ({filteredLeads.length} total matched)
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setLeadCurrentPage(p => Math.max(1, p - 1))}
                          disabled={leadCurrentPage === 1}
                          className="px-3 py-1.5 bg-btn-bg hover:bg-btn-hover-bg border border-btn-border rounded-lg text-xs font-bold text-text-secondary disabled:opacity-50 transition-colors"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setLeadCurrentPage(p => Math.min(totalLeadPages, p + 1))}
                          disabled={leadCurrentPage === totalLeadPages}
                          className="px-3 py-1.5 bg-btn-bg hover:bg-btn-hover-bg border border-btn-border rounded-lg text-xs font-bold text-text-secondary disabled:opacity-50 transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </motion.div>
            )}

            {/* TAB CONTENT: 3. WEBSITE AUDITS QUEUE */}
            {activeTab === 'audits' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-card-bg border border-card-border rounded-3xl p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary">Website Audit Request Queue</h3>
                      <p className="text-xs text-text-tertiary">Track prospective customers requesting detailed technical SEO assessments.</p>
                    </div>
                    <button
                      onClick={() => exportCRMData('csv')}
                      className="px-3 py-1.5 bg-btn-bg hover:bg-btn-hover-bg text-text-secondary border border-btn-border text-xs font-bold rounded-lg flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4 text-accent" /> Export Database
                    </button>
                  </div>

                  {audits.length === 0 ? (
                    <p className="text-center py-16 text-xs text-text-tertiary">No web site SEO audit request entries found in database.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-card-border text-[10px] uppercase font-bold text-text-tertiary bg-btn-bg/10 py-3">
                            <th className="py-3 px-4">Requested URL / Company</th>
                            <th className="py-3 px-4">Prospect Details</th>
                            <th className="py-3 px-4">Date Submitted</th>
                            <th className="py-3 px-4">Notes</th>
                            <th className="py-3 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-card-border">
                          {audits.map(audit => (
                            <tr key={audit.id} className="hover:bg-btn-bg/10 transition-colors">
                              <td className="py-4 px-4">
                                <div className="font-bold text-text-primary">{audit.business_name || 'Generic Business'}</div>
                                <a 
                                  href={`https://${audit.website.replace(/^(https?:\/\/)?(www\.)?/, '')}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-accent hover:underline block font-mono text-[11px] mt-1 flex items-center gap-1"
                                >
                                  {audit.website} <ExternalLink className="w-3 h-3" />
                                </a>
                              </td>
                              <td className="py-4 px-4">
                                <div className="font-semibold text-text-secondary">{audit.name}</div>
                                <div className="text-text-tertiary text-[11px]">{audit.email}</div>
                                <div className="text-text-tertiary text-[11px]">{audit.phone}</div>
                              </td>
                              <td className="py-4 px-4 text-text-tertiary font-mono">
                                {audit.created_at ? new Date(audit.created_at).toLocaleString() : 'N/A'}
                              </td>
                              <td className="py-4 px-4 max-w-xs text-text-secondary font-medium">
                                {audit.notes || 'No custom audit description provided.'}
                              </td>
                              <td className="py-4 px-4 text-right">
                                <button
                                  onClick={() => triggerDeleteConfirm('audit', audit.id!, audit.website)}
                                  className="p-2 text-text-tertiary hover:text-red-400 hover:bg-red-500/5 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT: 4. CONTACT MESSAGES */}
            {activeTab === 'messages' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-card-bg border border-card-border rounded-3xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-4">Direct Contact Form Submissions</h3>
                  
                  {messages.length === 0 ? (
                    <p className="text-center py-16 text-xs text-text-tertiary">No direct contact submissions recorded.</p>
                  ) : (
                    <div className="space-y-4">
                      {messages.map(msg => (
                        <div key={msg.id} className="p-5 bg-btn-bg/10 border border-card-border rounded-2xl flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-text-primary text-sm">{msg.name}</span>
                              <span className="text-[10px] text-text-tertiary font-mono">
                                {msg.created_at ? new Date(msg.created_at).toLocaleString() : ''}
                              </span>
                            </div>
                            <div className="text-xs text-text-tertiary font-mono">{msg.email} | {msg.phone || 'No phone'}</div>
                            <div className="text-[11px] font-bold text-accent">Subject: {msg.subject || 'CRM Enquiry'}</div>
                            <p className="text-xs text-text-secondary leading-relaxed bg-black/20 p-3 rounded-xl border border-card-border">
                              {msg.message}
                            </p>
                          </div>
                          <button
                            onClick={() => triggerDeleteConfirm('message', msg.id!, msg.name)}
                            className="px-3 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold flex items-center gap-1 self-end md:self-start transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT: 5. BOOKED CONSULTATIONS */}
            {activeTab === 'calls' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-card-bg border border-card-border rounded-3xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-4">Scheduled Consultation Calls</h3>
                  
                  {calls.length === 0 ? (
                    <p className="text-center py-16 text-xs text-text-tertiary">No consultation bookings registered.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {calls.map(call => (
                        <div key={call.id} className="p-5 bg-btn-bg/10 border border-card-border rounded-2xl flex flex-col justify-between h-full">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-card-border">
                              <span className="font-bold text-text-primary text-sm">{call.name}</span>
                              <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 text-[10px] font-extrabold tracking-wide uppercase">
                                {call.meeting_time}
                              </span>
                            </div>

                            <div className="space-y-1.5 text-xs text-text-secondary">
                              <div className="flex items-center gap-2">📅 <span className="font-bold text-text-primary">{call.meeting_date}</span></div>
                              <div className="flex items-center gap-2">📧 <span className="font-mono">{call.email}</span></div>
                              <div className="flex items-center gap-2">📞 <span className="font-mono">{call.phone}</span></div>
                              <div className="flex items-center gap-2">🛠 <span className="text-accent font-semibold">{call.service}</span></div>
                            </div>

                            {call.notes && (
                              <p className="text-text-tertiary italic text-[11px] pt-2 border-t border-card-border">
                                Notes: {call.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between border-t border-card-border pt-4 mt-4">
                            <a 
                              href={`https://wa.me/${call.phone.replace(/[^0-9]/g, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs text-[#25D366] hover:underline font-bold flex items-center gap-1.5"
                            >
                              💬 Connect on WhatsApp
                            </a>

                            <button
                              onClick={() => triggerDeleteConfirm('call', call.id!, call.name)}
                              className="text-text-tertiary hover:text-red-400 p-1.5 hover:bg-red-500/5 rounded-lg"
                              title="Cancel Consultation Call"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT: 6. NEWSLETTER SIGNUPS */}
            {activeTab === 'newsletters' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-card-bg border border-card-border rounded-3xl p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary">Newsletter Subscribers List</h3>
                      <p className="text-xs text-text-tertiary">Track prospective leads signing up for digital growth insights.</p>
                    </div>
                    <button
                      onClick={() => exportCRMData('csv')}
                      className="px-3 py-1.5 bg-btn-bg hover:bg-btn-hover-bg text-text-secondary border border-btn-border text-xs font-bold rounded-lg flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4 text-accent" /> Export CSV
                    </button>
                  </div>

                  {newsletters.length === 0 ? (
                    <p className="text-center py-16 text-xs text-text-tertiary">No newsletter subscribers logged.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {newsletters.map(item => (
                        <div key={item.id} className="p-4 bg-btn-bg/10 border border-card-border rounded-2xl flex items-center justify-between">
                          <div className="min-w-0 pr-2">
                            <span className="font-mono text-text-secondary font-semibold text-xs truncate block">{item.email}</span>
                            <span className="text-[10px] text-text-tertiary block mt-1 font-mono">
                              Joined: {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                          <button
                            onClick={() => triggerDeleteConfirm('newsletter', item.id!, item.email)}
                            className="p-1.5 text-text-tertiary hover:text-red-400 transition-colors"
                            title="Remove Subscriber"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT: 7. ADMIN SECURITY PANEL */}
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-card-bg border border-card-border rounded-3xl p-6 md:p-8 max-w-xl shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-2 flex items-center">
                    <Lock className="w-4 h-4 mr-1.5 text-accent" /> Security Credential Update
                  </h3>
                  <p className="text-xs text-text-tertiary leading-relaxed mb-6">
                    Change your secure administrative login password below. Password modifications take effect instantly on Supabase database authorization.
                  </p>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    {profileSuccessMsg && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start text-emerald-400 text-xs">
                        <CheckCircle2 className="w-4.5 h-4.5 mr-2 shrink-0 mt-0.5" />
                        <span>{profileSuccessMsg}</span>
                      </div>
                    )}

                    {profileErrorMsg && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start text-red-400 text-xs">
                        <AlertCircle className="w-4.5 h-4.5 mr-2 shrink-0 mt-0.5" />
                        <span>{profileErrorMsg}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">New Administrative Password</label>
                      <div className="relative">
                        <Key className="absolute left-4 top-3.5 w-4.5 h-4.5 text-text-tertiary" />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min 6 characters required"
                          className="w-full pl-11 pr-4 py-3 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent placeholder:text-text-tertiary"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-3.5 w-4.5 h-4.5 text-text-tertiary" />
                        <input
                          type="password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="Re-enter password for verification"
                          className="w-full pl-11 pr-4 py-3 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent placeholder:text-text-tertiary"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="px-6 py-3 bg-gradient-to-r from-accent to-secondary text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply Security Credentials'}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT: 8. MODULAR CORE / FUTURE READY MODULES */}
            {activeTab === 'modules' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-card-bg border border-card-border rounded-3xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-2">HDS Modular Extension Architecture</h3>
                  <p className="text-xs text-text-tertiary mb-6">
                    HDS Core features modular structure ready to integrate additional business components seamlessly in future updates.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {[
                      { title: 'Blog Content Manager', desc: 'Secure CRUD engine for composing and publishing digital growth articles.', status: 'Pre-Wired for Supabase' },
                      { title: 'Portfolio Projects Engine', desc: 'Manage case studies, live demo links, and client visual showcases.', status: 'Pre-Wired for Supabase' },
                      { title: 'Client Testimonials Database', desc: 'Approve and publish local business five-star review logs.', status: 'Pre-Wired for Supabase' },
                      { title: 'Google Analytics Integration', desc: 'Visual tracker for monthly visitors, heatmaps, and target markets.', status: 'Planned Extension' },
                      { title: 'Newsletter Blast Portal', desc: 'Direct mail campaigns, subscribers segmenting, and campaign telemetry.', status: 'Planned Extension' },
                      { title: 'SEO Rank Auditor & Core Web Vital', desc: 'Automated ranking auditor for local search target keywords.', status: 'Planned Extension' }
                    ].map((mod, mIdx) => (
                      <div key={mIdx} className="bg-btn-bg/10 border border-card-border rounded-2xl p-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2.5">
                          <span className="text-[9px] font-extrabold bg-accent/10 border border-accent/20 text-accent px-2 py-0.5 rounded font-mono uppercase">
                            {mod.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-text-primary text-sm mt-3 mb-2 font-heading">{mod.title}</h4>
                        <p className="text-xs text-text-tertiary leading-relaxed">{mod.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </div>

          {/* FOOTER AREA */}
          <footer className="py-4 border-t border-card-border px-6 text-center text-[10px] text-text-tertiary print:hidden flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>HDS CRM. Handcrafted by Harsh Patel. Secure workspace encryption.</span>
            <span>Local Time: {new Date().toLocaleTimeString()} (Chhattisgarh Standard)</span>
          </footer>

        </main>
      </div>

      {/* ==========================================
          MODAL 1: GORGEOUS LEAD DETAIL & NOTES MODAL
          ========================================== */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedLead(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-card-bg border border-card-border rounded-3xl w-full max-w-2xl p-6 md:p-8 z-10 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Top border decor */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent to-secondary" />

              <div className="flex items-start justify-between pb-4 border-b border-card-border">
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-widest font-mono">
                    Submission Date: {selectedLead.created_at ? new Date(selectedLead.created_at).toLocaleString() : 'N/A'}
                  </span>
                  <h3 className="text-xl font-bold text-text-primary mt-1 font-heading">{selectedLead.name}</h3>
                  <p className="text-text-tertiary text-xs mt-0.5">Company/Brand: <strong className="text-text-secondary">{selectedLead.business_name || 'Chhattisgarh Local Proprietor'}</strong></p>
                </div>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="p-1.5 hover:bg-btn-bg border border-btn-border text-text-secondary hover:text-text-primary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Grid content fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6">
                <div className="space-y-4">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Phone Number</span>
                    <a href={`tel:${selectedLead.phone}`} className="text-xs text-text-primary font-mono font-semibold hover:underline block mt-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-accent" /> {selectedLead.phone}
                    </a>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Email Address</span>
                    <a href={`mailto:${selectedLead.email}`} className="text-xs text-text-primary font-mono font-semibold hover:underline block mt-1">
                      {selectedLead.email}
                    </a>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Target City / Market</span>
                    <span className="text-xs text-text-primary font-bold block mt-1">📍 {selectedLead.city || 'Raigarh'}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Required CRM Solution</span>
                    <span className="text-xs text-accent font-extrabold block mt-1">{selectedLead.service}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Approved Budget Tier</span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold block w-fit mt-1">
                      {selectedLead.budget || 'Custom Allocation'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Traffic Referrer Page</span>
                    <span className="text-xs text-text-secondary font-mono block mt-1">{selectedLead.source || 'Direct Enquiry'}</span>
                  </div>
                </div>
              </div>

              {/* Message block */}
              <div className="bg-btn-bg/10 border border-card-border p-4 rounded-2xl mb-6">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-text-tertiary mb-1.5">Submitted Client Requirement Message</span>
                <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">{selectedLead.message || 'No additional message provided.'}</p>
              </div>

              {/* Active Admin Notes Area (Saves to Supabase) */}
              <div className="space-y-3 pb-4">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Administrative Private Notes (Stored Securely)</label>
                  {notesFeedback && (
                    <span className="text-[11px] font-semibold text-emerald-400 animate-pulse">{notesFeedback}</span>
                  )}
                </div>
                <textarea
                  value={selectedLeadNotes}
                  onChange={(e) => setSelectedLeadNotes(e.target.value)}
                  placeholder="Record follow-ups, contract statuses, meeting feedback, or project blueprints. Only admins see this..."
                  className="w-full px-4 py-3 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent h-24 resize-none placeholder:text-text-tertiary"
                />
                
                <div className="flex items-center justify-between">
                  {/* Status Toggle in Modal */}
                  <div className="flex items-center space-x-2 text-xs text-text-secondary">
                    <span>Workflow Stage:</span>
                    <select
                      value={selectedLead.status || 'New'}
                      onChange={(e) => handleUpdateLeadStatus(selectedLead.id!, e.target.value)}
                      className="px-2 py-1 bg-btn-bg border border-btn-border rounded text-xs text-text-primary focus:outline-none"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Discussion">In Discussion</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Converted">Converted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <button
                    onClick={handleSaveLeadNotes}
                    disabled={notesSaving}
                    className="px-4 py-2 bg-accent text-black font-extrabold text-xs uppercase tracking-wider rounded-lg hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {notesSaving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Private Notes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-card-border flex items-center justify-between">
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  💬 Connect on WhatsApp
                </a>

                <button
                  onClick={() => {
                    triggerDeleteConfirm('lead', selectedLead.id!, selectedLead.name);
                  }}
                  className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Prospect
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================
          MODAL 2: CUSTOM PREMIUM CONFIRMATION POPUP
          ========================================== */}
      <AnimatePresence>
        {deleteModalConfig.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
              onClick={() => setDeleteModalConfig(prev => ({ ...prev, isOpen: false }))}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card-bg border border-red-500/20 rounded-3xl w-full max-w-md p-6 z-[101] shadow-[0_0_50px_rgba(239,68,68,0.1)] relative text-center"
            >
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 animate-pulse" />
              </div>

              <h3 className="text-base font-bold font-heading text-text-primary">Confirm Permanent Record Deletion</h3>
              <p className="text-xs text-text-tertiary mt-2 leading-relaxed">
                Are you absolutely sure you want to delete <strong className="text-text-secondary">"{deleteModalConfig.title}"</strong> from the database? This action is immediate and completely irreversible.
              </p>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => setDeleteModalConfig(prev => ({ ...prev, isOpen: false }))}
                  className="py-2.5 bg-btn-bg hover:bg-btn-hover-bg border border-btn-border text-xs font-bold text-text-secondary rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={executeRecordDelete}
                  className="py-2.5 bg-red-500/10 border border-red-500/30 hover:bg-red-500 text-white hover:text-black hover:border-transparent text-xs font-bold rounded-xl transition-all"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </PageTransition>
  );
}
