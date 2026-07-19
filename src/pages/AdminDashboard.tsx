import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Briefcase, Users, Settings as SettingsIcon, LogOut,
  Globe, Mail, Calendar, MessageSquare, Plus, Edit3, Trash2, ExternalLink,
  Lock, User, Key, Loader2, CheckCircle2, AlertCircle, Download, Search,
  Filter, X, ChevronRight, Bell, RefreshCw, Menu, Check, Sun, Moon,
  Terminal, Sliders, Eye, Activity, Phone, FileSpreadsheet, PlusCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { supabaseService } from '../services/supabaseService';
import PageTransition from '../components/PageTransition';
import { Lead, WebsiteAudit, ContactMessage, Newsletter, BookedCall, BlogPost } from '../types/supabase';
import { useTheme } from '../components/ThemeProvider';
import CMSEditor from '../components/CMSEditor';
import BlogManager from '../components/BlogManager';
import SEODashboard from '../components/SEODashboard';

// Static default projects to populate Portfolio state if empty
const DEFAULT_PROJECTS = [
  {
    title: "Unique Salon",
    category: "Beauty & Wellness",
    type: "Demo Design" as const,
    services: ["Website Design", "Booking Integration", "Mobile Optimization"],
    url: "https://uniquesalons.netlify.app/",
    color: "from-pink-500/20 to-purple-500/20"
  },
  {
    title: "Anmol Textile",
    category: "Retail & Fashion",
    type: "Demo Design" as const,
    services: ["E-commerce UI", "Brand Identity", "Product Showcase"],
    url: "https://anmoltextile.netlify.app/",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    title: "Puja Jewellers",
    category: "Luxury Retail",
    type: "Demo Design" as const,
    services: ["Premium UI/UX", "Collection Catalog", "WhatsApp Lead Gen"],
    url: "https://pujajewellers.netlify.app/",
    color: "from-amber-500/20 to-yellow-500/20"
  },
  {
    title: "The Muscle Gym",
    category: "Fitness & Health",
    type: "Demo Design" as const,
    services: ["High-Energy Design", "Membership Forms", "SEO"],
    url: "https://themuscle.netlify.app/",
    color: "from-red-500/20 to-orange-500/20"
  },
  {
    title: "Rama Aesthetics",
    category: "Skin Clinic & Wellness",
    type: "Demo Design" as const,
    services: ["Detailed treatment lists", "Interactive Dr. slot booking", "High-retention post-care FAQs"],
    url: "https://ramaaesthetics.netlify.app/",
    color: "from-teal-500/20 to-emerald-500/20"
  }
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Active Main Sidebar Tab
  const [activeTab, setActiveTab] = useState<'home' | 'portfolio' | 'leads' | 'settings' | 'cms' | 'blogs' | 'seo'>('home');
  
  // Leads tab sub-view (we group leads, audits, calls, messages, newsletters to keep the sidebar extremely clean like Supabase/Linear!)
  const [leadsSubView, setLeadsSubView] = useState<'leads' | 'audits' | 'messages' | 'calls' | 'newsletters'>('leads');

  // Session & Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // CRM Data States
  const [leads, setLeads] = useState<Lead[]>([]);
  const [audits, setAudits] = useState<WebsiteAudit[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [calls, setCalls] = useState<BookedCall[]>([]);
  const [crmLoading, setCrmLoading] = useState(false);

  // Portfolio projects state synced dynamically
  const [projects, setProjects] = useState<any[]>([]);

  // Blogs State Sync
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({
    id: '',
    title: '',
    slug: '',
    thumbnail: '',
    content: '',
    excerpt: '',
    category: 'Web Design',
    published: false,
    publish_date: '',
    tags: '',
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    author: 'Harsh Patel',
    reading_time: '5 min read',
    is_draft: true
  });
  const [blogSearch, setBlogSearch] = useState('');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('All');
  const [blogStatusFilter, setBlogStatusFilter] = useState('all');

  // Project Editing State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [projectForm, setProjectForm] = useState({
    id: '',
    title: '',
    category: '',
    description: '',
    thumbnail: '',
    url: '',
    featured: false,
    hidden: false,
    display_order: 1,
    tagline: '',
    features: '',
    icon: '🚀'
  });

  // Settings Credentials State
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Leads Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [leadCurrentPage, setLeadCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected Lead Detail Modal
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeadNotes, setSelectedLeadNotes] = useState('');
  const [notesSaving, setNotesSaving] = useState(false);
  const [notesFeedback, setNotesFeedback] = useState('');

  // Delete Modal Setup
  const [deleteModalConfig, setDeleteModalConfig] = useState<{
    isOpen: boolean;
    type: 'lead' | 'audit' | 'message' | 'call' | 'newsletter' | 'project';
    id: string;
    title: string;
  }>({ isOpen: false, type: 'lead', id: '', title: '' });

  // Notifications
  const [notifications, setNotifications] = useState<{ id: string; title: string; desc: string; time: string; read: boolean }[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check auth session
  useEffect(() => {
    const checkSession = async () => {
      try {
        if (!isSupabaseConfigured) {
          const savedSession = localStorage.getItem('hds_sandbox_auth');
          if (savedSession === 'active') {
            setIsAuthenticated(true);
            setUser({ email: localStorage.getItem('hds_sandbox_email') || 'admin@hds.com', user_metadata: { name: 'Admin Sandbox' } });
          }
          setLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
          setUser(session.user);
        }
      } catch (err) {
        console.error('Session verify error:', err);
      } finally {
        setLoading(false);
      }
    };
    checkSession();

    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setIsAuthenticated(true);
          setUser(session.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  // Load Database CRM data
  const fetchData = async () => {
    if (!isAuthenticated) return;
    setCrmLoading(true);
    try {
      const [leadsData, auditsData, msgsData, newsData, callsData, projectsData, blogsData] = await Promise.all([
        supabaseService.getAllLeads(),
        supabaseService.getAllAudits(),
        supabaseService.getAllMessages(),
        supabaseService.getAllNewsletterSubscribers(),
        supabaseService.getAllBookedCalls(),
        supabaseService.getPortfolioProjects(),
        supabaseService.getBlogPostsAdmin()
      ]);

      setLeads(leadsData || []);
      setAudits(auditsData || []);
      setMessages(msgsData || []);
      setNewsletters(newsData || []);
      setCalls(callsData || []);
      setProjects(projectsData || []);
      setBlogs(blogsData || []);
    } catch (err) {
      console.error('Error loading CRM stats:', err);
    } finally {
      setCrmLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Real-time Postgres insert simulations
  useEffect(() => {
    if (!isSupabaseConfigured || !isAuthenticated) return;
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads' },
        (payload) => {
          const newL = payload.new as Lead;
          setNotifications(prev => [
            {
              id: Date.now().toString(),
              title: 'Live Lead Received',
              desc: `${newL.name} has requested ${newL.service}.`,
              time: 'Just Now',
              read: false
            },
            ...prev
          ]);
          fetchData();
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isAuthenticated]);

  // Simulate Mock Lead
  const injectSampleLead = async () => {
    const names = ['Karan Agrawal', 'Rajesh Sahu', 'Nisha Sharma', 'Vivek Dewangan', 'Aman Baghel'];
    const businesses = ['Agrawal Steel Raigarh', 'Sahu General Store', 'Sharma Wellness Clinic', 'Dewangan Tiles', 'Baghel Electronics'];
    const services = ['Business Website Design', 'Local SEO', 'WhatsApp Lead Gen', 'E-commerce UI', 'Google Business Profile'];
    const cities = ['Raigarh', 'Tamnar', 'Kharsia'];
    const budgets = ['Under ₹10k', '₹10k - ₹25k', '₹25k - ₹50k', 'Above ₹50k'];

    const pick = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
    const bName = pick(businesses);
    const pName = pick(names);

    const randomLead = {
      name: pName,
      email: `${pName.toLowerCase().replace(' ', '.')}@gmail.com`,
      phone: '+91 ' + Math.floor(7000000000 + Math.random() * 2999999999),
      business_name: bName,
      service: pick(services),
      budget: pick(budgets),
      message: `Required complete SEO optimization and high-performance Web app development for ${bName} branch based in ${pick(cities)}.`,
      status: 'New' as const,
      source: '/direct',
      city: pick(cities),
      notes: ''
    };

    const response = await supabaseService.submitLead(randomLead);
    if (response.success) {
      setNotifications(prev => [
        {
          id: Date.now().toString(),
          title: 'Simulated Inbound Lead',
          desc: `${pName} logged to CRM.`,
          time: 'Just Now',
          read: false
        },
        ...prev
      ]);
      await fetchData();
    }
  };

  // Status Pill updates
  const handleUpdateLeadStatus = async (id: string, newStatus: any) => {
    const success = await supabaseService.updateLeadStatus(id, newStatus);
    if (success) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
      }
    }
  };

  // Notes update
  const handleSaveLeadNotes = async () => {
    if (!selectedLead || !selectedLead.id) return;
    setNotesSaving(true);
    const success = await supabaseService.updateLeadNotes(selectedLead.id, selectedLeadNotes);
    if (success) {
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, notes: selectedLeadNotes } : l));
      setSelectedLead(prev => prev ? { ...prev, notes: selectedLeadNotes } : null);
      setNotesFeedback('Notes securely stored.');
      setTimeout(() => setNotesFeedback(''), 3000);
    } else {
      setNotesFeedback('Could not save notes.');
    }
    setNotesSaving(false);
  };

  // Delete Action Configurator
  const triggerDeleteConfirm = (type: any, id: string, name: string) => {
    setDeleteModalConfig({
      isOpen: true,
      type,
      id,
      title: name
    });
  };

  // Delete Operations
  const executeRecordDelete = async () => {
    const { id, type } = deleteModalConfig;
    let success = false;

    if (type === 'project') {
      success = await supabaseService.deletePortfolioProject(id);
      if (success) {
        setProjects(prev => prev.filter(p => p.id !== id));
      }
    } else if (type === 'lead') {
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
          title: 'Entry Deleted',
          desc: `Deleted ${type} record: ${deleteModalConfig.title}`,
          time: 'Just Now',
          read: true
        },
        ...prev
      ]);
    }
    setDeleteModalConfig({ isOpen: false, type: 'lead', id: '', title: '' });
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead(null);
    }
  };

  // Toggle Project Featured Flag Directly
  const handleToggleFeatureProject = async (proj: any) => {
    const updated = { ...proj, featured: !proj.featured };
    const success = await supabaseService.savePortfolioProject(updated);
    if (success) {
      setProjects(prev => prev.map(p => p.id === proj.id ? { ...p, featured: updated.featured } : p));
    }
  };

  // Toggle Project Hidden Flag Directly
  const handleToggleHideProject = async (proj: any) => {
    const updated = { ...proj, hidden: !proj.hidden };
    const success = await supabaseService.savePortfolioProject(updated);
    if (success) {
      setProjects(prev => prev.map(p => p.id === proj.id ? { ...p, hidden: updated.hidden } : p));
    }
  };

  // Update Display Order Directly
  const handleUpdateDisplayOrder = async (proj: any, newOrder: number) => {
    const updated = { ...proj, display_order: newOrder };
    const success = await supabaseService.savePortfolioProject(updated);
    if (success) {
      setProjects(prev => prev.map(p => p.id === proj.id ? { ...p, display_order: newOrder } : p)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      );
    }
  };

  // Portfolio Add/Edit Project Form Save
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.category || !projectForm.description) {
      alert('Project Title, Category, and Description are required.');
      return;
    }

    const servicesArray = projectForm.features
      ? projectForm.features.split(',').map(s => s.trim()).filter(Boolean)
      : ["Custom Design", "Mobile Friendly", "WhatsApp Ready"];

    const projData = {
      id: editingProject?.id || (projectForm.id && !projectForm.id.startsWith('project-') ? projectForm.id : undefined),
      title: projectForm.title,
      category: projectForm.category,
      description: projectForm.description,
      thumbnail: projectForm.thumbnail || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      url: projectForm.url || '#',
      featured: projectForm.featured,
      hidden: projectForm.hidden,
      display_order: Number(projectForm.display_order) || 1,
      features: servicesArray,
      tagline: projectForm.tagline || undefined,
      icon: projectForm.icon || '🚀'
    };

    const success = await supabaseService.savePortfolioProject(projData);
    if (success) {
      const updatedProjects = await supabaseService.getPortfolioProjects();
      setProjects(updatedProjects);
      setIsProjectModalOpen(false);
      setEditingProject(null);
      setProjectForm({
        id: '',
        title: '',
        category: '',
        description: '',
        thumbnail: '',
        url: '',
        featured: false,
        hidden: false,
        display_order: 1,
        tagline: '',
        features: '',
        icon: '🚀'
      });
    } else {
      alert('Failed to save project. Please check network logs.');
    }
  };

  // Open Edit Project Modal
  const openEditProjectModal = (proj: any) => {
    setEditingProject(proj);
    setProjectForm({
      id: proj.id || '',
      title: proj.title,
      category: proj.category,
      description: proj.description || '',
      thumbnail: proj.thumbnail || '',
      url: proj.url || '',
      featured: proj.featured || false,
      hidden: proj.hidden || false,
      display_order: proj.display_order || 1,
      tagline: proj.tagline || '',
      features: proj.features ? proj.features.join(', ') : '',
      icon: proj.icon || '🚀'
    });
    setIsProjectModalOpen(true);
  };

  // Change security password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    if (newPassword !== confirmNewPassword) {
      setProfileErrorMsg('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setProfileErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setProfileLoading(true);
    try {
      if (!isSupabaseConfigured) {
        setProfileSuccessMsg('Password updated successfully in Sandbox mode.');
        setNewPassword('');
        setConfirmNewPassword('');
        setProfileLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setProfileErrorMsg(error.message);
      } else {
        setProfileSuccessMsg('Administrative security password modified successfully.');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err: any) {
      setProfileErrorMsg(err.message || 'Error updating password.');
    } finally {
      setProfileLoading(false);
    }
  };

  // Log Out
  const handleLogout = async () => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem('hds_sandbox_auth');
      setIsAuthenticated(false);
      setUser(null);
      navigate('/admin/login');
      return;
    }

    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // CSV Exporter
  const exportCRMData = (onlyFiltered = false) => {
    const dataToExport = onlyFiltered ? filteredLeads : leads;
    const headers = ['Date', 'Name', 'Business', 'Phone', 'Email', 'Service', 'Budget', 'Status', 'Notes'];
    const rows = dataToExport.map(l => [
      l.created_at ? new Date(l.created_at).toLocaleDateString() : 'N/A',
      l.name || '',
      l.business_name || '',
      l.phone || '',
      l.email || '',
      l.service || '',
      l.budget || '',
      l.status || 'New',
      (l.notes || '').replace(/\n/g, ' ')
    ]);

    const csvContent = "\uFEFF" + [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `HDS_Leads_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Excel Exporter
  const exportCRMDataExcel = (onlyFiltered = false) => {
    const dataToExport = onlyFiltered ? filteredLeads : leads;
    let excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>HDS CRM Leads</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <style>
          table { border-collapse: collapse; }
          th { background-color: #00F0FF; color: #000000; font-family: sans-serif; font-size: 12px; font-weight: bold; padding: 6px; border: 1px solid #CCCCCC; }
          td { font-family: sans-serif; font-size: 11px; padding: 5px; border: 1px solid #CCCCCC; }
        </style>
      </head>
      <body>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Business Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Selected Service</th>
            <th>Budget</th>
            <th>Message</th>
            <th>Source Page</th>
            <th>Status</th>
            <th>Internal Notes</th>
          </tr>
        </thead>
        <tbody>
    `;

    dataToExport.forEach(l => {
      excelTemplate += `
        <tr>
          <td>${l.created_at ? new Date(l.created_at).toLocaleString() : 'N/A'}</td>
          <td>${l.name || ''}</td>
          <td>${l.business_name || ''}</td>
          <td>${l.phone || ''}</td>
          <td>${l.email || ''}</td>
          <td>${l.service || ''}</td>
          <td>${l.budget || ''}</td>
          <td>${(l.message || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
          <td>${l.source || ''}</td>
          <td>${l.status || 'New'}</td>
          <td>${(l.notes || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
        </tr>
      `;
    });

    excelTemplate += `
        </tbody>
      </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `HDS_Leads_Export_${new Date().toISOString().split('T')[0]}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Chart demands dataset (last 7 days)
  const chartData = useMemo(() => {
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
  }, [leads, audits]);

  // Unified Chronological Activity Log (for Recent Activity card!)
  const recentActivities = useMemo(() => {
    const activities: any[] = [];
    
    leads.forEach(l => {
      activities.push({
        id: l.id || `l-${l.created_at}`,
        type: 'lead',
        title: `Lead: ${l.name}`,
        desc: `Requested ${l.service} for ${l.business_name || 'Chhattisgarh Local'}`,
        time: l.created_at ? new Date(l.created_at) : new Date(),
        badge: l.status || 'New',
        badgeColor: l.status === 'Converted' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-500'
      });
    });

    audits.forEach(a => {
      activities.push({
        id: a.id || `a-${a.created_at}`,
        type: 'audit',
        title: `SEO Audit Request`,
        desc: `${a.name} submitted URL: ${a.website}`,
        time: a.created_at ? new Date(a.created_at) : new Date(),
        badge: 'Audit',
        badgeColor: 'bg-purple-500/10 text-purple-400'
      });
    });

    calls.forEach(c => {
      activities.push({
        id: c.id || `c-${c.created_at}`,
        type: 'call',
        title: `Consultation Booked`,
        desc: `${c.name} scheduled call on ${c.meeting_date} at ${c.meeting_time}`,
        time: c.created_at ? new Date(c.created_at) : new Date(),
        badge: 'Call',
        badgeColor: 'bg-pink-500/10 text-pink-400'
      });
    });

    messages.forEach(m => {
      activities.push({
        id: m.id || `m-${m.created_at}`,
        type: 'message',
        title: `Contact Form Entry`,
        desc: `${m.name}: ${m.subject || 'Direct Inquiry'}`,
        time: m.created_at ? new Date(m.created_at) : new Date(),
        badge: 'Inquiry',
        badgeColor: 'bg-blue-500/10 text-blue-400'
      });
    });

    return activities
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, 10);
  }, [leads, audits, calls, messages]);

  // Lead query filters
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
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
  }, [leads, searchTerm, statusFilter, cityFilter, budgetFilter, sortOrder]);

  const totalLeadPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = useMemo(() => {
    return filteredLeads.slice(
      (leadCurrentPage - 1) * itemsPerPage,
      leadCurrentPage * itemsPerPage
    );
  }, [filteredLeads, leadCurrentPage]);

  // Compute metric stats
  const totalLeadsCount = leads.length;
  const newLeadsCount = leads.filter(l => l.status === 'New' || !l.status).length;
  const portfolioProjectsCount = projects.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-accent animate-spin mx-auto mb-4" />
          <p className="text-text-secondary text-sm font-medium tracking-tight">Verifying credentials & workspace access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-accent animate-spin mx-auto mb-4" />
          <p className="text-text-secondary text-sm font-medium">Redirecting to admin login screen...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-bg-base text-text-primary flex flex-col lg:flex-row font-sans transition-colors duration-300">
        
        {/* ==========================================
            PREMIUM RESPONSIVE SIDEBAR (VERCEL / SUPABASE STYLE)
            ========================================== */}
        <AnimatePresence>
          {(isSidebarOpen || window.innerWidth >= 1024) && (
            <motion.aside 
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`fixed inset-y-0 left-0 z-50 w-64 bg-card-bg border-r border-card-border p-5 flex flex-col justify-between lg:static lg:h-screen lg:shrink-0 ${
                isSidebarOpen ? 'shadow-2xl' : ''
              }`}
            >
              <div>
                {/* Branding Block */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-card-border">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-accent shadow-sm">
                      <Terminal className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold tracking-tight text-text-primary">HDS Admin</h2>
                      <span className="text-[9px] text-accent/80 font-mono font-bold uppercase tracking-wider">SaaS Console v2.0</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden p-1.5 hover:bg-btn-bg rounded-lg border border-btn-border text-text-secondary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Sidebar Main Sections */}
                <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider block mb-3 px-2">Navigation</span>
                <nav className="space-y-1">
                  {[
                    { id: 'home', label: 'Dashboard Home', icon: LayoutDashboard },
                    { id: 'portfolio', label: `Portfolio (${projects.length})`, icon: Briefcase },
                    { id: 'leads', label: `Leads Hub (${leads.length})`, icon: Users, badge: newLeadsCount },
                    { id: 'blogs', label: `Insights & Blogs (${blogs.length})`, icon: Edit3 },
                    { id: 'cms', label: 'Website CMS', icon: Globe },
                    { id: 'seo', label: 'SEO Dashboard', icon: Search },
                    { id: 'settings', label: 'System Settings', icon: SettingsIcon }
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
                        className={`w-full px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-accent/10 border border-accent/20 text-accent font-bold shadow-sm' 
                            : 'text-text-secondary hover:text-text-primary hover:bg-btn-bg border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-text-tertiary'}`} />
                          <span>{item.label.split(' (')[0]}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="bg-accent text-black font-mono font-extrabold text-[9px] px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Sidebar Footer with Session Control */}
              <div className="border-t border-card-border pt-4">
                <div className="flex items-center space-x-2.5 mb-4">
                  <div className="w-8 h-8 bg-btn-bg border border-btn-border rounded-full flex items-center justify-center text-accent">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-text-primary truncate">{user?.email}</p>
                    <p className="text-[9px] text-text-tertiary truncate">HDS Administrator</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-black text-red-400 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout Session</span>
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ==========================================
            MAIN CONTENT WORKSPACE AREA
            ========================================== */}
        <main className="flex-1 min-w-0 overflow-y-auto lg:h-screen flex flex-col justify-between">
          
          {/* TOP GLOBAL BAR */}
          <header className="bg-card-bg/70 border-b border-card-border px-6 py-4 sticky top-0 backdrop-blur-md z-40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-btn-bg border border-btn-border rounded-lg text-text-secondary"
              >
                <Menu className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-md font-bold text-text-primary tracking-tight capitalize font-heading">
                  {activeTab === 'home' && 'SaaS Console'}
                  {activeTab === 'portfolio' && 'Portfolio Projects Engine'}
                  {activeTab === 'leads' && 'Global CRM Leads Hub'}
                  {activeTab === 'blogs' && 'SEO Insights & Blog Management'}
                  {activeTab === 'cms' && 'Website CMS Content Engine'}
                  {activeTab === 'seo' && 'Search Engine Optimization Studio'}
                  {activeTab === 'settings' && 'System Configuration'}
                </h1>
                <p className="text-[10px] text-text-tertiary hidden sm:block mt-0.5">
                  Secure administration dashboard connected to <span className="text-accent font-mono">PostgreSQL</span> database
                </p>
              </div>
            </div>

            {/* Topbar Right Quick Actions */}
            <div className="flex items-center gap-2.5">
              
              {/* Theme Toggle Button */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 bg-btn-bg border border-btn-border text-text-secondary hover:text-text-primary rounded-lg transition-all"
                title="Toggle visual style theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Lead Simulation Shortcut */}
              <button
                onClick={injectSampleLead}
                className="hidden sm:flex px-3 py-1.5 bg-accent/10 hover:bg-accent/20 border border-accent/20 text-accent text-[11px] font-bold rounded-lg items-center gap-1 transition-all cursor-pointer"
                title="Mock inbound pipeline entry"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Simulate Lead</span>
              </button>

              {/* Signals Notification Panel */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 bg-btn-bg border border-btn-border text-text-secondary hover:text-text-primary rounded-lg relative cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-card-bg border border-card-border rounded-xl p-3.5 shadow-xl z-50 text-xs"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-card-border mb-2.5">
                          <span className="font-bold text-[10px] tracking-wider text-text-tertiary uppercase">Inbound CRM Signals</span>
                          {notifications.length > 0 && (
                            <button onClick={() => setNotifications([])} className="text-[10px] text-accent hover:underline">
                              Clear
                            </button>
                          )}
                        </div>
                        <div className="space-y-2 max-h-56 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="text-center py-6 text-text-tertiary font-medium">
                              No incoming alerts. Live DB trigger online.
                            </div>
                          ) : (
                            notifications.map(n => (
                              <div key={n.id} className="p-2 bg-btn-bg/50 border border-btn-border/50 rounded-lg">
                                <div className="flex items-center justify-between font-bold text-text-primary">
                                  <span>{n.title}</span>
                                  <span className="text-[8px] text-text-tertiary font-mono">{n.time}</span>
                                </div>
                                <p className="text-text-secondary mt-1 leading-snug text-[10px]">{n.desc}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* DB Refresh */}
              <button
                onClick={fetchData}
                disabled={crmLoading}
                className="p-2 bg-btn-bg border border-btn-border text-text-secondary hover:text-text-primary rounded-lg"
                title="Synchronize Live SQL Database"
              >
                <RefreshCw className={`w-4 h-4 ${crmLoading ? 'animate-spin' : ''}`} />
              </button>

            </div>
          </header>

          {/* ==========================================
              PRIMARY SAAS DASHBOARD BODY
              ========================================== */}
          <div className="flex-1 p-5 max-w-7xl w-full mx-auto space-y-6">

            {/* TAB 1: DASHBOARD HOME (OVERVIEW & CENTRAL KPI GRAPH) */}
            {activeTab === 'home' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Dashboard Metrics (Requested: Total Leads, New Leads, Portfolio Projects, Recent Activity) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: 'Total Leads', value: totalLeadsCount, label: 'Pipeline records', color: 'text-accent', bg: 'bg-accent/5', icon: Users },
                    { title: 'New Leads', value: newLeadsCount, label: 'Require contact', color: 'text-amber-500', bg: 'bg-amber-500/5', icon: AlertCircle },
                    { title: 'Portfolio Projects', value: portfolioProjectsCount, label: 'Live project showcases', color: 'text-indigo-400', bg: 'bg-indigo-400/5', icon: Briefcase },
                    { title: 'Inbound Inquiries', value: messages.length + audits.length + calls.length, label: 'Direct forms & audits', color: 'text-purple-400', bg: 'bg-purple-400/5', icon: Activity }
                  ].map((card, idx) => {
                    const CardIcon = card.icon;
                    return (
                      <div key={idx} className="bg-card-bg border border-card-border rounded-xl p-4.5 relative overflow-hidden flex flex-col justify-between h-32">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">{card.title}</span>
                          <CardIcon className={`w-4 h-4 ${card.color}`} />
                        </div>
                        <div>
                          <p className={`text-2xl font-extrabold font-heading ${card.color}`}>{card.value}</p>
                          <p className="text-[9px] text-text-tertiary font-mono mt-0.5">{card.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Main Graph & Action Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Performance Area Chart */}
                  <div className="lg:col-span-2 bg-card-bg border border-card-border rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">CRM Conversion Funnel Statistics</h3>
                        <span className="text-[10px] text-text-tertiary">Live incoming CRM entries mapped over preceding 7 calendar days</span>
                      </div>
                      <div className="flex items-center space-x-2.5 text-[9px] font-mono">
                        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-accent mr-1" /> Leads</span>
                        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-purple-400 mr-1" /> Audits</span>
                      </div>
                    </div>

                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="auditsGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#c084fc" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                          <XAxis dataKey="dateStr" stroke="rgba(255,255,255,0.2)" style={{ fontSize: 9, fontFamily: 'monospace' }} />
                          <YAxis stroke="rgba(255,255,255,0.2)" style={{ fontSize: 9, fontFamily: 'monospace' }} allowDecimals={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#09090d', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 10 }} />
                          <Area type="monotone" dataKey="leads" stroke="#00F0FF" strokeWidth={1.5} fillOpacity={1} fill="url(#leadsGradient)" />
                          <Area type="monotone" dataKey="audits" stroke="#c084fc" strokeWidth={1.5} fillOpacity={1} fill="url(#auditsGradient)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Core Management Utilities */}
                  <div className="bg-card-bg border border-card-border rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Administrative Control Panel</h3>
                      <p className="text-[11px] text-text-tertiary leading-relaxed mb-4">
                        Quick shortcuts to trigger automated customer databases, pipeline backups, or edit published showcases.
                      </p>

                      <div className="space-y-2">
                        <button
                          onClick={() => setActiveTab('portfolio')}
                          className="w-full flex items-center justify-between p-2.5 rounded-lg bg-btn-bg hover:bg-accent/10 hover:text-accent border border-btn-border text-text-secondary hover:text-text-primary transition-all text-xs font-bold cursor-pointer"
                        >
                          <span className="flex items-center"><Briefcase className="w-3.5 h-3.5 mr-2" /> Manage Portfolio Engine</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => { setActiveTab('leads'); setLeadsSubView('leads'); }}
                          className="w-full flex items-center justify-between p-2.5 rounded-lg bg-btn-bg hover:bg-accent/10 hover:text-accent border border-btn-border text-text-secondary hover:text-text-primary transition-all text-xs font-bold cursor-pointer"
                        >
                          <span className="flex items-center"><Users className="w-3.5 h-3.5 mr-2" /> Review Inbound Leads</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => exportCRMData(false)}
                          className="w-full flex items-center justify-between p-2.5 rounded-lg bg-btn-bg hover:bg-emerald-500/10 hover:text-emerald-400 border border-btn-border text-text-secondary hover:text-text-primary transition-all text-xs font-bold cursor-pointer"
                        >
                          <span className="flex items-center"><Download className="w-3.5 h-3.5 mr-2" /> Export Contact Backups</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-card-border text-[9px] text-text-tertiary flex items-center">
                      <Lock className="w-3 h-3 text-accent mr-1.5" /> Workspace Session Authenticated
                    </div>
                  </div>

                </div>

                {/* Recent Activity Section */}
                <div className="bg-card-bg border border-card-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-card-border">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-accent animate-pulse" /> Unified Recent Activity Log
                    </h3>
                    <span className="text-[9px] text-text-tertiary">Aggregated SQL database triggers</span>
                  </div>

                  {recentActivities.length === 0 ? (
                    <p className="text-center py-6 text-xs text-text-tertiary font-mono">No database interactions logged yet.</p>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {recentActivities.map((act) => (
                        <div key={act.id} className="flex items-center justify-between p-2.5 bg-btn-bg/30 border border-card-border rounded-lg text-xs hover:bg-btn-bg/50 transition-colors">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase shrink-0 ${act.badgeColor}`}>
                              {act.badge}
                            </span>
                            <div className="min-w-0">
                              <span className="font-bold text-text-primary block truncate">{act.title}</span>
                              <span className="text-[10px] text-text-tertiary block truncate mt-0.5">{act.desc}</span>
                            </div>
                          </div>
                          <span className="text-[9px] text-text-tertiary font-mono shrink-0 ml-4">
                            {new Date(act.time).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </motion.div>
            )}

            {/* TAB 2: PORTFOLIO ENGINE (CRUD MANAGER) */}
            {activeTab === 'portfolio' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card-bg border border-card-border rounded-2xl p-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Showcase Custom Project Control</h3>
                    <p className="text-[10px] text-text-tertiary mt-1">Configure live websites and designs that render dynamically on the public portfolio page.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingProject(null);
                      setProjectForm({
                        id: '',
                        title: '',
                        category: '',
                        description: '',
                        thumbnail: '',
                        url: '',
                        featured: false,
                        hidden: false,
                        display_order: projects.length + 1,
                        tagline: '',
                        features: '',
                        icon: '🚀'
                      });
                      setIsProjectModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-accent text-black font-extrabold text-xs uppercase tracking-wider rounded-lg hover:opacity-90 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Project</span>
                  </button>
                </div>

                {/* Portfolio items rendering */}
                {projects.length === 0 ? (
                  <div className="bg-card-bg border border-card-border rounded-2xl p-8 text-center">
                    <p className="text-xs text-text-secondary">No portfolio projects found. Click "Create Project" to get started!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {projects.map((proj, idx) => (
                      <div key={proj.id || idx} className="bg-card-bg border border-card-border rounded-2xl overflow-hidden flex flex-col justify-between group relative">
                        
                        {/* Visual Thumbnail & Badge Controls */}
                        <div className="h-44 bg-neutral-900 relative overflow-hidden shrink-0">
                          <img 
                            src={proj.thumbnail || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'} 
                            alt={proj.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
                          
                          {/* Badges Overlay */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                            <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-[8px] font-bold text-accent font-mono tracking-widest uppercase rounded border border-accent/20">
                              {proj.icon || '🚀'} {proj.category}
                            </span>
                            <div className="flex items-center gap-1">
                              {proj.featured && (
                                <span className="px-2 py-0.5 bg-amber-500 text-black text-[7px] font-extrabold uppercase rounded tracking-wider">
                                  ★ Featured
                                </span>
                              )}
                              {proj.hidden && (
                                <span className="px-2 py-0.5 bg-red-500/80 text-white text-[7px] font-extrabold uppercase rounded tracking-wider">
                                  Hidden
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Title Overlay */}
                          <div className="absolute bottom-3 left-3 right-3 z-10">
                            <h4 className="text-sm font-bold text-white tracking-tight line-clamp-1">{proj.title}</h4>
                            {proj.tagline && <p className="text-[9px] text-text-tertiary font-medium line-clamp-1 mt-0.5">{proj.tagline}</p>}
                          </div>
                        </div>

                        {/* Info & Categories */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-3">
                              {proj.description || 'No description provided.'}
                            </p>
                            
                            {/* Features tags */}
                            {proj.features && proj.features.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {proj.features.map((feat: string, fIdx: number) => (
                                  <span key={fIdx} className="px-1.5 py-0.5 bg-btn-bg border border-btn-border text-[8px] text-text-secondary rounded font-mono">
                                    {feat}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Display Order Changer & Active Status Toggles */}
                          <div className="pt-3 border-t border-card-border space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold uppercase text-text-tertiary">Display Order Weight:</span>
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => handleUpdateDisplayOrder(proj, Math.max(1, (proj.display_order || 1) - 1))}
                                  disabled={proj.display_order <= 1}
                                  className="w-5 h-5 flex items-center justify-center rounded bg-btn-bg hover:bg-btn-hover-bg text-[10px] text-text-secondary font-bold disabled:opacity-30 border border-btn-border"
                                >
                                  -
                                </button>
                                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold text-text-primary bg-black/40 border border-card-border rounded">
                                  {proj.display_order || 1}
                                </span>
                                <button 
                                  onClick={() => handleUpdateDisplayOrder(proj, (proj.display_order || 1) + 1)}
                                  className="w-5 h-5 flex items-center justify-center rounded bg-btn-bg hover:bg-btn-hover-bg text-[10px] text-text-secondary font-bold border border-btn-border"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Feature Toggle */}
                              <button
                                onClick={() => handleToggleFeatureProject(proj)}
                                className={`flex-1 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                                  proj.featured 
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                                    : 'bg-btn-bg text-text-tertiary border-btn-border hover:text-text-secondary'
                                }`}
                                title="Toggle project highlight feature"
                              >
                                ★ {proj.featured ? 'Featured' : 'Feature'}
                              </button>

                              {/* Hide Toggle */}
                              <button
                                onClick={() => handleToggleHideProject(proj)}
                                className={`flex-1 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                                  proj.hidden 
                                    ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                    : 'bg-btn-bg text-text-tertiary border-btn-border hover:text-text-secondary'
                                }`}
                                title="Toggle project visibility"
                              >
                                {proj.hidden ? '👁 Hidden' : '👁 Visible'}
                              </button>
                            </div>

                            {/* Edit/Delete Actions */}
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={() => openEditProjectModal(proj)}
                                className="flex-1 py-1 bg-btn-bg hover:bg-btn-hover-bg border border-btn-border text-text-secondary hover:text-text-primary text-[9px] font-extrabold uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" /> Edit Fields
                              </button>
                              
                              {proj.url && proj.url !== '#' && (
                                <a 
                                  href={proj.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1 bg-btn-bg hover:bg-btn-hover-bg border border-btn-border text-text-secondary hover:text-text-primary rounded-md text-[9px]"
                                  title="View Live Demo Link"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}

                              <button
                                onClick={() => triggerDeleteConfirm('project', proj.id, proj.title)}
                                className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500 hover:text-black text-red-400 text-[9px] rounded-md transition-all cursor-pointer border border-transparent hover:border-red-500/20"
                                title="Delete project permanent"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </motion.div>
            )}

            {/* TAB 3: LEADS HUB (WITH SUB-VIEWS: LEADS, AUDITS, DIRECT MESSAGES, CALLS, NEWSLETTERS) */}
            {activeTab === 'leads' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Leads sub-navigation tabs (Vercel-style subbar) */}
                <div className="flex items-center gap-1 bg-card-bg/60 border border-card-border p-1 rounded-xl overflow-x-auto print:hidden">
                  {[
                    { id: 'leads', label: `CRM Leads Pipeline (${leads.length})`, icon: Users },
                    { id: 'audits', label: `Website SEO Audits (${audits.length})`, icon: Globe },
                    { id: 'messages', label: `Contact Forms (${messages.length})`, icon: Mail },
                    { id: 'calls', label: `Consultations (${calls.length})`, icon: Calendar },
                    { id: 'newsletters', label: `Subscribers (${newsletters.length})`, icon: MessageSquare }
                  ].map(sub => {
                    const SubIcon = sub.icon;
                    const isSubActive = leadsSubView === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => setLeadsSubView(sub.id as any)}
                        className={`px-3.5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                          isSubActive 
                            ? 'bg-accent/15 text-accent font-extrabold border border-accent/20' 
                            : 'text-text-tertiary hover:text-text-primary hover:bg-btn-bg border border-transparent'
                        }`}
                      >
                        <SubIcon className="w-3.5 h-3.5" />
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Sub-view: CRM Leads Table */}
                {leadsSubView === 'leads' && (
                  <div className="space-y-4">
                    {/* Search & filters bar */}
                    <div className="bg-card-bg border border-card-border rounded-xl p-4 space-y-3 shadow-sm print:hidden">
                      <div className="flex flex-col md:flex-row items-center gap-3">
                        <div className="relative w-full md:flex-1">
                          <Search className="absolute left-3.5 top-3 w-4 h-4 text-text-tertiary" />
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Filter leads directory by name, business, budget, location..."
                            className="w-full pl-10 pr-4 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent"
                          />
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="flex-1 md:w-32 px-2.5 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs text-text-secondary focus:outline-none"
                          >
                            <option value="all">Statuses</option>
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Converted">Converted</option>
                            <option value="Closed">Closed</option>
                          </select>

                          <select
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                            className="flex-1 md:w-32 px-2.5 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs text-text-secondary focus:outline-none"
                          >
                            <option value="all">Markets</option>
                            <option value="Raigarh">Raigarh</option>
                            <option value="Tamnar">Tamnar</option>
                            <option value="Kharsia">Kharsia</option>
                          </select>

                          <button
                            onClick={() => exportCRMData(true)}
                            className="px-3 py-2 bg-btn-bg hover:bg-btn-hover-bg text-text-secondary border border-btn-border text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                            title="Download CSV results"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Export CSV</span>
                          </button>

                          <button
                            onClick={() => exportCRMDataExcel(true)}
                            className="px-3 py-2 bg-btn-bg hover:bg-btn-hover-bg text-text-secondary border border-btn-border text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                            title="Download Excel results"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
                            <span>Export Excel</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="bg-card-bg border border-card-border rounded-2xl shadow-sm overflow-hidden">
                      {paginatedLeads.length === 0 ? (
                        <div className="text-center py-16 text-text-secondary">
                          <Users className="w-10 h-10 text-text-tertiary mx-auto mb-3" />
                          <p className="font-bold text-xs">No Leads Found</p>
                          <p className="text-[10px] text-text-tertiary mt-1">Refine filters or trigger simulation sample lead.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse table-auto">
                            <thead>
                              <tr className="border-b border-card-border text-[10px] uppercase font-bold text-text-tertiary bg-btn-bg/20">
                                <th className="py-3 px-4 min-w-[110px]">Date</th>
                                <th className="py-3 px-4 min-w-[130px]">Name</th>
                                <th className="py-3 px-4 min-w-[140px]">Business</th>
                                <th className="py-3 px-4 min-w-[110px]">Phone</th>
                                <th className="py-3 px-4 min-w-[160px]">Email</th>
                                <th className="py-3 px-4 min-w-[150px]">Selected Service</th>
                                <th className="py-3 px-4 min-w-[110px]">Budget</th>
                                <th className="py-3 px-4 min-w-[200px]">Message</th>
                                <th className="py-3 px-4 min-w-[110px]">Source Page</th>
                                <th className="py-3 px-4 min-w-[130px]">Status</th>
                                <th className="py-3 px-4 text-right min-w-[90px]">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-card-border">
                              {paginatedLeads.map(lead => (
                                <tr key={lead.id} className="text-xs hover:bg-btn-bg/10 transition-colors">
                                  {/* Date Column */}
                                  <td className="py-3.5 px-4 font-mono text-[10px] text-text-secondary">
                                    {lead.created_at ? new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                                  </td>

                                  {/* Name Column */}
                                  <td className="py-3.5 px-4">
                                    <button
                                      onClick={() => { setSelectedLead(lead); setSelectedLeadNotes(lead.notes || ''); }}
                                      className="font-bold text-text-primary hover:text-accent transition-colors text-left focus:outline-none"
                                    >
                                      {lead.name}
                                    </button>
                                  </td>

                                  {/* Business Column */}
                                  <td className="py-3.5 px-4 text-text-secondary font-medium">
                                    {lead.business_name || 'N/A'}
                                  </td>

                                  {/* Phone Column */}
                                  <td className="py-3.5 px-4 font-mono text-[11px] text-text-secondary">
                                    {lead.phone}
                                  </td>

                                  {/* Email Column */}
                                  <td className="py-3.5 px-4 font-mono text-[11px] text-text-tertiary">
                                    {lead.email}
                                  </td>

                                  {/* Selected Service Column */}
                                  <td className="py-3.5 px-4">
                                    <span className="text-accent font-semibold">{lead.service}</span>
                                  </td>

                                  {/* Budget Column */}
                                  <td className="py-3.5 px-4">
                                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                                      {lead.budget || 'Custom'}
                                    </span>
                                  </td>

                                  {/* Message Column */}
                                  <td className="py-3.5 px-4 text-text-secondary">
                                    <span className="block truncate max-w-[220px] text-text-tertiary" title={lead.message}>
                                      {lead.message || 'No requirement message provided.'}
                                    </span>
                                  </td>

                                  {/* Source Page Column */}
                                  <td className="py-3.5 px-4 font-mono text-[10px] text-text-tertiary">
                                    {lead.source || '/'}
                                  </td>

                                  {/* Status Column */}
                                  <td className="py-3.5 px-4">
                                    <select
                                      value={lead.status || 'New'}
                                      onChange={(e) => handleUpdateLeadStatus(lead.id!, e.target.value)}
                                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase border focus:outline-none cursor-pointer transition-colors ${
                                        lead.status === 'Converted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        lead.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                        lead.status === 'Contacted' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                        lead.status === 'Closed' ? 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20' :
                                        'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                      }`}
                                    >
                                      <option value="New" className="bg-[#0B0F19] text-purple-400">New</option>
                                      <option value="Contacted" className="bg-[#0B0F19] text-yellow-500">Contacted</option>
                                      <option value="In Progress" className="bg-[#0B0F19] text-blue-400">In Progress</option>
                                      <option value="Converted" className="bg-[#0B0F19] text-emerald-400">Converted</option>
                                      <option value="Closed" className="bg-[#0B0F19] text-neutral-400">Closed</option>
                                    </select>
                                  </td>

                                  {/* Actions Column */}
                                  <td className="py-3.5 px-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => { setSelectedLead(lead); setSelectedLeadNotes(lead.notes || ''); }}
                                        className="p-1.5 hover:bg-btn-bg rounded-lg text-text-tertiary hover:text-accent"
                                        title="View private notes & details"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => triggerDeleteConfirm('lead', lead.id!, lead.name)}
                                        className="p-1.5 hover:bg-red-500/10 rounded-lg text-text-tertiary hover:text-red-400"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Pagination */}
                      {totalLeadPages > 1 && (
                        <div className="p-3 bg-btn-bg/10 border-t border-card-border flex items-center justify-between">
                          <span className="text-[10px] text-text-tertiary font-mono">
                            Page {leadCurrentPage} of {totalLeadPages}
                          </span>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => setLeadCurrentPage(p => Math.max(1, p - 1))}
                              disabled={leadCurrentPage === 1}
                              className="px-2.5 py-1 bg-btn-bg border border-btn-border rounded-md text-[10px] text-text-secondary disabled:opacity-50"
                            >
                              Prev
                            </button>
                            <button
                              onClick={() => setLeadCurrentPage(p => Math.min(totalLeadPages, p + 1))}
                              disabled={leadCurrentPage === totalLeadPages}
                              className="px-2.5 py-1 bg-btn-bg border border-btn-border rounded-md text-[10px] text-text-secondary disabled:opacity-50"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Sub-view: SEO Audits */}
                {leadsSubView === 'audits' && (
                  <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
                    {audits.length === 0 ? (
                      <p className="text-center py-12 text-xs text-text-tertiary font-mono">No website SEO audit request entries found.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-card-border text-[9px] uppercase font-bold text-text-tertiary bg-btn-bg/10 py-2.5">
                              <th className="py-3 px-4">Company & Target URL</th>
                              <th className="py-3 px-4">Contact Person</th>
                              <th className="py-3 px-4">Date Logged</th>
                              <th className="py-3 px-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-card-border">
                            {audits.map(aud => (
                              <tr key={aud.id} className="hover:bg-btn-bg/10 transition-colors">
                                <td className="py-3 px-4">
                                  <div className="font-bold text-text-primary">{aud.business_name || 'Chhattisgarh Brand'}</div>
                                  <a 
                                    href={`https://${aud.website.replace(/^(https?:\/\/)?(www\.)?/, '')}`}
                                    target="_blank" rel="noopener noreferrer" 
                                    className="text-accent hover:underline font-mono text-[10px] mt-0.5 inline-flex items-center gap-1"
                                  >
                                    {aud.website} <ExternalLink className="w-3 h-3" />
                                  </a>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="font-semibold">{aud.name}</div>
                                  <div className="text-[10px] text-text-tertiary">{aud.email} | {aud.phone}</div>
                                </td>
                                <td className="py-3 px-4 font-mono text-[10px] text-text-tertiary">
                                  {aud.created_at ? new Date(aud.created_at).toLocaleDateString() : 'Direct'}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <button
                                    onClick={() => triggerDeleteConfirm('audit', aud.id!, aud.website)}
                                    className="p-1.5 text-text-tertiary hover:text-red-400 rounded hover:bg-red-500/10"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-view: Contact Form Messages */}
                {leadsSubView === 'messages' && (
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <p className="text-center py-12 text-xs text-text-tertiary bg-card-bg border border-card-border rounded-2xl">No direct forms received yet.</p>
                    ) : (
                      messages.map(msg => (
                        <div key={msg.id} className="p-4 bg-card-bg border border-card-border rounded-xl flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-text-primary text-xs">{msg.name}</span>
                              <span className="text-[9px] text-text-tertiary font-mono">
                                {msg.created_at ? new Date(msg.created_at).toLocaleString() : ''}
                              </span>
                            </div>
                            <div className="text-[10px] text-text-tertiary font-mono">{msg.email} | {msg.phone || 'No phone'}</div>
                            <div className="text-[10px] font-bold text-accent">Subject: {msg.subject || 'CRM General Inquiry'}</div>
                            <p className="text-xs text-text-secondary leading-relaxed bg-btn-bg/35 p-3 rounded-lg border border-card-border mt-2 font-medium">
                              {msg.message}
                            </p>
                          </div>
                          <button
                            onClick={() => triggerDeleteConfirm('message', msg.id!, msg.name)}
                            className="px-2.5 py-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-black text-red-400 rounded-lg text-[10px] font-bold flex items-center gap-1 self-end md:self-start transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Sub-view: Consultations Call Bookings */}
                {leadsSubView === 'calls' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {calls.length === 0 ? (
                      <p className="text-center py-12 text-xs text-text-tertiary col-span-2 bg-card-bg border border-card-border rounded-2xl">No scheduled calls found.</p>
                    ) : (
                      calls.map(call => (
                        <div key={call.id} className="p-4 bg-card-bg border border-card-border rounded-xl flex flex-col justify-between space-y-4">
                          <div>
                            <div className="flex items-center justify-between pb-2 border-b border-card-border">
                              <span className="font-bold text-text-primary text-xs">{call.name}</span>
                              <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 text-[9px] font-bold uppercase font-mono">
                                {call.meeting_time}
                              </span>
                            </div>

                            <div className="space-y-1 text-[11px] text-text-secondary mt-3">
                              <div>📅 Date: <span className="font-bold text-text-primary">{call.meeting_date}</span></div>
                              <div className="truncate">📧 Email: <span className="font-mono">{call.email}</span></div>
                              <div>📞 Phone: <span className="font-mono">{call.phone}</span></div>
                              <div className="truncate">🛠 Goal: <span className="text-accent font-semibold">{call.service}</span></div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-card-border">
                            <a 
                              href={`https://wa.me/${call.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank" rel="noopener noreferrer" 
                              className="text-[10px] text-[#25D366] hover:underline font-bold flex items-center gap-1"
                            >
                              Connect WhatsApp
                            </a>
                            <button
                              onClick={() => triggerDeleteConfirm('call', call.id!, call.name)}
                              className="text-text-tertiary hover:text-red-400 p-1 hover:bg-red-500/5 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Sub-view: Newsletters subscribers */}
                {leadsSubView === 'newsletters' && (
                  <div className="bg-card-bg border border-card-border rounded-2xl p-4">
                    {newsletters.length === 0 ? (
                      <p className="text-center py-10 text-xs text-text-tertiary font-mono">No newsletter subscription logs.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {newsletters.map(item => (
                          <div key={item.id} className="p-3 bg-btn-bg/30 border border-card-border rounded-xl flex items-center justify-between">
                            <div className="min-w-0 pr-2">
                              <span className="font-mono text-text-secondary font-bold text-xs truncate block">{item.email}</span>
                              <span className="text-[8px] text-text-tertiary block mt-0.5 font-mono">
                                Date: {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                            <button
                              onClick={() => triggerDeleteConfirm('newsletter', item.id!, item.email)}
                              className="p-1 text-text-tertiary hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            )}

            {/* TAB 4: SYSTEM SETTINGS */}
            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Security Credentials Password Form */}
                  <div className="lg:col-span-2 bg-card-bg border border-card-border rounded-2xl p-5 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center">
                      <Lock className="w-4 h-4 mr-1.5 text-accent" /> Administrative Credentials Update
                    </h3>
                    <p className="text-[11px] text-text-tertiary leading-relaxed">
                      Change the secure master password used to log in to this administrative CRM console. These actions take effect instantly.
                    </p>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                      {profileSuccessMsg && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start text-emerald-400 text-xs">
                          <CheckCircle2 className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                          <span>{profileSuccessMsg}</span>
                        </div>
                      )}

                      {profileErrorMsg && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start text-red-400 text-xs">
                          <AlertCircle className="w-4.5 h-4.5 mr-2 shrink-0 mt-0.5" />
                          <span>{profileErrorMsg}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">New Password</label>
                          <div className="relative">
                            <Key className="absolute left-3.5 top-3 w-4 h-4 text-text-tertiary" />
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Min 6 characters"
                              className="w-full pl-9 pr-4 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">Verify Password</label>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-3 w-4 h-4 text-text-tertiary" />
                            <input
                              type="password"
                              value={confirmNewPassword}
                              onChange={(e) => setConfirmNewPassword(e.target.value)}
                              placeholder="Re-enter password"
                              className="w-full pl-9 pr-4 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={profileLoading}
                        className="px-4 py-2 bg-accent text-black font-extrabold text-[11px] uppercase tracking-wider rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {profileLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply Security Credentials'}
                      </button>
                    </form>
                  </div>

                  {/* UI Style Preferences Panel */}
                  <div className="bg-card-bg border border-card-border rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center">
                      <Sliders className="w-4 h-4 mr-1.5 text-accent" /> Console Preferences
                    </h3>
                    <p className="text-[11px] text-text-tertiary leading-relaxed">
                      Configure your local visual environment. These values are saved within client browser caching parameters.
                    </p>

                    <div className="space-y-3.5 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-text-secondary">Visual Styling Theme</span>
                        <div className="flex items-center gap-1 bg-btn-bg p-1 rounded-lg border border-btn-border">
                          <button
                            onClick={() => setTheme('light')}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold ${theme === 'light' ? 'bg-accent text-black' : 'text-text-tertiary'}`}
                          >
                            Light
                          </button>
                          <button
                            onClick={() => setTheme('dark')}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold ${theme === 'dark' ? 'bg-accent text-black' : 'text-text-tertiary'}`}
                          >
                            Dark
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-text-secondary">Demo Database Simulator</span>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px] font-mono font-bold uppercase border border-emerald-500/20">
                          Active Fallback
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-text-secondary">Secure Encryption</span>
                        <span className="px-2 py-0.5 bg-accent/10 text-accent rounded text-[9px] font-mono font-bold uppercase border border-accent/20">
                          AES-256 SSL
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

            {/* TAB 5: WEBSITE CMS EDITOR */}
            {activeTab === 'cms' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <CMSEditor />
              </motion.div>
            )}

            {/* TAB 6: BLOG MANAGER */}
            {activeTab === 'blogs' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <BlogManager onBlogSaved={() => fetchData()} />
              </motion.div>
            )}

            {/* TAB 7: SEO DASHBOARD */}
            {activeTab === 'seo' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <SEODashboard />
              </motion.div>
            )}

          </div>

          {/* ==========================================
              FOOTER
              ========================================== */}
          <footer className="py-4 border-t border-card-border px-6 text-center text-[10px] text-text-tertiary flex flex-col sm:flex-row items-center justify-between gap-1.5">
            <span>HDS CRM. Handcrafted by Harsh Patel. Secure workspace encryption active.</span>
            <span>Local Time: {new Date().toLocaleTimeString()} (Chhattisgarh Standard)</span>
          </footer>

        </main>
      </div>

      {/* ==========================================
          MODAL A: PORTFOLIO ADD/EDIT FORM MODAL
          ========================================== */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsProjectModalOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card-bg border border-card-border rounded-2xl w-full max-w-lg p-5 z-10 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-card-border sticky top-0 bg-card-bg z-20">
                <h3 className="text-md font-bold font-heading text-text-primary">
                  {editingProject ? 'Edit Showcase Project' : 'Create Showcase Project'}
                </h3>
                <button 
                  onClick={() => setIsProjectModalOpen(false)}
                  className="p-1.5 hover:bg-btn-bg rounded-lg text-text-secondary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-text-secondary mb-1">Project Title</label>
                    <input
                      type="text"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="e.g. Unique Salon"
                      className="w-full px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-text-secondary mb-1">Category</label>
                    <input
                      type="text"
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      placeholder="e.g. Beauty & Wellness"
                      className="w-full px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-text-secondary mb-1">Tagline</label>
                    <input
                      type="text"
                      value={projectForm.tagline}
                      onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })}
                      placeholder="e.g. Premium Hair & Beauty Grooming"
                      className="w-full px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-text-secondary mb-1">Emoji Icon</label>
                    <input
                      type="text"
                      value={projectForm.icon}
                      onChange={(e) => setProjectForm({ ...projectForm, icon: e.target.value })}
                      placeholder="e.g. ✨"
                      className="w-full px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase text-text-secondary mb-1">Description</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="Describe the project achievements, custom features, and core outcomes..."
                    rows={3}
                    className="w-full px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase text-text-secondary mb-1">Thumbnail Image URL</label>
                  <input
                    type="url"
                    value={projectForm.thumbnail}
                    onChange={(e) => setProjectForm({ ...projectForm, thumbnail: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent mb-2"
                  />
                  {projectForm.thumbnail && (
                    <div className="mt-2 p-2 bg-black/40 border border-card-border rounded-xl flex items-center gap-3">
                      <div className="w-16 h-12 rounded bg-neutral-900 border border-card-border overflow-hidden shrink-0">
                        <img 
                          src={projectForm.thumbnail} 
                          alt="Pre-save Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="text-[10px] text-text-secondary">
                        <span className="font-bold text-accent block">Image Preview Match</span>
                        <span>Confirm visual rendering before saving.</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-text-secondary mb-1">Live Demo URL</label>
                    <input
                      type="url"
                      value={projectForm.url}
                      onChange={(e) => setProjectForm({ ...projectForm, url: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-text-secondary mb-1">Display Order (weight)</label>
                    <input
                      type="number"
                      value={projectForm.display_order}
                      onChange={(e) => setProjectForm({ ...projectForm, display_order: parseInt(e.target.value) || 1 })}
                      placeholder="e.g. 1"
                      className="w-full px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase text-text-secondary mb-1">Features/Services (Comma separated)</label>
                  <input
                    type="text"
                    value={projectForm.features}
                    onChange={(e) => setProjectForm({ ...projectForm, features: e.target.value })}
                    placeholder="e.g. Live indicators, Category catalog layouts, Direct WhatsApp"
                    className="w-full px-3 py-1.5 bg-btn-bg border border-btn-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 py-2 border-t border-b border-card-border">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={projectForm.featured}
                      onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                      className="rounded border-btn-border bg-btn-bg text-accent focus:ring-0 cursor-pointer h-3.5 w-3.5"
                    />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-text-secondary uppercase">Feature Project</span>
                      <span className="text-[8px] text-text-tertiary">Pin to highlighted views</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={projectForm.hidden}
                      onChange={(e) => setProjectForm({ ...projectForm, hidden: e.target.checked })}
                      className="rounded border-btn-border bg-btn-bg text-accent focus:ring-0 cursor-pointer h-3.5 w-3.5"
                    />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-text-secondary uppercase">Hide Project</span>
                      <span className="text-[8px] text-text-tertiary">Exclude from homepage listings</span>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-accent text-black font-extrabold text-xs uppercase tracking-wider rounded-lg hover:opacity-90 transition-all cursor-pointer"
                >
                  Save Project Configuration
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================
          MODAL B: LEAD PRIVATE NOTES & DETAIL POPUP
          ========================================== */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
              onClick={() => setSelectedLead(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-card-bg border border-card-border rounded-2xl w-full max-w-xl p-5 z-10 shadow-2xl relative max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between pb-3 border-b border-card-border">
                <div>
                  <span className="text-[8px] uppercase font-bold text-text-tertiary font-mono tracking-wider">
                    Date: {selectedLead.created_at ? new Date(selectedLead.created_at).toLocaleString() : 'Direct Submission'}
                  </span>
                  <h3 className="text-md font-bold text-text-primary mt-1 font-heading">{selectedLead.name}</h3>
                  <p className="text-[10px] text-text-tertiary mt-0.5">Brand: <span className="text-text-secondary font-semibold">{selectedLead.business_name || 'Chhattisgarh Local Proprietor'}</span></p>
                </div>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="p-1.5 hover:bg-btn-bg rounded-lg text-text-secondary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 text-xs">
                <div className="space-y-2.5">
                  <div>
                    <span className="block text-[8px] font-bold uppercase text-text-tertiary">Phone Line</span>
                    <a href={`tel:${selectedLead.phone}`} className="text-text-primary font-mono font-semibold hover:underline block mt-0.5 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-accent" /> {selectedLead.phone}
                    </a>
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold uppercase text-text-tertiary">Email Address</span>
                    <a href={`mailto:${selectedLead.email}`} className="text-text-primary font-mono font-semibold hover:underline block mt-0.5">
                      {selectedLead.email}
                    </a>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <span className="block text-[8px] font-bold uppercase text-text-tertiary">Required CRM Service</span>
                    <span className="text-accent font-bold block mt-0.5">{selectedLead.service}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold uppercase text-text-tertiary">Approved Budget Tier</span>
                    <span className="text-emerald-400 font-semibold block mt-0.5">{selectedLead.budget || 'Custom Allocation'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-btn-bg/20 border border-card-border p-3 rounded-lg mb-4 text-xs text-text-secondary leading-relaxed">
                <span className="block text-[8px] font-bold uppercase text-text-tertiary mb-1">Requirement Message</span>
                {selectedLead.message || 'No custom requirement message.'}
              </div>

              {/* Private administrative notes */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <label className="block text-[8px] font-bold uppercase text-text-tertiary">Administrative Private Notes</label>
                  {notesFeedback && <span className="text-[10px] font-bold text-emerald-400">{notesFeedback}</span>}
                </div>
                <textarea
                  value={selectedLeadNotes}
                  onChange={(e) => setSelectedLeadNotes(e.target.value)}
                  placeholder="Record call updates, meetings, pricing quotes..."
                  className="w-full px-3 py-2 bg-btn-bg border border-btn-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent h-20 resize-none"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-[11px] text-text-secondary">
                    <span>Workflow Stage:</span>
                    <select
                      value={selectedLead.status || 'New'}
                      onChange={(e) => handleUpdateLeadStatus(selectedLead.id!, e.target.value)}
                      className="px-2 py-0.5 bg-btn-bg border border-btn-border rounded text-[10px] text-text-primary focus:outline-none"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Converted">Converted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <button
                    onClick={handleSaveLeadNotes}
                    disabled={notesSaving}
                    className="px-3 py-1.5 bg-accent text-black font-extrabold text-[10px] uppercase tracking-wider rounded-md hover:opacity-90 flex items-center gap-1 cursor-pointer"
                  >
                    {notesSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Check className="w-3.5 h-3.5" /> Save Notes</>}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-card-border flex items-center justify-between">
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="px-3 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-[10px] font-bold rounded-lg flex items-center gap-1"
                >
                  Connect on WhatsApp
                </a>

                <button
                  onClick={() => triggerDeleteConfirm('lead', selectedLead.id!, selectedLead.name)}
                  className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500 hover:text-black text-red-400 border border-red-500/20 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Lead
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================
          MODAL C: PERMANENT RECORD DELETION CONFIRMATION
          ========================================== */}
      <AnimatePresence>
        {deleteModalConfig.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => setDeleteModalConfig(prev => ({ ...prev, isOpen: false }))}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card-bg border border-red-500/20 rounded-2xl w-full max-w-sm p-5 z-[101] text-center"
            >
              <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-5 h-5 animate-pulse" />
              </div>

              <h3 className="text-sm font-bold font-heading text-text-primary">Confirm Permanent Record Deletion</h3>
              <p className="text-[11px] text-text-tertiary mt-1.5 leading-relaxed">
                Are you sure you want to delete <strong className="text-text-secondary">"{deleteModalConfig.title}"</strong>? This SQL transaction is immediate and completely irreversible.
              </p>

              <div className="grid grid-cols-2 gap-2 mt-5">
                <button
                  onClick={() => setDeleteModalConfig(prev => ({ ...prev, isOpen: false }))}
                  className="py-2 bg-btn-bg hover:bg-btn-hover-bg border border-btn-border text-[10px] font-bold text-text-secondary rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={executeRecordDelete}
                  className="py-2 bg-red-500 text-white font-bold text-[10px] rounded-lg hover:bg-red-600"
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
